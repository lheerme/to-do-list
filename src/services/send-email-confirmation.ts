import { supabase } from '@/utils/supabase'

export async function sendEmailConfirmation(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: 'http://localhost:5173/',
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
