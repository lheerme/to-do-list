import { useParams } from 'react-router-dom'

import { ToDoTaskAnonymous } from '@/pages/app/to-do-details/anonymous/to-do-task-anonymous'
import { useStore } from '@/store/use-store'

export function ToDoTaskListAnonymous() {
  const { toDoId } = useParams() as { toDoId: string }
  const anonToDos = useStore((state) => state.anonToDos)

  const currentAnonToDo = anonToDos.find((toDo) => toDo.id === toDoId)

  return (
    <div className="h-full space-y-4 overflow-y-auto pt-3">
      {currentAnonToDo?.tasks.map((task) => (
        <ToDoTaskAnonymous
          key={task.id}
          id={task.id}
          title={task.title}
          isCompleted={task.isCompleted}
        />
      ))}
      {!currentAnonToDo?.tasks.length && (
        <p className="mx-auto text-center">
          Você não possui nenhuma tarefa, clique em adicionar para criar uma
          nova tarefa.
        </p>
      )}
    </div>
  )
}
