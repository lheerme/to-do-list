import { zodResolver } from '@hookform/resolvers/zod'
import { produce } from 'immer'
import { useForm } from 'react-hook-form'
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

interface AddNewToDoDialogProps {
  setIsAddNewToDoDialogOpen: (arg0: boolean) => void
}

export function AddNewToDoDialogAnonymous({
  setIsAddNewToDoDialogOpen,
}: AddNewToDoDialogProps) {
  const { anonToDos, setAnonToDos } = useStore(
    useShallow((state) => ({
      anonToDos: state.anonToDos,
      setAnonToDos: state.setAnonToDos,
    })),
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    resetField,
  } = useForm<NewToDoFormSchema>({
    resolver: zodResolver(newToDoFormSchema),
  })

  function handleNewTodoSubmit(data: NewToDoFormSchema) {
    const { title } = data

    if (errors.title) {
      return
    }

    const isDuplicated = anonToDos
      .map((toDo) => toDo.title.toLowerCase())
      .includes(title.toLowerCase())

    if (isDuplicated) {
      setError('title', { type: 'custom', message: 'Título duplicado' })
      toast.warning(`O to-do ${title} já existe`)
      return
    }

    const newAnonToDos = produce(anonToDos, (draft) => {
      draft.push({
        id: crypto.randomUUID(),
        title,
        tasks: [],
      })
    })

    setAnonToDos(newAnonToDos)
    toast.success('To-do criado com sucesso')
    setIsAddNewToDoDialogOpen(false)
    resetField('title')
    localStorage.setItem('@anon-to-do-list-items', JSON.stringify(newAnonToDos))
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
        <Button type="submit" className="ml-auto block w-full">
          Adicionar to-do
        </Button>
      </form>
    </DialogContent>
  )
}
