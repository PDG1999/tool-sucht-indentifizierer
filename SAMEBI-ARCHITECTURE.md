# SAMEBI Tools - Vollständige Architektur-Dokumentation

## 🏗️ **System-Übersicht**

### **Server-Details**
- **Provider:** Hetzner Cloud
- **Server:** CX21 (4 vCPU, 8GB RAM, 80GB SSD)
- **Location:** Nürnberg, Deutschland (DSGVO-konform)
- **IP:** 91.98.93.203
- **IPv6:** 2a01:4f8:c012:3c54::/64
- **Management:** Coolify (https://coolify.samebi.net:8000)

### **Gesamtarchitektur**
```
SAMEBI Ecosystem:
├── herramientas-backend/     → api.samebi.net (Zentrale API)
├── shared-components/        → components.samebi.net (UI-Bibliothek)
├── tool-stress-checker/      → Stress-Test Tools (3 Sprachen)
├── tool-rate-calculator/     → Rate-Calculator Tools (3 Sprachen)
├── tool-burnout-test/        → Burnout-Test Tools (3 Sprachen)
├── tool-location-analyzer/   → Location-Analyzer Tools (3 Sprachen)
└── tool-content-generator/   → Content-Generator Tools (3 Sprachen)
```

## 🌐 **DNS-Struktur (Cloudflare)**

### **Backend & Infrastructure**
```dns
# Zentrale Services
api.samebi.net              A    91.98.93.203  # Hauptapi für alle Tools
components.samebi.net       A    91.98.93.203  # Shared UI Components
coolify.samebi.net          A    91.98.93.203  # Admin Dashboard

# Sprachspezifische APIs (optional)
de-api.samebi.net          A    91.98.93.203  # Deutsche API
en-api.samebi.net          A    91.98.93.203  # Englische API
es-api.samebi.net          A    91.98.93.203  # Spanische API
```

### **Stress-Test Tools**
```dns
# Status: ✅ = fertig, 🔄 = in Arbeit, ⏳ = wartet
test-estres.samebi.net     A    91.98.93.203  # ✅ Spanisch (fertig & getestet)
stress-test.samebi.net     A    91.98.93.203  # 🔄 Deutsch (75% fertig)
stress-check.samebi.net    A    91.98.93.203  # ⏳ Englisch (wartet)
```

### **Rate-Calculator Tools**
```dns
calculadora-tarifas.samebi.net  A  91.98.93.203  # Spanisch
tarif-rechner.samebi.net        A  91.98.93.203  # Deutsch
rate-calculator.samebi.net      A  91.98.93.203  # Englisch
```

### **Burnout-Test Tools**
```dns
test-burnout.samebi.net         A  91.98.93.203  # Spanisch
burnout-test.samebi.net         A  91.98.93.203  # Deutsch
burnout-check.samebi.net        A  91.98.93.203  # Englisch
```

### **Location-Analyzer Tools**
```dns
analizador-ubicacion.samebi.net A  91.98.93.203  # Spanisch
standort-analyzer.samebi.net    A  91.98.93.203  # Deutsch
location-analyzer.samebi.net    A  91.98.93.203  # Englisch
```

### **Content-Generator Tools**
```dns
generador-contenido.samebi.net  A  91.98.93.203  # Spanisch
content-generator.samebi.net    A  91.98.93.203  # Deutsch
content-creator.samebi.net      A  91.98.93.203  # Englisch
```

## 🎯 **Warum diese Struktur?**

### **1. Separate Apps pro Sprache**
```yaml
Vorteile:
✅ Optimales SEO (statische Inhalte pro Sprache)
✅ Schnellere Ladezeiten (nur relevante Sprache geladen)
✅ Separate Analytics pro Markt
✅ Sprachspezifische Optimierungen möglich
✅ Bessere Core Web Vitals
✅ Einfachere A/B-Tests pro Markt
✅ Marktspezifische Features möglich

Business Impact:
- Bessere Conversion Rates
- Höhere SEO-Rankings
- Klarere Marketing-Attribution
- Einfachere Markt-Analyse
```

### **2. Zentrale Backend-API (api.samebi.net)**
```yaml
Zweck: Einheitliche Datensammlung für alle Tools und Sprachen

Gespeicherte Daten:
- Stress-Test Ergebnisse
- Rate-Calculator Berechnungen
- Burnout-Test Scores
- Location-Analysen
- Lead-Captures (E-Mails)
- Analytics Events
- User Sessions

Tech Stack:
- PostgreSQL 15 (Hauptdatenbank)
- PostgREST (Auto-generierte REST API)
- Redis (Caching & Sessions)
- Docker Compose (Container-Orchestrierung)
```

### **3. Shared Components (components.samebi.net)**
```yaml
Zweck: Einheitliche UI-Komponenten für alle Tools

Komponenten:
- Button, Input, Card, Modal
- QuestionCard, ScoreDisplay
- TestProgress, ResultCard
- Header, Footer (SAMEBI Branding)

Vorteile:
- Einheitliches Design-System
- Weniger Code-Duplikation
- Zentrale Updates für alle Tools
- Konsistente User Experience
```

## 📊 **Business Intelligence & Analytics**

### **Datensammlung pro Tool:**
```sql
-- Beispiel-Queries für Business Insights

-- Welches Tool generiert die meisten Leads?
SELECT tool_name, COUNT(*) as leads, AVG(conversion_rate)
FROM api.lead_captures 
GROUP BY tool_name
ORDER BY leads DESC;

-- Welche Sprache konvertiert am besten?
SELECT language, tool_name, COUNT(*) as conversions
FROM api.analytics_events 
WHERE event_type = 'email_captured'
GROUP BY language, tool_name;

-- Stress-Level Verteilung nach Ländern
SELECT country, AVG(score) as avg_stress_score
FROM api.stress_tests st
JOIN api.analytics_events ae ON st.session_id = ae.session_id
GROUP BY country;
```

### **Marketing Attribution:**
```yaml
Lead-Tracking:
- Quelle: Welches Tool generierte den Lead?
- Sprache: Welcher Markt ist am wertvollsten?
- Conversion-Path: Wie bewegen sich User durch die Tools?
- A/B-Tests: Welche Varianten performen besser?
```

## 🚀 **Deployment-Strategie**

### **Automatisches Deployment:**
```bash
# Ein Git Push deployed alle relevanten Apps
git add .
git commit -m "feat: neue Feature für alle Tools"
git push origin main

# Coolify erkennt automatisch:
# → Welche Apps das Repository nutzen
# → Startet Build für alle betroffenen Apps
# → Deployed auf entsprechende Domains
# → SSL-Zertifikate werden automatisch erneuert
```

### **Rollback-Strategie:**
```bash
# In Coolify Dashboard:
# 1. Application auswählen
# 2. "Deployments" Tab
# 3. Vorherige Version auswählen
# 4. "Redeploy" klicken
# → Automatischer Rollback in 2-3 Minuten
```

## 🔐 **Sicherheit & Compliance**

### **DSGVO-Konformität:**
```yaml
Server-Location: Deutschland (Hetzner Nürnberg)
Daten-Verarbeitung: EU-konform
SSL-Verschlüsselung: Automatisch (Let's Encrypt)
Backup-Location: Deutschland (Hetzner Storage Box)
Logs: Anonymisierte IP-Adressen
```

### **Backup-Strategie:**
```yaml
Database-Backups:
- Häufigkeit: Täglich automatisch
- Retention: 30 Tage
- Location: Hetzner Storage Box
- Encryption: AES-256

Code-Backups:
- Primary: GitHub Repositories
- Secondary: Coolify Git Cache
- Tertiary: Lokale Entwicklung
```

## 📈 **Skalierungs-Plan**

### **Aktuelle Kapazität:**
```yaml
Server: CX21 (4 vCPU, 8GB RAM)
Concurrent Users: 500-1000
Daily Requests: 50,000-100,000
Storage: 80GB (60% genutzt)
RAM: 8GB (40% genutzt)
```

### **Skalierungs-Trigger:**
```yaml
Performance-Limits:
- CPU > 70% → Upgrade zu CX31 (8 vCPU)
- RAM > 80% → Upgrade zu CX31 (16GB RAM)
- Storage > 90% → Add Volume (100GB)
- Users > 1000 → Load Balancer Setup

Business-Trigger:
- > 5 Tools → Separate Backend-Instanzen
- > 10 Sprachen → CDN-Integration
- > 100k Users/Tag → Multi-Server Setup
```

## 🛠️ **Entwicklungs-Workflow**

### **Repository-Struktur:**
```
PDG-Tools-SAMEBI/
├── herramientas-backend/        # Zentrale API
├── shared-components/           # UI-Bibliothek
├── tool-stress-checker/         # Individual Tool
├── tool-rate-calculator/        # Individual Tool
├── tool-burnout-test/          # Individual Tool
├── tool-location-analyzer/     # Individual Tool
├── tool-content-generator/     # Individual Tool
├── coolify-config/             # Server-Konfiguration
└── SAMEBI-ARCHITECTURE.md      # Diese Dokumentation
```

### **Feature-Development:**
```bash
# 1. Feature in Individual Tool entwickeln
cd tool-stress-checker/
git checkout -b feature/new-question-type
# ... Entwicklung ...
git push origin feature/new-question-type

# 2. Shared Components erweitern (falls nötig)
cd shared-components/
git checkout -b feature/new-component
# ... Entwicklung ...
git push origin feature/new-component

# 3. Backend erweitern (falls nötig)
cd herramientas-backend/
git checkout -b feature/new-endpoint
# ... Entwicklung ...
git push origin feature/new-endpoint
```

## 📞 **Support & Kontakte**

### **Technischer Support:**
- **Entwickler:** PDG1999
- **Server:** Hetzner Cloud Support
- **DNS:** Cloudflare Support
- **Monitoring:** Coolify Dashboard

### **Emergency Procedures:**
```bash
# Server-Neustart
ssh root@91.98.93.203 "systemctl restart coolify"

# Database-Restore
# 1. Coolify Dashboard → herramientas-backend
# 2. Stop Application
# 3. Restore from Backup
# 4. Start Application
# 5. Verify all Tools

# DNS-Issues
# 1. Cloudflare Dashboard
# 2. Check A-Records → 91.98.93.203
# 3. Purge Cache
# 4. Test Domains
```

---

**Letzte Aktualisierung:** $(date)
**Status:** ✅ Dokumentation vollständig
**Nächste Review:** Monatlich

