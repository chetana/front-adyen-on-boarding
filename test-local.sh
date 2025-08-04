#!/bin/bash

echo "🧪 Test local de l'application Adyen Onboarding..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Build de l'application
echo "🔨 Construction de l'application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"
    
    # Test avec Docker (optionnel)
    if command -v docker &> /dev/null; then
        echo "🐳 Test avec Docker..."
        
        # Build de l'image Docker
        docker build -t adyen-onboarding-test .
        
        if [ $? -eq 0 ]; then
            echo "✅ Image Docker créée avec succès !"
            echo "🚀 Démarrage du conteneur de test sur le port 8080..."
            echo "📱 Ouvrez http://localhost:8080 dans votre navigateur"
            echo "⏹️  Appuyez sur Ctrl+C pour arrêter le test"
            
            # Démarrer le conteneur
            docker run -p 8080:8080 --rm adyen-onboarding-test
        else
            echo "❌ Erreur lors de la création de l'image Docker"
            exit 1
        fi
    else
        echo "⚠️  Docker n'est pas installé. Test Docker ignoré."
        echo "🚀 Démarrage du serveur de développement..."
        npm run preview
    fi
else
    echo "❌ Erreur lors du build de l'application"
    exit 1
fi