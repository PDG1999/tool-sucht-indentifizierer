#!/usr/bin/env node
/**
 * Interactive script to create new counselor accounts
 * Usage: node create-counselor.js
 */

const bcrypt = require('bcrypt');
const readline = require('readline');
const { pool } = require('../src/config/database');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createCounselor() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 SAMEBI Berater-Konto erstellen');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Collect information
    const name = await question('👤 Name (z.B. Dr. Max Mustermann): ');
    const email = await question('📧 E-Mail: ');
    const password = await question('🔐 Passwort: ');
    const roleInput = await question('👔 Rolle (counselor/supervisor) [counselor]: ');
    const role = roleInput.toLowerCase() || 'counselor';
    const licenseNumber = await question('🆔 Lizenz-Nummer (z.B. DE-12345): ');
    const specializationInput = await question('🎯 Fachgebiete (komma-getrennt, z.B. Suchtberatung,Familientherapie): ');
    
    const specialization = specializationInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 Zusammenfassung:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name: ${name}`);
    console.log(`E-Mail: ${email}`);
    console.log(`Rolle: ${role}`);
    console.log(`Lizenz: ${licenseNumber}`);
    console.log(`Fachgebiete: ${specialization.join(', ')}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const confirm = await question('✅ Konto erstellen? (ja/nein): ');
    
    if (confirm.toLowerCase() !== 'ja' && confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'j') {
      console.log('\n❌ Abgebrochen.');
      rl.close();
      process.exit(0);
    }

    // Hash password
    console.log('\n🔐 Hashe Passwort...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert into database
    console.log('💾 Speichere in Datenbank...');
    const query = `
      INSERT INTO counselors (name, email, password_hash, role, is_active, license_number, specialization)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, email, role
    `;
    
    const values = [
      name,
      email,
      passwordHash,
      role,
      true, // is_active
      licenseNumber,
      specialization
    ];

    const result = await pool.query(query, values);
    const counselor = result.rows[0];

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Berater-Konto erfolgreich erstellt!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`ID: ${counselor.id}`);
    console.log(`Name: ${counselor.name}`);
    console.log(`E-Mail: ${counselor.email}`);
    console.log(`Rolle: ${counselor.role}`);
    console.log('\n🔗 Login-URL: https://dashboard.samebi.net/dashboard');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Fehler beim Erstellen des Kontos:', error.message);
    if (error.code === '23505') {
      console.error('   → E-Mail-Adresse existiert bereits!');
    }
  } finally {
    rl.close();
    await pool.end();
  }
}

// Check if database connection works
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('❌ Datenbankverbindung fehlgeschlagen:', err.message);
    console.error('   → Stelle sicher, dass die .env Datei korrekt konfiguriert ist.');
    process.exit(1);
  }
  createCounselor();
});




