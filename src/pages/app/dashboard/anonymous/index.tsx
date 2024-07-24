import { ListPlus } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useMediaQuery } from '@/hooks/use-media-query'
import { AddNewToDoDialogAnonymous } from '@/pages/app/dashboard/anonymous/add-new-to-do-dialog-anonymous'
import { UserToDosAnonymous } from '@/pages/app/dashboard/anonymous/user-to-dos-anonymous'

export function AnonymousDashboard() {
  const [isAddNewToDoDialogOpen, setIsAddNewToDoDialogOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <div className="flex h-full flex-col gap-4">
      <Helmet title="Dashboard" />
      <div className="hidden h-full flex-col items-center gap-4 px-4 pt-4 md:flex md:px-0 md:pt-0">
        <h2 className="self-start text-2xl font-bold tracking-tight">
          Bem-vindo(a)!
        </h2>
        <p className="mx-auto my-auto text-center">
          Abra um to-do para ver suas tarefas, ou crie um to-do e adicione
          tarefas!
          <br />
          <span>
            Lembrando que,{' '}
            <strong className="text-destructive">você não está logado</strong>,
            seus to-dos serão{' '}
            <strong className="text-destructive">
              salvos apenas localmente
            </strong>{' '}
            no seu navegador atual.
          </span>
        </p>
      </div>

      {!isDesktop && (
        <>
          <div className="flex items-center px-4 pt-4 md:px-0 md:pt-0">
            <h2 className="text-xl font-bold tracking-tight">Minhas listas</h2>

            <Dialog
              open={isAddNewToDoDialogOpen}
              onOpenChange={setIsAddNewToDoDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="ml-auto" size="sm">
                  <ListPlus className="mr-2 size-4" />
                  Novo to-do
                </Button>
              </DialogTrigger>

              <AddNewToDoDialogAnonymous
                setIsAddNewToDoDialogOpen={setIsAddNewToDoDialogOpen}
              />
            </Dialog>
          </div>

          <UserToDosAnonymous />
        </>
      )}
    </div>
  )
}
