# 🎯 SAMEBI Master-Template System

**Das wiederverwendbare Template-System für 150+ psychologische Assessment-Tools**

Version: 1.0.0  
Erstellt: Oktober 2025  
Status: ✅ Production-Ready

---

## 📋 ÜBERSICHT

Dieses Master-Template ist die **Grundlage für alle SAMEBI-Tools**. Es bietet:

- ✅ **Multi-Language Support** (DE/EN/ES)
- ✅ **Wiederverwendbare React-Komponenten**
- ✅ **TypeScript** für Type-Safety
- ✅ **Tailwind CSS** für schnelles Styling
- ✅ **Lead-Capture** mit Validation
- ✅ **Assessment-Flow** Management
- ✅ **Analytics-Integration**
- ✅ **API-Services** für Backend-Communication

---

## 🏗️ ARCHITEKTUR

```
tool-template-master/
├── src/
│   ├── templates/
│   │   └── AssessmentTemplate.tsx    # Haupt-Template für Assessments
│   ├── components/
│   │   ├── shared/                   # Wiederverwendbare UI-Components
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   └── ResultCard.tsx
│   │   └── forms/
│   │       └── LeadCapture.tsx       # Email-Erfassung
│   ├── hooks/
│   │   ├── useToolConfig.ts          # Config-Loader Hook
│   │   └── useLeadCapture.ts         # Lead-Submission Hook
│   ├── services/
│   │   ├── api.service.ts            # Backend-API Client
│   │   └── config.service.ts         # Tool-Config Loader
│   ├── types/
│   │   └── tool.types.ts             # TypeScript Definitionen
│   ├── i18n/
│   │   ├── index.ts                  # i18n Setup
│   │   └── translations/
│   │       ├── de.json               # Deutsche Übersetzungen
│   │       ├── en.json               # Englische Übersetzungen
│   │       └── es.json               # Spanische Übersetzungen
│   └── config/
│       └── api-config.ts             # API & Environment Config
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 🚀 QUICK START

### 1. Neues Tool erstellen

```bash
# Tool-Generator nutzen (kommt in Phase 1, Tag 3)
npm run generate-tool -- --config="../shared-cms/content/tools/anxiety-test.json"

# Oder manuell:
cp -r tool-template-master/ tool-anxiety-test/
cd tool-anxiety-test/
npm install
```

### 2. Tool-Config erstellen

Erstelle eine JSON-Config in `shared-cms/content/tools/`:

```json
{
  "id": "anxiety-test",
  "type": "assessment",
  "metadata": {
    "title": {
      "de": "Angst-Test",
      "en": "Anxiety Test",
      "es": "Test de Ansiedad"
    },
    "description": {
      "de": "Erkennen Sie Ihre Angstsymptome",
      "en": "Identify your anxiety symptoms",
      "es": "Identifique sus síntomas de ansiedad"
    }
  },
  "questions": [ /* ... */ ],
  "scoring": { /* ... */ },
  "leadCapture": {
    "enabled": true,
    "trigger": "before_result"
  }
}
```

### 3. Environment konfigurieren

Erstelle `.env` Files für jede Sprache:

```bash
# .env.de
VITE_LANGUAGE=de
VITE_API_URL=https://api.samebi.net
VITE_GA_TRACKING_ID=G-XXXXXXXXX-DE

# .env.en
VITE_LANGUAGE=en
VITE_API_URL=https://api.samebi.net
VITE_GA_TRACKING_ID=G-XXXXXXXXX-EN

# .env.es
VITE_LANGUAGE=es
VITE_API_URL=https://api.samebi.net
VITE_GA_TRACKING_ID=G-XXXXXXXXX-ES
```

### 4. Tool verwenden

```tsx
import { AssessmentTemplate } from './templates';
import { useToolConfig, useLeadCapture } from './hooks';

function App() {
  const { config, loading } = useToolConfig('anxiety-test');
  const { submitLead } = useLeadCapture();

  if (loading) return <div>Lädt...</div>;
  if (!config) return <div>Fehler beim Laden</div>;

  return (
    <AssessmentTemplate
      config={config}
      language="de"
      onLeadCapture={async (email) => {
        await submitLead(email, config.id, 'de', 85);
      }}
    />
  );
}
```

---

## 🎨 KOMPONENTEN

### AssessmentTemplate

**Das Herzstück** - Managed den gesamten Assessment-Flow:

```tsx
<AssessmentTemplate
  config={toolConfig}
  language="de"
  onLeadCapture={(email) => submitLead(email)}
  onComplete={(session) => console.log('Complete!', session)}
/>
```

**Features:**
- ✅ Step-Management (Questions → Lead-Capture → Result)
- ✅ State-Management für Antworten
- ✅ Score-Berechnung
- ✅ Progress-Tracking
- ✅ Analytics-Events

### QuestionCard

Universelle Fragen-Komponente für alle Frage-Typen:

```tsx
<QuestionCard
  question={question}
  value={answers[question.id]}
  language="de"
  onChange={(value) => setAnswer(question.id, value)}
/>
```

**Unterstützte Typen:**
- `single` - Radio-Buttons (Single-Choice)
- `scale` - Slider (z.B. 1-10)
- `text` - Textarea (Freitext)
- `multiple` - Checkboxes (geplant)

### LeadCapture

Email-Erfassung mit Validation:

```tsx
<LeadCapture
  onSubmit={async (email) => {
    await apiService.submitLead({ email, toolId, language, score });
  }}
