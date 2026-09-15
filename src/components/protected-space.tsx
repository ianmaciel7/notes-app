'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useFirebaseUser } from '@/hooks/use-firebase-user'
import { StudySpace } from './study-space'

type ProtectedSpaceProps = { pathname: string }

export function ProtectedSpace({ pathname }: ProtectedSpaceProps) {
  const router = useRouter()
  const { user, loading } = useFirebaseUser()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, router, user])

  if (loading || !user) {
    return <main className="min-h-screen bg-background" aria-busy="true" />
  }

  return <StudySpace pathname={pathname} />
}
