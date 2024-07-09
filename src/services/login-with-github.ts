import { supabase } from '@/utils/supabase'

export async function loginWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
