import { ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ModeToggle } from '@/components/mode-toggle'
import { Separator } from '@/components/ui/separator'

export function Header() {
  return (
    <header className="h-14 w-full border-b">
      <div className="flex h-full items-center justify-between p-3">
        <Link to={'/'} className="flex items-center gap-2">
          <ClipboardList className="size-6" />
          <Separator orientation="vertical" className="h-8" />
          <h1 className="font-medium">to-do list</h1>
        </Link>
        <ModeToggle />
      </div>
    </header>
  )
}
