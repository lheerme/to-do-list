import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { UserToDos } from '@/interfaces/user-to-dos'
import { EditToDoTitle } from '@/services/edit-to-do-title'
import { getToDoDetails } from '@/services/get-to-do-details'
import { useStore } from '@/store/use-store'

const newTitleFormSchema = z.object({
  newTitle: z
    .string()
    .min(1, 'O título é obrigatório')
    .regex(
      /^(?!\d)(?!.*--)(?!.* {2})[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:[ -][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*$/,
      'Título inválido',
    ),
})

type NewTitleFormSchema = z.infer<typeof newTitleFormSchema>

interface EditToDoDialogProps {
  setIsEditToDoDialogOpen: (arg0: boolean) => void
}

export function EditToDoDialog({
  setIsEditToDoDialogOpen,
}: EditToDoDialogProps) {
  const user = useStore((state) => state.user)
  const { toDoId } = useParams() as { toDoId: string }
  const queryClient = useQueryClient()

  const { data: toDoDetails } = useQuery({
    queryKey: ['user-to-do-detail', toDoId],
    queryFn: () => getToDoDetails(user!.id, toDoId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!user,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<NewTitleFormSchema>({
    resolver: zodResolver(newTitleFormSchema),
  })

  const {
    mutateAsync: editToDoTitleMutation,
    isPending: isEditToDoTitlePending,
  } = useMutation({
    mutationFn: EditToDoTitle,
    onSuccess: (_, variables) => {
      const cachedToDos = queryClient.getQueryData(['user-to-dos', user!.id])
      const cachedToDoDetail = queryClient.getQueryData([
        'user-to-do-detail',
        toDoId,
      ])

      if (cachedToDos) {
        queryClient.setQueryData(
          ['user-to-dos', user!.id],
          (currentToDos: UserToDos[]) => {
            const newToDos = currentToDos.map((toDo) => {
              if (toDo.id === variables.toDoId) {
                return {
                  ...toDo,
                  title: variables.newTitle,
                }
              }

              return toDo
            })

            return newToDos
          },
        )
      }

      if (cachedToDoDetail) {
        queryClient.setQueryData(
          ['user-to-do-detail', toDoId],
          (currentToDos: { id: string; title: string }) => {
            return { ...currentToDos, title: variables.newTitle }
          },
        )
      }

      setIsEditToDoDialogOpen(false)
      toast.success('Título atualizado')
    },
    onError: (error, variables) => {
      if (error.message === '23505') {
        setError('newTitle', { type: 'custom', message: 'Título duplicado' })
        toast.warning(`O to-do ${variables.newTitle} já existe`)
      } else {
        toast.warning(`Erro ao atualizar título`)
      }
    },
  })

  async function handleEditListTitle(data: NewTitleFormSchema) {
    if (errors.newTitle) {
      return
    }

    if (data.newTitle === toDoDetails?.title) {
      return
    }

    await editToDoTitleMutation({
      user_id: user!.id,
      newTitle: data.newTitle,
      toDoId,
    })
  }

  return (
    <DialogContent className="space-y-2">
      <DialogHeader>
        <DialogTitle>Editar título</DialogTitle>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(handleEditListTitle)}
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
              defaultValue={toDoDetails?.title}
              disabled={isEditToDoTitlePending}
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
        <Button type="submit" className="ml-auto block w-full">
          {isEditToDoTitlePending ? (
            <LoaderCircle className="mx-auto size-[1.2rem] animate-spin" />
          ) : (
            'Salvar alteração'
          )}
        </Button>
      </form>
    </DialogContent>
  )
}
