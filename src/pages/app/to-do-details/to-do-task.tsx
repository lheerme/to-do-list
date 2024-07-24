import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { ComponentProps, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ToDoTask as ToDoTaskInterface } from '@/interfaces/to-do-task'
import { DeleteTaskAlertDialog } from '@/pages/app/to-do-details/delete-task-alert-dialog'
import { EditTaskDialog } from '@/pages/app/to-do-details/edit-task-dialog'
import { EditTaskState } from '@/services/edit-task-state'
import { useStore } from '@/store/use-store'

interface ToDoTaskProps extends ComponentProps<'div'> {
  id: string
  title: string
  isCompleted: boolean
}

export function ToDoTask(props: ToDoTaskProps) {
  const { id, title, isCompleted, ...rest } = props
  const user = useStore((state) => state.user)
  const { toDoId } = useParams() as { toDoId: string }
  const queryClient = useQueryClient()
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false)

  function UpdateTaskStateCache({
    taskId,
    newState,
  }: {
    taskId: string
    newState: boolean
  }) {
    const cached = queryClient.getQueryData<ToDoTaskInterface[]>([
      'to-do-tasks',
      toDoId,
    ])

    if (cached) {
      queryClient.setQueryData(['to-do-tasks', toDoId], () => {
        return cached.map((task) => {
          if (task.id === taskId) {
            return { ...task, isCompleted: newState }
          }

          return task
        })
      })
    }

    return { cached }
  }

  const {
    mutateAsync: editTaskStateMutation,
    isPending: isEditTaskStateMutationPending,
  } = useMutation({
    mutationFn: EditTaskState,
    onMutate: ({ taskId, newState }) => {
      const { cached } = UpdateTaskStateCache({ taskId, newState })

      return { prevCache: cached }
    },
    onError: (_, __, context) => {
      if (context?.prevCache) {
        queryClient.setQueryData(['to-do-tasks', toDoId], context.prevCache)
      }
      toast.warning('Erro ao executar ação')
    },
  })

  async function handleCheckChange(isChecked: boolean) {
    await editTaskStateMutation({
      newState: isChecked,
      taskId: id,
      user_id: user!.id,
    })
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
            disabled={isEditTaskStateMutationPending}
            onCheckedChange={(checked) => handleCheckChange(Boolean(checked))}
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
              <Button
                variant="ghost"
                size="icon"
                disabled={isCompleted || isEditTaskStateMutationPending}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <EditTaskDialog
              title={title}
              id={id}
              setIsEditTaskDialogOpen={setIsEditTaskDialogOpen}
            />
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isCompleted || isEditTaskStateMutationPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <DeleteTaskAlertDialog id={id} />
          </AlertDialog>
        </div>
      </div>

      <Separator className="w-full" />
    </div>
  )
}
