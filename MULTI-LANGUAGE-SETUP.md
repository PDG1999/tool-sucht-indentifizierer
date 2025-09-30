# Multi-Language Setup für SAMEBI Tools

## 🌍 Übersicht

Vollständige Implementierung der Multi-Language Unterstützung für alle SAMEBI Tools mit separaten Deployments pro Sprache.

## 📋 Implementierte Sprachen

- **🇩🇪 Deutsch (DE)** - Primärmarkt Deutschland/Österreich/Schweiz
- **🇬🇧 Englisch (EN)** - Internationaler Markt
- **🇪🇸 Spanisch (ES)** - Spanischer Markt (bestehend)

## 🏗️ Architektur

### Subdomain-Struktur
```yaml
# Stress-Checker Tool
stress-checker.samebi.net      # Deutsch (neu)
en.stress-checker.samebi.net   # Englisch (neu)
test-estres.samebi.net         # Spanisch (angepasst)

# Backend APIs
api.samebi.net                 # Deutsch
en-api.samebi.net             # Englisch
es-api.samebi.net             # Spanisch
```

### Environment-basierte Konfiguration
Jede Sprache hat separate Environment Variables:
- `VITE_LANGUAGE` - Sprachcode (de/en/es)
- `VITE_API_URL` - Sprachspezifische API-URL
- `VITE_GA_TRACKING_ID` - Separate Analytics pro Sprache

## 🚀 Coolify Deployment Setup

### 1. Deutsche Version (stress-checker.samebi.net)

**Neue Coolify App erstellen:**
```json
{
  "name": "stress-checker-de",
  "repository": "https://github.com/PDG1999/tool-stress-checker",
  "branch": "main",
  "domain": "stress-checker.samebi.net",
  "build_command": "npm run build",
  "output_directory": "dist",
  "index_file": "index.de.html"
}
```

**Environment Variables:**
```env
VITE_LANGUAGE=de
VITE_API_URL=https://api.samebi.net
VITE_GA_TRACKING_ID=G-DE-XXXXXXXXX
VITE_EMAIL_SERVICE_URL=https://api.samebi.net/email
VITE_STRIPE_PUBLIC_KEY=pk_live_de_xxx
VITE_APP_NAME=Stress-Test SAMEBI
VITE_APP_DESCRIPTION=Wissenschaftlich validierter Stress-Level Test
VITE_SUPPORT_EMAIL=support@samebi.net
VITE_COMPANY_NAME=SAMEBI Deutschland
```

### 2. Englische Version (en.stress-checker.samebi.net)

**Neue Coolify App erstellen:**
```json
{
  "name": "stress-checker-en",
  "repository": "https://github.com/PDG1999/tool-stress-checker",
  "branch": "main", 
  "domain": "en.stress-checker.samebi.net",
  "build_command": "npm run build",
  "output_directory": "dist",
  "index_file": "index.en.html"
}
```

**Environment Variables:**
```env
VITE_LANGUAGE=en
VITE_API_URL=https://en-api.samebi.net
VITE_GA_TRACKING_ID=G-EN-XXXXXXXXX
VITE_EMAIL_SERVICE_URL=https://en-api.samebi.net/email
VITE_STRIPE_PUBLIC_KEY=pk_live_en_xxx
VITE_APP_NAME=Stress Test SAMEBI
VITE_APP_DESCRIPTION=Scientifically validated stress level test
VITE_SUPPORT_EMAIL=support@samebi.net
VITE_COMPANY_NAME=SAMEBI International
```

### 3. Spanische Version (test-estres.samebi.net) - Anpassen

**Bestehende Coolify App aktualisieren:**
```json
{
  "name": "stress-checker-es",
  "repository": "https://github.com/PDG1999/tool-stress-checker",
  "branch": "main",
  "domain": "test-estres.samebi.net",
  "build_command": "npm run build", 
  "output_directory": "dist",
  "index_file": "index.html"
}
```

**Environment Variables:**
```env
VITE_LANGUAGE=es
VITE_API_URL=https://es-api.samebi.net
VITE_GA_TRACKING_ID=G-ES-XXXXXXXXX
VITE_EMAIL_SERVICE_URL=https://es-api.samebi.net/email
VITE_STRIPE_PUBLIC_KEY=pk_live_es_xxx
VITE_APP_NAME=Test de Estrés SAMEBI
VITE_APP_DESCRIPTION=Test de estrés científicamente validado
VITE_SUPPORT_EMAIL=soporte@samebi.net
VITE_COMPANY_NAME=SAMEBI España
```

## 🌐 DNS-Konfiguration (Cloudflare)

### Neue DNS-Records erstellen:

