<template>
  <div class="max-w-7xl mx-auto">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center p-8">
      <AppLoading />
    </div>

    <div v-else>
      <!-- Cards de métricas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Card Entradas Hoje -->
        <div class="relative bg-gradient-to-br from-card via-green-950/10 to-card text-card-foreground rounded-lg border border-green-800/20 shadow-sm hover:shadow-md hover:shadow-green-500/10 transition-all duration-300 p-6 group overflow-hidden">
          <!-- Efeito de brilho sutil -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Entradas Hoje</p>
              <p class="text-2xl font-bold text-foreground">{{ formatCurrency(metrics.entradasHoje) }}</p>
              <p class="text-xs text-green-600 mt-1">até agora</p>
            </div>
            <div class="text-green-600 text-2xl">
              <i class="fas fa-arrow-up"></i>
            </div>
          </div>
        </div>

        <!-- Card Saídas Hoje -->
        <div class="relative bg-gradient-to-br from-card via-red-950/10 to-card text-card-foreground rounded-lg border border-red-800/20 shadow-sm hover:shadow-md hover:shadow-red-500/10 transition-all duration-300 p-6 group overflow-hidden">
          <!-- Efeito de brilho sutil -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Saídas Hoje</p>
              <p class="text-2xl font-bold text-foreground">{{ formatCurrency(metrics.saidasHoje) }}</p>
              <p class="text-xs text-red-600 mt-1">gastos do dia</p>
            </div>
            <div class="text-red-600 text-2xl">
              <i class="fas fa-arrow-down"></i>
            </div>
          </div>
        </div>

        <!-- Card Saldo Mensal -->
        <div class="relative bg-gradient-to-br from-card via-blue-950/10 to-card text-card-foreground rounded-lg border border-blue-800/20 shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 p-6 group overflow-hidden">
          <!-- Efeito de brilho sutil -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Saldo Mensal</p>
              <p class="text-2xl font-bold" :class="metrics.saldoMensal >= 0 ? 'text-green-400' : 'text-red-400'">
                {{ formatCurrency(metrics.saldoMensal) }}
              </p>
              <p class="text-xs text-gray-400 mt-1">{{ metrics.totalTransacoes }} transações</p>
            </div>
            <div :class="metrics.saldoMensal >= 0 ? 'text-green-600' : 'text-red-600'" class="text-2xl">
              <i :class="metrics.saldoMensal >= 0 ? 'fas fa-wallet' : 'fas fa-exclamation-triangle'"></i>
            </div>
          </div>
        </div>

        <!-- Card Dízimo Mensal -->
        <div class="relative bg-gradient-to-br from-card via-purple-950/10 to-card text-card-foreground rounded-lg border border-purple-800/20 shadow-sm hover:shadow-md hover:shadow-purple-500/10 transition-all duration-300 p-6 group overflow-hidden">
          <!-- Efeito de brilho sutil -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Dízimo Mensal</p>
              <p class="text-2xl font-bold text-foreground">{{ formatCurrency(metrics.dizimoMensal) }}</p>
              <p class="text-xs text-purple-600 mt-1">contribuições</p>
            </div>
            <div class="text-purple-600 text-2xl">
              <i class="fas fa-heart"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico -->
      <div class="bg-gradient-to-br from-card to-card/80 text-card-foreground rounded-lg border border-border/50 shadow-sm p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h3 class="text-lg font-semibold text-foreground mb-4">Transações dos Últimos Meses</h3>
          <div class="h-80 w-full">
            <canvas ref="lineChartRef"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { ref, onMounted, nextTick } from 'vue'
import { useFinancas } from '../composables/useFinancas'

Chart.register(...registerables)

// Composables
const { resumoFinanceiro, transacoes, fetchTransacoes } = useFinancas()

// Estados reativos para métricas
const loading = ref(false)
const metrics = ref({
  entradasHoje: 0,
  saidasHoje: 0,
  saldoMensal: 0,
  totalTransacoes: 0,
  dizimoMensal: 0
})

// Refs para elementos
const lineChartRef = ref<HTMLCanvasElement | null>(null)

