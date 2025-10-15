<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFinancas } from '../composables/useFinancas'

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
  formatarMoeda,
  formatarData,
  clearError
} = useFinancas()

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
  data: new Date().toISOString().split('T')[0]
})

// Form para nova despesa
const novaDespesa = ref({
  categoria: '',
  descricao: '',
  valor: 0,
  data_vencimento: new Date().toISOString().split('T')[0]
})

// Funções
const resetEntradaForm = () => {
  novaEntrada.value = {
    categoria: '',
    descricao: '',
    valor: 0,
    data: new Date().toISOString().split('T')[0]
  }
}

const resetDespesaForm = () => {
  novaDespesa.value = {
    categoria: '',
    descricao: '',
    valor: 0,
    data_vencimento: new Date().toISOString().split('T')[0]
  }
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
  if (!novaDespesa.value.categoria || !novaDespesa.value.descricao || novaDespesa.value.valor <= 0 || !novaDespesa.value.data_vencimento) {
    return
  }
  
  try {
    await adicionarDespesa({
      categoria: novaDespesa.value.categoria,
      descricao: novaDespesa.value.descricao,
      valor: novaDespesa.value.valor,
      data_vencimento: novaDespesa.value.data_vencimento
    })
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
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Finanças</h1>
        <p class="text-sm text-muted-foreground">Gerencie suas receitas e despesas com dízimo automático</p>
      </div>
      <div class="flex gap-2 shrink-0">
        <AppButton @click="showAddEntradaModal = true" class="bg-green-600 hover:bg-green-700">
          <font-awesome-icon icon="plus" class="mr-2" />
          Nova Entrada
        </AppButton>
        <AppButton @click="showAddDespesaModal = true" variant="outline">
          <font-awesome-icon icon="calendar-alt" class="mr-2" />
          Nova Despesa
        </AppButton>
      </div>
    </div>

    <!-- Cards de Resumo -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total de Entradas -->
      <div class="bg-card rounded-lg border p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Total Entradas</p>
            <p class="text-2xl font-semibold text-green-600">{{ formatarMoeda(resumoFinanceiro.totalEntradas) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-arrow-up text-green-600"></i>
          </div>
        </div>
      </div>

      <!-- Total de Saídas -->
      <div class="bg-card rounded-lg border p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Total Saídas</p>
            <p class="text-2xl font-semibold text-red-600">{{ formatarMoeda(resumoFinanceiro.totalSaidas) }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-arrow-down text-red-600"></i>
          </div>
        </div>
      </div>

      <!-- Total de Dízimo -->
      <div class="bg-emerald-50 rounded-lg border border-emerald-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-emerald-700">Total Dízimo</p>
            <p class="text-2xl font-semibold text-emerald-600">{{ formatarMoeda(resumoFinanceiro.totalDizimo) }}</p>
          </div>
          <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <font-awesome-icon icon="church" class="text-emerald-600" />
          </div>
        </div>
      </div>

      <!-- Saldo Atual -->
      <div class="bg-card rounded-lg border p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Saldo Atual</p>
            <p class="text-2xl font-semibold" :class="resumoFinanceiro.saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ formatarMoeda(resumoFinanceiro.saldoAtual) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-wallet text-blue-600"></i>
          </div>
        </div>
      </div>

      <!-- Transações Hoje -->
      <div class="bg-card rounded-lg border p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Transações Hoje</p>
            <p class="text-2xl font-semibold text-foreground">{{ resumoFinanceiro.transacoesHoje }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-calendar-day text-purple-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-card rounded-lg border p-4">
      <div class="flex flex-col lg:flex-row gap-4 items-end">
        <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Filtro por Tipo -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Tipo</label>
            <select 
              v-model="filtroTipo"
              class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="todas">Todas</option>
              <option value="entrada">Entradas</option>
              <option value="saida">Saídas</option>
              <option value="dizimo">Dízimo</option>
            </select>
          </div>

          <!-- Data Início -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Data Início</label>
            <input 
              v-model="filtroDataInicio"
              type="date"
              class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
          </div>

          <!-- Data Fim -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Data Fim</label>
            <input 
              v-model="filtroDataFim"
              type="date"
              class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="flex gap-2">
          <AppButton @click="aplicarFiltros" variant="outline">
            <i class="fas fa-filter mr-2"></i>
            Filtrar
          </AppButton>
          <AppButton @click="limparFiltros" variant="outline">
            <i class="fas fa-times mr-2"></i>
            Limpar
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Lista de Transações -->
    <div class="bg-card rounded-lg border">
      <div class="p-4 border-b border-border">
        <h3 class="font-semibold text-foreground">Transações Recentes</h3>
      </div>
      
      <div v-if="isLoading" class="p-8 text-center">
        <i class="fas fa-spinner fa-spin text-muted-foreground mb-2"></i>
        <p class="text-muted-foreground">Carregando transações...</p>
      </div>

      <div v-else-if="transacoes.length === 0" class="p-8 text-center">
        <i class="fas fa-inbox text-muted-foreground text-4xl mb-4"></i>
        <p class="text-muted-foreground">Nenhuma transação encontrada</p>
        <p class="text-sm text-muted-foreground">Adicione sua primeira transação para começar</p>
      </div>

      <div v-else class="divide-y divide-border">
        <div 
          v-for="transacao in transacoes" 
          :key="transacao.id"
          class="p-4 hover:bg-muted/50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                :style="{ backgroundColor: transacao.categoria?.cor || '#6B7280' }"
              >
                <i :class="`fas fa-${transacao.categoria?.icone || 'dollar-sign'}`"></i>
              </div>
              <div>
                <p class="font-medium text-foreground">{{ transacao.descricao }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ transacao.categoria?.nome || 'Sem categoria' }} • {{ formatarData(transacao.data) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p 
                class="font-semibold"
                :class="transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'"
              >
                {{ transacao.tipo === 'entrada' ? '+' : '-' }}{{ formatarMoeda(transacao.valor) }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ transacao.tipo === 'entrada' ? 'Entrada' : 'Saída' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Nova Transação -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-background rounded-lg border max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Nova Transação</h3>
          <button @click="showAddModal = false" class="text-muted-foreground hover:text-foreground">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Tipo -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Tipo *</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="novaTransacao.tipo = 'entrada'"
                :class="[
                  'px-4 py-2 rounded-md border transition-colors',
                  novaTransacao.tipo === 'entrada'
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : 'bg-background border-border text-muted-foreground hover:bg-muted'
                ]"
              >
                <i class="fas fa-arrow-up mr-2"></i>
                Entrada
              </button>
              <button
                type="button"
                @click="novaTransacao.tipo = 'saida'"
                :class="[
                  'px-4 py-2 rounded-md border transition-colors',
                  novaTransacao.tipo === 'saida'
                    ? 'bg-red-100 border-red-300 text-red-800'
                    : 'bg-background border-border text-muted-foreground hover:bg-muted'
                ]"
              >
                <i class="fas fa-arrow-down mr-2"></i>
                Saída
              </button>
            </div>
          </div>

          <!-- Categoria -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Categoria *</label>
            <select 
              v-model="novaTransacao.categoria"
              required
              class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="">Selecione uma categoria</option>
              <option 
                v-for="categoria in categorias.filter(c => c.tipo === novaTransacao.tipo)" 
                :key="categoria.id"
                :value="categoria.id"
              >
                {{ categoria.nome }}
              </option>
            </select>
          </div>

          <!-- Descrição -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Descrição *</label>
            <input 
              v-model="novaTransacao.descricao"
              type="text"
              required
              placeholder="Descreva a transação"
              class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
          </div>

          <!-- Valor -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Valor *</label>
            <input 
              v-model.number="novaTransacao.valor"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0,00"
              class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
          </div>

          <!-- Data -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Data *</label>
            <input 
              v-model="novaTransacao.data"
              type="date"
              required
              class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
          </div>

          <!-- Botões -->
          <div class="flex gap-3 pt-4">
            <AppButton type="button" variant="outline" @click="showAddModal = false" class="flex-1">
              Cancelar
            </AppButton>
            <AppButton type="submit" class="flex-1">
              Adicionar
            </AppButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Mensagem de Erro -->
    <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-2">
        <i class="fas fa-exclamation-triangle text-red-500"></i>
        <p class="text-red-700">{{ errorMessage }}</p>
        <button @click="clearError" class="ml-auto text-red-500 hover:text-red-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>