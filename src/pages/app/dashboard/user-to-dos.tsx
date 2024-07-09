import { useQuery } from '@tanstack/react-query'
import { twMerge } from 'tailwind-merge'

import { ToDoLink } from '@/pages/app/dashboard/to-do-link'
import { UserToDosSkeleton } from '@/pages/app/dashboard/user-to-dos-skeleton'
import { getUserToDos } from '@/services/get-user-to-dos'
import { useStore } from '@/store/use-store'

export function UserToDos() {
  const user = useStore((state) => state.user)

  const { data: userToDos, isFetching } = useQuery({
    queryKey: ['user-to-dos', user!.id],
    queryFn: () => getUserToDos(user!.id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!user,
  })

  return (
    <div
      className={twMerge(
        'h-full space-y-1 overflow-y-auto pt-3',
        isFetching && 'space-y-2',
      )}
    >
      {isFetching ? (
        <UserToDosSkeleton />
      ) : (
        <>
          {userToDos?.map((todo) => (
            <ToDoLink
              key={todo.id}
              title={todo.title}
              to={`/list/${todo.id}`}
            />
          ))}
          {!userToDos?.length && (
            <p className="mx-auto text-center">
              Você não possui nenhum to-do, clique em novo to-do para criar.
            </p>
          )}
        </>
      )}
    </div>
  )
}
