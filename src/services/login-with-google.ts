import { supabase } from '@/utils/supabase'

export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
