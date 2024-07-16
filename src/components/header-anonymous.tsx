import { ClipboardList, User } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function HeaderAnonymous() {
  return (
    <header className="h-14 w-full border-b">
      <Helmet titleTemplate={'to-do app'} />
      <div className="flex h-full items-center justify-between gap-6 p-3">
        <Link to={'/dashboard'} className="flex items-center gap-2 truncate">
          <ClipboardList className="size-6 shrink-0" />
          <Separator orientation="vertical" className="h-8" />
          <h1 className="w-full truncate text-sm font-medium min-[460px]:text-base">
            to-do list
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={'/sign-in'}>
              <User className="mr-2 h-[1.3rem] w-[1.3rem]" />{' '}
              <span className="pt-0.5">Entrar</span>
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
