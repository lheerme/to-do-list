import { Link, Outlet } from 'react-router-dom'

import { Header } from '@/components/Header'
import { TodosContextProvider } from '@/contexts/TodosContexts'

export function AppLayouts() {
  return (
    <div className="h-[calc(100dvh_-_28px)] px-3 pt-3">
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col rounded-md ring-1 ring-border">
        <Header />
        <main className="h-[calc(100%_-_55px)] p-4">
          <TodosContextProvider>
            <Outlet />
          </TodosContextProvider>
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
