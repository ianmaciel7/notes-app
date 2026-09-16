import { DeckApp } from "@/components/deck-app";

export default async function DeckPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  return <DeckApp deckId={deckId} />;
}
