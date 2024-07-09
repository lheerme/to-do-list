import { Skeleton } from '@/components/ui/skeleton'

export function UserToDosSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton
          key={index}
          className="mx-auto h-9 w-[97%] rounded-none md:w-full md:rounded-sm"
        />
      ))}
    </>
  )
}
