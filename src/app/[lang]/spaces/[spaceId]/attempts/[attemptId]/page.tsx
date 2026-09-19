import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AttemptSession } from "@/components/attempts/attempt-session";
import { getAttemptViewAction } from "@/lib/actions/attempt-actions";
import { hasLocale } from "@/lib/i18n/dictionaries";

export default async function AttemptPage({
  params,
}: {
  params: Promise<{ lang: string; spaceId: string; attemptId: string }>;
}) {
  const { lang, spaceId, attemptId } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <Suspense fallback={<div className="p-4">Loading attempt...</div>}>
      <AttemptPageContent spaceId={spaceId} attemptId={attemptId} />
    </Suspense>
  );
}

async function AttemptPageContent({
  spaceId,
  attemptId,
}: {
  spaceId: string;
  attemptId: string;
}) {
  const result = await getAttemptViewAction({ spaceId, attemptId });
  if (!result.ok) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AttemptSession attempt={result.data} />
    </div>
  );
}
