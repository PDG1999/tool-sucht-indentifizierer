# 🔄 MIGRATION: Express Backend → PostgREST Backend

**Status:** 🟡 Ready to Execute  
**Datum:** 15. Oktober 2025  
**Geschätzte Dauer:** 2-3 Stunden  
**Downtime:** < 10 Minuten (während DNS-Switch)

---

## 🎯 ZIEL DER MIGRATION

**Von:** Altes Express Backend (`api-check.samebi.net`)  
**Zu:** Neues PostgREST Backend (`api.samebi.net`)

### Vorteile der Konsolidierung:
- ✅ **Eine zentrale Datenbank** für alle Tools
- ✅ **Weniger Code zu warten** (PostgREST generiert API automatisch)
- ✅ **Bessere Performance** (direkter PostgreSQL-Zugriff)
- ✅ **Konsistente Architektur** (alle Tools nutzen PostgREST)
- ✅ **Einfacheres Monitoring** (ein Backend statt zwei)

---

## 📋 MIGRATIONS-PHASEN

### Phase 1: Vorbereitung (30 Min)
- ✅ Schema-Migration erstellt (`migration_add_counseling.sql`)
- ✅ Daten-Migrations-Script erstellt (`migrate_data_from_express.sql`)
- [ ] Backup der alten Datenbank
- [ ] PostgREST Backend testen

### Phase 2: Schema Migration (15 Min)
- [ ] `migration_add_counseling.sql` auf PostgREST-DB ausführen
- [ ] Neue Tabellen verifizieren
- [ ] RLS Policies prüfen

### Phase 3: Daten Migration (30-60 Min)
- [ ] Passwort der alten DB eintragen in `migrate_data_from_express.sql`
- [ ] Migration ausführen
- [ ] Daten-Konsistenz prüfen

### Phase 4: Dashboard-Anpassung (45 Min)
- [ ] Dashboard API-URL ändern: `api-check.samebi.net` → `api.samebi.net`
- [ ] PostgREST-spezifische Auth implementieren
- [ ] Dashboard testen

### Phase 5: Deployment & DNS (30 Min)
- [ ] Dashboard neu deployen
- [ ] Altes Express-Backend als "Read-Only" laufen lassen (Fallback)
- [ ] Tests durchführen
- [ ] Bei Erfolg: Altes Backend deaktivieren

---

## 🛠️ DETAILLIERTE ANLEITUNG

### SCHRITT 1: Backup erstellen

```bash
# SSH auf Server
ssh root@91.98.93.203

# Backup der alten Express-Datenbank
docker exec nsgccoc4scg8g444c400c840 pg_dump -U postgres postgres > /root/backup_express_db_$(date +%Y%m%d_%H%M%S).sql

# Backup auf lokalen Rechner kopieren
exit
scp root@91.98.93.203:/root/backup_express_db_*.sql ~/Desktop/
```

---

### SCHRITT 2: PostgREST Backend vorbereiten

```bash
# SSH auf Server
ssh root@91.98.93.203

# Finde PostgREST Backend Container
docker ps | grep api.samebi.net
# ODER suche nach "herramientas" oder "postgrest"

# Prüfe ob PostgREST läuft
curl https://api.samebi.net/
# Sollte: PostgREST Info zeigen
```

---

### SCHRITT 3: Schema Migration ausführen

```bash
# Kopiere Migration auf Server
scp herramientas-backend/database/migration_add_counseling.sql root@91.98.93.203:/root/

# SSH auf Server
ssh root@91.98.93.203

# Finde PostgreSQL Container des PostgREST Backends
docker ps | grep postgres
# Notiere Container-ID

# Migration ausführen
docker exec -i [POSTGRES_CONTAINER_ID] psql -U postgres -d herramientas < /root/migration_add_counseling.sql

# ODER falls DB-Name anders ist:
docker exec -i [POSTGRES_CONTAINER_ID] psql -U postgres -d [DB_NAME] < /root/migration_add_counseling.sql

# Prüfe ob Tabellen erstellt wurden
docker exec [POSTGRES_CONTAINER_ID] psql -U postgres -d herramientas -c "\dt api.*"
```

**Erwartete Output:**
```
✅ Migration abgeschlossen!
📊 Neue Tabellen: counselors, clients, test_results, test_progress, anonymous_sessions
```

---

### SCHRITT 4: Daten Migration ausführen

**WICHTIG:** Vorher Passwort anpassen!

```bash
# Editiere migrate_data_from_express.sql
nano /root/migrate_data_from_express.sql

# Suche nach: password 'YOUR_OLD_DB_PASSWORD'
# Ersetze mit echtem Passwort der alten DB

# Migration ausführen
docker exec -i [POSTGRES_CONTAINER_ID] psql -U postgres -d herramientas < /root/migrate_data_from_express.sql
```

**Verifizierung:**
```bash
# Prüfe Anzahl migrierter Datensätze
docker exec [POSTGRES_CONTAINER_ID] psql -U postgres -d herramientas -c "
SELECT 
    'counselors' as table_name, COUNT(*) as count FROM api.counselors
UNION ALL
SELECT 'clients', COUNT(*) FROM api.clients
UNION ALL
SELECT 'test_results', COUNT(*) FROM api.test_results;
"
```

