import { ProtectedRoute } from '@/components/auth/protected-route'
import { SpaceShell } from '@/components/space/space-shell'

export default async function SpacePage({
  params,
}: {
  params: Promise<{ space: string[] }>
}) {
  const { space } = await params
  return (
    <ProtectedRoute>
      <SpaceShell pathname={`/${space.join('/')}`} />
    </ProtectedRoute>
  )
}
