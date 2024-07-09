import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
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
import { UserToDos as UserToDosInterface } from '@/interfaces/user-to-dos'
import { AddNewTodo } from '@/services/add-new-to-do'
import { useStore } from '@/store/use-store'

const newToDoFormSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .regex(
      /^(?!\d)(?!.*--)(?!.* {2})[A-Za-z0-9]+(?:[ -][A-Za-z0-9]+)*$/,
      'Título inválido',
    ),
})

type NewToDoFormSchema = z.infer<typeof newToDoFormSchema>

export function AddNewToDoDialog() {
  const user = useStore((state) => state.user)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    resetField,
  } = useForm<NewToDoFormSchema>({
    resolver: zodResolver(newToDoFormSchema),
  })

  const { mutateAsync: addNewTodoMutation, isPending } = useMutation({
    mutationFn: AddNewTodo,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ['user-to-dos', user!.id],
        (currentToDos: UserToDosInterface[]) => {
          return [
            {
              id: data,
              title: variables.title,
              isCompleted: null,
            },
            ...currentToDos,
          ]
        },
      )
      toast.success('To-do criado com sucesso')
      resetField('title')
    },
    onError: (error, variables) => {
      if (error.message === '23505') {
        setError('title', { type: 'custom', message: 'Título duplicado' })
        toast.warning(`O to-do ${variables.title} já existe`)
      }
    },
  })

  async function handleNewTodoSubmit(data: NewToDoFormSchema) {
    const { title } = data

    if (errors.title) {
      return
    }

    await addNewTodoMutation({
      title,
      user_id: user!.id,
    })
  }

  return (
    <DialogContent className="space-y-2">
      <DialogHeader>
        <DialogTitle>Novo to-do</DialogTitle>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(handleNewTodoSubmit)}
        className="w-full space-y-4"
      >
        <div className="relative w-full space-y-2">
          <Label htmlFor="title">Título</Label>
          <div className="relative w-full">
            <Input
              {...register('title', { required: true, min: 1 })}
              className={twMerge(
                errors.title && 'border-destructive',
                errors.title?.type === 'custom' && 'border-orange-500',
              )}
              autoComplete="off"
              disabled={isPending}
            />
            {errors.title && (
              <span
                className={twMerge(
                  'absolute -top-[1.563rem] right-2 text-sm text-destructive',
                  errors.title.type === 'custom' && 'text-orange-500',
                )}
              >
                {errors.title.message}
              </span>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="ml-auto block w-full"
          disabled={isPending}
        >
          {isPending ? (
            <LoaderCircle className="mx-auto size-[1.2rem] animate-spin" />
          ) : (
            'Adicionar to-do'
          )}
        </Button>
      </form>
    </DialogContent>
  )
}
