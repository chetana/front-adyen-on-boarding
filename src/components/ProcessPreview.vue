<template>
  <div class="card mb-4">
    <div class="card-header">
      <h5 class="card-title mb-0">
        <i class="fas fa-sitemap me-2"></i>
        Aperçu du processus d'onboarding
      </h5>
    </div>
    <div class="card-body">
      <div class="alert alert-info mb-3">
        <i class="fas fa-info-circle me-2"></i>
        <strong>Processus automatisé :</strong> 7 étapes séquentielles seront exécutées pour créer votre configuration Adyen complète.
      </div>

      <!-- Mermaid Diagram -->
      <div class="mermaid-container mb-4">
        <div id="mermaid-diagram" class="text-center"></div>
      </div>

      <!-- API Endpoints Preview -->
      <div class="api-preview">
        <h6 class="text-muted mb-3">
          <i class="fas fa-code me-2"></i>
          Endpoints API qui seront appelés
        </h6>
        
        <div class="row">
          <div class="col-md-6">
            <div class="endpoint-group mb-3">
              <h6 class="endpoint-title">
                <i class="fas fa-building me-1"></i>
                API Legal Entity Management (LEM)
              </h6>
              <div class="endpoint-item">
                <span class="badge bg-success me-2">POST</span>
                <code>{{ lemApiUrl }}/legalEntities</code>
                <small class="text-muted d-block">Création de l'organisation</small>
              </div>
              <div class="endpoint-item">
                <span class="badge bg-success me-2">POST</span>
                <code>{{ lemApiUrl }}/businessLines</code>
                <small class="text-muted d-block">Création des business lines</small>
              </div>
              <div class="endpoint-item">
                <span class="badge bg-success me-2">POST</span>
                <code>{{ lemApiUrl }}/legalEntities/{id}/onboardingLinks</code>
                <small class="text-muted d-block">Génération du lien d'onboarding</small>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="endpoint-group mb-3">
              <h6 class="endpoint-title">
                <i class="fas fa-credit-card me-1"></i>
                API Balance Platform (BCL)
              </h6>
              <div class="endpoint-item">
                <span class="badge bg-primary me-2">POST</span>
                <code>{{ bclApiUrl }}/accountHolders</code>
                <small class="text-muted d-block">Création du titulaire de compte</small>
              </div>
              <div class="endpoint-item">
                <span class="badge bg-primary me-2">POST</span>
                <code>{{ bclApiUrl }}/balanceAccounts</code>
                <small class="text-muted d-block">Création du compte de balance</small>
              </div>
            </div>

            <div class="endpoint-group mb-3">
              <h6 class="endpoint-title">
                <i class="fas fa-cogs me-1"></i>
                API Management
              </h6>
              <div class="endpoint-item">
                <span class="badge bg-warning me-2">POST</span>
                <code>{{ managementApiUrl }}/stores</code>
                <small class="text-muted d-block">Création de la boutique</small>
              </div>
              <div class="endpoint-item">
                <span class="badge bg-warning me-2">POST</span>
                <code>{{ managementApiUrl }}/merchants/{id}/paymentMethodSettings</code>
                <small class="text-muted d-block">Configuration des méthodes de paiement</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Environment Info -->
      <div class="environment-info mt-4">
        <h6 class="text-muted mb-3">
          <i class="fas fa-server me-2"></i>
          Configuration d'environnement
        </h6>
        <div class="row">
          <div class="col-md-4">
            <div class="info-item">
              <strong>Environnement :</strong>
              <span class="badge" :class="environment === 'live' ? 'bg-danger' : 'bg-success'">
                {{ environment.toUpperCase() }}
              </span>
            </div>
          </div>
          <div class="col-md-4">
            <div class="info-item">
              <strong>Devise :</strong>
              <span class="badge bg-info">EUR</span>
            </div>
          </div>
          <div class="col-md-4">
            <div class="info-item">
              <strong>Méthode de paiement :</strong>
              <span class="badge bg-secondary">Visa</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Flow Summary -->
      <div class="data-flow mt-4">
        <h6 class="text-muted mb-3">
          <i class="fas fa-exchange-alt me-2"></i>
          Flux de données
        </h6>
        <div class="flow-steps">
          <div class="flow-step">
            <i class="fas fa-arrow-right text-primary"></i>
            <span>Organisation → Account Holder → Balance Account</span>
          </div>
          <div class="flow-step">
            <i class="fas fa-arrow-right text-success"></i>
            <span>Business Lines → Store → Payment Methods</span>
          </div>
          <div class="flow-step">
            <i class="fas fa-arrow-right text-warning"></i>
            <span>Onboarding Link → Interface utilisateur finale</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, nextTick } from 'vue'

