import { LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function LoadingPage() {
  return (
    <div className="h-[calc(100dvh_-_28px)] px-3 pt-3">
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <LoaderCircle className="size-10 animate-spin" />
        <span>Carregando...</span>
      </div>
      <footer className="py-1.5">
        <p className="text-center text-xs font-medium">
          © 2024 -{' '}
          <Link
            to={'https://guilhermesouza.vercel.app'}
            target="_blank"
            className="underline"
          >
            Guilherme Souza
          </Link>
          . Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
