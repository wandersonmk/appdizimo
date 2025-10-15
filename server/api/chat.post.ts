export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { message } = body

    if (!message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mensagem é obrigatória'
      })
    }

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
            content: 'Você é um assistente virtual amigável especializado em gestão financeira e dízimo 💰. Suas respostas devem ser: 1) RESUMIDAS e diretas ao ponto 📝 2) Com EMOJIS para facilitar a leitura 😊 3) Linguagem simples e amigável 🤝 4) Máximo 3-4 frases por resposta 📏. Ajude com cálculos de dízimo, organização financeira, planejamento e economia de forma clara e objetiva.'
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
          content: "💡 **Dica rápida:** Informação principal resumida em 1-2 frases.\n\n📊 **Como fazer:** Passo simples e direto.\n\n✅ **Resultado:** Benefício em uma frase com emoji."
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