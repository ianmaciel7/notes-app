import "fake-indexeddb/auto";
import { afterEach, expect, it } from "vitest";
import { createKnowledgeDatabase } from "@/lib/db";
import { bootstrapWorkspace } from "@/lib/spaces/bootstrap-space";
import { searchEntitiesInSpace } from "@/lib/spaces/space-projections";
import {
  createSpaceRepository,
  OBJECT_TYPE_ORDER_SETTING_KEY,
} from "@/lib/spaces/space-repository";
import { PERSONAL_SPACE_ID } from "@/lib/spaces/space-types";

const databases: ReturnType<typeof createKnowledgeDatabase>[] = [];
afterEach(async () => {
  await Promise.all(databases.splice(0).map((database) => database.delete()));
});
async function setup() {
  const database = createKnowledgeDatabase(`runtime-${crypto.randomUUID()}`);
  databases.push(database);
  await bootstrapWorkspace(database);
  const repository = createSpaceRepository(database);
  const entity = await repository.createEntity(PERSONAL_SPACE_ID, "page", "Original");
  return { database, repository, entity };
}

it("rolls back an edit when its pending sync mutation cannot be saved", async () => {
  const { database, repository, entity } = await setup();
  const failWrite = () => {
    throw new Error("Queue unavailable");
  };
  database.syncMutations.hook("creating", failWrite);
  await expect(
    repository.updateEntity(entity.spaceId, entity.id, { title: "Changed" }),
  ).rejects.toThrow("Queue unavailable");
  database.syncMutations.hook("creating").unsubscribe(failWrite);
  expect((await database.entities.get([entity.spaceId, entity.id]))?.title).toBe("Original");
});

it("searches stored body, tags, and properties without leaking another Space", async () => {
  const { database, repository, entity } = await setup();
  await repository.updateEntity(entity.spaceId, entity.id, {
    blocks: [{ id: "body", type: "paragraph", content: "Memória duradoura" }],
    tags: ["learning"],
    properties: { topic: "retrieval" },
  });
  for (const query of ["memoria", "learning", "retrieval"]) {
    expect(
      (await searchEntitiesInSpace(database, entity.spaceId, query)).map((item) => item.id),
    ).toEqual([entity.id]);
  }
  expect(await searchEntitiesInSpace(database, "other-space", "memoria")).toEqual([]);
});

it("moves an object to trash and restores its content and relationships", async () => {
  const { database, repository, entity } = await setup();
  const target = await repository.createEntity(entity.spaceId, "page", "Target");
  await repository.createRelation({
    id: "link",
    spaceId: entity.spaceId,
    sourceId: entity.id,
    targetId: target.id,
    propertyId: "reference",
    createdAt: entity.createdAt,
  });
  const trash = await repository.trashEntity(entity.spaceId, entity.id);
  expect(await database.entities.get([entity.spaceId, entity.id])).toBeUndefined();
  expect(await database.relations.get([entity.spaceId, "link"])).toBeUndefined();
  await database.syncMutations.clear();
  await repository.restoreTrash(entity.spaceId, trash.id);
  expect(await database.entities.get([entity.spaceId, entity.id])).toMatchObject({
    title: "Original",
    _syncStatus: "pending",
  });
  expect(await database.relations.get([entity.spaceId, "link"])).toMatchObject({
    targetId: target.id,
  });
  expect(await repository.listTrash(entity.spaceId)).toEqual([]);
  expect(
    (await database.syncMutations.where("entityId").equals(entity.id).toArray()).at(-1)?.operation,
  ).toBe("set");
});

it("does not discard legacy trash that has no recoverable object", async () => {
  const { repository, entity } = await setup();
  await repository.putTrash(entity.spaceId, {
    id: "legacy",
    spaceId: entity.spaceId,
    entityId: "missing",
    label: "Missing",
    typeLabel: "Page",
    trashedAt: entity.createdAt,
    purgeAfter: "2099-01-01T00:00:00.000Z",
  });
  await expect(repository.restoreTrash(entity.spaceId, "legacy")).rejects.toThrow();
  expect(await repository.listTrash(entity.spaceId)).toHaveLength(1);
});

it("refuses restoration in a different Space and duplicate overwrites", async () => {
  const { database, repository, entity } = await setup();
  const trash = await repository.trashEntity(entity.spaceId, entity.id);
  await expect(repository.restoreTrash("other-space", trash.id)).rejects.toThrow();
  await database.entities.add({ ...entity, title: "Newer data" });
  await expect(repository.restoreTrash(entity.spaceId, trash.id)).rejects.toThrow();
  expect((await database.entities.get([entity.spaceId, entity.id]))?.title).toBe("Newer data");
  expect(await repository.listTrash(entity.spaceId)).toHaveLength(1);
});

