import { zodResolver } from '@hookform/resolvers/zod'
import { produce } from 'immer'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

export function AddNewTaskFormAnonymous() {
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
    resetField,
  } = useForm<NewTaskFormSchema>({
    resolver: zodResolver(newTaskFormSchema),
  })

  const currentAnonToDo = anonToDos.find((toDo) => toDo.id === toDoId)

  function handleNewTaskSubmit(data: NewTaskFormSchema) {
    const { newTask } = data

    if (errors.newTask) {
      return
    }

    const isDuplicated = currentAnonToDo?.tasks
      .map((task) => task.title.toLowerCase())
      .includes(newTask.toLowerCase())

    if (isDuplicated) {
      setError('newTask', { type: 'custom', message: 'Título duplicado' })
      toast.warning(`A task ${newTask} já existe`)
      return
    }

    const anonToDoIndex = anonToDos.findIndex((toDo) => toDo.id === toDoId)

    const newAnonToDos = produce(anonToDos, (draft) => {
      draft[anonToDoIndex].tasks.push({
        id: crypto.randomUUID(),
        title: newTask,
        isCompleted: false,
      })
    })

    setAnonToDos(newAnonToDos)
    toast.success('Task criada com sucesso')
    resetField('newTask')
    localStorage.setItem('@anon-to-do-list-items', JSON.stringify(newAnonToDos))
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
        />
        {errors.newTask && (
          <span className="absolute -bottom-5 left-2 text-xs">
            {errors.newTask.message}
          </span>
        )}
      </div>
      <Button type="submit" className="ml-auto" size="sm">
        <Plus className="mr-2 size-4" />
        Adicionar
      </Button>
    </form>
  )
}
