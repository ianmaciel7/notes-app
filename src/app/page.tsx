import { ProtectedRoute } from '@/components/auth/protected-route'
import { SpaceShell } from '@/components/space/space-shell'

export default function HomePage() {
  return (
    <ProtectedRoute>
      <SpaceShell pathname="/" />
    </ProtectedRoute>
  )
}
