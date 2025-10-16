export const useAnaliseGastos = () => {
  const isAnalyzing = ref(false)
  const lastAnalysis = ref<any>(null)
  const error = ref<string | null>(null)

  /**
   * Realiza análise de gastos usando dados reais do banco
   */
  const analisarGastos = async (userId: string, message: string = 'analisar meus gastos') => {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório para análise de gastos')
    }

    isAnalyzing.value = true
    error.value = null

    try {
      const response = await $fetch('/api/analisar-gastos', {
        method: 'POST',
        body: {
          message,
          userId
        }
      }) as any

      if (response.success) {
        lastAnalysis.value = {
          response: response.response,
          dadosFinanceiros: response.dadosFinanceiros,
          timestamp: new Date()
        }
        return response
      } else {
        throw new Error('Falha na análise de gastos')
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao analisar gastos'
      throw err
    } finally {
      isAnalyzing.value = false
    }
  }

  /**
   * Verifica se uma mensagem é sobre análise de gastos
   */
  const isAnaliseGastosMessage = (message: string): boolean => {
    const patterns = [
      /analis[ae]r?\s+(meus\s+)?gastos?/i,
      /análise.*gastos?/i,
      /como\s+estão\s+meus\s+gastos/i,
      /relatório.*gastos/i,
      /onde\s+(estou\s+)?gastando/i,
      /resumo\s+(dos\s+)?gastos/i,
      /despesas?\s+(mensais?|anuais?)/i
    ]
    
    return patterns.some(pattern => pattern.test(message))
  }

  /**
   * Formatar dados financeiros para exibição
   */
  const formatarDadosFinanceiros = (dados: any) => {
    if (!dados) return null

    return {
      resumo: {
        totalGastos: `R$ ${dados.totalGastos?.toFixed(2) || '0,00'}`,
        totalEntradas: `R$ ${dados.totalEntradas?.toFixed(2) || '0,00'}`,
        saldoLiquido: `R$ ${dados.saldoLiquido?.toFixed(2) || '0,00'}`,
        totalDizimo: `R$ ${dados.totalDizimo?.toFixed(2) || '0,00'}`,
      },
      categorias: dados.gastosPorCategoria?.map((cat: any) => ({
        nome: cat.categoria,
        valor: `R$ ${cat.total?.toFixed(2) || '0,00'}`,
        quantidade: cat.quantidade,
        percentual: dados.totalGastos > 0 ? ((cat.total / dados.totalGastos) * 100).toFixed(1) : '0'
      })) || [],
      maioresGastos: dados.maioresGastos?.map((gasto: any) => ({
        descricao: gasto.descricao,
        valor: `R$ ${gasto.valor?.toFixed(2) || '0,00'}`,
        categoria: gasto.categoria
      })) || []
    }
  }

  /**
   * Resetar estado da análise
   */
  const resetAnalysis = () => {
    lastAnalysis.value = null
    error.value = null
    isAnalyzing.value = false
  }

  return {
    isAnalyzing: readonly(isAnalyzing),
    lastAnalysis: readonly(lastAnalysis),
    error: readonly(error),
    analisarGastos,
    isAnaliseGastosMessage,
    formatarDadosFinanceiros,
    resetAnalysis
  }
}