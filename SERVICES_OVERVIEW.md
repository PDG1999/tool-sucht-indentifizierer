# 🌐 SAMEBI Services & Architektur-Übersicht

**Letztes Update:** 15. Oktober 2025  
**Status:** ⚠️ KRITISCH - Multi-Backend-Problem entdeckt

---

## 🏗️ AKTUELLE ARCHITEKTUR (IST-ZUSTAND)

### Backend-Systeme

#### 🔵 Backend 1: herramientas-backend (PostgREST)
```
Pfad:     /herramientas-backend/
Tech:     PostgREST + PostgreSQL
Domain:   https://api.samebi.net
Status:   ✅ AKTIV
Datenbank: Eigene PostgreSQL Instanz
```

**Verwendende Frontend-Apps:**
- `test-estres.samebi.net` (Spanisch)
- `stress-test.samebi.net` (Deutsch)
- `stress-check.samebi.net` (Englisch) 
- `burnout-test.samebi.net`

**API-Endpunkte:**
```
GET  https://api.samebi.net/test-results
POST https://api.samebi.net/test-results
GET  https://api.samebi.net/clients
...
```

---

#### 🟢 Backend 2: tool-sucht-indentifizieren-anonym/backend (Node.js Express)
```
Pfad:     /tool-sucht-indentifizieren-anonym/backend/
Tech:     Node.js + Express + PostgreSQL
Domain:   https://api-check.samebi.net
Status:   ✅ AKTIV
Datenbank: Eigene PostgreSQL Instanz (ANDERE als Backend 1!)
```

**Verwendende Frontend-Apps:**
- `dashboard.samebi.net`

**API-Endpunkte:**
```
POST https://api-check.samebi.net/api/auth/login
GET  https://api-check.samebi.net/api/test-results
POST https://api-check.samebi.net/api/test-results/submit
GET  https://api-check.samebi.net/api/clients
GET  https://api-check.samebi.net/api/counselors
```

---

### Frontend-Anwendungen

#### Tool 1: Stress-Test (Multi-Language)
```
Spanisch:  test-estres.samebi.net   → api.samebi.net
Deutsch:   stress-test.samebi.net   → api.samebi.net
Englisch:  stress-check.samebi.net  → api.samebi.net (noch nicht deployed)
```

**Repository:** `tool-stress-checker/`  
**Tech:** Vite + React + TypeScript  
**Deployment:** Coolify (3 separate Instanzen)

---

#### Tool 2: Burnout-Test
```
Domain:   burnout-test.samebi.net → api.samebi.net
```

**Repository:** `tool-burnout-test/`  
**Tech:** Vite + React + TypeScript  
**Deployment:** Coolify

---

#### Tool 3: Dashboard (Berater & Supervisor)
```
Domain:   dashboard.samebi.net → api-check.samebi.net
```

**Repository:** `tool-sucht-indentifizieren-anonym/`  
**Tech:** Vite + React + TypeScript  
**Deployment:** Coolify  
**Aktueller Commit:** `4b67dbc` (⚠️ VERALTET! Sollte `1e09f5f` sein)

---

### Datenbank-Systeme

#### DB 1: herramientas-backend PostgreSQL
```
Host:     91.98.93.203
Port:     (via Docker)
Schema:   PostgREST Schema
Zugriff:  api.samebi.net
```

**Enthält Daten von:**
- Stress-Tests (ES, DE, EN)
- Burnout-Tests

---

#### DB 2: tool-sucht-backend PostgreSQL
```
Host:     91.98.93.203  
Port:     (via Docker)
Container: nsgccoc4scg8g444c400c840
Database: postgres
Zugriff:  api-check.samebi.net
```

**Enthält Daten von:**
- Dashboard (Berater-Tests)
- Supervisor-View

**Wichtige Tabellen:**
```sql
- counselors (Berater & Supervisoren)
- clients (Klienten)
- test_results (Test-Ergebnisse)
- test_progress (Intermediate saves)
- sessions, audit_logs, tracking
```

---

## ⚠️ KRITISCHE PROBLEME

### Problem 1: Daten-Silos

```
User macht Test:
  stress-test.samebi.net
    ↓
  api.samebi.net
    ↓
  DB 1 (herramientas-backend)

Supervisor öffnet Dashboard:
  dashboard.samebi.net
    ↓
  api-check.samebi.net
    ↓
  DB 2 (tool-sucht-backend)
    ↓
  ❌ Test NICHT sichtbar!
```

