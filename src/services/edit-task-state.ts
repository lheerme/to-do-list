import { supabase } from '@/utils/supabase'

interface DataInterface {
  newState: boolean
  user_id: string
  taskId: string
}

export async function EditTaskState(data: DataInterface) {
  const { error } = await supabase
    .from('tasks')
    .update({ isCompleted: data.newState })
    .eq('id', data.taskId)
    .eq('user_id', data.user_id)

  if (error) {
    throw new Error(error.code)
  }
}
