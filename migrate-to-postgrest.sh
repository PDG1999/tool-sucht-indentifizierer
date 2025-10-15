#!/bin/bash

# Migration Script: Express → PostgREST
# Auto-Migration mit minimaler manueller Intervention
# Datum: 15. Oktober 2025

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   MIGRATION: Express Backend → PostgREST Backend             ║"
echo "║   Von: api-check.samebi.net → Zu: api.samebi.net             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Config
SERVER="root@91.98.93.203"
BACKUP_DIR="/root/migration_backup_$(date +%Y%m%d_%H%M%S)"

# ============================================================================
# PHASE 1: Vorbereitungen
# ============================================================================

echo -e "${YELLOW}📋 PHASE 1: Vorbereitungen${NC}"
echo "───────────────────────────────────────────────────────────────"

# Prüfe SSH-Verbindung
echo "🔍 Prüfe SSH-Verbindung zum Server..."
if ! ssh $SERVER "echo 'Connection OK'" > /dev/null 2>&1; then
    echo -e "${RED}❌ SSH-Verbindung fehlgeschlagen!${NC}"
    echo "Bitte prüfe: ssh root@91.98.93.203"
    exit 1
fi
echo -e "${GREEN}✅ SSH-Verbindung erfolgreich${NC}"

# Frage nach Backup
echo ""
echo -e "${YELLOW}⚠️  WICHTIG: Backup erstellen?${NC}"
read -p "Backup der alten Datenbank erstellen? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Erstelle Backup..."
    ssh $SERVER "mkdir -p $BACKUP_DIR"
    ssh $SERVER "docker exec nsgccoc4scg8g444c400c840 pg_dump -U postgres postgres > $BACKUP_DIR/express_db_backup.sql"
    echo -e "${GREEN}✅ Backup erstellt: $BACKUP_DIR/express_db_backup.sql${NC}"
    
    # Backup lokal kopieren
    echo "📥 Kopiere Backup auf lokalen Rechner..."
    scp $SERVER:$BACKUP_DIR/express_db_backup.sql ~/Desktop/
    echo -e "${GREEN}✅ Backup gespeichert: ~/Desktop/express_db_backup.sql${NC}"
fi

# ============================================================================
# PHASE 2: Schema Migration
# ============================================================================

echo ""
echo -e "${YELLOW}📊 PHASE 2: Schema Migration${NC}"
echo "───────────────────────────────────────────────────────────────"

# Kopiere Migrations-Scripts
echo "📤 Kopiere Migrations-Scripts auf Server..."
scp herramientas-backend/database/migration_add_counseling.sql $SERVER:/root/
scp herramientas-backend/database/migrate_data_from_express.sql $SERVER:/root/
echo -e "${GREEN}✅ Scripts kopiert${NC}"

# Finde PostgreSQL Container
echo "🔍 Suche PostgREST PostgreSQL Container..."
POSTGRES_CONTAINER=$(ssh $SERVER "docker ps --format '{{.Names}}' | grep postgres | head -1")
if [ -z "$POSTGRES_CONTAINER" ]; then
    echo -e "${RED}❌ Kein PostgreSQL Container gefunden!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Container gefunden: $POSTGRES_CONTAINER${NC}"

# Finde DB-Name
echo "🔍 Ermittle Datenbank-Namen..."
DB_NAME=$(ssh $SERVER "docker exec $POSTGRES_CONTAINER psql -U postgres -t -c \"SELECT datname FROM pg_database WHERE datname NOT IN ('postgres', 'template0', 'template1') LIMIT 1;\"" | tr -d ' ')
if [ -z "$DB_NAME" ]; then
    DB_NAME="herramientas"
    echo -e "${YELLOW}⚠️  DB-Name nicht gefunden, nutze Default: herramientas${NC}"
else
    echo -e "${GREEN}✅ Datenbank: $DB_NAME${NC}"
fi

# Schema Migration ausführen
echo "🚀 Führe Schema Migration aus..."
ssh $SERVER "docker exec -i $POSTGRES_CONTAINER psql -U postgres -d $DB_NAME < /root/migration_add_counseling.sql" || {
    echo -e "${RED}❌ Schema Migration fehlgeschlagen!${NC}"
    exit 1
}
echo -e "${GREEN}✅ Schema Migration erfolgreich${NC}"

