import { produce } from 'immer'
import { Pencil, Trash2 } from 'lucide-react'
import { ComponentProps, useState } from 'react'
import { useParams } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { useShallow } from 'zustand/react/shallow'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { DeleteTaskAlertDialogAnonymous } from '@/pages/app/to-do-details/anonymous/delete-task-alert-dialog-anonymous'
import { EditTaskDialogAnonymous } from '@/pages/app/to-do-details/anonymous/edit-task-dialog-anonymous'
import { useStore } from '@/store/use-store'

interface ToDoTaskAnonymousProps extends ComponentProps<'div'> {
  id: string
  title: string
  isCompleted: boolean
}

export function ToDoTaskAnonymous(props: ToDoTaskAnonymousProps) {
  const { id, title, isCompleted, ...rest } = props
  const { toDoId } = useParams() as { toDoId: string }
  const { anonToDos, setAnonToDos } = useStore(
    useShallow((state) => ({
      anonToDos: state.anonToDos,
      setAnonToDos: state.setAnonToDos,
    })),
  )
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false)

  function handleCheckChange(isChecked: boolean) {
    const anonToDoIndex = anonToDos.findIndex((toDo) => toDo.id === toDoId)
    const anonTaskIndex = anonToDos[anonToDoIndex].tasks.findIndex(
      (task) => task.id === id,
    )

    const newAnonToDos = produce(anonToDos, (draft) => {
      draft[anonToDoIndex].tasks[anonTaskIndex].isCompleted = isChecked
    })

    setAnonToDos(newAnonToDos)
  }

  return (
    <div
      className={twMerge(
        'relative flex h-12 flex-col justify-between after:absolute after:left-1/2 after:top-1/2 after:block after:h-0.5 after:w-0 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-primary after:transition-all after:content-[""]',
        isCompleted ? 'after:w-[95%] min-[460px]:after:w-full' : null,
      )}
      {...rest}
    >
      <div
        className={twMerge(
          'my-auto flex w-full items-center px-4 transition-opacity',
          isCompleted ? 'opacity-75' : null,
        )}
      >
        <Label
          htmlFor={id}
          title={title}
          className="flex h-full w-[55%] cursor-pointer items-center gap-2 sm:w-2/3"
        >
          <Checkbox
            id={id}
            checked={isCompleted}
            onCheckedChange={(checked) => handleCheckChange(Boolean(checked))}
            data-test="task-checkbox"
          />
          <h3 className="truncate text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {title}
          </h3>
        </Label>

        <div
          className={twMerge(
            'ml-auto flex items-center sm:gap-1',
            isCompleted ? 'pointer-events-none' : 'null',
          )}
        >
          <div className="mr-4 flex items-center gap-2 sm:mr-2">
            <div
              className={twMerge(
                'size-2 rounded-full',
                isCompleted ? 'bg-green-600' : 'bg-orange-600',
              )}
            />
            <span className="hidden text-sm sm:block">
              {isCompleted ? 'Completa' : 'Pendente'}
            </span>
          </div>

          <Dialog
            open={isEditTaskDialogOpen}
            onOpenChange={setIsEditTaskDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" data-test="edit-task-btn">
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>

            <EditTaskDialogAnonymous
              title={title}
              id={id}
              setIsEditTaskDialogOpen={setIsEditTaskDialogOpen}
            />
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" data-test="delete-task-btn">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <DeleteTaskAlertDialogAnonymous id={id} />
          </AlertDialog>
        </div>
      </div>

      <Separator className="w-full" />
    </div>
  )
}
