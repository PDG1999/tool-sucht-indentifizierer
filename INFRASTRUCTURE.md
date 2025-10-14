# 🖥️ SAMEBI INFRASTRUCTURE DOKUMENTATION

**Stand:** Oktober 2025  
**Server-Provider:** Hetzner Cloud  
**Deployment-Platform:** Coolify (Self-Hosted)

---

## 🌐 SERVER-ZUGANG

### Server-Details
```yaml
Provider: Hetzner Cloud
Server-Typ: CPX31 (4 vCPU, 8GB RAM, 160GB NVMe)
Aktuell: ubuntu-4gb-fsn1-2 (4GB RAM, 75GB Disk)
IP-Adresse: 91.98.93.203
Hostname: ubuntu-4gb-fsn1-2
OS: Ubuntu 24.04.3 LTS
Uptime: 15+ Tage (sehr stabil)
```

### SSH-Zugang
```bash
# Direkte Verbindung
ssh root@91.98.93.203

# Oder mit Alias (in ~/.ssh/config konfiguriert)
ssh samebi-server

# SSH-Key Location
~/.ssh/id_ed25519_hetzner
~/.ssh/id_ed25519_hetzner.pub
```

### SSH-Config (bereits eingerichtet)
```bash
# In ~/.ssh/config:
Host samebi-server
    HostName 91.98.93.203
    User root
    IdentityFile ~/.ssh/id_ed25519_hetzner
    ServerAliveInterval 60
    ServerAliveCountMax 3

Host 91.98.93.203
    User root
    IdentityFile ~/.ssh/id_ed25519_hetzner
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

---

## 🐳 DOCKER SETUP

### Docker Version
```yaml
Version: Docker 27.0.3
Build: 7d4bcd8
```

### Aktive Container (Stand: Test)
```yaml
Coolify-Core:
  - coolify: Haupt-Platform (Port 8080)
  - coolify-proxy: Reverse Proxy (Ports 80, 443)
  - coolify-db: PostgreSQL für Coolify
  - coolify-redis: Redis für Coolify
  - coolify-realtime: WebSocket-Server
  - coolify-sentinel: Health-Monitoring

PostgreSQL:
  - nsgccoc4scg8g444c400c840: Shared PostgreSQL 17.6

Apps (Tools):
  - hos0ook04w4owggg808g80cc: Tool 1 (11 Tage uptime)
  - o0kkssg4o0wk844oko0sc4g8: Tool 2 (11 Tage uptime)
  - uoo4kgk0kw0sswowg8w04o8s: Tool 3 (7 Tage uptime)
  - n8co08808kg4ocg0wogkc8k4: Tool 4 (6 Tage uptime)
```

### Docker-Management-Befehle
```bash
# Alle Container anzeigen
ssh 91.98.93.203 'docker ps'

# Logs anzeigen
ssh 91.98.93.203 'docker logs CONTAINER_NAME'

# Container neu starten
ssh 91.98.93.203 'docker restart CONTAINER_NAME'

# In Container Shell öffnen
ssh 91.98.93.203 'docker exec -it CONTAINER_NAME sh'
```

---

## 🔴 REDIS

### Shared Redis (für Caching & Sessions)
```yaml
Container: redis-shared
Version: Redis 7.4.5 (Alpine)
Status: Healthy
Port: 6379 (intern)

Connection-String (intern):
redis://redis-shared:6379

Features:
- Caching für API-Responses
- Session-Management
- Rate-Limiting
- Real-time Data
```

### Redis-Zugriff
```bash
# Redis CLI öffnen
ssh 91.98.93.203 'docker exec -it redis-shared redis-cli'

# Test-Befehl
ssh 91.98.93.203 'docker exec redis-shared redis-cli ping'

# Keys anzeigen
ssh 91.98.93.203 'docker exec redis-shared redis-cli KEYS "*"'

# Monitoring
ssh 91.98.93.203 'docker exec redis-shared redis-cli INFO'
```

---

## 🗄️ POSTGRESQL

### Shared PostgreSQL (für herramientas-backend)
```yaml
Container: nsgccoc4scg8g444c400c840
Version: PostgreSQL 17.6 (Alpine)
Status: Healthy (2 Wochen uptime)
Datenbank: herramientas

