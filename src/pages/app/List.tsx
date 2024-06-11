import { Plus } from 'lucide-react'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TodosContext } from '@/contexts/TodosContexts'
import { Task } from '@/pages/app/Task'

import { ListHeader } from './ListHeader'

interface FormInputProps {
  taskTitle: string
}

export function List() {
  const { listSlug } = useParams()
  const { todoList, setTodoList } = useContext(TodosContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    resetField,
  } = useForm<FormInputProps>()

  const todo = todoList.find((todo) => todo.slug === listSlug)

  function handleNewTaskSubmit(data: FormInputProps) {
    const taskTitle = data.taskTitle.trim()

    if (errors.taskTitle) {
      return
    }

    const isTitleRepeated = todo?.todoTasks.find(
      (task) => task.title === taskTitle,
    )

    if (isTitleRepeated) {
      setError('taskTitle', { type: 'custom', message: 'Tarefa duplicada' })
      return
    }

    const newTask = {
      title: taskTitle,
      id: uuidv4(),
      isComplete: false,
    }

    const newTodoList = todoList.map((todo) => {
      if (todo.slug === listSlug) {
        return {
          ...todo,
          todoTasks: [...todo.todoTasks, newTask],
        }
      }
      return todo
    })

    setTodoList(newTodoList)
    localStorage.setItem('@to-do-list-items', JSON.stringify(newTodoList))
    toast.success(`Tarefa ${taskTitle} criada com sucesso`)
    resetField('taskTitle')
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <ListHeader />
      {/* INPUT DE NOVA TASK */}
      <form
        onSubmit={handleSubmit(handleNewTaskSubmit)}
        className="flex items-center gap-2"
      >
        <div className="relative w-full">
          <Input
            {...register('taskTitle', { required: true, min: 1 })}
            className="h-9"
            type="text"
            placeholder="Nova tarefa"
            autoComplete="off"
          />
          {errors.taskTitle && (
            <span className="absolute -bottom-6 left-3 text-xs">
              {errors.taskTitle.message}
            </span>
          )}
        </div>
        <Button type="submit" className="ml-auto" size="sm">
          <Plus className="mr-2 size-4" />
          Nova tarefa
        </Button>
      </form>
      {/* LISTA DAS TAREFAS */}
      <div className="h-full space-y-4 overflow-y-auto pt-3">
        {todo?.todoTasks.map((task) => (
          <Task key={`task-${task.id}`} values={task} />
        ))}
        {!todo?.todoTasks.length && (
          <p className="mx-auto text-center">
            Você não possui nenhuma tarefa, clique em nova tarefa para criar.
          </p>
        )}
      </div>
    </div>
  )
}
