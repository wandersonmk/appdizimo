// Teste do MCP Supabase com as credenciais do mcp.json
import { spawn } from 'child_process'

console.log('🧪 Testando MCP do Supabase...')
console.log('📋 Project Ref: neykfwokdjfcbkzhtazl')
console.log('🔑 Token: sb_publishable_aHt3Vdj5ZfDPKEGUwNRnIg_CWpn1bm1')

// Simular o comando do MCP
const command = 'npx'
const args = ['-y', '@supabase/mcp-server-supabase@latest', '--project-ref=neykfwokdjfcbkzhtazl']
const env = {
  ...process.env,
  SUPABASE_ACCESS_TOKEN: 'sb_publishable_aHt3Vdj5ZfDPKEGUwNRnIg_CWpn1bm1'
}

console.log('\n🔧 Executando comando MCP:')
console.log(`${command} ${args.join(' ')}`)

const child = spawn(command, args, { 
  env,
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
})

let output = ''
let errorOutput = ''

child.stdout.on('data', (data) => {
  output += data.toString()
})

child.stderr.on('data', (data) => {
  errorOutput += data.toString()
})

child.on('close', (code) => {
  console.log('\n📤 Output:')
  console.log(output)
  
  if (errorOutput) {
    console.log('\n❌ Errors:')
    console.log(errorOutput)
  }
  
  console.log('\n🎯 Exit code:', code)
  
  if (code === 0) {
    console.log('✅ MCP server iniciado com sucesso!')
  } else {
    console.log('❌ Erro ao iniciar MCP server')
  }
})

// Timeout de 10 segundos
setTimeout(() => {
  if (!child.killed) {
    child.kill()
    console.log('\n⏰ Timeout - processo finalizado')
  }
}, 10000)