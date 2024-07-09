import { supabase } from '@/utils/supabase'

interface DataInterface {
  newUsername: string
  newProfilePic: string
}

export async function EditProfileInfo(data: DataInterface) {
  const { error } = await supabase.auth.updateUser({
    data: { user_name: data.newUsername, avatar_url: data.newProfilePic },
  })

  if (error) {
    throw new Error(error.message)
  }
}
