import { ClipboardList } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

import { Separator } from '@/components/ui/separator'

export function AuthLayout() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="border-bg-muted hidden w-full flex-col justify-between border-r p-10 lg:flex">
        <Link to={'/'} className="flex w-fit items-center gap-2">
          <ClipboardList className="size-6" />
          <Separator orientation="vertical" className="h-8" />
          <h1 className="font-medium">to-do list</h1>
        </Link>

        <footer className="py-1.5">
          <p className="text-xs font-medium">
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

      <div className="relative flex flex-col items-center justify-center pt-10">
        <Outlet />
      </div>
    </div>
  )
}
