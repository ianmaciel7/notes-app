import type { KnowledgeDatabase } from "@/lib/db";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";
import { isFlashcardReviewEntity } from "@/lib/srs/flashcard-review";
import { applyFSRSReview, type FSRSRating } from "@/lib/srs/fsrs";
import { createSyncQueue } from "@/lib/sync/sync-queue";

export async function saveEntityUpdate({
  database,
  spaceId,
  entityId,
  update,
  expectedUpdatedAt,
}: {
  database: KnowledgeDatabase;
  spaceId: string;
  entityId: string;
  update: Partial<SpaceEntityRecord> & Record<string, unknown>;
  expectedUpdatedAt?: string;
}) {
  return database.transaction("rw", database.entities, database.syncMutations, async () => {
    const entity = await database.entities.get([spaceId, entityId]);
    if (!entity) throw new Error("Entity not found.");
    if (expectedUpdatedAt && entity.updatedAt !== expectedUpdatedAt) {
      throw new Error(
        "This object changed while you were editing. Reopen the editor to reload it.",
      );
    }
    const {
      id: _id,
      spaceId: _space,
      objectTypeId: _objectType,
      createdAt: _created,
      type: _type,
      ...editable
    } = structuredClone(update);
    const previous = Date.parse(entity.updatedAt);
    const timestamp = new Date(Math.max(Date.now(), Number.isFinite(previous) ? previous + 1 : 0));
    const saved: SpaceEntityRecord = {
      ...entity,
      ...editable,
      updatedAt: timestamp.toISOString(),
      _syncStatus: "pending",
    };
    await database.entities.put(saved);
    await createSyncQueue(database).enqueueEntityMutation({ entity: saved, operation: "set" });
    return saved;
  });
}

export async function saveFlashcardReview({
  database,
  spaceId,
  flashcardId,
  rating,
  now = new Date(),
}: {
  database: KnowledgeDatabase;
  spaceId: string;
  flashcardId: string;
  rating: FSRSRating;
  now?: Date;
}) {
  if (![1, 2, 3, 4].includes(rating) || !Number.isFinite(now.getTime())) {
    throw new Error("Invalid flashcard review.");
  }
  return database.transaction("rw", database.entities, database.syncMutations, async () => {
    const entity = await database.entities.get([spaceId, flashcardId]);
    if (!entity || !isFlashcardReviewEntity(entity)) {
      throw new Error("Target entity is not a flashcard with SRS state.");
    }
    const { nextState, daysUntilDue } = applyFSRSReview({ card: entity.srs, now }, rating);
    const saved = {
      ...entity,
      updatedAt: now.toISOString(),
      srs: nextState,
      _syncStatus: "pending" as const,
    };
    await database.entities.put(saved);
    await createSyncQueue(database).enqueueEntityMutation({ entity: saved, operation: "set" });
    return { entity: saved, nextState, daysUntilDue };
  });
}
