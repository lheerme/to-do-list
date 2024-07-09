import { UserToDoDetail } from '@/interfaces/user-to-do-detail'
import { supabase } from '@/utils/supabase'

export async function getToDoDetails(
  userId: string,
  toDoId: string,
): Promise<UserToDoDetail> {
  const { data, error } = await supabase
    .from('todos')
    .select('id, title')
    .eq('user_id', userId)
    .eq('id', toDoId)

  if (error) {
    throw new Error(error.message)
  }

  return data[0]
}
