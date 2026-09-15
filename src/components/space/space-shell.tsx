'use client'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { SpaceSidebar } from './space-sidebar'

type SpaceShellProps = {
  pathname?: string
  children?: React.ReactNode
}

export function SpaceShell({ pathname = '/', children }: SpaceShellProps) {
  return (
    <SidebarProvider>
      <SpaceSidebar pathname={pathname} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="h-4 w-px bg-border" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Space</p>
        </header>
        <main className="flex-1 bg-background p-6 text-foreground">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
