const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');
const Client = require('../models/Client');
const { authenticateToken } = require('../middleware/auth');

// Get all test results for a counselor (or ALL for supervisor)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // If user is supervisor, return ALL test results
    if (req.user.role === 'supervisor') {
      const { pool } = require('../config/database');
      const result = await pool.query(`
        SELECT 
          tr.*,
          c.name as client_name,
          c.email as client_email,
          co.name as counselor_name,
          co.email as counselor_email
        FROM test_results tr
        LEFT JOIN clients c ON tr.client_id = c.id
        LEFT JOIN counselors co ON tr.counselor_id = co.id
        ORDER BY tr.created_at DESC
      `);
      return res.json(result.rows);
    }
    
    // Otherwise, return only tests for this counselor
    const testResults = await TestResult.getAllByCounselor(req.user.id);
    res.json(testResults);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all test results for a specific client
router.get('/client/:clientId', authenticateToken, async (req, res) => {
  try {
    const client = await Client.getById(req.params.clientId);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Check if client belongs to counselor
    if (client.counselor_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const testResults = await TestResult.getAllByClient(req.params.clientId);
    res.json(testResults);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single test result
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const testResult = await TestResult.getById(req.params.id);
    
    if (!testResult) {
      return res.status(404).json({ error: 'Test result not found' });
    }
    
    // Check if test result belongs to counselor OR user is supervisor
    if (req.user.role !== 'supervisor' && testResult.counselor_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(testResult);
  } catch (error) {
    console.error('Error fetching test result:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save intermediate test progress (public endpoint - no auth required)
router.post('/save-progress', async (req, res) => {
  try {
    const { 
      sessionId,
      responses, 
      currentQuestion,
      testType
    } = req.body;
    
    if (!sessionId || !responses) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Store in database with session_id for retrieval
    const { pool } = require('../config/database');
    
    // Check if progress already exists
    const existingProgress = await pool.query(
      'SELECT id FROM test_progress WHERE session_id = $1',
      [sessionId]
    );
    
    if (existingProgress.rows.length > 0) {
      // Update existing progress
      await pool.query(
        `UPDATE test_progress 
         SET responses = $1, current_question = $2, test_type = $3, updated_at = NOW()
         WHERE session_id = $4`,
        [JSON.stringify(responses), currentQuestion, testType, sessionId]
      );
    } else {
      // Insert new progress
      await pool.query(
        `INSERT INTO test_progress (session_id, responses, current_question, test_type, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [sessionId, JSON.stringify(responses), currentQuestion, testType]
      );
    }
    
    res.status(200).json({
      success: true,
      message: 'Progress saved',
      sessionId: sessionId
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    // Don't fail the test if saving fails - just log it
    res.status(200).json({
      success: false,
      message: 'Progress save failed, but test can continue'
    });
  }
});

// Get saved progress (public endpoint - no auth required)
router.get('/progress/:sessionId', async (req, res) => {
  try {
    const { pool } = require('../config/database');
    const result = await pool.query(
      'SELECT * FROM test_progress WHERE session_id = $1',
      [req.params.sessionId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No saved progress found' });
    }
    
    const progress = result.rows[0];
    res.json({
      sessionId: progress.session_id,
      responses: progress.responses,
      currentQuestion: progress.current_question,
      testType: progress.test_type,
      savedAt: progress.updated_at
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new test result (public endpoint - no auth required)
router.post('/submit', async (req, res) => {
  try {
    const { 
      clientEmail, 
      clientName,
      responses, 
      publicScores, 
      professionalScores,
      riskLevel,
      primaryConcern,
      aborted,
      abortedAtQuestion,
      completedQuestions,
      sessionData,
      trackingData
    } = req.body;
    
    if (!responses || !publicScores || !professionalScores) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    console.log('📊 Test submission received:', {
      responses: responses.length,
      aborted: aborted || false,
      abortedAtQuestion,
      completedQuestions,
      hasTracking: !!trackingData,
      city: trackingData?.geoData?.city,
      device: trackingData?.deviceData?.deviceType
    });
    
    // Get system account ID for anonymous tests
    const { pool } = require('../config/database');
    const systemAccountQuery = await pool.query(
      "SELECT id FROM counselors WHERE email = 'system@samebi.net' LIMIT 1"
    );
    const systemCounselorId = systemAccountQuery.rows[0]?.id || null;
    
    // Check if client exists by email, create if not
    let client;
    if (clientEmail) {
      client = await Client.getByEmail(clientEmail);
    }
    
    if (!client && clientEmail) {
      // Create anonymous client assigned to system account
      client = await Client.create({
        name: clientName || 'Anonymer Test',
        email: clientEmail,
        counselor_id: systemCounselorId, // Assign to system account
        status: 'active'
      });
    }
    
    // Prepare tracking data for database
    const trackingDataForDB = trackingData ? {
      browser_fingerprint: trackingData.browserFingerprint,
      ip_address: trackingData.geoData?.ip,
      user_agent: trackingData.deviceData?.userAgent,
      geo_data: trackingData.geoData ? {
        city: trackingData.geoData.city,
        region: trackingData.geoData.region,
        country: trackingData.geoData.country,
        countryCode: trackingData.geoData.countryCode,
        latitude: trackingData.geoData.latitude,
        longitude: trackingData.geoData.longitude,
        timezone: trackingData.geoData.timezone,
        isp: trackingData.geoData.isp
      } : null,
      device_type: trackingData.deviceData?.deviceType,
      browser: trackingData.deviceData?.browser,
      browser_version: trackingData.deviceData?.browserVersion,
      os: trackingData.deviceData?.os,
      os_version: trackingData.deviceData?.osVersion,
      screen_resolution: trackingData.deviceData?.screenResolution,
      language: trackingData.deviceData?.language,
      referrer: trackingData.referrer
    } : null;

    const testResult = await TestResult.create({
      clientId: client ? client.id : null,
      counselorId: systemCounselorId,
      responses: responses,
      publicScores: publicScores,
      professionalScores: professionalScores,
      riskLevel: riskLevel,
      primaryConcern: primaryConcern,
      followUpRequired: riskLevel === 'high' || riskLevel === 'critical',
      aborted: aborted || false,
      abortedAtQuestion: abortedAtQuestion || null,
      completedQuestions: completedQuestions || responses.length,
      sessionData: sessionData || null,
      trackingData: trackingDataForDB
    });
    
    res.status(201).json({
      success: true,
      testResultId: testResult.id,
      publicScores: publicScores
    });
  } catch (error) {
    console.error('Error creating test result:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update test result (add notes, follow-up info)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { sessionNotes, followUpRequired, followUpDate } = req.body;
    
    const testResult = await TestResult.getById(req.params.id);
    
    if (!testResult) {
      return res.status(404).json({ error: 'Test result not found' });
    }
    
    // Check if test result belongs to counselor OR user is supervisor
    if (req.user.role !== 'supervisor' && testResult.counselor_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updatedTestResult = await TestResult.update(req.params.id, {
      session_notes: sessionNotes,
      follow_up_required: followUpRequired,
      follow_up_date: followUpDate
    });
    
    res.json(updatedTestResult);
  } catch (error) {
    console.error('Error updating test result:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Assign test result to counselor
router.post('/:id/assign', authenticateToken, async (req, res) => {
  try {
    // Only counselors and supervisors can assign tests
    if (req.user.role !== 'counselor' && req.user.role !== 'supervisor') {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    
    const testResult = await TestResult.getById(req.params.id);
    
    if (!testResult) {
      return res.status(404).json({ error: 'Test result not found' });
    }
    
    // Assign to counselor
    const updatedTestResult = await TestResult.assignToCounselor(
      req.params.id,
      req.user.id
    );
    
    // Also assign client if exists
    if (testResult.client_id) {
      await Client.update(testResult.client_id, {
        counselor_id: req.user.id
      });
    }
    
    res.json(updatedTestResult);
  } catch (error) {
    console.error('Error assigning test result:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/stats/dashboard', authenticateToken, async (req, res) => {
  try {
    const stats = await TestResult.getDashboardStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

