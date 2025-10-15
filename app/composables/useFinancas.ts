import { ref, computed } from 'vue'
import type { TransacaoFinanceira, CategoriaFinanceira, ResumoFinanceiro, FiltroTransacoes } from '../../shared/types/financas.types'

export function useFinancas() {
  const supabase = useSupabaseClient()
  
  // Estados
  const transacoes = ref<any[]>([])
  const categorias = ref<any[]>([])
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  
  // Computeds
  const resumoFinanceiro = computed<ResumoFinanceiro>(() => {
    const hoje = new Date().toISOString().split('T')[0]
    
    const totalEntradas = transacoes.value
      .filter(t => t.tipo === 'entrada')
      .reduce((sum, t) => sum + t.valor, 0)
    
    const totalSaidas = transacoes.value
      .filter(t => t.tipo === 'saida')
      .reduce((sum, t) => sum + t.valor, 0)
    
    const totalDizimo = transacoes.value
      .filter(t => t.tipo === 'dizimo')
      .reduce((sum, t) => sum + t.valor, 0)
    
    const transacoesHoje = transacoes.value
      .filter(t => t.data === hoje).length
    
    return {
      totalEntradas,
      totalSaidas,
      totalDizimo,
      saldoAtual: totalEntradas - totalSaidas - totalDizimo,
      transacoesHoje
    }
  })
  
  const categoriasEntrada = computed(() => 
    categorias.value.filter(c => c.tipo === 'entrada')
  )
  
  const categoriasSaida = computed(() => 
    categorias.value.filter(c => c.tipo === 'saida')
  )
  
  const categoriasDizimo = computed(() => 
    categorias.value.filter(c => c.tipo === 'dizimo')
  )
  
  // Funções
  const clearError = () => {
    errorMessage.value = null
  }
  
  const fetchCategorias = async () => {
    try {
      clearError()
      const { data, error } = await supabase
        .from('categorias_financeiras')
        .select('*')
        .order('tipo', { ascending: true })
        .order('nome', { ascending: true })
      
      if (error) throw error
      
      categorias.value = data || []
      return data
    } catch (err: any) {
      errorMessage.value = err.message
      console.error('Erro ao buscar categorias:', err)
      return []
    }
  }
  
  const fetchTransacoes = async (filtros: FiltroTransacoes = {}) => {
    try {
      clearError()
      isLoading.value = true
      
      let query = supabase
        .from('transacoes_financeiras')
        .select(`
          *,
          categoria:categorias_financeiras(nome, cor, icone)
        `)
        .order('data', { ascending: false })
        .order('created_at', { ascending: false })
      
      // Aplicar filtros
      if (filtros.dataInicio) {
        query = query.gte('data', filtros.dataInicio)
      }
      
      if (filtros.dataFim) {
        query = query.lte('data', filtros.dataFim)
      }
      
      if (filtros.tipo && filtros.tipo !== 'todas') {
        query = query.eq('tipo', filtros.tipo)
      }
      
      if (filtros.categoria) {
        query = query.eq('categoria_id', filtros.categoria)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      transacoes.value = data || []
      return data
    } catch (err: any) {
      errorMessage.value = err.message
      console.error('Erro ao buscar transações:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  const adicionarEntrada = async (transacao: Omit<TransacaoFinanceira, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      clearError()
      isLoading.value = true
      
      // Obter usuário atual da sessão
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Usuário não autenticado')
      }
      
      // Calcular o dízimo (10% do valor)
      const valorDizimo = transacao.valor * 0.1
      
      // Inserir a entrada principal
      const { data: entradaData, error: entradaError } = await supabase
        .from('transacoes_financeiras')
        .insert([{
          usuario_id: user.id,
          tipo: transacao.tipo,
          categoria_id: transacao.categoria,
          descricao: transacao.descricao,
          valor: transacao.valor,
          data: transacao.data,
          valor_dizimo: valorDizimo
        }])
        .select(`
          *,
          categoria:categorias_financeiras(nome, cor, icone)
        `)
      
      if (entradaError) throw entradaError
      
      // Buscar ou criar categoria de dízimo
      let categoriaDizimo = categorias.value.find(c => c.tipo === 'dizimo')
      if (!categoriaDizimo) {
        const { data: novaCat, error: catError } = await supabase
          .from('categorias_financeiras')
          .insert([{
            nome: 'Dízimo',
            tipo: 'dizimo',
            cor: '#10B981',
            icone: 'church'
          }])
          .select('*')
        
        if (catError) throw catError
        if (novaCat && novaCat[0]) {
          categoriaDizimo = novaCat[0]
          categorias.value.push(categoriaDizimo)
        }
      }
      
      // Inserir o dízimo automaticamente
      if (categoriaDizimo) {
        const { data: dizimoData, error: dizimoError } = await supabase
          .from('transacoes_financeiras')
          .insert([{
            usuario_id: user.id,
            tipo: 'dizimo',
            categoria_id: categoriaDizimo.id,
            descricao: `Dízimo - ${transacao.descricao}`,
            valor: valorDizimo,
            data: transacao.data,
            transacao_origem_id: entradaData?.[0]?.id
          }])
          .select(`
            *,
            categoria:categorias_financeiras(nome, cor, icone)
          `)
        
        if (dizimoError) throw dizimoError
        
        // Adicionar ambas transações à lista
        if (entradaData && entradaData[0]) {
          transacoes.value.unshift(entradaData[0])
        }
        if (dizimoData && dizimoData[0]) {
          transacoes.value.unshift(dizimoData[0])
        }
      }
      
      return entradaData?.[0]
    } catch (err: any) {
      errorMessage.value = err.message
      console.error('Erro ao adicionar entrada:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const adicionarDespesa = async (despesa: { categoria: string, descricao: string, valor: number, data_vencimento: string }) => {
    try {
      clearError()
      isLoading.value = true
      
      // Obter usuário atual da sessão
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Usuário não autenticado')
      }
      
      const { data, error } = await supabase
        .from('transacoes_financeiras')
        .insert([{
          usuario_id: user.id,
          tipo: 'saida',
          categoria_id: despesa.categoria,
          descricao: despesa.descricao,
          valor: despesa.valor,
          data: new Date().toISOString().split('T')[0], // Data atual
          data_vencimento: despesa.data_vencimento
        }])
        .select(`
          *,
          categoria:categorias_financeiras(nome, cor, icone)
        `)
      
      if (error) throw error
      
      if (data && data[0]) {
        transacoes.value.unshift(data[0])
      }
      
      return data?.[0]
    } catch (err: any) {
      errorMessage.value = err.message
      console.error('Erro ao adicionar despesa:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const editarTransacao = async (id: string, updates: Partial<TransacaoFinanceira>) => {
    try {
      clearError()
      isLoading.value = true
      
      const { data, error } = await supabase
        .from('transacoes_financeiras')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          categoria:categorias_financeiras(nome, cor, icone)
        `)
      
      if (error) throw error
      
      if (data && data[0]) {
        const index = transacoes.value.findIndex(t => t.id === id)
        if (index !== -1) {
          transacoes.value[index] = data[0]
        }
      }
      
      return data?.[0]
    } catch (err: any) {
      errorMessage.value = err.message
      console.error('Erro ao editar transação:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const excluirTransacao = async (id: string) => {
    try {
      clearError()
      isLoading.value = true
      
      const { error } = await supabase
        .from('transacoes_financeiras')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      transacoes.value = transacoes.value.filter(t => t.id !== id)
      
      return true
    } catch (err: any) {
      errorMessage.value = err.message
      console.error('Erro ao excluir transação:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }
  
  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
  }
  
  const despesasVencidas = computed(() => {
    const hoje = new Date().toISOString().split('T')[0]
    return transacoes.value.filter(t => 
      t.tipo === 'saida' && 
      t.data_vencimento && 
      hoje && 
      t.data_vencimento < hoje
    )
  })
  
  const despesasVencendoHoje = computed(() => {
    const hoje = new Date().toISOString().split('T')[0]
    return transacoes.value.filter(t => 
      t.tipo === 'saida' && 
      t.data_vencimento && 
      hoje &&
      t.data_vencimento === hoje
    )
  })

  // Função para adicionar despesa avançada (única, recorrente ou parcelada)
  const adicionarDespesaAvancada = async (despesa: any) => {
    try {
      clearError()
      isLoading.value = true

      if (despesa.tipo_despesa === 'parcelada') {
        return await criarDespesaParcelada(despesa)
      } else if (despesa.tipo_despesa === 'recorrente') {
        return await criarDespesaRecorrente(despesa)
      } else {
        return await criarDespesaUnica(despesa)
      }
    } catch (err: any) {
      errorMessage.value = err.message
      console.error('Erro ao adicionar despesa:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Criar despesa única
  const criarDespesaUnica = async (despesa: any) => {
    // Obter usuário atual da sessão
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }
    
    const { data, error } = await supabase
      .from('transacoes_financeiras')
      .insert([{
        usuario_id: user.id,
        tipo: 'saida',
        categoria_id: despesa.categoria,
        descricao: despesa.descricao,
        valor: despesa.valor,
        data: despesa.data_vencimento,
        data_vencimento: despesa.data_vencimento,
        tipo_despesa: 'unica',
        status_pagamento: 'pendente',
        observacoes: despesa.observacoes
      }])
      .select(`
        *,
        categoria:categorias_financeiras(nome, cor, icone)
      `)

    if (error) throw error
    
    await fetchTransacoes()
    return data
  }

  // Criar despesa parcelada
  const criarDespesaParcelada = async (despesa: any) => {
    // Obter usuário atual da sessão
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }
    
    const valorParcela = despesa.valor / despesa.total_parcelas
    const dataBase = new Date(despesa.data_vencimento)
    const despesasParceladas = []

    for (let i = 1; i <= despesa.total_parcelas; i++) {
      const dataVencimento = new Date(dataBase)
      dataVencimento.setMonth(dataBase.getMonth() + (i - 1))
      
      const despesaParcela = {
        usuario_id: user.id,
        tipo: 'saida',
        categoria_id: despesa.categoria,
        descricao: `${despesa.descricao} (${i}/${despesa.total_parcelas})`,
        valor: valorParcela,
        data: dataVencimento.toISOString().split('T')[0],
        data_vencimento: dataVencimento.toISOString().split('T')[0],
        tipo_despesa: 'parcelada',
        status_pagamento: 'pendente',
        total_parcelas: despesa.total_parcelas,
        parcela_atual: i,
        valor_total: despesa.valor,
        observacoes: despesa.observacoes
      }
      
      despesasParceladas.push(despesaParcela)
    }

    const { data, error } = await supabase
      .from('transacoes_financeiras')
      .insert(despesasParceladas)
      .select(`
        *,
        categoria:categorias_financeiras(nome, cor, icone)
      `)

    if (error) throw error
    
    await fetchTransacoes()
    return data
  }

  // Criar despesa recorrente (apenas a primeira ocorrência)
  const criarDespesaRecorrente = async (despesa: any) => {
    // Obter usuário atual da sessão
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }
    
    const { data, error } = await supabase
      .from('transacoes_financeiras')
      .insert([{
        usuario_id: user.id,
        tipo: 'saida',
        categoria_id: despesa.categoria,
        descricao: `${despesa.descricao} (Recorrente - ${despesa.frequencia_recorrencia})`,
        valor: despesa.valor,
        data: despesa.data_vencimento,
        data_vencimento: despesa.data_vencimento,
        tipo_despesa: 'recorrente',
        status_pagamento: 'pendente',
        frequencia_recorrencia: despesa.frequencia_recorrencia,
        observacoes: despesa.observacoes
      }])
      .select(`
        *,
        categoria:categorias_financeiras(nome, cor, icone)
      `)

    if (error) throw error
    
    await fetchTransacoes()
    return data
  }

  // Marcar despesa como paga
  const marcarComoPago = async (transacaoId: string) => {
    try {
      clearError()
      isLoading.value = true

      const { data, error } = await supabase
        .from('transacoes_financeiras')
        .update({
          status_pagamento: 'pago',
          data_pagamento: new Date().toISOString().split('T')[0]
        })
        .eq('id', transacaoId)
        .select()

      if (error) throw error

      await fetchTransacoes()
      return data
    } catch (err: any) {
      errorMessage.value = err.message
      console.error('Erro ao marcar como pago:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Estornar pagamento
  const estornarPagamento = async (transacaoId: string) => {
    try {
      clearError()
      isLoading.value = true

      const { data, error } = await supabase
        .from('transacoes_financeiras')
        .update({
          status_pagamento: 'pendente',
          data_pagamento: null
        })
        .eq('id', transacaoId)
        .select()

      if (error) throw error

      await fetchTransacoes()
      return data
    } catch (err: any) {
      errorMessage.value = err.message
      console.error('Erro ao estornar pagamento:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    // Estados
    transacoes: readonly(transacoes),
    categorias: readonly(categorias),
    isLoading: readonly(isLoading),
    errorMessage: readonly(errorMessage),
    
    // Computeds
    resumoFinanceiro: readonly(resumoFinanceiro),
    categoriasEntrada: readonly(categoriasEntrada),
    categoriasSaida: readonly(categoriasSaida),
    categoriasDizimo: readonly(categoriasDizimo),
    despesasVencidas: readonly(despesasVencidas),
    despesasVencendoHoje: readonly(despesasVencendoHoje),
    
    // Funções
    fetchCategorias,
    fetchTransacoes,
    adicionarEntrada,
    adicionarDespesa,
    adicionarDespesaAvancada,
    marcarComoPago,
    estornarPagamento,
    editarTransacao,
    excluirTransacao,
    formatarMoeda,
    formatarData,
    clearError
  }
}