import type { KnowledgeDatabase } from "@/lib/db";
import { createSyncQueue } from "@/lib/sync/sync-queue";
import type { SyncMutationRecord } from "@/lib/spaces/space-types";

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

export function createSyncEngine(database: KnowledgeDatabase, writer: SyncBatchWriter) {
  const queue = createSyncQueue(database);

  async function pushPendingMutations(input: { batchSize?: number; now?: Date } = {}) {
    const now = input.now ?? new Date();
    const mutations = await queue.listPendingMutations(input.batchSize);
    if (mutations.length === 0) return { attempted: 0, synced: 0, failed: 0 };

    await Promise.all(
      mutations.map((mutation) => queue.markMutationSyncing(mutation.id, now)),
    );

    try {
      await writer.commit(mutations);
      await database.transaction("rw", database.entities, database.syncMutations, async () => {
        await Promise.all(
          mutations.map(async (mutation) => {
            await queue.markMutationSynced(mutation.id, now);
            if (mutation.operation === "set") {
              await database.entities.update([mutation.spaceId, mutation.entityId], {
                _syncStatus: "synced",
              });
            }
          }),
        );
      });
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
