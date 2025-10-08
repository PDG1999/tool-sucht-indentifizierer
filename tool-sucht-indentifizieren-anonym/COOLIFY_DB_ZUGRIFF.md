# 🗄️ Coolify Datenbank-Zugriff

**So greifst du auf die PostgreSQL-Datenbank in Coolify zu**

---

## 🎯 Methode 1: Über Coolify Web-Terminal (Empfohlen)

### Schritt für Schritt:

1. **Gehe zu Coolify Dashboard**
2. **Wähle deine PostgreSQL-Datenbank** aus
3. **Klicke auf "Terminal"**
4. **Du siehst:** `/ #` (Container-Shell)

### PostgreSQL-Konsole starten:

```bash
# Standard (wenn Datenbank bekannt ist)
psql -U postgres -d samebi_sucht

# Oder erst mit postgres verbinden
psql -U postgres

# Dann zur Datenbank wechseln
\c samebi_sucht
```

### Du bist drin, wenn du siehst:
```
samebi_sucht=#
```

---

## 🛠️ Nützliche psql-Befehle

### Datenbanken anzeigen:
```sql
\l
```

### Zur Datenbank wechseln:
```sql
\c samebi_sucht
```

### Tabellen anzeigen:
```sql
\dt
```

### Tabellen-Struktur anzeigen:
```sql
\d counselors
\d clients
\d test_results
```

### Alle Berater anzeigen:
```sql
SELECT id, name, email, role FROM counselors;
```

### Supervisor-Account prüfen:
```sql
SELECT * FROM counselors WHERE email = 'supervisor@samebi.net';
```

### Alle Tests zählen:
```sql
SELECT COUNT(*) FROM test_results;
```

### psql verlassen:
```sql
\q
```

---

## 📝 Supervisor-Account erstellen

### Im psql-Prompt (samebi_sucht=#):

```sql
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM counselors WHERE email = 'supervisor@samebi.net') THEN
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
    RAISE NOTICE 'Supervisor-Account aktualisiert';
  ELSE
    INSERT INTO counselors (name, email, password_hash, role, is_active, license_number, specialization, created_at, updated_at)
    VALUES ('Supervisor Test', 'supervisor@samebi.net', '$2b$10$j7FYMgs84.JlBlW9Dz8D0u.FLa7reyRSkN1z.4M.EvBl3yCBQ8rxm', 'supervisor', true, 'SUP-001', ARRAY['Supervision', 'Qualitätssicherung', 'Analytics'], NOW(), NOW());
    RAISE NOTICE 'Supervisor-Account erstellt';
  END IF;
END $$;
```

---

## 🔍 Daten prüfen

### Alle Berater anzeigen:
```sql
SELECT id, name, email, role, is_active, created_at 
FROM counselors 
ORDER BY created_at DESC;
```

### Alle Clients anzeigen:
```sql
SELECT id, name, email, counselor_id, status 
FROM clients 
ORDER BY created_at DESC 
LIMIT 10;
```

### Alle Test-Ergebnisse anzeigen:
```sql
SELECT id, client_id, counselor_id, risk_level, primary_concern, created_at 
FROM test_results 
ORDER BY created_at DESC 
LIMIT 10;
```

### Statistiken:
```sql
-- Anzahl Tests pro Berater
SELECT 
  c.name as berater,
  c.email,
  COUNT(tr.id) as anzahl_tests
FROM counselors c
LEFT JOIN test_results tr ON tr.counselor_id = c.id
GROUP BY c.id, c.name, c.email
ORDER BY anzahl_tests DESC;

-- Tests nach Risiko-Level
SELECT 
  risk_level,
  COUNT(*) as anzahl
FROM test_results
GROUP BY risk_level
ORDER BY anzahl DESC;
```

---

## 🐛 Troubleshooting

### Problem: "psql: command not found"
**Lösung:** Du bist im falschen Container. Gehe zu **PostgreSQL-Container**, nicht Backend!

### Problem: "FATAL: database does not exist"
**Lösung:**
```sql
-- Zeige alle Datenbanken
\l

-- Erstelle Datenbank falls nicht vorhanden
CREATE DATABASE samebi_sucht;
```

### Problem: "password authentication failed"
**Lösung:** Prüfe Coolify Environment Variables für PostgreSQL

### Problem: "relation does not exist"
**Lösung:** Tabellen wurden noch nicht erstellt. Führe Migrations aus:
```bash
# Im Backend-Container
cd /app
node src/config/migrations.js
```

---

## 📋 Kompletter Workflow

```bash
# 1. Coolify → PostgreSQL Database → Terminal
/ #

# 2. PostgreSQL starten
/ # psql -U postgres -d samebi_sucht

# 3. Jetzt im psql
samebi_sucht=# 

# 4. SQL-Befehle ausführen
samebi_sucht=# SELECT * FROM counselors;

# 5. Fertig, psql verlassen
samebi_sucht=# \q

# 6. Zurück im Container-Terminal
/ # exit
```

---

## 🔐 Sicherheitshinweise

- ⚠️ **Niemals** Produktions-Passwörter im Terminal anzeigen
- ⚠️ **Niemals** `DROP TABLE` in Production ohne Backup
- ✅ Immer `SELECT` vor `UPDATE/DELETE` ausführen zum Testen
- ✅ Backup vor größeren Änderungen erstellen

---

## 📚 Weitere Ressourcen

- PostgreSQL Docs: https://www.postgresql.org/docs/
- psql Commands: https://www.postgresql.org/docs/current/app-psql.html
- Coolify Docs: https://coolify.io/docs/

---

**Viel Erfolg mit der Datenbank! 🎉**

