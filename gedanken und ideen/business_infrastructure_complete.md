# KOMPLETTE BUSINESS-INFRASTRUKTUR
*CRM, Payment, Email-Automation & White Label Dashboard*

## 🎯 1. ERKLÄRUNG DER 3 TRACKS

### **TRACK A: PATIENTEN 25-45 JAHRE**
**Wer:** Junge Berufstätige, Eltern, Millennials  
**Ziel:** Traffic-Volumen generieren  
**Tools:** Schnelle Tests (Stress, Angst, Beziehung)  
**Nutzen für Cari:** Diese Patienten werden an Caris Jung-Psychologen vermittelt

### **TRACK B: PATIENTEN 50-65 JAHRE**
**Wer:** Etablierte Professionals, Empty-Nesters, Pre-Pensionäre  
**Ziel:** Premium-Patienten mit hoher Zahlungsbereitschaft  
**Tools:** Ausführliche Analysen (Midlife-Crisis, Ehe 20+, Gesundheitsangst)  
**Nutzen für Cari:** Hochwertige Patienten für erfahrene Psychologen im Netzwerk

### **TRACK C: JUNG-PSYCHOLOGEN 24-35 JAHRE**
**Wer:** Frisch graduierte Psychologen, Praxisgründer  
**Ziel:** DIREKTE KUNDEN für Caris 15€ → 75€ → 397€ Produkte  
**Tools:** Business-Tools (Standort, Preise, Marketing, Organisation)  
**Nutzen für Cari:** DAS IST IHR HAUPTGESCHÄFT!

### **BEISPIEL STRESS-DETECTOR "alle 3 Tracks":**
```
EINE Tool-Basis, DREI Versionen:

Track A Version:
- "Quick Stress Check" - 2 Minuten
- Mobile-optimiert für unterwegs
- Sofort-Ergebnis mit Instagram-Share
→ CTA: "Finde einen Therapeuten in deiner Nähe"

Track B Version:  
- "Executive Stress Analysis" - 15 Minuten
- Desktop-optimiert, ausführlich
- 10-Seiten PDF-Report
→ CTA: "Premium-Therapeuten für Führungskräfte"

Track C Version:
- "Psychologen Burnout-Prevention Check"
- Speziell für Therapeuten
- Selbstfürsorge-Tipps + Business-Stress
→ CTA: "Lerne deine Praxis stressfrei zu führen" (75€ Kurs)
```

---

## 💳 2. PAYMENT-SYSTEM FÜR SPANIEN

### **EMPFOHLENER STACK:**

#### **OPTION A: STRIPE (EMPFEHLUNG)**
```javascript
// Warum Stripe?
✅ Spanische Kartenzahlungen (Visa, Mastercard, American Express)
✅ SEPA-Lastschrift für Europa
✅ Automatische Mehrwertsteuer (VAT) für EU
✅ Subscription-Management eingebaut
✅ Webhooks für Automation
✅ 1.5% + 0.25€ pro Transaktion (günstig!)
✅ Sofortige Auszahlung auf spanisches Konto

// Setup Beispiel
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Produkte erstellen
const nobrainer = await stripe.products.create({
  name: 'Guía Práctica Consulta Exitosa',
  description: '15€ Nobrainer Kurs',
  default_price_data: {
    currency: 'eur',
    unit_amount: 1500 // 15€ in Cents
  }
});

const intensivKurs = await stripe.products.create({
  name: 'Curso Intensivo 4 Módulos',
  default_price_data: {
    currency: 'eur',
    unit_amount: 7500 // 75€
  }
});

// Checkout Session erstellen
app.post('/create-checkout', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'sepa_debit'],
    line_items: [{
      price: req.body.priceId,
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://samebi.net/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://samebi.net/cancel',
    customer_email: req.body.email,
    metadata: {
      source_tool: req.body.toolName,
      lead_score: req.body.leadScore
    }
  });
  
  res.json({ sessionId: session.id });
});
```

#### **OPTION B: PADDLE (Alternative)**
- **Vorteile:** Übernimmt VAT-Compliance komplett
- **Nachteile:** Höhere Gebühren (5% + Payment fees)
- **Gut für:** Internationale Expansion später

