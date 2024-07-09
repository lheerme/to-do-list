import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EditProfileInfo } from '@/services/edit-profile-info'
import { getUserInfo } from '@/services/get-user-info'
import { useStore } from '@/store/use-store'

const editProfileFormSchema = z.object({
  profilePic: z.string(),
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
})

type EditProfileFormSchema = z.infer<typeof editProfileFormSchema>

export function EditProfileDialogForm() {
  const user = useStore((state) => state.user)

  const { data: userInfo } = useQuery({
    queryKey: ['user-info', user],
    queryFn: () => getUserInfo(user!.id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!user,
  })

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<EditProfileFormSchema>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      username: userInfo?.user_name,
      profilePic: userInfo?.profile_pic,
    },
  })

  const {
    mutateAsync: editProfileInfoMutateAsync,
    isPending: isEditProfileInfoMutatePending,
  } = useMutation({
    mutationFn: EditProfileInfo,
    onSuccess: () => {
      toast.success(`Informações atualizados`)
    },
    onError: (_, { newUsername }) => {
      toast.warning(`O username ${newUsername} já existe`)
    },
  })

  async function handleEditProfileInfo(data: EditProfileFormSchema) {
    if (
      data.username === userInfo?.user_name &&
      data.profilePic === userInfo.profile_pic
    ) {
      return
    }

    await editProfileInfoMutateAsync({
      newUsername: data.username,
      newProfilePic: data.profilePic,
    })
  }

  return (
    <form
      className="space-y-4 pt-4"
      onSubmit={handleSubmit(handleEditProfileInfo)}
    >
      <div className="relative flex items-center gap-4">
        <span className="absolute -top-6 right-0 text-sm">
          {formErrors.username?.message}
        </span>
        <Label htmlFor="username" className="w-full max-w-16">
          Username
        </Label>
        <Input
          {...register('username')}
          id="username"
          type="text"
          disabled={isEditProfileInfoMutatePending}
        />
      </div>

      <div className="relative flex items-center gap-4">
        <span className="absolute -top-6 right-0 text-sm">
          {formErrors.profilePic?.message}
        </span>
        <Label htmlFor="profilePic" className="w-full max-w-16">
          Ícone
        </Label>
        <Input
          {...register('profilePic')}
          id="profilePic"
          type="text"
          disabled={isEditProfileInfoMutatePending}
        />
      </div>

      <Button
        className="w-full"
        type="submit"
        disabled={isEditProfileInfoMutatePending}
      >
        {isEditProfileInfoMutatePending ? (
          <LoaderCircle className="size-[1.2rem] animate-spin" />
        ) : (
          'Atualizar Informações'
        )}
      </Button>
    </form>
  )
}
