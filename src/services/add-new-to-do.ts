import { supabase } from '@/utils/supabase'

interface NewTodo {
  title: string
  user_id: string
}

export async function AddNewTodo(newTodo: NewTodo) {
  const { data, error } = await supabase
    .from('todos')
    .insert({ title: newTodo.title, user_id: newTodo.user_id })
    .select()

  if (error) {
    throw new Error(error.code)
  }

  return data[0].id
}
