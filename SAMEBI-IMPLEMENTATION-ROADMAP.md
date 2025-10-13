# 🚀 SAMEBI IMPLEMENTATION ROADMAP
## 150+ Apps Multi-Tool Platform - Vollständiger Implementierungsplan

**Ziel:** 50+ Tool-Typen × 3 Sprachen = 150+ Apps  
**Timeline:** 12 Wochen bis MVP, 6 Monate bis Full-Scale  
**Exit-Ziel:** 5-15M€ in 2-3 Jahren  
**Server:** 1× Hetzner CPX31 (19€/Monat) ausreichend für Start

---

## 📊 ÜBERSICHT: 4 HAUPT-PHASEN

```yaml
PHASE 1: Foundation (Woche 1-2)
├── Infrastructure Setup
├── Database & Backend
├── Template-System
└── Automation Pipeline

PHASE 2: First 5 Tools (Woche 3-4)
├── 5 High-ROI Tools
├── 3 Sprachen pro Tool = 15 Apps
├── Lead-Capture & Analytics
└── Payment-Integration

PHASE 3: Scaling (Woche 5-8)
├── Weitere 15 Tools = 45 Apps
├── Marketing Launch
├── White Label System
└── Dashboard Erweiterung

PHASE 4: Dominierung (Woche 9-12)
├── Restliche 30+ Tools
├── 150+ Apps Live
├── Automation Perfection
└── Exit-Ready Status
```

---

## 🎯 PHASE 1: FOUNDATION (Woche 1-2)

### **WOCHE 1: Infrastructure & Backend Setup**

#### **TAG 1: Server & Core Services (4-6 Stunden)**

**✅ SCHRITT 1.1: Server-Status prüfen**
```bash
# Aktueller Server-Status
ssh root@91.98.93.203

# Prüfen was läuft
docker ps
df -h  # Disk Space
free -m  # RAM
htop  # CPU Usage
```

**Checkpoint:** Server-Zugriff funktioniert, Coolify läuft

---

**✅ SCHRITT 1.2: Redis installieren (15 Minuten)**
```bash
# In Coolify Dashboard
1. Navigate zu "Resources" → "+ New Resource"
2. Wähle "Database" → "Redis"
3. Name: redis-shared
4. Version: 7-alpine (neueste stabile)
5. Click "Create"

# Nach Deployment (2-3 Minuten):
# Connection String notieren:
redis://redis-shared:6379

# Testen
docker exec -it redis-shared redis-cli
> PING
# Sollte antworten: PONG
> exit
```

**Checkpoint:** Redis läuft, PING gibt PONG zurück

---

**✅ SCHRITT 1.3: PostgreSQL Schema erweitern (30 Minuten)**
```bash
# In Coolify: herramientas-backend → Terminal öffnen

# PostgreSQL Connection testen
psql -U postgres -d herramientas

# Schema-Struktur anlegen
```

```sql
-- 1. Shared Core Schema erstellen
CREATE SCHEMA IF NOT EXISTS shared_core;

-- 2. Tools Tabelle (Master-Liste aller Tools)
CREATE TABLE shared_core.tools (
  id TEXT PRIMARY KEY,
  name_de TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  subdomain_de TEXT NOT NULL,
  subdomain_en TEXT NOT NULL,
  subdomain_es TEXT NOT NULL,
  type TEXT CHECK (type IN ('assessment', 'calculator', 'quiz', 'analyzer')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tool Usage Tracking
CREATE TABLE shared_core.tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id TEXT REFERENCES shared_core.tools(id),
  language TEXT CHECK (language IN ('de', 'en', 'es')),
  session_id UUID,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  completion_score INTEGER,
  user_data JSONB,
  geo_data JSONB
);

-- 4. Leads Tabelle
CREATE TABLE shared_core.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source_tool_id TEXT REFERENCES shared_core.tools(id),
  source_language TEXT,
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- 5. Course Access (für Monetarisierung)
CREATE TABLE shared_core.course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  course_id TEXT NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  amount_paid DECIMAL(10,2),
  stripe_session_id TEXT,
  access_granted BOOLEAN DEFAULT true
);

-- 6. White Label Clients
CREATE TABLE shared_core.white_label_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  custom_domain TEXT,
  tier TEXT CHECK (tier IN ('basic', 'pro', 'enterprise')),
  active BOOLEAN DEFAULT true,
  branding JSONB,  -- Logo, Farben, etc.
  enabled_tools TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Indizes für Performance
CREATE INDEX idx_tool_usage_tool_id ON shared_core.tool_usage(tool_id);
CREATE INDEX idx_tool_usage_language ON shared_core.tool_usage(language);
CREATE INDEX idx_tool_usage_started_at ON shared_core.tool_usage(started_at);
CREATE INDEX idx_leads_email ON shared_core.leads(email);
CREATE INDEX idx_leads_source_tool ON shared_core.leads(source_tool_id);
CREATE INDEX idx_leads_created_at ON shared_core.leads(created_at);

-- 8. Bestehende Tools registrieren
INSERT INTO shared_core.tools (id, name_de, name_en, name_es, subdomain_de, subdomain_en, subdomain_es, type, active) VALUES
  ('stress-test', 'Stress-Test', 'Stress Test', 'Test de Estrés', 'stress-test', 'stress-check', 'test-estres', 'assessment', true),
  ('burnout-test', 'Burnout-Test', 'Burnout Test', 'Test de Burnout', 'burnout-test', 'burnout-check', 'test-burnout', 'assessment', true),
  ('sucht-screening', 'Sucht-Screening', 'Addiction Screening', 'Evaluación de Adicción', 'sucht-check', 'addiction-check', 'evaluacion-adiccion', 'assessment', true);

-- Fertig!
\q
```

