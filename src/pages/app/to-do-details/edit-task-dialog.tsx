import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToDoTask } from '@/interfaces/to-do-task'
import { EditTaskTitle } from '@/services/edit-task-title'
import { useStore } from '@/store/use-store'

const newTaskFormSchema = z.object({
  newTitle: z
    .string()
    .min(1, 'O título é obrigatório')
    .regex(
      /^(?!\d)(?!.*--)(?!.* {2})[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:[ -][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*$/,
      'Título inválido',
    ),
})

type NewTaskFormSchema = z.infer<typeof newTaskFormSchema>

interface EditTaskDialogProps {
  title: string
  id: string
}

export function EditTaskDialog({ title, id }: EditTaskDialogProps) {
  const user = useStore((state) => state.user)
  const { toDoId } = useParams() as { toDoId: string }
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<NewTaskFormSchema>({
    resolver: zodResolver(newTaskFormSchema),
  })

  const {
    mutateAsync: editTaskTitleMutation,
    isPending: isEditTaskTitlePending,
  } = useMutation({
    mutationFn: EditTaskTitle,
    onSuccess: (_, { taskId, newTitle }) => {
      queryClient.setQueryData(
        ['to-do-tasks', toDoId],
        (currentData: ToDoTask[]) => {
          return currentData.map((task) => {
            if (task.id === taskId) {
              return { ...task, title: newTitle }
            }

            return task
          })
        },
      )

      toast.success('Título atualizado')
    },
    onError: (error, variables) => {
      if (error.message === '23505') {
        setError('newTitle', { type: 'custom', message: 'Título duplicado' })
        toast.warning(`A task ${variables.newTitle} já existe`)
      } else {
        toast.warning(`Erro ao atualizar título`)
      }
    },
  })

  async function handleTaskTitleEdit(data: NewTaskFormSchema) {
    if (data.newTitle === title) return

    await editTaskTitleMutation({
      newTitle: data.newTitle,
      user_id: user!.id,
      taskId: id,
    })
  }

  return (
    <DialogContent className="space-y-2">
      <DialogHeader>
        <DialogTitle>Editar tarefa</DialogTitle>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(handleTaskTitleEdit)}
        className="w-full space-y-4"
      >
        <div className="relative w-full space-y-2">
          <Label htmlFor="newTitle">Título</Label>
          <div className="relative w-full">
            <Input
              id="newTitle"
              {...register('newTitle', { required: true, min: 1 })}
              className={twMerge(
                errors.newTitle && 'border-destructive',
                errors.newTitle?.type === 'custom' && 'border-orange-500',
              )}
              autoComplete="off"
              defaultValue={title}
              disabled={isEditTaskTitlePending}
            />
            {errors.newTitle && (
              <span
                className={twMerge(
                  'absolute -top-[1.563rem] right-2 text-sm text-destructive',
                  errors.newTitle.type === 'custom' && 'text-orange-500',
                )}
              >
                {errors.newTitle.message}
              </span>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="ml-auto block w-full"
          disabled={isEditTaskTitlePending}
        >
          {isEditTaskTitlePending ? (
            <LoaderCircle className="mx-auto size-[1.2rem] animate-spin" />
          ) : (
            'Salvar alteração'
          )}
        </Button>
      </form>
    </DialogContent>
  )
}
