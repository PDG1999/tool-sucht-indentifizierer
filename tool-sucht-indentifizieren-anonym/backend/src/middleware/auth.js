const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Zugriff verweigert. Kein Token bereitgestellt.'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if session is still active in database
    const sessionQuery = `
      SELECT s.*, c.name, c.email, c.role, c.license_number, c.specialization, c.is_active
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

    // Check if counselor is still active
    if (!session.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Konto deaktiviert'
      });
    }

    // Add counselor info to request
    req.user = {
      id: session.counselor_id,
      name: session.name,
      email: session.email,
      role: session.role,
      licenseNumber: session.license_number,
      specialization: session.specialization
    };
    req.counselor = req.user; // Backward compatibility

    next();

  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Ungültiger Token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token abgelaufen'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentifizierungsfehler'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.counselor = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    const sessionQuery = `
      SELECT s.*, c.name, c.email, c.license_number, c.specialization, c.is_active
      FROM sessions s
      JOIN counselors c ON s.counselor_id = c.id
      WHERE s.token = $1 AND s.is_active = true AND s.expires_at > NOW()
    `;
    
    const sessionResult = await pool.query(sessionQuery, [token]);
    
    if (sessionResult.rows.length > 0) {
      const session = sessionResult.rows[0];
      req.counselor = {
        id: session.counselor_id,
        name: session.name,
        email: session.email,
        licenseNumber: session.license_number,
        specialization: session.specialization
      };
    } else {
      req.counselor = null;
    }

    next();

  } catch (error) {
    req.counselor = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};
