const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const winston = require('winston');
require('dotenv').config();

// ============================================================================
// LOGGING SETUP
// ============================================================================
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// ============================================================================
// DATABASE SETUP
// ============================================================================
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('Unexpected database error', { error: err.message });
});

// ============================================================================
// EXPRESS APP SETUP
// ============================================================================
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

if (!JWT_SECRET) {
  logger.error('JWT_SECRET environment variable is required!');
  process.exit(1);
}

// Middleware
app.set('trust proxy', true); // Trust Traefik/Coolify proxy
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Request logging
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'healthy',
      service: 'samebi-auth',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      status: 'unhealthy',
      error: 'Database connection failed'
    });
  }
});

// ============================================================================
// LOGIN ENDPOINT
// ============================================================================
app.post('/auth/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }

  try {
    // Find counselor in database
    const result = await pool.query(
      `SELECT id, email, password_hash, role, name, is_active, last_login_at
       FROM api.counselors 
       WHERE email = $1 AND is_active = true`,
      [email]
    );

    if (result.rows.length === 0) {
      logger.warn('Login attempt with invalid email', { email });
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const counselor = result.rows[0];

    // Verify password
    const passwordValid = await bcrypt.compare(password, counselor.password_hash);
    
    if (!passwordValid) {
      logger.warn('Login attempt with invalid password', { email });
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Update last login
    await pool.query(
      'UPDATE api.counselors SET last_login_at = NOW() WHERE id = $1',
      [counselor.id]
    );

    // Generate JWT token
    const payload = {
      role: counselor.role,
      user_id: counselor.id,
      email: counselor.email,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      algorithm: 'HS256'
    });

    logger.info('Successful login', {
      user_id: counselor.id,
      email: counselor.email,
      role: counselor.role
    });

    // Return token
    res.json({
      token,
      user: {
        id: counselor.id,
        email: counselor.email,
        name: counselor.name,
        role: counselor.role
      }
    });

  } catch (error) {
    logger.error('Login error', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// ============================================================================
// VERIFY TOKEN ENDPOINT
// ============================================================================
app.post('/auth/verify', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'No token provided'
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      valid: true,
      payload: decoded
    });
  } catch (error) {
    logger.warn('Invalid token verification attempt', {
      error: error.message
    });
    res.status(401).json({
      valid: false,
      error: error.message
    });
  }
});

// ============================================================================
// REGISTER ENDPOINT (for future use)
// ============================================================================
app.post('/auth/register', async (req, res) => {
  const { email, password, name, practiceName } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      error: 'Email, password, and name are required'
    });
  }

  try {
    // Check if user exists
    const existing = await pool.query(
      'SELECT id FROM api.counselors WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: 'Email already registered'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert new counselor
    const result = await pool.query(
      `INSERT INTO api.counselors (email, password_hash, name, practice_name, role, is_active)
       VALUES ($1, $2, $3, $4, 'counselor', true)
       RETURNING id, email, name, role`,
      [email, passwordHash, name, practiceName || null]
    );

    const counselor = result.rows[0];

    logger.info('New counselor registered', {
      user_id: counselor.id,
      email: counselor.email
    });

    res.status(201).json({
      message: 'Registration successful',
      user: counselor
    });

  } catch (error) {
    logger.error('Registration error', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// ============================================================================
// PASSWORD RESET REQUEST (for future use)
// ============================================================================
app.post('/auth/password-reset-request', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      error: 'Email is required'
    });
  }

  // TODO: Implement password reset logic
  // - Generate reset token
  // - Store in database with expiry
  // - Send email with reset link

  res.json({
    message: 'If the email exists, a password reset link has been sent'
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack
  });
  
  res.status(500).json({
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// ============================================================================
// START SERVER
// ============================================================================
app.listen(PORT, () => {
  logger.info(`🔐 SAMEBI Auth Service started`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    jwt_expiry: JWT_EXPIRY
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

module.exports = app; // for testing

