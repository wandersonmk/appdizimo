<script setup lang="ts">
// Aplica middleware de autenticação
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

// Estado de carregamento
const isLoading = ref(true)
const loadingError = ref(false)
let authLoading = ref(true)

if (process.client) {
  const { isLoading: _authLoading } = useAuth()
  authLoading = _authLoading

  onMounted(async () => {
    try {
      const startTime = Date.now()
      const maxWaitTime = 10000
      
      while (authLoading.value) {
        if (Date.now() - startTime > maxWaitTime) {
          console.error('⏱️ Timeout: Loading demorou mais de 10 segundos')
          loadingError.value = true
          isLoading.value = false
          return
        }
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
      isLoading.value = false
    } catch (error) {
      console.error('❌ Erro ao carregar ajuda:', error)
      loadingError.value = true
      isLoading.value = false
    }
  })
}

const clearCacheAndReload = () => {
  if (process.client) {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }
}

const reloadPage = () => {
  if (process.client) {
    window.location.reload()
  }
}
</script>

<template>
  <div>
    <!-- Loading enquanto carrega -->
    <AppLoading 
      v-if="isLoading && !loadingError" 
      title="Carregando Ajuda"
      description="Preparando a central de ajuda..."
    />
    
    <!-- Erro de loading -->
    <div v-else-if="loadingError" class="min-h-screen flex items-center justify-center p-4 bg-background">
      <div class="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center">
        <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-foreground mb-2">Ops! Algo deu errado</h2>
        <p class="text-muted-foreground mb-6">O aplicativo demorou muito para carregar.</p>
        <div class="space-y-3">
          <button @click="clearCacheAndReload" class="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors">
            🔄 Limpar Cache e Recarregar
          </button>
          <button @click="reloadPage" class="w-full py-3 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-semibold transition-colors">
            ↻ Apenas Recarregar
          </button>
        </div>
      </div>
    </div>
    
    <!-- Página de Ajuda quando carregado -->
    <div v-else class="space-y-6">
      <!-- Componente de ajuda (client-only) -->
      <ClientOnly>
        <AjudaManager />
        <template #fallback>
          <div class="bg-card border border-border rounded-lg p-6">
            <div class="flex items-center justify-center h-64">
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-muted-foreground animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-foreground mb-2">Carregando Ajuda</h3>
                <p class="text-muted-foreground">Preparando a interface...</p>
              </div>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>
