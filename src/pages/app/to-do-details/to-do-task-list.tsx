import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

import { ToDoTask } from '@/pages/app/to-do-details/to-do-task'
import { ToDoTaskListSkeleton } from '@/pages/app/to-do-details/to-do-task-list-skeleton'
import { getToDoTasks } from '@/services/get-to-do-tasks'
import { useStore } from '@/store/use-store'

export function ToDoTaskList() {
  const { toDoId } = useParams() as { toDoId: string }
  const user = useStore((state) => state.user)

  const { data: toDoTasks, isFetching } = useQuery({
    queryKey: ['to-do-tasks', toDoId],
    queryFn: () => getToDoTasks(user!.id, toDoId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!user,
  })

  return (
    <div
      className={twMerge(
        'h-full space-y-4 overflow-y-auto pt-3',
        isFetching && 'space-y-2',
      )}
    >
      {isFetching ? (
        <ToDoTaskListSkeleton />
      ) : (
        <>
          {toDoTasks?.map((task) => (
            <ToDoTask
              key={task.id}
              id={task.id}
              title={task.title}
              isCompleted={task.isCompleted}
            />
          ))}
          {!toDoTasks?.length && (
            <p className="mx-auto text-center">
              Você não possui nenhuma tarefa, clique em nova tarefa para criar.
            </p>
          )}
        </>
      )}
    </div>
  )
}
