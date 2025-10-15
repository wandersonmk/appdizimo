export default defineEventHandler(async (event) => {
  try {
    // Dados baseados nas transações reais + histórico simulado
    const chartData = {
      labels: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
      entradas: [320, 480, 600, 750, 590, 850],  // Crescimento mensal
      saidas: [280, 450, 520, 680, 510, 950]     // Variação mensal
    }

    return chartData
  } catch (error) {
    console.error('Erro ao buscar dados do gráfico:', error)
    
    // Dados padrão em caso de erro
    return {
      labels: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
      entradas: [0, 0, 0, 0, 0, 850],
      saidas: [0, 0, 0, 0, 0, 950]
    }
  }
})