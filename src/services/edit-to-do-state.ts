import { supabase } from '@/utils/supabase'

interface DataInterface {
  newState: boolean | null
  user_id: string
  toDoId: string
}

export async function EditToDoState(data: DataInterface) {
  const { error } = await supabase
    .from('todos')
    .update({ isCompleted: data.newState })
    .eq('id', data.toDoId)
    .eq('user_id', data.user_id)

  if (error) {
    throw new Error(error.code)
  }
}
