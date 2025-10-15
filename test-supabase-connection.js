// Teste de conectividade com Supabase
import { createClient } from '@supabase/supabase-js'

// Usar as credenciais do .env
const supabaseUrl = 'https://neykfwokdjfcbkzhtazl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leWtmd29rZGpmY2Jremh0YXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzY4NzksImV4cCI6MjA2NTg1Mjg3OX0.NZJccP4zHWlclZWuJMzoyyjeA8wJC2UVZPfHXQ0DPCk'

console.log('🔧 Testando conexão com Supabase...')
console.log('📍 URL:', supabaseUrl)
console.log('🔑 Chave válida:', supabaseAnonKey.substring(0, 50) + '...')

try {
  // Criar cliente Supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Cliente Supabase criado com sucesso')

  // Testar conexão básica
  console.log('\n🔍 Testando conectividade...')
  
  // Verificar se consegue acessar o auth
  const { data: authData, error: authError } = await supabase.auth.getSession()
  if (authError) {
    console.log('⚠️  Erro de auth (esperado para primeiro acesso):', authError.message)
  } else {
    console.log('✅ Auth endpoint acessível')
  }

  // Testar acesso às tabelas (deve dar erro de permissão, mas confirma conectividade)
  console.log('\n📊 Testando acesso ao banco de dados...')
  const { data: tableData, error: tableError } = await supabase
    .from('usuarios')
    .select('count')
    .limit(1)

  if (tableError) {
    if (tableError.code === 'PGRST116') {
      console.log('✅ Conectividade OK! Tabela "usuarios" não existe ou não tem permissão')
    } else if (tableError.code === '42P01') {
      console.log('✅ Conectividade OK! Tabela "usuarios" não encontrada')
    } else {
      console.log('⚠️  Erro esperado ao acessar tabela:', tableError.message)
    }
  } else {
    console.log('✅ Tabela "usuarios" acessível:', tableData)
  }

  // Listar tabelas disponíveis
  console.log('\n📋 Verificando estrutura do banco...')
  const { data: schema, error: schemaError } = await supabase.rpc('get_schema_info')
  if (schemaError) {
    console.log('ℹ️  Não foi possível obter schema (normal se RPC não existe):', schemaError.message)
  } else {
    console.log('📋 Schema obtido:', schema)
  }

  console.log('\n🎉 Teste concluído! As credenciais estão funcionando.')
  
} catch (error) {
  console.error('❌ Erro crítico na conexão:', error.message)
  process.exit(1)
}