**Checkpoint:** Alle Tabellen erstellt, 3 Tools registriert

---

**✅ SCHRITT 1.4: N8N installieren (30 Minuten)**
```bash
# In Coolify: "+ New Resource" → "Service"

# Docker Compose Config:
```

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n-automation
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=automation.samebi.net
      - N8N_PROTOCOL=https
      - N8N_PORT=5678
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=SameBi2025Secure!
      - WEBHOOK_URL=https://automation.samebi.net/
      - GENERIC_TIMEZONE=Europe/Berlin
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - coolify

volumes:
  n8n_data:

networks:
  coolify:
    external: true
```

```bash
# Domain in Coolify konfigurieren:
# Domain: automation.samebi.net
# SSL: Auto (Let's Encrypt)

# Deploy! (dauert 2-3 Minuten)

# Nach Deployment:
# 1. Öffne https://automation.samebi.net
# 2. Login mit admin / SameBi2025Secure!
# 3. Setup-Wizard durchlaufen
```

**Checkpoint:** N8N läuft auf automation.samebi.net, Login funktioniert

---

#### **TAG 2: Template-System Grundlagen (6-8 Stunden)**

**✅ SCHRITT 2.1: Master-Template Repository erstellen**
```bash
cd /Volumes/SSD\ Samsung\ 970\ PDG/PDG-Tools-SAMEBI/

# Neues Template-Verzeichnis
mkdir tool-template-master
cd tool-template-master

# Vite React TypeScript Setup
npm create vite@latest . -- --template react-ts

# Dependencies installieren
npm install

# Zusätzliche Dependencies
npm install tailwindcss postcss autoprefixer
npm install @tanstack/react-query axios
npm install react-hook-form zod @hookform/resolvers
npm install i18next react-i18next
npm install recharts  # Für Analytics/Charts
```

**Checkpoint:** Template-Projekt initialisiert, Dependencies installiert

---

**✅ SCHRITT 2.2: Template-Struktur aufbauen**

**Cursor Prompt:**
```
Erstelle eine Master-Template-Struktur für psychologische Assessment-Tools mit folgenden Features:

STRUKTUR:
src/
├── templates/
│   ├── AssessmentTemplate.tsx  # Haupt-Template für Assessments
│   ├── QuizTemplate.tsx        # Template für Quizze
│   └── CalculatorTemplate.tsx  # Template für Rechner
├── components/
│   ├── QuestionCard.tsx        # Wiederverwendbare Fragen-Anzeige
│   ├── ProgressBar.tsx         # Fortschrittsanzeige
│   ├── ResultCard.tsx          # Ergebnis-Anzeige
│   ├── LeadCapture.tsx         # Email-Capture Form
│   └── LanguageSwitcher.tsx    # Sprach-Umschalter
├── config/
│   ├── tool-config.ts          # Tool-Konfiguration Typen
│   └── api-config.ts           # API-Endpoints
├── i18n/
│   ├── index.ts                # i18n Setup
│   ├── de.json                 # Deutsche Übersetzungen
│   ├── en.json                 # Englische Übersetzungen
│   └── es.json                 # Spanische Übersetzungen
├── hooks/
│   ├── useToolConfig.ts        # Tool-Config laden
│   ├── useTranslation.ts       # Übersetzungen
│   └── useLeadCapture.ts       # Lead-Capture Logik
├── services/
│   ├── api.service.ts          # API-Calls
│   ├── analytics.service.ts    # Analytics-Tracking
│   └── storage.service.ts      # LocalStorage Helper
└── types/
    └── tool.types.ts           # TypeScript Types

FEATURES:
- Multi-Language Support (DE/EN/ES)
- Dynamic Content aus Config
- Lead-Capture mit Email-Validation
- Analytics-Tracking integriert
- Responsive Design (Mobile-First)
- Error-Boundaries
- Loading-States
- SEO-optimiert (Meta-Tags dynamic)

TECH-STACK:
- React 18 + TypeScript
- Tailwind CSS
- React Hook Form + Zod
- TanStack Query
- i18next
- Axios

Erstelle die komplette Basis-Struktur mit allen Files.
```

**Checkpoint:** Template-Struktur vollständig, alle Komponenten erstellt

---

**✅ SCHRITT 2.3: Shared CMS Integration**

**Cursor Prompt:**
```
Erweitere das Template-System um Integration mit shared-cms:

1. Content-Loader Service erstellen:
   - Lädt Tool-Configs aus shared-cms/content/tools/
   - Caching-Mechanismus (LocalStorage + Expiry)
   - Fallback auf Default-Content

2. Tool-Config Format:
```

```typescript
interface ToolConfig {
  id: string;
  type: 'assessment' | 'quiz' | 'calculator';
  metadata: {
    title: { de: string; en: string; es: string };
    description: { de: string; en: string; es: string };
    keywords: { de: string[]; en: string[]; es: string[] };
  };
  questions: Question[];
  scoring: ScoringConfig;
  leadCapture: LeadCaptureConfig;
  analytics: AnalyticsConfig;
}
```

```
3. Implementiere Dynamic Rendering:
   - Template-Typ basierend auf config.type wählen
   - Content aus Config dynamisch rendern
   - Übersetzungen aus Config laden

