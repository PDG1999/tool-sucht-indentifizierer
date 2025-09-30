# Coolify Setup-Anleitung - SAMEBI Tools

## 🎯 **Was Sie in Coolify machen müssen**

### **Server-Zugang:**
- **URL:** https://coolify.samebi.net:8000
- **Admin:** PDG1999
- **Server-IP:** 91.98.93.203

## 📋 **Schritt-für-Schritt Anleitung**

### **1. Backend-API zuerst deployen (WICHTIG!)**

**Neue Application erstellen:**
```json
Name: herramientas-backend
Type: Docker Compose
Repository: https://github.com/PDG1999/herramientas-backend
Branch: main
Domain: api.samebi.net
```

**Environment Variables:**
```env
POSTGRES_DB=herramientas
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password_123
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
CORS_ORIGIN=*
PGRST_DB_SCHEMAS=api
PGRST_DB_ANON_ROLE=web_anon
```

**Deployment-Einstellungen:**
- ✅ Auto-Deploy on Git Push
- ✅ SSL Certificate (automatisch)
- Port: 3000 (wird automatisch erkannt)

---

### **2. Stress-Test Tools (3 separate Apps)**

#### **App 1: Spanisch (✅ fertig & getestet)**
```json
Name: stress-test-es
Type: Static Site
Repository: https://github.com/PDG1999/tool-stress-checker
Branch: main
Domain: test-estres.samebi.net
Build Command: npm run build
Output Directory: dist
Index File: index.html
```

**Environment Variables:**
```env
VITE_LANGUAGE=es
VITE_API_URL=https://api.samebi.net
VITE_GA_TRACKING_ID=G-ES-XXXXXXXXX
VITE_EMAIL_SERVICE_URL=https://api.samebi.net/email
VITE_STRIPE_PUBLIC_KEY=pk_live_es_xxx
VITE_APP_NAME=Test de Estrés SAMEBI
VITE_SUPPORT_EMAIL=soporte@samebi.net
```

#### **App 2: Deutsch (🔄 75% fertig)**
```json
Name: stress-test-de
Type: Static Site
Repository: https://github.com/PDG1999/tool-stress-checker
Branch: main
Domain: stress-test.samebi.net
Build Command: npm run build
Output Directory: dist
Index File: index.de.html
```

**Environment Variables:**
```env
VITE_LANGUAGE=de
VITE_API_URL=https://api.samebi.net
VITE_GA_TRACKING_ID=G-DE-XXXXXXXXX
VITE_EMAIL_SERVICE_URL=https://api.samebi.net/email
VITE_STRIPE_PUBLIC_KEY=pk_live_de_xxx
VITE_APP_NAME=Stress-Test SAMEBI
VITE_SUPPORT_EMAIL=support@samebi.net
```

#### **App 3: Englisch (⏳ wartet)**
```json
Name: stress-test-en
Type: Static Site
Repository: https://github.com/PDG1999/tool-stress-checker
Branch: main
Domain: stress-check.samebi.net
Build Command: npm run build
Output Directory: dist
Index File: index.en.html
```

**Environment Variables:**
```env
VITE_LANGUAGE=en
VITE_API_URL=https://api.samebi.net
VITE_GA_TRACKING_ID=G-EN-XXXXXXXXX
VITE_EMAIL_SERVICE_URL=https://api.samebi.net/email
VITE_STRIPE_PUBLIC_KEY=pk_live_en_xxx
VITE_APP_NAME=Stress Test SAMEBI
VITE_SUPPORT_EMAIL=support@samebi.net
```

---

### **3. Shared Components (Optional, aber empfohlen)**

```json
Name: shared-components
Type: Static Site
Repository: https://github.com/PDG1999/shared-components
Branch: main
Domain: components.samebi.net
Build Command: npm run build-storybook
Output Directory: storybook-static
```

**Environment Variables:**
```env
NODE_ENV=production
STORYBOOK_BASE_URL=https://components.samebi.net
```

---

## 🔧 **Coolify-Konfiguration im Detail**

### **Deployment-Reihenfolge (WICHTIG!):**
```
1. herramientas-backend    → api.samebi.net (ZUERST!)
2. stress-test-es         → test-estres.samebi.net
3. stress-test-de         → stress-test.samebi.net  
4. stress-test-en         → stress-check.samebi.net
5. shared-components      → components.samebi.net (optional)
```

### **Warum diese Reihenfolge?**
- **Backend zuerst:** Alle Frontend-Apps brauchen die API
- **Spanisch zuerst:** Ist bereits getestet und funktioniert
- **Deutsch dann:** 75% fertig, kann schnell deployed werden
- **Englisch zuletzt:** Wartet noch auf Fertigstellung