**Erwartete Zahlen:**
- Counselors: ~3-5
- Clients: ~10-20
- Test Results: ~11

---

### SCHRITT 5: Dashboard auf PostgREST umstellen

#### 5.1 API-URL ändern

**Datei:** `tool-sucht-indentifizieren-anonym/src/services/api.ts`

```typescript
// VORHER:
const API_BASE_URL = 'https://api-check.samebi.net/api';

// NACHHER:
const API_BASE_URL = 'https://api.samebi.net';
```

#### 5.2 PostgREST-Auth implementieren

**Datei:** Erstelle `tool-sucht-indentifizieren-anonym/src/services/postgrest-auth.ts`

```typescript
import { jwtDecode } from 'jwt-decode';

interface PostgRESTAuthResponse {
  token: string;
  expiresAt: string;
}

export const postgrestAuth = {
  async login(email: string, password: string): Promise<PostgRESTAuthResponse> {
    // PostgREST nutzt direkte DB-Function für Auth
    const response = await fetch('https://api.samebi.net/rpc/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login fehlgeschlagen');
    }

    const data = await response.json();
    
    // Token speichern
    localStorage.setItem('postgrest_token', data.token);
    
    return data;
  },

  getToken(): string | null {
    return localStorage.getItem('postgrest_token');
  },

  logout() {
    localStorage.removeItem('postgrest_token');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
};
```

#### 5.3 API-Calls anpassen

**Datei:** `tool-sucht-indentifizieren-anonym/src/services/api.ts`

```typescript
// PostgREST verwendet andere URL-Struktur

// VORHER (Express):
GET /api/test-results
POST /api/test-results/submit

// NACHHER (PostgREST):
GET /test_results
POST /test_results
```

**Anpassung:**
```typescript
export const testResultsAPI = {
  // Get all test results
  getAll: async () => {
    return apiCall('/test_results?order=created_at.desc', {
      headers: {
        'Authorization': `Bearer ${postgrestAuth.getToken()}`
      }
    });
  },

  // Submit new test
  submit: async (data: TestSubmitData) => {
    return apiCall('/test_results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        client_id: data.clientId,
        counselor_id: data.counselorId,
        responses: data.responses,
        public_scores: data.publicScores,
        professional_scores: data.professionalScores,
        risk_level: data.riskLevel,
        primary_concern: data.primaryConcern,
        tracking_data: data.trackingData
      })
    });
  }
};
```

---

### SCHRITT 6: PostgREST Login-Function erstellen

**WICHTIG:** PostgREST braucht eine DB-Function für Login!

**Datei:** `herramientas-backend/database/auth_functions.sql`

```sql
-- Login Function für PostgREST
CREATE OR REPLACE FUNCTION api.login(email TEXT, password TEXT)
RETURNS TABLE (
    token TEXT,
    counselor_id UUID,
    name TEXT,
    role TEXT,
    expires_at TIMESTAMPTZ
) AS $$
DECLARE
    counselor_record api.counselors;
    jwt_secret TEXT := current_setting('app.settings.jwt_secret');
    token_payload JSON;
BEGIN
    -- Finde Counselor
    SELECT * INTO counselor_record
    FROM api.counselors
    WHERE counselors.email = login.email
    AND is_active = true;

    -- Prüfe ob gefunden
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid credentials';
    END IF;

    -- Prüfe Passwort (mit pgcrypto)
    IF NOT (counselor_record.password_hash = crypt(password, counselor_record.password_hash)) THEN
        RAISE EXCEPTION 'Invalid credentials';
    END IF;

    -- Update last_login_at
    UPDATE api.counselors
    SET last_login_at = NOW()
    WHERE id = counselor_record.id;

    -- Erstelle JWT Token Payload
    token_payload := json_build_object(
        'counselor_id', counselor_record.id,
        'email', counselor_record.email,
        'role', counselor_record.role,
        'exp', EXTRACT(EPOCH FROM (NOW() + INTERVAL '7 days'))::INTEGER
    );

    -- Generiere JWT (vereinfacht - in Produktion sign mit jwt_secret)
    -- Für PostgREST nutzen wir pgjwt Extension:
    RETURN QUERY SELECT 
        sign(token_payload, jwt_secret) AS token,
        counselor_record.id AS counselor_id,
        counselor_record.name,
        counselor_record.role,
        (NOW() + INTERVAL '7 days') AS expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION api.login(TEXT, TEXT) TO web_anon;
```

**Auf Server ausführen:**
```bash
scp herramientas-backend/database/auth_functions.sql root@91.98.93.203:/root/
ssh root@91.98.93.203
docker exec -i [POSTGRES_CONTAINER_ID] psql -U postgres -d herramientas < /root/auth_functions.sql
```

---

### SCHRITT 7: Dashboard testen

