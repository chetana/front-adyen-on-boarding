import axios from 'axios'

export class AdyenApiService {
  constructor(config) {
    this.config = config
    this.setupApiUrls()
    this.setupAxiosInstances()
  }

  setupApiUrls() {
    // Use proxy server URLs instead of direct Adyen URLs
    // In production, proxy runs on same server, so use relative URLs
    // In development, use localhost:3001
    const proxyBaseUrl = import.meta.env.VITE_PROXY_URL || 
                        (import.meta.env.PROD ? '' : 'http://localhost:3001')
    
    this.lemApiUrl = `${proxyBaseUrl}/api/adyen/lem`
    this.bclApiUrl = `${proxyBaseUrl}/api/adyen/bcl`
    this.managementApiUrl = `${proxyBaseUrl}/api/adyen/management`
    
    // Store environment for query parameter
    this.environment = this.config.environment || 'test'
  }

  setupAxiosInstances() {
    // Single instance for all APIs (proxy will handle routing)
    this.apiClient = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Intercepteurs pour la gestion des erreurs
    this.setupInterceptors()
  }

  setupInterceptors() {
    const errorHandler = (error) => {
      console.error('API Error:', error)
      
      if (error.response) {
        // Erreur de réponse du serveur
        const message = error.response.data?.message || 
                       error.response.data?.detail || 
                       error.response.data?.error ||
                       `Erreur HTTP ${error.response.status}: ${error.response.statusText}`
        
        throw new Error(message)
      } else if (error.request) {
        // Erreur de réseau
        throw new Error('Erreur de réseau: Impossible de contacter le serveur proxy')
      } else {
        // Autre erreur
        throw new Error(error.message || 'Erreur inconnue')
      }
    }

    this.apiClient.interceptors.response.use(
      response => response,
      errorHandler
    )
  }

  // Helper method to add environment and API key to requests
  getRequestConfig(apiKey) {
    return {
      params: { environment: this.environment },
      headers: { 'X-API-Key': apiKey }
    }
  }

  async createOrganization(data) {
    console.log('Creating organization:', data)
    const config = this.getRequestConfig(this.config.lemApiKey)
    const response = await this.apiClient.post(`${this.lemApiUrl}/legalEntities`, data, config)
    return response.data
  }

  async createAccountHolder(data) {
    console.log('Creating account holder:', data)
    const config = this.getRequestConfig(this.config.lemApiKey)
    const response = await this.apiClient.post(`${this.bclApiUrl}/accountHolders`, data, config)
    return response.data
  }

  async createBalanceAccount(data) {
    console.log('Creating balance account:', data)
    const config = this.getRequestConfig(this.config.lemApiKey)
    const response = await this.apiClient.post(`${this.bclApiUrl}/balanceAccounts`, data, config)
    return response.data
  }

  async createBusinessLines(data) {
    console.log('Creating business lines:', data)
    const config = this.getRequestConfig(this.config.lemApiKey)
    const response = await this.apiClient.post(`${this.lemApiUrl}/businessLines`, data, config)
    return response.data
  }

  async createStore(data) {
    console.log('Creating store:', data)
    const config = this.getRequestConfig(this.config.managementApiKey)
    const response = await this.apiClient.post(`${this.managementApiUrl}/stores`, data, config)
    return response.data
  }

  async configurePaymentMethods(data, merchantId) {
    console.log('Configuring payment methods:', data)
    const config = this.getRequestConfig(this.config.managementApiKey)
    const response = await this.apiClient.post(
      `${this.managementApiUrl}/merchants/${merchantId}/paymentMethodSettings`,
      data,
      config
    )
    return response.data
  }

  async createOnboardingLink(legalEntityId, data) {
    console.log('Creating onboarding link:', data)
    const config = this.getRequestConfig(this.config.lemApiKey)
    const response = await this.apiClient.post(
      `${this.lemApiUrl}/legalEntities/${legalEntityId}/onboardingLinks`,
      data,
      config
    )
    return response.data
  }
}