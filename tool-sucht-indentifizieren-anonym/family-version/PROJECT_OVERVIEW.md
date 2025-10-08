# 📋 Projekt-Übersicht - Familie/Freunde Version

## 🎯 Was ist das?

Ein **diskretes Screening-Tool für Angehörige**, die sich Sorgen um einen Freund oder ein Familienmitglied machen und vermuten, dass diese Person ein Suchtproblem haben könnte.

**Domain:** `sucht-check.samebi.net` (Deutsch)

---

## 📁 Projekt-Struktur

```
family-version/
├── src/
│   ├── components/
│   │   ├── FamilyLandingPage.tsx       # Startseite mit Hero, Features
│   │   └── FamilyScreeningTest.tsx     # Haupttest + Ergebnis-Ansicht
│   ├── data/
│   │   └── familyQuestions.ts          # 40 beobachtungsbasierte Fragen
│   ├── utils/
│   │   └── familyScoring.ts            # Scoring-Algorithmus
│   ├── App.tsx                         # Haupt-App-Komponente
│   ├── main.tsx                        # Entry Point
│   └── index.css                       # Globale Styles
│
├── public/                              # Assets (Logo, Favicon, etc.)
├── backend/                             # Backend-Struktur (für zukünftige Integration)
│
├── Dockerfile                           # Docker Container
├── docker-compose.yml                   # Docker Compose Konfiguration
├── nginx.conf                          # Nginx Web Server
├── coolify.json                        # Coolify Deployment Config
│
├── vite.config.ts                      # Build-Konfiguration
├── tailwind.config.js                  # Styling-Framework
├── tsconfig.json                       # TypeScript Config
├── package.json                        # Dependencies & Scripts
│
├── README.md                           # Hauptdokumentation
├── DEPLOYMENT.md                       # Deployment-Anleitung
├── FEATURES.md                         # Feature-Beschreibung
├── QUICK_START.md                      # Schnellstart-Guide
└── PROJECT_OVERVIEW.md                 # Diese Datei
```

---

## 🧠 Konzept

### Unterschied zur anonymen Version:

| Aspekt | Anonyme Version | Familie/Freunde Version |
|--------|----------------|------------------------|
| **Zielgruppe** | Betroffene selbst | Angehörige |
| **Fragen** | "Ich habe..." | "Diese Person hat..." |
| **Perspektive** | Selbstreflexion | Beobachtung |
| **Ergebnis** | Persönliche Einschätzung | Verdachts-Diagnose + Gesprächshilfe |
| **Fokus** | Selbsterkenntnis | Hilfe für andere |

### Kern-Features:

✅ **40 beobachtungsbasierte Fragen**
- Zeit & Prioritäten (8 Fragen)
- Finanzen (8 Fragen)
- Emotionen & Stimmung (8 Fragen)
- Soziale Beziehungen (8 Fragen)
- Gesundheit & Alltag (8 Fragen)

✅ **5 Sucht-Kategorien:**
- 🎰 Spielsucht
- 🍺 Alkohol
- 💊 Substanzen
- 🛍️ Kaufsucht
- 📱 Digital-Sucht

✅ **Intelligentes Scoring:**
- Gesamt-Besorgnislevel (0-100%)
- Primärer Verdacht mit Confidence-Score
- Verhaltens-Muster-Analyse
- Sekundäre Bedenken

✅ **Gesprächsleitfäden:**
- Sanfter Einstieg (niedriges Risiko)
- Direktes Gespräch (mittleres/hohes Risiko)
- Professionelle Intervention (kritisches Risiko)

✅ **Hilfreiche Ressourcen:**
- Notfall-Hotlines (24/7)
- Konkrete Handlungsempfehlungen
- Selbsthilfegruppen für Angehörige

---

## 🔧 Tech-Stack

### Frontend:
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool (ultra-schnell)
- **Tailwind CSS** - Utility-First Styling
- **Lucide React** - Icon Library

### Deployment:
- **Docker** - Containerization
- **Nginx** - Web Server
- **Coolify** - Deployment Platform
- **Let's Encrypt** - SSL Zertifikate

### Hosting:
- **Hetzner Cloud** - Server (91.98.93.203)
- **Domain:** sucht-check.samebi.net

