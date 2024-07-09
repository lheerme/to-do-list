import { supabase } from '@/utils/supabase'

export async function DeleteToDo(toDo: { userId: string; toDoId: string }) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', toDo.toDoId)
    .eq('user_id', toDo.userId)

  if (error) {
    throw new Error(error.code)
  }
}
