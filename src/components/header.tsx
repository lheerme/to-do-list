import { useQuery } from '@tanstack/react-query'
import { ClipboardList, ListPlus } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

import { ModeToggle } from '@/components/mode-toggle'
import { ProfileOption } from '@/components/profile-option'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { UserInfoSkeleton } from '@/components/user-info-skeleton'
import { useMediaQuery } from '@/hooks/use-media-query'
import { UserInfo } from '@/interfaces/user-info'
import { AddNewToDoDialog } from '@/pages/app/dashboard/add-new-to-do-dialog'
import { UserToDos } from '@/pages/app/dashboard/user-to-dos'
import { getUserInfo } from '@/services/get-user-info'
import { useStore } from '@/store/use-store'

export function Header() {
  const user = useStore((state) => state.user)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [isAddNewToDoDialogOpen, setIsAddNewToDoDialogOpen] = useState(false)

  const { data: userInfo, isFetching } = useQuery<UserInfo>({
    queryKey: ['user-info', user],
    queryFn: () => getUserInfo(user!.id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!user,
  })

  return (
    <header
      className={twMerge(
        'w-full',
        isDesktop ? 'h-full max-w-52 border-r lg:max-w-72' : 'h-14 border-b',
      )}
    >
      <Helmet titleTemplate={`%s | ${userInfo?.name ?? 'to-do app'}`} />
      {isDesktop ? (
        <div className="flex h-full flex-col justify-between gap-6 p-3">
          <div className="flex items-center justify-between">
            <Link
              to={'/dashboard'}
              title="dashboard"
              className="flex gap-2 align-baseline"
            >
              <ClipboardList className="size-6 shrink-0" />
              <Separator orientation="vertical" className="h-8" />
              <span>to-do list</span>
            </Link>
            <ModeToggle />
          </div>
          <UserToDos />
          <Dialog
            open={isAddNewToDoDialogOpen}
            onOpenChange={setIsAddNewToDoDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full">
                <ListPlus className="mr-2 size-4" />
                Novo to-do
              </Button>
            </DialogTrigger>

            <AddNewToDoDialog
              setIsAddNewToDoDialogOpen={setIsAddNewToDoDialogOpen}
            />
          </Dialog>
          <ProfileOption />
        </div>
      ) : (
        <div className="flex h-full items-center justify-between gap-6 p-3">
          {isFetching ? (
            <UserInfoSkeleton />
          ) : (
            <Link
              to={'/dashboard'}
              title={userInfo?.name}
              className="flex items-center gap-2 truncate"
            >
              <ClipboardList className="size-6 shrink-0" />
              <Separator orientation="vertical" className="h-8" />
              <h1 className="w-full truncate text-sm font-medium min-[460px]:text-base">
                {userInfo?.name}
                <span className="hidden min-[460px]:inline"> | to-do list</span>
              </h1>
            </Link>
          )}
          <div className="flex items-center gap-2">
            <ProfileOption />
            <ModeToggle />
          </div>
        </div>
      )}
    </header>
  )
}
