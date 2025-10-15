<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFinancas } from '../composables/useFinancas'
import { useCurrencyMask } from '../composables/useCurrencyMask'

// Props (se necessário no futuro)
interface Props {
  // Para expansões futuras
}
const props = defineProps<Props>()

// Composable de finanças
const { 
  transacoes,
  categorias,
  isLoading,
  errorMessage,
  resumoFinanceiro,
  categoriasEntrada,
  categoriasSaida,
  despesasVencidas,
  despesasVencendoHoje,
  fetchCategorias,
  fetchTransacoes,
  adicionarEntrada,
  adicionarDespesa,
  adicionarDespesaAvancada,
  marcarComoPago,
  estornarPagamento,
  formatarMoeda,
  formatarData,
  clearError
} = useFinancas()

// Composable de máscara de moeda
const { formatCurrency } = useCurrencyMask()

// Estados locais
const showAddEntradaModal = ref(false)
const showAddDespesaModal = ref(false)
const filtroTipo = ref<'todas' | 'entrada' | 'saida' | 'dizimo'>('todas')
const filtroDataInicio = ref('')
const filtroDataFim = ref('')

// Form para nova entrada
const novaEntrada = ref({
  categoria: '',
  descricao: '',
  valor: 0,
  valorFormatado: '',
  data: new Date().toISOString().split('T')[0]
})

// Form para nova despesa
const novaDespesa = ref({
  categoria: '',
  descricao: '',
  valor: 0,
  valorFormatado: '',
  data_vencimento: new Date().toISOString().split('T')[0],
  tipo_despesa: 'unica' as 'unica' | 'recorrente' | 'parcelada',
  total_parcelas: 2,
  frequencia_recorrencia: 'mensal' as 'mensal' | 'trimestral' | 'semestral' | 'anual',
  observacoes: ''
})

// Funções
const resetEntradaForm = () => {
  novaEntrada.value = {
    categoria: '',
    descricao: '',
    valor: 0,
    valorFormatado: '',
    data: new Date().toISOString().split('T')[0]
  }
}

const resetDespesaForm = () => {
  novaDespesa.value = {
    categoria: '',
    descricao: '',
    valor: 0,
    valorFormatado: '',
    data_vencimento: new Date().toISOString().split('T')[0],
    tipo_despesa: 'unica',
    total_parcelas: 2,
    frequencia_recorrencia: 'mensal',
    observacoes: ''
  }
}

// Funções de manipulação de moeda
const { applyCurrencyMask, parseCurrencyValue } = useCurrencyMask()

const onEntradaValorInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const maskedValue = applyCurrencyMask(target.value)
  
  // Atualiza o valor formatado
  novaEntrada.value.valorFormatado = maskedValue
  target.value = maskedValue
  
  // Extrai o valor numérico
  novaEntrada.value.valor = parseCurrencyValue(maskedValue)
}

const onDespesaValorInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const maskedValue = applyCurrencyMask(target.value)
  
  // Atualiza o valor formatado
  novaDespesa.value.valorFormatado = maskedValue
  target.value = maskedValue
  
  // Extrai o valor numérico
  novaDespesa.value.valor = parseCurrencyValue(maskedValue)
}

const handleSubmitEntrada = async () => {
  if (!novaEntrada.value.categoria || !novaEntrada.value.descricao || novaEntrada.value.valor <= 0 || !novaEntrada.value.data) {
    return
  }
  
  try {
    await adicionarEntrada({
      tipo: 'entrada',
      categoria: novaEntrada.value.categoria,
      descricao: novaEntrada.value.descricao,
      valor: novaEntrada.value.valor,
      data: novaEntrada.value.data
    })
    showAddEntradaModal.value = false
    resetEntradaForm()
  } catch (error) {
    console.error('Erro ao adicionar entrada:', error)
  }
}

const handleSubmitDespesa = async () => {
  // Validações básicas
  if (!novaDespesa.value.categoria || !novaDespesa.value.descricao || novaDespesa.value.valor <= 0 || !novaDespesa.value.data_vencimento) {
    return
  }
  
  // Validações específicas por tipo
  if (novaDespesa.value.tipo_despesa === 'parcelada' && (!novaDespesa.value.total_parcelas || novaDespesa.value.total_parcelas < 2)) {
    return
  }
  
  if (novaDespesa.value.tipo_despesa === 'recorrente' && !novaDespesa.value.frequencia_recorrencia) {
    return
  }
  
  try {
    await adicionarDespesaAvancada(novaDespesa.value)
    showAddDespesaModal.value = false
    resetDespesaForm()
  } catch (error) {
    console.error('Erro ao adicionar despesa:', error)
  }
}

