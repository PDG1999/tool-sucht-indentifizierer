# 🌐 SAMEBI Domain-Konfiguration

**Zuletzt aktualisiert:** 8. Oktober 2025

---

## 📍 Produktions-URLs

### **Frontend-Anwendungen**

#### 1. **Test-Tool (Öffentlich)**
```
URL:      https://check.samebi.net
Zweck:    Sucht-Screening-Tool für Tests
Zielgruppe: Betroffene, Angehörige
```

#### 2. **Dashboard (Geschützt)**
```
URL:      https://dashboard.samebi.net
Zweck:    Berater & Supervisor Dashboard
Zielgruppe: Psychologen, Berater, Supervisoren
Login:    Erforderlich
```

### **Backend-API**

```
URL:      https://api-check.samebi.net
Zweck:    REST API für alle Frontend-Anwendungen
Endpoints:
  - /api/auth/login
  - /api/auth/register
  - /api/test-results
  - /api/clients
  - /api/counselors
```

---

## 🔐 Login-URLs

### **Berater & Supervisor Login:**
```
URL:      https://dashboard.samebi.net
Route:    /login (automatisch)
```

**Supervisor-Account (Test):**
```
E-Mail:   supervisor@samebi.net
Passwort: SuperPass2024!
```

**Berater-Account:**
```
E-Mail:   [Individuelle E-Mail]
Passwort: [Individuelles Passwort]
```

---

## ⚙️ Coolify-Konfiguration

### **Dashboard Frontend (`coolify.json`):**
```json
{
  "name": "screening-tool-professional",
  "domains": ["dashboard.samebi.net"],
  "environment": {
    "VITE_API_URL": "https://api-check.samebi.net/api",
    "VITE_DOMAIN": "dashboard.samebi.net"
  }
}
```

### **Backend ENV-Variablen (Coolify):**
```bash
# CORS muss BEIDE Frontend-Domains erlauben:
CORS_ORIGIN=https://check.samebi.net,https://dashboard.samebi.net

# Frontend-URL (für E-Mails, Redirects):
FRONTEND_URL=https://dashboard.samebi.net
```

---

## 🔧 Lokale Entwicklung

### **Frontend:**
```bash
# Dashboard
npm run dev
# Läuft auf: http://localhost:3002

# ENV-Variablen (.env.local):
VITE_API_URL=http://localhost:3001/api
```

### **Backend:**
```bash
cd backend
npm run dev
# Läuft auf: http://localhost:3001

# ENV-Variablen (backend/.env):
CORS_ORIGIN=http://localhost:3002,http://localhost:3004
PORT=3001
```

---

## 📊 URL-Übersicht

| Service | Lokal | Produktion |
|---------|-------|------------|
| **Test-Tool** | http://localhost:3004 | https://check.samebi.net |
| **Dashboard** | http://localhost:3002 | https://dashboard.samebi.net |
| **Backend API** | http://localhost:3001/api | https://api-check.samebi.net/api |
| **Datenbank** | localhost:5432 | [Coolify PostgreSQL] |

---

## 🚨 Wichtig: CORS-Fehler vermeiden

### **Problem:**
```
Access to fetch at 'https://api-check.samebi.net/api/auth/login' 
from origin 'https://dashboard.samebi.net' has been blocked by CORS policy
```

### **Lösung:**
Stelle sicher, dass im **Backend** die ENV-Variable gesetzt ist:

```bash
CORS_ORIGIN=https://check.samebi.net,https://dashboard.samebi.net
```

**In Coolify:**
1. Gehe zu Backend-Service
2. Environment Variables
3. Setze `CORS_ORIGIN` mit BEIDEN Domains (komma-separiert)
4. Redeploy Backend

---

## ✅ Deployment-Checklist

### **Frontend (Dashboard):**
- [ ] `coolify.json` → Domain: `dashboard.samebi.net`
- [ ] `coolify.json` → API_URL: `https://api-check.samebi.net/api`
- [ ] Coolify → Redeploy ausführen
- [ ] Browser-Cache leeren (Cmd+Shift+R)

### **Backend:**
- [ ] Coolify ENV → `CORS_ORIGIN` mit beiden Domains
- [ ] Coolify ENV → `FRONTEND_URL=https://dashboard.samebi.net`
- [ ] Coolify → Redeploy ausführen
- [ ] Health-Check: `curl https://api-check.samebi.net/health`

### **Test:**
- [ ] Login auf `dashboard.samebi.net` testen
- [ ] Browser Console (F12) → Keine CORS-Fehler
- [ ] Network Tab → API-Calls erfolgreich (Status 200)

---

## 🔗 Weitere Dokumentation

- **Deployment:** `COOLIFY_DEPLOYMENT.md`
- **Schnellstart:** `COOLIFY_SCHNELLSTART.md`
- **Supervisor-Account:** `SUPERVISOR_ACCOUNT_ANLEITUNG.md`
- **Subdomain-Strategie:** `SUBDOMAIN-STRATEGY.md`

---

**Bei Fragen oder CORS-Problemen: Diese Datei prüfen! ✅**



