import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Navigate, useParams } from 'react-router-dom'

import { AddNewTaskForm } from '@/pages/app/to-do-details/add-new-task-form'
import { ToDoDetailsHeader } from '@/pages/app/to-do-details/to-do-details-header'
import { ToDoTaskList } from '@/pages/app/to-do-details/to-do-task-list'
import { getToDoDetails } from '@/services/get-to-do-details'
import { useStore } from '@/store/use-store'

export function ToDoDetails() {
  const { toDoId } = useParams() as { toDoId: string }
  const user = useStore((state) => state.user)

  const { data: toDoDetails, isFetching } = useQuery({
    queryKey: ['user-to-do-detail', toDoId],
    queryFn: () => getToDoDetails(user!.id, toDoId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!user,
  })

  if (!isFetching && toDoDetails === undefined) {
    return <Navigate to={'/'} />
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <Helmet title={toDoDetails?.title ?? 'Carregando...'} />
      <ToDoDetailsHeader />
      <AddNewTaskForm />
      <ToDoTaskList />
    </div>
  )
}
