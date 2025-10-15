import type { User } from '@supabase/supabase-js'

export function useSupabaseUser() {
  // Reutiliza o estado do useAuth
  const user = useState<User | null>('auth_user', () => null)
  
  return computed(() => user.value)
}