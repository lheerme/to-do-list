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

interface EditTaskDialogAnonymousProps {
  title: string
  id: string
  setIsEditTaskDialogOpen: (arg0: boolean) => void
}

export function EditTaskDialogAnonymous({
  title,
  id,
  setIsEditTaskDialogOpen,
}: EditTaskDialogAnonymousProps) {
  const { toDoId } = useParams() as { toDoId: string }
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
  } = useForm<NewTaskFormSchema>({
    resolver: zodResolver(newTaskFormSchema),
  })

  const currentAnonToDo = anonToDos.find((toDo) => toDo.id === toDoId)

  function handleTaskTitleEdit(data: NewTaskFormSchema) {
    const { newTitle } = data
    if (newTitle === title) return

    const isDuplicated = currentAnonToDo?.tasks
      .map((task) => task.title.toLowerCase())
      .includes(newTitle.toLowerCase())

    if (isDuplicated) {
      setError('newTitle', { type: 'custom', message: 'Título duplicado' })
      toast.warning(`A task ${newTitle} já existe`)
      return
    }

    const anonToDoIndex = anonToDos.findIndex((toDo) => toDo.id === toDoId)
    const anonTaskIndex = anonToDos[anonToDoIndex].tasks.findIndex(
      (task) => task.id === id,
    )

    const newAnonToDos = produce(anonToDos, (draft) => {
      draft[anonToDoIndex].tasks[anonTaskIndex].title = newTitle
    })

    setAnonToDos(newAnonToDos)
    setIsEditTaskDialogOpen(false)
    toast.success('Título atualizado')
    localStorage.setItem('@anon-to-do-list-items', JSON.stringify(newAnonToDos))
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
              data-test="edit-task-input"
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
