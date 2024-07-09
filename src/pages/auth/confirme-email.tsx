import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ClipboardList, LoaderCircle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { sendEmailConfirmation } from '@/services/send-email-confirmation'

const confirmEmailFormSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Não é um e-mail válido'),
})

type ConfirmEmailFormSchema = z.infer<typeof confirmEmailFormSchema>

export function ConfirmeEmail() {
  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<ConfirmEmailFormSchema>({
    resolver: zodResolver(confirmEmailFormSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  })

  const {
    mutateAsync: sendEmailConfirmationMutate,
    isPending: isSendEmailConfirmationPending,
  } = useMutation({
    mutationFn: sendEmailConfirmation,
    onSuccess: (_, variables) => {
      console.log(variables)
      toast.success(`E-mail enviado para ${variables}`)
    },
    onError: (_, variables) => {
      console.log(variables)
      toast.warning(`Erro ao enviar e-mail para ${variables}`)
    },
  })

  async function handleSendEmail(data: ConfirmEmailFormSchema) {
    sendEmailConfirmationMutate(data.email)
  }

  return (
    <div className="w-full p-8">
      <Helmet title="E-mail não confirmado" />
      <Link
        to={'/'}
        className="absolute left-4 top-4 flex w-fit items-center gap-2 lg:hidden"
      >
        <ClipboardList className="size-6" />
        <Separator orientation="vertical" className="h-8" />
        <h1 className="font-medium">to-do list</h1>
      </Link>
      <div className="mx-auto w-full max-w-96 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Confirme seu e-mail
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Confirme para acessar seus to-dos!
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(handleSendEmail)}>
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
              disabled={isSendEmailConfirmationPending}
            />
          </div>

          <Button className="w-full" type="submit">
            {isSendEmailConfirmationPending ? (
              <LoaderCircle className="size-[1.2rem] animate-spin" />
            ) : (
              'Enviar e-mail'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
