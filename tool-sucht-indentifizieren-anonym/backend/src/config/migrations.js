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
    
    // Run additional migrations (test_progress table)
    const progressTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'test_progress'
      );
    `);
    const progressTableExists = progressTableCheck.rows[0].exists;

    if (!progressTableExists) {
      console.log('📦 Creating test_progress table...');
      const progressMigrationPath = path.join(__dirname, '../migrations/003_create_test_progress.sql');
      const progressMigrationSQL = await fs.readFile(progressMigrationPath, 'utf-8');
      await client.query(progressMigrationSQL);
      console.log('✅ test_progress table created successfully!');
    } else {
      console.log('✅ test_progress table already exists.');
    }
    
    // Check if tracking columns exist in test_results
    const trackingColumnsCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'test_results' AND column_name = 'tracking_data';
    `);
    const trackingColumnsExist = trackingColumnsCheck.rows.length > 0;

    if (!trackingColumnsExist) {
      console.log('📦 Adding tracking columns to test_results...');
      const trackingMigrationPath = path.join(__dirname, '../migrations/004_add_tracking_columns.sql');
      const trackingMigrationSQL = await fs.readFile(trackingMigrationPath, 'utf-8');
      await client.query(trackingMigrationSQL);
      console.log('✅ Tracking columns added successfully!');
    } else {
      console.log('✅ Tracking columns already exist.');
    }
    
    // Check if demo accounts exist
    const accountCheck = await client.query(`
      SELECT COUNT(*) as count FROM counselors WHERE email IN ('berater@samebi.net', 'supervisor@samebi.net', 'system@samebi.net');
    `);
    
    const accountCount = parseInt(accountCheck.rows[0].count);
    
    if (accountCount < 3) {
      console.log('👥 Creating demo & system accounts...');
      
      // Hash passwords
      const beraterHash = await bcrypt.hash('Demo2025!', 10);
      const supervisorHash = await bcrypt.hash('Supervisor2025!', 10);
      const systemHash = await bcrypt.hash('SYSTEM_ACCOUNT_NO_LOGIN', 10); // Dummy-Hash
      
      // Insert demo accounts + system account
      await client.query(`
        INSERT INTO counselors (name, email, password_hash, role, is_active, license_number, specialization)
        VALUES 
          ('Demo Berater', 'berater@samebi.net', $1, 'counselor', true, 'DE-12345', ARRAY['Suchtberatung', 'Verhaltenstherapie']),
          ('SAMEBI Supervisor', 'supervisor@samebi.net', $2, 'supervisor', true, 'DE-ADMIN', ARRAY['Supervision', 'System-Admin']),
          ('🌐 SAMEBI System (Anonyme Tests)', 'system@samebi.net', $3, 'counselor', false, 'SYSTEM-000', ARRAY['System-Account', 'Anonyme Tests'])
        ON CONFLICT (email) DO NOTHING;
      `, [beraterHash, supervisorHash, systemHash]);
      
      console.log('✅ Demo & System accounts created!');
      console.log('   📧 Berater: berater@samebi.net / Demo2025!');
      console.log('   📧 Supervisor: supervisor@samebi.net / Supervisor2025!');
      console.log('   🤖 System: system@samebi.net (INAKTIV - nur für anonyme Tests)');
    } else {
      console.log('✅ Demo & System accounts already exist.');
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

