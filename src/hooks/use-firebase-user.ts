'use client'

import type { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { subscribeToAuthState } from '@/lib/auth/firebase-client'

export function useFirebaseUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return subscribeToAuthState((nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  return { user, loading }
}
