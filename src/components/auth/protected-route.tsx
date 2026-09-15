'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useFirebaseUser } from '@/hooks/use-firebase-user'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, loading } = useFirebaseUser()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, router, user])

  if (loading || !user) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-background p-6"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </main>
    )
  }

  return <>{children}</>
}
