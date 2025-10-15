// Teste para verificar se a tabela de configurações foi criada corretamente
const { createClient } = require('@supabase/supabase-js')

async function testConfig() {
  try {
    const supabaseUrl = 'https://neykfwokdjfcbkzhtazl.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leWtmd29rZGpmY2Jremh0YXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NDY1MjIsImV4cCI6MjA1MDEyMjUyMn0.3woT7yh4iVCCCm1sHeaEYcl3VtSuvcxYs0IM2IpvS4A'
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Testar se a tabela existe
    const { data: tables, error: tablesError } = await supabase
      .from('configuracoes')
      .select('*')
      .limit(1)

    console.log('Teste de conexão:')
    console.log('Error:', tablesError)
    console.log('Data:', tables)

    // Tentar buscar o token
    const { data: config, error: configError } = await supabase
      .from('configuracoes')
      .select('*')
      .eq('chave', 'openai_token')

    console.log('\nTeste de busca do token:')
    console.log('Error:', configError)
    console.log('Data:', config)

  } catch (error) {
    console.error('Erro no teste:', error)
  }
}

testConfig()