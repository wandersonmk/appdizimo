<template>
  <div class="space-y-6">
    <!-- Resumo Financeiro -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <font-awesome-icon icon="arrow-up" class="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-900 dark:text-green-100">Entradas</p>
            <p class="text-lg font-semibold text-green-900 dark:text-green-100">
              {{ formatarMoeda(totais.entradas) }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <font-awesome-icon icon="arrow-down" class="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-900 dark:text-red-100">Saídas</p>
            <p class="text-lg font-semibold text-red-900 dark:text-red-100">
              {{ formatarMoeda(totais.saidas) }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <font-awesome-icon icon="heart" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-purple-900 dark:text-purple-100">Dízimos</p>
            <p class="text-lg font-semibold text-purple-900 dark:text-purple-100">
              {{ formatarMoeda(totais.dizimos) }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <font-awesome-icon 
              :icon="totais.saldo >= 0 ? 'wallet' : 'exclamation-triangle'" 
              class="w-5 h-5"
              :class="totais.saldo >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'"
            />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-blue-900 dark:text-blue-100">Saldo</p>
            <p class="text-lg font-semibold"
               :class="totais.saldo >= 0 ? 'text-blue-900 dark:text-blue-100' : 'text-red-600 dark:text-red-400'">
              {{ formatarMoeda(totais.saldo) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-card rounded-lg border border-border p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Data Inicial</label>
          <input
            v-model="filtros.dataInicial"
            type="date"
            class="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Data Final</label>
          <input
            v-model="filtros.dataFinal"
            type="date"
            class="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Tipo</label>
          <select
            v-model="filtros.tipo"
            class="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos os tipos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
            <option value="dizimo">Dízimos</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button
          @click="limparFiltros"
          class="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
        >
          Limpar Filtros
        </button>
      </div>
    </div>

    <!-- Lista de Transações -->
    <div class="bg-card rounded-lg border border-border">
      <div class="p-4 border-b border-border">
        <h3 class="text-lg font-semibold text-foreground">Transações Financeiras</h3>
        <p class="text-sm text-muted-foreground">
          {{ relatoriosFiltrados.length }} transação(ões) encontrada(s)
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-muted/30">
              <th class="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Data</th>
              <th class="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Tipo</th>
              <th class="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Categoria</th>
              <th class="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Descrição</th>
              <th class="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Valor</th>
              <th class="text-center py-3 px-4 font-medium text-muted-foreground text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="relatoriosFiltrados.length === 0">
              <td colspan="6" class="py-8 text-center text-muted-foreground">
                <div class="flex flex-col items-center">
                  <font-awesome-icon icon="inbox" class="w-8 h-8 mb-2 text-muted-foreground/50" />
                  <p>Nenhuma transação encontrada</p>
                </div>
              </td>
            </tr>
            <tr 
              v-for="relatorio in relatoriosFiltrados" 
              :key="relatorio.id"
              class="border-b border-border/50 hover:bg-muted/30 transition-colors"
            >
              <td class="py-3 px-4 text-sm text-foreground">
                {{ formatarData(relatorio.data) }}
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getTipoClasses(relatorio.tipo)">
                  <font-awesome-icon 
                    :icon="getTipoIcon(relatorio.tipo)" 
                    class="w-3 h-3 mr-1" 
                  />
                  {{ getTipoNome(relatorio.tipo) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: relatorio.categoria_cor }"></div>
                  <span class="text-sm text-foreground">{{ relatorio.categoria_nome }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm text-foreground">
                {{ relatorio.descricao }}
              </td>
              <td class="py-3 px-4 text-right text-sm font-medium"
                  :class="getValorClasses(relatorio.tipo)">
                {{ formatarMoeda(relatorio.valor) }}
              </td>
              <td class="py-3 px-4 text-center">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getStatusClasses(relatorio.status_pagamento)">
                  {{ getStatusNome(relatorio.status_pagamento) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRelatorios } from '../composables/useRelatorios'

// Props
const props = defineProps<{
  relatorios: Array<any>
}>()

// Composable
const { calcularTotais } = useRelatorios()

// Estados reativos
const filtros = ref({
  dataInicial: '',
  dataFinal: '',
  tipo: ''
})

// Computeds
const totais = computed(() => {
  // Calcular totais com base nos relatórios filtrados
  const totaisCalculados = {
    entradas: 0,
    saidas: 0,
    dizimos: 0,
    saldo: 0
  }

  relatoriosFiltrados.value.forEach(relatorio => {
    const valor = relatorio.valor || 0
    
    switch (relatorio.tipo) {
      case 'entrada':
        totaisCalculados.entradas += valor
        break
      case 'saida':
        totaisCalculados.saidas += valor
        break
      case 'dizimo':
        totaisCalculados.dizimos += valor
        break
    }
  })

  totaisCalculados.saldo = totaisCalculados.entradas - totaisCalculados.saidas - totaisCalculados.dizimos
  
  return totaisCalculados
})

const relatoriosFiltrados = computed(() => {
  let filtrados = [...props.relatorios]

  // Filtro por tipo
  if (filtros.value.tipo) {
    filtrados = filtrados.filter(r => r.tipo === filtros.value.tipo)
  }

  // Filtro por data
  if (filtros.value.dataInicial) {
    filtrados = filtrados.filter(r => r.data >= filtros.value.dataInicial)
  }

  if (filtros.value.dataFinal) {
    filtrados = filtrados.filter(r => r.data <= filtros.value.dataFinal)
  }

  return filtrados.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
})

// Métodos
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0)
}

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const getTipoClasses = (tipo: string) => {
  switch (tipo) {
    case 'entrada':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'saida':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'dizimo':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case 'entrada':
      return 'arrow-up'
    case 'saida':
      return 'arrow-down'
    case 'dizimo':
      return 'heart'
    default:
      return 'circle'
  }
}

const getTipoNome = (tipo: string) => {
  switch (tipo) {
    case 'entrada':
      return 'Entrada'
    case 'saida':
      return 'Saída'
    case 'dizimo':
      return 'Dízimo'
    default:
      return tipo
  }
}

const getValorClasses = (tipo: string) => {
  switch (tipo) {
    case 'entrada':
      return 'text-green-600 dark:text-green-400'
    case 'saida':
      return 'text-red-600 dark:text-red-400'
    case 'dizimo':
      return 'text-purple-600 dark:text-purple-400'
    default:
      return 'text-foreground'
  }
}

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'pago':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'vencido':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

const getStatusNome = (status: string) => {
  switch (status) {
    case 'pago':
      return 'Pago'
    case 'pendente':
      return 'Pendente'
    case 'vencido':
      return 'Vencido'
    default:
      return status || 'Indefinido'
  }
}

const limparFiltros = () => {
  filtros.value = {
    dataInicial: '',
    dataFinal: '',
    tipo: ''
  }
}
</script>