#### **SPANIEN-SPEZIFISCHE ANFORDERUNGEN:**
```javascript
// VAT-Registrierung erforderlich
const companyDetails = {
  name: "Caris Psychologen Business",
  vat_number: "ES-XXXXXXXXX", // Spanische NIF/CIF
  address: "Your Spanish Address",
  country: "ES"
};

// Stripe Tax automatisch
tax_id_collection: { enabled: true },
automatic_tax: { enabled: true }
```

---

## 📧 3. CRM-LÖSUNG FÜR LEAD-MANAGEMENT

### **EMPFOHLENE CRM-ARCHITEKTUR:**

#### **OPTION A: N8N + AIRTABLE (BESTE PREIS/LEISTUNG)**

**N8N (Open Source Automation - kostenfrei auf Hetzner):**
```yaml
# N8N Workflow: Lead Capture
Trigger: Webhook von Tool
↓
Airtable: Lead speichern
↓  
Brevo/Mailchimp: Email-Sequenz starten
↓
Slack/WhatsApp: Benachrichtigung an Cari
↓
Facebook/Google: Retargeting Audience hinzufügen
```

**Airtable als CRM (kostenlos bis 1.200 Zeilen):**
```
Tabelle: LEADS
-------------------
| Email | Source Tool | Date | Lead Score | Status | Product Interest |
| maria@email.com | Standort-Analyzer | 2025-01-15 | Hot | New | 75€ Kurs |
| juan@email.com | Stress-Test | 2025-01-15 | Warm | Email-Sequenz | Nobrainer |

Tabelle: CUSTOMERS
-------------------
| Email | Product Bought | Date | Amount | Upsell Opportunity |
| pedro@email.com | 15€ Nobrainer | 2025-01-10 | 15€ | 75€ Kurs (in 7 Tagen) |

Tabelle: TOOL USAGE
-------------------
| Email | Tool | Times Used | Last Used | Conversion Probability |
| ana@email.com | Standort | 3 | 2025-01-14 | 85% |
```

#### **N8N WORKFLOW BEISPIEL:**
```javascript
// Workflow: Lead von Tool zu CRM
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "tool-lead",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Airtable",
      "type": "n8n-nodes-base.airtable",
      "parameters": {
        "operation": "append",
        "table": "Leads",
        "fields": {
          "Email": "={{$json['email']}}",
          "Source Tool": "={{$json['toolName']}}",
          "Date": "={{$now}}",
          "Lead Score": "={{$json['leadScore']}}"
        }
      }
    },
    {
      "name": "Lead Scoring",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": `
          // Lead Scoring Algorithmus
          let score = 0;
          if (items[0].json.toolName === 'Standort-Analyzer') score += 40;
          if (items[0].json.toolName === 'Stundensatz') score += 35;
          if (items[0].json.completedFully) score += 25;
          
          items[0].json.leadScore = score;
          
          // Kategorisierung
          if (score >= 80) items[0].json.category = 'Hot';
          else if (score >= 50) items[0].json.category = 'Warm';
          else items[0].json.category = 'Cold';
          
          return items;
        `
      }
    },
    {
      "name": "Brevo Email",
      "type": "n8n-nodes-base.sendinblue",
      "parameters": {
        "operation": "sendEmail",
        "email": "={{$json['email']}}",
        "templateId": "={{$json['category'] === 'Hot' ? 1 : 2}}"
      }
    }
  ]
}
```

#### **OPTION B: SUPABASE (All-in-One)**
```sql
-- Supabase Database Schema
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  source_tool VARCHAR(100),
  lead_score INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'new',
  product_interest VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  last_interaction TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tool_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id),
  tool_name VARCHAR(100),
  completed BOOLEAN DEFAULT false,
  time_spent INTEGER, -- in seconds
  result_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id),
  product_name VARCHAR(100),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  stripe_session_id VARCHAR(255),
  status VARCHAR(50),
  purchased_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📨 4. EMAIL MARKETING AUTOMATION

### **EMPFOHLENER STACK: BREVO (ehemals SendinBlue)**

**Warum Brevo?**
✅ **Kostenlos bis 300 Emails/Tag** (9.000/Monat)  
✅ **DSGVO-konform** (EU-Server)  
✅ **Marketing Automation** eingebaut  
✅ **Transaktional + Marketing** in einem  
✅ **WhatsApp Integration** (wichtig für Spanien!)  
✅ **Spanische Interface** verfügbar

#### **BREVO AUTOMATION SETUP:**
```javascript
// Brevo API Integration
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// API Key Configuration
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Contact erstellen
const apiInstance = new SibApiV3Sdk.ContactsApi();
const createContact = new SibApiV3Sdk.CreateContact();

