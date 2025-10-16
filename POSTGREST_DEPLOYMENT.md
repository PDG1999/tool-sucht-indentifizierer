# 🚀 PostgREST Deployment Anleitung

## ✅ Was wurde geändert?

Das Dashboard nutzt jetzt **NUR NOCH PostgREST** (`api.samebi.net`) - das alte Express-Backend (`api-check.samebi.net`) wird **NICHT MEHR** verwendet!

---

## 📋 Deployment-Schritte

### **Schritt 1: Datenbank-Setup (Login-Funktion erstellen)**

1. **Gehe zu Coolify** → Finde den **PostgreSQL Database Container**
   - Name: `nsgccoc4scg8g444c400c840` oder ähnlich
   
2. **Öffne das Terminal** des Database-Containers in Coolify
   - Klicke auf den Container → **"Terminal"** oder **"Shell"**

3. **Führe folgendes SQL-Script aus**:

```bash
psql -U postgres -d postgres << 'EOF'
-- Create JWT token type
DO $$ BEGIN
  CREATE TYPE jwt_token AS (token text);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Create login RPC function
CREATE OR REPLACE FUNCTION login(email TEXT, password TEXT)
RETURNS jwt_token AS $$
DECLARE
  _counselor RECORD;
  _token TEXT;
  _exp INTEGER;
BEGIN
  SELECT id, email, password_hash, role, is_active
  INTO _counselor FROM counselors WHERE counselors.email = login.email;
  
  IF NOT FOUND THEN RAISE EXCEPTION 'Invalid email or password'; END IF;
  IF NOT _counselor.is_active THEN RAISE EXCEPTION 'Account is not active'; END IF;
  IF NOT (_counselor.password_hash = crypt(password, _counselor.password_hash)) THEN
    RAISE EXCEPTION 'Invalid email or password';
  END IF;
  
  _exp := extract(epoch from now() + interval '7 days')::integer;
  SELECT sign(json_build_object('role', _counselor.role, 'user_id', _counselor.id, 'email', _counselor.email, 'exp', _exp), current_setting('app.jwt_secret')) INTO _token;
  RETURN (_token)::jwt_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION login(TEXT, TEXT) TO web_anon;
GRANT EXECUTE ON FUNCTION login(TEXT, TEXT) TO authenticated;

-- Create new supervisor account
INSERT INTO counselors (email, password_hash, name, role, is_active, created_at, updated_at)
VALUES ('supervisor@samebi.net', crypt('SupervisorSAMEBI2025!', gen_salt('bf')), 'Supervisor Account', 'supervisor', true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET password_hash = crypt('SupervisorSAMEBI2025!', gen_salt('bf')), role = 'supervisor', is_active = true, updated_at = NOW();

SELECT id, email, name, role, is_active FROM counselors WHERE email = 'supervisor@samebi.net';
EOF
```

4. **Erwartete Ausgabe:**
```
CREATE TYPE
CREATE FUNCTION
GRANT
GRANT
INSERT 0 1
   id    |         email          |        name        |    role    | is_active
---------+------------------------+--------------------+------------+-----------
 abc123  | supervisor@samebi.net  | Supervisor Account | supervisor | t
```

✅ **Login-Funktion ist jetzt erstellt!**

---

### **Schritt 2: PostgREST neu starten**

1. **Gehe zu Coolify** → Finde den **PostgREST Service**
   - Suche nach `api.samebi.net` oder `herramientas-backend`

2. **Klicke auf "Restart"**
   - PostgREST muss neu starten, um die neue RPC-Funktion zu erkennen
   
3. **Warte bis Status "Healthy"**

✅ **PostgREST ist jetzt bereit!**

---

### **Schritt 3: Dashboard neu deployen**

1. **Gehe zu Coolify** → Finde den **Dashboard Service**
   - `dashboard.samebi.net` oder `tool-sucht-dashboard`

2. **Klicke auf "Force Rebuild"**
   - Commit `6ab5393` sollte deployed werden

3. **Warte bis "Deployed successfully"**

✅ **Dashboard ist jetzt deployed!**

---

### **Schritt 4: Im Browser einloggen**

1. **Hard Refresh im Browser:**
   - Mac: `Cmd + Shift + R`
   - Oder: DevTools → Rechtsklick auf 🔄 → "Empty Cache and Hard Reload"

2. **Gehe zu:** `https://dashboard.samebi.net/login`

3. **Neue Login-Credentials:**
   ```
   📧 Email:    supervisor@samebi.net
   🔑 Passwort: SupervisorSAMEBI2025!
   ```

4. **Klicke auf "Login"**

✅ **Du solltest jetzt eingeloggt sein!**

---

## 🎯 Was jetzt anders ist

### **✅ VORHER (Express-Backend):**
- Login via: `https://api-check.samebi.net/api/auth/login`
- Daten via: `https://api-check.samebi.net/api/test-results`
- **Problem:** CORS-Fehler, Backend down, instabil

### **✅ JETZT (PostgREST):**
- Login via: `https://api.samebi.net/rpc/login`
- Daten via: `https://api.samebi.net/test_results`
- **Vorteil:** Stabil, schnell, direkt auf PostgreSQL

---

## 🔍 Troubleshooting

### **Problem: Login schlägt fehl**
```
Error: Invalid email or password
```

**Lösung:**
1. Prüfe, ob Schritt 1 erfolgreich war
2. Prüfe, ob PostgREST neu gestartet wurde (Schritt 2)
3. Prüfe die Credentials: `supervisor@samebi.net` / `SupervisorSAMEBI2025!`

---

### **Problem: CORS-Fehler beim Login**
```
Access to fetch at 'https://api.samebi.net/rpc/login' has been blocked by CORS
```

**Lösung:**
1. Prüfe PostgREST CORS-Config in Coolify:
   - Environment Variable: `PGRST_SERVER_CORS_ALLOWED_ORIGINS` sollte `*` oder `https://dashboard.samebi.net` sein

---

### **Problem: Dashboard zeigt keine Daten**
```
Error loading supervisor data: Failed to fetch
```

**Lösung:**
1. Hard Refresh im Browser (`Cmd + Shift + R`)
2. Prüfe, ob PostgREST läuft: `https://api.samebi.net/test_results` sollte antworten
3. Prüfe JWT Token im Browser (LocalStorage → `auth_token`)

---

## 📝 Zusammenfassung

| Schritt | Aktion | Status |
|---------|--------|--------|
| 1️⃣ | SQL-Script in DB ausführen | ⏳ |
| 2️⃣ | PostgREST neu starten | ⏳ |
| 3️⃣ | Dashboard neu deployen | ⏳ |
| 4️⃣ | Hard Refresh + Login | ⏳ |

**Nach Abschluss:** ✅ Vollständige PostgREST-Migration abgeschlossen!

---

## 🎉 Fertig!

Das Dashboard nutzt jetzt **ausschließlich PostgREST** - kein Express-Backend mehr!

**Neue Credentials:**
- 📧 `supervisor@samebi.net`
- 🔑 `SupervisorSAMEBI2025!`

