import { UserInfo } from '@/interfaces/user-info'
import { supabase } from '@/utils/supabase'

export async function getUserInfo(userId: string): Promise<UserInfo> {
  const { data, error } = await supabase
    .from('users')
    .select('name, profile_pic')
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  return data[0]
}