**Konsequenz:** Tests sind "verloren" für Supervisoren

---

### Problem 2: Deployment-Chaos

**Dashboard zeigt alten Code:**
```
Git Repo:     Commit 1e09f5f (15. Okt)
Dashboard:    Commit 4b67dbc (6. Okt)
Differenz:    9 Tage / 5 Commits
```

**Fehlende Features:**
- Refresh-Button
- Kategorie-Scores korrekt
- Server-Side Geo-Tracking

---

### Problem 3: Domain-Verwirrung

**Nicht existierende Domains:**
```
❌ check.samebi.net        (wird erwähnt, existiert nicht)
```

**Existierende Domains:**
```
✅ test-estres.samebi.net   (Spanisch, AKTIV)
✅ stress-test.samebi.net   (Deutsch, AKTIV) 
✅ burnout-test.samebi.net  (Deutsch, AKTIV)
✅ dashboard.samebi.net     (Dashboard, AKTIV aber VERALTET)
```

---

## 🎯 LÖSUNGSSTRATEGIEN

### Option A: Backend-Konsolidierung (EMPFOHLEN)

**Schritt 1: Entscheidung treffen**
```
Welches Backend bleibt?

Option A1: PostgREST (herramientas-backend)
  ✅ Bereits für mehrere Tools im Einsatz
  ✅ Performant & bewährt
  ✅ Weniger Code zu warten
  ❌ Weniger flexibel für Custom Logic
  
Option A2: Express (tool-sucht-backend)
  ✅ Volle Kontrolle über API
  ✅ Custom Middleware (Auth, Tracking)
  ✅ Einfacher zu erweitern
  ❌ Mehr Code zu warten
  ❌ Nur für Dashboard im Einsatz
```

**Schritt 2: Migration planen**
```
Wenn PostgREST gewählt:
  1. Express API → PostgREST migrieren
  2. Datenbank-Schema angleichen
  3. dashboard.samebi.net → api.samebi.net umstellen
  
Wenn Express gewählt:
  1. Stress-Tests → api-check.samebi.net umstellen
  2. Burnout-Test → api-check.samebi.net umstellen
  3. PostgREST deprecaten
```

**Schritt 3: Durchführen**
```
Timeline: 2-3 Tage
Downtime: <1 Stunde (während DB-Migration)
```

---

### Option B: Transparenter Proxy (Quick Fix)

**Dashboard zeigt Daten von BEIDEN Backends:**

```typescript
// SupervisorDashboard.tsx
const loadAllTests = async () => {
  const [tests1, tests2] = await Promise.all([
    fetch('https://api.samebi.net/test-results'),
    fetch('https://api-check.samebi.net/api/test-results')
  ]);
  
  return [...tests1, ...tests2].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );
};
```

**Vorteile:**
- ✅ Schnell implementierbar (2-3 Stunden)
- ✅ Keine Downtime
- ✅ Sofort alle Tests sichtbar

**Nachteile:**
- ⚠️ Langfristig nicht nachhaltig
- ⚠️ Zwei Datenbanken zu warten
- ⚠️ Potenzielle Inkonsistenzen

---

### Option C: Domain-Routing

**Alle Test-Tools auf dashboard.samebi.net hosten:**

```
Aktuell:
  stress-test.samebi.net  (separates Deployment)
  dashboard.samebi.net    (separates Deployment)

Neu:
  dashboard.samebi.net/test/stress  (unter Dashboard)
  dashboard.samebi.net/dashboard    (Dashboard)
```

**Vorteil:** Nur EIN Backend nötig  
**Nachteil:** Große Refactoring-Arbeit

---

## 📋 EMPFEHLUNG: Hybrid-Ansatz

### Phase 1: Sofort (heute)
```
1. Dashboard-Deployment fixen
2. Option B implementieren (Transparenter Proxy)
3. User-Tests durchführen
```

### Phase 2: Diese Woche
```
1. Entscheidung: Welches Backend bleibt?
2. Migrations-Plan detailliert ausarbeiten
3. Backup-Strategie definieren
```

### Phase 3: Nächste Woche
```
1. Backend-Konsolidierung durchführen
2. Alle Tools auf EIN Backend migrieren
3. Altes Backend deprecaten
```

---

## 🚀 DEPLOYMENT-MAP

### Aktuell deployed auf Server (91.98.93.203)

