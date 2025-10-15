#!/usr/bin/env node

const { Pool } = require('pg');

const DATABASE_URL = 'postgres://postgres:T7ukRHlBtQ3yI0HfO38U8U5bBobThd5Cp90jPHstKO0x2OcTotZ9M9smMTzKtlFh@nsgccoc4scg8g444c400c840:5432/postgres';

const pool = new Pool({ connectionString: DATABASE_URL });

const categoryMapping = {
  'f1_': 'Zeitmanagement & Prioritäten',
  'f2_': 'Finanzielle Auswirkungen',
  'f3_': 'Emotionale Regulation',
  'f4_': 'Soziale Beziehungen',
  'f5_': 'Gesundheit & Wohlbefinden'
};

async function fixCategoryScores() {
  console.log('\n🔧 Berechne Kategorie-Scores für wiederhergestellte Tests\n');
  
  try {
    // Hole alle wiederhergestellten Tests
    const result = await pool.query(`
      SELECT id, responses, TO_CHAR(created_at, 'DD.MM HH24:MI') as datum
      FROM test_results
      WHERE session_data->'recoveredFrom' IS NOT NULL
    `);
    
    console.log(`Gefunden: ${result.rows.length} Tests\n`);
    
    for (const test of result.rows) {
      const responses = test.responses;
      
      // Gruppiere Antworten nach Kategorie
      const categories = {};
      Object.keys(categoryMapping).forEach(prefix => {
        categories[prefix] = [];
      });
      
      responses.forEach(r => {
        const prefix = r.questionId.substring(0, 3);
        if (categories[prefix]) {
          categories[prefix].push(r.value);
        }
      });
      
      // Berechne Scores pro Kategorie
      const categoryScores = [];
      let totalScore = 0;
      let totalCount = 0;
      
      Object.entries(categoryMapping).forEach(([prefix, name]) => {
        const vals = categories[prefix];
        if (vals.length > 0) {
          const avg = vals.reduce((sum, v) => sum + v, 0) / vals.length;
          const score = Math.round(avg * 25);
          
          let risk = 'Minimal';
          if (avg >= 3) risk = 'Hoch';
          else if (avg >= 2) risk = 'Mittel';
          else if (avg >= 1) risk = 'Niedrig';
          
          categoryScores.push({ name, score, risk });
          totalScore += avg;
          totalCount++;
        }
      });
      
      const overallAvg = totalCount > 0 ? totalScore / totalCount : 0;
      const publicOverall = Math.round(overallAvg * 20);
      const proOverall = Math.round(overallAvg * 25);
      
      // Update Datenbank
      await pool.query(`
        UPDATE test_results
        SET 
          public_scores = $1,
          professional_scores = $2
        WHERE id = $3
      `, [
        JSON.stringify({
          overall: publicOverall,
          categories: categoryScores
        }),
        JSON.stringify({
          overall: proOverall,
          overallRisk: proOverall,
          categories: categoryScores
        }),
        test.id
      ]);
      
      console.log(`✅ ${test.datum} - Score: ${publicOverall} - Kategorien: ${categoryScores.length}`);
    }
    
    console.log(`\n✨ ${result.rows.length} Tests aktualisiert!\n`);
    
  } catch (error) {
    console.error('❌ Fehler:', error.message);
  } finally {
    await pool.end();
  }
}

fixCategoryScores();

