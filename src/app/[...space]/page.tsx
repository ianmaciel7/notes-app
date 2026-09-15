import { StudySpace } from '@/components/study-space'

export default async function SpacePage({
  params,
}: {
  params: Promise<{ space: string[] }>
}) {
  const { space } = await params
  return <StudySpace pathname={`/${space.join('/')}`} />
}