createContact.email = 'maria@example.com';
createContact.attributes = {
  FIRSTNAME: 'Maria',
  SOURCE_TOOL: 'Standort-Analyzer',
  LEAD_SCORE: 85,
  INTEREST: '75€ Kurs'
};
createContact.listIds = [2]; // Nobrainer Upsell List

await apiInstance.createContact(createContact);

// Automation Workflow starten
const apiInstanceAutomation = new SibApiV3Sdk.TransactionalEmailsApi();
const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

sendSmtpEmail.templateId = 1; // Nobrainer Upsell Template
sendSmtpEmail.to = [{ email: 'maria@example.com' }];
sendSmtpEmail.params = {
  FIRSTNAME: 'Maria',
  TOOL_RESULT: 'Ihr Standort-Score: 78/100',
  DOWNLOAD_LINK: 'https://samebi.net/download/xyz'
};

await apiInstanceAutomation.sendTransacEmail(sendSmtpEmail);
```

#### **EMAIL-SEQUENZEN IN BREVO:**
```yaml
Automation 1: Nobrainer Upsell (15€)
Trigger: Lead von Tool
↓
Email 1 (Sofort): Willkommen + PDF Download
Bedingung: Email geöffnet?
  ├─ Ja → Wait 15 Minuten → Email 2
  └─ Nein → Wait 24 Stunden → Re-send Email 1
↓
Email 2 (+15min): Bonus Video "3 Standort-Fehler"
Bedingung: Video geschaut?
  ├─ Ja → Lead Score +20 → Email 3 nach 24h
  └─ Nein → Wait 48h → Email 3
↓
Email 3 (+48h): Social Proof "María's Story"
↓
Email 4 (+72h): Direct Offer "15€ Kurs - 50% Rabatt"
Bedingung: Gekauft?
  ├─ Ja → Move to "Intensiv Kurs Upsell" Automation
  └─ Nein → Continue
↓
Email 5 (+96h): Urgency "Nur noch 24 Stunden"
↓
Email 6 (+7d): Last Chance + Testimonials

Automation 2: Intensiv-Kurs Upsell (75€)
Trigger: Nobrainer gekauft
Wait: 7 Tage
↓
[5 Emails über 2 Wochen mit Case Studies]

Automation 3: VIP-Coaching Upsell (397€)
Trigger: Intensiv-Kurs gekauft  
Wait: 14 Tage
↓
[Application Process + Limitierte Verfügbarkeit]
```

#### **WHATSAPP INTEGRATION (WICHTIG FÜR SPANIEN!):**
```javascript
// Brevo WhatsApp API
const sendWhatsApp = async (phone, message) => {
  await fetch('https://api.brevo.com/v3/whatsapp/sendMessage', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: phone, // +34 600 123 456
      type: 'template',
      template: {
        name: 'nobrainer_upsell_es',
        language: 'es',
        components: [{
          type: 'body',
          parameters: [{
            type: 'text',
            text: 'María' // Personalisierung
          }]
        }]
      }
    })
  });
};
```

---

## 🎛️ 5. ADMIN DASHBOARD + WHITE LABEL

### **DASHBOARD-ARCHITEKTUR:**

#### **ADMIN PANEL FEATURES:**
```typescript
// Dashboard Komponenten
interface AdminDashboard {
  // Real-time Metrics
  realTimeStats: {
    activeUsers: number;
    toolsUsedToday: number;
    leadsGenerated: number;
    revenue: number;
  };
  
  // Tool Management
  toolManager: {
    enableDisable: (toolId: string) => void;
    editContent: (toolId: string, content: ToolContent) => void;
    viewAnalytics: (toolId: string) => ToolAnalytics;
    exportData: (toolId: string) => CSV;
  };
  
  // Lead Management
  leadManager: {
    viewLeads: (filters: LeadFilters) => Lead[];
    assignToSalesperson: (leadId: string, userId: string) => void;
    addNote: (leadId: string, note: string) => void;
    sendEmail: (leadId: string, templateId: number) => void;
  };
  
