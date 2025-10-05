# 🚀 Backend Setup Anleitung

## 📋 Voraussetzungen

- Node.js 18+ installiert
- PostgreSQL 14+ installiert
- Git installiert

## 🔧 Setup Schritte

### 1. PostgreSQL Datenbank erstellen

```bash
# PostgreSQL starten
brew services start postgresql@14

# Datenbank erstellen
createdb samebi_screening

# Oder via psql:
psql postgres
CREATE DATABASE samebi_screening;
\q
```

### 2. Datenbank-Schema erstellen

```bash
cd backend
psql samebi_screening < src/migrations/001_create_tables.sql
```

### 3. Environment Variables konfigurieren

```bash
cd backend
cp env.example .env
```

Bearbeite `.env`:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/samebi_screening

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3002

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Dependencies installieren

```bash
cd backend
npm install
```

### 5. Backend starten

```bash
# Development
npm run dev

# Production
npm start
```

Backend läuft auf: **http://localhost:3001**

## 🧪 API Testen

### Health Check:
```bash
curl http://localhost:3001/health
```

### Test-Ergebnis speichern (ohne Auth):
```bash
curl -X POST http://localhost:3001/api/test-results/submit \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [{"questionId": "q1", "answer": 3}],
    "publicScores": {"overallBalance": 75},
    "professionalScores": {"overallRisk": 45},
    "riskLevel": "mittel",
    "primaryConcern": "Digital"
  }'
```

### Berater registrieren:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Mueller",
    "email": "mueller@example.com",
    "password": "SecurePassword123!",
    "practiceName": "Praxis Mueller"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mueller@example.com",
    "password": "SecurePassword123!"
  }'
```

## 📊 Frontend mit Backend verbinden

### 1. Frontend Environment Variables:

Erstelle `.env` im Frontend-Root:

```env
VITE_API_URL=http://localhost:3001/api
```

### 2. Frontend starten:

```bash
npm run dev
```

Frontend läuft auf: **http://localhost:3002**

## 🎯 Kompletter Workflow

1. **Backend starten:**
   ```bash
   cd backend && npm run dev
   ```

2. **Frontend starten:**
   ```bash
   cd .. && npm run dev
   ```

3. **Test durchführen:**
   - Öffne http://localhost:3002/test
   - Fülle Fragebogen aus
   - Test-Ergebnisse werden automatisch in DB gespeichert

4. **Dashboard öffnen:**
   - Öffne http://localhost:3002/dashboard
   - Login mit registriertem Berater-Account
   - Alle gespeicherten Tests werden angezeigt

## 🔐 Berater-Account erstellen

Via API:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dein Name",
    "email": "deine@email.com",
    "password": "DeinesSicheresPas swort123!",
    "practiceName": "Deine Praxis"
  }'
```

Oder via Frontend (noch zu implementieren):
- Dashboard → "Registrieren" Button

## 📦 Deployment

### Coolify Deployment:

1. **PostgreSQL in Coolify erstellen**
2. **Backend deployen:**
   - Repository: https://github.com/PDG1999/tool-sucht-identifizierer
   - Branch: main
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables aus `.env` setzen

3. **Frontend deployen:**
   - Wie gewohnt via Docker
   - Environment Variable: `VITE_API_URL=https://api.screening.samebi.net`

## 🐛 Troubleshooting

### Problem: "Connection refused"
- PostgreSQL läuft nicht: `brew services start postgresql@14`
- Falsche DATABASE_URL in `.env`

### Problem: "JWT malformed"
- JWT_SECRET in `.env` fehlt oder zu kurz (min. 32 Zeichen)

### Problem: "CORS error"
- CORS_ORIGIN in Backend `.env` auf Frontend-URL setzen
- Frontend-URL in Backend server.js prüfen

### Problem: "Test-Ergebnisse nicht sichtbar"
- Backend läuft nicht: `cd backend && npm run dev`
- API_URL im Frontend falsch: `.env` prüfen
- Browser-Konsole für Fehler prüfen

## 📚 API Dokumentation

### Endpoints:

#### Public (kein Auth erforderlich):
- `POST /api/test-results/submit` - Test-Ergebnis speichern

#### Authenticated (JWT Token erforderlich):
- `GET /api/clients` - Alle Klienten des Beraters
- `GET /api/test-results` - Alle Test-Ergebnisse
- `GET /api/test-results/client/:clientId` - Tests eines Klienten
- `PUT /api/test-results/:id` - Test-Notizen aktualisieren
- `POST /api/test-results/:id/assign` - Test zuweisen
- `GET /api/test-results/stats/dashboard` - Dashboard-Statistiken

## 🎉 Fertig!

Das Backend ist jetzt eingerichtet und bereit, Test-Ergebnisse zu speichern und über das Dashboard auszuwerten!

