import { User } from '@supabase/supabase-js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { supabase } from '@/utils/supabase'

export function useAuth() {
  const queryClient = useQueryClient()
  const [isLoading, setisLoading] = useState(true)

  async function fetchSession() {
    const { data } = await supabase.auth.getSession()

    await new Promise((resolve) => setTimeout(resolve, 1000))
    setisLoading(false)

    if (data.session) {
      return data.session.user
    }

    return null
  }

  const { data: user, refetch } = useQuery<User | null>({
    queryKey: ['auth'],
    queryFn: fetchSession,
    staleTime: Infinity,
  })

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        queryClient.setQueryData(['auth'], session?.user ?? null)
        refetch()
      },
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [refetch, queryClient])

  return {
    user,
    isLoading,
    isAuthenticated: user?.role === 'authenticated',
  }
}
