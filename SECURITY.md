# 🔒 Guide de Sécurité - Front Adyen Onboarding

## ⚠️ IMPORTANT - Clés API

### ❌ Ce qu'il ne faut JAMAIS faire

- **Ne jamais commiter de vraies clés API** dans le code source
- **Ne jamais partager vos clés API** dans des messages, emails ou documentation
- **Ne jamais utiliser des clés de production** pour les tests
- **Ne jamais laisser des clés API** dans des fichiers de configuration versionnés

### ✅ Bonnes pratiques

1. **Utilisez uniquement des clés de test** pour le développement
2. **Stockez les clés dans des variables d'environnement** (fichiers `.env.local`)
3. **Utilisez des placeholders** dans le code source (comme `YOUR_API_KEY_HERE`)
4. **Vérifiez le `.gitignore`** pour s'assurer que les fichiers sensibles sont ignorés

## 🔧 Configuration sécurisée

### Étape 1: Créer un fichier de configuration local

```bash
# Copiez le fichier d'exemple
cp .env.example .env.local

# Éditez le fichier avec vos vraies clés (JAMAIS commité)
nano .env.local
```

### Étape 2: Remplir vos clés API de test

```env
# Dans .env.local (ce fichier est ignoré par Git)
VITE_ADYEN_LEM_API_KEY=AQE7hmfxKY3OaxRAw0ixnmU2pOGrRIpZC5xYVSty7E2YqlZKh...
VITE_ADYEN_MANAGEMENT_API_KEY=AQEqhmfxKonJbhZDw0m/n3Q5qf3VbKF4Pqd6WXzp22OEN5NpV...
VITE_ADYEN_ENVIRONMENT=test
```

### Étape 3: Utiliser les variables dans le code

```javascript
// Dans votre composant Vue
const config = {
  lemApiKey: import.meta.env.VITE_ADYEN_LEM_API_KEY || '',
  managementApiKey: import.meta.env.VITE_ADYEN_MANAGEMENT_API_KEY || '',
  environment: import.meta.env.VITE_ADYEN_ENVIRONMENT || 'test'
}
```

## 🛡️ Bouton "Remplir avec des données de test"

Le bouton de test a été **sécurisé** :

- ✅ **Les clés API ont été retirées** du code source
- ✅ **Seules les données d'exemple** sont pré-remplies
- ✅ **Les utilisateurs doivent saisir leurs propres clés**
- ✅ **Un message d'avertissement** guide les utilisateurs

### Avant (DANGEREUX) ❌
```javascript
config.lemApiKey = 'AQE7hmfxKY3OaxRAw0ixnmU2pOGrRIpZC5xYVSty7E2YqlZKh...'
config.managementApiKey = 'AQEqhmfxKonJbhZDw0m/n3Q5qf3VbKF4Pqd6WXzp22OEN5NpV...'
```

### Après (SÉCURISÉ) ✅
```javascript
// ATTENTION: Remplacez ces placeholders par vos vraies clés API de test
config.lemApiKey = 'YOUR_LEM_API_KEY_HERE'
config.managementApiKey = 'YOUR_MANAGEMENT_API_KEY_HERE'
```

## 🔍 Vérification de sécurité

### Checklist avant commit

- [ ] Aucune clé API réelle dans le code source
- [ ] Fichiers `.env.local` dans le `.gitignore`
- [ ] Placeholders utilisés pour les exemples
- [ ] Documentation mise à jour

### Commandes de vérification

```bash
# Rechercher des clés API potentielles
grep -r "AQE" src/ --exclude-dir=node_modules
grep -r "api.*key" src/ --exclude-dir=node_modules

# Vérifier le .gitignore
cat .gitignore | grep -E "\.env|config\.json"
```

## 🚨 En cas de compromission

Si vous avez accidentellement commité des clés API :

1. **Révoquez immédiatement** les clés dans Adyen Customer Area
2. **Générez de nouvelles clés** de test
3. **Nettoyez l'historique Git** si nécessaire
4. **Informez l'équipe** de sécurité

## 📞 Contact

Pour toute question de sécurité, contactez l'équipe DevSecOps de Djust.

---

**Rappel** : La sécurité est la responsabilité de tous. Soyez vigilants ! 🛡️