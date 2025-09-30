# 🚀 Coolify Deployment Guide - SAMEBI Backend

## 📋 Übersicht

Diese Anleitung dokumentiert den kompletten Deployment-Prozess für das SAMEBI Backend (PostgREST + PostgreSQL) auf Coolify. Alle Fehler und Lösungen sind dokumentiert, um zukünftige Deployments zu beschleunigen.

## ⚡ Quick Start Checklist

### ✅ Vor dem Deployment prüfen:
- [ ] PostgreSQL-Datenbank in Coolify erstellt
- [ ] Environment Variables korrekt gesetzt
- [ ] Dockerfile OHNE HEALTHCHECK
- [ ] docker-compose.yaml einfach (single service)
- [ ] Health Check in Coolify DEAKTIVIERT

## 🏗️ Schritt-für-Schritt Anleitung

### 1. PostgreSQL-Datenbank erstellen

**In Coolify:**
1. **"+ New" → "Database" → "PostgreSQL"**
2. **Name:** `herramientas-db`
3. **Database Name:** `postgres` (Standard)
4. **Username:** `postgres` (Standard)
5. **Password:** Wird automatisch generiert
6. **Deploy klicken**

**⚠️ Wichtig:** Notieren Sie sich das generierte Passwort!

### 2. Backend-Application erstellen

**In Coolify:**
1. **"+ New" → "Application"**
2. **Source:** GitHub Repository
3. **Repository:** `PDG1999/herramientas-backend`
4. **Branch:** `main`
5. **Build Pack:** Dockerfile
6. **Domain:** `api.samebi.net`

### 3. Environment Variables setzen

**Gehen Sie zu Application → Environment Variables:**

```bash
PGRST_DB_URI=postgres://postgres:IHR_DB_PASSWORT@DB_CONTAINER_NAME:5432/postgres
PGRST_DB_SCHEMAS=api
PGRST_DB_ANON_ROLE=web_anon
PGRST_JWT_SECRET=your-jwt-secret-key-here-min-32-chars-long
```

**🔍 So finden Sie die korrekten Werte:**
- **DB_CONTAINER_NAME:** PostgreSQL-DB → Configuration → General → Name (z.B. `nsgccoc4scg8g444c400c840`)
- **IHR_DB_PASSWORT:** PostgreSQL-DB → Configuration → Environment Variables → POSTGRES_PASSWORD

### 4. Health Check DEAKTIVIEREN

**⚠️ KRITISCH:** Health Check MUSS deaktiviert werden!

**In Application → Configuration → Healthcheck:**
- **Klicken Sie "Enable Healthcheck" bis es grau wird**
- **"Save" klicken**

## 📁 Korrekte Dateistruktur

### Dockerfile (OHNE HEALTHCHECK!)
```dockerfile
FROM alpine:3.18

# System-Abhängigkeiten installieren
RUN apk add --no-cache curl wget

# PostgREST Binary herunterladen
RUN wget -O /tmp/postgrest.tar.xz https://github.com/PostgREST/postgrest/releases/download/v11.2.0/postgrest-v11.2.0-linux-static-x64.tar.xz && \
    cd /tmp && \
    tar -xf postgrest.tar.xz && \
    mv postgrest /usr/local/bin/postgrest && \
    chmod +x /usr/local/bin/postgrest && \
    rm /tmp/postgrest.tar.xz

# PostgREST-Konfiguration kopieren
COPY postgrest.conf /etc/postgrest.conf

# Health Check entfernt - wird von Coolify verwaltet

# Port exponieren
EXPOSE 3000

# PostgREST starten
CMD ["/usr/local/bin/postgrest", "/etc/postgrest.conf"]
```

### docker-compose.yaml (Einfach!)
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - PGRST_DB_URI=${PGRST_DB_URI}
      - PGRST_DB_SCHEMAS=${PGRST_DB_SCHEMAS}
      - PGRST_DB_ANON_ROLE=${PGRST_DB_ANON_ROLE}
      - PGRST_JWT_SECRET=${PGRST_JWT_SECRET}
    ports:
      - "3000:3000"
    restart: unless-stopped
```

### postgrest.conf (Ohne Environment Variables!)
```ini
# PostgREST Configuration für SAMEBI Backend
# Environment Variables werden automatisch von PostgREST gelesen

# Server Settings
server-host = "0.0.0.0"
server-port = 3000

# Connection Pool
db-pool = 10
db-pool-acquisition-timeout = 10

# CORS Settings
server-cors-allowed-origins = "*"

