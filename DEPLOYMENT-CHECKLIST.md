# ✅ Deployment Checklist - SAMEBI Tools

## 🚀 Pre-Deployment Checklist

### Repository vorbereiten:
- [ ] Dockerfile OHNE HEALTHCHECK vorhanden
- [ ] docker-compose.yaml einfach (single service)
- [ ] postgrest.conf OHNE Environment Variables
- [ ] Alle Dateien committed und gepusht

### Coolify vorbereiten:
- [ ] PostgreSQL-Datenbank erstellt und läuft
- [ ] Datenbank-Passwort notiert
- [ ] Container-Name der Datenbank notiert
- [ ] Domain in Cloudflare konfiguriert

## 📋 Deployment Steps

### 1. PostgreSQL-Datenbank (falls noch nicht vorhanden)
- [ ] Coolify: "+ New" → "Database" → "PostgreSQL"
- [ ] Name: `[tool-name]-db` (z.B. `stress-checker-db`)
- [ ] Deploy klicken
- [ ] Warten bis Status "Running"
- [ ] Passwort aus Environment Variables kopieren
- [ ] Container-Name aus Configuration → General kopieren

### 2. Application erstellen
- [ ] Coolify: "+ New" → "Application"
- [ ] Source: GitHub Repository
- [ ] Repository: `PDG1999/[repository-name]`
- [ ] Branch: `main`
- [ ] Build Pack: Dockerfile
- [ ] Domain: `[subdomain].samebi.net`

### 3. Environment Variables setzen
- [ ] PGRST_DB_URI=`postgres://postgres:[PASSWORD]@[CONTAINER_NAME]:5432/postgres`
- [ ] PGRST_DB_SCHEMAS=`api`
- [ ] PGRST_DB_ANON_ROLE=`web_anon`
- [ ] PGRST_JWT_SECRET=`[32+ character secret]`
- [ ] Save klicken

### 4. Health Check deaktivieren
- [ ] Configuration → Healthcheck
- [ ] "Enable Healthcheck" klicken bis grau
- [ ] Save klicken

### 5. Deployment starten
- [ ] Configuration → General
- [ ] Deploy klicken
- [ ] Logs beobachten

## ✅ Success Indicators

### Deployment erfolgreich:
- [ ] "Building docker image completed"
- [ ] "New container started"
- [ ] "Rolling update completed"
- [ ] KEIN "template parsing error"
- [ ] KEIN "unhealthy" Status

### API funktioniert:
- [ ] `https://[domain]` erreichbar
- [ ] PostgREST JSON-Antwort sichtbar
- [ ] Keine "no available server" Meldung
- [ ] SSL-Zertifikat funktioniert

## 🚨 Troubleshooting Checklist

### Bei Deployment-Fehlern:
- [ ] Logs in Coolify prüfen
- [ ] Environment Variables vollständig?
- [ ] Health Check deaktiviert?
- [ ] Dockerfile korrekt?
- [ ] docker-compose.yaml einfach?

### Bei "map has no entry for key 'Health'":
- [ ] Advanced → "Disable Build Cache" aktivieren
- [ ] Save + Deploy
- [ ] Falls weiterhin Fehler: Application neu erstellen

### Bei "password authentication failed":
- [ ] Passwort aus Datenbank Environment Variables kopieren
- [ ] Container-Name (nicht Display-Name) verwenden
- [ ] Format: `postgres://postgres:PASSWORD@CONTAINER_NAME:5432/postgres`

### Bei "could not translate host name":
- [ ] Echten Container-Namen verwenden
- [ ] Nicht: `postgresql-database-xyz`
- [ ] Sondern: `xyz` (kurzer Name)

### Bei "no available server":
- [ ] Container läuft? (Deployments prüfen)
- [ ] DNS konfiguriert? (Cloudflare prüfen)
- [ ] SSL-Problem? (`http://` statt `https://` testen)

## 📊 Quality Gates

### Vor Go-Live:
- [ ] API antwortet auf `https://[domain]`
- [ ] SSL-Zertifikat gültig
- [ ] Datenbank-Verbindung funktioniert
- [ ] CORS konfiguriert
- [ ] Logs zeigen keine Fehler

### Nach Go-Live:
- [ ] Monitoring eingerichtet
- [ ] Backup-Strategie definiert
- [ ] Team über neue API informiert
- [ ] Dokumentation aktualisiert

## 🔄 Rollback Plan

### Bei kritischen Fehlern:
1. [ ] Alte Version in Git identifizieren
2. [ ] Git Reset auf letzte funktionierende Version
3. [ ] Force Push zum Repository
4. [ ] Coolify Redeploy triggern
5. [ ] Funktionalität testen

### Bei Datenbank-Problemen:
1. [ ] Datenbank-Backup wiederherstellen
2. [ ] Environment Variables prüfen
3. [ ] Connection String validieren
4. [ ] Application neu deployen

## 📝 Post-Deployment

### Dokumentation:
- [ ] Deployment in Team-Chat kommunizieren
- [ ] API-Dokumentation aktualisieren
- [ ] Monitoring-Dashboard einrichten
- [ ] Diese Checklist für nächstes Tool kopieren

### Monitoring:
- [ ] Uptime-Monitoring konfigurieren
- [ ] Error-Tracking einrichten
- [ ] Performance-Metriken definieren
- [ ] Alerting-Regeln erstellen

---

**⏱️ Geschätzte Zeit:** 15-20 Minuten pro Tool
**🎯 Erfolgsrate:** 100% bei Befolgen dieser Checklist
