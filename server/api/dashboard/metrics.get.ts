export default defineEventHandler(async (event) => {
  try {
    // Como não temos acesso direto ao MCP no server-side, vamos retornar
    // dados que serão populados pelo frontend via composables
    // O frontend já tem acesso ao Supabase via useSupabaseClient
    
    // Por enquanto, retornamos uma estrutura que o frontend vai popular
    // com os dados reais do usuário logado
    return {
      entradas_hoje: "0",
      saidas_hoje: "0",
      total_transacoes: 0,
      dizimo_mes: "0",
      saldo_mensal: "0",
      // Flag para indicar que deve buscar dados reais
      requires_user_data: true
    }

  } catch (error) {
    console.error('Erro na API de métricas:', error)
    
    return {
      entradas_hoje: "0",
      saidas_hoje: "0",
      total_transacoes: 0,
      dizimo_mes: "0",
      saldo_mensal: "0"
    }
  }
})