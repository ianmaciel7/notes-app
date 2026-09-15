'use client'

import { type ComponentProps, createContext, useContext, useMemo } from 'react'

import { SidebarProvider, useSidebar } from '@/components/ui/sidebar'

interface SpaceContextValue {
  pathname: string
  sidebarOpen: boolean
  isMobile: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

interface SpaceProviderProps extends ComponentProps<typeof SidebarProvider> {
  pathname?: string
}

const SpaceContext = createContext<SpaceContextValue | null>(null)

interface SpaceContextBridgeProps
  extends ComponentProps<typeof SidebarProvider> {
  pathname: string
}

function SpaceContextBridge({ pathname, children }: SpaceContextBridgeProps) {
  const { open, setOpen, isMobile, toggleSidebar } = useSidebar()
  const value = useMemo(
    () => ({
      pathname,
      sidebarOpen: open,
      isMobile,
      setSidebarOpen: setOpen,
      toggleSidebar,
    }),
    [pathname, open, setOpen, isMobile, toggleSidebar],
  )

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
}

export function SpaceProvider({
  pathname = '/',
  children,
  ...sidebarProps
}: SpaceProviderProps) {
  return (
    <SidebarProvider {...sidebarProps}>
      <SpaceContextBridge pathname={pathname}>{children}</SpaceContextBridge>
    </SidebarProvider>
  )
}

export function useSpace() {
  const context = useContext(SpaceContext)
  if (!context) {
    throw new Error('useSpace must be used within a SpaceProvider.')
  }

  return context
}
