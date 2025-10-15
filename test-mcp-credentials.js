// Teste simples das credenciais MCP
import { createClient } from '@supabase/supabase-js'

// Credenciais do mcp.json
const projectRef = 'neykfwokdjfcbkzhtazl'
const accessToken = 'sb_publishable_aHt3Vdj5ZfDPKEGUwNRnIg_CWpn1bm1'
const supabaseUrl = `https://${projectRef}.supabase.co`

console.log('🔍 Testando credenciais MCP...')
console.log('📍 Project Ref:', projectRef)
console.log('🌐 URL:', supabaseUrl)
console.log('🔑 Access Token:', accessToken.substring(0, 20) + '...')

async function testMCPCredentials() {
  try {
    // Usar o access token como anon key para teste
    const supabase = createClient(supabaseUrl, accessToken)
    
    console.log('\n🔐 Testando autenticação com access token...')
    const { data: session, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('❌ Erro de auth:', authError.message)
      
      // Testar se é um token válido fazendo uma requisição básica
      console.log('\n🔍 Testando conectividade básica...')
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'apikey': accessToken
          }
        })
        
        if (response.ok) {
          console.log('✅ Conectividade OK com access token')
        } else {
          console.log('❌ Erro de conectividade:', response.status, response.statusText)
        }
      } catch (fetchError) {
        console.log('❌ Erro na requisição:', fetchError.message)
      }
    } else {
      console.log('✅ Auth OK')
    }

    console.log('\n📊 Tentando listar tabelas...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10)
    
    if (tablesError) {
      console.log('❌ Erro ao listar tabelas:', tablesError.message)
    } else {
      console.log('✅ Tabelas encontradas:', tables?.map(t => t.table_name) || [])
    }

    console.log('\n✅ Teste de credenciais MCP concluído')
    console.log('\n📋 Status:')
    console.log('- Project Ref: ✅', projectRef)
    console.log('- URL: ✅', supabaseUrl)
    console.log('- Access Token: ❓ (verificar se é válido)')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

testMCPCredentials()