import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";

import { createKnowledgeDatabase } from "@/lib/db";
import type { SpaceEntityRecord, SyncMutationRecord } from "@/lib/spaces/space-types";
import { createSyncEngine, resolveLwwSyncDecision } from "@/lib/sync/sync-engine";
import { createSyncQueue } from "@/lib/sync/sync-queue";

const opened: ReturnType<typeof createKnowledgeDatabase>[] = [];

afterEach(async () => {
  await Promise.all(opened.map((database) => database.delete()));
  opened.length = 0;
});

function setup() {
  const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
  opened.push(database);
  return { database, queue: createSyncQueue(database) };
}

function entityFixture(input: Partial<SpaceEntityRecord> = {}): SpaceEntityRecord {
  return {
    id: input.id ?? "entity-a",
    spaceId: input.spaceId ?? "space-a",
    objectTypeId: input.objectTypeId ?? "page",
    type: input.type ?? "page",
    title: input.title ?? "Synced page",
    createdAt: input.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-01-02T00:00:00.000Z",
    blocks: input.blocks ?? [],
    tags: input.tags ?? [],
    relations: input.relations ?? [],
    properties: input.properties ?? {},
    _syncStatus: input._syncStatus ?? "pending",
  };
}

describe("Sync engine", () => {
  it("pushes pending mutations through a batch writer and marks local entities synced", async () => {
    const { database, queue } = setup();
    const entity = entityFixture();
    await database.entities.add(entity);
    await queue.enqueueEntityMutation({
      entity,
      operation: "set",
      referenceDate: new Date("2026-01-03T00:00:00.000Z"),
    });
    const writes: Array<Pick<SyncMutationRecord, "operation" | "entityId">> = [];

    const engine = createSyncEngine(database, {
      async commit(mutations) {
        writes.push(
          ...mutations.map((mutation) => ({
            operation: mutation.operation,
            entityId: mutation.entityId,
          })),
        );
      },
    });

    const result = await engine.pushPendingMutations({
      now: new Date("2026-01-04T00:00:00.000Z"),
    });

    expect(result).toEqual({ attempted: 1, synced: 1, failed: 0 });
    expect(writes).toEqual([{ operation: "set", entityId: "entity-a" }]);
    expect(await database.syncMutations.where("status").equals("pending").count()).toBe(0);
    expect((await database.entities.get(["space-a", "entity-a"]))?._syncStatus).toBe("synced");
  });

  it("marks a batch failed without marking local entities synced", async () => {
    const { database, queue } = setup();
    const entity = entityFixture();
    await database.entities.add(entity);
    await queue.enqueueEntityMutation({
      entity,
      operation: "set",
      referenceDate: new Date("2026-01-03T00:00:00.000Z"),
    });

    const engine = createSyncEngine(database, {
      async commit() {
        throw new Error("Firestore unavailable");
      },
    });

    const result = await engine.pushPendingMutations({
      now: new Date("2026-01-04T00:00:00.000Z"),
    });

    const failed = await database.syncMutations.where("status").equals("failed").first();
    expect(result).toEqual({ attempted: 1, synced: 0, failed: 1 });
    expect(failed?.error).toBe("Firestore unavailable");
    expect((await database.entities.get(["space-a", "entity-a"]))?._syncStatus).toBe("pending");
  });

  it("keeps remote data when last-write-wins sees a newer remote update", () => {
    expect(
      resolveLwwSyncDecision({
        localUpdatedAt: "2026-01-02T00:00:00.000Z",
        remoteUpdatedAt: "2026-01-03T00:00:00.000Z",
      }),
    ).toBe("keep-remote");
  });

  it("pushes local data when last-write-wins sees an equal or newer local update", () => {
    expect(
      resolveLwwSyncDecision({
        localUpdatedAt: "2026-01-03T00:00:00.000Z",
        remoteUpdatedAt: "2026-01-03T00:00:00.000Z",
      }),
    ).toBe("push-local");
    expect(
      resolveLwwSyncDecision({
        localUpdatedAt: "2026-01-04T00:00:00.000Z",
        remoteUpdatedAt: "2026-01-03T00:00:00.000Z",
      }),
    ).toBe("push-local");
  });
});
