# 📍 Location-Analyzer - SAMEBI Tools

## 🎯 Übersicht

**Standort-Analyse Tool für Psychologen-Praxen**

Hilft Psychologen bei der optimalen Standortwahl durch Analyse von:
- Demografischen Daten
- Konkurrenz-Situation  
- Erreichbarkeit & Infrastruktur
- Marktpotential & Zielgruppen

## 🌍 Multi-Language Setup

### Subdomains:
- **Spanisch:** `analisis-ubicacion.samebi.net` (Haupt-Markt)
- **Deutsch:** `standort-analyse.samebi.net`
- **Englisch:** `location-analysis.samebi.net`

## 🏗️ Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** PostgREST API (`api.samebi.net`)
- **Database:** PostgreSQL
- **Deployment:** Coolify + Docker

## 🚀 Features

### Core-Funktionen:
- [ ] **Adress-Eingabe** mit Autocomplete
- [ ] **Demografische Analyse** (Alter, Einkommen, Bildung)
- [ ] **Konkurrenz-Mapping** (andere Psychologen im Umkreis)
- [ ] **Erreichbarkeits-Score** (ÖPNV, Parkplätze)
- [ ] **Zielgruppen-Match** (Spezialisierung vs. Demografie)
- [ ] **Marktpotential-Berechnung**
- [ ] **PDF-Report-Generation**

### Premium-Features:
- [ ] **Detaillierte Konkurrenz-Analyse**
- [ ] **Miet-/Kaufpreis-Trends**
- [ ] **Marketing-Empfehlungen**
- [ ] **ROI-Prognosen**

## 📊 Monetarisierung

- **Basis-Analyse:** Kostenlos (Lead-Magnet)
- **Premium-Report:** 97€
- **Consulting-Upsell:** 497€

## 🎨 Design-Konzept

### Landing Page:
- **Hero:** "Finden Sie den perfekten Standort für Ihre Praxis"
- **Demo:** Interaktive Karte mit Beispiel-Analyse
- **Social Proof:** Testimonials von Psychologen
- **CTA:** "Kostenlose Standort-Analyse starten"

### Tool-Interface:
- **Step 1:** Adress-Eingabe + Spezialisierung
- **Step 2:** Präferenzen (Zielgruppe, Budget, etc.)
- **Step 3:** Analyse-Ergebnisse mit Visualisierung
- **Step 4:** Email-Capture für detaillierten Report

## 🔧 Development Setup

### 1. Cursor-Fenster öffnen:
```bash
cd tool-location-analyzer/
```

### 2. Projekt initialisieren:
```bash
npm create vite@latest . -- --template react-ts
npm install
```

### 3. Dependencies:
```bash
npm install @types/leaflet leaflet react-leaflet
npm install @headlessui/react @heroicons/react
npm install axios react-hook-form
```

### 4. Entwicklung starten:
```bash
npm run dev
```

## 📋 Deployment Checklist

- [ ] Dockerfile erstellen (OHNE HEALTHCHECK)
- [ ] docker-compose.yaml (single service)
- [ ] Environment Variables pro Sprache
- [ ] Multi-Language HTML-Templates
- [ ] Coolify-Application erstellen
- [ ] Domain-Mapping konfigurieren
- [ ] SSL-Zertifikate prüfen

## 🎯 Success Metrics

### Ziele:
- **1000+ Analysen/Monat**
- **15% Premium-Conversion**
- **50+ Email-Captures/Tag**
- **10.000€+ Revenue/Monat**

---

**🚀 Ready für Entwicklung in separatem Cursor-Fenster!**

