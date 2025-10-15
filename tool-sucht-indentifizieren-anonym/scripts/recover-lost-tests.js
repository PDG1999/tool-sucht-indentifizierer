#!/usr/bin/env node

/**
 * ⚠️ EMERGENCY RECOVERY SCRIPT
 * 
 * Stellt verlorene Tests aus der test_progress Tabelle wieder her
 * und speichert sie in test_results
 * 
 * VERWENDUNG:
 * node scripts/recover-lost-tests.js
 */

const { Pool } = require('pg');

// Datenbank-Konfiguration aus Environment
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:T7ukRHlBtQ3yI0HfO38U8U5bBobThd5Cp90jPHstKO0x2OcTotZ9M9smMTzKtlFh@nsgccoc4scg8g444c400c840:5432/postgres';

const pool = new Pool({
  connectionString: DATABASE_URL
});

// Scoring-Funktionen (vereinfacht - aus dem Frontend kopiert)
function calculateScores(responses) {
  if (!responses || responses.length === 0) {
    return {
      publicScores: { overall: 0 },
      professionalScores: { overall: 0 },
      riskLevel: 'low',
      primaryConcern: 'Unvollständig'
    };
  }

  // Berechne Durchschnitt der Antworten
  const sum = responses.reduce((acc, r) => acc + (r.answer || 0), 0);
  const avg = sum / responses.length;
  
  // Risiko-Level basierend auf Durchschnitt
  let riskLevel = 'low';
  if (avg >= 3.5) riskLevel = 'critical';
  else if (avg >= 2.5) riskLevel = 'high';
  else if (avg >= 1.5) riskLevel = 'moderate';
  
  // Finde häufigste Kategorie
  const categories = {};
  responses.forEach(r => {
    const cat = r.category || 'Allgemein';
    categories[cat] = (categories[cat] || 0) + (r.answer || 0);
  });
  
  const primaryConcern = Object.keys(categories).reduce((a, b) => 
    categories[a] > categories[b] ? a : b, 'Allgemein'
  );
  
  return {
    publicScores: { 
      overall: Math.round(avg * 20),
      categories: categories 
    },
    professionalScores: { 
      overall: Math.round(avg * 25),
      detailedAnalysis: categories 
    },
    riskLevel,
    primaryConcern
  };
}

async function recoverTests() {
  console.log('\n🔄 SAMEBI Test Recovery Script\n');
  console.log('═'.repeat(60));
  
  try {
    // 1. Finde alle test_progress Einträge die nicht in test_results sind
    console.log('\n📊 Analysiere test_progress Tabelle...\n');
    
    const progressResult = await pool.query(`
      SELECT 
        tp.id,
        tp.session_id,
        tp.responses,
        tp.current_question,
        tp.test_type,
        tp.created_at,
        tp.updated_at
      FROM test_progress tp
      WHERE tp.current_question >= 25  -- Nur Tests mit mindestens 25 Fragen
      ORDER BY tp.updated_at DESC
    `);
    
    console.log(`Gefundene wiederherstellbare Tests: ${progressResult.rows.length}\n`);
    
    if (progressResult.rows.length === 0) {
      console.log('✅ Keine Tests zur Wiederherstellung gefunden.\n');
      return;
    }
    
    // 2. Finde System-Account ID
    const systemAccountQuery = await pool.query(
      "SELECT id FROM counselors WHERE email = 'system@samebi.net' LIMIT 1"
    );
    const systemCounselorId = systemAccountQuery.rows[0]?.id;
    
    if (!systemCounselorId) {
      console.error('❌ System-Account nicht gefunden! Bitte erst CREATE_SYSTEM_ACCOUNT.sql ausführen.\n');
      return;
    }
    
    console.log(`✅ System-Account gefunden: ${systemCounselorId}\n`);
    console.log('─'.repeat(60));
    
    let recovered = 0;
    let skipped = 0;
    
    // 3. Verarbeite jeden Test
    for (const test of progressResult.rows) {
      try {
        const responses = typeof test.responses === 'string' 
          ? JSON.parse(test.responses) 
          : test.responses;
        
        console.log(`\n📝 Test vom ${test.updated_at.toLocaleString('de-DE')}`);
        console.log(`   Fragen: ${test.current_question + 1}/40`);
        console.log(`   Session: ${test.session_id}`);
        
        // Berechne Scores
        const { publicScores, professionalScores, riskLevel, primaryConcern } = calculateScores(responses);
        
        console.log(`   Risiko: ${riskLevel}`);
        console.log(`   Hauptproblem: ${primaryConcern}`);
        
        // Prüfe ob schon in test_results (via session_data)
        const existingTest = await pool.query(
          `SELECT id FROM test_results WHERE session_data->>'sessionId' = $1`,
          [test.session_id]
        );
        
        if (existingTest.rows.length > 0) {
          console.log('   ⏭️  Test bereits wiederhergestellt, überspringe.');
          skipped++;
          continue;
        }
        
        // Erstelle Client (anonym)
        const clientResult = await pool.query(
          `INSERT INTO clients (name, email, counselor_id, status, created_at, updated_at)
           VALUES ($1, $2, $3, 'active', NOW(), NOW())
           RETURNING id`,
          [`Wiederhergestellter Test ${test.updated_at.toLocaleDateString('de-DE')}`, null, systemCounselorId]
        );
        const clientId = clientResult.rows[0].id;
        
        // Speichere in test_results
        await pool.query(`
          INSERT INTO test_results (
            client_id,
            counselor_id,
            responses,
            public_scores,
            professional_scores,
            risk_level,
            primary_concern,
            follow_up_required,
            aborted,
            completed_questions,
            session_data,
            created_at,
            completed_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          clientId,
          systemCounselorId,
          JSON.stringify(responses),
          JSON.stringify(publicScores),
          JSON.stringify(professionalScores),
          riskLevel,
          primaryConcern,
          riskLevel === 'high' || riskLevel === 'critical',
          test.current_question < 39, // Aborted wenn nicht alle Fragen
          responses.length,
          JSON.stringify({ 
            sessionId: test.session_id, 
            recoveredFrom: 'test_progress',
            originalDate: test.updated_at 
          }),
          test.created_at,
          test.updated_at
        ]);
        
        console.log('   ✅ Erfolgreich wiederhergestellt!');
        recovered++;
        
      } catch (error) {
        console.error(`   ❌ Fehler beim Wiederherstellen:`, error.message);
      }
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log(`\n📊 ZUSAMMENFASSUNG:`);
    console.log(`   ✅ Wiederhergestellt: ${recovered}`);
    console.log(`   ⏭️  Übersprungen: ${skipped}`);
    console.log(`   ❌ Fehler: ${progressResult.rows.length - recovered - skipped}`);
    console.log('\n✨ Recovery abgeschlossen!\n');
    
  } catch (error) {
    console.error('\n❌ FEHLER:', error);
  } finally {
    await pool.end();
  }
}

// Führe Recovery aus
recoverTests();

