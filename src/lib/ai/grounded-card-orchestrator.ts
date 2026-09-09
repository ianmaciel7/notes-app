import type { GeneratedCard } from "@/lib/ai/card-generation";
import type { createSpaceRepository } from "@/lib/spaces/space-repository";

type SpaceRepository = ReturnType<typeof createSpaceRepository>;

type PersistedGroundedCard = Awaited<
  ReturnType<SpaceRepository["createGroundedFlashcardFromQuote"]>
>;

type RejectedGeneratedCard = {
  card: GeneratedCard;
  reason: string;
};

export async function persistGeneratedCardsFromChunk(input: {
  repository: Pick<SpaceRepository, "createGroundedFlashcardFromQuote">;
  spaceId: string;
  objectTypeId: string;
  fileId: string;
  sourceText: string;
  cards: GeneratedCard[];
  referenceDate?: Date;
}) {
  const persisted: PersistedGroundedCard[] = [];
  const rejected: RejectedGeneratedCard[] = [];

  for (const card of input.cards) {
    try {
      persisted.push(
        await input.repository.createGroundedFlashcardFromQuote(input.spaceId, {
          objectTypeId: input.objectTypeId,
          fileId: input.fileId,
          sourceText: input.sourceText,
          exactQuote: card.exactQuote,
          front: card.front,
          back: card.back,
          cardType: card.cardType,
          clozeContent: card.clozeContent,
          aiGenerated: true,
          aiPromptContext: input.sourceText,
          referenceDate: input.referenceDate,
        }),
      );
    } catch (error) {
      rejected.push({
        card,
        reason: error instanceof Error ? error.message : "Generated card was rejected.",
      });
    }
  }

  return { persisted, rejected };
}
