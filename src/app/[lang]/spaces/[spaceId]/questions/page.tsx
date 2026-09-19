import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Questions } from "@/components/authoring/questions";
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

  return (
    <Suspense fallback={<div className="p-4">Loading questions...</div>}>
      <QuestionsPageContent spaceId={spaceId} lang={lang} />
    </Suspense>
  );
}

async function QuestionsPageContent({
  spaceId,
  lang,
}: {
  spaceId: string;
  lang: string;
}) {
  const user = await requireActionUser();
  await getOwnedSpace(user.uid, spaceId);

  const questions = await listQuestionSummaries(user.uid, spaceId);

  return (
    <Questions spaceId={spaceId} lang={lang} initialQuestions={questions} />
  );
}
