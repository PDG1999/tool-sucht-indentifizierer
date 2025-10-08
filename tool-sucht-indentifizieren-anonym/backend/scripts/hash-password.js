#!/usr/bin/env node
/**
 * Script to hash passwords for SAMEBI counselor accounts
 * Usage: node hash-password.js <password>
 */

const bcrypt = require('bcrypt');

async function hashPassword(password) {
  if (!password) {
    console.error('❌ Error: No password provided!');
    console.log('\nUsage: node hash-password.js <password>');
    console.log('Example: node hash-password.js MySecurePassword123!');
    process.exit(1);
  }

  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Password hashed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nOriginal Password:', password);
    console.log('\nHashed Password:');
    console.log(hash);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Use this hash in your SQL INSERT statement:');
    console.log(`\nINSERT INTO counselors (name, email, password_hash, role, is_active, license_number, specialization)`);
    console.log(`VALUES (`);
    console.log(`    'Your Name',`);
    console.log(`    'your.email@example.com',`);
    console.log(`    '${hash}',`);
    console.log(`    'counselor',`);
    console.log(`    true,`);
    console.log(`    'DE-12345',`);
    console.log(`    ARRAY['Suchtberatung']`);
    console.log(`);\n`);
  } catch (error) {
    console.error('❌ Error hashing password:', error);
    process.exit(1);
  }
}

// Get password from command line argument
const password = process.argv[2];
hashPassword(password);




