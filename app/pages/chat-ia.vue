<template>
  <div>
    <ChatIaComponent />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

// Meta dados da página
useHead({
  title: 'Chat IA - Orzy Sistemas de Finanças',
  meta: [
    {
      name: 'description',
      content: 'Converse com nossa IA especializada em finanças para obter insights e orientações personalizadas.'
    }
  ]
})
</script>