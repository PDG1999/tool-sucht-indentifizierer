# 🚀 SAMEBI Check Tool - Deployment Guide (Option C: Staged Rollout)

**Version:** 1.0 (German only)  
**Datum:** 2025-10-05  
**Ziel:** Deutsche Version auf Coolify deployen

---

## 📋 Übersicht

Dieser Guide beschreibt das Deployment der **deutschen Version** des SAMEBI Lebensbalance-Check Tools auf Coolify mit:

- **Backend API:** `api-check.samebi.net`
- **Frontend DE:** `check.samebi.net`
- **Datenbank:** Bestehende PostgreSQL-Instanz erweitern

---

## ✅ Phase 1: DNS Setup (Cloudflare)

### A-Records erstellen:

```
Type: A    Name: check            Content: 91.98.93.203    Proxy: ✓ (orange cloud)
Type: A    Name: api-check        Content: 91.98.93.203    Proxy: ✓ (orange cloud)
```

**Warte 2-5 Minuten** auf DNS-Propagation, dann teste mit:

```bash
dig check.samebi.net
dig api-check.samebi.net
```

---

## ✅ Phase 2: Datenbank Setup

### 1. In Coolify PostgreSQL-Datenbank öffnen

Gehe zu: `postgresql-database-nsgccoc4scg8g444c400c840`

### 2. Terminal öffnen und Schema erstellen

Kopiere den kompletten Inhalt von:
```
backend/src/migrations/DEPLOY_ALL.sql
```

Füge ihn in das PostgreSQL-Terminal ein und führe aus.

### 3. Demo-Accounts erstellen

Kopiere den Inhalt von:
```
backend/src/migrations/CREATE_DEMO_ACCOUNTS.sql
```

Füge ihn in das PostgreSQL-Terminal ein und führe aus.

### 4. Login-Daten notieren

```
Berater-Account:
  Email: berater@samebi.net
  Passwort: Demo2025!

Supervisor-Account:
  Email: supervisor@samebi.net
  Passwort: Supervisor2025!
```

---

## ✅ Phase 3: Backend API deployen

### In Coolify → New Resource → Application

**1. General Settings:**
```
Name: samebi-check-backend-de
Type: Node.js Application
```

**2. Source:**
```
Repository: https://github.com/PDG1999/tool-sucht-identifizieren-anonym
Branch: main
Base Directory: backend
```

**3. Build Settings:**
```
Build Command: npm ci --only=production
Start Command: npm start
Port: 5000
Health Check Path: /health
```

**4. Environment Variables:**

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://[USER]:[PASSWORD]@postgresql-database-nsgccoc4scg8g444c400c840:5432/[DB_NAME]
JWT_SECRET=[GENERIERE MIT: openssl rand -base64 32]
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://check.samebi.net
FRONTEND_URL=https://check.samebi.net
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Wichtig:** 
- `DATABASE_URL` mit deinen echten Credentials füllen
- `JWT_SECRET` generieren: `openssl rand -base64 32`

**5. Domain:**
```
api-check.samebi.net
```

**6. Deploy starten!**

---

## ✅ Phase 4: Frontend (Deutsch) deployen

### In Coolify → New Resource → Application

**1. General Settings:**
```
Name: samebi-check-frontend-de
Type: Dockerfile
```

**2. Source:**
```
Repository: https://github.com/PDG1999/tool-sucht-identifizieren-anonym
Branch: main
Base Directory: .
Dockerfile: Dockerfile
```

**3. Build Settings:**
```
Port: 80
Health Check Path: /
```

**4. Environment Variables:**

```env
NODE_ENV=production
VITE_API_URL=https://api-check.samebi.net/api
VITE_APP_NAME=SAMEBI Lebensbalance-Check
VITE_DOMAIN=check.samebi.net
VITE_SUPPORT_EMAIL=support@samebi.net
VITE_COMPANY_NAME=SAMEBI Deutschland
```

**5. Domain:**
```
check.samebi.net
```

**6. Deploy starten!**

---

## ✅ Phase 5: Testing

### 1. Backend Health Check

Öffne: https://api-check.samebi.net/health

Erwartete Antwort:
```json
{
  "success": true,
  "message": "SAMEBI API is running",
  "timestamp": "2025-10-05T...",
  "version": "1.0.0"
}
```

### 2. Frontend Tests

- **Landing Page:** https://check.samebi.net
- **Schnell-Check:** https://check.samebi.net/schnellcheck
- **Volltest:** https://check.samebi.net/test
- **Dashboard:** https://check.samebi.net/dashboard (Login mit `berater@samebi.net`)
- **Supervisor:** https://check.samebi.net/supervisor (Login mit `supervisor@samebi.net`)

### 3. Test-Durchlauf

1. Gehe zu https://check.samebi.net/schnellcheck
2. Beantworte 10 Fragen
3. Sieh dir das Ergebnis an
4. Klicke auf "Vollständigen Test machen"
5. Prüfe, ob die Antworten übernommen wurden
6. Schließe den Test ab
7. Logge dich im Dashboard ein und prüfe, ob der Test gespeichert wurde

---

## 🔧 Troubleshooting

### Backend startet nicht
- Prüfe `DATABASE_URL` in den Environment Variables
- Prüfe Logs in Coolify
- Teste DB-Connection: `psql $DATABASE_URL -c "SELECT version();"`

### Frontend zeigt weiße Seite
- Prüfe `VITE_API_URL` in den Environment Variables
- Öffne Browser Console (F12) für Fehler
- Prüfe, ob Backend erreichbar ist

### CORS-Fehler
- Prüfe `CORS_ORIGIN` im Backend stimmt mit Frontend-Domain überein
- Cloudflare Proxy-Status prüfen (orange cloud)

### Database connection error
- Prüfe, ob Tabellen erstellt wurden: `\dt` in PostgreSQL Terminal
- Prüfe DATABASE_URL Format: `postgresql://user:pass@host:5432/dbname`

---

## 📊 Monitoring

### Coolify Metrics
- CPU/Memory Usage überwachen
- Response Times checken
- Error Logs durchsehen

### Application Logs
- Backend: Check `/health` Endpoint regelmäßig
- Frontend: Browser Console auf Fehler prüfen

---

## 🎯 Nächste Schritte (nach erfolgreichem DE-Deployment)

1. **Spanische Version** (ES): `comprueba.samebi.net` + `api-comprueba.samebi.net`
2. **Englische Version** (EN): `check-en.samebi.net` + `api-check-en.samebi.net`
3. **Multi-Tenant Database:** Schemas für DE/ES/EN trennen
4. **Analytics Dashboard:** Globale Statistiken über alle Sprachen
5. **Performance Monitoring:** Sentry/LogRocket Integration

---

## 📝 Wichtige Links

- **Repository:** https://github.com/PDG1999/tool-sucht-identifizieren-anonym
- **Hetzner Server:** 91.98.93.203
- **Cloudflare DNS:** samebi.net
- **Coolify:** https://coolify.samebi.net (vermutlich?)

---

**Viel Erfolg beim Deployment! 🚀**

