/**
 * Neu-Berechnung aller Professional Scores für Tests mit leeren Scores
 * Basierend auf den responses in der Datenbank
 */

const { Pool } = require('pg');

// Importiere Scoring-Logik (muss adaptiert werden für Node.js)
const calculateScores = (responses) => {
  // Definition der Indikatoren für jede Sucht-Kategorie
  const indicators = {
    gambling: ['f1_1', 'f1_2', 'f1_4', 'f1_5', 'f1_6', 'f1_8', 'f1_10', 'f2_1', 'f2_2', 'f2_3', 'f2_4', 'f2_5', 'f2_6', 'f2_8', 'f3_1', 'f3_2', 'f3_3', 'f3_4', 'f4_1', 'f4_3', 'f4_4', 'f4_5'],
    alcohol: ['f5_4', 'f1_1', 'f1_3', 'f1_5', 'f1_6', 'f3_1', 'f3_2', 'f3_3', 'f3_4', 'f4_1', 'f4_3', 'f4_4', 'f4_5', 'f5_1', 'f5_2', 'f5_3'],
    substances: ['f5_4', 'f5_3', 'f1_5', 'f2_1', 'f2_5', 'f3_1', 'f4_3', 'f5_2'],
    shopping: ['f2_1', 'f2_2', 'f2_3', 'f2_4', 'f2_6', 'f2_8', 'f1_1', 'f3_2', 'f3_4', 'f4_1'],
    digital: ['f1_1', 'f1_4', 'f1_7', 'f3_1', 'f3_3', 'f4_2', 'f4_4', 'f5_1']
  };

  // Frage-Thresholds (aus dem Frontend)
  const thresholds = {
    'f1_1': 3, 'f1_2': 3, 'f1_3': 3, 'f1_4': 3, 'f1_5': 3, 'f1_6': 3, 'f1_7': 3, 'f1_8': 3, 'f1_10': 3,
    'f2_1': 3, 'f2_2': 3, 'f2_3': 3, 'f2_4': 3, 'f2_5': 3, 'f2_6': 3, 'f2_8': 3,
    'f3_1': 3, 'f3_2': 3, 'f3_3': 3, 'f3_4': 3, 'f3_5': 3, 'f3_8': 3,
    'f4_1': 3, 'f4_2': 3, 'f4_3': 3, 'f4_4': 3, 'f4_5': 3, 'f4_7': 3, 'f4_8': 3, 'f4_9': 3,
    'f5_1': 3, 'f5_2': 3, 'f5_3': 3, 'f5_4': 3, 'f5_5': 3, 'f5_7': 3
  };

  const addictionTypes = {
    gambling: 'Glücksspiel',
    alcohol: 'Alkohol',
    substances: 'Substanzen',
    shopping: 'Kaufsucht',
    digital: 'Digitale Medien'
  };

  // Berechne Score für jede Kategorie
  const calculateCategoryScore = (questionIds) => {
    let fulfilledIndicators = 0;
    let totalIndicators = questionIds.length;

    questionIds.forEach(questionId => {
      const response = responses.find(r => r.questionId === questionId);
      const threshold = thresholds[questionId] || 3;
      
      if (response && response.answer >= threshold) {
        fulfilledIndicators++;
      }
    });

    return Math.round((fulfilledIndicators / totalIndicators) * 100);
  };

  const gambling = calculateCategoryScore(indicators.gambling);
  const alcohol = calculateCategoryScore(indicators.alcohol);
  const substances = calculateCategoryScore(indicators.substances);
  const shopping = calculateCategoryScore(indicators.shopping);
  const digital = calculateCategoryScore(indicators.digital);

  const overall = Math.round((gambling + alcohol + substances + shopping + digital) / 5);

  // Finde primäre Sorge
  const scores = { gambling, alcohol, substances, shopping, digital };
  const maxScore = Math.max(...Object.values(scores));
  const primaryConcernKey = Object.keys(scores).find(key => scores[key] === maxScore);
  const primaryConcern = maxScore > 40 ? addictionTypes[primaryConcernKey] : 'Keine';

  // Risiko-Level (Deutsch für Display)
  let riskLevelDE = 'Niedrig';
  if (maxScore > 80) riskLevelDE = 'Kritisch';
  else if (maxScore > 60) riskLevelDE = 'Hoch';
  else if (maxScore > 40) riskLevelDE = 'Mittel';

  // Risiko-Level (Englisch für DB)
  let riskLevelEN = 'low';
  if (maxScore > 80) riskLevelEN = 'critical';
  else if (maxScore > 60) riskLevelEN = 'high';
  else if (maxScore > 40) riskLevelEN = 'moderate';

  // Suchtrichtung-Analyse (vereinfacht)
  const substanceBased = Math.round((alcohol + substances) / 2);
  const behavioralBased = Math.round((gambling + shopping + digital) / 3);
  const polyaddiction = Object.values(scores).filter(s => s > 40).length > 1;

  // Primäre Suchtrichtung
  let primaryType = 'Mischform';
  let secondaryType = null;
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  
  if (sortedScores[0][1] > 50) {
    primaryType = addictionTypes[sortedScores[0][0]];
    if (sortedScores[1][1] > 40) {
      secondaryType = addictionTypes[sortedScores[1][0]];
    }
  }

  const addictionDirection = {
    primary: {
      type: primaryType,
      confidence: Math.min(100, sortedScores[0][1] + 10),
      indicators: []
    },
    secondary: secondaryType ? {
      type: secondaryType,
      confidence: Math.min(100, sortedScores[1][1] + 5),
      indicators: []
    } : undefined,
    patterns: {
      substanceBased,
      behavioralBased,
      polyaddiction
    }
  };

  const directionDescription = `${primaryType}${secondaryType ? ' und ' + secondaryType : ''} mit ${polyaddiction ? 'mehreren Problembereichen' : 'fokussierter Problematik'}.`;
  
  const directionRecommendations = [
    riskLevelDE === 'Kritisch' ? 'Sofortige professionelle Hilfe empfohlen' : 'Professionelle Beratung in Erwägung ziehen',
    polyaddiction ? 'Ganzheitlicher Therapieansatz für multiple Suchtproblematiken' : 'Fokussierte Behandlung der Hauptproblematik',
    'Regelmäßige Selbstreflexion und Monitoring'
  ];

  // Kategorie-Details
  const categories = [
    { name: 'Zeitinvestition & Kontrolle', score: gambling, risk: gambling > 60 ? 'Hoch' : gambling > 40 ? 'Mittel' : 'Niedrig' },
    { name: 'Finanzielle Auswirkungen', score: shopping, risk: shopping > 60 ? 'Hoch' : shopping > 40 ? 'Mittel' : 'Niedrig' },
    { name: 'Emotionale Regulation', score: Math.round((alcohol + substances) / 2), risk: Math.round((alcohol + substances) / 2) > 60 ? 'Hoch' : 'Mittel' },
    { name: 'Soziale Beziehungen', score: Math.round((gambling + digital) / 2), risk: Math.round((gambling + digital) / 2) > 60 ? 'Hoch' : 'Mittel' },
    { name: 'Gesundheit & Wohlbefinden', score: substances, risk: substances > 60 ? 'Hoch' : substances > 40 ? 'Mittel' : 'Niedrig' }
  ];

  return {
    gambling,
    alcohol,
    substances,
    shopping,
    digital,
    overall,
    overallRisk: maxScore,
    primaryConcern,
    riskLevel: riskLevelDE, // Deutsch für Display
    riskLevelEN, // Englisch für DB
    consistency: 85, // Placeholder
    confidence: 82, // Placeholder
    addictionDirection,
    directionDescription,
    directionRecommendations,
    categories
  };
};