it("rolls back a flashcard review when queue persistence fails", async () => {
  const { database, repository, entity } = await setup();
  const card = await repository.createEntity(entity.spaceId, "flashcard", "Question");
  const failWrite = () => {
    throw new Error("Queue unavailable");
  };
  database.syncMutations.hook("creating", failWrite);
  await expect(repository.recordFlashcardReview(entity.spaceId, card.id, 3)).rejects.toThrow(
    "Queue unavailable",
  );
  database.syncMutations.hook("creating").unsubscribe(failWrite);
  expect((await database.entities.get([card.spaceId, card.id]))?.srs).toEqual(card.srs);
});

it("rejects stale edits rather than overwriting a newer save", async () => {
  const { repository, entity } = await setup();
  await repository.updateEntity(entity.spaceId, entity.id, { title: "Newer" });
  await expect(
    repository.updateEntity(entity.spaceId, entity.id, { title: "Stale" }, entity.updatedAt),
  ).rejects.toThrow("changed while you were editing");
  expect((await repository.listEntities(entity.spaceId))[0]?.title).toBe("Newer");
});

it("creates a collection item with persisted membership and rejects a mismatched type", async () => {
  const { repository, entity } = await setup();
  const collection = await repository.createCollection(entity.spaceId, "page", "Reading");
  const created = await repository.createEntity(entity.spaceId, "page", "Inside", collection.id);
  expect(created.collections).toEqual([collection.id]);
  expect(
    (await repository.listEntities(entity.spaceId)).find((item) => item.id === created.id)
      ?.collections,
  ).toEqual([collection.id]);
  await expect(
    repository.createEntity(entity.spaceId, "task", "Wrong", collection.id),
  ).rejects.toThrow("Collection");
});

it("reads a complete scoped snapshot and does not treat a missing Space as ready", async () => {
  const { database, repository, entity } = await setup();
  const { readSpaceSnapshot } = await import("@/lib/spaces/space-snapshot");
  const collection = await repository.createCollection(entity.spaceId, "page", "Reading");
  await repository.setSpaceSetting(entity.spaceId, OBJECT_TYPE_ORDER_SETTING_KEY, ["page"]);
  const snapshot = await readSpaceSnapshot(database, entity.spaceId);
  expect(snapshot?.spaceId).toBe(entity.spaceId);
  expect(snapshot?.objectTypeOrder).toEqual(["page"]);
  expect(snapshot?.entities.map((item) => item.id)).toEqual([entity.id]);
  expect(snapshot?.collections.map((item) => item.id)).toEqual([collection.id]);
  expect(await readSpaceSnapshot(database, "missing")).toBeNull();
});

it("duplicates a collection with its existing members atomically", async () => {
  const { database, repository, entity } = await setup();
  const { duplicateSpaceCollection } = await import("@/lib/spaces/space-collection-mutations");
  const source = await repository.createCollection(entity.spaceId, "page", "Reading");
  await repository.updateEntity(entity.spaceId, entity.id, { collections: [source.id] });
  const copy = await duplicateSpaceCollection(database, entity.spaceId, source.id);
  expect(copy.name).toBe("Reading copy");
  expect(copy.id).not.toBe(source.id);
  expect((await database.entities.get([entity.spaceId, entity.id]))?.collections).toEqual([
    source.id,
    copy.id,
  ]);
  const fail = () => {
    throw new Error("Queue unavailable");
  };
  database.syncMutations.hook("creating", fail);
  await expect(duplicateSpaceCollection(database, entity.spaceId, source.id)).rejects.toThrow(
    "Queue unavailable",
  );
  database.syncMutations.hook("creating").unsubscribe(fail);
  expect(await database.collections.where("spaceId").equals(entity.spaceId).count()).toBe(2);
});

it("preserves edits and FSRS review state when the database is reopened", async () => {
  const { database, repository, entity } = await setup();
  const card = await repository.createEntity(entity.spaceId, "flashcard", "Question");
  await repository.updateEntity(entity.spaceId, entity.id, { title: "Persisted title" });
  const review = await repository.recordFlashcardReview(entity.spaceId, card.id, 3);
  database.close();
  const reopened = createKnowledgeDatabase(database.name);
  try {
    expect((await reopened.entities.get([entity.spaceId, entity.id]))?.title).toBe(
      "Persisted title",
    );
    expect((await reopened.entities.get([entity.spaceId, card.id]))?.srs).toEqual(review.nextState);
    expect(
      await reopened.syncMutations.where("spaceId").equals(entity.spaceId).count(),
    ).toBeGreaterThan(0);
  } finally {
    reopened.close();
  }
});