# ============================================================================
# PHASE 3: Daten Migration (Semi-Automatisch)
# ============================================================================

echo ""
echo -e "${YELLOW}💾 PHASE 3: Daten Migration${NC}"
echo "───────────────────────────────────────────────────────────────"

echo -e "${YELLOW}⚠️  WICHTIG: Passwort der alten Datenbank${NC}"
echo "Die Daten-Migration benötigt das Passwort der alten Express-DB."
echo ""
read -p "Altes DB-Passwort eingeben (oder Enter für manuell): " OLD_DB_PASSWORD

if [ -n "$OLD_DB_PASSWORD" ]; then
    echo "🔧 Passe Migrations-Script an..."
    ssh $SERVER "sed -i \"s/YOUR_OLD_DB_PASSWORD/$OLD_DB_PASSWORD/g\" /root/migrate_data_from_express.sql"
    
    echo "🚀 Führe Daten-Migration aus..."
    ssh $SERVER "docker exec -i $POSTGRES_CONTAINER psql -U postgres -d $DB_NAME < /root/migrate_data_from_express.sql" || {
        echo -e "${RED}❌ Daten-Migration fehlgeschlagen!${NC}"
        echo "Prüfe Passwort und versuche manuell."
        exit 1
    }
    echo -e "${GREEN}✅ Daten-Migration erfolgreich${NC}"
else
    echo -e "${YELLOW}📝 Manuelle Daten-Migration erforderlich:${NC}"
    echo "1. SSH auf Server: ssh $SERVER"
    echo "2. Editiere: nano /root/migrate_data_from_express.sql"
    echo "3. Ersetze: YOUR_OLD_DB_PASSWORD mit echtem Passwort"
    echo "4. Führe aus: docker exec -i $POSTGRES_CONTAINER psql -U postgres -d $DB_NAME < /root/migrate_data_from_express.sql"
    echo ""
    read -p "Drücke Enter, wenn Daten-Migration manuell abgeschlossen wurde..."
fi

# ============================================================================
# PHASE 4: Verifikation
# ============================================================================

echo ""
echo -e "${YELLOW}✅ PHASE 4: Verifikation${NC}"
echo "───────────────────────────────────────────────────────────────"

echo "🔍 Prüfe migrierte Daten..."
ssh $SERVER "docker exec $POSTGRES_CONTAINER psql -U postgres -d $DB_NAME -c \"
SELECT 
    'counselors' as table_name, COUNT(*)::text as count FROM api.counselors
UNION ALL
SELECT 'clients', COUNT(*)::text FROM api.clients
UNION ALL
SELECT 'test_results', COUNT(*)::text FROM api.test_results;
\""

echo ""
echo -e "${GREEN}✅ Daten-Migration abgeschlossen!${NC}"

# ============================================================================
# PHASE 5: Nächste Schritte
# ============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   ✅ MIGRATION ABGESCHLOSSEN!                                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🎯 NÄCHSTE SCHRITTE:"
echo ""
echo "1. 📝 Dashboard anpassen:"
echo "   cd tool-sucht-indentifizieren-anonym"
echo "   # Ändere API_BASE_URL in src/services/api.ts"
echo "   # Von: https://api-check.samebi.net/api"
echo "   # Zu:  https://api.samebi.net"
echo ""
echo "2. 🚀 Dashboard deployen:"
echo "   git add ."
echo "   git commit -m 'Migrate: Dashboard to PostgREST'"
echo "   git push origin main"
echo ""
echo "3. 🧪 Testen:"
echo "   https://dashboard.samebi.net/supervisor"
echo "   Login: supervisor@samebi.net / SuperPass2024!"
echo ""
echo "4. 📚 Dokumentation lesen:"
echo "   cat MIGRATION_EXPRESS_TO_POSTGREST.md"
echo ""
echo "5. ✅ Bei Erfolg: Altes Backend deaktivieren (in 1 Woche)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Migration erfolgreich abgeschlossen!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

