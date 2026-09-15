'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFirebaseUser } from '@/hooks/use-firebase-user'
import { signOutFromFirebase } from '@/lib/auth/firebase-client'

export function SettingsView() {
  const t = useTranslations('space')
  const router = useRouter()
  const { user } = useFirebaseUser()

  async function handleSignOut() {
    await signOutFromFirebase()
    router.replace('/login')
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {t('settings')}
        </p>
        <h1 className="mt-3 font-serif text-3xl">Preferências</h1>
      </div>
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Conta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium">
              {user?.displayName ?? t('anonymous')}
            </p>
            <p className="text-sm text-muted-foreground">{user?.email ?? ''}</p>
          </div>
          <Button
            variant="outline"
            className="w-fit rounded-full"
            onClick={handleSignOut}
          >
            {t('signOut')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