```
Container-Übersicht:

Backend:
  e0w0o40kk8g0osw0ggc0kwok-084931768746
    → api-check.samebi.net (Express)
    → Status: ✅ Healthy (neu gestartet heute)
    → Commit: 42e63de (Backend aktuell)

Frontend - Dashboard:
  uoo4kgk0kw0sswowg8w04o8s-162336164912
    → dashboard.samebi.net
    → Status: ⚠️ Veraltet (8 Tage alt)
    → Commit: 4b67dbc (SOLLTE 1e09f5f sein)

Frontend - Stress-Test DE:
  hos0ook04w4owggg808g80cc-195339245238
    → stress-test.samebi.net
    → Status: ✅ Healthy
    → API: api.samebi.net

Frontend - Stress-Test ES:
  o0kkssg4o0wk844oko0sc4g8-195339220198
    → test-estres.samebi.net
    → Status: ✅ Healthy
    → API: api.samebi.net

Datenbank:
  nsgccoc4scg8g444c400c840
    → PostgreSQL 17-Alpine
    → Status: ✅ Healthy (Up 2 weeks)
    → Verwendet von: api-check.samebi.net
```

---

## 🔐 Zugriffs-Matrix

| Service | Domain | Backend | Datenbank | Status |
|---------|--------|---------|-----------|--------|
| Stress-Test (ES) | test-estres.samebi.net | api.samebi.net | DB 1 (PostgREST) | ✅ |
| Stress-Test (DE) | stress-test.samebi.net | api.samebi.net | DB 1 (PostgREST) | ✅ |
| Burnout-Test | burnout-test.samebi.net | api.samebi.net | DB 1 (PostgREST) | ✅ |
| Dashboard | dashboard.samebi.net | api-check.samebi.net | DB 2 (Express) | ⚠️ |

---

## 📊 Daten-Fluss

### Test-Submission (Stress-Test)
```
User füllt Test aus
  ↓
test-estres.samebi.net (Frontend)
  ↓
POST https://api.samebi.net/test-results
  ↓
PostgREST Backend
  ↓
DB 1 (PostgreSQL)
  ↓
✅ Gespeichert
```

### Test-Submission (Dashboard)
```
Berater erstellt Test für Klient
  ↓
dashboard.samebi.net (Frontend)
  ↓
POST https://api-check.samebi.net/api/test-results/submit
  ↓
Express Backend
  ↓
DB 2 (PostgreSQL)
  ↓
✅ Gespeichert
```

### Supervisor View (Dashboard)
```
Supervisor öffnet Dashboard
  ↓
dashboard.samebi.net/supervisor
  ↓
GET https://api-check.samebi.net/api/test-results
  ↓
Express Backend
  ↓
DB 2 (PostgreSQL)
  ↓
⚠️ Zeigt NUR Tests aus DB 2
❌ Tests aus DB 1 (Stress-Tests) NICHT sichtbar
```

---

## 🛠️ NÄCHSTE SCHRITTE

### 1. Dashboard-Deployment fixen (DRINGEND)
```bash
# In Coolify:
1. Finde Service: dashboard.samebi.net
2. Settings → Repository
3. Prüfe: Branch = main
4. Prüfe: Auto Deploy = ENABLED
5. Click: "Force Rebuild & Redeploy"
6. Warte 3-5 Minuten
7. Verifiziere: Container hat neues Created-Datum
```

### 2. Transparenter Proxy implementieren (Quick Win)
```typescript
// Erstelle: src/services/multi-backend-api.ts
// Aggregiere Daten von beiden Backends
// Dashboard zeigt ALLE Tests
```

### 3. Backend-Entscheidung treffen (Strategisch)
```
Meeting einberufen:
- Tech-Lead
- Product Owner
- Entscheidung: PostgREST vs. Express?
- Timeline für Migration festlegen
```

---

## 📝 MAINTENANCE LOG

| Datum | Änderung | Grund | Status |
|-------|----------|-------|--------|
| 15.10.2025 | Multi-Backend entdeckt | Fehleranalyse | ⚠️ Offen |
| 15.10.2025 | 4 Tests neu berechnet | Leere Scores | ✅ Behoben |
| 15.10.2025 | Refresh-Button hinzugefügt | UX-Problem | ⚠️ Nicht deployed |
| 15.10.2025 | Server-Side Geo-Tracking | Reliability | ✅ Deployed |
| 06.10.2025 | Dashboard deployed | Initial | ⚠️ Veraltet |

---

**Dokument-Status:** Living Document  
**Owner:** PDG / AI Agent  
**Review-Cycle:** Wöchentlich  
**Nächstes Review:** 22. Oktober 2025

