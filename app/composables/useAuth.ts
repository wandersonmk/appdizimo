import { ref, computed, readonly } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import { useSupabaseClient } from './useSupabaseClient'
import { translateError } from '~/utils/errorTranslations'

// Composable simples de autenticação
export function useAuth() {
  const supabase = useSupabaseClient()

  // Usar estados globais compartilhados com o plugin auth
  const user = useState<User | null>('auth_user', () => null)
  const session = useState<Session | null>('auth_session', () => null)
  const isLoading = useState<boolean>('auth_loading', () => false)
  const errorMessage = ref<string | null>(null)

  // Computed para verificar se está autenticado
  const isAuthenticated = computed(() => !!user.value)

  // Funções básicas
  const signInWithEmailAndPassword = async (email: string, password: string) => {
    isLoading.value = true
    errorMessage.value = null
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      user.value = data.user
      session.value = data.session
      return data.user
    } catch (err: any) {
      errorMessage.value = translateError(err?.message || err)
      return false
    } finally {
      isLoading.value = false
    }
  }
  const signUp = async ({ name, companyName, email, password }: { name: string, companyName: string, email: string, password: string }) => {
    isLoading.value = true
    errorMessage.value = null
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error
      // Registrar usuário na tabela usuarios
      await supabase.from('usuarios').insert({
        nome: name,
        empresa: companyName,
        email: email,
        perfil: 'admin'
      })
      return data.user
    } catch (err: any) {
      errorMessage.value = translateError(err?.message || err)
      return false
    } finally {
      isLoading.value = false
    }
  }
  const signOut = async () => {
    isLoading.value = true
    errorMessage.value = null
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
      session.value = null
      return true
    } catch (err: any) {
      errorMessage.value = translateError(err?.message || err)
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const reloadSession = async () => {
    isLoading.value = true
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      user.value = data.session?.user || null
      session.value = data.session
      return data.session
    } catch (err: any) {
      errorMessage.value = translateError(err?.message || err)
      user.value = null
      session.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  const clearError = () => { errorMessage.value = null }

  return {
    user,
    session,
    isAuthenticated: readonly(isAuthenticated),
    isLoading,
    errorMessage: readonly(errorMessage),
    signInWithEmailAndPassword,
    signUp,
    signOut,
    reloadSession,
    clearError
  }
}