4. Environment-basierte Sprach-Erkennung:
   - VITE_LANGUAGE aus .env lesen
   - Automatisch richtige Übersetzung wählen
   - Fallback auf Englisch
```

**Checkpoint:** CMS-Integration funktioniert, Tool lädt Config dynamisch

---

#### **TAG 3: Deployment-Automation (6-8 Stunden)**

**✅ SCHRITT 3.1: Tool-Generator Script**

**Cursor Prompt:**
```
Erstelle ein Node.js Script: tools/generate-tool.js

Das Script soll:

INPUT: Tool-Config JSON
OUTPUT: Komplettes deployable Tool in 3 Sprachen

FUNKTIONEN:
1. Template kopieren
2. Tool-Config einbinden
3. 3 Sprach-Versionen generieren:
   - tool-name-de/
   - tool-name-en/
   - tool-name-es/
4. Environment-Files erstellen (.env.de, .env.en, .env.es)
5. Coolify-Configs generieren (coolify.json × 3)
6. Docker-Configs generieren
7. README.md generieren

USAGE:
```

```bash
node tools/generate-tool.js --config=../shared-cms/content/tools/anxiety-test.json
```

```
BEISPIEL-OUTPUT:
tool-anxiety-test/
├── src/             # Kopiert von Template
├── .env.de          # VITE_LANGUAGE=de
├── .env.en          # VITE_LANGUAGE=en
├── .env.es          # VITE_LANGUAGE=es
├── coolify.de.json  # Deployment-Config DE
├── coolify.en.json  # Deployment-Config EN
├── coolify.es.json  # Deployment-Config ES
├── Dockerfile
└── README.md

Implementiere vollständig mit TypeScript + Zod für Validation.
```

**Checkpoint:** Generator-Script funktioniert, erstellt vollständige Tools

---

**✅ SCHRITT 3.2: N8N Deployment Workflow**

**In N8N (https://automation.samebi.net):**

**Workflow 1: "New Tool Deployment"**

```
1. Manual Trigger
   ↓
2. HTTP Request: Load Tool-Config
   URL: https://api.samebi.net/tools/configs/{{tool-id}}
   ↓
3. Function: Generate Tool Files
   Code: Ruft generate-tool.js auf
   ↓
4. Git Operations:
   - Git add
   - Git commit
   - Git push
   ↓
5. Coolify API: Create 3 Applications
   - POST /api/v1/applications (DE)
   - POST /api/v1/applications (EN)
   - POST /api/v1/applications (ES)
   ↓
6. DNS Configuration:
   - Cloudflare API: Create A-Records
   ↓
7. Notification:
   - Slack/Email: "Tool deployed!"
```

**Checkpoint:** N8N Workflow deployed, testet mit Dummy-Tool

---

#### **TAG 4: Analytics & Monitoring (4-6 Stunden)**

**✅ SCHRITT 4.1: Google Analytics Setup**

```bash
# Für jede Sprache separate GA4-Property:
1. analytics.google.com einloggen
2. Admin → Property erstellen:
   - SAMEBI Tools DE
   - SAMEBI Tools EN
   - SAMEBI Tools ES
3. Measurement IDs notieren:
   - G-XXXXXXXXX-DE
   - G-XXXXXXXXX-EN
   - G-XXXXXXXXX-ES
```

**In Template integrieren:**

**Cursor Prompt:**
```
Erstelle Analytics-Service in src/services/analytics.service.ts:

Features:
- Google Analytics 4 Integration
- Custom Events:
  - tool_started
  - question_answered
  - tool_completed
  - lead_captured
  - result_viewed
- User Properties:
  - tool_id
  - language
  - session_duration
- Ecommerce Events (für Kurse):
  - add_to_cart
  - begin_checkout
  - purchase

Implementation mit gtag.js
Environment-basierte Measurement-ID (aus .env)
```

**Checkpoint:** Analytics funktioniert, Events werden in GA4 angezeigt

---

**✅ SCHRITT 4.2: Uptime Monitoring**

```bash
# Uptime Robot Setup:
1. uptimerobot.com Account erstellen
2. "+ Add New Monitor":
   - Type: HTTPS
   - Name: Stress Test DE
   - URL: https://stress-test.samebi.net
   - Monitoring Interval: 5 Minutes
   - Alert: Email bei Down

3. Wiederholen für erste 15 Apps

# Kostenlos: 50 Monitors
# Reicht für Phase 1-2!
```

**Checkpoint:** Uptime Monitoring für 3 Tools aktiv

---

### **WOCHE 2: Dashboard & Lead-System**

#### **TAG 5-6: Admin Dashboard (12-16 Stunden)**

**✅ SCHRITT 5.1: Dashboard erweitern**

**Cursor Prompt:**
```
Erweitere tool-sucht-dashboard um Tool-Management:

NEUE SEITEN:

1. /admin/tools (Tool-Übersicht)
   - Grid mit allen Tools
   - Status-Indicator (🟢 Online, 🔴 Down)
   - Quick-Stats (Besucher heute, Leads heute)
   - Quick-Actions (Preview, Analytics, Settings)
   - Filter: Status, Sprache, Type

