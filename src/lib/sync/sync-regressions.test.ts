import "fake-indexeddb/auto";
import { afterEach, expect, it } from "vitest";
import { createKnowledgeDatabase } from "@/lib/db";
import type { SpaceEntityRecord, SyncMutationRecord } from "@/lib/spaces/space-types";
import { createFirestoreRestSyncWriter } from "@/lib/sync/firestore-writer";
import { createSyncEngine } from "@/lib/sync/sync-engine";
import { createSyncQueue } from "@/lib/sync/sync-queue";

const opened: ReturnType<typeof createKnowledgeDatabase>[] = [];

afterEach(async () => {
  await Promise.all(opened.map((database) => database.delete()));
  opened.length = 0;
});

function entityFixture(): SpaceEntityRecord {
  return {
    id: "entity-a",
    spaceId: "space-a",
    objectTypeId: "page",
    type: "page",
    title: "First revision",
    createdAt: "2026-09-10T00:00:00.000Z",
    updatedAt: "2026-09-10T00:00:00.000Z",
    blocks: [],
    tags: [],
    relations: [],
    properties: {},
    _syncStatus: "pending",
  };
}

function mutationFixture(overrides: Partial<SyncMutationRecord> = {}): SyncMutationRecord {
  const entity = entityFixture();
  return {
    id: "mutation-a",
    spaceId: entity.spaceId,
    entityId: entity.id,
    entityType: entity.type,
    operation: "set",
    status: "pending",
    payload: entity,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    ...overrides,
  };
}

function createWriter(fetcher: typeof fetch) {
  return createFirestoreRestSyncWriter({
    projectId: "test-project",
    ownerUid: "test-user",
    accessToken: "test-token",
    fetcher,
  });
}

it("rejects a failed individual write even when HTTP returns 200", async () => {
  const writer = createWriter(async () =>
    Response.json({ writeResults: [{}], status: [{ code: 7, message: "private details" }] }),
  );
  await expect(writer.commit([mutationFixture()])).rejects.toThrow(
    "Firestore batchWrite rejected one or more writes.",
  );
});

it.each([
  null,
  {},
  { writeResults: [{}] },
  { writeResults: [{}], status: [] },
  { writeResults: [{}], status: [null] },
  { writeResults: [], status: [{}] },
])("rejects incomplete Firestore acknowledgements: %j", async (payload) => {
  const writer = createWriter(async () => Response.json(payload));
  await expect(writer.commit([mutationFixture()])).rejects.toThrow("Firestore");
});

it("accepts the omitted protobuf default success code", async () => {
  const writer = createWriter(async () => Response.json({ writeResults: [{}], status: [{}] }));
  await expect(writer.commit([mutationFixture()])).resolves.toBeUndefined();
});

it("coalesces full snapshots for one document before sending a batch", async () => {
  const bodies: unknown[] = [];
  const writer = createWriter(async (_url, init) => {
    bodies.push(JSON.parse(String(init?.body)));
    return Response.json({ writeResults: [{}], status: [{}] });
  });
  await writer.commit([
    mutationFixture(),
    mutationFixture({ id: "mutation-b", payload: { ...entityFixture(), title: "Latest" } }),
  ]);
  expect(bodies).toEqual([
    {
      writes: [
        expect.objectContaining({
          update: expect.objectContaining({
            fields: expect.objectContaining({ title: { stringValue: "Latest" } }),
          }),
        }),
      ],
    },
  ]);
});

it.each(["set", "delete"] as const)("keeps the final %s after coalescing", async (operation) => {
  const bodies: Array<{ writes: Array<{ delete?: string; update?: unknown }> }> = [];
  const writer = createWriter(async (_url, init) => {
    bodies.push(JSON.parse(String(init?.body)));
    return Response.json({ writeResults: [{}], status: [{}] });
  });
  await writer.commit([
    mutationFixture({ operation: operation === "set" ? "delete" : "set" }),
    mutationFixture({ id: "last", operation }),
  ]);
  expect(bodies[0]?.writes).toHaveLength(1);
  expect(bodies[0]?.writes[0]?.[operation === "set" ? "update" : "delete"]).toBeDefined();
});

it("sends large distinct-document batches in bounded requests", async () => {
  const batchSizes: number[] = [];
  const writer = createWriter(async (_url, init) => {
    const body: { writes: unknown[] } = JSON.parse(String(init?.body));
    batchSizes.push(body.writes.length);
    return Response.json({
      writeResults: body.writes.map(() => ({})),
      status: body.writes.map(() => ({})),
    });
  });
  await writer.commit(
    Array.from({ length: 501 }, (_, index) =>
      mutationFixture({ id: `mutation-${index}`, entityId: `entity-${index}` }),
    ),
  );
  expect(batchSizes).toEqual([500, 1]);
});

it.each([false, true])("preserves an edit made in flight (same timestamp: %s)", async (sameTime) => {
  const database = createKnowledgeDatabase(`sync-regression-${crypto.randomUUID()}`);
  opened.push(database);
  const queue = createSyncQueue(database);
  const original = entityFixture();
  await database.entities.add(original);
  await queue.enqueueEntityMutation({ entity: original, operation: "set" });
  const engine = createSyncEngine(database, {
    async commit() {
      const newer: SpaceEntityRecord = {
        ...original,
        title: "Edited during sync",
        updatedAt: sameTime ? original.updatedAt : "2026-09-11T00:00:00.000Z",
      };
      await database.entities.put(newer);
      await queue.enqueueEntityMutation({ entity: newer, operation: "set" });
    },
  });
  await engine.pushPendingMutations();
  expect((await database.entities.get([original.spaceId, original.id]))?._syncStatus).toBe("pending");
  expect(await queue.listPendingMutations()).toHaveLength(1);
});
