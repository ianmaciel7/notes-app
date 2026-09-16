import { Suspense } from "react";

import { StudySession } from "@/components/study-session";

export default async function StudyPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen p-6 bg-background flex flex-col items-center justify-center text-muted-foreground text-sm">Preparando sua sessão...</div>}>
      <StudySession deckId={deckId} />
    </Suspense>
  );
}
