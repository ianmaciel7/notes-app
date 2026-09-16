import { Suspense } from "react";

import { StudyApp } from "@/components/study-app";

export default async function StudyPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  return <Suspense fallback={<div className="study-layout"><div className="loading-line">Preparando sua sessão...</div></div>}><StudyApp deckId={deckId} /></Suspense>;
}
