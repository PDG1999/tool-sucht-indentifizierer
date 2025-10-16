#!/bin/bash
# Remote Fix für JWT Secret Problem auf dem Hetzner Server
# Führe dieses Script LOKAL aus - es verbindet sich automatisch mit dem Server

set -e

echo "🔧 JWT Secret Fix für api.samebi.net"
echo "======================================"
echo ""

# Server Details
SERVER_IP="91.98.93.203"
SSH_KEY="$HOME/.ssh/id_ed25519_hetzner"

# Prüfe ob SSH Key existiert
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH Key nicht gefunden: $SSH_KEY"
    echo "   Bitte prüfe den Pfad in INFRASTRUCTURE.md"
    exit 1
fi

echo "📡 Verbinde mit Server: $SERVER_IP"
echo ""

# Führe Fix auf dem Server aus
ssh -i "$SSH_KEY" root@$SERVER_IP << 'ENDSSH'
echo "✅ Verbunden mit Server!"
echo ""

echo "🔧 Schritt 1: JWT Secret in PostgreSQL setzen..."
docker exec herramientas_backend su-exec postgres psql -d herramientas -c "ALTER DATABASE herramientas SET app.jwt_secret = 'your-jwt-secret-key-here-min-32-chars';"

echo ""
echo "🔄 Schritt 2: PostgreSQL Configuration neu laden..."
docker exec herramientas_backend su-exec postgres psql -d herramientas -c "SELECT pg_reload_conf();"

echo ""
echo "🔄 Schritt 3: PostgREST neu starten..."
docker exec herramientas_backend supervisorctl restart postgrest

echo ""
echo "⏳ Warte 3 Sekunden..."
sleep 3

echo ""
echo "✅ Schritt 4: JWT Secret verifizieren..."
echo "PostgreSQL JWT Secret:"
docker exec herramientas_backend su-exec postgres psql -d herramientas -t -c "SELECT current_setting('app.jwt_secret', true);"

echo ""
echo "PostgREST JWT Secret:"
docker exec herramientas_backend printenv PGRST_JWT_SECRET

echo ""
echo "🧪 Schritt 5: Login testen..."
docker exec herramientas_backend curl -s -X POST http://localhost:3000/rpc/login \
  -H "Content-Type: application/json" \
  -d '{"email": "supervisor@samebi.net", "password": "SupervisorSAMEBI2025!"}' \
  | head -c 100

echo ""
echo ""
echo "======================================"
echo "✅ JWT Secret Fix abgeschlossen!"
echo "======================================"

ENDSSH

echo ""
echo "🎯 Nächste Schritte:"
echo "   1. Öffne: https://dashboard.samebi.net"
echo "   2. Login mit:"
echo "      Email: supervisor@samebi.net"
echo "      Password: SupervisorSAMEBI2025!"
echo ""
echo "   3. Der Login sollte jetzt funktionieren!"
echo ""

