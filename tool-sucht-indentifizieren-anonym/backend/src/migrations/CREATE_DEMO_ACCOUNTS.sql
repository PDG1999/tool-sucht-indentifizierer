-- ============================================
-- SAMEBI Check Tool - Demo Accounts
-- Description: Create demo counselor and supervisor accounts
-- ============================================

-- WICHTIG: Diese Passwörter müssen gehasht werden!
-- Nutze bcrypt mit 10 Runden für Produktion

-- ============================================
-- Demo Berater Account
-- ============================================
-- Email: berater@samebi.net
-- Passwort: Demo2025!
-- Rolle: counselor

-- Temporär - Du musst das Passwort noch hashen!
-- Nutze Node.js: const bcrypt = require('bcrypt'); bcrypt.hashSync('Demo2025!', 10);

INSERT INTO counselors (name, email, password_hash, role, is_active, license_number, specialization)
VALUES (
    'Demo Berater',
    'berater@samebi.net',
    '$2b$10$sdHO1xikBOzo86Hm/cnFTucHnIOAPKLB7Ng9fbAhwrgciLFS50dU6',
    'counselor',
    true,
    'DE-12345',
    ARRAY['Suchtberatung', 'Verhaltenstherapie']
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Demo Supervisor Account
-- ============================================
-- Email: supervisor@samebi.net
-- Passwort: Supervisor2025!
-- Rolle: supervisor

INSERT INTO counselors (name, email, password_hash, role, is_active, license_number, specialization)
VALUES (
    'SAMEBI Supervisor',
    'supervisor@samebi.net',
    '$2b$10$nUOd6V9H7Hs3QPQIH/4yzu4miLW8WSRCeLf4EFsniI8T8PnM.VNaS',
    'supervisor',
    true,
    'DE-ADMIN',
    ARRAY['Supervision', 'System-Admin']
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- PASSWORT-HASH GENERATOR (Node.js Script)
-- ============================================
-- 
-- Führe lokal aus:
-- 
-- node -e "const bcrypt = require('bcrypt'); console.log('Demo2025!:', bcrypt.hashSync('Demo2025!', 10));"
-- node -e "const bcrypt = require('bcrypt'); console.log('Supervisor2025!:', bcrypt.hashSync('Supervisor2025!', 10));"
--
-- Dann setze die Hashes oben ein und führe dieses SQL-File aus!
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '⚠️  ACHTUNG: Passwörter müssen noch gehasht werden!';
    RAISE NOTICE '📝 Führe aus: node -e "const bcrypt = require(''bcrypt''); console.log(bcrypt.hashSync(''Demo2025!'', 10));"';
END $$;