const aplicarFiltros = async () => {
  await fetchTransacoes({
    dataInicio: filtroDataInicio.value || undefined,
    dataFim: filtroDataFim.value || undefined,
    tipo: filtroTipo.value === 'todas' ? undefined : filtroTipo.value
  })
}

const limparFiltros = async () => {
  filtroTipo.value = 'todas'
  filtroDataInicio.value = ''
  filtroDataFim.value = ''
  await fetchTransacoes()
}

// Inicialização
onMounted(async () => {
  await fetchCategorias()
  await fetchTransacoes()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="relative bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl p-8 shadow-lg border border-gray-700/50">
      <div class="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full blur-2xl"></div>
      <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div class="flex items-center gap-4 mb-2">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <font-awesome-icon icon="dollar-sign" class="text-white text-lg" />
            </div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
              Finanças
            </h1>
          </div>
          <p class="text-gray-300 font-medium">💰 Gerencie suas receitas e despesas com dízimo automático</p>
          <p class="text-gray-400 text-sm mt-1">⛪ 10% de cada entrada é automaticamente separado como dízimo</p>
        </div>
        <div class="flex gap-3 shrink-0">
          <AppButton 
            @click="showAddEntradaModal = true" 
            class="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <font-awesome-icon icon="plus" class="mr-2" />
            💰 Nova Entrada
          </AppButton>
          <AppButton 
            @click="showAddDespesaModal = true" 
            class="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <font-awesome-icon icon="calendar-alt" class="mr-2" />
            📅 Nova Despesa
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Cards de Resumo -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total de Entradas -->
      <div class="relative bg-gradient-to-br from-card via-emerald-950/10 to-card text-card-foreground rounded-lg border border-emerald-800/20 shadow-sm hover:shadow-md hover:shadow-emerald-500/10 transition-all duration-300 p-6 group overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400 mb-1">Total Entradas</p>
            <p class="text-2xl font-bold text-foreground">{{ formatCurrency(resumoFinanceiro.totalEntradas) }}</p>
            <p class="text-xs text-emerald-600 mt-1">💰 Receitas do período</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
            <font-awesome-icon icon="arrow-up" class="text-white text-2xl drop-shadow-lg" />
          </div>
        </div>
      </div>

      <!-- Total de Saídas -->
      <div class="relative bg-gradient-to-br from-card via-red-950/10 to-card text-card-foreground rounded-lg border border-red-800/20 shadow-sm hover:shadow-md hover:shadow-red-500/10 transition-all duration-300 p-6 group overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400 mb-1">Total Saídas</p>
            <p class="text-2xl font-bold text-foreground">{{ formatCurrency(resumoFinanceiro.totalSaidas) }}</p>
            <p class="text-xs text-red-600 mt-1">💸 Despesas do período</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
            <font-awesome-icon icon="arrow-down" class="text-white text-2xl drop-shadow-lg" />
          </div>
        </div>
      </div>

      <!-- Total de Dízimo -->
      <div class="relative bg-gradient-to-br from-card via-amber-950/10 to-card text-card-foreground rounded-lg border border-amber-800/20 shadow-sm hover:shadow-md hover:shadow-amber-500/10 transition-all duration-300 p-6 group overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400 mb-1">Total Dízimo</p>
            <p class="text-2xl font-bold text-foreground">{{ formatCurrency(resumoFinanceiro.totalDizimo) }}</p>
            <p class="text-xs text-amber-600 mt-1">⛪ 10% das entradas</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
            <font-awesome-icon icon="church" class="text-white text-2xl drop-shadow-lg" />
          </div>
        </div>
      </div>

      <!-- Saldo Atual -->
      <div class="relative bg-gradient-to-br from-card via-indigo-950/10 to-card text-card-foreground rounded-lg border border-indigo-800/20 shadow-sm hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300 p-6 group overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400 mb-1">Saldo Atual</p>
            <p class="text-2xl font-bold" :class="resumoFinanceiro.saldoAtual >= 0 ? 'text-foreground' : 'text-red-400'">
              {{ formatCurrency(resumoFinanceiro.saldoAtual) }}
            </p>
            <p class="text-xs mt-1" :class="resumoFinanceiro.saldoAtual >= 0 ? 'text-indigo-600' : 'text-red-600'">
              {{ resumoFinanceiro.saldoAtual >= 0 ? '💎 Saldo disponível' : '⚠️ Saldo negativo' }}
            </p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <font-awesome-icon icon="wallet" class="text-white text-2xl drop-shadow-lg" />
          </div>
        </div>
      </div>
    </div>

    <!-- Alertas de Despesas Vencidas -->
    <div v-if="despesasVencidas.length > 0 || despesasVencendoHoje.length > 0" class="space-y-3 mb-6">
      <div v-if="despesasVencidas.length > 0" class="relative bg-gradient-to-br from-card via-red-950/10 to-card text-card-foreground rounded-lg border border-red-800/20 shadow-sm p-4 group overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
            <font-awesome-icon icon="exclamation-triangle" class="text-white" />
          </div>
          <div>
            <p class="text-foreground font-semibold">{{ despesasVencidas.length }} despesa(s) vencida(s)</p>
            <p class="text-gray-400 text-sm">⏰ Necessário atenção imediata</p>
          </div>
        </div>
      </div>
      
      <div v-if="despesasVencendoHoje.length > 0" class="relative bg-gradient-to-br from-card via-amber-950/10 to-card text-card-foreground rounded-lg border border-amber-800/20 shadow-sm p-4 group overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
            <font-awesome-icon icon="calendar-alt" class="text-white" />
          </div>
          <div>
            <p class="text-foreground font-semibold">{{ despesasVencendoHoje.length }} despesa(s) vencem hoje</p>
            <p class="text-amber-300 text-sm">📅 Lembre-se de pagar hoje</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="relative bg-gradient-to-br from-gray-800 to-slate-900 rounded-xl border border-gray-700/50 p-6 shadow-sm">
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-400/10 to-slate-500/10 rounded-full blur-xl"></div>
      <div class="bg-card text-card-foreground rounded-lg border border-border shadow-sm p-6 mb-6">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 bg-gradient-to-br from-gray-500 to-slate-600 rounded-lg flex items-center justify-center">
            <font-awesome-icon icon="filter" class="text-white text-sm" />
          </div>
          <h3 class="text-lg font-semibold text-foreground">Filtros</h3>
        </div>
        
        <div class="flex flex-col lg:flex-row gap-4 items-end">
          <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Filtro por Tipo -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">📊 Tipo</label>
              <select 
                v-model="filtroTipo"
                class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              >
                <option value="todas">📋 Todas</option>
                <option value="entrada">💰 Entradas</option>
                <option value="saida">💸 Saídas</option>
                <option value="dizimo">⛪ Dízimo</option>
              </select>
            </div>

            <!-- Data Início -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">📅 Data Início</label>
              <input 
                v-model="filtroDataInicio"
                type="date"
                class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              >
            </div>

            <!-- Data Fim -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">📅 Data Fim</label>
              <input 
                v-model="filtroDataFim"
                type="date"
                class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              >
            </div>
          </div>

          <!-- Botões de Filtro -->
          <div class="flex gap-3">
            <AppButton @click="aplicarFiltros" class="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md">
              <font-awesome-icon icon="filter" class="mr-2" />
              Filtrar
            </AppButton>
            <AppButton @click="limparFiltros" variant="outline" class="shrink-0 border-gray-600 text-gray-300 hover:bg-gray-700">
              🗑️ Limpar
            </AppButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Transações -->
    <div class="bg-card text-card-foreground rounded-lg border border-border shadow-sm">
      <div class="p-6 border-b border-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <font-awesome-icon icon="file-alt" class="text-white" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-foreground">Transações Recentes</h3>
            <p class="text-sm text-gray-400">📊 Histórico de movimentações financeiras</p>
          </div>
        </div>
      </div>
      
      <div v-if="isLoading" class="p-12 text-center">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-border border-t-ring mx-auto"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <font-awesome-icon icon="dollar-sign" class="text-ring animate-pulse" />
          </div>
        </div>
        <p class="text-foreground mt-4 font-medium">💫 Carregando suas transações...</p>
        <p class="text-gray-400 text-sm mt-1">Organizando seus dados financeiros</p>
      </div>
      
      <div v-else-if="transacoes.length === 0" class="p-12 text-center">
        <div class="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <font-awesome-icon icon="file-alt" class="h-10 w-10 text-gray-400" />
        </div>
        <p class="text-foreground font-semibold text-lg mb-2">📝 Nenhuma transação encontrada</p>
        <p class="text-gray-400 mb-6">Comece adicionando sua primeira entrada ou despesa!</p>
        <div class="flex gap-3 justify-center">
          <AppButton @click="showAddEntradaModal = true" size="sm" class="bg-emerald-600 hover:bg-emerald-700">
            💰 Primeira Entrada
          </AppButton>
          <AppButton @click="showAddDespesaModal = true" size="sm" variant="outline" class="border-border text-card-foreground hover:bg-muted">
            📅 Primeira Despesa
          </AppButton>
        </div>
      </div>
      
      <div v-else class="divide-y divide-border">
        <div v-for="transacao in transacoes" :key="transacao.id" class="relative p-5 hover:bg-muted/50 transition-all duration-300 group">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div 
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300',
                  transacao.tipo === 'entrada' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 
                  transacao.tipo === 'dizimo' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-red-500 to-rose-600'
                ]"
              >
                <font-awesome-icon 
                  :icon="transacao.tipo === 'entrada' ? 'arrow-up' : 
                        transacao.tipo === 'dizimo' ? 'church' : 'arrow-down'"
                  class="text-white text-lg"
                />
              </div>
              <div class="flex-1">
                <p class="font-semibold text-foreground group-hover:text-white">{{ transacao.descricao }}</p>
                <div class="flex flex-wrap items-center gap-2 text-sm text-gray-400 mt-1">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-card-foreground">
                    {{ transacao.categoria?.nome }}
                  </span>
                  <span>•</span>
                  <span class="flex items-center gap-1">
                    📅 {{ formatarData(transacao.data) }}
                  </span>
                  <span v-if="transacao.data_vencimento && transacao.tipo === 'saida'" 
                        :class="[
                          'flex items-center gap-1',
                          new Date(transacao.data_vencimento) < new Date() && transacao.status_pagamento === 'pendente' ? 'text-red-400' :
                          new Date(transacao.data_vencimento).toDateString() === new Date().toDateString() && transacao.status_pagamento === 'pendente' ? 'text-amber-400' :
                          'text-gray-400'
                        ]">
                    ⏰ {{ new Date(transacao.data_vencimento) < new Date() && transacao.status_pagamento === 'pendente' ? 'Vencida:' : 'Vence:' }} {{ formatarData(transacao.data_vencimento) }}
                  </span>
                </div>
                
                <!-- Observações -->
                <div v-if="transacao.observacoes" class="text-xs text-gray-500 mt-1 italic">
                  "{{ transacao.observacoes }}"
                </div>
              </div>
            </div>
            <div class="text-right flex flex-col items-end gap-2">
              <p 
                :class="[
                  'text-xl font-bold',
                  transacao.tipo === 'entrada' ? 'text-green-400' : 
                  transacao.tipo === 'dizimo' ? 'text-emerald-400' : 'text-red-400'
                ]"
              >
                {{ transacao.tipo === 'entrada' ? '+' : '-' }}{{ formatCurrency(transacao.valor) }}
              </p>
              
              <div class="flex items-center gap-2">
                <!-- Status da despesa -->
                <p 
                  :class="[
                    'text-xs font-medium capitalize px-2 py-1 rounded-full',
                    transacao.tipo === 'entrada' ? 'bg-green-900/50 text-green-300' :
                    transacao.tipo === 'dizimo' ? 'bg-emerald-900/50 text-emerald-300' : 
                    transacao.status_pagamento === 'pago' ? 'bg-blue-900/50 text-blue-300' : 'bg-red-900/50 text-red-300'
                  ]"
                >
                  {{ transacao.tipo === 'dizimo' ? '⛪ Dízimo' : 
                     transacao.tipo === 'entrada' ? '💰 Entrada' : 
                     transacao.status_pagamento === 'pago' ? '✅ Pago' : '💸 Pendente' }}
                </p>

                <!-- Botões de ação para despesas -->
                <div v-if="transacao.tipo === 'saida'" class="flex gap-1">
                  <button
                    v-if="transacao.status_pagamento === 'pendente'"
                    @click="marcarComoPago(transacao.id)"
                    class="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs transition-colors"
                    title="Marcar como pago"
                  >
                    <font-awesome-icon icon="check" class="text-xs" />
                  </button>
                  <button
                    v-else
                    @click="estornarPagamento(transacao.id)"
                    class="p-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs transition-colors"
                    title="Estornar pagamento"
                  >
                    <font-awesome-icon icon="undo" class="text-xs" />
                  </button>
                </div>
              </div>

              <!-- Informações adicionais para despesas parceladas -->
              <div v-if="transacao.tipo === 'saida' && transacao.tipo_despesa === 'parcelada'" class="text-xs text-gray-400">
                Parcela {{ transacao.parcela_atual }}/{{ transacao.total_parcelas }}
                <span v-if="transacao.valor_total"> - Total: {{ formatCurrency(transacao.valor_total) }}</span>
              </div>
              
              <!-- Informação para despesas recorrentes -->
              <div v-if="transacao.tipo === 'saida' && transacao.tipo_despesa === 'recorrente'" class="text-xs text-gray-400">
                🔄 {{ transacao.frequencia_recorrencia }}
              </div>
              
              <!-- Data de pagamento se pago -->
              <div v-if="transacao.tipo === 'saida' && transacao.status_pagamento === 'pago' && transacao.data_pagamento" class="text-xs text-blue-400">
                Pago em {{ formatarData(transacao.data_pagamento) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Nova Entrada -->
    <div v-if="showAddEntradaModal" class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div class="bg-card text-card-foreground rounded-lg border border-border max-w-md w-full p-6 shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <font-awesome-icon icon="plus" class="text-white" />
            </div>
            <h3 class="text-lg font-semibold text-foreground">💰 Nova Entrada</h3>
          </div>
          <button @click="showAddEntradaModal = false" class="text-gray-400 hover:text-card-foreground p-2 hover:bg-muted rounded-lg transition-colors">
            <font-awesome-icon icon="times" />
          </button>
        </div>

        <form @submit.prevent="handleSubmitEntrada" class="space-y-4">
          <!-- Categoria -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Categoria *</label>
            <select 
              v-model="novaEntrada.categoria"
              class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              required
            >
              <option value="">Selecione uma categoria</option>
              <option 
                v-for="categoria in categoriasEntrada"
                :key="categoria.id"
                :value="categoria.id"
              >
                {{ categoria.nome }}
              </option>
            </select>
          </div>

          <!-- Descrição -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Descrição *</label>
            <input
              v-model="novaEntrada.descricao"
              type="text"
              class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              placeholder="Ex: Venda de produto, Pagamento recebido..."
              required
            />
          </div>

          <!-- Valor -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Valor *</label>
            <input
              ref="entradaValorInput"
              v-model="novaEntrada.valorFormatado"
              @input="onEntradaValorInput"
              type="text"
              inputmode="numeric"
              class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              placeholder="R$ 0,00"
              required
            />
            <p class="text-xs text-emerald-600 mt-1">
              <font-awesome-icon icon="info-circle" class="mr-1" />
              10% será automaticamente separado como dízimo
            </p>
          </div>

          <!-- Data -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Data *</label>
            <input
              v-model="novaEntrada.data"
              type="date"
              class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              required
            />
          </div>

          <!-- Botões -->
          <div class="flex gap-3 pt-4">
            <AppButton type="button" variant="outline" @click="showAddEntradaModal = false" class="flex-1">
              Cancelar
            </AppButton>
            <AppButton type="submit" class="flex-1 bg-emerald-600 hover:bg-emerald-700">
              Adicionar Entrada
            </AppButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Nova Despesa -->
    <div v-if="showAddDespesaModal" class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div class="bg-card text-card-foreground rounded-lg border border-border max-w-md w-full p-6 shadow-lg">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <font-awesome-icon icon="calendar-alt" class="text-white" />
            </div>
            <h3 class="text-lg font-semibold text-foreground">📅 Nova Despesa</h3>
          </div>
          <button @click="showAddDespesaModal = false" class="text-gray-400 hover:text-card-foreground p-2 hover:bg-muted rounded-lg transition-colors">
            <font-awesome-icon icon="times" />
          </button>
        </div>

        <form @submit.prevent="handleSubmitDespesa" class="space-y-4">
          <!-- Tipo de Despesa -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Tipo de Despesa *</label>
            <select 
              v-model="novaDespesa.tipo_despesa"
              class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              required
            >
              <option value="unica">💰 Pagamento Único</option>
              <option value="parcelada">📊 Parcelada</option>
              <option value="recorrente">🔄 Recorrente</option>
            </select>
          </div>

          <!-- Categoria -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Categoria *</label>
            <select 
              v-model="novaDespesa.categoria"
              class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              required
            >
              <option value="">Selecione uma categoria</option>
              <option 
                v-for="categoria in categoriasSaida"
                :key="categoria.id"
                :value="categoria.id"
              >
                {{ categoria.nome }}
              </option>
            </select>
          </div>

          <!-- Descrição -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Descrição *</label>
            <input
              v-model="novaDespesa.descricao"
              type="text"
              class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              :placeholder="novaDespesa.tipo_despesa === 'parcelada' ? 'Ex: TV 50 polegadas, Sofá...' : novaDespesa.tipo_despesa === 'recorrente' ? 'Ex: Conta de luz, Internet...' : 'Ex: Compra única, Serviço...'"
              required
            />
          </div>

          <!-- Valor -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              {{ novaDespesa.tipo_despesa === 'parcelada' ? 'Valor Total *' : 'Valor *' }}
            </label>
            <input
              ref="despesaValorInput"
              v-model="novaDespesa.valorFormatado"
              @input="onDespesaValorInput"
              type="text"
              inputmode="numeric"
              class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              :placeholder="novaDespesa.tipo_despesa === 'parcelada' ? 'R$ 0,00 - valor total da compra' : 'R$ 0,00'"
              required
            />
          </div>

          <!-- Campos específicos para despesa parcelada -->
          <div v-if="novaDespesa.tipo_despesa === 'parcelada'" class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Qtd. Parcelas *</label>
              <input
                v-model.number="novaDespesa.total_parcelas"
                type="number"
                min="2"
                max="60"
                class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                placeholder="12"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Valor por Parcela</label>
              <input
                :value="novaDespesa.valor && novaDespesa.total_parcelas ? formatCurrency(novaDespesa.valor / novaDespesa.total_parcelas) : 'R$ 0,00'"
                type="text"
                class="w-full px-4 py-2 border border-border rounded-lg bg-muted text-gray-400 cursor-not-allowed"
                readonly
              />
            </div>
          </div>

          <!-- Campo específico para despesa recorrente -->
          <div v-if="novaDespesa.tipo_despesa === 'recorrente'">
            <label class="block text-sm font-medium text-gray-400 mb-2">Frequência *</label>
            <select 
              v-model="novaDespesa.frequencia_recorrencia"
              class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              required
            >
              <option value="mensal">📅 Mensal</option>
              <option value="trimestral">📊 Trimestral</option>
              <option value="semestral">📈 Semestral</option>
              <option value="anual">📆 Anual</option>
            </select>
          </div>

          <!-- Data de Vencimento -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              {{ novaDespesa.tipo_despesa === 'parcelada' ? 'Data da 1ª Parcela *' : 'Data de Vencimento *' }}
            </label>
            <input
              v-model="novaDespesa.data_vencimento"
              type="date"
              class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              required
            />
            <p v-if="novaDespesa.tipo_despesa === 'parcelada'" class="text-xs text-amber-600 mt-1">
              <font-awesome-icon icon="info-circle" class="mr-1" />
              As demais parcelas vencerão mensalmente a partir desta data
            </p>
          </div>

          <!-- Observações -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Observações</label>
            <textarea
              v-model="novaDespesa.observacoes"
              rows="3"
              class="w-full px-4 py-2 border border-border rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-colors resize-none"
              placeholder="Informações adicionais sobre a despesa..."
            />
          </div>

          <!-- Botões -->
          <div class="flex gap-3 pt-4">
            <AppButton type="button" variant="outline" @click="showAddDespesaModal = false" class="flex-1">
              Cancelar
            </AppButton>
            <AppButton type="submit" class="flex-1 bg-red-600 hover:bg-red-700">
              Registrar Despesa
            </AppButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Mensagem de Erro -->
    <div v-if="errorMessage" class="relative bg-gradient-to-r from-red-900/80 to-rose-800/80 border border-red-700/50 rounded-xl p-6 shadow-lg">
      <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-400/20 to-rose-500/20 rounded-full blur-lg"></div>
      <div class="relative flex items-center gap-4">
        <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
          <font-awesome-icon icon="exclamation-triangle" class="text-white text-lg" />
        </div>
        <div class="flex-1">
          <p class="font-semibold text-red-200 mb-1">⚠️ Ops! Algo deu errado</p>
          <p class="text-red-300">{{ errorMessage }}</p>
        </div>
        <button 
          @click="clearError" 
          class="text-red-400 hover:text-red-200 p-2 hover:bg-red-800 rounded-lg transition-colors"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>
    </div>
  </div>
</template>