```dns
# Deutsche Version
stress-checker.samebi.net    A    91.99.81.172
stress-checker.samebi.net    AAAA 2a01:4f8:c012:3c54::1

# Englische Version  
en.stress-checker.samebi.net A    91.99.81.172
en.stress-checker.samebi.net AAAA 2a01:4f8:c012:3c54::1

# Spanische Version (umbenennen)
test-estres.samebi.net       A    91.99.81.172
test-estres.samebi.net       AAAA 2a01:4f8:c012:3c54::1
```

### Backend APIs:
```dns
# Deutsche API (bestehend)
api.samebi.net               A    91.99.81.172

# Englische API (neu)
en-api.samebi.net           A    91.99.81.172

# Spanische API (neu) 
es-api.samebi.net           A    91.99.81.172
```

## 📊 Analytics Setup

### Separate Google Analytics Properties:

1. **Deutschland:** `G-DE-XXXXXXXXX`
   - Zielgruppe: DACH-Region
   - Währung: EUR
   - Zeitzone: Europe/Berlin

2. **International:** `G-EN-XXXXXXXXX`
   - Zielgruppe: UK, USA, International
   - Währung: EUR/USD
   - Zeitzone: Europe/London

3. **Spanien:** `G-ES-XXXXXXXXX`
   - Zielgruppe: Spanien, Lateinamerika
   - Währung: EUR
   - Zeitzone: Europe/Madrid

## 🔄 Deployment Workflow

### Automatisches Deployment:
```bash
# Ein Git Push deployed alle Sprachen
git add .
git commit -m "feat: neue Feature für alle Sprachen"
git push origin main

# → Coolify deployed automatisch:
# → stress-checker.samebi.net (Deutsch)
# → en.stress-checker.samebi.net (Englisch)  
# → test-estres.samebi.net (Spanisch)
```

### Sprachspezifische Builds:
Jede App verwendet die gleiche Codebase, aber:
- Unterschiedliche Environment Variables
- Unterschiedliche HTML-Templates
- Unterschiedliche Meta-Tags und SEO

## 🛠️ Technische Features

### Implementierte Komponenten:
- ✅ **Language Configuration System** (`src/config/language.ts`)
- ✅ **Translation System** (`src/translations/index.ts`)
- ✅ **Translation Hook** (`src/hooks/useTranslation.ts`)
- ✅ **Dynamic Meta Updates** (`src/utils/meta.ts`)
- ✅ **Multi-Language Analytics** (`src/utils/analytics.ts`)
- ✅ **Responsive Components** (alle Hauptkomponenten)

### SEO-Optimierungen:
- Sprachspezifische Meta-Tags
- Lokalisierte Open Graph Images
- Strukturierte Daten pro Sprache
- Hreflang-Attribute (in Entwicklung)

## 📈 Monitoring & Analytics

### KPIs pro Sprache:
```yaml
Deutschland:
  - Ziel: 100-200 tägliche Nutzer
  - Conversion Rate: 45%
  - Hauptkeywords: "stress test deutschland"

International:  
  - Ziel: 50-100 tägliche Nutzer
  - Conversion Rate: 40%
  - Hauptkeywords: "stress test online"

Spanien:
  - Ziel: 50-100 tägliche Nutzer (bestehend)
  - Conversion Rate: 45%
  - Hauptkeywords: "test estrés online"
```

## 🔧 Wartung & Updates

### Neue Übersetzungen hinzufügen:
1. `src/translations/index.ts` erweitern
2. Neue Sprachkonstanten hinzufügen
3. Environment-Konfiguration erweitern
4. Neue Coolify-App erstellen

### Content-Updates:
- Alle Texte zentral in `translations/index.ts`
- Ein Update → automatisch in allen Sprachen
- Sprachspezifische Anpassungen möglich

## 🚨 Wichtige Hinweise

### Vor dem Deployment:
1. **DNS-Records** in Cloudflare erstellen
2. **SSL-Zertifikate** werden automatisch von Coolify generiert
3. **Analytics-Properties** in Google Analytics erstellen
4. **Environment Variables** in Coolify konfigurieren

### Nach dem Deployment:
1. Alle Domains testen
2. Analytics-Tracking prüfen
3. SEO-Meta-Tags validieren
4. Mobile Responsiveness testen

## 📞 Support

Bei Problemen:
- **Entwickler:** PDG1999
- **Coolify Dashboard:** https://coolify.samebi.net:8000
- **Server:** Hetzner Cloud (91.99.81.172)

---

**Status:** ✅ Implementierung abgeschlossen
**Nächste Schritte:** Coolify-Apps erstellen und DNS konfigurieren

