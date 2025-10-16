export const useRelatorios = () => {
  let supabase: any = null
  if (typeof window !== 'undefined') {
    supabase = useSupabaseClient()
  }
  
  // Interface para o relatório financeiro
  interface RelatorioFinanceiro {
    id: string
    usuario_id: string
    tipo: 'entrada' | 'saida' | 'dizimo'
    categoria_nome: string
    categoria_cor: string
    categoria_icone: string
    descricao: string
    valor: number
    data: string
    status_pagamento: string
    created_at: string
    data_vencimento?: string
    valor_dizimo?: number
    observacoes?: string
  }
  
  // Estados reativos
  const relatorios = ref<RelatorioFinanceiro[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Função para buscar relatórios de transações financeiras do usuário logado
  const fetchRelatorios = async () => {
    console.log('🔍 Iniciando busca de relatórios financeiros...')
    isLoading.value = true
    error.value = null
    try {
      // Verificar usuário autenticado
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado')
      }

      console.log('👤 Usuário autenticado:', currentUser.id)

      const { data, error: fetchError } = await supabase
        .from('transacoes_financeiras')
        .select(`
          *,
          categoria:categorias_financeiras (
            nome,
            cor,
            icone
          )
        `)
        .eq('usuario_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('❌ Erro ao buscar relatórios:', fetchError)
        throw fetchError
      }

      console.log('✅ Relatórios encontrados:', data?.length || 0)
      console.log('📊 Dados dos relatórios:', data)

      // Mapear os dados para o formato esperado
      const relatoriosFormatados = data?.map((transacao: any) => ({
        id: transacao.id,
        usuario_id: transacao.usuario_id,
        tipo: transacao.tipo,
        categoria_nome: transacao.categoria?.nome || 'Sem categoria',
        categoria_cor: transacao.categoria?.cor || '#3B82F6',
        categoria_icone: transacao.categoria?.icone || 'dollar-sign',
        descricao: transacao.descricao,
        valor: parseFloat(transacao.valor),
        data: transacao.data,
        status_pagamento: transacao.status_pagamento || 'pendente',
        created_at: transacao.created_at,
        data_vencimento: transacao.data_vencimento,
        valor_dizimo: transacao.valor_dizimo ? parseFloat(transacao.valor_dizimo) : null,
        observacoes: transacao.observacoes
      })) || []

      relatorios.value = relatoriosFormatados
    } catch (err: any) {
      console.error('❌ Erro na busca de relatórios:', err)
      error.value = err.message || 'Erro ao carregar relatórios'
      relatorios.value = []
    } finally {
      isLoading.value = false
    }
  }
  
  // Função para calcular totais por tipo
  const calcularTotais = () => {
    const totais = {
      entradas: 0,
      saidas: 0,
      dizimos: 0,
      saldo: 0
    }

    relatorios.value.forEach(relatorio => {
      const valor = relatorio.valor || 0
      
      switch (relatorio.tipo) {
        case 'entrada':
          totais.entradas += valor
          break
        case 'saida':
          totais.saidas += valor
          break
        case 'dizimo':
          totais.dizimos += valor
          break
      }
    })

    totais.saldo = totais.entradas - totais.saidas - totais.dizimos
    
    return totais
  }
  
  // Função para filtrar relatórios por período
  const filtrarPorPeriodo = (dataInicio: string, dataFim: string) => {
    if (!dataInicio && !dataFim) return relatorios.value

    return relatorios.value.filter(relatorio => {
      const dataTransacao = new Date(relatorio.data)
      
      if (dataInicio && dataFim) {
        const inicio = new Date(dataInicio)
        const fim = new Date(dataFim)
        return dataTransacao >= inicio && dataTransacao <= fim
      }
      
      if (dataInicio) {
        const inicio = new Date(dataInicio)
        return dataTransacao >= inicio
      }
      
      if (dataFim) {
        const fim = new Date(dataFim)
        return dataTransacao <= fim
      }
      
      return true
    })
  }
  
  // Função para limpar erros
  const clearError = () => {
    error.value = null
  }
  
  return {
    relatorios,
    isLoading,
    error,
    fetchRelatorios,
    calcularTotais,
    filtrarPorPeriodo,
    clearError
  }
}
