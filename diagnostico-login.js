// Diagnóstico completo do sistema de login
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://neykfwokdjfcbkzhtazl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leWtmd29rZGpmY2Jremh0YXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzY4NzksImV4cCI6MjA2NTg1Mjg3OX0.NZJccP4zHWlclZWuJMzoyyjeA8wJC2UVZPfHXQ0DPCk'

console.log('🔍 Diagnóstico do sistema de login...\n')

async function diagnosticarLogin() {
  try {
    // 1. Teste de conectividade básica
    console.log('1️⃣ Testando conectividade básica...')
    
    try {
      const response = await fetch(supabaseUrl)
      console.log('✅ URL acessível:', response.status)
    } catch (fetchError) {
      console.log('❌ Erro de conectividade:', fetchError.message)
      if (fetchError.message.includes('ERR_NAME_NOT_RESOLVED')) {
        console.log('💡 Possível problema: DNS não consegue resolver o domínio')
        console.log('🔧 Soluções: Verificar conexão com internet ou DNS')
        return
      }
    }

    // 2. Teste do cliente Supabase
    console.log('\n2️⃣ Testando cliente Supabase...')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Cliente Supabase criado')

    // 3. Teste de autenticação - verificar sessão
    console.log('\n3️⃣ Verificando autenticação...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ Erro ao obter sessão:', sessionError.message)
    } else {
      console.log('✅ Auth endpoint acessível')
      console.log('📄 Sessão atual:', sessionData.session ? 'Existe' : 'Nenhuma')
    }

    // 4. Teste de signup (criar usuário teste)
    console.log('\n4️⃣ Testando signup...')
    const testEmail = `test_${Date.now()}@exemplo.com`
    const testPassword = 'MinhaSenh@123!'
    
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    })

    if (signupError) {
      console.log('❌ Erro no signup:', signupError.message)
      
      if (signupError.message.includes('signup is disabled')) {
        console.log('💡 Signup desabilitado - vamos testar com usuário existente')
      } else if (signupError.message.includes('Invalid email')) {
        console.log('💡 Email inválido - formato de email rejeitado')
      } else if (signupError.message.includes('Password')) {
        console.log('💡 Problema com senha - política de senha não atendida')
      }
    } else {
      console.log('✅ Signup funcionando!')
      console.log('📧 Email:', testEmail)
      console.log('👤 Usuário criado:', !!signupData.user)
      
      // Se o usuário foi criado, testar login
      if (signupData.user) {
        console.log('\n5️⃣ Testando login com usuário recém-criado...')
        
        // Aguardar um pouco para o sistema processar
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        })
        
        if (loginError) {
          console.log('❌ Erro no login:', loginError.message)
          
          if (loginError.message.includes('Email not confirmed')) {
            console.log('💡 Email não confirmado - verificar configurações de confirmação')
          } else if (loginError.message.includes('Invalid login credentials')) {
            console.log('💡 Credenciais inválidas - pode ser problema de timing')
          }
        } else {
          console.log('✅ Login funcionando!')
          console.log('👤 Usuário logado:', loginData.user?.email)
        }
      }
    }

    // 6. Testar com usuário conhecido (se existir)
    console.log('\n6️⃣ Testando login com credenciais conhecidas...')
    const { data: knownUserLogin, error: knownUserError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com', // Usuário que criamos antes
      password: 'testpassword123'
    })
    
    if (knownUserError) {
      console.log('ℹ️  Login com usuário conhecido falhou:', knownUserError.message)
    } else {
      console.log('✅ Login com usuário conhecido funcionou!')
    }

    // 7. Verificar tabela usuarios
    console.log('\n7️⃣ Verificando tabela usuarios...')
    const { data: usuariosData, error: usuariosError } = await supabase
      .from('usuarios')
      .select('count')

    if (usuariosError) {
      console.log('❌ Erro ao acessar tabela usuarios:', usuariosError.message)
    } else {
      console.log('✅ Tabela usuarios acessível')
    }

    console.log('\n🎯 Resumo do diagnóstico:')
    console.log('🌐 Conectividade:', response ? '✅ OK' : '❌ Falhou')
    console.log('🔐 Auth endpoint:', sessionError ? '❌ Erro' : '✅ OK')
    console.log('📝 Signup:', signupError ? '❌ Erro' : '✅ OK')
    console.log('🔑 Login:', 'Verificar logs acima')
    console.log('📊 Tabela usuarios:', usuariosError ? '❌ Erro' : '✅ OK')

  } catch (error) {
    console.error('❌ Erro crítico no diagnóstico:', error.message)
    
    if (error.message.includes('fetch')) {
      console.log('💡 Problema de rede - verificar conexão com internet')
    } else if (error.message.includes('DNS')) {
      console.log('💡 Problema de DNS - verificar configurações de rede')
    }
  }
}

diagnosticarLogin()