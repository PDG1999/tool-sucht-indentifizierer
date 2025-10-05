# 🚀 Coolify Deployment - Quick Start Checklist

**Version:** 1.0 - Deutsche Version  
**Geschätzte Dauer:** 15 Minuten

---

## ✅ **Phase 1: DNS (bereits erledigt!)**

- ✅ `check.samebi.net` → 91.98.93.203
- ✅ `api-check.samebi.net` → 91.98.93.203

---

## 🔧 **Phase 2: Backend deployen**

### In Coolify → New Resource → Application

| Setting | Wert |
|---------|------|
| **Name** | `samebi-check-backend-de` |
| **Type** | Node.js Application |
| **Git Repository** | `https://github.com/PDG1999/tool-sucht-identifizieren-anonym` |
| **Branch** | `main` |
| **Base Directory** | `backend` |
| **Build Command** | `npm ci --only=production` |
| **Start Command** | `npm start` |
| **Port** | `5000` |
| **Health Check** | `/health` |

### Environment Variables:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://[USER]:[PASSWORD]@postgresql-database-nsgccoc4scg8g444c400c840:5432/[DB_NAME]
JWT_SECRET=[GENERIERE: openssl rand -base64 32]
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://check.samebi.net
FRONTEND_URL=https://check.samebi.net
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ WICHTIG:**
- Ersetze `[USER]`, `[PASSWORD]`, `[DB_NAME]` mit deinen echten PostgreSQL-Daten
- JWT_SECRET generieren: Terminal öffnen → `openssl rand -base64 32` → Kopieren

### Domain:
```
api-check.samebi.net
```

**✅ Deploy starten!**

### Nach Deploy - Logs prüfen:
Suche nach diesen Zeilen:
```
✅ Database schema created successfully!
✅ Demo accounts created!
   📧 Berater: berater@samebi.net / Demo2025!
   📧 Supervisor: supervisor@samebi.net / Supervisor2025!
🚀 SAMEBI API Server läuft auf Port 5000
```

---

## 🎨 **Phase 3: Frontend deployen**

### In Coolify → New Resource → Application

| Setting | Wert |
|---------|------|
| **Name** | `samebi-check-frontend-de` |
| **Type** | Dockerfile |
| **Git Repository** | `https://github.com/PDG1999/tool-sucht-identifizieren-anonym` |
| **Branch** | `main` |
| **Build Pack** | Dockerfile |
| **Dockerfile Location** | `Dockerfile` |
| **Base Directory** | `.` (Punkt) oder leer |
| **Port** | `80` |
| **Health Check** | `/` |

### Environment Variables:

```env
NODE_ENV=production
VITE_API_URL=https://api-check.samebi.net/api
VITE_APP_NAME=SAMEBI Lebensbalance-Check
VITE_DOMAIN=check.samebi.net
VITE_SUPPORT_EMAIL=support@samebi.net
VITE_COMPANY_NAME=SAMEBI Deutschland
```

### Domain:
```
check.samebi.net
```

**WICHTIG für SSL:**
- In Coolify bei der Domain: "Generate Domain SSL" aktivieren
- Nach Deploy: **Warte 2-5 Minuten** für SSL-Zertifikat-Generierung
- Wenn SSL-Fehler: Neu laden nach 5 Minuten

**✅ Deploy starten!**

---

## ✅ **Phase 4: Testen**

### 1. Backend testen:
```
https://api-check.samebi.net/health
```

Erwartete Antwort:
```json
{
  "success": true,
  "message": "SAMEBI API is running",
  "timestamp": "2025-10-05T...",
  "version": "1.0.0"
}
```

### 2. Frontend testen:
- **Landing Page:** https://check.samebi.net
- **Schnell-Check:** https://check.samebi.net/schnellcheck
- **Volltest:** https://check.samebi.net/test

### 3. Dashboard Login:
- **URL:** https://check.samebi.net/dashboard
- **Email:** `berater@samebi.net`
- **Passwort:** `Demo2025!`

### 4. Supervisor Login:
- **URL:** https://check.samebi.net/supervisor
- **Email:** `supervisor@samebi.net`
- **Passwort:** `Supervisor2025!`

---

## 🔧 **Troubleshooting**

### ❌ Backend: "Database connection error"
**Lösung:**
1. Prüfe `DATABASE_URL` in Environment Variables
2. Format: `postgresql://user:password@host:5432/database`
3. Teste in Coolify PostgreSQL Terminal: `SELECT version();`

### ❌ Frontend: "Dockerfile not found"
**Lösung:**
1. Prüfe "Base Directory" ist `.` (Punkt) oder leer
2. Prüfe "Dockerfile Location" ist exakt `Dockerfile`
3. NICHT `./Dockerfile` oder `/Dockerfile`

### ❌ SSL-Zertifikat: "NET::ERR_CERT_AUTHORITY_INVALID"
**Lösung:**
1. Warte 5 Minuten nach Deploy
2. Lade Seite neu (Cmd+Shift+R / Ctrl+Shift+R)
3. Prüfe Cloudflare SSL/TLS Mode: "Full" oder "Full (strict)"
4. In Coolify: Domain → "Regenerate Certificate"

### ❌ CORS-Fehler im Browser
**Lösung:**
1. Prüfe Backend ENV: `CORS_ORIGIN=https://check.samebi.net`
2. Prüfe Frontend ENV: `VITE_API_URL=https://api-check.samebi.net/api`
3. Keine Trailing-Slashes!

---

## 📊 **Was passiert automatisch?**

### Beim Backend-Start:
1. ✅ Verbindung zur Datenbank testen
2. ✅ Prüfen ob Tabellen existieren
3. ✅ Wenn nein: Komplettes Schema erstellen
   - counselors, clients, test_results, sessions, audit_logs
   - anonymous_sessions, test_session_metrics, question_metrics
   - Alle Indexes und Triggers
4. ✅ Prüfen ob Demo-Accounts existieren
5. ✅ Wenn nein: Accounts mit sicheren Passwörtern erstellen
6. ✅ Server starten

**Du musst NICHTS manuell in der Datenbank machen!** 🎉

---

## 🎯 **Erfolgskriterien**

- [ ] Backend Health Check antwortet mit 200 OK
- [ ] Frontend lädt ohne Fehler (keine weiße Seite)
- [ ] SSL-Zertifikat ist aktiv (grünes Schloss im Browser)
- [ ] Schnell-Check funktioniert
- [ ] Dashboard-Login funktioniert
- [ ] Test-Daten werden in Dashboard angezeigt

---

## 📞 **Support**

Bei Problemen:
1. Prüfe Coolify Logs (Backend & Frontend)
2. Prüfe Browser Console (F12)
3. Prüfe PostgreSQL Connection in Coolify

**Viel Erfolg! 🚀**

