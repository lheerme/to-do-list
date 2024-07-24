import { useQuery } from '@tanstack/react-query'
import { ListPlus } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useMediaQuery } from '@/hooks/use-media-query'
import { UserInfo } from '@/interfaces/user-info'
import { AddNewToDoDialog } from '@/pages/app/dashboard/add-new-to-do-dialog'
import { AnonymousDashboard } from '@/pages/app/dashboard/anonymous'
import { UserToDos } from '@/pages/app/dashboard/user-to-dos'
import { getUserInfo } from '@/services/get-user-info'
import { useStore } from '@/store/use-store'

export function Dashboard() {
  const isAnon = useStore((state) => state.isAnon)
  const user = useStore((state) => state.user)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isAddNewToDoDialogOpen, setIsAddNewToDoDialogOpen] = useState(false)

  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ['user-info', user],
    queryFn: () => getUserInfo(user!.id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!user,
  })

  if (isAnon) {
    return <AnonymousDashboard />
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <Helmet title="Dashboard" />
      <div className="hidden h-full flex-col items-center gap-4 px-4 pt-4 md:flex md:px-0 md:pt-0">
        <h2 className="self-start text-2xl font-bold tracking-tight">
          Bem-vindo(a), {userInfo?.name.split(' ')[0]}!
        </h2>
        <p className="mx-auto my-auto text-center">
          Abra um to-do para ver suas tarefas, ou crie um to-do e adicione
          tarefas!
        </p>
      </div>

      {!isDesktop && (
        <>
          <div className="flex items-center px-4 pt-4">
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

              <AddNewToDoDialog
                setIsAddNewToDoDialogOpen={setIsAddNewToDoDialogOpen}
              />
            </Dialog>
          </div>

          <UserToDos />
        </>
      )}
    </div>
  )
}
