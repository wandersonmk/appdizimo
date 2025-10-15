// Teste específico do sistema de login
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://neykfwokdjfcbkzhtazl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leWtmd29rZGpmY2Jremh0YXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzY4NzksImV4cCI6MjA2NTg1Mjg3OX0.NZJccP4zHWlclZWuJMzoyyjeA8wJC2UVZPfHXQ0DPCk'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔐 Testando funcionalidades de autenticação...\n')

async function testAuthFlow() {
  try {
    // 1. Verificar se Auth está habilitado
    console.log('1️⃣ Verificando se Auth está habilitado...')
    const { data: session, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ Erro ao acessar Auth:', sessionError.message)
      return
    }
    console.log('✅ Auth está habilitado e acessível')
    console.log('📄 Sessão atual:', session?.session ? 'Existe sessão ativa' : 'Nenhuma sessão ativa')

    // 2. Testar estrutura da tabela usuarios
    console.log('\n2️⃣ Verificando estrutura da tabela "usuarios"...')
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(1)

    if (usuariosError) {
      console.log('❌ Erro ao acessar tabela "usuarios":', usuariosError.message)
      console.log('💡 Isto significa que a tabela não existe ou precisa ser criada')
      
      // Vamos tentar ver quais tabelas existem
      console.log('\n🔍 Tentando listar tabelas existentes...')
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
      
      if (tablesError) {
        console.log('❌ Não foi possível listar tabelas:', tablesError.message)
      } else {
        console.log('📋 Tabelas encontradas:', tables?.map(t => t.table_name) || 'Nenhuma')
      }
    } else {
      console.log('✅ Tabela "usuarios" existe e é acessível')
      console.log('📊 Dados encontrados:', usuarios?.length || 0, 'registros')
    }

    // 3. Testar criação de usuário (signup)
    console.log('\n3️⃣ Testando funcionalidade de signup...')
    const testEmail = 'test@example.com'
    const testPassword = 'testpassword123'
    
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })

    if (signupError) {
      if (signupError.message.includes('User already registered')) {
        console.log('⚠️  Usuário já existe (normal para teste)')
        
        // 4. Testar login
        console.log('\n4️⃣ Testando login com usuário existente...')
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        })
        
        if (loginError) {
          console.log('❌ Erro no login:', loginError.message)
        } else {
          console.log('✅ Login realizado com sucesso!')
          console.log('👤 Usuário:', loginData.user?.email)
          
          // 5. Testar logout
          console.log('\n5️⃣ Testando logout...')
          const { error: logoutError } = await supabase.auth.signOut()
          if (logoutError) {
            console.log('❌ Erro no logout:', logoutError.message)
          } else {
            console.log('✅ Logout realizado com sucesso!')
          }
        }
      } else {
        console.log('❌ Erro no signup:', signupError.message)
        
        // Verificar se é problema de configuração
        if (signupError.message.includes('signup is disabled')) {
          console.log('💡 Signup está desabilitado no Supabase. Habilite em: Auth > Settings > Authentication')
        }
      }
    } else {
      console.log('✅ Signup realizado com sucesso! (confirmação pode ser necessária)')
      console.log('📧 Email de confirmação pode ter sido enviado para:', testEmail)
    }

    console.log('\n🎯 Resumo do teste:')
    console.log('✅ Conexão com Supabase: OK')
    console.log('✅ Acesso ao Auth: OK')
    console.log('❓ Tabela usuarios: Verificar se existe')
    console.log('❓ Políticas RLS: Verificar se estão configuradas')

  } catch (error) {
    console.error('❌ Erro crítico no teste:', error.message)
  }
}

testAuthFlow()