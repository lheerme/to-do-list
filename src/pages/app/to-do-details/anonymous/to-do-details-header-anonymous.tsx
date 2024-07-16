import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { DeleteToDoAlertDialogAnonymous } from '@/pages/app/to-do-details/anonymous/delete-to-do-alert-dialog-anonymous'
import { EditToDoDialogAnonymous } from '@/pages/app/to-do-details/anonymous/edit-to-do-dialog-anonymous'
import { useStore } from '@/store/use-store'

export function ToDoDetailsHeaderAnonymous() {
  const { toDoId } = useParams() as { toDoId: string }
  const anonToDos = useStore((state) => state.anonToDos)
  const [isEditToDoDialogOpen, setIsEditToDoDialogOpen] = useState(false)

  const currentAnonToDo = anonToDos.find((toDo) => toDo.id === toDoId)

  return (
    <div className="flex items-center gap-2 px-4 pt-4 md:px-0 md:pt-0">
      <h2
        title={currentAnonToDo?.title}
        className="cursor-default truncate text-xl font-bold tracking-tight"
      >
        {currentAnonToDo?.title}
      </h2>

      <div className="ml-auto flex items-center gap-2">
        <Dialog
          open={isEditToDoDialogOpen}
          onOpenChange={setIsEditToDoDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Pencil className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DialogTrigger>

          <EditToDoDialogAnonymous
            setIsEditToDoDialogOpen={setIsEditToDoDialogOpen}
          />
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </AlertDialogTrigger>

          <DeleteToDoAlertDialogAnonymous />
        </AlertDialog>
      </div>
    </div>
  )
}
