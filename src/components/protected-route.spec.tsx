import { User } from '@supabase/supabase-js'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { create } from 'zustand'

import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/hooks/useAuth'

const navigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

vi.mock('@/hooks/useAuth')

const mockSetUser = vi.fn()
const mockSetIsAnon = vi.fn()

const mockUseStore = create(() => ({
  user: null,
  setUser: mockSetUser,
  isAnon: false,
  setIsAnon: mockSetIsAnon,
}))

vi.mock('@/store/use-store', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: (selector: any) => selector(mockUseStore.getState()),
}))

const mockUser: User = {
  id: '666',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2021-01-01T00:00:00Z',
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  // 1. Renderização do LoadingPage quando isLoading for verdadeiro
  it('should renders LoadingPage when isLoading is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
    })

    render(<ProtectedRoute>Child</ProtectedRoute>, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/dashboard']}>{children}</MemoryRouter>
      ),
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  // 2. Navegação para /dashboard e configuração do estado correto quando o usuário está autenticado
  it('should navigates to /dashboard when user is authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
    })

    render(<ProtectedRoute>Child</ProtectedRoute>, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
      ),
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(mockSetUser).toHaveBeenCalledWith(mockUser)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(mockSetIsAnon).toHaveBeenCalledWith(false)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(navigate).toHaveBeenCalledWith('/dashboard', { replace: true })
  })

  // 3. Navegação para /sign-in quando o usuário não está autenticado
  it('should navigates to /sign-in when user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })

    render(<ProtectedRoute>Child</ProtectedRoute>, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
      ),
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(mockSetUser).toHaveBeenCalledWith(null)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(navigate).toHaveBeenCalledWith('/sign-in', { replace: true })
  })

  // 4. Renderização dos filhos quando o usuário está autenticado e não está carregando:
  it('should renders children when isLoading is false', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })

    render(<ProtectedRoute>Child</ProtectedRoute>, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
      ),
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(screen.getByText('Child')).toBeInTheDocument()
  })
})
