-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 👤 SUPERVISOR ACCOUNT ERSTELLEN
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Datum: 8. Oktober 2025
-- Beschreibung: Erstellt einen Supervisor-Test-Account mit vollen Rechten
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Prüfe, ob Account bereits existiert
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM counselors WHERE email = 'supervisor@samebi.net') THEN
    RAISE NOTICE '⚠️  Supervisor-Account existiert bereits (supervisor@samebi.net)';
    RAISE NOTICE '    Verwende UPDATE statt INSERT...';
    
    UPDATE counselors 
    SET 
      name = 'Supervisor Test',
      password_hash = '$2b$10$j7FYMgs84.JlBlW9Dz8D0u.FLa7reyRSkN1z.4M.EvBl3yCBQ8rxm',
      role = 'supervisor',
      is_active = true,
      license_number = 'SUP-001',
      specialization = ARRAY['Supervision', 'Qualitätssicherung', 'Analytics'],
      updated_at = NOW()
    WHERE email = 'supervisor@samebi.net';
    
    RAISE NOTICE '✅ Supervisor-Account wurde aktualisiert';
  ELSE
    RAISE NOTICE '📝 Erstelle neuen Supervisor-Account...';
    
    INSERT INTO counselors (
      name, 
      email, 
      password_hash, 
      role, 
      is_active, 
      license_number, 
      specialization,
      created_at,
      updated_at
    )
    VALUES (
      'Supervisor Test',
      'supervisor@samebi.net',
      '$2b$10$j7FYMgs84.JlBlW9Dz8D0u.FLa7reyRSkN1z.4M.EvBl3yCBQ8rxm',
      'supervisor',
      true,
      'SUP-001',
      ARRAY['Supervision', 'Qualitätssicherung', 'Analytics'],
      NOW(),
      NOW()
    );
    
    RAISE NOTICE '✅ Supervisor-Account wurde erstellt';
  END IF;
END $$;

-- Zeige erstellten Account an
SELECT 
  id,
  name,
  email,
  role,
  license_number,
  specialization,
  is_active,
  created_at
FROM counselors
WHERE email = 'supervisor@samebi.net';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 📋 LOGIN-DATEN
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- E-Mail:    supervisor@samebi.net
-- Passwort:  SuperPass2024!
-- Rolle:     supervisor
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- HINWEISE:
-- 1. Führe dieses Script auf dem Production-Server aus
-- 2. Das Passwort ist: SuperPass2024!
-- 3. Der Account hat volle Supervisor-Rechte
-- 4. Teste den Login nach dem Deployment

