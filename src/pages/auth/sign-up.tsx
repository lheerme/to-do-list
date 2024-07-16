import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LoginWithGithubButton } from '@/pages/auth/login-with-github-button'
import { LoginWithGoogleButton } from '@/pages/auth/login-with-google-button'

export function SignUp() {
  return (
    <div className=" w-full p-8">
      <Helmet title="Sign Up" />
      <Button
        variant="outline"
        asChild
        className="absolute right-4 top-4 lg:right-8 lg:top-8"
      >
        <Link to={'/sign-in'}>Fazer login</Link>
      </Button>

      <div className="mx-auto w-full max-w-96 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
          <p className="text-sm text-muted-foreground">
            Crie uma conta e tenha sua lista de to-dos!
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
