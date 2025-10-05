# 🚀 Quick Start - Familie/Freunde Version

## Schnellstart in 5 Minuten

### 1️⃣ Dependencies installieren

```bash
cd family-version
npm install
```

### 2️⃣ Development Server starten

```bash
npm run dev
```

Die App läuft auf: **http://localhost:3003**

### 3️⃣ Testen

1. Öffne http://localhost:3003
2. Klicke auf "Test jetzt starten"
3. Beantworte die 40 Fragen
4. Sieh dir die Ergebnisse an

## 📦 Production Build

```bash
# Build erstellen
npm run build

# Preview des Builds
npm run preview
```

## 🐳 Docker Deployment

```bash
# Container bauen und starten
docker-compose up -d --build

# Logs ansehen
docker-compose logs -f

# Stoppen
docker-compose down
```

Die App läuft auf: **http://localhost:3003**

## 🌐 Live Deployment (Coolify)

1. **In Coolify:**
   - Neue App erstellen
   - Repository verbinden
   - Build Path: `/family-version`
   - Domain: `sucht-check.samebi.net`

2. **Environment setzen:**
   ```
   NODE_ENV=production
   VITE_APP_TYPE=family
   VITE_TARGET_AUDIENCE=relatives
   VITE_LANGUAGE=de
   ```

3. **Deploy klicken** → Fertig! 🎉

## 📝 Verfügbare Scripts

| Command | Beschreibung |
|---------|--------------|
| `npm run dev` | Development Server (Port 3003) |
| `npm run build` | Production Build |
| `npm run preview` | Build-Preview |
| `npm run lint` | Code Linting |

## 🔧 Konfiguration anpassen

Bearbeite diese Dateien:

- **Fragen:** `src/data/familyQuestions.ts`
- **Scoring:** `src/utils/familyScoring.ts`
- **UI-Texte:** `src/components/*`
- **Styling:** `src/index.css`, `tailwind.config.js`
- **Environment:** `.env` (erstelle von `.env.example`)

## ⚡ Tipps

### Hot Reload funktioniert nicht?
```bash
# Server neu starten
npm run dev
```

### Port 3003 ist belegt?
```bash
# In vite.config.ts Port ändern
server: {
  port: 3004  // Neuer Port
}
```

### Build-Fehler?
```bash
# Node modules neu installieren
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Weitere Dokumentation

- **Komplettes README:** [README.md](./README.md)
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Features:** [FEATURES.md](./FEATURES.md)

## 🆘 Probleme?

1. Prüfe die Konsole (Browser Dev Tools)
2. Schaue in die Logs: `docker-compose logs`
3. Erstelle ein GitHub Issue

---

**Viel Erfolg! 💙**

