# JWT Secret Fix für Login-Problem

## 🐛 Problem

Der Login schlägt fehl mit: `JWSError JWSInvalidSignature`

**Ursache:** Das JWT Secret zwischen PostgreSQL und PostgREST ist nicht synchronisiert.

## 🔧 Schnelle Lösung (auf dem Server ausführen)

### Option 1: Quick Fix Script

```bash
# Auf dem Hetzner Server
cd /path/to/herramientas-backend
chmod +x fix-jwt-secret.sh
./fix-jwt-secret.sh
```

### Option 2: Manuelle Schritte

```bash
# 1. Ins Backend-Container einsteigen
docker exec -it herramientas_backend bash

# 2. JWT Secret in PostgreSQL setzen
su-exec postgres psql -d herramientas << EOF
ALTER DATABASE herramientas SET app.jwt_secret = 'your-jwt-secret-key-here-min-32-chars';
SELECT pg_reload_conf();
SELECT current_setting('app.jwt_secret', true) as jwt_secret;
EOF

# 3. PostgREST neu starten
supervisorctl restart postgrest

# 4. Container verlassen
exit
```

## 🧪 Test nach dem Fix

### Mit curl:

```bash
curl -X POST https://api.samebi.net/rpc/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "supervisor@samebi.net",
    "password": "SupervisorSAMEBI2025!"
  }'
```

**Erwartete Antwort:**
```json
{
  "token": "eyJhbGc..."
}
```

### Im Dashboard:

1. Öffne: https://dashboard.samebi.net
2. Login mit:
   - Email: `supervisor@samebi.net`
   - Password: `SupervisorSAMEBI2025!`

## 📝 Was wurde gefixt?

### Dateien geändert:

1. **database/schema.sql** - JWT Secret beim DB-Setup setzen
2. **database/setup_postgrest_login.sql** - JWT Secret beim Login-Setup setzen
3. **database/setup_jwt_secret.sql** - Neues Script für JWT Secret (neu erstellt)
4. **fix-jwt-secret.sh** - Quick Fix Script (neu erstellt)

### Was passiert beim Fix:

1. Das JWT Secret wird in PostgreSQL als `app.jwt_secret` gesetzt
2. Dieses Secret wird von der `login()` Funktion verwendet, um JWT-Tokens zu signieren
3. PostgREST verwendet `PGRST_JWT_SECRET` um die Tokens zu validieren
4. **Beide Secrets MÜSSEN identisch sein!**

## 🔐 Wichtige Details

### Aktuelles JWT Secret:

```
your-jwt-secret-key-here-min-32-chars
```

**⚠️ WICHTIG:** Dieses Secret sollte in Produktion geändert werden!

### Environment Variables prüfen:

```bash
# Im Backend-Container
docker exec herramientas_backend env | grep JWT
```

Sollte zeigen:
```
JWT_SECRET=your-jwt-secret-key-here-min-32-chars
PGRST_JWT_SECRET=your-jwt-secret-key-here-min-32-chars
```

### PostgreSQL Setting prüfen:

```bash
docker exec herramientas_backend su-exec postgres psql -d herramientas -c "SELECT current_setting('app.jwt_secret', true);"
```

Sollte das gleiche Secret zeigen!

## 🚀 Für zukünftige Deployments

Beim nächsten Deployment wird das JWT Secret automatisch korrekt konfiguriert durch:

1. `database/schema.sql` - setzt beim ersten DB-Setup das Secret
2. `database/setup_postgrest_login.sql` - bestätigt das Secret beim Login-Setup

## 🆘 Wenn es immer noch nicht funktioniert

### 1. Logs prüfen:

```bash
# PostgREST Logs
docker exec herramientas_backend supervisorctl tail -f postgrest

# PostgreSQL Logs
docker exec herramientas_backend tail -f /var/log/postgresql/postgresql.log
```

### 2. JWT Secret verifizieren:

```bash
# PostgreSQL
docker exec herramientas_backend su-exec postgres psql -d herramientas -c "SELECT current_setting('app.jwt_secret', true);"

# PostgREST (aus Environment)
docker exec herramientas_backend printenv PGRST_JWT_SECRET
```

**Diese MÜSSEN identisch sein!**

### 3. Login-Funktion testen:

```bash
docker exec herramientas_backend su-exec postgres psql -d herramientas -c "SELECT login('supervisor@samebi.net', 'SupervisorSAMEBI2025!');"
```

Sollte einen JWT Token zurückgeben (nicht einen Fehler!).

### 4. Container komplett neu starten:

```bash
docker restart herramientas_backend
# Warte 30 Sekunden
docker ps  # Sollte Container als "healthy" zeigen
```

## 📚 Weitere Informationen

- [PostgREST JWT Authentication](https://postgrest.org/en/stable/auth.html)
- [PostgreSQL Configuration Settings](https://www.postgresql.org/docs/current/runtime-config.html)
- INFRASTRUCTURE.md - Vollständige Server-Dokumentation

## ✅ Erfolg-Checkliste

Nach dem Fix sollten diese alle ✅ sein:

- [ ] JWT Secret in PostgreSQL gesetzt: `ALTER DATABASE herramientas SET app.jwt_secret`
- [ ] PostgreSQL neuladen: `SELECT pg_reload_conf()`
- [ ] PostgREST neu gestartet: `supervisorctl restart postgrest`
- [ ] curl Login-Test erfolgreich (Token zurückgegeben)
- [ ] Dashboard Login funktioniert
- [ ] Keine 401 Errors mehr in Browser Console

---

**🎯 Nach dem Fix sollte der Login sofort funktionieren!**