// Função para formatar moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Buscar dados reais do banco de dados
const fetchMetrics = async () => {
  loading.value = true
  
  try {
    // Buscar todas as transações do usuário
    await fetchTransacoes()

    // Calcular métricas baseadas nas transações do usuário logado
    const hoje = new Date().toISOString().split('T')[0]
    const inicioMes = new Date()
    inicioMes.setDate(1)
    const inicioMesStr = inicioMes.toISOString().split('T')[0]

    // Entradas de hoje
    const entradasHojeTotal = transacoes.value
      .filter(t => t.tipo === 'entrada' && t.data === hoje)
      .reduce((sum: number, t: any) => sum + parseFloat(t.valor), 0)

    // Saídas de hoje
    const saidasHojeTotal = transacoes.value
      .filter(t => t.tipo === 'saida' && t.data === hoje)
      .reduce((sum: number, t: any) => sum + parseFloat(t.valor), 0)

    // Transações do mês para saldo
    const transacoesMes = transacoes.value
      .filter(t => t.data && inicioMesStr && t.data >= inicioMesStr)

    const entradasMensais = transacoesMes
      .filter(t => t.tipo === 'entrada')
      .reduce((sum: number, t: any) => sum + parseFloat(t.valor), 0)

    const saidasMensais = transacoesMes
      .filter(t => t.tipo === 'saida')
      .reduce((sum: number, t: any) => sum + parseFloat(t.valor), 0)

    // Dízimo do mês
    const dizimoMensalTotal = transacoesMes
      .filter(t => t.tipo === 'dizimo')
      .reduce((sum: number, t: any) => sum + parseFloat(t.valor), 0)

    metrics.value = {
      entradasHoje: entradasHojeTotal,
      saidasHoje: saidasHojeTotal,
      saldoMensal: entradasMensais - saidasMensais,
      totalTransacoes: transacoes.value.length,
      dizimoMensal: dizimoMensalTotal
    }
    
  } catch (error) {
    console.error('❌ Erro ao carregar métricas:', error)
  } finally {
    loading.value = false
  }
}

// Criar gráfico com dados reais
const createLineChart = async () => {
  if (!lineChartRef.value) return

  const ctx = lineChartRef.value.getContext('2d')
  if (!ctx) return

  // Dados padrão para 12 meses
  let labels = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr']
  let entradasData = Array(12).fill(0)
  let saidasData = Array(12).fill(0)

  try {
    // Obter últimos 6 meses + próximos 6 meses (12 meses no total)
    const meses = []
    const labelsCalculados = []
    const hoje = new Date()
    
    // 6 meses anteriores + mês atual + 5 meses futuros = 12 meses
    for (let i = 5; i >= -6; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
      const mesAno = data.toISOString().slice(0, 7)
      const nomeAbrev = data.toLocaleDateString('pt-BR', { month: 'short' })
      meses.push(mesAno)
      labelsCalculados.push(nomeAbrev.charAt(0).toUpperCase() + nomeAbrev.slice(1))
    }

    // Calcular dados reais se houver transações
    if (transacoes.value.length > 0) {
      labels = labelsCalculados
      entradasData = meses.map(mes => {
        return transacoes.value
          .filter(t => t.tipo === 'entrada' && t.data && t.data.startsWith(mes))
          .reduce((sum: number, t: any) => sum + parseFloat(t.valor || 0), 0)
      })

      saidasData = meses.map(mes => {
        return transacoes.value
          .filter(t => t.tipo === 'saida' && t.data && t.data.startsWith(mes))
          .reduce((sum: number, t: any) => {
            const valor = typeof t.valor === 'number' ? t.valor : parseFloat(String(t.valor || 0))
            return sum + valor
          }, 0)
      })
    }
  } catch (error) {
    console.error('❌ Erro ao processar dados:', error)
  }

  // Criar gráfico
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Entradas',
          data: entradasData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: 'Saídas',
          data: saidasData,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#EF4444',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#F3F4F6',
            font: {
              size: 12,
              weight: 'bold'
            }
          }
        },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#F3F4F6',
          bodyColor: '#F3F4F6',
          borderColor: '#374151',
          borderWidth: 1,
          callbacks: {
            label: function(context: any) {
              return context.dataset.label + ': ' + formatCurrency(context.parsed.y)
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#9CA3AF',
            font: {
              size: 11
            }
          },
          grid: {
            color: '#374151'
          }
        },
        y: {
          ticks: {
            color: '#9CA3AF',
            font: {
              size: 11
            },
            callback: function(value: any) {
              return formatCurrency(Number(value))
            }
          },
          grid: {
            color: '#374151'
          }
        }
      }
    }
  })
}

// Inicializar dashboard
onMounted(async () => {
  await fetchMetrics()
  nextTick(async () => {
    await createLineChart()
  })
})
</script>