# SAMEBI Backend Scripts

Nützliche Scripts für die Verwaltung des SAMEBI Systems.

---

## 🔐 Passwort hashen

Erstelle einen bcrypt-Hash für ein Passwort:

```bash
node scripts/hash-password.js "MeinPasswort123!"
```

**Output:**
```
✅ Password hashed successfully!

Hashed Password:
$2b$10$AiCXPbsrZCyGSS4Qy6fM0u4lyFeBlYTf0/YYjXfZ/LyO4PJaSEMhC
```

Nutze diesen Hash dann in SQL-Statements zum Erstellen von Berater-Konten.

---

## 👤 Berater-Konto erstellen (Interaktiv)

Erstelle ein neues Berater- oder Supervisor-Konto interaktiv:

```bash
# Lokale Datenbank
node scripts/create-counselor.js

# Production (Coolify)
# 1. SSH in den Server
# 2. Docker exec in den Backend-Container
# 3. Dann Script ausführen
```

**Interaktive Eingabe:**
- Name
- E-Mail
- Passwort
- Rolle (counselor/supervisor)
- Lizenz-Nummer
- Fachgebiete

---

## 📊 Direkt in Datenbank (SQL)

Falls du direkt SQL nutzen möchtest:

### Neuen Berater anlegen:

```sql
INSERT INTO counselors (name, email, password_hash, role, is_active, license_number, specialization)
VALUES (
    'Dr. Maria Schmidt',
    'maria.schmidt@samebi.net',
    '$2b$10$...',  -- Nutze hash-password.js!
    'counselor',
    true,
    'DE-54321',
    ARRAY['Suchtberatung', 'Verhaltenstherapie']
);
```

### Neuen Supervisor anlegen:

```sql
INSERT INTO counselors (name, email, password_hash, role, is_active, license_number, specialization)
VALUES (
    'Prof. Dr. Hans Müller',
    'hans.mueller@samebi.net',
    '$2b$10$...',  -- Nutze hash-password.js!
    'supervisor',
    true,
    'DE-ADMIN-001',
    ARRAY['Supervision', 'System-Administration']
);
```

---

## 🔍 Alle Berater anzeigen:

```sql
SELECT id, name, email, role, is_active, created_at 
FROM counselors 
ORDER BY created_at DESC;
```

---

## 🔐 Passwort zurücksetzen:

```sql
-- 1. Neues Passwort hashen
node scripts/hash-password.js "NeuesPasswort123!"

-- 2. In DB updaten
UPDATE counselors 
SET password_hash = '$2b$10$...'  -- Hash vom Script
WHERE email = 'berater@samebi.net';
```

---

## 🚨 Berater deaktivieren:

```sql
UPDATE counselors 
SET is_active = false 
WHERE email = 'berater@samebi.net';
```

---

## 📋 Demo-Accounts

Das System erstellt automatisch beim Start 2 Demo-Accounts:

### Berater:
- **E-Mail**: `berater@samebi.net`
- **Passwort**: `Demo2025!`
- **Rolle**: `counselor`

### Supervisor:
- **E-Mail**: `supervisor@samebi.net`
- **Passwort**: `Supervisor2025!`
- **Rolle**: `supervisor`

---

## 🎯 Supervisor vs. Berater

### Supervisor (👑 Admin):
- Sieht **ALLE** Test-Ergebnisse (auch anonyme)
- Globale Analytics
- System-weite Statistiken
- Berater-Verwaltung
- Zugang: `/supervisor`

### Berater (👨‍⚕️ Counselor):
- Sieht nur **eigene Klienten**
- Klienten-Verwaltung
- Test-Ergebnisse der eigenen Klienten
- Zugang: `/dashboard`

---

## 🔗 Links

- **Dashboard**: https://dashboard.samebi.net/
- **Supervisor**: https://dashboard.samebi.net/supervisor
- **API**: https://api-check.samebi.net/api

