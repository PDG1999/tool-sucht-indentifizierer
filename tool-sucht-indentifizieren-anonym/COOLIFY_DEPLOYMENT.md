# 🚀 Coolify Deployment - Supervisor Dashboard Fixes

**Datum:** 8. Oktober 2025  
**Status:** Production-Ready für Coolify

---

## 📦 Was wurde geändert:

### Backend (Node.js API)
- ✅ `backend/src/routes/testResults.js` - Supervisor-Berechtigungen
- ✅ `backend/src/routes/clients.js` - Supervisor-Berechtigungen
- ✅ `backend/src/migrations/CREATE_SUPERVISOR_ACCOUNT.sql` - Neuer SQL-Script

### Frontend (React/TypeScript)
- ✅ `src/components/DashboardLayout.tsx` - SupervisorDashboard Integration

---

## 🔄 Automatisches Deployment

### Schritt 1: Code ist bereits gepusht ✅
```bash
# Bereits erledigt:
git push origin main
```

Die Commits sind bereits im Repository:
- `d970538` - Fix: Supervisor-Berechtigungen implementiert
- `3602da0` - Add: Supervisor-Account Erstellung

---

### Schritt 2: Coolify triggert automatisch ✅

**Backend:**
1. Coolify erkennt den neuen Commit
2. Baut neues Docker-Image: `samebi-backend:latest`
3. Deployed automatisch
4. ✅ Neue Backend-Routen sind live

**Frontend:**
1. Coolify erkennt den neuen Commit
2. Führt `npm run build` aus (Vite)
3. Kopiert Build in nginx-Container
4. ✅ Neues Frontend ist live

---

### Schritt 3: Supervisor-Account erstellen (Manuell)

**Warum manuell?**
- Datenbank-Migrationen werden nicht automatisch ausgeführt
- Sicherheitsfeature: Verhindert ungewollte DB-Änderungen

**So geht's:**

#### Option A: SSH zum Server
```bash
# 1. Mit Server verbinden
ssh root@91.98.93.203

# 2. SQL-Script ausführen
psql -U postgres -d samebi_sucht -f /path/to/backend/src/migrations/CREATE_SUPERVISOR_ACCOUNT.sql
```

#### Option B: Docker Exec
```bash
# Falls Postgres in Docker läuft:
docker exec -i postgres_container psql -U postgres -d samebi_sucht < backend/src/migrations/CREATE_SUPERVISOR_ACCOUNT.sql
```

#### Option C: DBeaver/pgAdmin
1. Öffne `backend/src/migrations/CREATE_SUPERVISOR_ACCOUNT.sql`
2. Kopiere den SQL-Code
3. Führe in deinem SQL-Client aus

---

## ✅ Deployment-Checklist

### Pre-Deployment
- [x] Code gepusht zu GitHub
- [x] Commits sind im `main` branch
- [x] Keine Linter-Fehler
- [x] Docker-Konfiguration unverändert

### Automatisches Deployment
- [ ] Coolify hat Backend neu gebaut
- [ ] Coolify hat Frontend neu gebaut
- [ ] Beide Services laufen (grüner Status in Coolify)
- [ ] Health-Checks sind OK

### Manuelle Schritte
- [ ] Supervisor-Account SQL ausgeführt
- [ ] Account existiert in DB: `SELECT * FROM counselors WHERE email = 'supervisor@samebi.net';`
- [ ] Login getestet: `supervisor@samebi.net` / `SuperPass2024!`

### Post-Deployment Tests
- [ ] Login als Supervisor funktioniert
- [ ] Supervisor-Dashboard wird angezeigt
- [ ] Zugriff auf alle Tests funktioniert
- [ ] Zugriff auf alle Clients funktioniert
- [ ] Backend-Logs zeigen keine Fehler

---

## 🔍 Coolify-Konfiguration

### Backend (`backend/docker-compose.yaml`)
```yaml
services:
  api:
    image: ${COOLIFY_IMAGE:-samebi-backend:latest}
    container_name: samebi-backend-api
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
```

**✅ Keine Änderungen nötig!**

---

### Frontend (`docker-compose.yml`)
```yaml
services:
  screening-tool:
    build: .
    container_name: screening-tool-samebi
    ports:
      - "3002:80"
```

**✅ Keine Änderungen nötig!**

---

## 🐛 Troubleshooting

### Problem: "Backend startet nicht"
**Lösung:**
```bash
# Logs prüfen
docker logs samebi-backend-api

# Container neu starten
docker restart samebi-backend-api
```

