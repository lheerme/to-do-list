import { ClipboardList } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export function UserInfoSkeleton() {
  return (
    <div className="flex w-full items-center gap-4">
      <ClipboardList className="size-6" />
      <Separator orientation="vertical" className="h-8" />
      <Skeleton className="h-6 w-full max-w-52" />
    </div>
  )
}
