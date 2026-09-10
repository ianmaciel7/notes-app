import type { SyncMutationRecord } from "@/lib/spaces/space-types";

export function getMutationEntityKey(mutation: Pick<SyncMutationRecord, "spaceId" | "entityId">) {
  return JSON.stringify([mutation.spaceId, mutation.entityId]);
}

/** Keep the final full snapshot/delete in queue order, not cross-device LWW order. */
export function coalesceSyncMutations(mutations: readonly SyncMutationRecord[]) {
  const latest = new Map<string, SyncMutationRecord>();
  for (const mutation of mutations) {
    latest.set(getMutationEntityKey(mutation), mutation);
  }
  return [...latest.values()];
}
