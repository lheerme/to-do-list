import { Link, Outlet } from 'react-router-dom'

import { Header } from '@/components/header'
import { HeaderAnonymous } from '@/components/header-anonymous'
import { LoadingPage } from '@/components/loading-page'
import { useStore } from '@/store/use-store'

export function AppLayout() {
  const user = useStore((state) => state.user)
  const isAnon = useStore((state) => state.isAnon)

  if (!user && !isAnon) return <LoadingPage />

  return (
    <div className="h-[calc(100dvh_-_28px)] md:px-3 md:pt-3">
      <div className="mx-auto flex h-full w-full flex-col rounded-md md:max-w-2xl md:ring-1 md:ring-border">
        {isAnon ? <HeaderAnonymous /> : <Header />}
        <main className="h-[calc(100%_-_55px)] md:p-4">
          <Outlet />
        </main>
      </div>
      <footer className="py-1.5">
        <p className="text-center text-xs font-medium">
          © 2024 -{' '}
          <Link
            to={'https://guilhermesouza.vercel.app'}
            target="_blank"
            className="underline"
          >
            Guilherme Souza
          </Link>
          . Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
