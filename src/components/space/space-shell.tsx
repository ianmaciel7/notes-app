'use client'

type SpaceShellProps = {
  pathname?: string
  children?: React.ReactNode
}

export function SpaceShell({ children }: SpaceShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
