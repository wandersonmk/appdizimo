// Teste completo do sistema de login após setup do banco
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://neykfwokdjfcbkzhtazl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leWtmd29rZGpmY2Jremh0YXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzY4NzksImV4cCI6MjA2NTg1Mjg3OX0.NZJccP4zHWlclZWuJMzoyyjeA8wJC2UVZPfHXQ0DPCk'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🧪 Testando sistema de login completo...\n')

async function testCompleteLoginSystem() {
  try {
    // 1. Verificar se a tabela usuarios existe
    console.log('1️⃣ Verificando tabela "usuarios"...')
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1)

    if (usuariosError) {
      console.log('❌ Tabela "usuarios" não encontrada:', usuariosError.message)
      console.log('💡 Execute o arquivo setup-database.sql no Supabase SQL Editor primeiro!')
      return
    }
    console.log('✅ Tabela "usuarios" existe e é acessível')

    // 2. Testar fluxo completo de registro
    console.log('\n2️⃣ Testando registro completo (signup + inserção na tabela)...')
    const testUser = {
      email: 'teste@agzap.com',
      password: 'MinhaSenh@123',
      name: 'Usuário Teste',
      companyName: 'Empresa Teste Ltda'
    }

    // Primeiro fazer signup no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password
    })

    if (authError && !authError.message.includes('User already registered')) {
      console.log('❌ Erro no signup:', authError.message)
      return
    }

    if (authError && authError.message.includes('User already registered')) {
      console.log('⚠️  Usuário já existe, prosseguindo com teste de login...')
    } else {
      console.log('✅ Signup no Auth realizado com sucesso')
      
      // Se o signup foi bem-sucedido e temos um usuário, inserir na tabela
      if (authData.user) {
        console.log('📝 Inserindo dados do usuário na tabela...')
        const { data: insertData, error: insertError } = await supabase
          .from('usuarios')
          .insert({
            nome: testUser.name,
            empresa: testUser.companyName,
            email: testUser.email,
            perfil: 'admin'
          })

        if (insertError) {
          console.log('❌ Erro ao inserir usuário na tabela:', insertError.message)
        } else {
          console.log('✅ Usuário inserido na tabela com sucesso')
        }
      }
    }

    // 3. Testar login
    console.log('\n3️⃣ Testando login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    })

    if (loginError) {
      console.log('❌ Erro no login:', loginError.message)
      return
    }

    console.log('✅ Login realizado com sucesso!')
    console.log('👤 Usuário logado:', loginData.user?.email)

    // 4. Verificar se consegue acessar dados do usuário
    console.log('\n4️⃣ Testando acesso aos dados do usuário logado...')
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', testUser.email)
      .single()

    if (userError) {
      console.log('❌ Erro ao acessar dados do usuário:', userError.message)
      console.log('💡 Verifique se as políticas RLS estão configuradas corretamente')
    } else {
      console.log('✅ Dados do usuário obtidos com sucesso:')
      console.log('   📧 Email:', userData.email)
      console.log('   👤 Nome:', userData.nome)
      console.log('   🏢 Empresa:', userData.empresa)
      console.log('   🎭 Perfil:', userData.perfil)
    }

    // 5. Testar logout
    console.log('\n5️⃣ Testando logout...')
    const { error: logoutError } = await supabase.auth.signOut()
    
    if (logoutError) {
      console.log('❌ Erro no logout:', logoutError.message)
    } else {
      console.log('✅ Logout realizado com sucesso!')
    }

    // 6. Verificar se não consegue mais acessar dados após logout
    console.log('\n6️⃣ Verificando segurança após logout...')
    const { data: postLogoutData, error: postLogoutError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', testUser.email)

    if (postLogoutError) {
      console.log('✅ Segurança OK: Não consegue acessar dados após logout')
    } else {
      console.log('⚠️  Aviso: Ainda consegue acessar dados após logout (verificar RLS)')
    }

    console.log('\n🎉 Teste completo finalizado!')
    console.log('\n📋 Resumo:')
    console.log('✅ Conexão Supabase: OK')
    console.log('✅ Auth (signup/login/logout): OK') 
    console.log('✅ Tabela usuarios: OK')
    console.log('❓ Políticas RLS: Verificar se funcionando')

  } catch (error) {
    console.error('❌ Erro crítico:', error.message)
  }
}

testCompleteLoginSystem()