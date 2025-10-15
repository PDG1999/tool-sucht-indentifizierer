# 🧠 Sucht-Identifikator Tool - SAMEBI

Ein professionelles, getarntes Screening-Tool für Psychologen und Berater zur Früherkennung von Suchtverhalten.

## 🎯 Features

- **40 Anti-Gaming-Fragen**: Clever getarnte Fragen, die nicht durchschaubar sind
- **Dual-Scoring-System**: 
  - Teilnehmer sieht "Lebensbalance-Check" (nicht bedrohlich)
  - Berater sieht detailliertes Sucht-Risiko-Profil
- **5 Sucht-Kategorien**: Spielsucht, Alkohol, Substanzen, Kaufsucht, Digital-Sucht
- **Wissenschaftlich fundiert**: Basiert auf DSM-5 und validierten Screening-Tools
- **Sofort einsatzbereit**: Keine Installation, läuft im Browser

## 🚀 Quick Start

### Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Build für Produktion
npm run build
```

### Docker Deployment

```bash
# Container bauen und starten
docker-compose up -d

# Oder mit Coolify deployen
# Coolify erkennt automatisch die coolify.json Konfiguration
```

## 📊 Wie es funktioniert

### 1. Anti-Gaming Design
- **Reverse Scoring**: 50% der Fragen sind umgekehrt formuliert
- **Context-Dependent**: Gleiche Antwort = unterschiedliche Bedeutung
- **Forced-Choice**: Statt Likert-Skala werden konkrete Optionen angeboten
- **Control Questions**: Konsistenz-Checks gegen Manipulation
- **Narrative Flow**: Fragen wirken wie eine Story, nicht wie Test

### 2. Dual-Scoring-System

**Für Teilnehmer (öffentlich):**
- "Lebensbalance-Check" mit 5 Bereichen
- Positive, nicht bedrohliche Sprache
- Allgemeine Wellness-Empfehlungen

**Für Berater (professionell):**
- Detailliertes Sucht-Risiko-Profil
- 5 Kategorien mit individuellen Scores
- Primäre Verdachtsdiagnose
- Konkrete Handlungsempfehlungen
- Konsistenz- und Confidence-Metriken

### 3. Wissenschaftliche Basis

- **DSM-5 Kriterien** für Substanz-Störungen (angepasst)
- **SOGS-Fragen** für Spielsucht adaptiert
- **AUDIT-C Prinzipien** für Alkohol
- **Bergen Social Media Addiction Scale** für Digital-Sucht
- **Schwellenwerte** kalibriert für hohe Sensitivität (>80%)

## 🎯 Zielgruppen

### Primär: Psychologen & Berater
- Früherkennung bei Klienten
- Erstgespräch-Vorbereitung
- Risiko-Assessment
- Dokumentation für Akte

### Sekundär: Angehörige
- Subtile Beobachtungshilfe
- Gesprächsansätze
- Ressourcen-Empfehlungen

## 📁 Projektstruktur

```
src/
├── components/
│   ├── ScreeningTest.tsx    # Hauptkomponente mit Dual-Scoring
│   ├── LandingPage.tsx      # Startseite
│   ├── PrivacyPolicy.tsx    # Datenschutz
│   └── TermsOfService.tsx   # AGB
├── data/
│   └── questions.ts         # 40 Anti-Gaming-Fragen
├── utils/
│   └── scoring.ts           # Dual-Scoring-Algorithmus
├── App.tsx                  # Routing
└── main.tsx                 # Entry Point
```

## 🔧 Konfiguration

### Environment Variables
```bash
NODE_ENV=production
VITE_API_URL=https://api.samebi.net
VITE_GA_TRACKING_ID=G-XXXXXXXXX
```

### Docker
- **Port**: 3002 (Host) → 80 (Container)
- **Health Check**: `/health`
- **Nginx**: Optimiert für SPA-Routing

## 📊 Scoring-Details

### Öffentliche Scores (0-100)
- Zeitmanagement & Prioritäten
- Finanzielle Gesundheit
- Emotionale Stabilität
- Soziale Verbindungen
- Körperliche Gesundheit

### Professionelle Scores (0-100)
- **Spielsucht**: 12 Indikatoren
- **Alkohol**: 10 Indikatoren
- **Substanzen**: 8 Indikatoren
- **Kaufsucht**: 10 Indikatoren
- **Digital-Sucht**: 8 Indikatoren

### Risiko-Level
- **0-20%**: Kein Risiko ✅
- **21-40%**: Niedriges Risiko 🟢
- **41-60%**: Mittleres Risiko 🟡
- **61-80%**: Hohes Risiko 🟠
- **81-100%**: Kritisches Risiko 🔴

## 🚨 Ethische Hinweise

- **Nur für Profis**: Tool ist für qualifizierte Fachkräfte bestimmt
- **Screening, nicht Diagnose**: Ergebnisse dienen der Orientierung
- **Informed Consent**: Klienten sollten über Screening informiert werden
- **Vertraulichkeit**: Alle Daten werden anonym behandelt
- **DSGVO-konform**: Server in Deutschland, keine Tracking-Cookies

## 🔗 Integration

### SAMEBI-Ökosystem
- Nutzt bestehende API-Infrastruktur
- Integriert in Coolify-Deployment
- Konsistentes Design-System
- Multi-Language-Support (geplant)

### API-Endpoints (geplant)
```
POST /api/screening/results
GET  /api/screening/analytics
POST /api/screening/export
```

## 📈 Roadmap

### Phase 1: MVP ✅
- [x] 40 Anti-Gaming-Fragen
- [x] Dual-Scoring-System
- [x] Responsive Design
- [x] Docker-Deployment

### Phase 2: Enhancement
- [ ] Multi-Language (DE/EN/ES)
- [ ] PDF-Export
- [ ] API-Integration
- [ ] Analytics-Dashboard

### Phase 3: AI-Powered
- [ ] CARE AI-Coach
- [ ] MENTOR Berater-Assistent
- [ ] SCOUT Trend-Analyzer
- [ ] Predictive Analytics

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 🆘 Support

Bei Fragen oder Problemen:
- **Technisch**: GitHub Issues
- **Fachlich**: Kontakt über SAMEBI
- **Dringend**: Direkter Kontakt zum Entwickler

---

**Wichtig**: Dieses Tool ist ein Screening-Instrument, keine diagnostische Methode. 
Alle Ergebnisse sollten von qualifizierten Fachkräften interpretiert werden.
# Trigger rebuild
