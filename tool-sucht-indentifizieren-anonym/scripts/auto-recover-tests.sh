#!/bin/bash

# 🔄 AUTO-RECOVERY SYSTEM
# Läuft automatisch (via Cron) und speichert unvollständige Tests
# 
# Installiere als Cron-Job:
# */30 * * * * /root/auto-recover-tests.sh >> /var/log/samebi-recovery.log 2>&1

DB_CONTAINER="nsgccoc4scg8g444c400c840"
SYSTEM_COUNSELOR="18c1d5d4-33fc-434a-8163-dab64e030ea0"

# Logging
echo "═══════════════════════════════════════════════════════════"
echo "🔄 SAMEBI Auto-Recovery: $(date '+%Y-%m-%d %H:%M:%S')"
echo "═══════════════════════════════════════════════════════════"

# SQL: Finde Tests die >= 25 Fragen haben und älter als 1 Stunde sind
docker exec $DB_CONTAINER psql -U postgres -d postgres << 'EOF'

WITH 
category_names AS (
  SELECT * FROM (VALUES
    ('f1_', 'Zeitmanagement & Prioritäten'),
    ('f2_', 'Finanzielle Auswirkungen'),
    ('f3_', 'Emotionale Regulation'),
    ('f4_', 'Soziale Beziehungen'),
    ('f5_', 'Gesundheit & Wohlbefinden')
  ) AS t(prefix, name)
),
recoverable_tests AS (
  SELECT 
    tp.id,
    tp.session_id,
    tp.responses,
    tp.current_question,
    tp.created_at,
    tp.updated_at
  FROM test_progress tp
  WHERE 
    -- Mindestens 25 Fragen beantwortet
    tp.current_question >= 25
    -- Älter als 1 Stunde (User hat wahrscheinlich abgebrochen)
    AND tp.updated_at < NOW() - INTERVAL '1 hour'
    -- Noch nicht wiederhergestellt
    AND NOT EXISTS (
      SELECT 1 FROM test_results tr
      WHERE tr.session_data->>'sessionId' = tp.session_id
    )
)
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
)
SELECT 
  -- Client erstellen inline (würde normalerweise separat gemacht)
  (
    INSERT INTO clients (name, counselor_id, status)
    VALUES (
      'Auto-Recovery-' || TO_CHAR(rt.updated_at, 'DDMMYY-HH24MI'),
      '18c1d5d4-33fc-434a-8163-dab64e030ea0'::uuid,
      'active'
    )
    RETURNING id
  ),
  '18c1d5d4-33fc-434a-8163-dab64e030ea0'::uuid,
  rt.responses,
  -- Public Scores berechnen
  jsonb_build_object(
    'overall', 
    ROUND(
      (SELECT AVG((v->>'value')::numeric) FROM jsonb_array_elements(rt.responses) v) * 20
    )::int
  ),
  -- Professional Scores berechnen  
  jsonb_build_object(
    'overall',
    ROUND(
      (SELECT AVG((v->>'value')::numeric) FROM jsonb_array_elements(rt.responses) v) * 25
    )::int,
    'overallRisk',
    ROUND(
      (SELECT AVG((v->>'value')::numeric) FROM jsonb_array_elements(rt.responses) v) * 25
    )::int
  ),
  -- Risk Level
  CASE 
    WHEN (SELECT AVG((v->>'value')::numeric) FROM jsonb_array_elements(rt.responses) v) >= 3.5 THEN 'critical'
    WHEN (SELECT AVG((v->>'value')::numeric) FROM jsonb_array_elements(rt.responses) v) >= 2.5 THEN 'high'
    WHEN (SELECT AVG((v->>'value')::numeric) FROM jsonb_array_elements(rt.responses) v) >= 1.5 THEN 'moderate'
    ELSE 'low'
  END,
  -- Primary Concern (höchste Kategorie)
  COALESCE(
    (
      SELECT cn.name
      FROM jsonb_array_elements(rt.responses) v
      CROSS JOIN category_names cn
      WHERE (v->>'questionId')::text LIKE cn.prefix || '%'
      GROUP BY cn.name
      ORDER BY AVG((v->>'value')::numeric) DESC
      LIMIT 1
    ),
    'Allgemein'
  ),
  -- Follow-up required?
  (SELECT AVG((v->>'value')::numeric) FROM jsonb_array_elements(rt.responses) v) >= 2.5,
  -- Aborted (wenn nicht alle 40 Fragen)
  rt.current_question < 39,
  -- Completed questions
  jsonb_array_length(rt.responses),
  -- Session data
  jsonb_build_object(
    'sessionId', rt.session_id,
    'recoveredFrom', 'test_progress_auto',
    'originalDate', rt.updated_at,
    'autoRecovered', true
  ),
  rt.created_at,
  rt.updated_at
FROM recoverable_tests rt
RETURNING 
  TO_CHAR(created_at, 'DD.MM HH24:MI') as datum,
  primary_concern,
  risk_level,
  completed_questions,
  CASE WHEN aborted THEN 'Ja' ELSE 'Nein' END as abgebrochen;

EOF

echo ""
echo "✅ Auto-Recovery abgeschlossen: $(date '+%H:%M:%S')"
echo ""

