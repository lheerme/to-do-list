import { ToDoTask } from '@/interfaces/to-do-task'
import { supabase } from '@/utils/supabase'

export async function getToDoTasks(
  userId: string,
  toDoId: string,
): Promise<ToDoTask[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, isCompleted')
    .eq('todo_id', toDoId)
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  return data
}
