'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  isFirebaseConfigured,
  signInWithGoogle,
} from '@/lib/auth/firebase-client'

export function LoginPanel() {
  const t = useTranslations('space')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSignIn() {
    setError(null)

    if (!isFirebaseConfigured()) {
      setError(t('googleUnavailable'))
      return
    }

    setPending(true)
    try {
      await signInWithGoogle()
      window.location.href = '/'
    } catch {
      setError(t('authError'))
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-12">
      <Card className="w-full max-w-md border-border/70 shadow-sm">
        <CardHeader className="gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            KnowledgeOS
          </p>
          <CardTitle className="font-serif text-3xl">
            {t('signInToReview')}
          </CardTitle>
          <CardDescription>{t('signInDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={handleSignIn} disabled={pending} className="w-full">
            {pending ? 'Loading...' : t('signIn')}
          </Button>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>
    </main>
  )
}
