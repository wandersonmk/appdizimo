export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { message, userId } = body

    if (!message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mensagem é obrigatória'
      })
    }

    // O endpoint de chat não deve interceptar análise de gastos - isso é feito no componente

    // Token OpenAI vindo das variáveis de ambiente
    const openaiToken = process.env.OPENAI_API_TOKEN
    
    if (!openaiToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Token OpenAI não configurado nas variáveis de ambiente'
      })
    }
    
    console.log('Using OpenAI token from env, length:', openaiToken.length)

    // Fazer requisição para OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Dizimo-App/1.0'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente virtual EXCLUSIVAMENTE para temas financeiros 💰. REGRAS RÍGIDAS: 1) APENAS responda sobre: finanças pessoais, dízimo, economia, investimentos, orçamento, gastos, receitas, poupança, planejamento financeiro � 2) Se a pergunta NÃO for sobre finanças, responda: "🚫 Desculpe, só posso ajudar com questões financeiras! Como posso te ajudar com suas finanças hoje? 💰" 3) Respostas RESUMIDAS (máximo 3-4 frases) � 4) Use EMOJIS 😊 5) Linguagem simples e amigável 🤝. Foque APENAS em finanças!'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        prediction: {
          type: "content",
          content: "� **Dica Financeira:** Orientação específica sobre finanças em 1-2 frases.\n\n📊 **Ação:** Passo prático para organizar suas finanças.\n\n✅ **Benefício:** Como isso vai melhorar sua situação financeira."
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: { message: errorText } }
      }
      
      console.error('OpenAI API Error:', response.status, errorData)
      
      throw createError({
        statusCode: response.status,
        statusMessage: `Erro da OpenAI: ${errorData.error?.message || `HTTP ${response.status}`}`
      })
    }

    const data = await response.json()
    console.log('OpenAI Response:', JSON.stringify(data, null, 2))
    
    const aiResponse = data.choices?.[0]?.message?.content

    if (!aiResponse) {
      console.error('Invalid OpenAI response structure:', data)
      throw createError({
        statusCode: 500,
        statusMessage: 'Resposta inválida da IA - estrutura não esperada'
      })
    }

    return {
      success: true,
      response: aiResponse
    }

  } catch (error: any) {
    console.error('Erro no chat:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erro interno do servidor'
    })
  }
})