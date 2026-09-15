import { notFound } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { CardList } from '@/components/space/card-list'
import { SettingsView } from '@/components/space/settings-view'
import { SpaceShell } from '@/components/space/space-shell'
import { StudyCard } from '@/components/space/study-card'
import { getStudyCard } from '@/lib/study'

export default async function SpacePage({
  params,
}: {
  params: Promise<{ space: string[] }>
}) {
  const { space } = await params
  const pathname = `/${space.join('/')}`
  const content =
    pathname === '/settings' ? (
      <SettingsView />
    ) : pathname === '/cards' ? (
      <CardList />
    ) : pathname.startsWith('/study/') ? (
      <StudyRoute id={space[1]} />
    ) : null
  if (!content) notFound()
  return (
    <ProtectedRoute>
      <SpaceShell pathname={pathname}>{content}</SpaceShell>
    </ProtectedRoute>
  )
}

function StudyRoute({ id }: { id: string | undefined }) {
  const card = id ? getStudyCard(id) : undefined
  if (!card) notFound()
  return (
    <div className="mx-auto w-full max-w-3xl py-4">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Estudar
        </p>
        <h1 className="mt-3 font-serif text-2xl">Revisão do cartão</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Revele a resposta e avalie como foi.
        </p>
      </div>
      <StudyCard card={card} />
    </div>
  )
}
