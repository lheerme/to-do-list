import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
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
import { ToDoTask } from '@/interfaces/to-do-task'
import { DeleteTask } from '@/services/delete-task'
import { useStore } from '@/store/use-store'

interface DeleteTaskAlertDialogProps {
  id: string
}

export function DeleteTaskAlertDialog({ id }: DeleteTaskAlertDialogProps) {
  const user = useStore((state) => state.user)
  const { toDoId } = useParams() as { toDoId: string }
  const queryClient = useQueryClient()

  const { mutateAsync: deleteTaskMutation, isPending: isDeleteTaskPending } =
    useMutation({
      mutationFn: DeleteTask,
      onSuccess: (_, { taskId }) => {
        queryClient.setQueryData(
          ['to-do-tasks', toDoId],
          (currentData: ToDoTask[]) => {
            return currentData.filter((task) => task.id !== taskId)
          },
        )

        toast.success('Tarefa deletada com sucesso')
      },
      onError: () => {
        toast.warning('Erro ao deletar tarefa')
      },
    })

  async function handleTaskDelete() {
    await deleteTaskMutation({
      taskId: id,
      userId: user!.id,
    })
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Tem certeza que deseja deletar?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação não poderá ser desfeita. Isso vai permanentemente deletar
          esta tarefa.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={handleTaskDelete}
          disabled={isDeleteTaskPending}
        >
          Deletar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
