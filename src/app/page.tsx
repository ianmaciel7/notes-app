import { ProtectedRoute } from '@/components/auth/protected-route'
import { SpaceHome } from '@/components/space/space-home'
import { SpaceShell } from '@/components/space/space-shell'

export default function HomePage() {
  return (
    <ProtectedRoute>
      <SpaceShell pathname="/">
        <SpaceHome />
      </SpaceShell>
    </ProtectedRoute>
  )
}
