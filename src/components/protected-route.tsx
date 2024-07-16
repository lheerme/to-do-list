import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoadingPage } from '@/components/loading-page'
import { useAuth } from '@/hooks/useAuth'
import { useStore } from '@/store/use-store'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const { user, isLoading, isAuthenticated } = useAuth()
  const setUser = useStore((state) => state.setUser)
  const isAnon = useStore((state) => state.isAnon)
  const setIsAnon = useStore((state) => state.setIsAnon)

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        setUser(user)
        setIsAnon(false)
        navigate('/dashboard', { replace: true })
      } else if (!user) {
        setUser(null)
      }
    }

    if (!isAuthenticated && !isLoading && !isAnon) {
      setUser(null)
      navigate('/sign-in', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, setUser, user, isAnon, setIsAnon])

  if (isLoading) return <LoadingPage />

  return children
}
