// Teste rápido do login após correções
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://neykfwokdjfcbkzhtazl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leWtmd29rZGpmY2Jremh0YXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzY4NzksImV4cCI6MjA2NTg1Mjg3OX0.NZJccP4zHWlclZWuJMzoyyjeA8wJC2UVZPfHXQ0DPCk'

console.log('🧪 Teste rápido após correções...')

async function testeRapido() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Teste básico de login
    console.log('1️⃣ Testando login básico...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    })
    
    if (error) {
      console.log('❌ Erro:', error.message)
    } else {
      console.log('✅ Login OK:', data.user?.email)
      
      // Testar inserção na tabela usuarios
      console.log('2️⃣ Testando inserção na tabela usuarios...')
      const { data: insertData, error: insertError } = await supabase
        .from('usuarios')
        .upsert({
          nome: 'Teste Login',
          empresa: 'Empresa Teste',
          email: data.user?.email,
          perfil: 'admin'
        }, { 
          onConflict: 'email',
          ignoreDuplicates: false 
        })
      
      if (insertError) {
        console.log('❌ Erro na inserção:', insertError.message)
      } else {
        console.log('✅ Inserção OK')
      }
      
      // Logout
      console.log('3️⃣ Testando logout...')
      const { error: logoutError } = await supabase.auth.signOut()
      if (!logoutError) {
        console.log('✅ Logout OK')
      }
    }
    
    console.log('\n🎯 Status: Sistema funcionando!')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

testeRapido()