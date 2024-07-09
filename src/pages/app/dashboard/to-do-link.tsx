import { ChevronRight } from 'lucide-react'
import { Link, LinkProps } from 'react-router-dom'

import { Separator } from '@/components/ui/separator'

interface ToDoLinkProps extends LinkProps {
  title: string
}

export function ToDoLink(props: ToDoLinkProps) {
  const { title, ...rest } = props

  return (
    <Link
      className="group flex h-10 flex-col items-center transition-colors hover:bg-muted"
      {...rest}
    >
      <div className="flex w-full items-center gap-2 px-4 py-2">
        <h3 title={title} className="truncate">
          {title}
        </h3>
        <div className="ml-auto flex items-center gap-4">
          <ChevronRight className="size-4" />
        </div>
      </div>
      <Separator className="w-full" />
    </Link>
  )
}
