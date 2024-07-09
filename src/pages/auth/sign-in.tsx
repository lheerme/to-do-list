import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { LoginWithGithubButton } from '@/components/login-with-github-button'
import { LoginWithGoogleButton } from '@/components/login-with-google-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { loginWithPassword } from '@/services/login-with-password'
import { useStore } from '@/store/use-store'

const signInFormSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Não é um e-mail válido'),
  password: z.string().min(1, 'A senha é obrigatória'),
})

type SignInFormSchema = z.infer<typeof signInFormSchema>

export function SignIn() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const isLoggingIn = useStore((state) => state.isLoggingIn)
  const setIsLoggingIn = useStore((state) => state.setIsLoggingIn)

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    resetField,
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  })

  const {
    mutateAsync: loginUserWithPassword,
    isPending: isLoginWithPasswordPending,
  } = useMutation({
    mutationFn: (userCredentials: { email: string; password: string }) =>
      loginWithPassword(userCredentials),
    onSuccess: (user) => {
      setIsLoggingIn(false)
      queryClient.setQueryData(['auth'], user)
      toast.success('Logado com sucesso')
      navigate('/')
    },
    onError: (error, { email }) => {
      setIsLoggingIn(false)
      resetField('password')

      if (error.message === 'Email not confirmed') {
        toast.error('E-mail não confirmado')
        navigate(`/confirme-email?email=${email}`)
      } else {
        toast.error('E-mail ou senha inválido')
      }
    },
  })

  async function handleSignInWithPassword(formData: SignInFormSchema) {
    setIsLoggingIn(true)
    await loginUserWithPassword({
      email: formData.email,
      password: formData.password,
    })
  }

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

        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleSignInWithPassword)}
        >
          <div className="relative space-y-2">
            <span className="absolute right-0 top-1.5 text-sm">
              {formErrors.email?.message}
            </span>
            <Label htmlFor="email">Seu e-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              disabled={isLoginWithPasswordPending || isLoggingIn}
            />
          </div>

          <div className="relative space-y-2">
            <span className="absolute right-0 top-1.5 text-sm">
              {formErrors.password?.message}
            </span>
            <Label htmlFor="password">Sua senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              disabled={isLoginWithPasswordPending || isLoggingIn}
            />
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={isLoginWithPasswordPending || isLoggingIn}
          >
            {isLoginWithPasswordPending ? (
              <LoaderCircle className="size-[1.2rem] animate-spin" />
            ) : (
              'Acessar to-dos'
            )}
          </Button>
        </form>
        <div className="flex items-center justify-between">
          <Separator orientation="horizontal" className="h-0.5 w-2/5" />
          <span className="text-sm text-muted-foreground">ou</span>
          <Separator orientation="horizontal" className="h-0.5 w-2/5" />
        </div>
        <div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
          <LoginWithGithubButton />
          <LoginWithGoogleButton />
        </div>
      </div>
    </div>
  )
}
