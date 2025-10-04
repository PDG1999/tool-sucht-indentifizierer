const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const pool = require('../config/database');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  licenseNumber: Joi.string().optional(),
  specialization: Joi.array().items(Joi.string()).optional(),
});

// Login endpoint
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Ungültige Eingabedaten',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { email, password } = value;

    // Find counselor by email
    const counselorQuery = 'SELECT * FROM counselors WHERE email = $1 AND is_active = true';
    const counselorResult = await pool.query(counselorQuery, [email]);
    
    if (counselorResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Ungültige Anmeldedaten'
      });
    }

    const counselor = counselorResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, counselor.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Ungültige Anmeldedaten'
      });
    }

    // Update last login
    await pool.query(
      'UPDATE counselors SET last_login_at = NOW() WHERE id = $1',
      [counselor.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        counselorId: counselor.id, 
        email: counselor.email,
        name: counselor.name
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Store session
    await pool.query(
      'INSERT INTO sessions (counselor_id, token, expires_at) VALUES ($1, $2, $3)',
      [counselor.id, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );

    res.json({
      success: true,
      message: 'Erfolgreich angemeldet',
      data: {
        token,
        counselor: {
          id: counselor.id,
          name: counselor.name,
          email: counselor.email,
          licenseNumber: counselor.license_number,
          specialization: counselor.specialization
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Interner Serverfehler'
    });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Ungültige Eingabedaten',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { name, email, password, licenseNumber, specialization } = value;

    // Check if email already exists
    const existingCounselor = await pool.query(
      'SELECT id FROM counselors WHERE email = $1',
      [email]
    );

    if (existingCounselor.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'E-Mail-Adresse bereits registriert'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create counselor
    const insertQuery = `
      INSERT INTO counselors (name, email, password_hash, license_number, specialization)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, license_number, specialization, created_at
    `;

    const result = await pool.query(insertQuery, [
      name, email, passwordHash, licenseNumber, specialization || []
    ]);

    const counselor = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Berater erfolgreich registriert',
      data: {
        counselor: {
          id: counselor.id,
          name: counselor.name,
          email: counselor.email,
          licenseNumber: counselor.license_number,
          specialization: counselor.specialization,
          createdAt: counselor.created_at
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Interner Serverfehler'
    });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Deactivate session
      await pool.query(
        'UPDATE sessions SET is_active = false WHERE token = $1',
        [token]
      );
    }

    res.json({
      success: true,
      message: 'Erfolgreich abgemeldet'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Interner Serverfehler'
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Kein Token bereitgestellt'
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if session is still active
    const sessionQuery = `
      SELECT s.*, c.name, c.email, c.license_number, c.specialization
      FROM sessions s
      JOIN counselors c ON s.counselor_id = c.id
      WHERE s.token = $1 AND s.is_active = true AND s.expires_at > NOW()
    `;
    
    const sessionResult = await pool.query(sessionQuery, [token]);
    
    if (sessionResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Ungültiger oder abgelaufener Token'
      });
    }

    const session = sessionResult.rows[0];

    res.json({
      success: true,
      data: {
        counselor: {
          id: session.counselor_id,
          name: session.name,
          email: session.email,
          licenseNumber: session.license_number,
          specialization: session.specialization
        }
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Ungültiger Token'
    });
  }
});

module.exports = router;
