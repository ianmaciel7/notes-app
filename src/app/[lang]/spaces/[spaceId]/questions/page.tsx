import { notFound } from "next/navigation";

import { QuestionsView } from "@/components/authoring/questions-view";
import { requireActionUser } from "@/data/action-auth";
import { listQuestionSummaries } from "@/data/questions-v2";
import { getOwnedSpace } from "@/data/spaces";
import { hasLocale } from "@/lib/i18n/dictionaries";

export default async function SpaceQuestionsPage({
  params,
}: {
  params: Promise<{ lang: string; spaceId: string }>;
}) {
  const { lang, spaceId } = await params;
  if (!hasLocale(lang)) notFound();

  const user = await requireActionUser();
  await getOwnedSpace(user.uid, spaceId);

  const questions = await listQuestionSummaries(user.uid, spaceId);

  return (
    <QuestionsView spaceId={spaceId} lang={lang} initialQuestions={questions} />
  );
}
