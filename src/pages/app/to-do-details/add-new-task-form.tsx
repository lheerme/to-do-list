import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToDoTask } from '@/interfaces/to-do-task'
import { AddNewTask } from '@/services/add-new-task'
import { getToDoTasks } from '@/services/get-to-do-tasks'
import { useStore } from '@/store/use-store'

const newTaskFormSchema = z.object({
  newTask: z
    .string()
    .min(1, 'O título é obrigatório')
    .regex(
      /^(?!\d)(?!.*--)(?!.* {2})[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:[ -][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*$/,
      'Título inválido',
    ),
})

type NewTaskFormSchema = z.infer<typeof newTaskFormSchema>

export function AddNewTaskForm() {
  const { toDoId } = useParams() as { toDoId: string }
  const queryClient = useQueryClient()
  const user = useStore((state) => state.user)

  const { isFetching: isToDoTasksFetching } = useQuery({
    queryKey: ['to-do-tasks', toDoId],
    queryFn: () => getToDoTasks(user!.id, toDoId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!user,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    resetField,
  } = useForm<NewTaskFormSchema>({
    resolver: zodResolver(newTaskFormSchema),
  })

  const { mutateAsync: addNewTaskMutation, isPending: isAddNewTaskPending } =
    useMutation({
      mutationFn: AddNewTask,
      onSuccess: (data) => {
        queryClient.setQueryData(
          ['to-do-tasks', toDoId],
          (currentToDos: ToDoTask[]) => {
            return [
              ...currentToDos,
              {
                id: data.id,
                title: data.title,
                isCompleted: data.isCompleted,
              },
            ]
          },
        )
        toast.success('Task criada com sucesso')
        resetField('newTask')
      },
      onError: (error, variables) => {
        if (error.message === '23505') {
          setError('newTask', { type: 'custom', message: 'Título duplicado' })
          toast.warning(`A task ${variables.title} já existe`)
        }
      },
    })

  async function handleNewTaskSubmit(data: NewTaskFormSchema) {
    if (errors.newTask) {
      return
    }

    await addNewTaskMutation({
      title: data.newTask,
      todo_id: toDoId,
      user_id: user!.id,
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleNewTaskSubmit)}
      className="flex items-center gap-2 px-2 md:px-0"
    >
      <div className="relative w-full">
        <Input
          {...register('newTask', { required: true, min: 1 })}
          className="h-9"
          type="text"
          placeholder="Nova tarefa"
          autoComplete="off"
          disabled={isAddNewTaskPending || isToDoTasksFetching}
        />
        {errors.newTask && (
          <span className="absolute -bottom-5 left-2 text-xs">
            {errors.newTask.message}
          </span>
        )}
      </div>
      <Button
        type="submit"
        className="ml-auto"
        size="sm"
        disabled={isAddNewTaskPending || isToDoTasksFetching}
      >
        <Plus className="mr-2 size-4" />
        Adicionar
      </Button>
    </form>
  )
}
