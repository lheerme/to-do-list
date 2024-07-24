import { ToDoLink } from '@/pages/app/dashboard/to-do-link'
import { useStore } from '@/store/use-store'

export function UserToDosAnonymous() {
  const anonToDos = useStore((state) => state.anonToDos)

  return (
    <div className="h-full space-y-1 overflow-y-auto pt-3">
      {anonToDos?.map((todo) => (
        <ToDoLink
          key={todo.id}
          id={todo.id}
          title={todo.title}
          to={`/anon-list/${todo.id}`}
        />
      ))}
      {!anonToDos?.length && (
        <p className="mx-auto text-center">
          Você não possui nenhum to-do, clique em novo to-do para criar.
        </p>
      )}
    </div>
  )
}
