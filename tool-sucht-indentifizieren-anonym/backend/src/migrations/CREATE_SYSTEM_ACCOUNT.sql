-- ============================================
-- SAMEBI System-Account für anonyme Tests
-- ============================================
-- 
-- Dieser Account dient als "Sammelstelle" für alle
-- anonymen Test-Ergebnisse, die über die öffentliche
-- Webseite (ohne Berater-Link) durchgeführt werden.
-- 
-- Der Account ist INAKTIV und kann sich NICHT einloggen.
-- Er dient nur zur Daten-Organisation.
-- ============================================

INSERT INTO counselors (
    name, 
    email, 
    password_hash, 
    role, 
    is_active, 
    license_number, 
    specialization
)
VALUES (
    '🌐 SAMEBI System (Anonyme Tests)',
    'system@samebi.net',
    '$2b$10$dummyhashxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',  -- Dummy-Hash
    'counselor',
    false,  -- ❌ INAKTIV - Kann sich nicht einloggen!
    'SYSTEM-000',
    ARRAY['System-Account', 'Anonyme Tests']
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Erklärung:
-- ============================================
-- 
-- 1. Alle Tests ohne counselor_id werden automatisch
--    diesem System-Account zugeordnet
-- 
-- 2. Der Supervisor kann diese Tests sehen und:
--    - An echte Berater zuweisen
--    - Statistiken erstellen
--    - Trends analysieren
-- 
-- 3. Der Account kann sich NICHT einloggen (is_active = false)
--    und hat einen Dummy-Password-Hash
-- 
-- 4. Dies ermöglicht eine saubere Datenstruktur und
--    spätere Zuordnung von anonymen Tests zu Beratern
-- ============================================

-- Hole die ID des System-Accounts
DO $$
DECLARE
    system_counselor_id UUID;
BEGIN
    SELECT id INTO system_counselor_id 
    FROM counselors 
    WHERE email = 'system@samebi.net';
    
    IF system_counselor_id IS NOT NULL THEN
        RAISE NOTICE '✅ System-Account erstellt mit ID: %', system_counselor_id;
        RAISE NOTICE '📊 Alle anonymen Tests werden diesem Account zugeordnet';
    ELSE
        RAISE NOTICE '❌ Fehler beim Erstellen des System-Accounts';
    END IF;
END $$;




