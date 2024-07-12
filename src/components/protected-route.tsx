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

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        setUser(user)
        navigate('/dashboard', { replace: true })
      } else {
        setUser(null)
      }
    }

    if (!isAuthenticated && !isLoading) {
      setUser(null)
      navigate('/sign-in')
    }
  }, [isAuthenticated, isLoading, navigate, setUser, user])

  if (isLoading) return <LoadingPage />

  return children
}
