import { UserToDos } from '@/interfaces/user-to-dos'
import { supabase } from '@/utils/supabase'

export async function getUserToDos(userId: string): Promise<UserToDos[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('id, title')
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  return data
}
