import { produce } from 'immer'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useStore } from '@/store/use-store'

interface DeleteTaskAlertDialogAnonymousProps {
  id: string
}

export function DeleteTaskAlertDialogAnonymous({
  id,
}: DeleteTaskAlertDialogAnonymousProps) {
  const { toDoId } = useParams() as { toDoId: string }
  const { anonToDos, setAnonToDos } = useStore(
    useShallow((state) => ({
      anonToDos: state.anonToDos,
      setAnonToDos: state.setAnonToDos,
    })),
  )

  function handleTaskDelete() {
    const anonToDoIndex = anonToDos.findIndex((toDo) => toDo.id === toDoId)
    const anonTaskIndex = anonToDos[anonToDoIndex].tasks.findIndex(
      (task) => task.id === id,
    )

    const newAnonToDos = produce(anonToDos, (draft) => {
      draft[anonToDoIndex].tasks.splice(anonTaskIndex, 1)
    })

    setAnonToDos(newAnonToDos)
    localStorage.setItem('@anon-to-do-list-items', JSON.stringify(newAnonToDos))
    toast.success('Tarefa deletada com sucesso')
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
        >
          Deletar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
