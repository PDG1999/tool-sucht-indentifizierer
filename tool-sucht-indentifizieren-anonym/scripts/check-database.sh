#!/bin/bash

# ==============================================================================
# 🔍 SAMEBI Database Check Script
# ==============================================================================
# Prüft ob alle User-Tests gespeichert und vom Supervisor einsehbar sind
# ==============================================================================

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🔍 SAMEBI Database Diagnostic Tool                    ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ==============================================================================
# Option 1: Coolify / Docker
# ==============================================================================

echo -e "${YELLOW}📦 Checking Docker containers...${NC}"
echo ""

# Prüfe ob Docker läuft
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker nicht gefunden. Installiere Docker oder nutze Coolify Web-Terminal.${NC}"
    echo ""
    echo -e "${BLUE}💡 Alternative: Nutze Coolify Web-Terminal${NC}"
    echo "   1. Gehe zu: Coolify Dashboard"
    echo "   2. Wähle: PostgreSQL Database"
    echo "   3. Klicke: Terminal"
    echo "   4. Führe aus: psql -U postgres -d samebi_sucht"
    echo ""
    exit 1
fi

# Finde PostgreSQL Container
POSTGRES_CONTAINER=$(docker ps --filter "name=postgres" --format "{{.ID}}" | head -n 1)

if [ -z "$POSTGRES_CONTAINER" ]; then
    echo -e "${RED}❌ Kein PostgreSQL-Container gefunden${NC}"
    echo ""
    echo "Mögliche Lösungen:"
    echo "1. Prüfe ob Container läuft: docker ps -a"
    echo "2. Nutze SSH: ssh root@91.98.93.203"
    echo "3. Nutze Coolify Web-Terminal"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL Container gefunden: ${POSTGRES_CONTAINER}${NC}"
echo ""

# ==============================================================================
# Datenbank-Abfragen
# ==============================================================================

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📊 DATENBANK-ANALYSE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Query 1: Gesamtzahl Tests
echo -e "${YELLOW}1️⃣  Gesamtzahl gespeicherter Tests:${NC}"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d samebi_sucht -t -c "SELECT COUNT(*) as total_tests FROM test_results;"
echo ""

# Query 2: Tests nach Datum
echo -e "${YELLOW}2️⃣  Tests nach Datum (letzte 7 Tage):${NC}"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d samebi_sucht -c "
SELECT 
  TO_CHAR(created_at, 'DD.MM.YYYY') as datum,
  COUNT(*) as anzahl
FROM test_results
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY TO_CHAR(created_at, 'DD.MM.YYYY')
ORDER BY MIN(created_at) DESC;
"
echo ""

# Query 3: Vollständigkeit
echo -e "${YELLOW}3️⃣  Daten-Vollständigkeit:${NC}"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d samebi_sucht -c "
SELECT 
  COUNT(*) as total,
  COUNT(responses) as mit_antworten,
  COUNT(tracking_data) as mit_tracking,
  COUNT(session_data) as mit_session,
  COUNT(CASE WHEN aborted = false THEN 1 END) as vollstaendig,
  COUNT(CASE WHEN aborted = true THEN 1 END) as abgebrochen
FROM test_results;
"
echo ""

# Query 4: Risiko-Verteilung
echo -e "${YELLOW}4️⃣  Risiko-Verteilung:${NC}"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d samebi_sucht -c "
SELECT 
  risk_level,
  COUNT(*) as anzahl,
  ROUND(COUNT(*)::numeric / NULLIF((SELECT COUNT(*) FROM test_results)::numeric, 0) * 100, 2) as prozent
FROM test_results
GROUP BY risk_level
ORDER BY anzahl DESC;
"
echo ""

# Query 5: Geo-Daten
echo -e "${YELLOW}5️⃣  Geografische Daten:${NC}"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d samebi_sucht -c "
SELECT 
  COUNT(*) as tests_mit_geo,
  COUNT(DISTINCT tracking_data->'geo_data'->>'city') as verschiedene_staedte,
  COUNT(DISTINCT tracking_data->'geo_data'->>'country') as verschiedene_laender
FROM test_results
WHERE tracking_data->'geo_data' IS NOT NULL;
"
echo ""

