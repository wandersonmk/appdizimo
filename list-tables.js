// Listar tabelas do Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://neykfwokdjfcbkzhtazl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leWtmd29rZGpmY2Jremh0YXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzY4NzksImV4cCI6MjA2NTg1Mjg3OX0.NZJccP4zHWlclZWuJMzoyyjeA8wJC2UVZPfHXQ0DPCk'

console.log('📋 Listando tabelas do Supabase...\n')

async function listTables() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Tentar diferentes métodos para listar tabelas
    console.log('🔍 Método 1: Verificando tabelas conhecidas...')
    
    const knownTables = ['usuarios', 'auth', 'storage', 'realtime']
    
    for (const tableName of knownTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1)
        
        if (!error) {
          console.log(`✅ Tabela encontrada: ${tableName}`)
        }
      } catch (err) {
        // Tabela não existe ou sem permissão
      }
    }
    
    console.log('\n🔍 Método 2: Listando via REST API...')
    
    try {
      // Tentar acessar o endpoint de informações do schema
      const response = await fetch(`${supabaseUrl}/rest/v1/?select=*`, {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey,
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        console.log('✅ REST API acessível')
      } else {
        console.log('❌ REST API status:', response.status)
      }
    } catch (err) {
      console.log('❌ Erro na REST API:', err.message)
    }
    
    console.log('\n🔍 Método 3: Testando tabelas do sistema...')
    
    // Testar algumas tabelas conhecidas do Supabase
    const systemTables = [
      'usuarios',
      'profiles', 
      'user_profiles',
      'auth.users'
    ]
    
    for (const table of systemTables) {
      try {
        let tableName = table
        let schema = 'public'
        
        if (table.includes('.')) {
          [schema, tableName] = table.split('.')
        }
        
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
        
        if (!error) {
          console.log(`✅ ${table} - ${count || 0} registros`)
        }
      } catch (err) {
        // Ignora erros
      }
    }
    
    console.log('\n📊 Informações adicionais:')
    console.log('🌐 URL:', supabaseUrl)
    console.log('🔑 Project ID: neykfwokdjfcbkzhtazl')
    console.log('✅ Auth configurado')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

listTables()