/>
```

**Features:**
- ✅ React Hook Form + Zod Validation
- ✅ DSGVO-Checkbox
- ✅ Error-Handling
- ✅ Loading-States

### ResultCard

Ergebnis-Anzeige mit Score & Recommendations:

```tsx
<ResultCard
  result={{ score: 85, level: 'high', label: '...', description: '...' }}
  onDownloadPdf={() => generatePDF()}
  onShare={() => shareResult()}
/>
```

---

## 🔧 SERVICES & HOOKS

### useToolConfig

Lädt Tool-Konfiguration:

```ts
const { config, loading, error } = useToolConfig('anxiety-test');
```

### useLeadCapture

Lead-Submission:

```ts
const { submitLead, loading, success } = useLeadCapture();

await submitLead(email, toolId, language, score, metadata);
```

### apiService

Backend-Communication:

```ts
// Lead submitten
await apiService.submitLead(leadData);

// Usage tracken
await apiService.trackUsage({ toolId, sessionId, score });

// Checkout erstellen
await apiService.createCheckoutSession({ email, priceId });
```

---

## 🌍 MULTI-LANGUAGE

### i18n Setup

Automatische Spracherkennung via Environment-Variable:

```ts
// Wird automatisch aus VITE_LANGUAGE gelesen
const language = import.meta.env.VITE_LANGUAGE; // 'de' | 'en' | 'es'
```

### Übersetzungen hinzufügen

Füge in `src/i18n/translations/[lang].json` hinzu:

```json
{
  "myNewKey": {
    "title": "Mein Titel",
    "description": "Meine Beschreibung"
  }
}
```

Nutze im Code:

```tsx
const { t } = useTranslation();
<h1>{t('myNewKey.title')}</h1>
```

---

## 📊 BACKEND-INTEGRATION

### API-Endpoints (bereits konfiguriert)

```yaml
Base URL: https://api.samebi.net

Endpoints:
  POST /leads              # Lead-Submission
  POST /tool-usage         # Usage-Tracking
  POST /checkout           # Stripe-Checkout
  GET  /tools/{id}         # Tool-Config laden
```

### PostgreSQL Schema

Tools werden in `shared_core` Schema gespeichert:

```sql
-- Tools registrieren
INSERT INTO shared_core.tools (id, name_de, name_en, name_es, ...)
VALUES ('anxiety-test', 'Angst-Test', 'Anxiety Test', 'Test de Ansiedad', ...);

-- Leads speichern
INSERT INTO shared_core.leads (email, source_tool_id, source_language, ...)
VALUES ('user@email.com', 'anxiety-test', 'de', ...);
```

---

## 🎯 BEST PRACTICES (aus bestehenden Tools)

### 1. Environment-basierte Konfiguration

```ts
// ✅ GUT: Environment-Variable nutzen
const language = import.meta.env.VITE_LANGUAGE;

// ❌ SCHLECHT: Hardcoded
const language = 'de';
```

### 2. Routing für Multi-Page-Tools

```tsx
// Optional: Für komplexere Tools mit mehreren Pages
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/test" element={<AssessmentTemplate />} />
  <Route path="/results" element={<Results />} />
</Routes>
```

### 3. Meta-Tags dynamisch setzen

```ts
// SEO-Optimization
useEffect(() => {
  document.title = config.metadata.title[language];
  document.querySelector('meta[name="description"]')
    ?.setAttribute('content', config.metadata.description[language]);
}, [config, language]);
```

### 4. Analytics-Tracking

```ts
// Track wichtige Events
useEffect(() => {
  if (window.gtag) {
    window.gtag('event', 'tool_started', {
      tool_id: config.id,
      language: language,
    });
  }
}, []);
```

### 5. Error-Boundaries

```tsx
// Robuste Error-Handling
<ErrorBoundary fallback={<ErrorPage />}>
  <AssessmentTemplate {...props} />
</ErrorBoundary>
```

---

## 🧪 TESTEN

```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview

# Type-Check
npm run type-check
```

---

## 📦 DEPLOYMENT

### Mit Coolify:

1. Git push zum Repository
2. Coolify erkennt automatisch Änderungen
3. Build & Deploy automatisch
4. SSL automatisch via Let's Encrypt

### Manuell:

```bash
# Build erstellen
npm run build

# Docker Image bauen
docker build -t tool-anxiety-test .

# Deployen
docker run -p 80:80 tool-anxiety-test
```

---

## 🔄 UPDATES & WARTUNG

### Template updaten

Wenn das Master-Template verbessert wird:

```bash
# Neue Components/Features in bestehende Tools übernehmen
cp tool-template-master/src/components/shared/NewComponent.tsx \
   tool-anxiety-test/src/components/shared/
```

### Config-Changes

Tool-Configs können jederzeit aktualisiert werden ohne Code-Änderungen!

```bash
# Nur Config ändern
vim shared-cms/content/tools/anxiety-test.json

# Commit & Push
git add shared-cms/
git commit -m "Update anxiety-test questions"
git push
```

---

## 📝 TODO

- [ ] Error-Boundary Component
- [ ] PDF-Generation Service
- [ ] Offline-Support (PWA)
- [ ] Multi-Step-Forms (Wizard)
- [ ] Calculator-Template
- [ ] Quiz-Template

---

## 🤝 CONTRIBUTION

1. Bestehende Tools analysieren
2. Best-Practices extrahieren
3. Ins Template integrieren
4. Dokumentieren

---

## 📚 RESSOURCEN

- **Roadmap**: `SAMEBI-IMPLEMENTATION-ROADMAP.md`
- **Infrastructure**: `INFRASTRUCTURE.md`
- **Backend-Docs**: `herramientas-backend/README.md`
- **Shared-CMS**: `shared-cms/README.md`

---

**🎉 Happy Coding! Dieses Template macht das Erstellen neuer Tools super einfach!**
