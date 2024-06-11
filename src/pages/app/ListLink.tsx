import { ChevronRight } from 'lucide-react'
import { useContext } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

import { Separator } from '@/components/ui/separator'
import { TodosContext } from '@/contexts/TodosContexts'

interface ListLinkProps extends LinkProps {
  id: string
}

export function ListLink(props: ListLinkProps) {
  const { id, ...rest } = props
  const { todoList } = useContext(TodosContext)

  const todo = todoList.find((todo) => todo.id === id)

  const tasksLength = todo?.todoTasks.length

  const totalCompleted = todo?.todoTasks.reduce((acumulator, task) => {
    if (task.isComplete === true) {
      return acumulator + 1
    } else {
      return acumulator
    }
  }, 0)

  return (
    <Link
      className="group flex h-10 flex-col items-center transition-colors hover:bg-muted"
      {...rest}
    >
      <div className="flex w-full items-center gap-2 px-4 py-2">
        <h3 title={todo?.title} className="truncate">
          {todo?.title}
        </h3>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            {tasksLength ? (
              <span className="text-sm text-muted transition-colors group-hover:text-foreground">
                {totalCompleted}/{tasksLength}
              </span>
            ) : null}
            <div
              className={twMerge(
                'size-2 rounded-full',
                tasksLength === 0
                  ? 'bg-gray-500'
                  : totalCompleted === tasksLength
                    ? 'bg-green-600'
                    : 'bg-orange-600',
              )}
            />
            <span className="hidden min-w-[70px] text-center text-sm sm:block">
              {tasksLength === 0
                ? 'Lista vazia'
                : totalCompleted === tasksLength
                  ? 'Completo'
                  : 'Pendente'}
            </span>
          </div>
          <ChevronRight className="size-4" />
        </div>
      </div>
      <Separator className="w-full" />
    </Link>
  )
}