Connection-String (intern):
postgresql://postgres:PASSWORD@nsgccoc4scg8g444c400c840:5432/herramientas

Connection-String (extern via Coolify):
postgresql://postgres:PASSWORD@91.98.93.203:PORT/herramientas

Schema: shared_core
Tabellen:
  - tools (3 Tools registriert)
  - tool_usage (Analytics)
  - leads (CRM)
  - course_access (Monetarisierung)
  - white_label_clients (White-Label)
Indizes: 13 Performance-Indizes
```

### PostgreSQL-Zugriff
```bash
# Direkt in Container
ssh 91.98.93.203 'docker exec -it nsgccoc4scg8g444c400c840 psql -U postgres'

# Datenbanken anzeigen
ssh 91.98.93.203 'docker exec nsgccoc4scg8g444c400c840 psql -U postgres -c "\l"'

# Tabellen anzeigen
ssh 91.98.93.203 'docker exec nsgccoc4scg8g444c400c840 psql -U postgres -d herramientas -c "\dt"'
```

### Aktuelle Datenbanken
```yaml
- herramientas: Haupt-Datenbank für alle Tools
- (weitere können hinzugefügt werden)
```

---

## 🤖 N8N AUTOMATION

### N8N (Workflow-Automation)
```yaml
Container: n8n-automation
Version: 1.115.2
Status: Running
Port: 5678

Zugriff:
  - Aktuell: http://91.98.93.203:5678
  - Geplant: https://automation.samebi.net

Login:
  - Username: admin
  - Password: SameBi2025Secure!

Features:
  - Workflow-Automation
  - Tool-Deployment-Pipeline
  - Lead-Processing
  - Email-Automation
  - Webhook-Handling
```

### N8N-Zugriff
```bash
# N8N Logs anzeigen
ssh 91.98.93.203 'docker logs n8n-automation -f'

# N8N neu starten
ssh 91.98.93.203 'docker restart n8n-automation'

# N8N-Container Shell
ssh 91.98.93.203 'docker exec -it n8n-automation sh'
```

### N8N Workflows (geplant)
```yaml
1. New Tool Deployment:
   - Tool-Config laden
   - Tool generieren
   - Git commit & push
   - Coolify deployment triggern

2. Lead Processing:
   - Lead aus API empfangen
   - Zu Brevo senden
   - Lead-Score berechnen
   - Email-Sequenz starten

3. Content Updates:
   - CMS-Updates erkennen
   - Tools neu deployen
   - Cache invalidieren