### **SSL-Zertifikate:**
- ✅ Werden automatisch von Coolify generiert (Let's Encrypt)
- ✅ Automatische Erneuerung alle 90 Tage
- ✅ Keine manuelle Konfiguration nötig

### **Auto-Deploy Einstellungen:**
```yaml
Für alle Apps aktivieren:
✅ Auto-Deploy on Git Push
✅ Build Logs anzeigen
✅ Deployment Notifications (optional)
✅ Health Checks (automatisch)
```

## 📊 **Monitoring & Logs**

### **Health Checks:**
```yaml
herramientas-backend:
  URL: https://api.samebi.net/health
  Interval: 30 Sekunden
  
stress-test-es:
  URL: https://test-estres.samebi.net
  Interval: 60 Sekunden
  
stress-test-de:
  URL: https://stress-test.samebi.net
  Interval: 60 Sekunden
  
stress-test-en:
  URL: https://stress-check.samebi.net
  Interval: 60 Sekunden
```

### **Log-Monitoring:**
```bash
# In Coolify Dashboard für jede App:
# 1. Application auswählen
# 2. "Logs" Tab klicken
# 3. Real-time Logs anzeigen
# 4. Filter nach Error/Warning setzen
```

## 🚨 **Troubleshooting**

### **Häufige Probleme:**

#### **1. Build Failed**
```bash
Lösung:
1. Logs in Coolify prüfen
2. Environment Variables kontrollieren
3. Repository-Zugriff prüfen
4. Node.js Version prüfen (sollte 18+ sein)
```

#### **2. Domain nicht erreichbar**
```bash
Lösung:
1. DNS-Records in Cloudflare prüfen
2. SSL-Zertifikat Status prüfen
3. Coolify Health Check prüfen
4. Server-Firewall prüfen (Port 80/443)
```

#### **3. API-Verbindung fehlgeschlagen**
```bash
Lösung:
1. herramientas-backend Status prüfen
2. CORS-Einstellungen prüfen
3. API-URL in Environment Variables prüfen
4. Database-Verbindung testen
```

### **Emergency Procedures:**
```bash
# 1. Kompletter Server-Neustart
ssh root@91.98.93.203
systemctl restart coolify

# 2. Einzelne App neustarten
# → Coolify Dashboard → App auswählen → "Restart" Button

# 3. Rollback zu vorheriger Version
# → Coolify Dashboard → App → "Deployments" → Vorherige Version → "Redeploy"
```

## 📈 **Performance-Optimierung**

### **Build-Optimierungen:**
```yaml
Für alle Frontend-Apps:
- Node.js 18+ verwenden
- npm ci statt npm install
- Build-Cache aktivieren
- Gzip-Kompression aktivieren

Für Backend:
- Docker Layer Caching
- Multi-stage Builds
- Health Check Optimierung
```

### **Resource-Limits:**
```yaml
herramientas-backend:
  CPU: 2 Cores
  RAM: 2GB
  Storage: 10GB
  
Frontend-Apps (je):
  CPU: 0.5 Cores  
  RAM: 512MB
  Storage: 1GB
```

## 🔄 **Backup & Recovery**

### **Automatische Backups:**
```yaml
Database (herramientas-backend):
- Häufigkeit: Täglich um 02:00 UTC
- Retention: 30 Tage
- Location: Hetzner Storage Box
- Encryption: AES-256

Application Data:
- Git Repositories (automatisch)
- Coolify Configuration (wöchentlich)
- SSL Certificates (automatisch)
```

### **Recovery-Prozess:**
```bash
# 1. Database Recovery
# → Coolify Dashboard → herramientas-backend
# → "Backups" Tab → Backup auswählen → "Restore"

# 2. Application Recovery  
# → Git Repository → Previous Commit → Redeploy

# 3. Complete Server Recovery
# → Hetzner Console → Server Snapshot → Restore
```

## 📞 **Support-Kontakte**

### **Bei Problemen:**
- **Coolify Issues:** GitHub Issues oder Discord
- **Hetzner Server:** support@hetzner.com
- **DNS (Cloudflare):** Cloudflare Support
- **Code Issues:** PDG1999

### **Monitoring-URLs:**
- **Coolify Dashboard:** https://coolify.samebi.net:8000
- **Server Status:** https://status.hetzner.com
- **Uptime Monitoring:** (zu konfigurieren)

---

**Status:** ✅ Setup-Anleitung vollständig
**Nächste Schritte:** Apps in angegebener Reihenfolge erstellen
**Geschätzte Setup-Zeit:** 2-3 Stunden für alle Apps

