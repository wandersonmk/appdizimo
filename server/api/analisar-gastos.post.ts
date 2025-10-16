export default defineEventHandler(async (event) => {
  console.log('🔍 INICIANDO ANÁLISE DE GASTOS')
  
  try {
    const { message } = await readBody(event)
    console.log('📝 Mensagem recebida:', message)
    
    const user = await serverSupabaseUser(event)
    if (!user) {
      console.log('❌ Usuário não autenticado')
      return { 
        response: 'Por favor, faça login para analisar seus gastos.', 
        status: 'error' 
      }
    }
    
    console.log('✅ Usuário autenticado:', user.id)
    
    const client = serverSupabaseClient(event)
    
    // Buscar transações do usuário
    console.log('🔎 Buscando transações...')
    const { data: transacoes, error } = await client
      .from('transacoes_financeiras')
      .select('*')
      .eq('user_id', user.id)
      .order('data', { ascending: false })
    
    if (error) {
      console.error('❌ Erro Supabase:', error)
      return { 
        response: 'Erro ao acessar seus dados financeiros.', 
        status: 'error' 
      }
    }
    
    console.log(`📊 Encontradas ${transacoes?.length || 0} transações`)
    
    if (!transacoes || transacoes.length === 0) {
      console.log('ℹ️ Nenhuma transação encontrada')
      return {
        response: '💸 Ainda não encontrei transações registradas para você.\n\n📝 Para começar a análise:\n1. Registre suas receitas e despesas\n2. Categorize as transações\n3. Volte aqui para uma análise completa! 💰',
        status: 'success'
      }
    }
    
    // Calcular totais simplificado
    console.log('💰 Calculando totais...')
    let totalGastos = 0
    let totalEntradas = 0
    let totalDizimo = 0
    
    transacoes.forEach((transacao: any) => {
      const valor = Number(transacao.valor) || 0
      
      if (transacao.tipo === 'saida') {
        totalGastos += valor
      } else if (transacao.tipo === 'entrada') {
        totalEntradas += valor
      } else if (transacao.tipo === 'dizimo') {
        totalDizimo += valor
      }
    })
    
    const saldoLiquido = totalEntradas - totalGastos - totalDizimo
    
    console.log(`💰 Resumo: Gastos=R$${totalGastos}, Entradas=R$${totalEntradas}, Dízimo=R$${totalDizimo}, Saldo=R$${saldoLiquido}`)
    
    // Preparar dados para OpenAI
    const dadosFinanceiros = {
      totalGastos: totalGastos.toFixed(2),
      totalEntradas: totalEntradas.toFixed(2), 
      totalDizimo: totalDizimo.toFixed(2),
      saldoLiquido: saldoLiquido.toFixed(2),
      totalTransacoes: transacoes.length,
      situacao: saldoLiquido >= 0 ? 'positiva' : 'negativa'
    }
    
    // Chamar OpenAI
    console.log('🤖 Enviando para OpenAI...')
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      throw new Error('Chave da OpenAI não configurada')
    }
    
    // Fazer chamada HTTP para OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um consultor financeiro experiente. Analise os dados e forneça insights práticos.'
          },
          {
            role: 'user',
            content: `Analise esta situação financeira:
            
• Receitas: R$ ${dadosFinanceiros.totalEntradas}
• Gastos: R$ ${dadosFinanceiros.totalGastos}  
• Dízimo: R$ ${dadosFinanceiros.totalDizimo}
• Saldo: R$ ${dadosFinanceiros.saldoLiquido}
• Transações: ${dadosFinanceiros.totalTransacoes}

Dê insights práticos e recomendações. Use emojis. Máximo 300 palavras.`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API erro: ${response.status}`)
    }
    
    const openaiResult = await response.json()
    const analiseIA = openaiResult.choices?.[0]?.message?.content || 'Não foi possível processar a análise.'
    
    console.log('✅ Análise IA concluída com sucesso')
    console.log('📄 Resposta (primeiros 100 chars):', analiseIA.substring(0, 100))
    
    return {
      response: analiseIA,
      status: 'success',
      dados: dadosFinanceiros
    }
    
  } catch (error) {
    console.error('💥 Erro na análise de gastos:', error)
    return {
      response: 'Desculpe, ocorreu um erro ao analisar seus gastos. Tente novamente em alguns instantes. 😔',
      status: 'error'
    }
  }
})