2. /admin/tools/:id (Tool-Details)
   - Live-Preview (iFrame)
   - Analytics-Charts (Recharts):
     - Besucher letzte 7 Tage
     - Completion-Rate
     - Lead-Conversion
   - Config-Editor (Tool-Config bearbeiten)
   - Deployment-History
   - Quick-Redeploy Button

3. /admin/leads (Lead-Management)
   - Tabelle mit allen Leads
   - Spalten: Email, Tool, Sprache, Score, Datum, Status
   - Filter: Tool, Sprache, Lead-Score, Datum
   - Bulk-Actions (Export CSV, Senden an Brevo)
   - Lead-Detail-View (Modal)

4. /admin/analytics (Gesamt-Analytics)
   - KPI-Cards:
     - Total Visitors (heute/Woche/Monat)
     - Total Leads
     - Conversion Rate
     - Revenue (bei Kursen)
   - Charts:
     - Traffic-Trend (Line Chart)
     - Top 5 Tools (Bar Chart)
     - Conversion-Funnel (Sankey)
   - Heatmap: Tools × Sprachen Performance

TECH-STACK:
- React + TypeScript
- TanStack Query (API-Calls)
- Recharts (Charts)
- TanStack Table (Tabellen)
- Zustand (State)
- React Hook Form (Forms)

API-Integration:
- GET /api/admin/tools
- GET /api/admin/tools/:id/analytics
- GET /api/admin/leads
- POST /api/admin/tools/:id/deploy

Implementiere vollständig mit responsivem Design.
```

**Checkpoint:** Dashboard-Seiten funktionieren, Daten werden angezeigt

---

**✅ SCHRITT 5.2: Backend-API für Dashboard**

**Cursor Prompt:**
```
Erstelle Backend-API-Endpoints in herramientas-backend:

src/routes/admin.js:

// Tool-Management
GET    /api/admin/tools
GET    /api/admin/tools/:id
GET    /api/admin/tools/:id/analytics
PUT    /api/admin/tools/:id
POST   /api/admin/tools/:id/deploy
DELETE /api/admin/tools/:id

// Lead-Management
GET    /api/admin/leads
GET    /api/admin/leads/:id
PUT    /api/admin/leads/:id
POST   /api/admin/leads/export
POST   /api/admin/leads/bulk-action

// Analytics
GET    /api/admin/analytics/overview
GET    /api/admin/analytics/tools-performance
GET    /api/admin/analytics/conversion-funnel

Implementierung:
- PostgreSQL Queries
- Admin-Auth Middleware (JWT)
- Input-Validation (Zod)
- Error-Handling
- Rate-Limiting

Beispiel-Response:
```

```json
{
  "success": true,
  "data": {
    "tools": [
      {
        "id": "stress-test",
        "name_de": "Stress-Test",
        "status": "online",
        "visitors_today": 234,
        "leads_today": 12,
        "completion_rate": 0.67
      }
    ]
  }
}
```

**Checkpoint:** API-Endpoints funktionieren, Dashboard zeigt echte Daten

---

#### **TAG 7: Lead-Capture & Brevo Integration (6-8 Stunden)**

**✅ SCHRITT 7.1: Brevo Account Setup**

```bash
# 1. Brevo Account erstellen
https://app.brevo.com/account/register

# 2. API-Key generieren:
Account → SMTP & API → API Keys → Generate

# 3. Contact-Listen erstellen:
Contacts → Lists:
- "SAMEBI Tools - DE Leads"
- "SAMEBI Tools - EN Leads"
- "SAMEBI Tools - ES Leads"
- "SAMEBI Tools - Hot Leads (Score >70)"

# 4. Email-Templates erstellen:
Campaigns → Templates → Create Template:
- "Willkommen + PDF Download"
- "15€ Nobrainer Upsell"
- "75€ Intensiv-Kurs Upsell"

# 5. Automation Workflows:
Automation → Create Workflow:
```

**Workflow: "Nobrainer Upsell"**
```
Trigger: Contact enters list "Hot Leads"
↓
Wait: 15 Minutes
↓
Send Email: "Willkommen + PDF"
↓
Condition: Email opened?
├─ Yes → Wait 24h → Send "15€ Upsell"
└─ No → Wait 48h → Resend "Willkommen"
```

**Checkpoint:** Brevo konfiguriert, Test-Email funktioniert

---

**✅ SCHRITT 7.2: Lead-Capture im Template**

**Cursor Prompt:**
```
Erweitere Template um Lead-Capture Integration:

src/components/LeadCapture.tsx:

Features:
- Email-Input mit Validation (Zod)
- DSGVO-Checkbox (required!)
- Loading-State während Submit
- Success/Error Messages
- Tracking (Analytics Event)

Flow:
1. User gibt Email ein
2. Frontend-Validation
3. POST zu /api/leads
4. Backend:
   - Save to PostgreSQL
   - Lead-Scoring berechnen
   - Send to Brevo (passende Liste)
   - Trigger N8N Webhook
5. Frontend:
   - Success-Message
   - Redirect zu Ergebnis mit PDF

API-Call:
POST /api/leads
Body: {
  email: string,
  tool_id: string,
  language: string,
  completion_score: number,
  user_data: object
}

