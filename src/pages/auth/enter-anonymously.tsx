import { UserX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/use-store'

export function EnterAnonymously() {
  const setIsAnon = useStore((state) => state.setIsAnon)
  const navigate = useNavigate()

  function handleEnterAnonymously() {
    setIsAnon(true)
    navigate('/dashboard')
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full" variant="secondary">
            <UserX className="mr-2 h-[1.3rem] w-[1.3rem]" />{' '}
            <span className="pt-0.5">Entrar anonimamente</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja entrar anonimamente?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Se você entrar anonimamente, seus to-dos apenas ficaram salvos
              localmente no seu navagador
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEnterAnonymously}>
              Entrar mesmo assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
