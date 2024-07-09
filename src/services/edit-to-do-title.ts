import { supabase } from '@/utils/supabase'

interface DataInterface {
  newTitle: string
  user_id: string
  toDoId: string
}

export async function EditToDoTitle(data: DataInterface) {
  const { error } = await supabase
    .from('todos')
    .update({ title: data.newTitle })
    .eq('id', data.toDoId)
    .eq('user_id', data.user_id)

  if (error) {
    throw new Error(error.code)
  }
}
