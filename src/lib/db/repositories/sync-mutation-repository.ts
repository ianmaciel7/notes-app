import type { SyncMutationRecord } from "@/lib/domain/records";
import type { KnowledgeDatabase } from "../schema";

export class SyncMutationRepository {
  constructor(private readonly db: KnowledgeDatabase) {}

  async enqueueMutation(
    mutation: Omit<SyncMutationRecord, "id" | "createdAt" | "updatedAt" | "status"> & {
      status?: SyncMutationRecord["status"];
    },
  ): Promise<SyncMutationRecord> {
    const now = new Date().toISOString();

    // LWW Coalescing: check if there's already a pending or syncing mutation for this spaceId + entityId
    const existing = await this.db.syncMutations
      .where("spaceId")
      .equals(mutation.spaceId)
      .filter(
        (m) =>
          m.entityId === mutation.entityId && (m.status === "pending" || m.status === "syncing"),
      )
      .first();

    if (existing) {
      const updated: SyncMutationRecord = {
        ...existing,
        operation: mutation.operation,
        payload: mutation.payload,
        updatedAt: now,
        status: "pending",
      };
      await this.db.syncMutations.put(updated);
      return updated;
    }

    const record: SyncMutationRecord = {
      id: `mut-${crypto.randomUUID()}`,
      spaceId: mutation.spaceId,
      entityId: mutation.entityId,
      entityType: mutation.entityType,
      operation: mutation.operation,
      status: mutation.status || "pending",
      payload: mutation.payload,
      retryCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    await this.db.syncMutations.put(record);
    return record;
  }

  async listPendingMutations(limit = 100): Promise<SyncMutationRecord[]> {
    return this.db.syncMutations.where("status").equals("pending").limit(limit).sortBy("updatedAt");
  }

  async markMutationStatus(
    id: string,
    status: SyncMutationRecord["status"],
    error?: string,
  ): Promise<void> {
    const mutation = await this.db.syncMutations.get(id);
    if (!mutation) return;

    await this.db.syncMutations.update(id, {
      status,
      error: error || undefined,
      retryCount: status === "failed" ? (mutation.retryCount || 0) + 1 : mutation.retryCount,
      updatedAt: new Date().toISOString(),
    });
  }

  async clearCompletedMutations(): Promise<number> {
    return this.db.syncMutations.where("status").equals("synced").delete();
  }
}
