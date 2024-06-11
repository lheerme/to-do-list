import { Plus } from 'lucide-react'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TodosContext } from '@/contexts/TodosContexts'
import { ListLink } from '@/pages/app/ListLink'
import { generateSlug } from '@/utils/generateSlug'

interface FormInputProps {
  listTitle: string
}

export function Home() {
  const { todoList, setTodoList } = useContext(TodosContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    resetField,
  } = useForm<FormInputProps>()

  function handleNewTodoSubmit(data: FormInputProps) {
    const { listTitle } = data

    if (errors.listTitle) {
      return
    }

    if (todoList.find((todo) => todo.slug === generateSlug(listTitle))) {
      setError('listTitle', { type: 'custom', message: 'Título duplicado' })
      return
    }

    const newTodoList = [
      ...todoList,
      {
        id: uuidv4(),
        title: listTitle,
        slug: generateSlug(listTitle),
        todoTasks: [],
      },
    ]

    setTodoList(newTodoList)
    localStorage.setItem('@to-do-list-items', JSON.stringify(newTodoList))
    toast.success('Lista criada com sucesso')
    resetField('listTitle')
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center">
        <h2 className="text-xl font-bold tracking-tight">Minhas listas</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto" size="sm">
              <Plus className="mr-2 size-4" />
              Nova lista
            </Button>
          </DialogTrigger>
          <DialogContent className="space-y-2">
            <DialogHeader>
              <DialogTitle>Nova Lista</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(handleNewTodoSubmit)}
              className="w-full space-y-4"
            >
              <div className="relative mx-auto flex w-full items-center gap-4 md:w-4/5">
                <Label htmlFor="title">Título</Label>
                <div className="relative w-full">
                  <Input
                    {...register('listTitle', { required: true, min: 1 })}
                    className={twMerge(
                      errors.listTitle && 'border-destructive',
                      errors.listTitle?.type === 'custom' &&
                        'border-orange-500',
                    )}
                    autoComplete="off"
                  />
                  {errors.listTitle ? (
                    errors.listTitle.type === 'custom' ? (
                      <span className="absolute -bottom-6 text-sm text-orange-500">
                        {errors.listTitle.message}
                      </span>
                    ) : (
                      <span className="absolute -bottom-6 text-sm text-destructive">
                        Campo obrigatório
                      </span>
                    )
                  ) : null}
                </div>
              </div>
              <Button type="submit" className="ml-auto block">
                Adicionar lista
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* LISTAGEM DOS TO-DOS */}
      <div className="h-full space-y-1 overflow-y-auto pt-3">
        {todoList.map((todo) => (
          <ListLink key={todo.id} id={todo.id} to={`/list/${todo.slug}`} />
        ))}
        {!todoList.length && (
          <p className="mx-auto text-center">
            Você não possui nenhuma lista, clique em nova lista para criar.
          </p>
        )}
      </div>
    </div>
  )
}
