# ⚡ Coolify Schnellstart - Supervisor-Dashboard aktivieren

**Alles in 3 Schritten! 🚀**

---

## Schritt 1: Warte auf automatisches Deployment ⏱️

**Was passiert gerade automatisch:**
```
✅ Code wurde gepusht (bereits erledigt)
🔄 Coolify baut Backend neu (~2-5 Min)
🔄 Coolify baut Frontend neu (~2-5 Min)
```

**Prüfe in Coolify:**
- Gehe zu deinem Coolify Dashboard
- Services sollten "Building" oder "Running" (grün) zeigen
- Warte bis beide Services grün sind

---

## Schritt 2: SQL-Befehl im Coolify DB-Terminal ausführen 🗄️

### So findest du das DB-Terminal in Coolify:
1. Gehe zu deiner PostgreSQL-Datenbank
2. Klicke auf "Terminal" oder "Execute" oder "SQL"
3. Kopiere folgenden Befehl:

```sql
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM counselors WHERE email = 'supervisor@samebi.net') THEN
    UPDATE counselors 
    SET 
      name = 'Supervisor Test',
      password_hash = '$2b$10$j7FYMgs84.JlBlW9Dz8D0u.FLa7reyRSkN1z.4M.EvBl3yCBQ8rxm',
      role = 'supervisor',
      is_active = true,
      license_number = 'SUP-001',
      specialization = ARRAY['Supervision', 'Qualitätssicherung', 'Analytics'],
      updated_at = NOW()
    WHERE email = 'supervisor@samebi.net';
    RAISE NOTICE '✅ Supervisor-Account wurde aktualisiert';
  ELSE
    INSERT INTO counselors (name, email, password_hash, role, is_active, license_number, specialization, created_at, updated_at)
    VALUES ('Supervisor Test', 'supervisor@samebi.net', '$2b$10$j7FYMgs84.JlBlW9Dz8D0u.FLa7reyRSkN1z.4M.EvBl3yCBQ8rxm', 'supervisor', true, 'SUP-001', ARRAY['Supervision', 'Qualitätssicherung', 'Analytics'], NOW(), NOW());
    RAISE NOTICE '✅ Supervisor-Account wurde erstellt';
  END IF;
END $$;
```

4. Paste & Enter
5. ✅ Account ist erstellt!

---

## Schritt 3: Login testen 🔐

### Gehe zu deiner App:
**URL:** https://screening.samebi.net (oder deine Domain)

### Login-Daten:
```
E-Mail:    supervisor@samebi.net
Passwort:  SuperPass2024!
```

### Was du sehen solltest:
✅ Supervisor-Dashboard (nicht normales Berater-Dashboard)  
✅ "Supervisor"-Badge im User-Bereich (lila Icon)  
✅ Globale Statistiken über alle Tests/Berater  
✅ Alle Tests aller Berater sind sichtbar  

---

## ✅ Fertig! Das war's!

**Du hast jetzt:**
- ✅ Supervisor-Berechtigungen im Backend
- ✅ Supervisor-Dashboard im Frontend
- ✅ Funktionierenden Supervisor-Account

---

## 🐛 Falls etwas nicht klappt:

### Problem: "Services sind nicht grün"
```
1. Gehe zu Coolify → Services
2. Klicke auf den Service → "Logs"
3. Prüfe auf Fehler
4. Falls nötig: "Redeploy" klicken
```

### Problem: "Login klappt nicht"
```
1. Prüfe im DB-Terminal:
   SELECT email, role FROM counselors WHERE email = 'supervisor@samebi.net';

2. Sollte zeigen: role = 'supervisor'
3. Falls nicht: SQL-Befehl nochmal ausführen
```

### Problem: "Normales Dashboard statt Supervisor-Dashboard"
```
1. Hard-Refresh im Browser: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
2. Browser-Cache leeren
3. Prüfe in DB: Rolle sollte 'supervisor' sein
```

### Problem: "Access denied beim Zugriff auf Tests"
```
1. Backend-Logs prüfen in Coolify
2. Backend neu starten: Coolify → Backend Service → Restart
3. Prüfe JWT-Token enthält role: 'supervisor'
```

---

## 🎯 Bonus: Prüfe ob alles korrekt deployed ist

### Backend-Check:
```bash
curl https://api.samebi.net/health
# Erwartete Antwort: {"status":"ok"}
```

### Frontend-Check:
```bash
curl -I https://screening.samebi.net
# Erwartete Antwort: HTTP 200 OK
```

### Account-Check (im DB-Terminal):
```sql
SELECT id, name, email, role, license_number, is_active 
FROM counselors 
WHERE email = 'supervisor@samebi.net';
```

Sollte zeigen:
```
name: Supervisor Test
role: supervisor
is_active: true
```

---

## 📞 Hilfe benötigt?

**Detaillierte Anleitungen:**
- `COOLIFY_DEPLOYMENT.md` - Vollständige Deployment-Docs
- `SUPERVISOR_ACCOUNT_ANLEITUNG.md` - Account-Erstellung im Detail
- `SUPERVISOR_DASHBOARD_FIXES.md` - Was wurde gefixt

**Bei Problemen:**
1. Prüfe Coolify-Logs
2. Prüfe Browser-Console (F12)
3. Prüfe DB-Eintrag

---

**Das war's! Jetzt einfach die 3 Schritte befolgen! 🎉**

