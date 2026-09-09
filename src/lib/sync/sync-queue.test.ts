import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";

import { createKnowledgeDatabase } from "@/lib/db";
import { createSyncQueue } from "@/lib/sync/sync-queue";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

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

function entityFixture(): SpaceEntityRecord {
  return {
    id: "entity-a",
    spaceId: "space-a",
    objectTypeId: "page",
    type: "page",
    title: "Queued page",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    blocks: [],
    tags: [],
    relations: [],
    properties: {},
    _syncStatus: "pending",
  };
}

describe("Sync queue", () => {
  it("stores pending entity mutations with a cloned payload", async () => {
    const { database, queue } = setup();
    const entity = entityFixture();

    const mutation = await queue.enqueueEntityMutation({
      entity,
      operation: "set",
      referenceDate: new Date("2026-01-02T00:00:00.000Z"),
    });
    entity.title = "Changed after enqueue";

    const persisted = await database.syncMutations.get(mutation.id);
    expect(persisted).toMatchObject({
      id: mutation.id,
      spaceId: "space-a",
      entityId: "entity-a",
      entityType: "page",
      operation: "set",
      status: "pending",
      createdAt: "2026-01-02T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
    expect((persisted?.payload as SpaceEntityRecord | undefined)?.title).toBe("Queued page");
  });

  it("lists only pending mutations in oldest-first order and marks them synced", async () => {
    const { queue } = setup();
    const entity = entityFixture();
    const newer = await queue.enqueueEntityMutation({
      entity: { ...entity, id: "newer" },
      operation: "set",
      referenceDate: new Date("2026-01-03T00:00:00.000Z"),
    });
    const older = await queue.enqueueEntityMutation({
      entity: { ...entity, id: "older" },
      operation: "delete",
      referenceDate: new Date("2026-01-02T00:00:00.000Z"),
    });

    await queue.markMutationSynced(newer.id, new Date("2026-01-04T00:00:00.000Z"));

    const pending = await queue.listPendingMutations();
    expect(pending.map((mutation) => mutation.id)).toEqual([older.id]);
    expect(pending[0]).toMatchObject({
      operation: "delete",
      status: "pending",
    });
  });
});
