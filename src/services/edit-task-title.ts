import { supabase } from '@/utils/supabase'

interface DataInterface {
  newTitle: string
  user_id: string
  taskId: string
}

export async function EditTaskTitle(data: DataInterface) {
  const { error } = await supabase
    .from('tasks')
    .update({ title: data.newTitle })
    .eq('id', data.taskId)
    .eq('user_id', data.user_id)

  if (error) {
    throw new Error(error.code)
  }
}