Implementiere mit React Hook Form + Zod Validation.
Include DSGVO-compliant Checkbox und Privacy-Link.
```

**Checkpoint:** Lead-Capture funktioniert, Leads landen in Brevo

---

### **WOCHE 2 ABSCHLUSS: Testing & Validation**

**✅ Checkpoint-Liste:**
- [ ] Redis läuft und ist erreichbar
- [ ] PostgreSQL Schema vollständig
- [ ] N8N läuft auf automation.samebi.net
- [ ] Master-Template vollständig
- [ ] Tool-Generator erstellt Tools
- [ ] N8N Deployment-Workflow funktioniert
- [ ] Dashboard zeigt alle Tools
- [ ] Analytics trackt Events
- [ ] Uptime-Monitoring aktiv
- [ ] Lead-Capture funktioniert
- [ ] Brevo-Integration aktiv

---

## 🎯 PHASE 2: ERSTE 5 TOOLS (Woche 3-4)

### **Woche 3: High-ROI Tools entwickeln**

#### **Tool-Auswahl (basierend auf ROI-Potential):**

1. **Location-Analyzer** (Standort-Analyse) - Höchster ROI
2. **Rate-Calculator** (Stundensatz-Rechner) - Hoher ROI
3. **Stress-Test** (bereits vorhanden, optimieren)
4. **Burnout-Test** (bereits vorhanden, optimieren)
5. **Anxiety-Test** (Angst-Test) - Hohes Volumen

---

#### **TAG 8-10: Tool 1 - Location-Analyzer (2-3 Tage)**

**✅ Tool-Config erstellen:**

```json
// shared-cms/content/tools/location-analyzer.json
{
  "id": "location-analyzer",
  "type": "calculator",
  "metadata": {
    "title": {
      "de": "Standort-Analyse für Psychologen-Praxis",
      "en": "Location Analysis for Psychology Practice",
      "es": "Análisis de Ubicación para Consulta de Psicólogo"
    },
    "description": {
      "de": "Finden Sie den perfekten Standort für Ihre Praxis",
      "en": "Find the perfect location for your practice",
      "es": "Encuentra la ubicación perfecta para tu consulta"
    },
    "keywords": {
      "de": ["standortanalyse psychologe", "praxis standort", "psychologe praxis eröffnen"],
      "en": ["practice location analysis", "psychology office location"],
      "es": ["análisis ubicación psicólogo", "consulta psicología ubicación"]
    }
  },
  "inputs": [
    {
      "id": "address",
      "type": "address",
      "label": {
        "de": "Adresse oder PLZ eingeben",
        "en": "Enter address or postal code",
        "es": "Ingrese dirección o código postal"
      },
      "required": true,
      "validation": "address"
    },
    {
      "id": "radius",
      "type": "slider",
      "label": {
        "de": "Umkreis (km)",
        "en": "Radius (km)",
        "es": "Radio (km)"
      },
      "min": 1,
      "max": 20,
      "default": 5
    }
  ],
  "calculations": {
    "competitors": "google_places_api",
    "demographics": "census_api",
    "scoring": "weighted_algorithm"
  },
  "output": {
    "type": "detailed_report",
    "format": "pdf_download",
    "sections": [
      "competition_density",
      "demographic_fit",
      "accessibility_score",
      "price_potential",
      "recommendations"
    ]
  },
  "leadCapture": {
    "enabled": true,
    "trigger": "after_calculation",
    "incentive": "full_pdf_report",
    "upsell": "97_euro_course"
  }
}
```

**✅ Tool generieren:**
```bash
node tools/generate-tool.js --config=../shared-cms/content/tools/location-analyzer.json

# Generiert:
# tool-location-analyzer/
```

**✅ APIs integrieren:**

**Cursor Prompt:**
```
Implementiere Location-Analyzer Backend-Logik:

src/services/location-analyzer.service.ts:

1. Google Places API Integration:
   - Suche "Psychologe" im Radius
   - Zähle Wettbewerber
   - Extrahiere Reviews/Ratings

2. Demographics API:
   - Bevölkerungsdichte
   - Durchschnittsalter
   - Bildungsniveau
   - Einkommensniveau

3. Scoring-Algorithm:
   - Competition-Score (je weniger desto besser)
   - Demographics-Score (Zielgruppe vorhanden?)
   - Accessibility-Score (ÖPNV, Parkplätze)
   - Price-Potential (Kaufkraft × Demographie)
   
   Final-Score: 0-100

4. PDF-Report generieren:
   - Puppeteer oder jsPDF
   - Professionelles Layout
   - Charts (Recharts to Image)
   - Recommendations-Liste

Implementiere vollständig mit Error-Handling.
Include API-Key Management (Environment Variables).
```

**✅ Deploy:**
```bash
# Git commit & push
git add tool-location-analyzer/
git commit -m "feat: Location Analyzer Tool"
git push

# N8N Workflow triggern oder manuell in Coolify:
# 1. New Application × 3 (DE/EN/ES)
# 2. Domains konfigurieren:
#    - standort-analyse.samebi.net
#    - location-analyzer.samebi.net
#    - analisis-ubicacion.samebi.net
```

**Checkpoint:** Location-Analyzer live in 3 Sprachen, generiert PDFs

---

#### **TAG 11-12: Tool 2 - Rate-Calculator (1-2 Tage)**

**Schneller, da einfacher!**

**✅ Tool-Config:**
```json
// shared-cms/content/tools/rate-calculator.json
{
  "id": "rate-calculator",
  "type": "calculator",
  "metadata": { /* ... */ },
  "inputs": [
    {
      "id": "monthly_costs",
      "type": "currency",
      "label": { "de": "Monatliche Kosten (Miete, etc.)" }
    },
    {
      "id": "desired_income",
      "type": "currency",
      "label": { "de": "Gewünschtes Netto-Einkommen" }
    },
    {
      "id": "hours_per_week",
      "type": "number",
      "label": { "de": "Arbeitsstunden pro Woche" }
    },
    {
      "id": "weeks_vacation",
      "type": "number",
      "label": { "de": "Urlaubswochen pro Jahr" }
    }
  ],
  "calculations": {
    "taxes": "spanish_tax_system",
    "social_security": "autonomo_rates",
    "recommended_rate": "calculation_formula"
  }
}
```

**✅ Backend-Logik:**

**Cursor Prompt:**
```
Erstelle Rate-Calculator Backend:

