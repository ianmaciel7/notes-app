import { notFound } from "next/navigation";
import { StudyDeck } from "@/components/study/study-deck";
import { requireActionUser } from "@/data/action-auth";
import { getOwnedSpace } from "@/data/spaces";
import { getDueStudyQueueAction } from "@/lib/actions/study-actions";
import { hasLocale } from "@/lib/i18n/dictionaries";

export default async function SpaceStudyPage({
  params,
}: {
  params: Promise<{ lang: string; spaceId: string }>;
}) {
  const { lang, spaceId } = await params;
  if (!hasLocale(lang)) notFound();

  const user = await requireActionUser();
  await getOwnedSpace(user.uid, spaceId);

  const queueResult = await getDueStudyQueueAction({ spaceId, limit: 20 });
  const initialQueue = queueResult.ok ? queueResult.data : [];

  return (
    <div className="container mx-auto max-w-3xl py-6">
      <StudyDeck spaceId={spaceId} initialQueue={initialQueue} />
    </div>
  );
}