# Query 6: Letzte Tests
echo -e "${YELLOW}6️⃣  Letzte 5 Tests:${NC}"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d samebi_sucht -c "
SELECT 
  TO_CHAR(created_at, 'DD.MM HH24:MI') as datum,
  risk_level,
  primary_concern,
  CASE WHEN aborted THEN 'Ja' ELSE 'Nein' END as abgebrochen,
  tracking_data->'geo_data'->>'city' as stadt,
  tracking_data->>'device_type' as geraet
FROM test_results
ORDER BY created_at DESC
LIMIT 5;
"
echo ""

# Query 7: Supervisor-Account
echo -e "${YELLOW}7️⃣  Supervisor-Account:${NC}"
docker exec -it $POSTGRES_CONTAINER psql -U postgres -d samebi_sucht -c "
SELECT 
  name, 
  email, 
  role, 
  is_active,
  TO_CHAR(created_at, 'DD.MM.YYYY HH24:MI') as erstellt
FROM counselors 
WHERE role = 'supervisor' OR email = 'supervisor@samebi.net';
"
echo ""

# ==============================================================================
# Zusammenfassung
# ==============================================================================

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📋 ZUSAMMENFASSUNG${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

TOTAL_TESTS=$(docker exec $POSTGRES_CONTAINER psql -U postgres -d samebi_sucht -t -A -c "SELECT COUNT(*) FROM test_results;")
TRACKING_TESTS=$(docker exec $POSTGRES_CONTAINER psql -U postgres -d samebi_sucht -t -A -c "SELECT COUNT(*) FROM test_results WHERE tracking_data IS NOT NULL;")
SUPERVISOR_EXISTS=$(docker exec $POSTGRES_CONTAINER psql -U postgres -d samebi_sucht -t -A -c "SELECT COUNT(*) FROM counselors WHERE role = 'supervisor';")

echo -e "Tests gespeichert:      ${GREEN}${TOTAL_TESTS}${NC}"
echo -e "Mit Tracking-Daten:     ${GREEN}${TRACKING_TESTS}${NC}"

if [ "$TOTAL_TESTS" -gt 0 ]; then
    TRACKING_PERCENT=$((TRACKING_TESTS * 100 / TOTAL_TESTS))
    echo -e "Tracking-Quote:         ${GREEN}${TRACKING_PERCENT}%${NC}"
fi

if [ "$SUPERVISOR_EXISTS" -gt 0 ]; then
    echo -e "Supervisor-Account:     ${GREEN}✅ Vorhanden${NC}"
else
    echo -e "Supervisor-Account:     ${RED}❌ Nicht gefunden${NC}"
fi

echo ""

# ==============================================================================
# Status & Empfehlungen
# ==============================================================================

if [ "$TOTAL_TESTS" -eq 0 ]; then
    echo -e "${RED}⚠️  WARNUNG: Keine Tests gefunden!${NC}"
    echo ""
    echo "Mögliche Ursachen:"
    echo "• Backend ist nicht erreichbar"
    echo "• Frontend sendet nicht zur richtigen URL"
    echo "• Migrations wurden nicht ausgeführt"
    echo ""
    echo "Nächste Schritte:"
    echo "1. Prüfe Backend-Logs: docker logs [BACKEND_CONTAINER]"
    echo "2. Teste API: curl https://stress-test.samebi.net/api/health"
    echo "3. Führe Migrations aus: siehe COOLIFY_DEPLOYMENT.md"
    echo ""
elif [ "$SUPERVISOR_EXISTS" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Supervisor-Account fehlt!${NC}"
    echo ""
    echo "Lösung: Führe aus (im psql):"
    echo "siehe: CHECK_DATABASE.md oder COOLIFY_DB_ZUGRIFF.md"
    echo ""
else
    echo -e "${GREEN}✅ Alles sieht gut aus!${NC}"
    echo ""
    echo "Du kannst jetzt:"
    echo "• Als Supervisor einloggen: supervisor@samebi.net"
    echo "• Alle Tests einsehen im Dashboard"
    echo "• Tracking-Daten analysieren"
    echo ""
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}💡 Weitere Details in: CHECK_DATABASE.md${NC}"
echo ""

