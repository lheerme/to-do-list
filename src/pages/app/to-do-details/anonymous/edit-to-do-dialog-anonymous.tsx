import { zodResolver } from '@hookform/resolvers/zod'
import { produce } from 'immer'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

interface EditToDoDialogAnonymousProps {
  setIsEditToDoDialogOpen: (arg0: boolean) => void
}

export function EditToDoDialogAnonymous({
  setIsEditToDoDialogOpen,
}: EditToDoDialogAnonymousProps) {
  const { toDoId } = useParams() as { toDoId: string }
  const { anonToDos, setAnonToDos } = useStore(
    useShallow((state) => ({
      anonToDos: state.anonToDos,
      setAnonToDos: state.setAnonToDos,
    })),
  )

  const currentAnonToDo = anonToDos.find((toDo) => toDo.id === toDoId)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<NewTitleFormSchema>({
    resolver: zodResolver(newTitleFormSchema),
    defaultValues: {
      newTitle: currentAnonToDo?.title,
    },
  })

  function handleEditListTitle(data: NewTitleFormSchema) {
    const { newTitle } = data

    if (errors.newTitle) {
      return
    }

    const isDuplicated = anonToDos
      .map((toDo) => toDo.title.toLowerCase())
      .includes(newTitle.toLowerCase())

    if (isDuplicated) {
      setError('newTitle', { type: 'custom', message: 'Título duplicado' })
      toast.warning(`O to-do ${newTitle} já existe`)
      return
    }

    const newAnonToDos = produce(anonToDos, (draft) => {
      return draft.map((toDo) => {
        if (toDo.id === toDoId) {
          return { ...toDo, title: newTitle }
        }

        return toDo
      })
    })

    setAnonToDos(newAnonToDos)
    toast.success('Título atualizado')
    setIsEditToDoDialogOpen(false)
    localStorage.setItem('@anon-to-do-list-items', JSON.stringify(newAnonToDos))
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
          Salvar alteração
        </Button>
      </form>
    </DialogContent>
  )
}
