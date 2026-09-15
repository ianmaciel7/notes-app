import { ProtectedSpace } from '@/components/space/protected-space'

export default async function SpacePage({
  params,
}: {
  params: Promise<{ space: string[] }>
}) {
  const { space } = await params
  return <ProtectedSpace pathname={`/${space.join('/')}`} />
}