async function recalculateAllScores() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres'
  });

  try {
    console.log('🔄 Starte Neu-Berechnung aller Professional Scores...\n');

    // Finde alle Tests mit leeren professional_scores
    const result = await pool.query(`
      SELECT id, responses, created_at
      FROM test_results
      WHERE 
        jsonb_typeof(professional_scores) = 'object'
        AND (
          professional_scores = '{}'::jsonb 
          OR NOT (professional_scores ? 'categories')
          OR NOT (professional_scores ? 'addictionDirection')
        )
        AND jsonb_array_length(responses) > 10
      ORDER BY created_at DESC
    `);

    console.log(`📊 Gefunden: ${result.rows.length} Tests mit unvollständigen Scores\n`);

    let updated = 0;
    let failed = 0;

    for (const row of result.rows) {
      try {
        const responses = row.responses;
        
        // Berechne Scores neu
        const newScores = calculateScores(responses);
        
        // Update in Datenbank
        await pool.query(`
          UPDATE test_results
          SET 
            professional_scores = $1,
            public_scores = $2,
            risk_level = $3,
            primary_concern = $4,
            updated_at = NOW()
          WHERE id = $5
        `, [
          JSON.stringify(newScores),
          JSON.stringify({
            overall: newScores.overall,
            categories: newScores.categories
          }),
          newScores.riskLevelEN, // Englisch für DB
          newScores.primaryConcern,
          row.id
        ]);

        updated++;
        console.log(`✅ ${updated}/${result.rows.length} - Test ${row.id.substring(0, 8)}... aktualisiert`);
        
      } catch (error) {
        failed++;
        console.error(`❌ Fehler bei Test ${row.id}:`, error.message);
      }
    }

    console.log(`\n🎉 FERTIG!`);
    console.log(`✅ Erfolgreich: ${updated}`);
    console.log(`❌ Fehlgeschlagen: ${failed}`);

  } catch (error) {
    console.error('💥 Fehler:', error);
  } finally {
    await pool.end();
  }
}

// Ausführen
recalculateAllScores();