### Problem: "Frontend zeigt alte Version"
**Lösung:**
```bash
# Browser-Cache leeren
# Oder Hard-Refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

# Container neu bauen
docker-compose up -d --build
```

### Problem: "Supervisor kann nicht einloggen"
**Lösung:**
```bash
# Prüfe, ob Account existiert
psql -U postgres -d samebi_sucht -c "SELECT * FROM counselors WHERE email = 'supervisor@samebi.net';"

# Falls nicht, führe SQL-Script aus
psql -U postgres -d samebi_sucht -f backend/src/migrations/CREATE_SUPERVISOR_ACCOUNT.sql
```

### Problem: "Access denied" für Supervisor
**Lösung:**
```bash
# Prüfe Rolle in Datenbank
psql -U postgres -d samebi_sucht -c "SELECT email, role FROM counselors WHERE email = 'supervisor@samebi.net';"

# Sollte 'supervisor' sein, nicht 'counselor'
# Falls falsch, updaten:
psql -U postgres -d samebi_sucht -c "UPDATE counselors SET role = 'supervisor' WHERE email = 'supervisor@samebi.net';"
```

---

## 🔐 Umgebungsvariablen

### Benötigte ENV-Variablen (Backend)
```bash
# In Coolify unter "Environment Variables" setzen:
DATABASE_URL=postgresql://user:pass@host:5432/samebi_sucht
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://screening.samebi.net
FRONTEND_URL=https://screening.samebi.net
```

**✅ Bereits konfiguriert in Coolify**

---

## 📊 Deployment-Überwachung

### Coolify Dashboard prüfen:
1. **Builds:** Grüner Status nach ~2-5 Minuten
2. **Services:** Alle Container "Running"
3. **Logs:** Keine Error-Messages
4. **Health-Checks:** Alle grün

### Backend Health-Check:
```bash
curl https://api.samebi.net/health
# Erwartete Antwort: {"status":"ok"}
```

### Frontend Health-Check:
```bash
curl https://screening.samebi.net/
# Erwartete Antwort: HTML-Seite
```

---

## 📝 Rollback (Falls nötig)

### Option 1: Über Coolify
1. Gehe zu "Deployments"
2. Wähle vorherigen Build
3. Klicke "Redeploy"

### Option 2: Git Revert
```bash
# Letzten Commit rückgängig machen
git revert d970538
git push origin main

# Coolify deployt automatisch alte Version
```

---

## 🎯 Nächste Schritte nach Deployment

1. ✅ **Login testen**
   - URL: https://screening.samebi.net
   - User: supervisor@samebi.net
   - Pass: SuperPass2024!

2. ✅ **Dashboard prüfen**
   - Supervisor-Dashboard sollte angezeigt werden
   - Statistiken sollten sichtbar sein
   - "Supervisor"-Badge im User-Bereich

3. ✅ **Berechtigungen testen**
   - Zugriff auf alle Tests
   - Zugriff auf alle Clients
   - Test-Notizen bearbeiten

4. ⚠️ **Passwort ändern**
   - Im Settings-Bereich
   - Test-Passwort durch sicheres ersetzen

5. 📊 **Monitoring aktivieren**
   - Coolify-Metriken prüfen
   - Logs überwachen
   - Performance testen

---

## 🔗 Hilfreiche Links

- **GitHub Repo:** https://github.com/PDG1999/tool-sucht-indentifizierer.git
- **Coolify Dashboard:** [Dein Coolify URL]
- **Frontend:** https://screening.samebi.net
- **Backend API:** https://api.samebi.net
- **Dokumentation:** `SUPERVISOR_DASHBOARD_FIXES.md`
- **Account-Anleitung:** `SUPERVISOR_ACCOUNT_ANLEITUNG.md`

---

## 💡 Wichtige Hinweise

- ✅ **Alle Änderungen sind backward-compatible**
- ✅ **Bestehende Berater-Accounts funktionieren weiter**
- ✅ **Keine Breaking Changes**
- ⚠️ **SQL-Script muss manuell ausgeführt werden**
- ⚠️ **Test-Passwort nach Login ändern**

---

**Deployment-Ready! Alle Code-Änderungen sind Coolify-kompatibel! 🎉**

Bei Fragen oder Problemen: Siehe Troubleshooting-Section oder `SUPERVISOR_DASHBOARD_FIXES.md`

