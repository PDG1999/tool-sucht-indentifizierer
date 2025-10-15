# 🔍 Datenbank-Diagnose: Test-Speicherung prüfen

## 📊 Was wird gespeichert?

Basierend auf der Code-Analyse werden **ALLE** Tests gespeichert mit:

### ✅ Grundlegende Test-Daten
- Alle Antworten (`responses`)
- Öffentliche Scores (`public_scores`)
- Professionelle Scores (`professional_scores`)
- Risiko-Level (`risk_level`)
- Hauptproblem (`primary_concern`)

### ✅ Tracking-Daten
- Browser-Fingerprint
- IP-Adresse
- Geo-Daten (Stadt, Region, Land, Koordinaten, ISP)
- Geräte-Info (Typ, Browser, OS, Bildschirmauflösung)
- User-Agent
- Referrer

### ✅ Session-Daten
- Sitzungsdauer
- Fragenbeantwortungszeiten
- Abbruch-Tracking
- Fortschritt-Speicherung

---

## 🚀 SCHNELL-CHECK via SSH/Coolify

### Option 1: Via Coolify Web-Terminal (Empfohlen)

1. **Gehe zu Coolify → PostgreSQL Database → Terminal**
2. **Führe aus:**

```bash
psql -U postgres -d samebi_sucht
```

3. **Kopiere diese SQL-Befehle:**

```sql
-- ====================================
-- 1. ALLE GESPEICHERTEN TESTS ZÄHLEN
-- ====================================
SELECT COUNT(*) as total_tests FROM test_results;

-- ====================================
-- 2. TESTS NACH DATUM
-- ====================================
SELECT 
  DATE(created_at) as datum,
  COUNT(*) as anzahl_tests
FROM test_results
GROUP BY DATE(created_at)
ORDER BY datum DESC
LIMIT 30;

-- ====================================
-- 3. VOLLSTÄNDIGKEIT PRÜFEN
-- ====================================
SELECT 
  COUNT(*) as total,
  COUNT(responses) as mit_antworten,
  COUNT(tracking_data) as mit_tracking,
  COUNT(session_data) as mit_session,
  COUNT(CASE WHEN aborted = false THEN 1 END) as vollstaendig,
  COUNT(CASE WHEN aborted = true THEN 1 END) as abgebrochen
FROM test_results;

-- ====================================
-- 4. RISIKO-VERTEILUNG
-- ====================================
SELECT 
  risk_level,
  COUNT(*) as anzahl,
  ROUND(COUNT(*)::numeric / (SELECT COUNT(*) FROM test_results)::numeric * 100, 2) as prozent
FROM test_results
GROUP BY risk_level
ORDER BY anzahl DESC;

-- ====================================
-- 5. GEO-DATEN VORHANDEN?
-- ====================================
SELECT 
  COUNT(*) as tests_mit_geo_daten,
  COUNT(DISTINCT tracking_data->'geo_data'->>'city') as verschiedene_staedte
FROM test_results
WHERE tracking_data->'geo_data' IS NOT NULL;

-- ====================================
-- 6. LETZTE 10 TESTS ANZEIGEN
-- ====================================
SELECT 
  id,
  created_at,
  risk_level,
  primary_concern,
  CASE WHEN aborted THEN 'Ja' ELSE 'Nein' END as abgebrochen,
  tracking_data->'geo_data'->>'city' as stadt,
  tracking_data->>'device_type' as geraet
FROM test_results
ORDER BY created_at DESC
LIMIT 10;

-- ====================================
-- 7. TRACKING-DATEN BEISPIEL
-- ====================================
SELECT 
  created_at,
  tracking_data->'geo_data'->>'city' as stadt,
  tracking_data->'geo_data'->>'country' as land,
  tracking_data->>'device_type' as geraet,
  tracking_data->>'browser' as browser,
  tracking_data->>'os' as betriebssystem
FROM test_results
WHERE tracking_data IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;

-- ====================================
-- 8. FORTSCHRITT-SPEICHERUNG
-- ====================================
SELECT COUNT(*) as gespeicherte_fortschritte
FROM test_progress;
```

---

## 🖥️ Option 2: Via Mac Terminal + SSH

**Voraussetzung:** SSH-Zugang zum Hetzner-Server [[memory:9446436]]

