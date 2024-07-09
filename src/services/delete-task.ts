import { supabase } from '@/utils/supabase'

export async function DeleteTask(task: { userId: string; taskId: string }) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', task.taskId)
    .eq('user_id', task.userId)

  if (error) {
    throw new Error(error.code)
  }
}
