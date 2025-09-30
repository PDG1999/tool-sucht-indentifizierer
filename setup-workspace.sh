#!/bin/bash

# SAMEBI Tools Workspace Setup Script
# Erstellt alle GitHub Repositories und lokale Entwicklungsumgebung

set -e

echo "🚀 SAMEBI Tools Workspace Setup für PDG1999"
echo "=============================================="

# Variablen
GITHUB_USER="PDG1999"
WORKSPACE_DIR="$HOME/samebi-tools-workspace"
REPOS=(
    "herramientas-backend"
    "shared-components" 
    "tool-stress-checker"
    "tool-rate-calculator"
    "tool-burnout-test"
    "tool-location-analyzer"
    "tool-content-generator"
    "coolify-config"
)

# Workspace Verzeichnis erstellen
echo "📁 Erstelle Workspace Verzeichnis..."
mkdir -p "$WORKSPACE_DIR"
cd "$WORKSPACE_DIR"

# GitHub CLI prüfen
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI nicht gefunden. Bitte installieren: brew install gh"
    exit 1
fi

# GitHub Authentication prüfen
if ! gh auth status &> /dev/null; then
    echo "🔐 GitHub Authentication erforderlich..."
    gh auth login
fi

echo "✅ GitHub CLI bereit"

# Repositories erstellen und klonen
for repo in "${REPOS[@]}"; do
    echo "📦 Verarbeite Repository: $repo"
    
    # Repository auf GitHub erstellen (falls nicht vorhanden)
    if ! gh repo view "$GITHUB_USER/$repo" &> /dev/null; then
        echo "  → Erstelle GitHub Repository..."
        gh repo create "$GITHUB_USER/$repo" --public --description "SAMEBI Tools - $repo"
    else
        echo "  → Repository existiert bereits"
    fi
    
    # Lokales Repository klonen/initialisieren
    if [ ! -d "$repo" ]; then
        echo "  → Klone Repository lokal..."
        git clone "https://github.com/$GITHUB_USER/$repo.git"
    else
        echo "  → Lokales Repository existiert bereits"
    fi
    
    # In Repository wechseln
    cd "$repo"
    
    # README.md aus unserem Setup kopieren (falls vorhanden)
    if [ -f "/Volumes/SSD Samsung 970 PDG/PDG-Tools-SAMEBI/$repo/README.md" ]; then
        echo "  → Kopiere README.md..."
        cp "/Volumes/SSD Samsung 970 PDG/PDG-Tools-SAMEBI/$repo/README.md" .
    fi
    
    # Weitere Dateien kopieren
    if [ -d "/Volumes/SSD Samsung 970 PDG/PDG-Tools-SAMEBI/$repo" ]; then
        echo "  → Kopiere Projektdateien..."
        cp -r "/Volumes/SSD Samsung 970 PDG/PDG-Tools-SAMEBI/$repo/"* . 2>/dev/null || true
    fi
    
    # Git Setup
    if [ ! -f ".gitignore" ]; then
        echo "  → Erstelle .gitignore..."
        cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Docker
.dockerignore
EOF
    fi
    
    # Änderungen committen und pushen
    if [ -n "$(git status --porcelain)" ]; then
        echo "  → Committe Änderungen..."
        git add .
        git commit -m "Initial setup: Project structure and documentation"
        git push origin main 2>/dev/null || git push origin master 2>/dev/null || echo "  ⚠️  Push fehlgeschlagen - Repository möglicherweise leer"
    fi
    
    cd "$WORKSPACE_DIR"
    echo "  ✅ $repo fertig"
done

# Workspace-Übersicht erstellen
echo ""
echo "📋 Workspace-Übersicht erstellen..."
cat > "$WORKSPACE_DIR/README.md" << EOF
# SAMEBI Tools Workspace

## 🎯 Übersicht
Lokaler Workspace für alle SAMEBI Marketing-Tools.

