<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-primary mb-4">
      <div class="container">
        <span class="navbar-brand mb-0 h1">
          <i class="fas fa-credit-card me-2"></i>
          Djust Pay - Onboarding Adyen
        </span>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-5 col-xl-4">
          <ConfigurationPanel 
            @start-onboarding="startOnboarding"
            :is-loading="isProcessing"
          />
        </div>
        <div class="col-lg-7 col-xl-8">
          <ProcessFlow 
            :steps="steps"
            :current-step="currentStep"
            :results="results"
            :is-processing="isProcessing"
            :config="currentConfig"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConfigurationPanel from './components/ConfigurationPanel.vue'
import ProcessFlow from './components/ProcessFlow.vue'
import { useOnboardingProcess } from './composables/useOnboardingProcess.js'

export default {
  name: 'App',
  components: {
    ConfigurationPanel,
    ProcessFlow
  },
  setup() {
    const {
      steps,
      currentStep,
      results,
      isProcessing,
      currentConfig,
      startOnboarding
    } = useOnboardingProcess()

    return {
      steps,
      currentStep,
      results,
      isProcessing,
      currentConfig,
      startOnboarding
    }
  }
}
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.step-card {
  transition: all 0.3s ease;
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

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.result-json {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  max-height: 200px;
  overflow-y: auto;
}
</style>