```

---

## 🔧 COOLIFY

### Coolify-Zugang
```yaml
URL: https://91.98.93.203:8000 (oder Custom-Domain)
Login: Via Coolify-Setup konfiguriert
Port: 8080 (intern), 8000 (extern)
```

### Coolify-Proxy (Traefik)
```yaml
HTTP: Port 80
HTTPS: Port 443 (mit Let's Encrypt SSL)
Status: Port 8080
```

### Wichtige Coolify-Befehle
```bash
# Coolify-Status prüfen
ssh 91.98.93.203 'docker ps | grep coolify'

# Coolify-Logs
ssh 91.98.93.203 'docker logs coolify -f'

# Coolify neu starten (nur im Notfall!)
ssh 91.98.93.203 'docker restart coolify'
```

---

## 🌍 DOMAINS & DNS

### Haupt-Domain
```yaml
Domain: samebi.net
DNS-Provider: Cloudflare (angenommen)
```

### Tool-Subdomains (geplant/aktiv)
```yaml
Deutsch (DE):
  - stress-test.samebi.net (75% fertig)
  - burnout-test.samebi.net
  - standort-analyse.samebi.net
  - honorar-rechner.samebi.net

Spanisch (ES):
  - test-estres.samebi.net (✅ fertig)
  - test-burnout.samebi.net
  - analisis-ubicacion.samebi.net
  - calculadora-honorarios.samebi.net

Englisch (EN):
  - stress-check.samebi.net (wartend)
  - burnout-check.samebi.net
  - location-analyzer.samebi.net
  - rate-calculator.samebi.net

Backend/Services:
  - api.samebi.net (Backend-API)
  - automation.samebi.net (N8N - geplant)
  - dashboard.samebi.net (Admin-Dashboard)
```

### DNS-Konfiguration (Standard)
```yaml
Type: A-Record
Host: subdomain
Value: 91.98.93.203
TTL: 300 (5 Minuten)
Proxy: Off (Cloudflare Direct)
```

---

## 🔌 WICHTIGE PORTS

### Öffentlich (Firewall offen)
```yaml
80: HTTP (Coolify-Proxy)
443: HTTPS (Coolify-Proxy)
8000: Coolify-Dashboard
```

### Intern (Docker-Netzwerk)
```yaml
5432: PostgreSQL
6379: Redis (wenn installiert)
3000: Node.js Apps (Standard)
5000: Python Apps (Standard)
8080: Coolify-Proxy Status
```

---

## 📊 SYSTEM-RESSOURCEN

### Aktueller Status
```yaml
RAM: 1.4GB / 3.7GB verwendet (38%)
Disk: 5.9GB / 75GB verwendet (9%)
CPU Load: 0.12, 0.26, 0.25 (niedrig)

Status: ✅ Viel Kapazität verfügbar
```

### Monitoring
```yaml
- Coolify-Sentinel: Internes Health-Monitoring
- Uptime Robot: Externe Überwachung (geplant)
- Docker Stats: docker stats (Live-Monitoring)
```

---

## 🔐 SICHERHEIT

### SSH
```yaml
- Key-basierte Authentifizierung (ed25519)
- Root-Zugang nur mit SSH-Key
- Passwort-Login deaktiviert (empfohlen)
```

### Docker
```yaml
- Private Docker-Netzwerke (coolify)
- Container-Isolation
- Health-Checks aktiv
```

### SSL/TLS
```yaml
- Let's Encrypt via Coolify-Proxy
- Automatische Renewal
- HTTPS für alle Domains
```

---

## 🚀 GEPLANTE ERWEITERUNGEN (aus ROADMAP)

### Phase 1 (Woche 1-2)
- [ ] Redis (Shared Cache) installieren
- [ ] N8N (Automation) installieren auf automation.samebi.net
- [ ] PostgreSQL-Schema erweitern (shared_core)

### Phase 2 (Woche 3-4)
- [ ] Stripe-Integration
- [ ] Brevo Email-Service

### Phase 3 (Woche 5-8)
- [ ] White-Label System
- [ ] CDN (Cloudflare)

---

## 📝 WICHTIGE NOTIZEN

### Backup-Strategie
```yaml
PostgreSQL:
  - Täglich automatisch (via Coolify oder Cron)
  - Location: /backups/ oder externe Storage

Git:
  - Alle Configs versioniert
  - Push nach jedem Deployment
```

### Rollback-Prozess
```yaml
1. Coolify: Vorherige Version wiederherstellen
2. Docker: Altes Image deployen
3. DNS: Bei Bedarf temporär auf Maintenance-Page
```

### Support-Kontakte
```yaml
Hetzner Support: https://console.hetzner.cloud
Coolify Docs: https://coolify.io/docs
```

---

## 🔄 UPDATE-LOG

```yaml
2025-10-14:
  - SSH-Key-Authentifizierung eingerichtet
  - SSH-Config erstellt (~/.ssh/config)
  - System-Status dokumentiert
  - INFRASTRUCTURE.md erstellt
  - ✅ Redis installiert (redis-shared, Version 7.4.5)
  - Redis-Dokumentation hinzugefügt
  - ✅ PostgreSQL Schema erweitert (herramientas DB, shared_core Schema)
  - 5 Tabellen erstellt (tools, tool_usage, leads, course_access, white_label_clients)
  - 13 Performance-Indizes erstellt
  - 3 bestehende Tools registriert (stress-test, burnout-test, sucht-screening)
  - ✅ N8N installiert (Version 1.115.2)
  - N8N läuft auf Port 5678
  - N8N-Dokumentation hinzugefügt
  - PHASE 1, TAG 1 ABGESCHLOSSEN! 🎉
```

---

**🎯 Siehe auch:**
- `SAMEBI-IMPLEMENTATION-ROADMAP.md` - Entwicklungs-Roadmap
- `SAMEBI-ARCHITECTURE.md` - System-Architektur
- `DEPLOYMENT-CHECKLIST.md` - Deployment-Prozess
- `COOLIFY-DEPLOYMENT-GUIDE.md` - Coolify-spezifische Anleitung

