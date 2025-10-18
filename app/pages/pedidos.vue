<script setup lang="ts">
// Aplica middleware de autenticação
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

// Estado de carregamento
const isLoading = ref(true)
const loadingError = ref(false)
const { isLoading: authLoading } = useAuth()

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
    console.error('❌ Erro ao carregar pedidos:', error)
    loadingError.value = true
    isLoading.value = false
  }
})

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
      title="Carregando Pedidos" 
      description="Preparando gerenciamento de pedidos..."
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
    
    <!-- Página de Pedidos quando carregado -->
    <PedidosManager v-else />
  </div>
</template>
