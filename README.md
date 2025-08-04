# Djust Pay - Onboarding Adyen

Interface Vue.js pour automatiser le processus d'onboarding Adyen. Cette application remplace le flux Postman par une interface web conviviale et facilement partageable.

## 🚀 Fonctionnalités

- **Interface intuitive** : Formulaire de configuration avec tous les paramètres nécessaires
- **Processus automatisé** : Exécution séquentielle de toutes les étapes d'onboarding
- **Suivi en temps réel** : Visualisation du progrès avec indicateurs de statut
- **Gestion d'erreurs** : Affichage détaillé des erreurs avec possibilité de voir les réponses API
- **Environnements multiples** : Support des environnements test et live d'Adyen
- **Responsive** : Interface adaptée à tous les écrans

## 📋 Prérequis

- Node.js 16+ 
- npm ou yarn
- Clés API Adyen (LEM et Management)

## 🛠️ Installation

1. **Naviguer vers le dossier du projet** :
   ```bash
   cd djust-pay/djust-pay-onboarding
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Démarrer l'application en mode développement** :
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Vérifier la sécurité** (recommandé) :
   ```bash
   npm run security-check
   ```

5. **Ouvrir l'application** :
   L'application sera disponible sur `http://localhost:3000`

## 🔧 Configuration

### Paramètres API requis

- **Clé API LEM** : Clé pour les API KYC et Balance Platform
- **Clé API Management** : Clé pour l'API Management d'Adyen
- **Environnement** : `test` ou `live`

### Données d'organisation

- Nom légal de l'entreprise
- Numéro d'enregistrement
- Numéro de TVA
- Adresse complète
- Référence unique

### Informations business

- Code industrie
- Site web
- Merchant ID
- Numéro de téléphone

### Paramètres d'onboarding

- Theme ID (optionnel)
- URL de redirection
- Locale (fr-FR, en-US, etc.)

## 🔄 Processus d'onboarding

L'application exécute automatiquement les 7 étapes suivantes :

1. **Créer l'organisation** - Création de l'entité légale
2. **Créer le titulaire de compte** - Création du compte holder
3. **Créer le compte de balance** - Compte pour les transactions
4. **Créer les business lines** - Configuration des lignes de business
5. **Créer la boutique** - Création du store
6. **Configurer les méthodes de paiement** - Configuration Visa/EUR
7. **Créer le lien d'onboarding** - Génération du lien hébergé

## 📁 Structure du projet

```
djust-pay-onboarding/
├── src/
│   ├── components/
│   │   ├── ConfigurationPanel.vue    # Formulaire de configuration
│   │   └── ProcessFlow.vue           # Affichage du processus
│   ├── composables/
│   │   └── useOnboardingProcess.js   # Logique métier
│   ├── services/
│   │   └── AdyenApiService.js        # Service API Adyen
│   ├── App.vue                       # Composant principal
│   └── main.js                       # Point d'entrée
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Technologies utilisées

- **Vue.js 3** - Framework JavaScript réactif
- **Vite** - Build tool rapide
- **Axios** - Client HTTP pour les appels API
- **Bootstrap 5** - Framework CSS
- **Font Awesome** - Icônes
- **Vue Toastification** - Notifications

## 🔒 Sécurité

- Les clés API sont saisies via des champs password
- Aucune donnée sensible n'est stockée localement
- Support HTTPS pour les appels API
- Gestion d'erreurs robuste

### ⚠️ Bouton "Remplir avec des données de test"

Le bouton "Remplir avec des données de test" remplit automatiquement le formulaire avec des données d'exemple, **MAIS** :

- **Les clés API ne sont PAS incluses** pour des raisons de sécurité
- Vous devez **manuellement saisir vos propres clés API de test**
- **Ne jamais commiter de vraies clés API** dans le code source
- Utilisez uniquement des clés de l'environnement **test** d'Adyen

### 🔑 Obtenir vos clés API de test

1. Connectez-vous à votre [Customer Area Adyen](https://ca-test.adyen.com/)
2. Allez dans **Developers > API credentials**
3. Créez ou sélectionnez vos credentials de test
4. Copiez les clés dans l'interface (champs "Clé API LEM" et "Clé API Management")

## 🚀 Build pour la production

```bash
npm run build
# ou
yarn build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## 📝 Utilisation

1. **Ouvrir l'application** dans votre navigateur
2. **Remplir le formulaire** de configuration avec vos données
3. **Cliquer sur "Démarrer l'onboarding"**
4. **Suivre le progrès** en temps réel
5. **Récupérer le lien d'onboarding** généré à la fin

## 🐛 Dépannage

### Erreurs communes

- **Clé API invalide** : Vérifiez que vos clés API sont correctes et actives
- **Erreur de réseau** : Vérifiez votre connexion internet
- **Données manquantes** : Assurez-vous que tous les champs requis sont remplis

### Logs de débogage

Les détails des appels API sont disponibles dans :
- Console du navigateur (F12)
- Onglet "Voir les détails" de chaque étape

## 🤝 Contribution

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Créer une Pull Request

## 📄 Licence

Ce projet fait partie de l'écosystème Djust Commerce.

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement Djust.