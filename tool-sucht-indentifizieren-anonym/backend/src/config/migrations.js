const { pool } = require('./database');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

/**
 * Run database migrations automatically on startup
 */
async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Checking database schema...');
    
    // Check if tables exist
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'counselors'
      );
    `);
    
    const tablesExist = tableCheck.rows[0].exists;
    
    if (!tablesExist) {
      console.log('📦 Tables not found. Creating database schema...');
      
      // Read and execute the main migration file
      const migrationPath = path.join(__dirname, '../migrations/DEPLOY_ALL.sql');
      const migrationSQL = await fs.readFile(migrationPath, 'utf-8');
      
      await client.query(migrationSQL);
      console.log('✅ Database schema created successfully!');
    } else {
      console.log('✅ Database schema already exists.');
    }
    
    // Check if demo accounts exist
    const accountCheck = await client.query(`
      SELECT COUNT(*) as count FROM counselors WHERE email IN ('berater@samebi.net', 'supervisor@samebi.net');
    `);
    
    const accountCount = parseInt(accountCheck.rows[0].count);
    
    if (accountCount === 0) {
      console.log('👥 Creating demo accounts...');
      
      // Hash passwords
      const beraterHash = await bcrypt.hash('Demo2025!', 10);
      const supervisorHash = await bcrypt.hash('Supervisor2025!', 10);
      
      // Insert demo accounts
      await client.query(`
        INSERT INTO counselors (name, email, password_hash, role, is_active, license_number, specialization)
        VALUES 
          ('Demo Berater', 'berater@samebi.net', $1, 'counselor', true, 'DE-12345', ARRAY['Suchtberatung', 'Verhaltenstherapie']),
          ('SAMEBI Supervisor', 'supervisor@samebi.net', $2, 'supervisor', true, 'DE-ADMIN', ARRAY['Supervision', 'System-Admin'])
        ON CONFLICT (email) DO NOTHING;
      `, [beraterHash, supervisorHash]);
      
      console.log('✅ Demo accounts created!');
      console.log('   📧 Berater: berater@samebi.net / Demo2025!');
      console.log('   📧 Supervisor: supervisor@samebi.net / Supervisor2025!');
    } else {
      console.log('✅ Demo accounts already exist.');
    }
    
    console.log('🎉 Database ready!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { runMigrations };

