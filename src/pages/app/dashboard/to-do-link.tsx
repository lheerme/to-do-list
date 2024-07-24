import { ChevronRight } from 'lucide-react'
import { Link, LinkProps, useParams } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

import { Separator } from '@/components/ui/separator'

interface ToDoLinkProps extends LinkProps {
  title: string
  id: string
}

export function ToDoLink(props: ToDoLinkProps) {
  const { toDoId } = useParams() as { toDoId: string }
  const { title, id, ...rest } = props

  return (
    <Link
      className="group flex h-10 flex-col items-center transition-colors"
      {...rest}
    >
      <div className="relative flex w-full items-center gap-2 px-4 py-2">
        <h3 title={title} className="truncate">
          {title}
        </h3>
        <div className="ml-auto flex items-center gap-4">
          <ChevronRight className="size-4" />
        </div>
      </div>
      <Separator
        className={twMerge(
          'w-full transition-colors group-hover:bg-primary',
          id === toDoId && 'bg-primary',
        )}
      />
    </Link>
  )
}