```bash
# Lokal Dashboard starten
cd tool-sucht-indentifizieren-anonym
npm run dev

# Öffne: http://localhost:3002
# Teste:
- [ ] Login funktioniert
- [ ] Test-Liste wird geladen
- [ ] Test-Details werden angezeigt
- [ ] Kategorien sind sichtbar
```

---

### SCHRITT 8: Dashboard deployen

```bash
# Git Commit
cd tool-sucht-indentifizieren-anonym
git add .
git commit -m "Migrate: Dashboard von Express zu PostgREST

- Changed API_BASE_URL to api.samebi.net
- Implemented PostgREST auth
- Adapted API calls for PostgREST URL structure
- Updated coolify.json with new API URL"

git push origin main

# Coolify wird automatisch deployen
# ODER manuell in Coolify: "Force Rebuild"
```

---

### SCHRITT 9: Alte Backend als Fallback behalten

```bash
# SSH auf Server
ssh root@91.98.93.203

# Alter Express-Backend Container
docker ps | grep e0w0o40kk8g0osw0ggc0kwok

# NICHT LÖSCHEN! Einfach laufen lassen als Backup
# Falls etwas schief geht, können wir schnell zurückschalten
```

---

### SCHRITT 10: DNS/Routing anpassen (Optional)

**Falls du `api-check.samebi.net` auf `api.samebi.net` umleiten willst:**

```bash
# In Traefik/Coolify:
# Redirect Rule erstellen:
api-check.samebi.net → api.samebi.net (301 Permanent Redirect)
```

---

## 🔍 VERIFIKATION

### Tests durchführen:

1. **Login-Test:**
   ```
   POST https://api.samebi.net/rpc/login
   Body: {"email": "supervisor@samebi.net", "password": "SuperPass2024!"}
   Erwartung: Token zurück
   ```

2. **Test-Liste:**
   ```
   GET https://api.samebi.net/test_results?order=created_at.desc
   Header: Authorization: Bearer [TOKEN]
   Erwartung: Liste aller Tests
   ```

3. **Dashboard:**
   ```
   https://dashboard.samebi.net/supervisor
   Login mit supervisor@samebi.net
   Erwartung: Alle Tests sichtbar, Kategorien angezeigt
   ```

---

## ⚠️ ROLLBACK-PLAN

**Falls etwas schief geht:**

### Schritt 1: Dashboard auf alte API zurücksetzen
```typescript
// In api.ts:
const API_BASE_URL = 'https://api-check.samebi.net/api'; // Zurück zu Express
```

### Schritt 2: Schnell deployen
```bash
git add src/services/api.ts
git commit -m "Rollback: Zurück zu Express Backend"
git push origin main
```

### Schritt 3: Altes Backend ist noch da!
Das alte Express-Backend läuft noch → Dashboard funktioniert sofort wieder.

---

## 📊 ERFOLGS-KRITERIEN

✅ Migration ist erfolgreich, wenn:

- [ ] Alle Berater/Supervisoren in neuer DB
- [ ] Alle Klienten in neuer DB
- [ ] Alle 11 Tests in neuer DB
- [ ] Dashboard lädt Test-Liste
- [ ] Dashboard zeigt Kategorie-Scores
- [ ] Login funktioniert
- [ ] Refresh-Button funktioniert
- [ ] Keine CORS-Fehler
- [ ] Geo-Tracking Daten sichtbar

---

## 🎯 NACH DER MIGRATION

### Woche 1: Monitoring
- Dashboard täglich testen
- User-Feedback sammeln
- Performance vergleichen

### Woche 2: Cleanup
- Altes Express-Backend deaktivieren
- `api-check.samebi.net` Domain deaktivieren
- Container löschen

### Woche 3: Optimierung
- PostgREST Performance tunen
- Caching implementieren
- Monitoring verbessern

---

## 📝 CHECKLISTE

### Vor der Migration:
- [ ] Backup erstellt
- [ ] PostgREST Backend läuft
- [ ] Passwort für alte DB bereit

### Während der Migration:
- [ ] Schema Migration ausgeführt
- [ ] Daten Migration ausgeführt
- [ ] Daten verifiziert
- [ ] Auth Functions erstellt

### Nach der Migration:
- [ ] Dashboard angepasst
- [ ] Dashboard deployed
- [ ] Tests durchgeführt
- [ ] User informiert

---

## 💡 LESSONS LEARNED (für nächstes Mal)

1. **Architektur-Entscheidungen früh treffen**
   - Ein Backend von Anfang an
   - PostgREST vs. Express VORHER entscheiden

2. **Dokumentation ist kritisch**
   - Service-Übersicht pflegen
   - Deployment-Map aktuell halten

3. **Migration ist einfacher als gedacht**
   - Foreign Data Wrapper macht Daten-Migration trivial
   - PostgREST Auth mit DB-Functions ist elegant

4. **Backup-Strategie wichtig**
   - Altes Backend als Fallback behalten
   - Schneller Rollback-Plan

---

**Status:** 🟢 Bereit zur Ausführung  
**Geschätzte Zeit:** 2-3 Stunden  
**Risiko:** 🟡 Mittel (Rollback möglich)  
**Priorität:** 🔴 Hoch (Architektur-Vereinfachung)

