'use client'

import { useTranslations } from 'next-intl'
import type { ComponentProps } from 'react'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { SpaceSidebar } from './space-sidebar'

interface SpaceShellProps extends ComponentProps<typeof SidebarProvider> {
  pathname?: string
}

export function SpaceShell({
  pathname = '/',
  children,
  ...providerProps
}: SpaceShellProps) {
  const t = useTranslations('space')

  return (
    <SidebarProvider {...providerProps}>
      <SpaceSidebar pathname={pathname} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="h-4 w-px bg-border" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">{t('spaceLabel')}</p>
        </header>
        <main className="flex-1 bg-background p-6 text-foreground">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
