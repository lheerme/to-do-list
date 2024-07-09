import { useQuery } from '@tanstack/react-query'
import { ClipboardList } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { ModeToggle } from '@/components/mode-toggle'
import { Separator } from '@/components/ui/separator'
import { UserInfo } from '@/interfaces/user-info'
import { getUserInfo } from '@/services/get-user-info'
import { useStore } from '@/store/use-store'

import { ProfileOption } from './profile-option'
import { UserInfoSkeleton } from './user-info-skeleton'

export function Header() {
  const user = useStore((state) => state.user)

  const { data: userInfo, isFetching } = useQuery<UserInfo>({
    queryKey: ['user-info', user],
    queryFn: () => getUserInfo(user!.id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!user,
  })

  return (
    <header className="h-14 w-full border-b">
      <Helmet titleTemplate={`%s | ${userInfo?.user_name ?? 'to-do app'}`} />
      <div className="flex h-full items-center justify-between gap-6 p-3">
        {isFetching ? (
          <UserInfoSkeleton />
        ) : (
          <Link
            to={'/dashboard'}
            title={userInfo?.user_name}
            className="flex items-center gap-2 truncate"
          >
            <ClipboardList className="size-6" />
            <Separator orientation="vertical" className="h-8" />
            <h1 className="w-full truncate text-sm font-medium min-[460px]:text-base">
              {userInfo?.user_name}
              <span className="hidden min-[460px]:inline"> | to-do list</span>
            </h1>
          </Link>
        )}
        <div className="flex items-center gap-2">
          <ProfileOption />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