  // White Label Management
  whiteLabelManager: {
    createClient: (clientData: ClientData) => Client;
    assignTools: (clientId: string, toolIds: string[]) => void;
    customizeBranding: (clientId: string, branding: Branding) => void;
    viewClientAnalytics: (clientId: string) => Analytics;
    billingManagement: (clientId: string) => Billing;
  };
}
```

#### **WHITE LABEL MONETARISIERUNG:**
```javascript
// White Label Pricing Tiers
const whiteLabelTiers = {
  BASIC: {
    price: 99, // €/Monat
    tools: 5,
    leads: 500,
    branding: 'basic',
    support: 'email'
  },
  PRO: {
    price: 249, // €/Monat
    tools: 15,
    leads: 2000,
    branding: 'full',
    support: 'priority',
    customDomain: true,
    analytics: 'advanced'
  },
  ENTERPRISE: {
    price: 599, // €/Monat
    tools: 'unlimited',
    leads: 'unlimited',
    branding: 'white-label',
    support: 'dedicated',
    customDomain: true,
    analytics: 'enterprise',
    apiAccess: true
  }
};

// White Label Client Management
class WhiteLabelClient {
  constructor(clientData) {
    this.id = generateId();
    this.name = clientData.name;
    this.subdomain = clientData.subdomain; // psychologe-mueller.tools
    this.customDomain = clientData.customDomain; // tools.mueller-psychologie.de
    this.tier = clientData.tier;
    this.branding = {
      logo: clientData.logo,
      primaryColor: clientData.primaryColor,
      secondaryColor: clientData.secondaryColor,
      font: clientData.font
    };
    this.enabledTools = clientData.tools;
  }
  
  async renderClientPortal() {
    // Dynamisch Client-spezifisches Portal rendern
    return {
      subdomain: `https://${this.subdomain}.psycho-tools.es`,
      tools: this.enabledTools.map(tool => ({
        ...tool,
        branding: this.branding,
        leadDestination: this.crm
      })),
      analytics: this.tier === 'ENTERPRISE' ? 'full' : 'basic'
    };
  }
}
```

#### **DASHBOARD UI STACK:**
```javascript
// Tech Stack für Admin Dashboard
const dashboardStack = {
  frontend: 'React + TypeScript',
  uiFramework: 'Shadcn/ui + Tailwind',
  charts: 'Recharts',
  tables: 'TanStack Table',
  forms: 'React Hook Form + Zod',
  state: 'Zustand',
  api: 'TanStack Query'
};

// Dashboard Komponenten
<AdminDashboard>
  <Sidebar>
    <NavItem icon="dashboard">Übersicht</NavItem>
    <NavItem icon="tools">Tools Verwalten</NavItem>
    <NavItem icon="users">Leads</NavItem>
    <NavItem icon="customers">Kunden</NavItem>
    <NavItem icon="whitelabel">White Label</NavItem>
    <NavItem icon="analytics">Analytics</NavItem>
    <NavItem icon="settings">Einstellungen</NavItem>
  </Sidebar>
  
  <MainContent>
    <StatsCards>
      <Card title="Heutige Leads" value={42} trend="+12%" />
      <Card title="Umsatz (Monat)" value="€3,450" trend="+23%" />
      <Card title="Tool-Nutzung" value={1337} trend="+8%" />
      <Card title="Conversions" value="18%" trend="+2.3%" />
    </StatsCards>
    
    <ChartsRow>
      <LineChart title="Leads over Time" />
      <BarChart title="Top Tools" />
      <PieChart title="Conversion Funnel" />
    </ChartsRow>
    
    <DataTable>
      <LeadsTable 
        columns={['Email', 'Source', 'Score', 'Status', 'Actions']}
        data={leads}
        onRowClick={openLeadDetail}
      />
    </DataTable>
  </MainContent>
</AdminDashboard>
```

---

## 💰 WHITE LABEL BUSINESS MODEL

### **ZUSÄTZLICHE REVENUE-STREAMS:**

#### **ZIELGRUPPEN FÜR WHITE LABEL:**
```yaml
Segment 1: Psychologen-Verbände
- Colegio Oficial de Psicólogos (Regional)
- Bieten Tools für 5.000+ Mitglieder
- Preis: 1.500€/Monat Enterprise
- Potenzial: 5-10 Verbände = 7.500-15.000€/Monat

Segment 2: Psychotherapie-Zentren
- Multi-Therapeuten Praxen
- Eigene Branding für Patient-Akquise
- Preis: 249€/Monat Pro
- Potenzial: 50-100 Zentren = 12.500-25.000€/Monat

Segment 3: Universitäten / Ausbildungsinstitute
- Für Studenten & Praktikanten
- Educational Pricing: 599€/Monat
- Potenzial: 10-20 Unis = 6.000-12.000€/Monat

