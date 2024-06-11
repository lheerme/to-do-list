import { Pencil, Trash2 } from 'lucide-react'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import { generateSlug } from '@/utils/generateSlug'

interface FormInputProps {
  newListTitle: string
}

export function ListHeader() {
  const { listSlug } = useParams()
  const { todoList, setTodoList } = useContext(TodosContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormInputProps>()
  const navigate = useNavigate()

  const todo = todoList.find((todo) => todo.slug === listSlug)

  function handleEditListTitle(data: FormInputProps) {
    const newListTitle = data.newListTitle.trim()

    if (newListTitle === todo?.title) return

    if (errors.newListTitle) {
      return
    }

    const isTitleRepeated = todoList.find((todo) => todo.title === newListTitle)

    if (isTitleRepeated) {
      setError('newListTitle', {
        type: 'custom',
        message: 'Este título já existe',
      })
      return
    }

    const newSlug = generateSlug(newListTitle)

    const newTodoList = todoList.map((todo) => {
      if (todo.slug === listSlug) {
        return {
          ...todo,
          slug: newSlug,
          title: newListTitle,
        }
      }
      return todo
    })

    setTodoList(newTodoList)
    localStorage.setItem('@to-do-list-items', JSON.stringify(newTodoList))
    toast.success('Título da lista editado com sucesso')
    navigate(`/list/${newSlug}`, { replace: true })
  }

  function handleListDelete() {
    const newTodoList = todoList.filter((todo) => todo.slug !== listSlug)

    setTodoList(newTodoList)
    localStorage.setItem('@to-do-list-items', JSON.stringify(newTodoList))
    toast.success('Lista deletada com sucesso')
    navigate(`/`, { replace: true })
  }

  return (
    <div className="flex items-center">
      {/* Título */}
      <h2
        title={todo?.title}
        className="cursor-default truncate text-xl font-bold tracking-tight"
      >
        {todo?.title}
      </h2>
      <div className="ml-auto flex items-center gap-2">
        {/* Editar */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Pencil className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DialogTrigger>
          <DialogContent className="space-y-2">
            <DialogHeader>
              <DialogTitle>Editar título</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(handleEditListTitle)}
              className="w-full space-y-4"
            >
              <div className="relative mx-auto flex w-full items-center gap-4 md:w-4/5">
                <Label htmlFor="title">Título</Label>
                <div className="relative w-full">
                  <Input
                    {...register('newListTitle', { required: true, min: 1 })}
                    className={twMerge(
                      errors.newListTitle && 'border-destructive',
                      errors.newListTitle?.type === 'custom' &&
                        'border-orange-500',
                    )}
                    autoComplete="off"
                    defaultValue={todo?.title}
                  />
                  {errors.newListTitle ? (
                    errors.newListTitle.type === 'custom' ? (
                      <span className="absolute -bottom-6 text-sm text-orange-500">
                        {errors.newListTitle.message}
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
                Salvar alteração
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        {/* Deletar */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja deletar?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não poderá ser desfeita. Isso vai permanentemente
                deletar esta lista.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleListDelete}>
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
