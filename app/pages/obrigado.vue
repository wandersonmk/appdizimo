<script setup lang="ts">
// Página acessível independente de autenticação
// Removido middleware para permitir acesso após cadastro

// Meta tags para SEO
useHead({
  title: 'Obrigado - Orzy',
  meta: [
    { name: 'description', content: 'Obrigado por se cadastrar no Orzy Sistemas de Finanças' }
  ]
})

definePageMeta({
  layout: 'auth'
})
</script>

<template>
  <ThankYouCard />
</template>
