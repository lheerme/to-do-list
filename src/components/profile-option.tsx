import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LogOut, UserCog } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { EditProfileDialog } from '@/components/edit-profile-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserInfo } from '@/services/get-user-info'
import { signOut } from '@/services/sign-out'
import { useStore } from '@/store/use-store'

export function ProfileOption() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const user = useStore((state) => state.user)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)

  const { data: userInfo, isFetching } = useQuery({
    queryKey: ['user-info', user],
    queryFn: () => getUserInfo(user!.id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!user,
  })

  const { mutateAsync: signOutUser, isPending } = useMutation({
    mutationFn: signOut,
    onSuccess: (user) => {
      queryClient.setQueryData(['auth'], user)
      toast.success('Desconectado com sucesso')
      navigate('/sign-in', { replace: true })
    },
    onError: () => {
      toast.error('Erro ao sair')
    },
  })

  async function handleSignOut() {
    await signOutUser()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          disabled={isFetching}
          className="cursor-pointer"
        >
          {isFetching ? (
            <>
              <Skeleton className="size-9 rounded-full min-[460px]:size-10" />
            </>
          ) : (
            <Avatar className="size-9 min-[460px]:size-10">
              <AvatarImage
                src={userInfo?.profile_pic}
                alt="profile picture"
                className="object-cover"
              />
              <AvatarFallback>
                {userInfo?.user_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuLabel>Meu perfil</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsEditProfileOpen(true)}
            className="cursor-pointer"
          >
            <UserCog className="mr-2 h-4 w-4" />
            <span>Editar perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isPending}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditProfileDialog
        isEditProfileOpen={isEditProfileOpen}
        setIsEditProfileOpen={setIsEditProfileOpen}
      />
    </>
  )
}