# OpenAPI
openapi-server-proxy-uri = "https://api.samebi.net"

# Logging
log-level = "info"
```

## 🚨 Häufige Fehler und Lösungen

### Fehler 1: "password authentication failed"
**Ursache:** Falsches Passwort oder falscher Hostname
**Lösung:** 
- Korrektes Passwort aus DB-Environment Variables kopieren
- Korrekten Container-Namen verwenden (NICHT den Display-Namen!)

### Fehler 2: "could not translate host name"
**Ursache:** Falscher Datenbank-Hostname
**Lösung:** 
- Container-Name verwenden: `nsgccoc4scg8g444c400c840`
- NICHT: `postgresql-database-nsgccoc4scg8g444c400c840`

### Fehler 3: "unexpected '{' in config"
**Ursache:** `${VARIABLE}` Syntax in postgrest.conf
**Lösung:** 
- Environment Variables aus postgrest.conf entfernen
- PostgREST liest sie automatisch

### Fehler 4: "curl: (22) The requested URL returned error: 400"
**Ursache:** PostgREST antwortet mit 400 auf `/` (normal ohne Schema)
**Lösung:** 
- Health Check deaktivieren
- 400-Antwort ist normal für PostgREST ohne API-Schema

### Fehler 5: "map has no entry for key 'Health'"
**Ursache:** Coolify-Cache-Problem mit Health Check
**Lösung:** 
- Application komplett neu erstellen
- ODER: "Disable Build Cache" aktivieren

## 🔧 Troubleshooting-Schritte

### Bei Deployment-Fehlern:
1. **Logs prüfen:** Application → Logs
2. **Container-Status:** Application → Deployments
3. **Environment Variables:** Sind alle gesetzt?
4. **Health Check:** Ist deaktiviert?
5. **Cache leeren:** Advanced → "Disable Build Cache"

### Bei "no available server":
1. **Container läuft nicht** → Deployment-Logs prüfen
2. **Health Check Problem** → Health Check deaktivieren
3. **DNS Problem** → Cloudflare-Einstellungen prüfen

### Bei SSL-Problemen:
1. **Cloudflare:** SSL/TLS auf "Full (strict)" setzen
2. **Warten:** SSL-Zertifikat braucht Zeit
3. **Fallback:** `http://` statt `https://` testen

## 🎯 Best Practices

### ✅ DO:
- Health Check immer deaktivieren
- Einfache docker-compose.yaml verwenden
- Container-Namen (nicht Display-Namen) für DB-Verbindung
- Environment Variables in Coolify setzen (nicht in Dateien)
- Bei Problemen: Application neu erstellen

### ❌ DON'T:
- HEALTHCHECK in Dockerfile verwenden
- `${VARIABLE}` Syntax in postgrest.conf
- Komplexe Multi-Service docker-compose.yaml
- Health Checks bei PostgREST aktivieren
- Display-Namen für Datenbank-Verbindungen

## 🚀 Deployment-Workflow

### Neues Backend deployen:
1. **PostgreSQL-DB erstellen** (5 min)
2. **Application erstellen** (2 min)
3. **Environment Variables setzen** (3 min)
4. **Health Check deaktivieren** (1 min)
5. **Deploy** (2 min)
6. **Testen** (1 min)

**Total: ~15 Minuten** (statt 3+ Stunden mit Fehlern!)

## 📊 Erfolgskontrolle

### ✅ Deployment erfolgreich wenn:
```bash
✅ "Building docker image completed"
✅ "New container started" 
✅ "Rolling update completed"
❌ KEIN "template parsing error"
❌ KEIN "unhealthy" Status
```

### ✅ API funktioniert wenn:
- `https://api.samebi.net` erreichbar
- PostgREST-Antwort (JSON) wird angezeigt
- Keine "no available server" Meldung

## 🔗 Nützliche Links

- **PostgREST Dokumentation:** https://postgrest.org/
- **Coolify Dokumentation:** https://coolify.io/docs
- **PostgreSQL Dokumentation:** https://www.postgresql.org/docs/

## 📝 Changelog

- **2025-09-30:** Initiale Dokumentation nach erfolgreichem Deployment
- Alle Fehler und Lösungen dokumentiert
- Best Practices etabliert
- Workflow optimiert von 3+ Stunden auf 15 Minuten

---

**💡 Tipp:** Diese Anleitung bei jedem Backend-Deployment befolgen. Bei neuen Fehlern: Dokumentation erweitern!
