# Déploiement sur Google Cloud Run

Ce guide vous explique comment déployer l'application Adyen Onboarding sur Google Cloud Run.

## Prérequis

1. **Compte Google Cloud Platform** avec un projet créé
2. **Google Cloud SDK (gcloud)** installé et configuré
3. **Docker** installé (optionnel, pour les tests locaux)

## Installation de Google Cloud SDK

### Sur macOS
```bash
brew install --cask google-cloud-sdk
```

### Sur Ubuntu/Debian
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### Sur Windows
Téléchargez l'installateur depuis : https://cloud.google.com/sdk/docs/install

## Configuration initiale

1. **Authentification**
```bash
gcloud auth login
```

2. **Définir le projet par défaut**
```bash
gcloud config set project YOUR_PROJECT_ID
```

3. **Vérifier la configuration**
```bash
gcloud config list
```

## Méthode 1 : Déploiement automatique (Recommandé)

1. **Modifier le script de déploiement**
   - Ouvrez le fichier `deploy.sh`
   - Remplacez `your-gcp-project-id` par votre vrai Project ID GCP

2. **Exécuter le déploiement**
```bash
./deploy.sh
```

Le script va :
- Activer les APIs nécessaires
- Construire l'image Docker
- Déployer sur Cloud Run
- Afficher l'URL de votre application

## Méthode 2 : Déploiement manuel

### Étape 1 : Activer les APIs
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Étape 2 : Build et déploiement
```bash
gcloud builds submit --config cloudbuild.yaml .
```

### Étape 3 : Vérifier le déploiement
```bash
gcloud run services list --region=europe-west1
```

## Méthode 3 : Déploiement avec Docker local

### Étape 1 : Build local
```bash
docker build -t adyen-onboarding-frontend .
```

### Étape 2 : Test local
```bash
docker run -p 8080:8080 adyen-onboarding-frontend
```

### Étape 3 : Tag et push
```bash
docker tag adyen-onboarding-frontend gcr.io/YOUR_PROJECT_ID/adyen-onboarding-frontend
docker push gcr.io/YOUR_PROJECT_ID/adyen-onboarding-frontend
```

### Étape 4 : Déployer sur Cloud Run
```bash
gcloud run deploy adyen-onboarding-frontend \
  --image gcr.io/YOUR_PROJECT_ID/adyen-onboarding-frontend \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

## Configuration avancée

### Variables d'environnement
Si votre application nécessite des variables d'environnement, ajoutez-les au déploiement :

```bash
gcloud run deploy adyen-onboarding-frontend \
  --image gcr.io/YOUR_PROJECT_ID/adyen-onboarding-frontend \
  --region europe-west1 \
  --set-env-vars "API_URL=https://your-api-url.com,NODE_ENV=production"
```

### Domaine personnalisé
Pour utiliser un domaine personnalisé :

1. **Mapper le domaine**
```bash
gcloud run domain-mappings create \
  --service adyen-onboarding-frontend \
  --domain your-domain.com \
  --region europe-west1
```

2. **Configurer DNS**
Ajoutez les enregistrements DNS fournis par Google Cloud.

### Authentification
Pour activer l'authentification :

```bash
gcloud run services update adyen-onboarding-frontend \
  --region europe-west1 \
  --no-allow-unauthenticated
```

## Surveillance et logs

### Voir les logs
```bash
gcloud run services logs read adyen-onboarding-frontend --region=europe-west1
```

### Surveiller les métriques
Accédez à la console Google Cloud > Cloud Run > votre service > Métriques

## Mise à jour de l'application

Pour mettre à jour l'application, il suffit de relancer le déploiement :

```bash
./deploy.sh
```

Ou manuellement :
```bash
gcloud builds submit --config cloudbuild.yaml .
```

## Dépannage

### Erreur de permissions
```bash
gcloud auth application-default login
```

### Erreur de quota
Vérifiez vos quotas dans la console GCP : IAM & Admin > Quotas

### Erreur de build
Vérifiez les logs de Cloud Build :
```bash
gcloud builds list
gcloud builds log BUILD_ID
```

### Service non accessible
Vérifiez que le service autorise le trafic non authentifié :
```bash
gcloud run services describe adyen-onboarding-frontend --region=europe-west1
```

## Coûts estimés

Cloud Run facture à l'utilisation :
- **CPU** : ~0.024€ par vCPU-heure
- **Mémoire** : ~0.0025€ par GiB-heure
- **Requêtes** : ~0.40€ par million de requêtes

Pour une application avec un trafic modéré, comptez environ 5-20€ par mois.

## Sécurité

### Bonnes pratiques
1. Utilisez des secrets pour les données sensibles
2. Activez l'authentification si nécessaire
3. Configurez des règles de pare-feu appropriées
4. Surveillez les logs d'accès

### Gestion des secrets
```bash
echo -n "your-secret-value" | gcloud secrets create secret-name --data-file=-

gcloud run deploy adyen-onboarding-frontend \
  --set-secrets="SECRET_KEY=secret-name:latest"
```

## Support

En cas de problème :
1. Consultez les logs Cloud Run
2. Vérifiez la documentation Google Cloud Run
3. Contactez le support technique si nécessaire