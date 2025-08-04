<template>
  <div class="card">
    <div class="card-header">
      <h5 class="card-title mb-0">
        <i class="fas fa-cog me-2"></i>
        Configuration
      </h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <!-- API Configuration -->
        <div class="mb-4">
          <h6 class="text-muted mb-3">Configuration API</h6>
          
          <div class="mb-3">
            <label for="lemApiKey" class="form-label">
              <i class="fas fa-key me-1"></i>
              Clé API LEM
            </label>
            <input
              type="text"
              class="form-control"
              id="lemApiKey"
              v-model="config.lemApiKey"
              placeholder="Votre clé API LEM"
              required
            />
          </div>

          <div class="mb-3">
            <label for="managementApiKey" class="form-label">
              <i class="fas fa-key me-1"></i>
              Clé API Management
            </label>
            <input
              type="text"
              class="form-control"
              id="managementApiKey"
              v-model="config.managementApiKey"
              placeholder="Votre clé API Management"
              required
            />
          </div>

          <div class="mb-3">
            <label for="environment" class="form-label">
              <i class="fas fa-server me-1"></i>
              Environnement
            </label>
            <select class="form-select" id="environment" v-model="config.environment">
              <option value="test">Test</option>
              <option value="live">Live</option>
            </select>
          </div>
        </div>

        <!-- Organization Data -->
        <div class="mb-4">
          <h6 class="text-muted mb-3">Données de l'organisation</h6>
          
          <div class="mb-3">
            <label for="legalName" class="form-label">Nom légal</label>
            <input
              type="text"
              class="form-control"
              id="legalName"
              v-model="config.organization.legalName"
              placeholder="ex: CompanyName Corporation"
              required
            />
          </div>

          <div class="mb-3">
            <label for="registrationNumber" class="form-label">Numéro d'enregistrement</label>
            <input
              type="text"
              class="form-control"
              id="registrationNumber"
              v-model="config.organization.registrationNumber"
              placeholder="ex: 123456789"
              required
            />
          </div>

          <div class="mb-3">
            <label for="vatNumber" class="form-label">Numéro TVA</label>
            <input
              type="text"
              class="form-control"
              id="vatNumber"
              v-model="config.organization.vatNumber"
              placeholder="ex: FR12345678901"
              required
            />
          </div>

          <div class="mb-3">
            <label for="reference" class="form-label">Référence</label>
            <input
              type="text"
              class="form-control"
              id="reference"
              v-model="config.organization.reference"
              placeholder="ex: companyname-onboarding-2025"
              required
            />
          </div>
        </div>

        <!-- Address -->
        <div class="mb-4">
          <h6 class="text-muted mb-3">Adresse</h6>
          
          <div class="mb-3">
            <label for="street" class="form-label">Rue</label>
            <input
              type="text"
              class="form-control"
              id="street"
              v-model="config.organization.address.street"
              placeholder="ex: 123 Avenue des Champs-Élysées"
              required
            />
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="city" class="form-label">Ville</label>
                <input
                  type="text"
                  class="form-control"
                  id="city"
                  v-model="config.organization.address.city"
                  placeholder="ex: Paris"
                  required
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="postalCode" class="form-label">Code postal</label>
                <input
                  type="text"
                  class="form-control"
                  id="postalCode"
                  v-model="config.organization.address.postalCode"
                  placeholder="ex: 75001"
                  required
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="country" class="form-label">Pays</label>
            <select class="form-select" id="country" v-model="config.organization.address.country">
              <option value="FR">France</option>
              <option value="BE">Belgique</option>
              <option value="ES">Espagne</option>
              <option value="IT">Italie</option>
              <option value="DE">Allemagne</option>
            </select>
          </div>
        </div>

        <!-- Business Information -->
        <div class="mb-4">
          <h6 class="text-muted mb-3">Informations business</h6>
          
          <div class="mb-3">
            <label for="industryCode" class="form-label">Code industrie</label>
            <input
              type="text"
              class="form-control"
              id="industryCode"
              v-model="config.business.industryCode"
              placeholder="ex: 42344"
              required
            />
          </div>

          <div class="mb-3">
            <label for="webAddress" class="form-label">Site web</label>
            <input
              type="url"
              class="form-control"
              id="webAddress"
              v-model="config.business.webAddress"
              placeholder="ex: https://www.companyname.com/"
              required
            />
          </div>

          <div class="mb-3">
            <label for="merchantId" class="form-label">Merchant ID</label>
            <input
              type="text"
              class="form-control"
              id="merchantId"
              v-model="config.business.merchantId"
              placeholder="ex: DJUSTPayECOM"
              required
            />
          </div>

          <div class="mb-3">
            <label for="phoneNumber" class="form-label">Téléphone</label>
            <input
              type="tel"
              class="form-control"
              id="phoneNumber"
              v-model="config.business.phoneNumber"
              placeholder="ex: +33123456789"
              required
            />
          </div>
        </div>

        <!-- Onboarding Settings -->
        <div class="mb-4">
          <h6 class="text-muted mb-3">Paramètres d'onboarding</h6>
          
          <div class="mb-3">
            <label for="themeId" class="form-label">Theme ID</label>
            <input
              type="text"
              class="form-control"
              id="themeId"
              v-model="config.onboarding.themeId"
              placeholder="Optionnel"
            />
          </div>

          <div class="mb-3">
            <label for="redirectUrl" class="form-label">URL de redirection</label>
            <input
              type="url"
              class="form-control"
              id="redirectUrl"
              v-model="config.onboarding.redirectUrl"
              placeholder="ex: https://your-redirect-url.com/"
              required
            />
          </div>

          <div class="mb-3">
            <label for="locale" class="form-label">Locale</label>
            <select class="form-select" id="locale" v-model="config.onboarding.locale">
              <option value="fr-FR">Français</option>
              <option value="en-US">English</option>
              <option value="es-ES">Español</option>
              <option value="de-DE">Deutsch</option>
            </select>
          </div>
        </div>

        <!-- Test Data Button -->
        <div class="d-grid mb-3">
          <button 
            type="button" 
            class="btn btn-outline-secondary"
            @click="fillTestData"
            :disabled="isLoading"
          >
            <i class="fas fa-flask me-2"></i>
            Remplir avec des données de test
          </button>
        </div>

        <div class="d-grid">
          <button 
            type="submit" 
            class="btn btn-primary btn-lg"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else class="fas fa-play me-2"></i>
            {{ isLoading ? 'Traitement en cours...' : 'Démarrer l\'onboarding' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'ConfigurationPanel',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['start-onboarding'],
  setup(props, { emit }) {
    const config = reactive({
      lemApiKey: '',
      managementApiKey: '',
      environment: 'test',
      organization: {
        legalName: '',
        registrationNumber: '',
        vatNumber: '',
        reference: '',
        address: {
          street: '',
          city: '',
          postalCode: '',
          country: 'FR'
        }
      },
      business: {
        industryCode: '',
        webAddress: '',
        merchantId: 'DJUSTPayECOM',
        phoneNumber: ''
      },
      onboarding: {
        themeId: '',
        redirectUrl: '',
        locale: 'fr-FR'
      }
    })

    const handleSubmit = () => {
      emit('start-onboarding', config)
    }

    const fillTestData = () => {
      // Remplir avec les données de test fournies
      // ATTENTION: Remplacez ces placeholders par vos vraies clés API de test
      config.lemApiKey = 'YOUR_LEM_API_KEY_HERE'
      config.managementApiKey = 'YOUR_MANAGEMENT_API_KEY_HERE'
      config.environment = 'test'
      
      // Données de l'organisation
      config.organization.legalName = 'TEST COMPANY'
      config.organization.registrationNumber = '12345678901234'
      config.organization.vatNumber = 'FR12345678901'
      config.organization.reference = 'test-company'
      
      // Adresse
      config.organization.address.street = '10 Rue de la Boétie'
      config.organization.address.city = 'Paris'
      config.organization.address.postalCode = '75009'
      config.organization.address.country = 'FR'
      
      // Informations business
      config.business.webAddress = 'https://example.com/'
      config.business.phoneNumber = '+33102030405'
      config.business.industryCode = '42344' // Code par défaut
      config.business.merchantId = 'DJUSTPayECOM' // Merchant ID par défaut
      
      // Paramètres d'onboarding
      config.onboarding.redirectUrl = 'https://your-redirect-url.com/'
      config.onboarding.locale = 'fr-FR'
    }

    return {
      config,
      handleSubmit,
      fillTestData
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.form-label {
  font-weight: 500;
  color: #495057;
}

.text-muted {
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>