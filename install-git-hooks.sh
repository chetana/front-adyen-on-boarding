#!/bin/bash

# Script d'installation des hooks Git pour la sécurité

echo "🔧 Installation des hooks Git de sécurité..."

# Créer le dossier hooks s'il n'existe pas
mkdir -p .git/hooks

# Créer le hook pre-commit
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Hook pre-commit pour vérifier la sécurité
# Empêche les commits contenant des clés API sensibles

echo "🔒 Vérification de sécurité avant commit..."

# Exécuter le script de vérification de sécurité
if ! ./check-security.sh; then
    echo ""
    echo "❌ COMMIT BLOQUÉ: Problèmes de sécurité détectés!"
    echo "Veuillez corriger les problèmes avant de commiter."
    echo ""
    echo "Pour plus d'informations, consultez SECURITY.md"
    exit 1
fi

echo "✅ Vérification de sécurité réussie. Commit autorisé."
exit 0
EOF

# Rendre le hook exécutable
chmod +x .git/hooks/pre-commit

echo "✅ Hook pre-commit installé avec succès!"
echo ""
echo "Le hook vérifiera automatiquement la sécurité avant chaque commit."
echo "Pour désactiver temporairement: git commit --no-verify"