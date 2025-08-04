import { ref, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import { AdyenApiService } from '../services/AdyenApiService.js'

export function useOnboardingProcess() {
  const toast = useToast()
  
  const steps = ref([
    {
      title: '1. Créer l\'organisation',
      description: 'Création de l\'entité légale dans Adyen',
      endpoint: 'createOrganization'
    },
    {
      title: '2. Créer le titulaire de compte',
      description: 'Création du compte holder pour l\'organisation',
      endpoint: 'createAccountHolder'
    },
    {
      title: '3. Créer le compte de balance',
      description: 'Création du compte de balance pour les transactions',
      endpoint: 'createBalanceAccount'
    },
    {
      title: '4. Créer les business lines',
      description: 'Configuration des lignes de business pour les paiements',
      endpoint: 'createBusinessLines'
    },
    {
      title: '5. Créer la boutique',
      description: 'Création du store dans le système de management',
      endpoint: 'createStore'
    },
    {
      title: '6. Configurer les méthodes de paiement',
      description: 'Configuration des méthodes de paiement acceptées',
      endpoint: 'configurePaymentMethods'
    },
    {
      title: '7. Créer le lien d\'onboarding',
      description: 'Génération du lien d\'onboarding hébergé',
      endpoint: 'createOnboardingLink'
    }
  ])

  const currentStep = ref(0)
  const results = ref([])
  const isProcessing = ref(false)
  const apiService = ref(null)
  const currentConfig = ref({})

  // Variables pour stocker les IDs créés
  const processData = reactive({
    organisationLegalEntityId: null,
    accountHolderId: null,
    balanceAccountId: null,
    businessLineId: null,
    storeId: null
  })

  const startOnboarding = async (config) => {
    try {
      isProcessing.value = true
      currentStep.value = 1
      results.value = []
      
      // Stocker la configuration actuelle
      currentConfig.value = { ...config }
      
      // Réinitialiser les données du processus
      Object.keys(processData).forEach(key => {
        processData[key] = null
      })

      // Initialiser le service API avec la configuration
      apiService.value = new AdyenApiService(config)

      toast.info('Démarrage du processus d\'onboarding...')

      // Exécuter chaque étape séquentiellement
      for (let i = 0; i < steps.value.length; i++) {
        currentStep.value = i + 1
        
        try {
          const stepResult = await executeStep(i, config)
          results.value[i] = stepResult
          
          if (!stepResult.success) {
            toast.error(`Erreur à l'étape ${i + 1}: ${stepResult.message}`)
            break
          }
          
          toast.success(`Étape ${i + 1} terminée avec succès`)
          
          // Petite pause entre les étapes pour l'UX
          await new Promise(resolve => setTimeout(resolve, 500))
          
        } catch (error) {
          console.error(`Erreur à l'étape ${i + 1}:`, error)
          results.value[i] = {
            success: false,
            error: true,
            message: error.message || 'Erreur inconnue',
            response: error.response?.data || null
          }
          toast.error(`Erreur à l'étape ${i + 1}: ${error.message}`)
          break
        }
      }

      // Vérifier si toutes les étapes ont réussi
      const allSuccess = results.value.every(result => result?.success)
      
      if (allSuccess) {
        toast.success('Processus d\'onboarding terminé avec succès!')
        currentStep.value = steps.value.length + 1
      } else {
        toast.error('Le processus d\'onboarding a échoué')
      }

    } catch (error) {
      console.error('Erreur générale:', error)
      toast.error('Erreur lors du processus d\'onboarding')
    } finally {
      isProcessing.value = false
    }
  }

  const executeStep = async (stepIndex, config) => {
    const step = steps.value[stepIndex]
    
    switch (step.endpoint) {
      case 'createOrganization':
        return await createOrganization(config)
      
      case 'createAccountHolder':
        return await createAccountHolder(config)
      
      case 'createBalanceAccount':
        return await createBalanceAccount(config)
      
      case 'createBusinessLines':
        return await createBusinessLines(config)
      
      case 'createStore':
        return await createStore(config)
      
      case 'configurePaymentMethods':
        return await configurePaymentMethods(config)
      
      case 'createOnboardingLink':
        return await createOnboardingLink(config)
      
      default:
        throw new Error(`Étape inconnue: ${step.endpoint}`)
    }
  }

  const createOrganization = async (config) => {
    const response = await apiService.value.createOrganization({
      type: "organization",
      organization: {
        legalName: config.organization.legalName,
        registrationNumber: config.organization.registrationNumber,
        vatNumber: config.organization.vatNumber,
        type: "privateCompany",
        registeredAddress: {
          city: config.organization.address.city,
          country: config.organization.address.country,
          postalCode: config.organization.address.postalCode,
          street: config.organization.address.street
        }
      },
      reference: config.organization.reference
    })

    processData.organisationLegalEntityId = response.id
    
    return {
      success: true,
      message: `Organisation créée avec l'ID: ${response.id}`,
      data: { id: response.id },
      response
    }
  }

  const createAccountHolder = async (config) => {
    if (!processData.organisationLegalEntityId) {
      throw new Error('ID de l\'organisation manquant')
    }

    const response = await apiService.value.createAccountHolder({
      legalEntityId: processData.organisationLegalEntityId,
      description: `${config.organization.legalName} Account Holder`,
      reference: config.organization.reference
    })

    processData.accountHolderId = response.id
    
    return {
      success: true,
      message: `Titulaire de compte créé avec l'ID: ${response.id}`,
      data: { id: response.id },
      response
    }
  }

  const createBalanceAccount = async (config) => {
    if (!processData.accountHolderId) {
      throw new Error('ID du titulaire de compte manquant')
    }

    const response = await apiService.value.createBalanceAccount({
      accountHolderId: processData.accountHolderId,
      description: `${config.organization.legalName} Balance Account`,
      defaultCurrencyCode: "EUR"
    })

    processData.balanceAccountId = response.id
    
    return {
      success: true,
      message: `Compte de balance créé avec l'ID: ${response.id}`,
      data: { id: response.id },
      response
    }
  }

  const createBusinessLines = async (config) => {
    if (!processData.organisationLegalEntityId) {
      throw new Error('ID de l\'organisation manquant')
    }

    const response = await apiService.value.createBusinessLines({
      service: "paymentProcessing",
      industryCode: config.business.industryCode,
      salesChannels: ["eCommerce"],
      legalEntityId: processData.organisationLegalEntityId,
      webData: [{
        webAddress: config.business.webAddress
      }]
    })

    processData.businessLineId = response.id
    
    return {
      success: true,
      message: `Business Lines créé avec l'ID: ${response.id}`,
      data: { id: response.id },
      response
    }
  }

  const createStore = async (config) => {
    if (!processData.businessLineId) {
      throw new Error('ID des business lines manquant')
    }

    const response = await apiService.value.createStore({
      merchantId: config.business.merchantId,
      description: `${config.organization.legalName} eCommerce`,
      shopperStatement: config.organization.reference,
      phoneNumber: config.business.phoneNumber,
      reference: config.organization.reference,
      businessLineIds: [processData.businessLineId],
      address: {
        country: config.organization.address.country,
        line1: config.organization.address.street,
        city: config.organization.address.city,
        postalCode: config.organization.address.postalCode
      }
    })

    processData.storeId = response.id
    
    return {
      success: true,
      message: `Boutique créée avec l'ID: ${response.id}`,
      data: { id: response.id },
      response
    }
  }

  const configurePaymentMethods = async (config) => {
    if (!processData.businessLineId || !processData.storeId) {
      throw new Error('IDs des business lines ou du store manquants')
    }

    const response = await apiService.value.configurePaymentMethods({
      businessLineId: processData.businessLineId,
      storeIds: [processData.storeId],
      type: "visa",
      currencies: ["EUR"],
      countries: [config.organization.address.country]
    }, config.business.merchantId)
    
    return {
      success: true,
      message: 'Méthodes de paiement configurées avec succès',
      data: response,
      response
    }
  }

  const createOnboardingLink = async (config) => {
    if (!processData.organisationLegalEntityId) {
      throw new Error('ID de l\'organisation manquant')
    }

    const onboardingData = {
      redirectUrl: config.onboarding.redirectUrl,
      locale: config.onboarding.locale,
      settings: {
        changeLegalEntityType: true,
        editPrefilledCountry: true,
        allowBankAccountFormatSelection: false,
        allowIntraRegionCrossBorderPayout: false
      }
    }

    // Ajouter le themeId seulement s'il est fourni
    if (config.onboarding.themeId && config.onboarding.themeId.trim()) {
      onboardingData.themeId = config.onboarding.themeId
    }

    const response = await apiService.value.createOnboardingLink(
      processData.organisationLegalEntityId,
      onboardingData
    )
    
    return {
      success: true,
      message: `Lien d'onboarding créé: ${response.hostedOnboardingUrl}`,
      data: { url: response.hostedOnboardingUrl },
      response
    }
  }

  return {
    steps,
    currentStep,
    results,
    isProcessing,
    currentConfig,
    startOnboarding
  }
}