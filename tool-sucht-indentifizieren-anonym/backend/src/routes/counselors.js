const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all counselors (supervisor only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Only supervisors can see all counselors
    if (req.user.role !== 'supervisor') {
      return res.status(403).json({ error: 'Access denied. Supervisor role required.' });
    }

    const result = await pool.query(`
      SELECT 
        id,
        name,
        email,
        role,
        is_active,
        license_number,
        specialization,
        created_at
      FROM counselors
      ORDER BY name ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching counselors:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get counselor statistics (supervisor only)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'supervisor') {
      return res.status(403).json({ error: 'Access denied. Supervisor role required.' });
    }

    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.email,
        COUNT(DISTINCT cl.id) as total_clients,
        COUNT(DISTINCT tr.id) as total_tests,
        COUNT(DISTINCT CASE WHEN tr.risk_level = 'Kritisch' THEN tr.id END) as critical_tests,
        AVG(CASE WHEN NOT tr.aborted THEN tr.test_duration END) as avg_test_duration
      FROM counselors c
      LEFT JOIN clients cl ON cl.counselor_id = c.id
      LEFT JOIN test_results tr ON tr.counselor_id = c.id
      WHERE c.role = 'counselor'
      GROUP BY c.id, c.name, c.email
      ORDER BY total_tests DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching counselor stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;



