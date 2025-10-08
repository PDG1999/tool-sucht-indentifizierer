# 👤 Supervisor-Account Anleitung

**Datum:** 8. Oktober 2025  
**Status:** Bereit zum Deployment

---

## 🎯 Supervisor-Account erstellen

Der Supervisor-Account kann auf zwei Wegen erstellt werden:

---

### Option 1: SQL-Script auf dem Server ausführen (Empfohlen)

1. **Verbinde dich mit dem Hetzner Server:**
   ```bash
   ssh root@91.98.93.203
   ```

2. **Navigiere zum Projekt-Verzeichnis:**
   ```bash
   cd /path/to/project/backend
   ```

3. **Führe das SQL-Script aus:**
   ```bash
   psql -U postgres -d samebi_sucht -f src/migrations/CREATE_SUPERVISOR_ACCOUNT.sql
   ```
   
   **Oder direkt mit docker:**
   ```bash
   docker exec -i postgres_container psql -U postgres -d samebi_sucht < src/migrations/CREATE_SUPERVISOR_ACCOUNT.sql
   ```

4. **Prüfe die Ausgabe:**
   - ✅ "Supervisor-Account wurde erstellt" oder
   - ⚠️ "Supervisor-Account existiert bereits" (dann wurde er aktualisiert)

---

### Option 2: Manuelles SQL-Statement

Verbinde dich mit der Datenbank und führe folgendes aus:

```sql
INSERT INTO counselors (
  name, 
  email, 
  password_hash, 
  role, 
  is_active, 
  license_number, 
  specialization,
  created_at,
  updated_at
)
VALUES (
  'Supervisor Test',
  'supervisor@samebi.net',
  '$2b$10$j7FYMgs84.JlBlW9Dz8D0u.FLa7reyRSkN1z.4M.EvBl3yCBQ8rxm',
  'supervisor',
  true,
  'SUP-001',
  ARRAY['Supervision', 'Qualitätssicherung', 'Analytics'],
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
```

---

## 🔐 Login-Daten

Nach der Erstellung kannst du dich mit folgenden Daten anmelden:

```
E-Mail:    supervisor@samebi.net
Passwort:  SuperPass2024!
Rolle:     supervisor
```

---

## 🎨 Dashboard-Funktionen

Als Supervisor siehst du:

### ✅ Hauptdashboard
- **Globale Statistiken:** Alle Tests, Berater, Clients
- **Risiko-Verteilung:** Über alle Tests hinweg
- **Abbruch-Analytics:** Kritische Fragen identifizieren
- **Geografische Daten:** Verteilung nach Städten
- **Geräte-Analytics:** Desktop/Mobile/Tablet

### ✅ Erweiterte Berechtigungen
- **Alle Tests abrufen:** Supervisor sieht Tests aller Berater
- **Tests aktualisieren:** Notizen und Follow-ups hinzufügen
- **Tests zuweisen:** Tests anderen Beratern zuweisen
- **Alle Clients verwalten:** Lesen, aktualisieren, löschen

### ✅ Berater-Übersicht
- **Performance-Metriken:** Tests pro Berater
- **Workload-Analyse:** Verteilung der Clients
- **Qualitätssicherung:** Durchschnittliches Risiko-Level

---

## 🧪 Test-Szenarien

Nach dem Login teste folgende Funktionen:

### 1. Dashboard anzeigen
- [ ] Supervisor-Dashboard wird angezeigt (nicht normales Berater-Dashboard)
- [ ] Alle globalen Statistiken sind sichtbar
- [ ] "Supervisor"-Badge wird im User-Bereich angezeigt

### 2. Tests verwalten
- [ ] Alle Tests aller Berater sind sichtbar
- [ ] Einzelner Test kann geöffnet werden
- [ ] Test-Notizen können bearbeitet werden
- [ ] Tests können anderen Beratern zugewiesen werden

### 3. Clients verwalten
- [ ] Alle Clients aller Berater sind sichtbar
- [ ] Client-Details können angezeigt werden
- [ ] Client-Informationen können bearbeitet werden

### 4. Analytics
- [ ] Abbruch-Analytics zeigen kritische Fragen
- [ ] Geografische Verteilung wird korrekt dargestellt
- [ ] Berater-Performance-Tabelle funktioniert

---

## 🔧 Fehlerbehebung

### Problem: "Login fehlgeschlagen"
**Lösung:** 
- Prüfe, ob das SQL-Script erfolgreich ausgeführt wurde
- Kontrolliere die Rolle in der Datenbank: `SELECT role FROM counselors WHERE email = 'supervisor@samebi.net';`
- Sollte `supervisor` sein, nicht `counselor`

### Problem: "Normales Dashboard wird angezeigt"
**Lösung:**
- Prüfe die `userRole` prop in `DashboardLayout`
- JWT-Token sollte die Rolle enthalten
- Frontend muss die Rolle aus dem Token lesen

### Problem: "Access denied" beim Abrufen von Tests
**Lösung:**
- Backend-Fixes wurden korrekt applied (siehe git commit d970538)
- Backend neu starten, falls nötig
- Logs prüfen: `req.user.role` sollte `supervisor` sein

---

## 📝 Passwort ändern

Falls du das Passwort ändern möchtest:

1. **Neues Passwort hashen:**
   ```bash
   cd backend
   node scripts/hash-password.js DeinNeuesPasswort
   ```

2. **Hash in Datenbank aktualisieren:**
   ```sql
   UPDATE counselors 
   SET password_hash = 'NEUER_HASH_HIER'
   WHERE email = 'supervisor@samebi.net';
   ```

---

## 🚀 Nächste Schritte

Nach erfolgreichem Login:

1. ✅ Alle Dashboard-Funktionen testen
2. ✅ Einen Test-Client anlegen und verwalten
3. ✅ Berater-Performance überprüfen
4. ✅ Analytics-Daten analysieren
5. ⏳ Ggf. weitere Supervisor-Accounts anlegen
6. ⏳ Passwort in Production ändern (aktuell nur Test-Passwort!)

---

## 📞 Support

Bei Problemen:
- **Dokumentation:** `SUPERVISOR_DASHBOARD_FIXES.md`
- **Backend-Logs:** `docker logs backend_container`
- **Frontend:** Browser-Console für Fehler prüfen

---

## ⚠️ Sicherheitshinweis

**WICHTIG:** Das Standard-Passwort `SuperPass2024!` ist nur für Tests gedacht.  
**Ändere das Passwort nach dem ersten Login!**

Du kannst das Passwort im Settings-Bereich des Dashboards ändern oder per SQL wie oben beschrieben.

---

**Viel Erfolg mit dem Supervisor-Dashboard! 🎉**

