import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";

import { createKnowledgeDatabase } from "@/lib/db";
import { createOnlineSyncRunner, shouldRunOnlineSync } from "@/lib/sync/online-sync";
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
    title: "Online sync page",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    blocks: [],
    tags: [],
    relations: [],
    properties: {},
    _syncStatus: "pending",
  };
}

describe("Online sync runner", () => {
  it("only runs when online, project id, and access token are available", () => {
    expect(shouldRunOnlineSync({ online: false, projectId: "p", accessToken: "t" })).toBe(
      false,
    );
    expect(shouldRunOnlineSync({ online: true, projectId: "", accessToken: "t" })).toBe(false);
    expect(shouldRunOnlineSync({ online: true, projectId: "p", accessToken: "" })).toBe(false);
    expect(shouldRunOnlineSync({ online: true, projectId: "p", accessToken: "t" })).toBe(true);
  });

  it("skips sync without touching pending mutations when prerequisites are missing", async () => {
    const { database, queue } = setup();
    const entity = entityFixture();
    await database.entities.add(entity);
    await queue.enqueueEntityMutation({ entity, operation: "set" });
    let called = false;

    const runner = createOnlineSyncRunner(database, {
      getOnlineState: () => false,
      getAccessToken: async () => {
        called = true;
        return "token";
      },
      projectId: "demo-project",
      fetcher: fetch,
    });

    await expect(runner.runOnce()).resolves.toEqual({
      attempted: 0,
      synced: 0,
      failed: 0,
      skipped: "offline",
    });
    expect(called).toBe(false);
    expect(await database.syncMutations.where("status").equals("pending").count()).toBe(1);
  });

  it("pushes pending mutations to Firestore when online credentials are ready", async () => {
    const { database, queue } = setup();
    const entity = entityFixture();
    await database.entities.add(entity);
    await queue.enqueueEntityMutation({
      entity,
      operation: "set",
      referenceDate: new Date("2026-01-03T00:00:00.000Z"),
    });
    const calls: Array<{ url: string; body: unknown }> = [];

    const runner = createOnlineSyncRunner(database, {
      getOnlineState: () => true,
      getAccessToken: async () => "access-token",
      projectId: "demo-project",
      ownerUid: "user-a",
      fetcher: async (url, init) => {
        calls.push({ url: String(url), body: JSON.parse(String(init?.body)) });
        return new Response(JSON.stringify({ writeResults: [{}] }), { status: 200 });
      },
    });

    await expect(
      runner.runOnce({ now: new Date("2026-01-04T00:00:00.000Z") }),
    ).resolves.toEqual({
      attempted: 1,
      synced: 1,
      failed: 0,
    });
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({
      url: "https://firestore.googleapis.com/v1/projects/demo-project/databases/(default)/documents:batchWrite",
      body: {
        writes: [
          {
            update: {
              name: "projects/demo-project/databases/(default)/documents/users/user-a/spaces/space-a/entities/entity-a",
            },
          },
        ],
      },
    });
    expect((await database.entities.get(["space-a", "entity-a"]))?._syncStatus).toBe("synced");
  });
});
