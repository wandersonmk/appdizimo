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
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
              <font-awesome-icon :icon="['fas', 'arrow-up']" class="text-white text-2xl drop-shadow-lg" />
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
              <p class="text-xs text-red-600 mt-1">até agora</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <font-awesome-icon :icon="['fas', 'arrow-down']" class="text-white text-2xl" />
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
              <p class="text-2xl font-bold" :class="metrics.saldoMensal >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ formatCurrency(metrics.saldoMensal) }}
              </p>
              <p class="text-xs text-blue-600 mt-1">este mês</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <font-awesome-icon :icon="['fas', 'balance-scale']" class="text-white text-2xl" />
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
              <p class="text-xs text-purple-600 mt-1">este mês</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <font-awesome-icon :icon="['fas', 'church']" class="text-white text-2xl" />
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gráfico de Performance Circular -->
        <CircularProgress :total="metrics.totalTransacoes" />

        <!-- Gráfico de Transações Mensais -->
        <div class="bg-card text-card-foreground rounded-lg border border-border shadow-sm p-6">
          <h3 class="text-lg font-semibold text-foreground mb-4">Transações dos Últimos Meses</h3>
          <div class="relative h-64">
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

Chart.register(...registerables)

// Estados reativos para métricas (dados mockados por enquanto)
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

// Simular dados de demonstração (será integrado com dados reais posteriormente)
const fetchMetrics = async () => {
  loading.value = true
  
  // Simular dados para demonstração
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  metrics.value = {
    entradasHoje: 850.00,
    saidasHoje: 320.50,
    saldoMensal: 4250.75,
    totalTransacoes: 47,
    dizimoMensal: 425.00
  }
  
  loading.value = false
}

// Criar gráfico simples
const createLineChart = () => {
  if (!lineChartRef.value) return

  const ctx = lineChartRef.value.getContext('2d')
  if (!ctx) return

  // Dados mockados para demonstração
  const labels = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out']
  const entradasData = [1500, 2300, 1800, 2800, 2200, 3200]
  const saidasData = [1200, 1800, 1400, 2100, 1900, 2500]

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
  nextTick(() => {
    createLineChart()
  })
})
</script>