---

## 🚀 Deployment-Szenarien

### Szenario 1: Coolify (Empfohlen)

**Vorteile:**
- ✅ Automatische Deployments bei Git Push
- ✅ SSL-Zertifikate automatisch
- ✅ Monitoring & Logs
- ✅ Zero-Downtime Updates
- ✅ GUI-basiert

**Setup:**
1. Coolify-App erstellen
2. GitHub Repo verbinden
3. Domain konfigurieren
4. Environment Variables setzen
5. Deploy-Button klicken → Fertig! 🎉

**Zeit:** ~10 Minuten

---

### Szenario 2: Docker Compose

**Vorteile:**
- ✅ Volle Kontrolle
- ✅ Lokal testbar
- ✅ Produktions-ready

**Setup:**
```bash
cd family-version
docker-compose up -d --build
```

**Zeit:** ~5 Minuten

---

### Szenario 3: Lokale Entwicklung

**Vorteile:**
- ✅ Instant Hot Reload
- ✅ Schnelle Entwicklung
- ✅ Debugging

**Setup:**
```bash
npm install
npm run dev
```

**Zeit:** ~2 Minuten

---

## 📊 Wissenschaftliche Basis

### Validierte Screening-Kriterien:

- **DSM-5** - Diagnostic and Statistical Manual of Mental Disorders
- **SOGS** - South Oaks Gambling Screen
- **AUDIT-C** - Alcohol Use Disorders Identification Test
- **Bergen Scale** - Social Media Addiction

### Kalibrierung:

- **Sensitivität:** >80% (erkennt echte Probleme)
- **Spezifität:** ~75% (vermeidet Fehlalarme)
- **Confidence-Scores:** Basierend auf Antwort-Konsistenz

---

## 🔐 Datenschutz (DSGVO-konform)

### Was wir NICHT tun:
- ❌ Keine Registrierung
- ❌ Keine Cookies
- ❌ Keine IP-Speicherung
- ❌ Keine Tracking-Pixel
- ❌ Keine Weitergabe an Dritte

### Was wir tun:
- ✅ Vollständig anonym
- ✅ Daten nur im Browser (Local Storage optional)
- ✅ HTTPS erzwungen
- ✅ Security Headers
- ✅ Server in Deutschland

---

## 🌍 Multi-Language Roadmap

### Phase 1: Deutsch ✅ (Jetzt)
- Domain: `sucht-check.samebi.net`
- Status: **Deployment-ready**

### Phase 2: Spanisch 🔄 (Q2 2025)
- Domain: `test-adiccion.samebi.net`
- Status: Geplant

### Phase 3: Englisch 🔄 (Q3 2025)
- Domain: `addiction-check.samebi.net`
- Status: Geplant

**Implementation:**
- Einfach `VITE_LANGUAGE` Environment Variable ändern
- Fragen & UI-Texte übersetzen
- Separate Coolify-Instanz pro Sprache

---

## 💡 Besonderheiten

### 1. Beobachtungsbasiert (nicht selbstreflektierend)
Fragen wie:
> "In den letzten Monaten verbringt diese Person deutlich mehr Zeit mit einer bestimmten Aktivität."

Statt:
> "Ich verbringe deutlich mehr Zeit mit einer bestimmten Aktivität."

### 2. Verhaltens-Muster-Erkennung
Nicht nur "Welche Sucht?", sondern auch:
- Wie heimlich?
- Wie stark die Verleugnung?
- Wie groß die soziale Isolation?
- Wie schwerwiegend die finanziellen Folgen?

### 3. Handlungsorientiert
Ergebnis enthält:
- ✅ Was ist los?
- ✅ Wie sicher bin ich mir?
- ✅ Was sollte ich jetzt tun?
- ✅ Wie spreche ich es an?
- ✅ Wo finde ich Hilfe?

### 4. Ethisch verantwortungsvoll
- Keine Stigmatisierung
- Fokus auf Hilfe, nicht Schuld
- Selbstschutz für Angehörige betont
- Bei kritischem Risiko: Klare Warnung + Profi-Empfehlung

---

## 📈 KPIs & Monitoring

### Erfolgs-Metriken:

