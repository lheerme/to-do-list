import { produce } from 'immer'
import { Pencil, Trash2 } from 'lucide-react'
import { ComponentProps, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { TodosContext } from '@/contexts/TodosContexts'

interface TaskProps extends ComponentProps<'div'> {
  values: {
    id: string
    title: string
    isComplete: boolean
  }
}

interface FormInputProps {
  newTaskTitle: string
}

export function Task(props: TaskProps) {
  const { listSlug } = useParams()
  const {
    values: { id, title, isComplete },
    ...rest
  } = props
  const { todoList, setTodoList } = useContext(TodosContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormInputProps>()

  const currentTodoIndex = todoList.findIndex((todo) => {
    return todo.slug === listSlug
  })

  const currentTodoTasksIndex = todoList[currentTodoIndex].todoTasks.findIndex(
    (task) => {
      return task.id === id
    },
  )

  function handleCheckChange(isChecked: boolean | string) {
    const newTodoList = produce(todoList, (draft) => {
      draft[currentTodoIndex].todoTasks[currentTodoTasksIndex].isComplete =
        Boolean(isChecked)
    })

    setTodoList(newTodoList)
    localStorage.setItem('@to-do-list-items', JSON.stringify(newTodoList))
  }

  function handleTaskTitleEdit(data: FormInputProps) {
    const newTaskTitle = data.newTaskTitle.trim()

    if (newTaskTitle === title) return

    const currentTodo = todoList.find((todo) => todo.slug === listSlug)
    const isTitleRepeated = currentTodo?.todoTasks.find(
      (task) => task.title === newTaskTitle,
    )

    if (isTitleRepeated) {
      setError('newTaskTitle', {
        type: 'custom',
        message: 'Essa tarefa já existe',
      })

      return
    }

    const newTodoList = produce(todoList, (draft) => {
      draft[currentTodoIndex].todoTasks[currentTodoTasksIndex].title =
        newTaskTitle
    })

    setTodoList(newTodoList)
    localStorage.setItem('@to-do-list-items', JSON.stringify(newTodoList))
    toast.success('Tarefa editada com sucesso')
  }

  function handleTaskDelete() {
    const newTodoList = produce(todoList, (draft) => {
      draft[currentTodoIndex].todoTasks.splice(currentTodoTasksIndex, 1)
    })

    setTodoList(newTodoList)
    localStorage.setItem('@to-do-list-items', JSON.stringify(newTodoList))
    toast.success('Tarefa deletada com sucesso')
  }

  return (
    <div
      className={twMerge(
        'relative flex h-12 flex-col justify-between after:absolute after:left-1/2 after:top-1/2 after:block after:h-0.5 after:w-0 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-primary after:transition-all after:content-[""]',
        isComplete ? 'after:w-full' : null,
      )}
      {...rest}
    >
      <div
        className={twMerge(
          'my-auto flex w-full items-center transition-opacity sm:px-4',
          isComplete ? 'opacity-75' : null,
        )}
      >
        {/* LABEL COM CHECKBOX E TÍTULO */}
        <Label
          htmlFor={`task-${id}`}
          title={title}
          className="flex h-full w-[55%] cursor-pointer items-center gap-2 sm:w-2/3"
        >
          <Checkbox
            id={`task-${id}`}
            checked={isComplete}
            onCheckedChange={(checked) => handleCheckChange(checked)}
          />
          <h3 className="truncate text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {title}
          </h3>
        </Label>
        {/* STATUS E OPÇÕES */}
        <div
          className={twMerge(
            'ml-auto flex items-center sm:gap-2',
            isComplete ? 'pointer-events-none' : 'null',
          )}
        >
          <div className="mr-2 flex items-center gap-2 sm:mr-0">
            <div
              className={twMerge(
                'size-2 rounded-full',
                isComplete ? 'bg-green-600' : 'bg-orange-600',
              )}
            />
            <span className="hidden text-sm sm:block">
              {isComplete ? 'Completa' : 'Pendente'}
            </span>
          </div>
          {/* EDITAR TASK */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isComplete}>
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="space-y-2">
              <DialogHeader>
                <DialogTitle>Editar tarefa</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(handleTaskTitleEdit)}
                className="w-full space-y-4"
              >
                <div className="relative mx-auto flex w-full items-center gap-4 md:w-4/5">
                  <Label htmlFor="title">Título</Label>
                  <div className="relative w-full">
                    <Input
                      {...register('newTaskTitle', { required: true, min: 1 })}
                      className={twMerge(
                        errors.newTaskTitle && 'border-destructive',
                        errors.newTaskTitle?.type === 'custom' &&
                          'border-orange-500',
                      )}
                      autoComplete="off"
                      defaultValue={title}
                    />
                    {errors.newTaskTitle ? (
                      errors.newTaskTitle.type === 'custom' ? (
                        <span className="absolute -bottom-6 text-sm text-orange-500">
                          {errors.newTaskTitle.message}
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isComplete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja deletar?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não poderá ser desfeita. Isso vai permanentemente
                  deletar esta tarefa.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleTaskDelete}>
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Separator className="w-full" />
    </div>
  )
}
