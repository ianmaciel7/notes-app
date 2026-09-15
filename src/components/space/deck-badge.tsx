import { cn } from '@/lib/utils'

export function DeckBadge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex max-w-[120px] truncate rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
