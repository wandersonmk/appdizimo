<script setup lang="ts">
import { onMounted } from 'vue'
import { useRelatorios } from '../composables/useRelatorios'

// Aplica middleware de autenticação
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

const { relatorios, isLoading, error, fetchRelatorios } = useRelatorios()

onMounted(async () => {
  try {
    await fetchRelatorios()
  } catch (e) {
    console.error('Erro ao carregar relatórios:', e)
  }
})
</script>

<template>
  <div>
    <!-- Loading state -->
    <AppLoading 
      v-if="isLoading" 
      title="Carregando Relatórios"
      description="Preparando relatórios financeiros..."
    />
    
    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-md mx-auto">
        <font-awesome-icon icon="exclamation-triangle" class="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      </div>
    </div>
    
    <!-- Content -->
    <div v-else>
      <RelatoriosFinanceiros :relatorios="relatorios" />
    </div>
  </div>
</template>
