export const useDashboard = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Estados reativos para métricas
  const metrics = ref({
    entradasHoje: 0,
    saidasHoje: 0,
    saldoMensal: 0,
    totalTransacoes: 0,
    dizimoMensal: 0
  })

  // Estados para gráficos
  const chartData = ref({
    entradasPorMes: [] as { mes: string; valor: number }[],
    saidasPorMes: [] as { mes: string; valor: number }[],
    categoriasMaisUsadas: [] as { nome: string; valor: number; cor: string }[]
  })

  const loading = ref(false)

  // Função para mostrar toast com segurança
  const showToast = async (message: string, type: string = 'error') => {
    const toast = await useToastSafe()
    if (toast && typeof toast === 'function') {
      toast(message, { type })
    }
  }

  // Buscar métricas principais
  const fetchMetrics = async () => {
    if (!user.value?.id) return

    loading.value = true
    try {
      const hoje = new Date().toISOString().split('T')[0]
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0]
      
      // Entradas de hoje
      const { data: entradasHoje } = await supabase
        .from('transacoes_financeiras')
        .select('valor')
        .eq('usuario_id', user.value.id)
        .eq('tipo', 'entrada')
        .eq('data', hoje)

      metrics.value.entradasHoje = entradasHoje?.reduce((sum, t) => sum + parseFloat(t.valor), 0) || 0

      // Saídas de hoje
      const { data: saidasHoje } = await supabase
        .from('transacoes_financeiras')
        .select('valor')
        .eq('usuario_id', user.value.id)
        .eq('tipo', 'saida')
        .eq('data', hoje)

      metrics.value.saidasHoje = saidasHoje?.reduce((sum, t) => sum + parseFloat(t.valor), 0) || 0

      // Saldo mensal (entradas - saídas do mês)
      const { data: transacoesMes } = await supabase
        .from('transacoes_financeiras')
        .select('tipo, valor')
        .eq('usuario_id', user.value.id)
        .gte('data', inicioMes)

      if (transacoesMes) {
        const entradasMes = transacoesMes
          .filter(t => t.tipo === 'entrada')
          .reduce((sum, t) => sum + parseFloat(t.valor), 0)
        
        const saidasMes = transacoesMes
          .filter(t => t.tipo === 'saida')
          .reduce((sum, t) => sum + parseFloat(t.valor), 0)

        metrics.value.saldoMensal = entradasMes - saidasMes
      }

      // Total de transações
      const { count } = await supabase
        .from('transacoes_financeiras')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', user.value.id)

      metrics.value.totalTransacoes = count || 0

      // Dízimo do mês
      const { data: dizimoMes } = await supabase
        .from('transacoes_financeiras')
        .select('valor')
        .eq('usuario_id', user.value.id)
        .eq('tipo', 'dizimo')
        .gte('data', inicioMes)

      metrics.value.dizimoMensal = dizimoMes?.reduce((sum, t) => sum + parseFloat(t.valor), 0) || 0

    } catch (error) {
      console.error('Erro ao buscar métricas:', error)
      await showToast('Erro ao carregar métricas do dashboard', 'error')
    } finally {
      loading.value = false
    }
  }

  // Buscar dados para gráficos
  const fetchChartData = async () => {
    if (!user.value?.id) return

    try {
      // Dados dos últimos 6 meses
      const mesesAtras = 6
      const dataInicio = new Date()
      dataInicio.setMonth(dataInicio.getMonth() - mesesAtras)
      const dataInicioStr = dataInicio.toISOString().split('T')[0]

      const { data: transacoesMeses } = await supabase
        .from('transacoes_financeiras')
        .select(`
          data,
          tipo,
          valor,
          categoria_id,
          categorias_financeiras(nome, cor)
        `)
        .eq('usuario_id', user.value.id)
        .gte('data', dataInicioStr)
        .order('data', { ascending: true })

      if (transacoesMeses) {
        // Agrupar por mês
        const mesesMap = new Map()
        const categoriasMap = new Map()

        transacoesMeses.forEach((t: any) => {
          const mesAno = new Date(t.data).toLocaleDateString('pt-BR', { 
            month: 'short', 
            year: 'numeric' 
          })

          if (!mesesMap.has(mesAno)) {
            mesesMap.set(mesAno, { entradas: 0, saidas: 0 })
          }

          const mes = mesesMap.get(mesAno)
          const valor = parseFloat(t.valor)

          if (t.tipo === 'entrada') {
            mes.entradas += valor
          } else if (t.tipo === 'saida') {
            mes.saidas += valor
          }

          // Para categorias mais usadas
          if (t.categorias_financeiras) {
            const categoria = t.categorias_financeiras.nome
            const cor = t.categorias_financeiras.cor
            
            if (!categoriasMap.has(categoria)) {
              categoriasMap.set(categoria, { valor: 0, cor })
            }
            categoriasMap.get(categoria).valor += valor
          }
        })

        // Converter para arrays
        chartData.value.entradasPorMes = Array.from(mesesMap.entries())
          .map(([mes, data]) => ({ mes, valor: data.entradas }))

        chartData.value.saidasPorMes = Array.from(mesesMap.entries())
          .map(([mes, data]) => ({ mes, valor: data.saidas }))

        chartData.value.categoriasMaisUsadas = Array.from(categoriasMap.entries())
          .map(([nome, data]) => ({ nome, valor: data.valor, cor: data.cor }))
          .sort((a, b) => b.valor - a.valor)
          .slice(0, 5) // Top 5 categorias
      }

    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error)
    }
  }

  // Inicializar dados
  const initializeDashboard = async () => {
    await Promise.all([
      fetchMetrics(),
      fetchChartData()
    ])
  }

  return {
    metrics: readonly(metrics),
    chartData: readonly(chartData),
    loading: readonly(loading),
    initializeDashboard,
    fetchMetrics,
    fetchChartData
  }
}