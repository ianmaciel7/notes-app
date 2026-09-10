import { describe, expect, it } from "vitest";
import type { SpaceEntityRecord, SyncMutationRecord } from "@/lib/spaces/space-types";
import { createFirestoreRestSyncWriter, toFirestoreValue } from "@/lib/sync/firestore-writer";

function entityFixture(): SpaceEntityRecord {
  return {
    id: "entity-a",
    spaceId: "space-a",
    objectTypeId: "page",
    type: "page",
    title: "Synced page",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    blocks: [{ id: "block-a", type: "paragraph", content: "Hello" }],
    tags: ["memory"],
    relations: [],
    properties: { priority: 2, reviewed: false, note: null },
    _syncStatus: "pending",
  };
}

function mutationFixture(input: Partial<SyncMutationRecord> = {}): SyncMutationRecord {
  const entity = entityFixture();
  return {
    id: input.id ?? "sync-a",
    spaceId: input.spaceId ?? entity.spaceId,
    entityId: input.entityId ?? entity.id,
    entityType: input.entityType ?? entity.type,
    operation: input.operation ?? "set",
    status: input.status ?? "pending",
    payload: input.payload ?? entity,
    createdAt: input.createdAt ?? "2026-01-03T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-01-03T00:00:00.000Z",
  };
}

describe("Firestore REST sync writer", () => {
  it("serializes JavaScript values into Firestore REST values", () => {
    expect(
      toFirestoreValue({
        title: "Synced page",
        count: 2,
        reviewed: false,
        tags: ["memory"],
        note: null,
      }),
    ).toEqual({
      mapValue: {
        fields: {
          title: { stringValue: "Synced page" },
          count: { doubleValue: 2 },
          reviewed: { booleanValue: false },
          tags: { arrayValue: { values: [{ stringValue: "memory" }] } },
          note: { nullValue: null },
        },
      },
    });
  });

  it("commits set and delete mutations through Firestore batchWrite", async () => {
    const calls: Array<{ url: string; authorization?: string; body: unknown }> = [];
    const writer = createFirestoreRestSyncWriter({
      projectId: "demo-project",
      databaseId: "(default)",
      accessToken: "access-token",
      ownerUid: "user-a",
      fetcher: async (url, init) => {
        calls.push({
          url: String(url),
          authorization: new Headers(init?.headers).get("authorization") ?? undefined,
          body: JSON.parse(String(init?.body)),
        });
        return Response.json({ writeResults: [{}, {}], status: [{}, {}] });
      },
    });

    await writer.commit([
      mutationFixture(),
      mutationFixture({
        id: "sync-delete",
        entityId: "entity-b",
        operation: "delete",
        payload: undefined,
      }),
    ]);

    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toBe(
      "https://firestore.googleapis.com/v1/projects/demo-project/databases/(default)/documents:batchWrite",
    );
    expect(calls[0]?.authorization).toBe("Bearer access-token");
    expect(calls[0]?.body).toMatchObject({
      writes: [
        {
          update: {
            name: "projects/demo-project/databases/(default)/documents/users/user-a/spaces/space-a/entities/entity-a",
            fields: {
              id: { stringValue: "entity-a" },
              title: { stringValue: "Synced page" },
              tags: { arrayValue: { values: [{ stringValue: "memory" }] } },
            },
          },
        },
        {
          delete:
            "projects/demo-project/databases/(default)/documents/users/user-a/spaces/space-a/entities/entity-b",
        },
      ],
    });
  });

  it("rejects Firestore failures without leaking access tokens", async () => {
    const writer = createFirestoreRestSyncWriter({
      projectId: "demo-project",
      accessToken: "secret-token",
      fetcher: async () => new Response("secret-token denied", { status: 403 }),
    });

    await expect(writer.commit([mutationFixture()])).rejects.toThrow(
      "Firestore batchWrite failed with status 403",
    );
  });
});
