// Criar tabela usuarios usando as credenciais do MCP
import { createClient } from '@supabase/supabase-js'

const projectRef = 'neykfwokdjfcbkzhtazl'
const accessToken = 'sb_publishable_aHt3Vdj5ZfDPKEGUwNRnIg_CWpn1bm1'
const supabaseUrl = `https://${projectRef}.supabase.co`

console.log('🏗️  Criando estrutura do banco usando MCP credentials...')

async function setupDatabase() {
  try {
    const supabase = createClient(supabaseUrl, accessToken)
    
    console.log('\n📋 Verificando tabelas existentes...')
    
    // Tentar diferentes formas de listar tabelas
    const queries = [
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'",
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
      "\\dt"
    ]
    
    let tablesFound = false
    for (const query of queries) {
      try {
        console.log(`\n🔍 Tentando: ${query}`)
        
        // Usar RPC se disponível
        const { data, error } = await supabase.rpc('exec_sql', { sql: query })
        
        if (!error && data) {
          console.log('✅ Tabelas encontradas:', data)
          tablesFound = true
          break
        } else if (error) {
          console.log('❌ Erro RPC:', error.message)
        }
      } catch (err) {
        console.log('❌ Exceção:', err.message)
      }
    }
    
    if (!tablesFound) {
      console.log('\n📝 Tentando criar tabela usuarios...')
      
      // SQL para criar a tabela
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.usuarios (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          empresa VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          perfil VARCHAR(50) DEFAULT 'admin',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL })
        
        if (error) {
          console.log('❌ Erro ao criar tabela via RPC:', error.message)
          
          // Tentar via REST API diretamente
          console.log('\n🔄 Tentando via REST API...')
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'apikey': accessToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql: createTableSQL })
          })
          
          const result = await response.text()
          console.log('📤 Resposta REST:', response.status, result)
          
        } else {
          console.log('✅ Tabela criada com sucesso!')
        }
      } catch (err) {
        console.log('❌ Erro geral:', err.message)
      }
    }
    
    console.log('\n🎯 Resumo do teste MCP:')
    console.log('📍 Project Ref:', projectRef)
    console.log('🔑 Access Token: Válido para auth')
    console.log('📊 Listagem de tabelas: Limitada')
    console.log('🏗️  Criação de tabelas: A verificar')
    
    console.log('\n💡 Próximos passos:')
    console.log('1. Use o Supabase Dashboard para executar o SQL')
    console.log('2. Configure as políticas RLS')
    console.log('3. Teste o app Nuxt com as credenciais')

  } catch (error) {
    console.error('❌ Erro crítico:', error.message)
  }
}

setupDatabase()