Segment 4: Internationale Expansion
- Deutsche Psychologen (später)
- Lateinamerika (Mexiko, Kolumbien, Argentina)
- Preis: Lokalisiert
- Potenzial: MASSIV (50.000€+/Monat)

TOTAL WHITE LABEL POTENTIAL: 
26.000 - 52.000€/Monat zusätzlich!
```

#### **WHITE LABEL IMPLEMENTATION:**
```javascript
// Multi-Tenant Architecture
const renderClientSite = (clientId) => {
  const client = getClientConfig(clientId);
  
  return {
    domain: client.customDomain || `${client.subdomain}.psycho-tools.es`,
    branding: {
      logo: client.logo,
      colors: client.colors,
      fonts: client.fonts,
      customCSS: client.customCSS
    },
    tools: client.enabledTools.map(tool => ({
      ...tool,
      leadDestination: client.crmWebhook,
      emailFrom: client.emailSettings,
      analytics: client.analyticsCode
    })),
    content: {
      language: client.language,
      customTexts: client.textOverrides
    }
  };
};

// Automated Client Onboarding
const onboardWhiteLabelClient = async (clientData) => {
  // 1. Create Database Entry
  const client = await db.clients.create(clientData);
  
  // 2. Setup Subdomain DNS
  await dns.createRecord({
    type: 'CNAME',
    name: clientData.subdomain,
    value: 'psycho-tools.es'
  });
  
  // 3. Generate SSL Certificate
  await certbot.getCert(clientData.subdomain);
  
  // 4. Create Client Database
  await db.createTenantDatabase(client.id);
  
  // 5. Setup Analytics
  await analytics.createProperty(client.id);
  
  // 6. Send Welcome Email
  await sendEmail({
    to: client.email,
    template: 'white_label_welcome',
    data: {
      loginUrl: `https://${client.subdomain}.psycho-tools.es/admin`,
      credentials: generateCredentials()
    }
  });
  
  return client;
};
```

---

## 🚀 IMPLEMENTIERUNGS-TIMELINE

### **WOCHE 1: CORE INFRASTRUCTURE**
```bash
✅ Hetzner Server + Coolify
✅ PostgreSQL + Redis
✅ Stripe Integration
✅ N8N Automation Setup
✅ Brevo Email Setup
```

### **WOCHE 2: ERSTE TOOLS + CRM**
```bash
✅ Tool 1: Standort-Analyzer (mit Lead Capture)
✅ Tool 2: Stundensatz-Rechner (mit Lead Capture)
✅ Airtable CRM Setup
✅ N8N Workflows für Lead-Processing
✅ Email-Sequenzen in Brevo
```

### **WOCHE 3: PAYMENT + ERSTE VERKÄUFE**
```bash
✅ 15€ Nobrainer Produkt erstellen
✅ Stripe Checkout Integration
✅ Automatische Produktauslieferung
✅ Upsell-Funnels live
✅ Analytics & Conversion-Tracking
```

### **WOCHE 4-6: DASHBOARD + WHITE LABEL**
```bash
✅ Admin Dashboard Build
✅ White Label Infrastructure
✅ Erste Pilot-Kunden (Psychologen-Verbände)
✅ Tool 3-5 live
✅ Optimization & Scaling
```

---

## 💡 SOFORTIGE NÄCHSTE SCHRITTE

### **DIESE WOCHE SETUP:**
1. **Stripe Account** erstellen (www.stripe.com/es)
2. **Brevo Account** erstellen (www.brevo.com/es/)
3. **Airtable Account** erstellen (kostenlos)
4. **N8N** auf Hetzner installieren (via Coolify)

### **KOSTEN-ÜBERSICHT:**
```yaml
MONATLICHE KOSTEN:
- Hetzner Server: 7,20€
- Coolify: 0€ (Open Source)
- N8N: 0€ (Self-hosted)
- Brevo: 0€ (bis 9.000 Emails/Monat)
- Airtable: 0€ (bis 1.200 Einträge)
- Stripe: 1.5% + 0.25€ pro Transaktion

TOTAL: ~10€/Monat + Payment Processing

WHITE LABEL REVENUE:
26.000 - 52.000€/Monat potentiell!

ROI: 2.600x - 5.200x 🚀
```

**Soll ich mit den konkreten Setup-Anleitungen für Stripe, Brevo und N8N starten?**