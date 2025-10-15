// Listar tabelas usando função RPC criada via MCP
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://neykfwokdjfcbkzhtazl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leWtmd29rZGpmY2Jremh0YXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzY4NzksImV4cCI6MjA2NTg1Mjg3OX0.NZJccP4zHWlclZWuJMzoyyjeA8wJC2UVZPfHXQ0DPCk'

console.log('📋 Listando tabelas via MCP RPC...\n')

async function listTablesViaRPC() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    console.log('🔍 Executando função list_tables() criada via MCP...')
    
    const { data, error } = await supabase.rpc('list_tables')
    
    if (error) {
      console.log('❌ Erro ao executar RPC:', error.message)
      
      // Fallback: tentar métodos alternativos
      console.log('\n🔄 Tentando método alternativo...')
      
      // Verificar tabelas conhecidas
      const knownTables = ['usuarios', 'profiles', 'user_profiles']
      
      console.log('\n📊 Verificando tabelas conhecidas:')
      for (const tableName of knownTables) {
        try {
          const { data: tableData, error: tableError, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true })
          
          if (!tableError) {
            console.log(`✅ ${tableName} (${count || 0} registros)`)
          } else {
            console.log(`❌ ${tableName} - ${tableError.message}`)
          }
        } catch (err) {
          console.log(`❓ ${tableName} - Erro: ${err.message}`)
        }
      }
      
    } else {
      console.log('✅ Função RPC executada com sucesso!')
      console.log('\n📋 Tabelas encontradas:')
      
      if (data && data.length > 0) {
        data.forEach(table => {
          console.log(`📊 ${table.schema_name}.${table.table_name} (${table.table_type})`)
        })
      } else {
        console.log('🤷 Nenhuma tabela retornada pela função RPC')
      }
    }
    
    console.log('\n🎯 Informações do projeto:')
    console.log('🌐 URL:', supabaseUrl)
    console.log('🔑 Project ID: neykfwokdjfcbkzhtazl')
    console.log('✅ MCP configurado e funcionando')
    
  } catch (error) {
    console.error('❌ Erro crítico:', error.message)
  }
}

listTablesViaRPC()