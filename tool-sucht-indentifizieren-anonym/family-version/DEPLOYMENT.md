# 🚀 Deployment Guide - Familie/Freunde Version

## 📋 Übersicht

Diese Anleitung beschreibt, wie die Familie/Freunde-Version des Sucht-Checks deployed wird.

**Domain:** `sucht-check.samebi.net` (Deutsch)

## 🎯 Deployment-Optionen

### Option 1: Coolify (Empfohlen)

#### Voraussetzungen
- Coolify Server läuft auf `91.98.93.203`
- Domain `sucht-check.samebi.net` ist auf die Server-IP gerichtet
- GitHub Repository ist verknüpft

#### Schritte

1. **Neue Applikation in Coolify erstellen:**
   ```
   Name: sucht-check-family-de
   Type: Docker Compose
   Repository: [GitHub URL]
   Branch: main
   Build Path: /family-version
   ```

2. **Domain konfigurieren:**
   ```
   Domain: sucht-check.samebi.net
   SSL: Let's Encrypt (automatisch)
   ```

3. **Environment Variables setzen:**
   ```bash
   NODE_ENV=production
   VITE_APP_TYPE=family
   VITE_TARGET_AUDIENCE=relatives
   VITE_LANGUAGE=de
   ```

4. **Deploy ausführen:**
   - Coolify erkennt automatisch die `coolify.json`
   - Automatischer Build und Deployment
   - SSL-Zertifikat wird automatisch erstellt

5. **Überprüfen:**
   ```
   https://sucht-check.samebi.net
   ```

### Option 2: Docker Compose (Manuell)

#### Auf dem Server (91.98.93.203)

1. **Repository clonen:**
   ```bash
   cd /opt/samebi-tools
   git clone [repository-url]
   cd tool-sucht-indentifizieren-anonym/family-version
   ```

2. **Environment-Datei erstellen:**
   ```bash
   cp .env.example .env
   # Anpassen nach Bedarf
   ```

3. **Container bauen und starten:**
   ```bash
   docker-compose up -d --build
   ```

4. **Nginx Reverse Proxy konfigurieren:**
   ```nginx
   server {
       listen 80;
       server_name sucht-check.samebi.net;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name sucht-check.samebi.net;

       ssl_certificate /etc/letsencrypt/live/sucht-check.samebi.net/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/sucht-check.samebi.net/privkey.pem;

       location / {
           proxy_pass http://localhost:3003;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

5. **SSL-Zertifikat erstellen:**
   ```bash
   certbot certonly --nginx -d sucht-check.samebi.net
   ```

6. **Nginx neu laden:**
   ```bash
   nginx -t
   systemctl reload nginx
   ```

### Option 3: Lokale Entwicklung

1. **Dependencies installieren:**
   ```bash
   npm install
   ```

2. **Development Server starten:**
   ```bash
   npm run dev
   ```

3. **Im Browser öffnen:**
   ```
   http://localhost:3003
   ```

## 🔧 Konfiguration

### Environment Variables

| Variable | Beschreibung | Standardwert |
|----------|-------------|--------------|
| `NODE_ENV` | Umgebung | `production` |
| `VITE_APP_TYPE` | App-Typ | `family` |
| `VITE_TARGET_AUDIENCE` | Zielgruppe | `relatives` |
| `VITE_LANGUAGE` | Sprache | `de` |
| `VITE_API_URL` | Backend-API (optional) | - |
| `VITE_ENABLE_ANALYTICS` | Analytics aktivieren | `false` |

### Build-Konfiguration

Die App nutzt **Vite** für schnelle Builds:
- Production Build: `npm run build`
- Output Directory: `dist/`
- Optimierungen: Code splitting, Tree shaking, Minification

## 📊 Health Checks

Die App bietet einen Health-Check-Endpoint:

```
GET /health
Response: 200 OK "healthy"
```

Coolify und Docker nutzen diesen automatisch.

## 🔐 Sicherheit

### Implementierte Maßnahmen:
- ✅ HTTPS erzwungen (Let's Encrypt)
- ✅ Security Headers (CSP, X-Frame-Options, etc.)
- ✅ Keine Cookies oder Tracking
- ✅ Keine Datenspeicherung auf Server
- ✅ DSGVO-konform

### Content Security Policy:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self';
```

## 🌐 Multi-Language Setup

Für zukünftige Sprachen:

### Spanisch (test-adiccion.samebi.net)
```bash
# Neue Instanz in Coolify
Name: sucht-check-family-es
Domain: test-adiccion.samebi.net
Environment: VITE_LANGUAGE=es
```

### Englisch (addiction-check.samebi.net)
```bash
# Neue Instanz in Coolify
Name: sucht-check-family-en
Domain: addiction-check.samebi.net
Environment: VITE_LANGUAGE=en
```

**Hinweis:** Für jede Sprache müssen die Fragen und UI-Texte übersetzt werden.

## 📈 Monitoring

### Logs überprüfen:
```bash
# Docker Compose
docker-compose logs -f

# Coolify
# Logs direkt in der Coolify-UI verfügbar
```

### Health Check:
```bash
curl https://sucht-check.samebi.net/health
```

### Performance:
- Lighthouse Score Ziel: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <3s

## 🔄 Updates

### Automatische Updates (Coolify):
- Push zu `main` Branch
- Coolify detected automatisch
- Auto-Deploy nach ~2-3 Minuten

### Manuelle Updates (Docker Compose):
```bash
cd /opt/samebi-tools/tool-sucht-indentifizieren-anonym/family-version
git pull
docker-compose up -d --build
```

## 🆘 Troubleshooting

### App startet nicht:
```bash
# Logs prüfen
docker-compose logs family-version

# Container neu starten
docker-compose restart family-version
```

### SSL-Probleme:
```bash
# Zertifikat erneuern
certbot renew

# Nginx neu laden
systemctl reload nginx
```

### Port-Konflikte:
```bash
# Prüfen, welcher Prozess Port 3003 nutzt
lsof -i :3003

# Port in docker-compose.yml ändern
```

## 📞 Support

**Technische Fragen:**
- GitHub Issues: [Repository Link]

**Server-Zugang:**
- IP: 91.98.93.203
- SSH: `ssh user@91.98.93.203`

**Notfall:**
- Coolify UI: `https://coolify.samebi.net`
- Hetzner Cloud Console

---

## ✅ Deployment Checklist

Vor dem ersten Deployment:

- [ ] Domain DNS-Eintrag gesetzt (A-Record auf 91.98.93.203)
- [ ] Repository auf GitHub gepusht
- [ ] Coolify-App konfiguriert
- [ ] Environment Variables gesetzt
- [ ] SSL-Zertifikat erstellt
- [ ] Health Check funktioniert
- [ ] Test durchgeführt (vollständiger User-Flow)
- [ ] Performance überprüft (Lighthouse)
- [ ] DSGVO-Hinweise verifiziert

Nach dem Deployment:

- [ ] URL öffnet sich: `https://sucht-check.samebi.net`
- [ ] Test komplett durchführbar
- [ ] Ergebnisse werden korrekt angezeigt
- [ ] Mobile Version funktioniert
- [ ] Gesprächsleitfäden werden angezeigt
- [ ] Notfall-Kontakte sind sichtbar
- [ ] SSL-Zertifikat ist gültig
- [ ] Security Headers sind gesetzt

---

**💙 Bereit für den Launch!**

