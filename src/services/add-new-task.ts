import { ToDoTask } from '@/interfaces/to-do-task'
import { supabase } from '@/utils/supabase'

interface NewTask {
  title: string
  todo_id: string
  user_id: string
}

export async function AddNewTask(newTask: NewTask): Promise<ToDoTask> {
  const { data, error } = await supabase.from('tasks').insert(newTask).select()

  if (error) {
    throw new Error(error.code)
  }

  return data[0]
}
