import type { KnowledgeDatabase } from "@/lib/db";
import type { SpaceEntityRecord, SyncMutationRecord } from "@/lib/spaces/space-types";

export function createSyncQueue(database: KnowledgeDatabase) {
  async function enqueueEntityMutation(input: {
    entity: SpaceEntityRecord;
    operation: SyncMutationRecord["operation"];
    referenceDate?: Date;
  }) {
    const timestamp = (input.referenceDate ?? new Date()).toISOString();
    const mutation: SyncMutationRecord = {
      id: `sync:${input.entity.spaceId}:${input.entity.id}:${crypto.randomUUID()}`,
      spaceId: input.entity.spaceId,
      entityId: input.entity.id,
      entityType: input.entity.type,
      operation: input.operation,
      status: "pending",
      payload: structuredClone(input.entity),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await database.syncMutations.add(mutation);
    return mutation;
  }

  function listPendingMutations(limit = 500) {
    return database.syncMutations
      .where("status")
      .equals("pending")
      .sortBy("updatedAt")
      .then((mutations) => mutations.slice(0, limit));
  }

  async function markMutationSynced(id: string, syncedAt: Date = new Date()) {
    await database.syncMutations.update(id, {
      status: "synced",
      updatedAt: syncedAt.toISOString(),
      error: undefined,
    });
  }

  async function markMutationSyncing(id: string, syncingAt: Date = new Date()) {
    await database.syncMutations.update(id, {
      status: "syncing",
      updatedAt: syncingAt.toISOString(),
      error: undefined,
    });
  }

  async function markMutationFailed(id: string, error: string, failedAt: Date = new Date()) {
    await database.syncMutations.update(id, {
      status: "failed",
      error,
      updatedAt: failedAt.toISOString(),
    });
  }

  return {
    enqueueEntityMutation,
    listPendingMutations,
    markMutationSyncing,
    markMutationSynced,
    markMutationFailed,
  };
}
