import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { UserToDos } from '@/interfaces/user-to-dos'
import { DeleteToDo } from '@/services/delete-to-do'
import { useStore } from '@/store/use-store'

export function DeletoToDoAlertDialog() {
  const user = useStore((state) => state.user)
  const { toDoId } = useParams() as { toDoId: string }
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutateAsync: DeleteTodoMutation, isPending } = useMutation({
    mutationFn: DeleteToDo,
    onSuccess: () => {
      const cachedToDos = queryClient.getQueryData<UserToDos[]>([
        'user-to-dos',
        user!.id,
      ])

      if (cachedToDos) {
        queryClient.setQueryData(['user-to-dos', user!.id], () =>
          cachedToDos.filter((toDo) => toDo.id !== toDoId),
        )
      }

      navigate(`/dashboard`, { replace: true })
      toast.success(`To-do apagado com sucesso`)
    },
    onError: () => {
      toast.warning(`Erro ao apagar to-do`)
    },
  })

  async function handleListDelete() {
    await DeleteTodoMutation({ userId: user!.id, toDoId })
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Tem certeza que deseja deletar?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação não poderá ser desfeita. Isso vai permanentemente deletar
          este to-do.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={handleListDelete}
          disabled={isPending}
        >
          Deletar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
