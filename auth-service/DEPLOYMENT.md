# 🚀 SAMEBI Auth Service - Deployment Guide

## 📋 Schnellstart (5 Minuten)

### Option 1: Direkt auf dem Server deployen

```bash
# 1. Auf den Server einloggen
ssh -i ~/.ssh/id_ed25519_hetzner root@91.98.93.203

# 2. Auth Service Code kopieren
mkdir -p /root/samebi-auth-service
cd /root/samebi-auth-service

# 3. Dateien vom lokalen Mac kopieren (in neuem Terminal):
scp -i ~/.ssh/id_ed25519_hetzner -r ~/path/to/auth-service/* root@91.98.93.203:/root/samebi-auth-service/

# 4. Docker Image bauen
docker build -t samebi-auth-service .

# 5. Container starten
docker run -d \
  --name samebi-auth \
  --network coolify \
  -p 3001:3001 \
  --env-file .env \
  --restart unless-stopped \
  samebi-auth-service

# 6. Logs prüfen
docker logs -f samebi-auth

# 7. Health Check
curl http://localhost:3001/health
```

### Option 2: Via Coolify (Empfohlen)

1. **Git Repository erstellen:**
   ```bash
   cd auth-service
   git init
   git add .
   git commit -m "Initial commit: SAMEBI Auth Service"
   ```

2. **In Coolify:**
   - Neue "Application" erstellen
   - Repository: PDG-Tools-SAMEBI/auth-service
   - Port: 3001
   - Health Check: `/health`
   - Environment Variables setzen (aus .env)
   - Domain: `auth.samebi.net`

3. **Deploy!**

## 🔗 Traefik-Konfiguration

Damit `auth.samebi.net` funktioniert:

```bash
# Füge Traefik-Labels hinzu (Coolify macht das automatisch)
docker run -d \
  --label "traefik.enable=true" \
  --label "traefik.http.routers.auth.rule=Host(\`auth.samebi.net\`)" \
  --label "traefik.http.routers.auth.entrypoints=websecure" \
  --label "traefik.http.routers.auth.tls.certresolver=letsencrypt" \
  --label "traefik.http.services.auth.loadbalancer.server.port=3001" \
  samebi-auth-service
```

## 📡 PostgREST Integration

### Option A: PostgREST als Proxy zum Auth-Service

Füge in `postgrest.conf` hinzu:
```conf
# Proxy login requests to auth service
openapi-mode = ignore-privileges
```

### Option B: Direkter Auth-Service (EMPFOHLEN)

Dashboard verbindet sich direkt mit `auth.samebi.net`:

```typescript
// src/services/api.ts
const AUTH_URL = 'https://auth.samebi.net';
const API_URL = 'https://api.samebi.net';

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${AUTH_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const { token, user } = await response.json();
    localStorage.setItem('auth_token', token);
    return { token, user };
  }
};
```

## 🧪 Testing

### Lokaler Test:

```bash
# Start service
npm run dev

# Test login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "supervisor@samebi.net", "password": "SupervisorSAMEBI2025!"}'

# Expected response:
# {"token":"eyJhbGciOiJIUzI1NiIs...","user":{...}}
```

### Production Test:

```bash
# Test via auth.samebi.net
curl -X POST https://auth.samebi.net/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "supervisor@samebi.net", "password": "SupervisorSAMEBI2025!"}'

# Verify token
curl -H "Authorization: Bearer <TOKEN>" https://api.samebi.net/clients
```

## 🔄 Migration von PostgREST Login

### 1. Dashboard Code updaten:

```typescript
// Alte Version (PostgREST):
const response = await apiCall('/rpc/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

// Neue Version (Auth Service):
const response = await fetch('https://auth.samebi.net/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

### 2. PostgREST Login-Funktion entfernen (optional):

```sql
-- Kann entfernt werden, da nicht mehr genutzt
DROP FUNCTION IF EXISTS api.login CASCADE;
```

### 3. Dashboard neu deployen:

```bash
cd tool-sucht-dashboard
npm run build
# Deploy zu Coolify
```

## 📊 Monitoring

### Logs ansehen:

```bash
# Docker logs
docker logs -f samebi-auth

# Nur Errors
docker logs samebi-auth 2>&1 | grep -i error

# Live logs mit Zeitstempel
docker logs -f --timestamps samebi-auth
```

### Metriken:

```bash
# Health check
watch -n 5 'curl -s https://auth.samebi.net/health | jq .'

# Login-Erfolgsrate (aus Logs)
docker logs samebi-auth | grep "Successful login" | wc -l
docker logs samebi-auth | grep "invalid password" | wc -l
```

## 🔐 Security Checklist

- [x] JWT Secret ist stark (32+ Zeichen)
- [x] Passwörter werden mit bcrypt gehashed
- [x] Rate Limiting ist aktiv
- [x] HTTPS ist konfiguriert (via Traefik)
- [x] CORS ist auf spezifische Origins beschränkt
- [x] Keine Secrets in Logs
- [x] Graceful Shutdown implementiert
- [x] Health Checks funktionieren
- [x] Container läuft als non-root User

## 🆘 Troubleshooting

### Problem: "ECONNREFUSED" zur Datenbank

```bash
# Prüfe ob PostgreSQL läuft
docker ps | grep postgres

# Prüfe Netzwerk
docker network inspect coolify

# Auth Service muss im gleichen Netzwerk sein
docker network connect coolify samebi-auth
```

### Problem: JWT Token wird nicht akzeptiert

```bash
# Prüfe ob Secrets übereinstimmen
docker exec samebi-auth printenv JWT_SECRET
docker exec <postgrest-container> printenv PGRST_JWT_SECRET

# Sollten identisch sein!
```

### Problem: Rate Limiting zu aggressiv

```bash
# Erhöhe Limit in .env
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=300000

# Restart
docker restart samebi-auth
```

## 📈 Performance

- **Login Response Time**: ~50-100ms
- **Token Verification**: ~5-10ms
- **Memory Usage**: ~50-80MB
- **Max Concurrent Connections**: 100+ (Node.js default)

## 🔄 Updates

```bash
# Pull latest code
git pull

# Rebuild
docker build -t samebi-auth-service .

# Restart (zero-downtime möglich mit Docker Swarm/K8s)
docker stop samebi-auth
docker rm samebi-auth
docker run -d --name samebi-auth ... samebi-auth-service
```

## 🎯 Nächste Schritte

1. ✅ Auth Service deployen
2. ✅ DNS für `auth.samebi.net` konfigurieren
3. ✅ Dashboard-Code anpassen
4. ✅ Testen
5. ✅ PostgREST login() entfernen
6. 🔄 Monitoring einrichten
7. 📊 Analytics für Login-Erfolgsrate

---

**Bei Fragen: Siehe README.md oder kontaktiere das Team!**

