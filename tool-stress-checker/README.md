# Stress-Checker Tool - SAMEBI

## 🎯 Übersicht
Wissenschaftlich validierter Stress-Level Test für Psychologen und deren Klienten.

## 🚀 Live Demo
- **Production:** https://stress-checker.samebi.net
- **Staging:** https://stress-checker-staging.samebi.net

## 🛠️ Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** PostgreSQL + PostgREST
- **Deployment:** Coolify (Auto-Deploy)
- **Analytics:** Google Analytics 4

## 📊 Features

### Core Functionality
- ✅ 15-Fragen Stress-Assessment
- ✅ Sofort-Auswertung (0-100 Score)
- ✅ Personalisierte Empfehlungen
- ✅ PDF-Report Download
- ✅ Email-Capture für detaillierte Analyse

### Business Features
- ✅ Lead-Generation Pipeline
- ✅ Conversion-Tracking
- ✅ A/B-Test Ready
- ✅ SEO-Optimiert
- ✅ Mobile-First Design

## 🎨 User Journey

```
Landing Page → Test Start → 15 Fragen → Ergebnis → Email-Capture → PDF-Download
     ↓              ↓           ↓          ↓           ↓             ↓
  Analytics    Progress     Validation   Score    Lead Capture   Conversion
```

## 📈 Conversion Funnel
- **Landing Page:** 100% Besucher
- **Test Start:** 65% (Ziel: 70%)
- **Test Completion:** 80% (Ziel: 85%)
- **Email Capture:** 45% (Ziel: 50%)
- **PDF Download:** 90% (Ziel: 95%)

## 🚀 Quick Start

### Lokale Entwicklung
```bash
git clone https://github.com/PDG1999/tool-stress-checker.git
cd tool-stress-checker
npm install
npm run dev
```

### Coolify Deployment
```bash
git push origin main
# → Auto-Deploy auf stress-checker.samebi.net
```

## 📁 Projekt Struktur
```
tool-stress-checker/
├── src/
│   ├── components/
│   │   ├── StressTest.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── ResultDisplay.tsx
│   │   └── EmailCapture.tsx
│   ├── hooks/
│   │   ├── useStressTest.ts
│   │   └── useAnalytics.ts
│   ├── utils/
│   │   ├── scoring.ts
│   │   └── recommendations.ts
│   └── types/
├── public/
├── tests/
└── docs/
```

## 🧮 Scoring Algorithm

### Stress-Level Kategorien
- **0-25:** Niedriger Stress (Grün)
- **26-50:** Moderater Stress (Gelb)  
- **51-75:** Hoher Stress (Orange)
- **76-100:** Kritischer Stress (Rot)

### Fragen-Gewichtung
```typescript
const questionWeights = {
  sleep: 1.2,        // Schlafqualität
  workload: 1.1,     // Arbeitsbelastung
  relationships: 1.0, // Beziehungen
  physical: 1.1,     // Körperliche Symptome
  emotional: 1.2     // Emotionale Belastung
};
```

## 💰 Business Metrics

### Ziel-KPIs
- **Daily Users:** 50-100
- **Conversion Rate:** 45%
- **Lead Quality Score:** 8/10
- **Cost per Lead:** <5€
- **Monthly Revenue:** 1.500-3.000€

### Upsell-Pipeline
1. **Freemium:** Basis-Test (kostenlos)
2. **Premium:** Detaillierte Analyse (19€)
3. **Coaching:** 1:1 Stress-Coaching (97€)
4. **Program:** 4-Wochen Stress-Management (497€)

## 🔧 Configuration

### Environment Variables
```env
VITE_API_URL=https://api.samebi.net
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
VITE_EMAIL_SERVICE_URL=https://api.samebi.net/email
```

## 📊 Analytics Events
- `stress_test_started`
- `stress_test_question_answered`
- `stress_test_completed`
- `email_captured`
- `pdf_downloaded`
- `upsell_clicked`

## 🧪 A/B Tests
- **Landing Page:** CTA-Button Farbe
- **Questions:** Reihenfolge der Fragen
- **Results:** Empfehlungs-Format
- **Email Capture:** Incentive-Text

## 📞 Support
- **Entwickler:** PDG1999
- **Status:** Production Ready
- **Last Update:** $(date)
