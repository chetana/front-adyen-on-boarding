#!/bin/bash

# Script de vérification de sécurité pour le projet front-adyen-on-boarding
# Vérifie qu'aucune clé API sensible n'est présente dans le code source

echo "🔍 Vérification de sécurité en cours..."
echo "=================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteur d'erreurs
ERRORS=0

# Fonction pour afficher les erreurs
show_error() {
    echo -e "${RED}❌ ERREUR: $1${NC}"
    ERRORS=$((ERRORS + 1))
}

# Fonction pour afficher les avertissements
show_warning() {
    echo -e "${YELLOW}⚠️  ATTENTION: $1${NC}"
}

# Fonction pour afficher les succès
show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo "1. Vérification des clés API Adyen..."

# Recherche de clés API Adyen (commencent par AQE)
if grep -r "AQE[a-zA-Z0-9+/=\-_]" src/ --exclude-dir=node_modules 2>/dev/null; then
    show_error "Clés API Adyen détectées dans le code source!"
else
    show_success "Aucune clé API Adyen trouvée dans le code source"
fi

echo ""
echo "2. Vérification des patterns de clés sensibles..."

# Recherche de patterns suspects
PATTERNS=(
    "api.*key.*=.*['\"][a-zA-Z0-9+/=\-_]{20,}['\"]"
    "secret.*=.*['\"][a-zA-Z0-9+/=\-_]{20,}['\"]"
    "token.*=.*['\"][a-zA-Z0-9+/=\-_]{20,}['\"]"
    "password.*=.*['\"][^'\"]{8,}['\"]"
)

for pattern in "${PATTERNS[@]}"; do
    if grep -rE "$pattern" src/ --exclude-dir=node_modules 2>/dev/null; then
        show_error "Pattern suspect détecté: $pattern"
    fi
done

echo ""
echo "3. Vérification du .gitignore..."

# Vérifier que les fichiers sensibles sont ignorés
REQUIRED_IGNORES=(
    ".env"
    ".env.local"
    "config.json"
)

for ignore in "${REQUIRED_IGNORES[@]}"; do
    if grep -q "$ignore" .gitignore; then
        show_success "$ignore est ignoré par Git"
    else
        show_error "$ignore n'est pas dans le .gitignore"
    fi
done

echo ""
echo "4. Vérification des fichiers de configuration..."

# Vérifier qu'aucun fichier de config avec des clés n'existe
CONFIG_FILES=(
    "config.json"
    ".env"
    "secrets.json"
)

for config in "${CONFIG_FILES[@]}"; do
    if [ -f "$config" ]; then
        show_warning "Fichier de configuration détecté: $config"
        if grep -q "AQE" "$config" 2>/dev/null; then
            show_error "Clés API détectées dans $config"
        fi
    fi
done

echo ""
echo "5. Vérification des placeholders..."

# Vérifier que les placeholders sont utilisés
if grep -q "YOUR_.*_API_KEY_HERE" src/components/ConfigurationPanel.vue; then
    show_success "Placeholders sécurisés utilisés dans ConfigurationPanel.vue"
else
    show_error "Placeholders manquants dans ConfigurationPanel.vue"
fi

echo ""
echo "=================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Vérification de sécurité réussie! Aucun problème détecté.${NC}"
    exit 0
else
    echo -e "${RED}💥 $ERRORS erreur(s) de sécurité détectée(s)!${NC}"
    echo -e "${RED}Veuillez corriger ces problèmes avant de commiter.${NC}"
    exit 1
fi