## 📁 Repository Struktur
\`\`\`
samebi-tools-workspace/
├── herramientas-backend/     # PostgreSQL + PostgREST Backend
├── shared-components/        # Wiederverwendbare React Components  
├── tool-stress-checker/      # Stress-Level Assessment Tool
├── tool-rate-calculator/     # Stundensatz-Optimierung Tool
├── tool-burnout-test/        # Burnout-Risiko Assessment
├── tool-location-analyzer/   # Praxis-Standort Analyse
├── tool-content-generator/   # Social Media Content Generator
└── coolify-config/          # Deployment Konfiguration
\`\`\`

## 🚀 Quick Commands

### Alle Repositories updaten
\`\`\`bash
./update-all.sh
\`\`\`

### Neues Tool entwickeln
\`\`\`bash
cd tool-[name]/
npm install
npm run dev
\`\`\`

### Backend starten
\`\`\`bash
cd herramientas-backend/
docker-compose up -d
\`\`\`

## 🌐 Live URLs
- **Coolify Dashboard:** https://coolify.samebi.net:8000
- **API Backend:** https://api.samebi.net
- **Tools Landing:** https://herramientas.samebi.net

## 👨‍💻 Entwickler
- **GitHub:** PDG1999
- **Projekt:** SAMEBI Marketing Tools
- **Setup:** $(date)
EOF

# Update-Script erstellen
echo "🔄 Erstelle Update-Script..."
cat > "$WORKSPACE_DIR/update-all.sh" << 'EOF'
#!/bin/bash

echo "🔄 Aktualisiere alle SAMEBI Repositories..."

for dir in */; do
    if [ -d "$dir/.git" ]; then
        echo "📦 Aktualisiere $dir"
        cd "$dir"
        git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
        cd ..
    fi
done

echo "✅ Alle Repositories aktualisiert"
EOF

chmod +x "$WORKSPACE_DIR/update-all.sh"

# VS Code Workspace erstellen
echo "💻 Erstelle VS Code Workspace..."
cat > "$WORKSPACE_DIR/samebi-tools.code-workspace" << EOF
{
    "folders": [
        {
            "name": "🔧 Backend",
            "path": "./herramientas-backend"
        },
        {
            "name": "🧩 Shared Components", 
            "path": "./shared-components"
        },
        {
            "name": "😰 Stress Checker",
            "path": "./tool-stress-checker"
        },
        {
            "name": "💰 Rate Calculator",
            "path": "./tool-rate-calculator"
        },
        {
            "name": "🔥 Burnout Test",
            "path": "./tool-burnout-test"
        },
        {
            "name": "📍 Location Analyzer",
            "path": "./tool-location-analyzer"
        },
        {
            "name": "📝 Content Generator",
            "path": "./tool-content-generator"
        },
        {
            "name": "⚙️ Coolify Config",
            "path": "./coolify-config"
        }
    ],
    "settings": {
        "typescript.preferences.includePackageJsonAutoImports": "on",
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true
        }
    },
    "extensions": {
        "recommendations": [
            "bradlc.vscode-tailwindcss",
            "esbenp.prettier-vscode",
            "dbaeumer.vscode-eslint",
            "ms-vscode.vscode-typescript-next"
        ]
    }
}
EOF

echo ""
echo "🎉 SETUP ERFOLGREICH ABGESCHLOSSEN!"
echo "=================================="
echo ""
echo "📁 Workspace Pfad: $WORKSPACE_DIR"
echo "💻 VS Code öffnen: code $WORKSPACE_DIR/samebi-tools.code-workspace"
echo "🌐 GitHub Profile: https://github.com/$GITHUB_USER"
echo ""
echo "🚀 Nächste Schritte:"
echo "1. VS Code Workspace öffnen"
echo "2. Coolify Installation auf Server abschließen"  
echo "3. Erstes Tool (Stress Checker) entwickeln"
echo "4. GitHub Integration in Coolify konfigurieren"
echo ""
echo "📞 Support: Bei Fragen → PDG1999"