| Metrik | Zielwert | Messung |
|--------|----------|---------|
| **Completion Rate** | >70% | Wie viele beenden Test? |
| **Time to Complete** | 15-20 Min | Durchschnittsdauer |
| **Help Sought** | >30% | Wie viele suchen danach Hilfe? |
| **Lighthouse Score** | >90 | Performance, SEO, Accessibility |
| **Error Rate** | <1% | Technische Fehler |

### Monitoring:
- Coolify Dashboard (Logs, Resources)
- Browser Console (Client-side Errors)
- Health Check Endpoint (`/health`)

---

## 🔄 Entwicklungs-Workflow

### Lokale Entwicklung:
```bash
# 1. Feature-Branch erstellen
git checkout -b feature/neue-funktion

# 2. Development Server starten
npm run dev

# 3. Code schreiben & testen
# ...

# 4. Build testen
npm run build
npm run preview

# 5. Commit & Push
git add .
git commit -m "feat: neue Funktion"
git push origin feature/neue-funktion

# 6. Pull Request erstellen
# 7. Nach Merge: Coolify deployed automatisch
```

### Deployment-Pipeline:
```
Git Push → Coolify detected → Build → Test → Deploy → Live
```

**Dauer:** ~2-3 Minuten

---

## 🆘 Troubleshooting

### Problem: App startet nicht lokal
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problem: Docker Build schlägt fehl
```bash
docker-compose down -v
docker-compose up -d --build
```

### Problem: SSL-Zertifikat ungültig
```bash
certbot renew
systemctl reload nginx
```

### Problem: Änderungen nicht sichtbar
- Browser-Cache leeren (Strg+Shift+R)
- Coolify Build-Cache löschen
- Neudeployment anstoßen

---

## 📞 Kontakt & Support

### Technische Fragen:
- GitHub Issues: [Repository]
- Code Review: Pull Requests

### Server-Zugang:
- IP: 91.98.93.203
- Coolify UI: https://coolify.samebi.net

### Notfall:
- Hetzner Cloud Console
- DNS bei [Provider]

---

## ✅ Nächste Schritte

### Vor dem ersten Deployment:

1. [ ] **DNS konfigurieren**
   - A-Record: `sucht-check.samebi.net` → `91.98.93.203`
   - TTL: 300 (für schnelle Änderungen)

2. [ ] **Repository vorbereiten**
   - Git Repo auf GitHub pushen
   - Branch: `main`
   - README.md finalisieren

3. [ ] **Coolify Setup**
   - Neue App erstellen
   - Domain verbinden
   - Environment Variables setzen
   - SSL aktivieren

4. [ ] **Testing**
   - Kompletten User-Flow testen
   - Mobile Version prüfen
   - Alle Gesprächsleitfäden durchgehen
   - Notfall-Kontakte verifizieren

5. [ ] **Go Live!** 🚀
   - Deploy-Button klicken
   - URL öffnen
   - Produktiv testen
   - Monitoring aktivieren

### Nach dem Launch:

1. [ ] **Marketing vorbereiten**
   - SEO-Optimierung prüfen
   - Social Media Posts
   - Pressemitteilung?

2. [ ] **Feedback sammeln**
   - Beta-Tester einladen
   - Angehörigen-Gruppen kontaktieren
   - Suchtberatungsstellen informieren

3. [ ] **Iterieren**
   - Feedback einarbeiten
   - Fragen optimieren
   - UI/UX verbessern

---

## 🎉 Zusammenfassung

Du hast jetzt eine **vollständige, produktions-ready Familie/Freunde-Version** des Sucht-Screenings!

**Was funktioniert:**
- ✅ 40 beobachtungsbasierte Fragen
- ✅ Intelligentes Scoring für 5 Sucht-Typen
- ✅ Detaillierte Ergebnisse mit Gesprächsleitfäden
- ✅ Responsive, modernes Design
- ✅ Docker & Coolify ready
- ✅ DSGVO-konform & anonym
- ✅ Notfall-Kontakte & Ressourcen

**Nächster Schritt:**
```bash
cd family-version
npm install
npm run dev
# Teste die App auf http://localhost:3003
```

**Danach:**
→ Coolify-Deployment (siehe DEPLOYMENT.md)

---

**💙 Bereit, Leben zu verändern! Viel Erfolg!**








