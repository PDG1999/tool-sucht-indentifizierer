const { Pool } = require('pg');
require('dotenv').config();

// Support both DATABASE_URL (Coolify) and individual vars (local dev)
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false, // Coolify internal PostgreSQL doesn't use SSL
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'samebi_screening',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      ssl: false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
  console.log(`📦 Database: ${process.env.DATABASE_URL ? 'Using DATABASE_URL' : 'Using individual credentials'}`);
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
  process.exit(-1);
});

// Function to test connection on startup
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    client.release();
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
