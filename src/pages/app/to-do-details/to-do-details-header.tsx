import { useQuery } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { DeleteToDoAlertDialog } from '@/pages/app/to-do-details/delete-to-do-alert-dialog'
import { EditToDoDialog } from '@/pages/app/to-do-details/edit-to-do-dialog'
import { ToDoDetailsHeaderTitleSkeleton } from '@/pages/app/to-do-details/to-do-details-header-title-skeleton'
import { getToDoDetails } from '@/services/get-to-do-details'
import { useStore } from '@/store/use-store'

export function ToDoDetailsHeader() {
  const user = useStore((state) => state.user)
  const { toDoId } = useParams() as { toDoId: string }
  const [isEditToDoDialogOpen, setIsEditToDoDialogOpen] = useState(false)

  const { data: toDoDetails, isFetching } = useQuery({
    queryKey: ['user-to-do-detail', toDoId],
    queryFn: () => getToDoDetails(user!.id, toDoId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!user,
  })

  return (
    <div className="flex items-center gap-2 px-4 pt-4 md:px-0 md:pt-0">
      {isFetching ? (
        <ToDoDetailsHeaderTitleSkeleton />
      ) : (
        <h2
          title={toDoDetails?.title}
          className="cursor-default truncate text-xl font-bold tracking-tight"
        >
          {toDoDetails?.title}
        </h2>
      )}
      <div className="ml-auto flex items-center gap-2">
        <Dialog
          open={isEditToDoDialogOpen}
          onOpenChange={setIsEditToDoDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isFetching}>
              <Pencil className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DialogTrigger>

          <EditToDoDialog setIsEditToDoDialogOpen={setIsEditToDoDialogOpen} />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isFetching}>
              <Trash2 className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </AlertDialogTrigger>

          <DeleteToDoAlertDialog />
        </AlertDialog>
      </div>
    </div>
  )
}