Formeln:
1. Arbeitswochen/Jahr = 52 - Urlaub
2. Arbeitsstunden/Jahr = Arbeitswochen × Stunden/Woche
3. Brutto-Bedarf = Gewünschtes Netto × 1.5 (Steuern ~33%)
4. Total-Kosten = Miete × 12 + Betriebskosten
5. Benötigter Umsatz = Brutto-Bedarf + Total-Kosten
6. Mindest-Stundensatz = Benötigter Umsatz / Arbeitsstunden

7. Empfohlener Stundensatz = Mindest × 1.2 (Puffer)

Output:
- Mindest-Stundensatz
- Empfohlener Stundensatz
- Vergleich mit Marktpreisen (aus Datenbank)
- Monatsprognosen bei verschiedenen Auslastungen

Implementiere mit Zod-Validation für alle Inputs.
```

**✅ Deploy:** (wie Tool 1)

**Checkpoint:** Rate-Calculator live in 3 Sprachen

---

#### **TAG 13-14: Tools 3-5 - Assessments optimieren (2 Tage)**

**Stress-Test, Burnout-Test, Anxiety-Test**

**✅ Auf Template-System migrieren:**

**Cursor Prompt:**
```
Migriere bestehende Tools auf neues Template-System:

1. Stress-Test:
   - Extrahiere Fragen in Config-JSON
   - Migriere zu AssessmentTemplate
   - 3 Sprachen generieren
   - Lead-Capture integrieren

2. Burnout-Test:
   - Gleicher Prozess

3. Anxiety-Test:
   - Neu erstellen mit GAD-7 Fragen
   - AssessmentTemplate nutzen

Für alle 3:
- Professionelle Result-Cards
- PDF-Reports
- Email-Follow-Up Integration
- Analytics-Events

Deploy auf:
- stress-test.samebi.net / test-estres.samebi.net / stress-check.samebi.net
- burnout-test.samebi.net / test-burnout.samebi.net / burnout-check.samebi.net
- angst-test.samebi.net / test-ansiedad.samebi.net / anxiety-test.samebi.net
```

**Checkpoint:** 15 Apps live (5 Tools × 3 Sprachen)

---

### **Woche 4: Payment & Marketing Launch**

#### **TAG 15-16: Stripe-Integration (1-2 Tage)**

**✅ Stripe Setup:**
```bash
# 1. Stripe Account erstellen
https://dashboard.stripe.com/register

# 2. Products erstellen:
Products → + Add Product:
- Name: "Guía Práctica Consulta Exitosa"
  Price: 15 EUR
  Type: One-time
  
- Name: "Curso Intensivo 4 Módulos"
  Price: 75 EUR
  Type: One-time
  
- Name: "VIP Coaching Program"
  Price: 397 EUR
  Type: One-time

# 3. API-Keys notieren:
Developers → API Keys:
- Publishable Key: pk_live_...
- Secret Key: sk_live_...

# 4. Webhook erstellen:
Developers → Webhooks:
- Endpoint: https://api.samebi.net/webhooks/stripe
- Events: checkout.session.completed, payment_intent.succeeded
```

**✅ Backend-Integration:**

**Cursor Prompt:**
```
Implementiere Stripe-Integration in Backend:

src/routes/payment.js:

POST /api/checkout/create-session
Body: {
  priceId: string,
  email: string,
  sourceToolId: string,
  metadata: object
}

Response:
{
  sessionId: string,
  checkoutUrl: string
}

POST /api/webhooks/stripe
Headers: stripe-signature
Body: Stripe-Event

Logik:
1. Verify Webhook Signature
2. Handle checkout.session.completed:
   - Create course_access entry
   - Send confirmation email
   - Grant access to course content
3. Handle payment_intent.succeeded:
   - Update payment status
   - Trigger fulfillment

Implementiere mit Stripe SDK + Webhook-Verification.
Error-Handling für failed payments.
```

**✅ Frontend-Integration:**

**Cursor Prompt:**
```
Erstelle Checkout-Flow im Template:

src/components/CourseUpsell.tsx:

Nach Lead-Capture zeigen:
- Product-Card (15€ Nobrainer)
- Benefits-Liste
- Social Proof (Testimonials)
- CTA-Button "Jetzt kaufen"

onClick:
1. POST /api/checkout/create-session
2. Redirect zu Stripe-Checkout
3. Nach Success: Redirect zu /success?session_id=...

src/pages/Success.tsx:
- Thank-You-Message
- Access-Instructions
- Download-Link (wenn applicable)
```

**Checkpoint:** Stripe-Integration funktioniert, Test-Kauf erfolgreich

---

#### **TAG 17-18: Marketing Launch (1-2 Tage)**

**✅ Landing-Pages optimieren:**

**Cursor Prompt:**
```
Optimiere Landing-Pages für Conversion:

