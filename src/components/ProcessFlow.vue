<template>
  <div>
    <!-- Process Preview -->
    <ProcessPreview 
      v-if="showPreview" 
      :config="config" 
      class="mb-4"
    />

    <!-- Preview Toggle Button -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">
        <i class="fas fa-tasks me-2"></i>
        Processus d'onboarding
      </h5>
      <button 
        type="button" 
        class="btn btn-outline-info btn-sm"
        @click="togglePreview"
      >
        <i class="fas" :class="showPreview ? 'fa-eye-slash' : 'fa-eye'"></i>
        {{ showPreview ? 'Masquer l\'aperçu' : 'Voir l\'aperçu' }}
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div v-if="!isProcessing && currentStep === 0" class="text-center text-muted py-5">
          <i class="fas fa-play-circle fa-3x mb-3"></i>
          <p>Configurez les paramètres et cliquez sur "Démarrer l'onboarding" pour commencer</p>
        </div>

        <div v-else>
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="step-card card mb-3"
            :class="{
              'active': currentStep === index + 1,
              'completed': results[index]?.success,
              'error': results[index]?.error
            }"
          >
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="step-icon me-3">
                  <span 
                    v-if="currentStep === index + 1 && isProcessing"
                    class="spinner-border spinner-border-sm text-primary"
                    role="status"
                  ></span>
                  <i 
                    v-else-if="results[index]?.success"
                    class="fas fa-check-circle text-success"
                  ></i>
                  <i 
                    v-else-if="results[index]?.error"
                    class="fas fa-times-circle text-danger"
                  ></i>
                  <i 
                    v-else
                    class="fas fa-circle text-muted"
                  ></i>
                </div>
                
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ step.title }}</h6>
                  <p class="text-muted mb-0 small">{{ step.description }}</p>
                </div>

                <div class="step-status">
                  <span 
                    v-if="currentStep === index + 1 && isProcessing"
                    class="badge bg-primary"
                  >
                    En cours...
                  </span>
                  <span 
                    v-else-if="results[index]?.success"
                    class="badge bg-success"
                  >
                    Terminé
                  </span>
                  <span 
                    v-else-if="results[index]?.error"
                    class="badge bg-danger"
                  >
                    Erreur
                  </span>
                  <span 
                    v-else-if="currentStep > index + 1"
                    class="badge bg-secondary"
                  >
                    En attente
                  </span>
                </div>
              </div>

              <!-- Résultat de l'étape -->
              <div v-if="results[index]" class="mt-3">
                <div v-if="results[index].success" class="alert alert-success mb-2">
                  <i class="fas fa-check me-2"></i>
                  <strong>Succès:</strong> {{ results[index].message }}
                  <div v-if="results[index].data" class="mt-2">
                    <small class="text-muted">ID créé: </small>
                    <code>{{ results[index].data.id || results[index].data }}</code>
                  </div>
                </div>

                <div v-if="results[index].error" class="alert alert-danger mb-2">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  <strong>Erreur:</strong> {{ results[index].message }}
                </div>

                <!-- Détails de la réponse -->
                <div v-if="results[index].response && showDetails[index]" class="mt-2">
                  <div class="result-json">
                    <pre>{{ JSON.stringify(results[index].response, null, 2) }}</pre>
                  </div>
                </div>

                <button 
                  v-if="results[index].response"
                  @click="toggleDetails(index)"
                  class="btn btn-sm btn-outline-secondary mt-2"
                >
                  <i class="fas" :class="showDetails[index] ? 'fa-eye-slash' : 'fa-eye'"></i>
                  {{ showDetails[index] ? 'Masquer' : 'Voir' }} les détails
                </button>
              </div>
            </div>
          </div>

          <!-- Résultat final -->
          <div v-if="currentStep > steps.length && !isProcessing" class="mt-4">
            <div class="alert alert-info">
              <h6 class="alert-heading">
                <i class="fas fa-info-circle me-2"></i>
                Processus terminé
              </h6>
              <p class="mb-0">
                L'onboarding Adyen est terminé. 
                <span v-if="onboardingLink">
                  Voici le lien d'onboarding généré :
                  <br>
                  <a :href="onboardingLink" target="_blank" class="btn btn-primary btn-sm mt-2">
                    <i class="fas fa-external-link-alt me-1"></i>
                    Ouvrir le lien d'onboarding
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import ProcessPreview from './ProcessPreview.vue'

export default {
  name: 'ProcessFlow',
  components: {
    ProcessPreview
  },
  props: {
    steps: {
      type: Array,
      required: true
    },
    currentStep: {
      type: Number,
      default: 0
    },
    results: {
      type: Array,
      default: () => []
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const showDetails = ref({})
    const showPreview = ref(false)

    const onboardingLink = computed(() => {
      const lastResult = props.results[props.results.length - 1]
      return lastResult?.response?.hostedOnboardingUrl || null
    })

    const toggleDetails = (index) => {
      showDetails.value[index] = !showDetails.value[index]
    }

    const togglePreview = () => {
      showPreview.value = !showPreview.value
    }

    return {
      showDetails,
      showPreview,
      onboardingLink,
      toggleDetails,
      togglePreview
    }
  }
}
</script>

<style scoped>
.step-card {
  transition: all 0.3s ease;
  border: 1px solid #dee2e6;
}

.step-card.active {
  border-left: 4px solid #007bff;
  background-color: #e3f2fd;
}

.step-card.completed {
  border-left: 4px solid #28a745;
  background-color: #d4edda;
}

.step-card.error {
  border-left: 4px solid #dc3545;
  background-color: #f8d7da;
}

.step-icon {
  width: 24px;
  text-align: center;
}

.result-json {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  max-height: 300px;
  overflow-y: auto;
}

.result-json pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.badge {
  font-size: 0.75rem;
}

.alert {
  border: none;
  border-radius: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>