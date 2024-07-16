import { ListPlus } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { AddNewToDoDialogAnonymous } from '@/pages/app/dashboard/anonymous/add-new-to-do-dialog-anonymous'
import { UserToDosAnonymous } from '@/pages/app/dashboard/anonymous/user-to-dos-anonymous'

export function AnonymousDashboard() {
  const [isAddNewToDoDialogOpen, setIsAddNewToDoDialogOpen] = useState(false)

  return (
    <div className="flex h-full flex-col gap-4">
      <Helmet title="Dashboard" />
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
    </div>
  )
}