Für jedes Tool:
1. Hero-Section:
   - Klare Headline (Problem → Lösung)
   - Subheadline (Benefit)
   - CTA (Tool starten)
   - Trust-Badge (kostenlos, anonym, DSGVO)

2. Features-Section:
   - 3-4 Haupt-Benefits mit Icons
   - Wissenschaftliche Validierung erwähnen

3. How-It-Works:
   - 3 simple Schritte visuell
   
4. Social Proof:
   - Testimonials (wenn vorhanden)
   - Nutzungszahlen ("Über 1.000 Psychologen nutzen...")

5. FAQ-Section:
   - 5-7 häufige Fragen

6. Final-CTA:
   - Wiederholung CTA
   - Urgency (optional)

Design:
- Modern, clean, professional
- Tailwind CSS
- Mobile-optimiert
- Fast-Loading (<2s)

SEO:
- Meta-Tags optimiert
- Structured Data (JSON-LD)
- Alt-Texte für Bilder
```

**✅ SEO-Optimierung:**

```bash
# Für jedes Tool:
1. Google Search Console:
   - Property hinzufügen
   - Sitemap submitten
   
2. Meta-Tags prüfen:
   - Title: 50-60 Zeichen
   - Description: 150-160 Zeichen
   - Keywords eingebaut
   
3. Structured Data:
   - FAQ-Schema
   - Organization-Schema
   - WebApplication-Schema
```

**✅ Google Ads Setup (optional für Launch):**

```bash
# Kampagne 1: Psychologen (Track C)
Keywords:
- "standortanalyse psychologe"
- "stundensatz psychologe berechnen"
- "praxis eröffnen psychologie"

Landing-Pages:
- standort-analyse.samebi.net
- honorar-rechner.samebi.net

Budget: 20€/Tag
Ziel: 97€ Kurs-Verkäufe

# Kampagne 2: Patienten (Track A)
Keywords:
- "stress test online kostenlos"
- "burnout test gratis"
- "angst test online"

Landing-Pages:
- stress-test.samebi.net
- burnout-test.samebi.net
- angst-test.samebi.net

Budget: 10€/Tag
Ziel: Lead-Generation
```

**Checkpoint:** 15 Apps live, SEO optimiert, optional Ads laufen

---

### **WOCHE 4 ABSCHLUSS: Phase 2 Review**

**✅ Erfolgs-Metriken prüfen:**
```yaml
Traffic:
- Besucher/Tag: Ziel >100
- Conversion-Rate: Ziel >30%

Leads:
- Leads/Tag: Ziel >10
- Email-Open-Rate: Ziel >25%

Revenue:
- Verkäufe: Ziel >3/Woche
- MRR (Monthly Recurring): Ziel >500€

Technical:
- Uptime: Ziel 99.9%
- Page-Load: Ziel <2s
- Lighthouse-Score: Ziel >90
```

---

## 🚀 PHASE 3: SCALING (Woche 5-8)

### **Woche 5-6: Weitere 15 Tools = 45 Apps**

**✅ Tool-Pipeline:**

**Woche 5:**
- Tool 6-10: Assessment-Tools (Depression, OCD, PTSD, ADHD, Bipolar)
- Je Tool: 1 Tag Entwicklung, Deployment automatisiert

**Woche 6:**
- Tool 11-15: Business-Tools (Marketing-ROI, Patient-Flow, Content-Generator, etc.)
- Fokus auf B2B (Psychologen)

**Beschleunigung durch:**
1. Template-System läuft perfekt
2. Deployment automatisiert (N8N)
3. Team-Erweiterung (optional)

---

### **Woche 7: White-Label System**

**✅ White-Label Dashboard:**

**Cursor Prompt:**
```
Erstelle White-Label Client-Management:

Dashboard-Seiten:
1. /admin/white-label (Übersicht)
   - Liste aller Clients
   - Tier, Status, Revenue
   - Quick-Add Client

2. /admin/white-label/:id (Client-Details)
   - Branding-Settings:
     - Logo-Upload
     - Farben (Primary, Secondary)
     - Custom-Domain
   - Tool-Selection:
     - Checkbox-Liste verfügbarer Tools
     - Preview mit Client-Branding
   - Billing:
     - Current-Plan
     - Usage-Stats
     - Invoices
   
3. Client-Portal generieren:
   - Subdomain: [client].tools.samebi.net
   - Alle Tools mit Client-Branding
   - Leads an Client-CRM

Backend:
- Multi-Tenancy Architecture
- Dynamic-Branding (CSS-Variables)
- Subdomain-Routing

Implementiere komplett mit Branding-Vorschau.
```

**✅ White-Label Pricing:**
```yaml
Tiers:
- Basic: 99€/Monat (5 Tools, 500 Leads)
- Pro: 249€/Monat (15 Tools, 2000 Leads, Custom-Domain)
- Enterprise: 599€/Monat (Unlimited, API-Access, Priority-Support)
```

**Checkpoint:** White-Label System funktioniert, 1 Test-Client onboarded

---

### **Woche 8: Marketing Scaling**

**✅ Content-Marketing:**
```bash
# Blog-System erstellen:
1. blog.samebi.net aufsetzen
2. SEO-Content produzieren:
   - "Standort für Psychologen-Praxis wählen"
   - "Stundensatz richtig kalkulieren"
   - "Stress-Test: So funktioniert's"
   
