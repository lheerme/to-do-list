import { Link, Outlet } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

import { Header } from '@/components/header'
import { HeaderAnonymous } from '@/components/header-anonymous'
import { LoadingPage } from '@/components/loading-page'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useStore } from '@/store/use-store'

export function AppLayout() {
  const user = useStore((state) => state.user)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isAnon = useStore((state) => state.isAnon)

  if (!user && !isAnon) return <LoadingPage />

  return (
    <div className="h-[calc(100dvh_-_28px)] md:px-3 md:pt-3">
      <div
        className={twMerge(
          'mx-auto flex h-full w-full rounded-md md:ring-1 md:ring-border',
          isDesktop ? 'max-w-7xl' : 'flex-col',
        )}
      >
        {isAnon ? <HeaderAnonymous /> : <Header />}
        <main
          className={twMerge(
            isDesktop
              ? 'w-[calc(100%_-_13rem)] p-2 md:p-10 lg:w-[calc(100%_-_18rem)]'
              : 'h-[calc(100%_-_55px)]',
          )}
        >
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
