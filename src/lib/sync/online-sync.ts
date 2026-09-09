import type { KnowledgeDatabase } from "@/lib/db";
import { createFirestoreRestSyncWriter } from "@/lib/sync/firestore-writer";
import { createSyncEngine } from "@/lib/sync/sync-engine";

type Fetcher = typeof fetch;

export type OnlineSyncPrerequisites = {
  online: boolean;
  projectId?: string | null;
  accessToken?: string | null;
};

export function shouldRunOnlineSync(input: OnlineSyncPrerequisites) {
  return Boolean(input.online && input.projectId?.trim() && input.accessToken?.trim());
}

export function createOnlineSyncRunner(
  database: KnowledgeDatabase,
  dependencies: {
    getOnlineState: () => boolean;
    getAccessToken: () => Promise<string | null>;
    projectId?: string | null;
    ownerUid?: string;
    databaseId?: string;
    fetcher?: Fetcher;
  },
) {
  async function runOnce(input: { batchSize?: number; now?: Date } = {}) {
    if (!dependencies.getOnlineState()) {
      return { attempted: 0, synced: 0, failed: 0, skipped: "offline" as const };
    }

    const projectId = dependencies.projectId?.trim();
    if (!projectId) {
      return { attempted: 0, synced: 0, failed: 0, skipped: "missing-project" as const };
    }

    const accessToken = (await dependencies.getAccessToken())?.trim();
    if (!accessToken) {
      return { attempted: 0, synced: 0, failed: 0, skipped: "missing-token" as const };
    }

    const writer = createFirestoreRestSyncWriter({
      projectId,
      databaseId: dependencies.databaseId,
      accessToken,
      ownerUid: dependencies.ownerUid,
      fetcher: dependencies.fetcher,
    });
    return createSyncEngine(database, writer).pushPendingMutations(input);
  }

  return { runOnce };
}
