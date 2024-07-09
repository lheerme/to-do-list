import { zodResolver } from '@hookform/resolvers/zod'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { LoginWithGithubButton } from '@/components/login-with-github-button'
import { LoginWithGoogleButton } from '@/components/login-with-google-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/utils/supabase'

const signUpFormSchema = z.object({
  username: z
    .string()
    .min(1, 'O username é obrigatório')
    .min(3, 'Username muito curto.')
    .max(20, 'Username muito longo')
    .regex(
      /^(?!\d)(?!.*--)(?!.* {2})[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:[ -][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*$/,
      'Username inválido',
    )
    .transform((username) => username.trim().replace(/\s+/g, ' ')),
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Não é um e-mail válido'),
  password: z.string().min(1, 'A senha é obrigatória'),
})

type SignUpFormSchema = z.infer<typeof signUpFormSchema>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors: formErrors },
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
  })

  async function handleSignUp(formData: SignUpFormSchema) {
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          user_name: formData.username,
        },
      },
    })

    if (error) {
      if (error.message === 'Invalid login credentials') {
        toast.error('E-mail ou senha inválido')
      }

      if (error.message === 'User already registered') {
        toast.error('Usuário já existe.')
      }

      return
    }

    toast.success('Usuário criado com sucesso. E-mail de confirmação enviado')
    navigate(`/sign-in?email=${formData.email}`)
  }

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

        <form className="space-y-4" onSubmit={handleSubmit(handleSignUp)}>
          <div className="relative space-y-2">
            <span className="absolute right-0 top-1.5 text-sm">
              {formErrors.username?.message}
            </span>
            <Label htmlFor="username">Seu username</Label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              {...register('username')}
            />
          </div>

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
            />
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            Finalizar cadastro
          </Button>
        </form>
        <span className="block text-center text-sm text-muted-foreground">
          ou
        </span>
        <div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
          <LoginWithGithubButton />
          <LoginWithGoogleButton />
        </div>
      </div>
    </div>
  )
}
