import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { LoginWithGithubButton } from '@/components/login-with-github-button'
import { LoginWithGoogleButton } from '@/components/login-with-google-button'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function SignIn() {
  return (
    <div className="w-full p-8">
      <Helmet title="Sign In" />
      <Button
        variant="outline"
        asChild
        className="absolute right-4 top-4 lg:right-8 lg:top-8"
      >
        <Link to={'/sign-up'}>Criar conta</Link>
      </Button>
      <div className="mx-auto w-full max-w-96 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Acessar to-dos
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Acesse, crie, edite, ou apague sua lista de to-dos!
          </p>
        </div>

        <LoginWithGithubButton />
        <div className="flex items-center justify-between">
          <Separator orientation="horizontal" className="h-0.5 w-2/5" />
          <span className="text-sm text-muted-foreground">ou</span>
          <Separator orientation="horizontal" className="h-0.5 w-2/5" />
        </div>
        <LoginWithGoogleButton />
      </div>
    </div>
  )
}
