#!/bin/bash

echo "🚀 Démarrage de l'application Djust Pay Onboarding..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Installer les dépendances si node_modules n'existe pas
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Démarrer l'application
echo "🌐 Démarrage du serveur de développement..."
echo "📍 L'application sera disponible sur http://localhost:3000"
echo "🛑 Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

npm run dev