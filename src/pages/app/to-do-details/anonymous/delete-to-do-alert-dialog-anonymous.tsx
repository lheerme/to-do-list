import { useNavigate, useParams } from 'react-router-dom'
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

export function DeleteToDoAlertDialogAnonymous() {
  const { toDoId } = useParams() as { toDoId: string }
  const navigate = useNavigate()
  const { anonToDos, setAnonToDos } = useStore(
    useShallow((state) => ({
      anonToDos: state.anonToDos,
      setAnonToDos: state.setAnonToDos,
    })),
  )

  function handleListDelete() {
    const newAnonToDos = anonToDos.filter((toDo) => toDo.id !== toDoId)

    setAnonToDos(newAnonToDos)
    navigate(`/dashboard`, { replace: true })
    toast.success(`To-do apagado com sucesso`)
    localStorage.setItem('@anon-to-do-list-items', JSON.stringify(newAnonToDos))
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
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={handleListDelete}
        >
          Deletar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
