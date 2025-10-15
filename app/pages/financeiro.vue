<script setup lang="ts">
// Aplica middleware de autenticação
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

const isLoading = ref(true)
const error = ref('')

onMounted(() => {
  // Simular carregamento inicial
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<template>
  <div>
    <!-- Loading inicial -->
    <AppLoading 
      v-if="isLoading" 
      title="Carregando Finanças"
      description="Preparando seu painel financeiro..."
    />
    <!-- Componente de Finanças -->
    <div v-else class="space-y-6">
      <FinancasManager />
      <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    </div>
  </div>
</template>
