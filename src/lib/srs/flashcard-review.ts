import type { SpaceEntityRecord } from "@/lib/spaces/space-types";
import type { FSRSRating, SRSItemState } from "@/lib/srs/fsrs";
import type { FlashcardEntity } from "@/types/schema";

export type FlashcardReviewEntity = SpaceEntityRecord & FlashcardEntity & { srs: SRSItemState };

export function isFlashcardReviewEntity(
  entity: SpaceEntityRecord,
): entity is FlashcardReviewEntity {
  return entity.type === "flashcard" && typeof entity.srs === "object" && entity.srs !== null;
}

export function selectDueFlashcards(
  entities: readonly SpaceEntityRecord[],
  now: Date = new Date(),
): FlashcardReviewEntity[] {
  const reviewTime = now.getTime();

  return entities
    .filter(isFlashcardReviewEntity)
    .filter((entity) => {
      const dueTime = new Date(entity.srs.dueDate).getTime();
      return Number.isFinite(dueTime) && dueTime <= reviewTime;
    })
    .toSorted((left, right) => {
      const leftDue = new Date(left.srs.dueDate).getTime();
      const rightDue = new Date(right.srs.dueDate).getTime();
      return leftDue - rightDue;
    });
}

export function getFlashcardReviewShortcutRating(key: string): FSRSRating | null {
  if (key === "1") return 1;
  if (key === "2") return 2;
  if (key === "3") return 3;
  if (key === "4") return 4;
  return null;
}
