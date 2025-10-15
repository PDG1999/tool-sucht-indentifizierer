#!/bin/bash

# ⚠️ EMERGENCY RECOVERY SCRIPT
# Führe dieses Script auf dem Server aus um verlorene Tests wiederherzustellen

echo ""
echo "🔄 SAMEBI Test Recovery"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Container IDs
BACKEND_CONTAINER="e0w0o40kk8g0osw0ggc0kwok-142955881663"
DB_CONTAINER="nsgccoc4scg8g444c400c840"

echo "📊 Analysiere verlorene Tests..."
echo ""

# Führe Recovery direkt in der Datenbank aus
docker exec $DB_CONTAINER psql -U postgres -d postgres << 'EOF'

-- System Account finden
DO $$
DECLARE
  v_system_counselor_id UUID;
  v_test_record RECORD;
  v_client_id UUID;
  v_responses JSONB;
  v_count INT := 0;
BEGIN
  -- System Account holen
  SELECT id INTO v_system_counselor_id 
  FROM counselors 
  WHERE email = 'system@samebi.net' 
  LIMIT 1;
  
  IF v_system_counselor_id IS NULL THEN
    RAISE EXCEPTION 'System-Account nicht gefunden!';
  END IF;
  
  RAISE NOTICE '✅ System-Account gefunden: %', v_system_counselor_id;
  RAISE NOTICE '';
  RAISE NOTICE '📋 Wiederherstellbare Tests:';
  RAISE NOTICE '─────────────────────────────────────────────────────────';
  
  -- Alle test_progress mit >= 25 Fragen durchgehen
  FOR v_test_record IN 
    SELECT * FROM test_progress 
    WHERE current_question >= 25
    ORDER BY updated_at DESC
  LOOP
    -- Prüfe ob bereits wiederhergestellt
    IF EXISTS (
      SELECT 1 FROM test_results 
      WHERE session_data->>'sessionId' = v_test_record.session_id
    ) THEN
      RAISE NOTICE '⏭️  % - Bereits wiederhergestellt', 
        TO_CHAR(v_test_record.updated_at, 'DD.MM.YYYY HH24:MI');
      CONTINUE;
    END IF;
    
    -- Erstelle Client
    INSERT INTO clients (name, email, counselor_id, status, created_at, updated_at)
    VALUES (
      'Wiederhergestellt ' || TO_CHAR(v_test_record.updated_at, 'DD.MM.YYYY'),
      NULL,
      v_system_counselor_id,
      'active',
      v_test_record.created_at,
      NOW()
    )
    RETURNING id INTO v_client_id;
    
    -- Parse responses
    v_responses := v_test_record.responses::jsonb;
    
    -- Berechne einfaches Risiko-Level basierend auf Antworten
    DECLARE
      v_risk_level TEXT;
      v_avg_score NUMERIC;
    BEGIN
      -- Vereinfachte Risiko-Berechnung
      WITH answer_values AS (
        SELECT (value->>'answer')::numeric as answer
        FROM jsonb_array_elements(v_responses) as value
        WHERE value->>'answer' IS NOT NULL
      )
      SELECT AVG(answer) INTO v_avg_score FROM answer_values;
      
      v_risk_level := CASE 
        WHEN v_avg_score >= 3.5 THEN 'critical'
        WHEN v_avg_score >= 2.5 THEN 'high'
        WHEN v_avg_score >= 1.5 THEN 'moderate'
        ELSE 'low'
      END;
      
      -- Speichere in test_results
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
      ) VALUES (
        v_client_id,
        v_system_counselor_id,
        v_responses,
        jsonb_build_object('overall', ROUND(v_avg_score * 20), 'recovered', true),
        jsonb_build_object('overall', ROUND(v_avg_score * 25), 'recovered', true),
        v_risk_level,
        'Wiederhergestellt',
        v_risk_level IN ('high', 'critical'),
        v_test_record.current_question < 39,
        jsonb_array_length(v_responses),
        jsonb_build_object(
          'sessionId', v_test_record.session_id,
          'recoveredFrom', 'test_progress',
          'originalDate', v_test_record.updated_at
        ),
        v_test_record.created_at,
        v_test_record.updated_at
      );
      
      v_count := v_count + 1;
      
      RAISE NOTICE '✅ % - Fragen: %/40 - Risiko: %', 
        TO_CHAR(v_test_record.updated_at, 'DD.MM.YYYY HH24:MI'),
        v_test_record.current_question + 1,
        v_risk_level;
    END;
    
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '═════════════════════════════════════════════════════════';
  RAISE NOTICE '✨ Recovery abgeschlossen: % Tests wiederhergestellt', v_count;
  RAISE NOTICE '';
  
END $$;

-- Zeige Zusammenfassung
SELECT 
  'NACH RECOVERY' as status,
  COUNT(*) as total_tests,
  MIN(created_at) as aeltester,
  MAX(created_at) as neuester
FROM test_results;

EOF

echo ""
echo "✅ Recovery abgeschlossen!"
echo ""
echo "🔍 Prüfe jetzt das Dashboard: https://dashboard.samebi.net/supervisor"
echo ""

