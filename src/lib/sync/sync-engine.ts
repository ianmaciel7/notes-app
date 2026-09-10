import type { KnowledgeDatabase } from "@/lib/db";
import type { SyncMutationRecord } from "@/lib/spaces/space-types";
import { coalesceSyncMutations, getMutationEntityKey } from "@/lib/sync/sync-mutations";
import { createSyncQueue } from "@/lib/sync/sync-queue";

export type SyncBatchWriter = {
  commit(mutations: SyncMutationRecord[]): Promise<void>;
};

export type LwwSyncDecision = "push-local" | "keep-remote";

export function resolveLwwSyncDecision(input: {
  localUpdatedAt: string;
  remoteUpdatedAt?: string | null;
}): LwwSyncDecision {
  if (!input.remoteUpdatedAt) return "push-local";
  return input.localUpdatedAt >= input.remoteUpdatedAt ? "push-local" : "keep-remote";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function acknowledgeMutations(
  database: KnowledgeDatabase,
  mutations: SyncMutationRecord[],
  now: Date,
) {
  const queue = createSyncQueue(database);
  await database.transaction("rw", database.entities, database.syncMutations, async () => {
    await Promise.all(mutations.map((mutation) => queue.markMutationSynced(mutation.id, now)));
    const outstanding = await database.syncMutations
      .where("status")
      .anyOf(["pending", "syncing", "failed"])
      .toArray();
    const outstandingKeys = new Set(outstanding.map(getMutationEntityKey));

    for (const mutation of coalesceSyncMutations(mutations)) {
      if (mutation.operation !== "set" || outstandingKeys.has(getMutationEntityKey(mutation))) {
        continue;
      }
      const payload = mutation.payload;
      if (typeof payload !== "object" || payload === null || !("updatedAt" in payload)) continue;
      const key: [string, string] = [mutation.spaceId, mutation.entityId];
      const entity = await database.entities.get(key);
      if (entity && entity.updatedAt === payload.updatedAt) {
        await database.entities.update(key, { _syncStatus: "synced" });
      }
    }
  });
}

export function createSyncEngine(database: KnowledgeDatabase, writer: SyncBatchWriter) {
  const queue = createSyncQueue(database);

  async function pushPendingMutations(input: { batchSize?: number; now?: Date } = {}) {
    const now = input.now ?? new Date();
    const mutations = await queue.listPendingMutations(input.batchSize);
    if (mutations.length === 0) return { attempted: 0, synced: 0, failed: 0 };

    await Promise.all(mutations.map((mutation) => queue.markMutationSyncing(mutation.id, now)));

    try {
      await writer.commit(mutations);
      await acknowledgeMutations(database, mutations, now);
      return { attempted: mutations.length, synced: mutations.length, failed: 0 };
    } catch (error) {
      const message = getErrorMessage(error);
      await Promise.all(
        mutations.map((mutation) => queue.markMutationFailed(mutation.id, message, now)),
      );
      return { attempted: mutations.length, synced: 0, failed: mutations.length };
    }
  }

  return { pushPendingMutations };
}