export default {
  name: 'ProcessPreview',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const environment = computed(() => props.config.environment || 'test')
    
    const baseUrls = computed(() => {
      const urls = {
        test: {
          lem: 'https://kyc-test.adyen.com/lem/v3',
          bcl: 'https://balanceplatform-api-test.adyen.com/bcl/v2',
          management: 'https://management-test.adyen.com/v3'
        },
        live: {
          lem: 'https://kyc-live.adyen.com/lem/v3',
          bcl: 'https://balanceplatform-api-live.adyen.com/bcl/v2',
          management: 'https://management-live.adyen.com/v3'
        }
      }
      return urls[environment.value] || urls.test
    })

    const lemApiUrl = computed(() => baseUrls.value.lem)
    const bclApiUrl = computed(() => baseUrls.value.bcl)
    const managementApiUrl = computed(() => baseUrls.value.management)

    const renderMermaidDiagram = async () => {
      // Dynamically import mermaid
      const mermaid = await import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs')
      
      mermaid.default.initialize({
        startOnLoad: false,
        theme: 'default',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        }
      })

      const diagramDefinition = `
        flowchart TD
          A[🏢 Créer Organisation<br/>Legal Entity] --> B[👤 Créer Account Holder<br/>Titulaire de compte]
          B --> C[💰 Créer Balance Account<br/>Compte de balance]
          C --> D[🏪 Créer Business Lines<br/>Lignes de business]
          D --> E[🛍️ Créer Store<br/>Boutique]
          E --> F[💳 Configurer Payment Methods<br/>Méthodes de paiement]
          F --> G[🔗 Créer Onboarding Link<br/>Lien d'onboarding]
          
          A -.-> H[API LEM<br/>Legal Entity Management]
          B -.-> I[API BCL<br/>Balance Platform]
          C -.-> I
          D -.-> H
          E -.-> J[API Management<br/>Store Management]
          F -.-> J
          G -.-> H
          
          style A fill:#e1f5fe
          style B fill:#e8f5e8
          style C fill:#e8f5e8
          style D fill:#e1f5fe
          style E fill:#fff3e0
          style F fill:#fff3e0
          style G fill:#f3e5f5
          
          style H fill:#bbdefb
          style I fill:#c8e6c8
          style J fill:#ffcc80
      `

      const element = document.getElementById('mermaid-diagram')
      if (element) {
        element.innerHTML = ''
        const { svg } = await mermaid.default.render('process-diagram', diagramDefinition)
        element.innerHTML = svg
      }
    }

    onMounted(async () => {
      await nextTick()
      await renderMermaidDiagram()
    })

    return {
      environment,
      lemApiUrl,
      bclApiUrl,
      managementApiUrl
    }
  }
}
</script>

<style scoped>
.mermaid-container {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
}

.endpoint-group {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  border-left: 4px solid #007bff;
}

.endpoint-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.endpoint-item {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #e9ecef;
}

.endpoint-item code {
  font-size: 0.875rem;
  color: #495057;
  background-color: transparent;
}

.endpoint-item small {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.environment-info {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
}

.info-item {
  margin-bottom: 0.5rem;
}

.data-flow {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
}

.flow-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #e9ecef;
}

.flow-step i {
  font-size: 0.875rem;
}

.badge {
  font-size: 0.75rem;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

@media (max-width: 768px) {
  .mermaid-container {
    padding: 0.5rem;
  }
  
  .endpoint-group {
    margin-bottom: 1rem;
  }
  
  .flow-steps {
    gap: 0.25rem;
  }
}

/* Mermaid diagram responsive */
:deep(.mermaid svg) {
  max-width: 100%;
  height: auto;
}
</style>