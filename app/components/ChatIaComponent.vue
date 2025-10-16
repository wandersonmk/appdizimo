<template>
  <div class="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
    <!-- Header do Chat -->
    <div class="bg-gradient-to-r from-card to-card/80 rounded-lg border border-border/50 shadow-sm mb-6 p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200">
            <div class="text-3xl animate-pulse">🤖</div>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-foreground flex items-center space-x-2">
              <span>Assistente Financeiro IA</span>
              <span class="text-lg">💰</span>
            </h1>
            <p class="text-sm text-foreground/60 flex items-center space-x-1">
              <span>🎯</span>
              <span>Especialista em gestão financeira e dízimo</span>
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-sm text-green-600 font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Container do Chat -->
    <div class="bg-gradient-to-br from-card to-card/80 rounded-lg border border-border/50 shadow-sm h-[calc(100%-10rem)] flex flex-col">
      
      <!-- Área de Mensagens -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
        
        <!-- Mensagem de Boas-vindas da IA -->
        <div class="flex items-start space-x-3" v-if="messages.length === 0">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <div class="text-xl">🤖</div>
          </div>
          <div class="bg-gradient-to-r from-blue-50/10 to-purple-50/10 border border-blue-200/20 rounded-2xl rounded-tl-md p-4 max-w-md">
            <p class="text-foreground/90 text-sm leading-relaxed">
              Olá! 👋 Sou seu assistente financeiro especializado. Foco APENAS em finanças:
            </p>
            <ul class="mt-2 space-y-1 text-xs text-foreground/70">
              <li>💰 Cálculos de dízimo e orçamento</li>
              <li>📊 Controle de gastos e receitas</li>
              <li>💸 Dicas de economia e poupança</li>
              <li>📈 Planejamento e investimentos</li>
            </ul>
            <p class="mt-2 text-foreground/90 text-sm">
              Que questão financeira posso te ajudar? 💼
            </p>
          </div>
        </div>

        <!-- Mensagens do Chat -->
        <div v-for="message in messages" :key="message.id" class="animate-fadeInUp">
          <!-- Mensagem da IA -->
          <div v-if="message.sender === 'ai'" class="flex items-start space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-110 transition-transform duration-200">
              <div class="text-xl animate-bounce">🤖</div>
            </div>
            <div class="bg-gradient-to-r from-blue-50/10 to-purple-50/10 border border-blue-200/20 rounded-2xl rounded-tl-md p-4 max-w-md">
              <p class="text-foreground/90 text-sm leading-relaxed">{{ message.text }}</p>
              <span class="text-xs text-foreground/50 mt-2 block">
                {{ message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>
          </div>

          <!-- Mensagem do Usuário -->
          <div v-else class="flex items-start space-x-3 justify-end">
            <div class="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl rounded-tr-md p-4 max-w-md shadow-lg">
              <p class="text-white text-sm leading-relaxed">{{ message.text }}</p>
              <span class="text-xs text-white/70 mt-2 block">
                {{ message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>
            <div class="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-110 transition-transform duration-200">
              <div class="text-xl">🧙‍♂️</div>
            </div>
          </div>
        </div>

        <!-- Indicador de digitação -->
        <div class="flex items-start space-x-3 animate-fadeInUp" v-if="isTyping">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <div class="text-xl animate-spin">⚡</div>
          </div>
          <div class="bg-gradient-to-r from-blue-50/10 to-purple-50/10 border border-blue-200/20 rounded-2xl rounded-tl-md p-4 shadow-lg">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-foreground/70">🤔 Pensando</span>
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sugestões Rápidas -->
      <div class="px-6 py-3 border-t border-border/30">
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="suggestion in suggestions" 
            :key="suggestion"
            class="px-3 py-1.5 text-xs bg-gradient-to-r from-gray-100/10 to-gray-200/10 hover:from-blue-100/20 hover:to-purple-100/20 border border-border/30 hover:border-blue-300/30 rounded-full text-foreground/70 hover:text-foreground transition-all duration-200 hover:scale-105"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <!-- Input de Mensagem -->
      <div class="p-6 border-t border-border/30">
        <div class="flex space-x-3">
          <div class="flex-1 relative">
            <textarea
              v-model="newMessage"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.shift.enter="$event.preventDefault(); newMessage += '\n'"
              placeholder="Digite sua pergunta sobre finanças..."
              rows="1"
              class="w-full px-4 py-3 pr-12 bg-secondary/50 border border-border/50 rounded-2xl text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/50 transition-all duration-200 resize-none min-h-[48px] max-h-32"
              :class="{ 'opacity-50': isLoading }"
              :disabled="isLoading"
            ></textarea>
            <button
              @click="sendMessage"
              :disabled="!newMessage.trim() || isLoading"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin text-sm"></i>
              <i v-else class="fas fa-paper-plane text-sm"></i>
            </button>
          </div>
        </div>
        <p class="text-xs text-foreground/40 mt-2 text-center">
          Pressione Enter para enviar • Shift + Enter para nova linha
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'

// Interface para mensagens
interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

// Função para verificar se é análise de gastos
const isAnaliseGastosMessage = (message: string): boolean => {
  const normalizedMessage = message.toLowerCase().trim()
  
  const keywords = [
    'analisar gastos',
    'analisar meus gastos', 
    'analyse gastos',
    'análise gastos',
    'análise dos gastos',
    'análise dos meus gastos',
    'gastos mensais',
    'meus gastos',
    'onde gasto',
    'onde estou gastando',
    'resumo gastos',
    'relatório gastos',
    'despesas mensais',
    'me traga minhas despesas'
  ]
  
  return keywords.some(keyword => normalizedMessage.includes(keyword))
}

// Usuário logado - usando ID com transações reais para demonstração
const userId = ref('2049a159-0a39-4c4a-9d12-4ca5af6a27e6')

// Estados do componente
const newMessage = ref('')
const isLoading = ref(false)
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement>()
const messages = ref<Message[]>([])
let messageIdCounter = 1

// Sugestões rápidas
const suggestions = ref([
  '💰 Como calcular 10% de dízimo?',
  '📊 Análise dos meus gastos mensais',
  '� Dicas para economizar dinheiro',
  '🏦 Como fazer um orçamento familiar?',
  '📈 Investimentos para iniciantes',
  '💳 Controle de gastos com cartão'
])

// Função para selecionar sugestão
const selectSuggestion = (suggestion: string) => {
  newMessage.value = suggestion
}

// Função para scroll automático
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Função para enviar mensagem
const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return

  // Adicionar mensagem do usuário
  const userMessage: Message = {
    id: messageIdCounter++,
    text: newMessage.value.trim(),
    sender: 'user',
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  const messageText = newMessage.value.trim()
  newMessage.value = ''
  
  // Scroll para o final
  scrollToBottom()
  
  // Mostrar que está carregando
  isTyping.value = true
  isLoading.value = true
  
  try {
    // Verificar se é uma solicitação de análise de gastos
    console.log('🔍 Verificando se é análise de gastos:', messageText)
    console.log('🎯 É análise de gastos:', isAnaliseGastosMessage(messageText))
    
    if (isAnaliseGastosMessage(messageText)) {
      console.log('💰 Chamando endpoint de análise de gastos...')
      // Fazer diretamente a análise de gastos
      try {
        console.log('📤 Enviando para:', '/api/analisar-gastos', {
          message: messageText,
          userId: userId.value
        })

        const analiseResponse = await fetch('/api/analisar-gastos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: messageText,
            userId: userId.value
          })
        })

        console.log('📥 Status da resposta:', analiseResponse.status)
        const analiseData = await analiseResponse.json() as { success: boolean; response: string; dadosFinanceiros?: any }
        console.log('📊 Dados recebidos:', analiseData)

        if (analiseData.success) {
          const analiseMessage: Message = {
            id: messageIdCounter++,
            text: analiseData.response,
            sender: 'ai',
            timestamp: new Date()
          }
          
          messages.value.push(analiseMessage)
        } else {
          throw new Error('Erro na análise de gastos')
        }
      } catch (analiseError) {
        console.error('Erro na análise de gastos:', analiseError)
        const errorMessage: Message = {
          id: messageIdCounter++,
          text: '💸 Desculpe, não consegui analisar seus gastos no momento. Verifique se você possui transações registradas no sistema e tente novamente.',
          sender: 'ai',
          timestamp: new Date()
        }
        messages.value.push(errorMessage)
      }
    } else {
      console.log('💬 Mensagem normal, chamando endpoint de chat...')
      // Fazer requisição normal para chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          userId: userId.value
        })
      })

      const data = await response.json() as { success: boolean; response: string }

      if (data.success) {
        const aiMessage: Message = {
          id: messageIdCounter++,
          text: data.response,
          sender: 'ai',
          timestamp: new Date()
        }
        
        messages.value.push(aiMessage)
      } else {
        throw new Error('Resposta inválida da API')
      }
    }
    
  } catch (error: any) {
    console.error('Erro ao enviar mensagem:', error)
    
    const errorMessage: Message = {
      id: messageIdCounter++,
      text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
      sender: 'ai',
      timestamp: new Date()
    }
    
    messages.value.push(errorMessage)
  } finally {
    isTyping.value = false
    isLoading.value = false
    scrollToBottom()
  }
}

// Auto-resize do textarea
const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px'
}
</script>

<style scoped>
/* Estilo personalizado para o scroll */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}

/* Animação suave para as mensagens */
.animate-fadeInUp {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animação de hover para avatares */
.hover\:scale-110:hover {
  transform: scale(1.1);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>