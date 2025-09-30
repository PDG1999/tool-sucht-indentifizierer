# SAMEBI Tools - Infrastructure & Documentation

## 🎯 **Projekt-Übersicht**

Zentrale Infrastruktur-Dokumentation und Konfiguration für alle SAMEBI Marketing-Tools für Psychologen.

### **Server-Details**
- **Provider:** Hetzner Cloud  
- **Server:** CX21 (4 vCPU, 8GB RAM, 80GB SSD)
- **Location:** Nürnberg, Deutschland (DSGVO-konform)
- **IP:** 91.98.93.203
- **Management:** Coolify (https://coolify.samebi.net:8000)

## 📁 **Repository-Struktur**

```
PDG-Tools-SAMEBI/
├── README.md                    # Diese Datei
├── SAMEBI-ARCHITECTURE.md       # Komplette System-Architektur
├── COOLIFY-SETUP.md            # Coolify Deployment-Anleitung
├── CLOUDFLARE-DNS.md           # DNS-Konfiguration
├── MULTI-LANGUAGE-SETUP.md     # Multi-Language Implementierung
├── coolify-config/             # Server-Konfiguration
├── herramientas-backend/       # Zentrale API (PostgreSQL + PostgREST)
├── shared-components/          # UI-Komponenten Bibliothek
├── tool-stress-checker/        # Stress-Test Tool (3 Sprachen)
├── tool-rate-calculator/       # Rate-Calculator Tool (geplant)
├── tool-burnout-test/         # Burnout-Test Tool (geplant)
├── tool-location-analyzer/    # Location-Analyzer Tool (geplant)
└── tool-content-generator/    # Content-Generator Tool (geplant)
```

## 🌐 **Live-Domains**

### **Stress-Test Tools:**
- ✅ **test-estres.samebi.net** (Spanisch - fertig & getestet)
- 🔄 **stress-test.samebi.net** (Deutsch - 75% fertig)
- ⏳ **stress-check.samebi.net** (Englisch - wartet)

### **Backend & Infrastructure:**
- **api.samebi.net** - Zentrale API für alle Tools
- **components.samebi.net** - Shared UI Components
- **coolify.samebi.net** - Server-Management Dashboard

## 🚀 **Quick Start**

### **1. DNS-Records erstellen (Cloudflare):**
```dns
api.samebi.net          A  91.98.93.203
test-estres.samebi.net  A  91.98.93.203
stress-test.samebi.net  A  91.98.93.203
stress-check.samebi.net A  91.98.93.203
```

### **2. Backend deployen (ZUERST!):**
```bash
# In Coolify Dashboard:
# New Application → Docker Compose
# Repository: herramientas-backend/
# Domain: api.samebi.net
```

### **3. Frontend-Tools deployen:**
```bash
# Für jede Sprache separate Coolify-App:
# - stress-test-es → test-estres.samebi.net
# - stress-test-de → stress-test.samebi.net  
# - stress-test-en → stress-check.samebi.net
```

## 🛠️ **Technologie-Stack**

### **Backend (herramientas-backend):**
- **Database:** PostgreSQL 15
- **API:** PostgREST (Auto-generated REST API)
- **Cache:** Redis 7
- **Container:** Docker Compose
- **Deployment:** Coolify

### **Frontend (alle Tools):**
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Container:** Docker + Nginx
- **Deployment:** Coolify (separate Apps pro Sprache)

### **Shared Components:**
- **Framework:** React 18 + TypeScript
- **Build:** Vite + Storybook
- **Testing:** Vitest + React Testing Library

## 📊 **Multi-Language Architektur**

### **Separate Apps pro Sprache (SEO-optimiert):**
```yaml
Vorteile:
✅ Optimales SEO (statische Inhalte pro Sprache)
✅ Schnellere Ladezeiten (nur relevante Sprache)
✅ Separate Analytics pro Markt
✅ Sprachspezifische Optimierungen
✅ Bessere Core Web Vitals
✅ Einfachere A/B-Tests pro Markt
```

### **Deployment-Strategie:**
```yaml
Eine Codebase → Drei Deployments:
- Docker Build Args für Sprache
- Environment Variables pro Markt
- Sprachspezifische HTML-Templates
- Separate Analytics-Tracking
```

## 📈 **Business Intelligence**

### **Zentrale Datensammlung (api.samebi.net):**
```sql
-- Alle Tools senden Daten an zentrale API:
- Test-Ergebnisse → Marketing-Insights
- E-Mail-Captures → Lead-Database
- Analytics → Conversion-Tracking
- User-Behavior → A/B-Test Daten
```

### **KPIs pro Sprache:**
```yaml
Deutschland: 100-200 tägliche Nutzer, 45% Conversion
International: 50-100 tägliche Nutzer, 40% Conversion  
Spanien: 50-100 tägliche Nutzer, 45% Conversion
```

## 🔐 **Sicherheit & Compliance**

- **DSGVO-konform:** Server in Deutschland (Hetzner Nürnberg)
- **SSL:** Automatische Let's Encrypt Zertifikate
- **Backups:** Täglich automatisch (30 Tage Retention)
- **Monitoring:** Health Checks + Uptime Monitoring

## 📞 **Support & Kontakte**

- **Entwickler:** PDG1999
- **Server:** Hetzner Cloud Support
- **DNS:** Cloudflare Support
- **Coolify Dashboard:** https://coolify.samebi.net:8000

## 📋 **Nächste Schritte**

1. **DNS-Records erstellen** (Cloudflare)
2. **Backend deployen** (herramientas-backend)
3. **Stress-Test Tools deployen** (3 separate Apps)
4. **Weitere Tools entwickeln** (Rate Calculator, etc.)
5. **Monitoring einrichten** (Uptime, Analytics)

---

**Status:** ✅ Infrastruktur dokumentiert und bereit
**Letzte Aktualisierung:** $(date)
**Version:** 1.0.0

