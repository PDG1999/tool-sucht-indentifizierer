#!/bin/bash

# ⚡ FIX RECOVERED TESTS - Richtige Auswertung
# Berechnet Scores und Kategorien für wiederhergestellte Tests

echo ""
echo "⚡ SAMEBI: Wiederhergestellte Tests neu auswerten"
echo "═══════════════════════════════════════════════════════════"
echo ""

DB_CONTAINER="nsgccoc4scg8g444c400c840"

docker exec $DB_CONTAINER psql -U postgres -d postgres << 'EOF'

-- Mapping von questionId Prefix zu Kategorie-Namen
CREATE TEMP TABLE category_mapping AS
SELECT * FROM (VALUES
  ('f1_', 'Zeitmanagement & Prioritäten', 'time'),
  ('f2_', 'Finanzielle Auswirkungen', 'finance'),
  ('f3_', 'Emotionale Regulation', 'emotion'),
  ('f4_', 'Soziale Beziehungen', 'social'),
  ('f5_', 'Gesundheit & Wohlbefinden', 'health')
) AS t(prefix, category_name, category_id);

-- Update jeden wiederhergestellten Test
DO $$
DECLARE
  v_test RECORD;
  v_responses JSONB;
  v_total_score NUMERIC;
  v_category_scores JSONB;
  v_primary_concern TEXT;
  v_max_score NUMERIC;
  v_risk_level TEXT;
  v_public_score INT;
  v_pro_score INT;
  v_count INT := 0;
BEGIN
  RAISE NOTICE '📊 Berechne Scores neu für wiederhergestellte Tests...';
  RAISE NOTICE '';
  
  FOR v_test IN 
    SELECT id, responses 
    FROM test_results 
    WHERE primary_concern = 'Wiederhergestellt'
  LOOP
    v_responses := v_test.responses;
    
    -- Berechne Gesamt-Score und Kategorie-Scores
    WITH answer_data AS (
      SELECT 
        SUBSTRING((resp->>'questionId')::text FROM 1 FOR 3) as prefix,
        (resp->>'value')::numeric as score
      FROM jsonb_array_elements(v_responses) resp
      WHERE resp->>'value' IS NOT NULL
    ),
    category_scores AS (
      SELECT 
        cm.category_name,
        cm.category_id,
        COUNT(*) as question_count,
        SUM(ad.score) as category_total,
        AVG(ad.score) as category_avg,
        MAX(ad.score) as max_answer
      FROM answer_data ad
      JOIN category_mapping cm ON ad.prefix = cm.prefix
      GROUP BY cm.category_name, cm.category_id
    )
    SELECT 
      jsonb_object_agg(
        category_name,
        jsonb_build_object(
          'score', ROUND(category_avg * 25)::int,
          'answers', category_total,
          'questions', question_count,
          'average', ROUND(category_avg, 2)
        )
      ),
      AVG(category_avg),
      (SELECT category_name FROM category_scores ORDER BY category_avg DESC LIMIT 1),
      (SELECT category_avg FROM category_scores ORDER BY category_avg DESC LIMIT 1)
    INTO v_category_scores, v_total_score, v_primary_concern, v_max_score
    FROM category_scores;
    
    -- Risiko-Level berechnen
    v_risk_level := CASE 
      WHEN v_total_score >= 3.5 THEN 'critical'
      WHEN v_total_score >= 2.5 THEN 'high'
      WHEN v_total_score >= 1.5 THEN 'moderate'
      ELSE 'low'
    END;
    
    -- Public Score (0-100)
    v_public_score := ROUND(v_total_score * 20)::int;
    
    -- Professional Score (0-100)
    v_pro_score := ROUND(v_total_score * 25)::int;
    
    -- Update Test-Result
    UPDATE test_results
    SET 
      public_scores = jsonb_build_object(
        'overall', v_public_score,
        'categories', v_category_scores
      ),
      professional_scores = jsonb_build_object(
        'overall', v_pro_score,
        'overallRisk', v_pro_score,
        'categories', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'name', key,
              'score', (value->>'score')::int,
              'risk', CASE 
                WHEN (value->>'average')::numeric >= 3 THEN 'Hoch'
                WHEN (value->>'average')::numeric >= 2 THEN 'Mittel'
                WHEN (value->>'average')::numeric >= 1 THEN 'Niedrig'
                ELSE 'Minimal'
              END
            )
          )
          FROM jsonb_each(v_category_scores)
        )
      ),
      risk_level = v_risk_level,
      primary_concern = v_primary_concern,
      follow_up_required = v_risk_level IN ('high', 'critical')
    WHERE id = v_test.id;
    
    v_count := v_count + 1;
    
    RAISE NOTICE '✅ Test % - Score: % - Risiko: % - Hauptkategorie: %',
      TO_CHAR(v_test.id, 'FM00000000'),
      v_public_score,
      v_risk_level,
      v_primary_concern;
      
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '═════════════════════════════════════════════════════════';
  RAISE NOTICE '✨ % Tests neu ausgewertet', v_count;
  RAISE NOTICE '';
  
END $$;

-- Zeige Ergebnis
SELECT 
  TO_CHAR(created_at, 'DD.MM HH24:MI') as datum,
  primary_concern as hauptkategorie,
  risk_level as risiko,
  public_scores->'overall' as score,
  jsonb_array_length(responses) as fragen
FROM test_results
WHERE session_data->>'recoveredFrom' = 'test_progress'
ORDER BY created_at DESC;

EOF

echo ""
echo "✅ Alle wiederhergestellten Tests neu ausgewertet!"
echo ""
echo "🔍 Prüfe jetzt: https://dashboard.samebi.net/supervisor"
echo ""

