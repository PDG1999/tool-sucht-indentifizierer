# Coolify Configuration - SAMEBI Tools

## 🎯 Übersicht
Zentrale Konfiguration für alle SAMEBI Tools auf Hetzner + Coolify.

## 🌐 Server Details
- **Provider:** Hetzner Cloud
- **Server:** CX21 (4 vCPU, 8GB RAM, 80GB SSD)
- **Location:** Nürnberg, Deutschland (DSGVO-konform)
- **IP:** 91.99.81.172
- **IPv6:** 2a01:4f8:c012:3c54::/64

## 🔧 Coolify Setup

### Dashboard Access
- **URL:** https://coolify.samebi.net:8000
- **Admin:** PDG1999
- **Status:** Production Ready

### Applications Overview
```
coolify.samebi.net/
├── herramientas-backend     → api.samebi.net
├── tool-stress-checker      → stress-checker.samebi.net
├── tool-rate-calculator     → rate-calculator.samebi.net
├── tool-burnout-test        → burnout-test.samebi.net
├── tool-location-analyzer   → location-analyzer.samebi.net
├── tool-content-generator   → content-generator.samebi.net
└── shared-components        → components.samebi.net
```

## 📁 Repository Mapping

### Backend Services
```json
{
  "name": "herramientas-backend",
  "repository": "https://github.com/PDG1999/herramientas-backend",
  "branch": "main",
  "domain": "api.samebi.net",
  "port": 3000,
  "environment": "production"
}
```

### Frontend Tools
```json
{
  "name": "tool-stress-checker",
  "repository": "https://github.com/PDG1999/tool-stress-checker", 
  "branch": "main",
  "domain": "stress-checker.samebi.net",
  "build_command": "npm run build",
  "output_directory": "dist"
}
```

## 🚀 Deployment Workflow

### Automatic Deployment
```bash
# Lokale Entwicklung
git add .
git commit -m "feat: neue Feature"
git push origin main

# → Coolify erkennt Push automatisch
# → Build startet automatisch  
# → Deployment auf Production Domain
# → SSL-Zertifikat wird automatisch erneuert
```

### Manual Deployment
```bash
# In Coolify Dashboard:
# 1. Application auswählen
# 2. "Deploy" Button klicken
# 3. Build-Logs überwachen
# 4. Deployment-Status prüfen
```

## 🔐 Environment Variables

### Global Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:xxx@localhost:5432/herramientas
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
CORS_ORIGIN=https://herramientas.samebi.net
```

### Tool-Specific Variables
```env
# Stress Checker
VITE_API_URL=https://api.samebi.net
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx

# Rate Calculator  
VITE_SPANISH_TAX_API=https://api.hacienda.gob.es
VITE_MARKET_DATA_API=https://api.marketdata.es
```

## 🔄 Backup Strategy

### Database Backups
```bash
# Automatische tägliche Backups
# Retention: 30 Tage
# Location: Hetzner Storage Box
# Encryption: AES-256
```

### Code Backups
```bash
# GitHub als Primary Backup
# Coolify als Secondary Backup
# Lokale Entwicklung als Tertiary
```

## 📊 Monitoring

### Health Checks
- **Backend API:** https://api.samebi.net/health
- **Database:** PostgreSQL Connection Check
- **Redis:** Cache Availability Check
- **SSL:** Certificate Expiry Monitoring

### Alerts
```yaml
alerts:
  - type: "downtime"
    threshold: "2 minutes"
    notification: "email + slack"
  
  - type: "high_cpu"
    threshold: "80%"
    duration: "5 minutes"
    
  - type: "ssl_expiry"
    threshold: "30 days"
```

## 🔧 Maintenance

### Regular Tasks
- [ ] **Weekly:** Server Updates (automatisch)
- [ ] **Monthly:** Backup Verification
- [ ] **Quarterly:** Performance Review
- [ ] **Yearly:** SSL Certificate Renewal (automatisch)

### Emergency Procedures
```bash
# Server Restart
ssh root@91.99.81.172 "systemctl restart coolify"

# Database Restore
# 1. Stop applications
# 2. Restore from backup
# 3. Restart applications
# 4. Verify functionality
```

## 📈 Scaling Plan

### Current Capacity
- **Concurrent Users:** 500-1000
- **Daily Requests:** 50,000-100,000
- **Storage:** 80GB (60% used)
- **RAM:** 8GB (40% used)

### Scaling Triggers
- **CPU > 70%** → Upgrade zu CX31 (8 vCPU)
- **RAM > 80%** → Upgrade zu CX31 (16GB RAM)
- **Storage > 90%** → Add Volume (100GB)
- **Users > 1000** → Load Balancer Setup

## 🆘 Support Contacts
- **Hetzner Support:** support@hetzner.com
- **Coolify Community:** Discord
- **Developer:** PDG1999
- **Emergency:** +49-XXX-XXXXXXX
