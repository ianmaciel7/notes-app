import { DeckDetail } from "@/components/deck/deck-detail";

export default async function DeckPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  return <DeckDetail deckId={deckId} />;
}
