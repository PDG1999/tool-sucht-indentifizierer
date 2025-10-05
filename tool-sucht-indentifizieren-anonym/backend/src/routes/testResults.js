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
    
    // Check if test result belongs to counselor
    if (testResult.counselor_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(testResult);
  } catch (error) {
    console.error('Error fetching test result:', error);
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
      primaryConcern
    } = req.body;
    
    if (!responses || !publicScores || !professionalScores) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
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
    
    const testResult = await TestResult.create({
      client_id: client ? client.id : null,
      counselor_id: systemCounselorId, // Assign to system account for anonymous tests
      responses: JSON.stringify(responses),
      public_scores: JSON.stringify(publicScores),
      professional_scores: JSON.stringify(professionalScores),
      risk_level: riskLevel,
      primary_concern: primaryConcern,
      follow_up_required: riskLevel === 'hoch' || riskLevel === 'kritisch'
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
    
    // Check if test result belongs to counselor
    if (testResult.counselor_id !== req.user.id) {
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

