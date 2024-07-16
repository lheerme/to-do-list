import { Helmet } from 'react-helmet-async'
import { Navigate, useParams } from 'react-router-dom'

import { AddNewTaskFormAnonymous } from '@/pages/app/to-do-details/anonymous/add-new-task-form-anonymous'
import { ToDoDetailsHeaderAnonymous } from '@/pages/app/to-do-details/anonymous/to-do-details-header-anonymous'
import { ToDoTaskListAnonymous } from '@/pages/app/to-do-details/anonymous/to-do-task-list-anonymous'
import { useStore } from '@/store/use-store'

export function ToDoDetailsAnonymous() {
  const { toDoId } = useParams() as { toDoId: string }
  const anonToDos = useStore((state) => state.anonToDos)

  const anonToDosIdList = anonToDos.map((toDo) => toDo.id)

  if (!anonToDosIdList.includes(toDoId)) {
    return <Navigate to={'/sign-in'} />
  }

  const currentAnonToDo = anonToDos.find((toDo) => toDo.id === toDoId)

  return (
    <div className="flex h-full flex-col gap-4">
      <Helmet title={currentAnonToDo?.title ?? 'Carregando...'} />
      <ToDoDetailsHeaderAnonymous />
      <AddNewTaskFormAnonymous />
      <ToDoTaskListAnonymous />
    </div>
  )
}
