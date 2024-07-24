import { ClipboardList, ListPlus, User } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useMediaQuery } from '@/hooks/use-media-query'
import { AddNewToDoDialogAnonymous } from '@/pages/app/dashboard/anonymous/add-new-to-do-dialog-anonymous'
import { UserToDosAnonymous } from '@/pages/app/dashboard/anonymous/user-to-dos-anonymous'

export function HeaderAnonymous() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isAddNewToDoDialogOpen, setIsAddNewToDoDialogOpen] = useState(false)

  return (
    <header
      className={twMerge(
        'w-full',
        isDesktop ? 'h-full max-w-52 border-r lg:max-w-72' : 'h-14 border-b',
      )}
    >
      <Helmet titleTemplate={'to-do app'} />
      {isDesktop ? (
        <div className="flex h-full flex-col justify-between gap-6 p-3">
          <div className="flex items-center justify-between">
            <Link
              to={'/dashboard'}
              title="dashboard"
              className="flex gap-2 align-baseline"
            >
              <ClipboardList className="size-6 shrink-0" />
              <Separator orientation="vertical" className="h-8" />
              <span>to-do list</span>
            </Link>
            <ModeToggle />
          </div>
          <UserToDosAnonymous />
          <Dialog
            open={isAddNewToDoDialogOpen}
            onOpenChange={setIsAddNewToDoDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full">
                <ListPlus className="mr-2 size-4" />
                Novo to-do
              </Button>
            </DialogTrigger>

            <AddNewToDoDialogAnonymous
              setIsAddNewToDoDialogOpen={setIsAddNewToDoDialogOpen}
            />
          </Dialog>
          <Button variant="ghost" asChild>
            <Link to={'/sign-in'}>
              <User className="mr-2 h-[1.3rem] w-[1.3rem]" />{' '}
              <span className="pt-0.5">Entrar</span>
            </Link>
          </Button>
        </div>
      ) : (
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
      )}
    </header>
  )
}