# Social-Media:
1. LinkedIn-Präsenz (B2B)
2. Instagram (B2C)
3. Automatisierte Posts (N8N + Buffer)
```

**✅ Partnership-Outreach:**
```yaml
Targets:
- Psychologen-Verbände (White-Label)
- Universitäten (Educational-Licenses)
- Kliniken (B2B2C)

Pitch:
- Free Trial (1 Monat)
- Case-Study erstellen
- Revenue-Share Model
```

**Checkpoint:** 60 Apps live, erste White-Label-Deals in Pipeline

---

## 🎯 PHASE 4: DOMINIERUNG (Woche 9-12)

### **Woche 9-11: Restliche 30+ Tools**

**✅ Massive Tool-Produktion:**

**Strategie:**
```yaml
Parallel-Development:
- 5 Tools/Woche
- Template-System hochoptimiert
- N8N Bulk-Deployment

Categories:
- Beziehungen (10 Tools)
- Karriere (8 Tools)
- Familie (7 Tools)
- Business (5 Tools)
```

**Team-Skalierung (optional):**
```yaml
Wenn Budget vorhanden:
- 1 Frontend-Dev (Tools bauen)
- 1 Content-Creator (Configs schreiben)
- 1 VA (Marketing, Admin)

Cost: ~3.000€/Monat
Benefit: 3x schneller zu 150 Apps
```

---

### **Woche 12: Exit-Readiness**

**✅ Documentation Complete:**
```bash
# Erstellen:
1. BUSINESS-OVERVIEW.md
   - Revenue-Breakdown
   - User-Statistics
   - Growth-Metrics
   
2. TECHNICAL-DOCS.md
   - Architecture-Overview
   - Deployment-Guide
   - API-Documentation
   
3. FINANCIAL-PROJECTIONS.md
   - 3-Year-Forecast
   - Unit-Economics
   - Valuation-Model

4. DUE-DILIGENCE-PACKAGE.md
   - Legal-Status
   - IP-Ownership
   - Compliance-Checks
```

**✅ Code-Audit:**
```yaml
Quality-Check:
- Test-Coverage >80%
- No Security-Vulnerabilities
- Documentation Complete
- Clean Git-History
- No Tech-Debt

Vorbereitung für Acquisition!
```

**Checkpoint:** 150+ Apps live, Exit-Ready Status erreicht

---

## 📋 ERFOLGS-METRIKEN: ZIELE

### **Nach Monat 3:**
```yaml
Technical:
- Apps Live: 60-80
- Uptime: >99.5%
- Page-Load: <2s

Business:
- Users/Tag: 1.000+
- Leads/Tag: 50+
- MRR: 5.000€+
```

### **Nach Monat 6:**
```yaml
Technical:
- Apps Live: 150+
- All-Automated

Business:
- Users/Tag: 5.000+
- Leads/Day: 200+
- MRR: 20.000€+
- White-Label Clients: 5-10
```

### **Nach Jahr 1:**
```yaml
Business:
- ARR: 300.000€+
- Platform Valuation: 2-5M€
- Ready for Series-A oder Exit
```

---

## 🚨 WICHTIGE HINWEISE

### **Priorisierung:**
```yaml
WENN Zeit knapp:
1. Template-System (MUSS!)
2. Automation (MUSS!)
3. Top-5-Tools (MUSS!)
4. Analytics (sollte)
5. White-Label (kann warten)

FOKUS: MVE (Minimum Viable Ecosystem)
```

### **Risiko-Management:**
```yaml
Backups:
- Täglich: PostgreSQL
- Wöchentlich: Full-System
- Git: Always Push!

Rollback-Plan:
- Jedes Tool muss rollback-fähig sein
- Coolify: Alte Versionen verfügbar
- DNS: Quick-Switch möglich

Support:
- Monitoring: Uptime Robot
- Alerts: Email/Slack
- Response: <1h bei Critical
```

### **Performance-Optimierung:**
```yaml
WENN Server-Last >70%:
1. Redis-Caching aktivieren
2. CDN einbinden (Cloudflare)
3. Image-Optimization
4. Code-Splitting

WENN >100 Apps:
1. Load-Balancer hinzufügen
2. Zweiter App-Server (CPX31)
3. Separate DB-Server erwägen
```

---

## 🎯 QUICK-START CHECKLISTE

**Diese Woche:**
- [ ] Redis installiert
- [ ] PostgreSQL Schema erweitert
- [ ] N8N deployed
- [ ] Template-System funktioniert
- [ ] Tool-Generator läuft

**Nächste Woche:**
- [ ] Dashboard erweitert
- [ ] Lead-Capture funktioniert
- [ ] Brevo integriert
- [ ] Analytics läuft

**Monat 1:**
- [ ] 5 Tools live (15 Apps)
- [ ] Payment funktioniert
- [ ] 100+ Leads generiert

**Monat 3:**
- [ ] 20 Tools live (60 Apps)
- [ ] White-Label MVP
- [ ] 5.000€ MRR

**Monat 6:**
- [ ] 50 Tools live (150 Apps)
- [ ] 20.000€ MRR
- [ ] Exit-Ready

---

**🚀 Los geht's! Start mit Phase 1, Tag 1, Schritt 1.1!**

**Bei Fragen oder Problemen: Zurück zu diesem Dokument und Schritt-für-Schritt folgen!**

**💪 Sie schaffen das! Das System ist designed für Erfolg!**