```bash
# 1. Verbinde dich mit dem Server
ssh root@91.98.93.203

# 2. Finde die PostgreSQL-Container-ID
docker ps | grep postgres

# 3. Verbinde dich mit der PostgreSQL-Datenbank
docker exec -it [CONTAINER_ID] psql -U postgres -d samebi_sucht

# 4. Führe die obigen SQL-Befehle aus
```

---

## 📋 SUPERVISOR-ANSICHT PRÜFEN

### Im Browser (nach Login als Supervisor):

**URL:** `https://stress-test.samebi.net` (oder deine aktuelle Domain)

**Login:**
- Email: `supervisor@samebi.net`
- Passwort: `Supervisor123!`

### Was solltest du sehen:

1. **Dashboard-Übersicht:**
   - ✅ Gesamtzahl Tests
   - ✅ Risiko-Verteilung
   - ✅ Geografische Karte
   - ✅ Geräte-Statistiken

2. **Test-Liste:**
   - ✅ Alle Tests von allen Nutzern
   - ✅ Filter nach Risiko-Level
   - ✅ Zeitstempel
   - ✅ Tracking-Daten

3. **Detail-Ansicht:**
   - ✅ Alle Antworten
   - ✅ Scores (öffentlich + professionell)
   - ✅ Empfehlungen
   - ✅ Tracking-Details (Geo, Gerät, Browser)

---

## 🔧 FEHLERBEHEBUNG

### Problem: Keine Tests in der Datenbank

**Check 1: Backend läuft?**
```bash
# Im Browser
curl https://stress-test.samebi.net/api/health

# Sollte zurückgeben: {"status":"ok"}
```

**Check 2: Migrations ausgeführt?**
```sql
-- Im psql
\dt

-- Sollte zeigen:
-- test_results
-- test_progress
-- anonymous_sessions
-- clients
-- counselors
```

**Check 3: Spalten vorhanden?**
```sql
\d test_results

-- Sollte zeigen:
-- tracking_data | jsonb
-- session_data | jsonb
-- aborted | boolean
```

### Problem: Tracking-Daten fehlen

**Mögliche Ursachen:**
1. ❌ User hat Tracking blockiert (Browser-Einstellungen)
2. ❌ Geo-API nicht erreichbar
3. ❌ Alte Version des Frontends (Cache leeren!)

**Lösung:**
```bash
# Cache leeren im Browser:
Cmd + Shift + R (Mac)
Ctrl + Shift + R (Windows)
```

---

## 📊 ERWARTETE DATEN-VOLLSTÄNDIGKEIT

### 100% garantiert:
- ✅ `responses` (alle Antworten)
- ✅ `public_scores` (Scores für User)
- ✅ `professional_scores` (Scores für Berater)
- ✅ `risk_level` (Niedrig/Mittel/Hoch/Kritisch)
- ✅ `primary_concern` (Hauptproblem)

### 95%+ erwartet:
- ✅ `tracking_data` (Geo + Gerät)
- ✅ `session_data` (Timing)

### Optional (wenn User abgebrochen):
- 🟡 `aborted = true`
- 🟡 `aborted_at_question` (Frage-Nummer)

---

## 🎯 SUPERVISOR-ZUGRIFF VERIFIZIEREN

```sql
-- Prüfe Supervisor-Account
SELECT id, name, email, role, is_active 
FROM counselors 
WHERE email = 'supervisor@samebi.net';

-- Sollte zeigen:
-- role = 'supervisor'
-- is_active = true
```

Wenn nicht vorhanden, erstellen:

```sql
-- Siehe: COOLIFY_DB_ZUGRIFF.md, Zeile 86-106
-- Oder nutze: backend/src/migrations/CREATE_SUPERVISOR_ACCOUNT.sql
```

---

## 🎉 SUCCESS CHECKLIST

- [ ] Test-Anzahl > 0 in Datenbank
- [ ] Tracking-Daten vorhanden
- [ ] Supervisor kann sich einloggen
- [ ] Supervisor sieht ALLE Tests
- [ ] Detail-Ansicht funktioniert
- [ ] Export/Download funktioniert
- [ ] Geo-Karte zeigt Daten

---

## 🆘 Wenn Probleme auftreten

**Kontakt:**
1. Prüfe Backend-Logs: `docker logs [BACKEND_CONTAINER_ID]`
2. Prüfe PostgreSQL-Logs: `docker logs [POSTGRES_CONTAINER_ID]`
3. Führe Migrations erneut aus: siehe `COOLIFY_DEPLOYMENT.md`

---

**Viel Erfolg! 🚀**

