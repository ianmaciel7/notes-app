import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";

import { createKnowledgeDatabase } from "@/lib/db";
import { createSpaceRepository } from "@/lib/spaces/space-repository";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

const opened: ReturnType<typeof createKnowledgeDatabase>[] = [];

afterEach(async () => {
  await Promise.all(opened.map((database) => database.delete()));
  opened.length = 0;
});

function setup() {
  const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
  opened.push(database);
  return { database, repository: createSpaceRepository(database) };
}

function entityFixture(
  input: Pick<SpaceEntityRecord, "id" | "spaceId" | "objectTypeId"> & Partial<SpaceEntityRecord>,
): SpaceEntityRecord {
  return {
    id: input.id,
    spaceId: input.spaceId,
    objectTypeId: input.objectTypeId,
    type: input.type ?? input.objectTypeId,
    title: input.title ?? input.id,
    createdAt: input.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-01-01T00:00:00.000Z",
    blocks: input.blocks ?? [],
    tags: input.tags ?? [],
    relations: input.relations ?? [],
    properties: input.properties ?? {},
    _syncStatus: input._syncStatus ?? "pending",
  };
}

describe("Space repository", () => {
  it("creates and activates a completely blank Space", async () => {
    const { database, repository } = setup();
    const created = await repository.createBlankSpace("Research");

    expect(await repository.getActiveSpaceId()).toBe(created.id);
    for (const table of [
      database.objectTypes,
      database.entities,
      database.collections,
      database.tags,
      database.relations,
      database.media,
      database.spaceSettings,
      database.trash,
    ]) {
      expect(await table.where("spaceId").equals(created.id).count()).toBe(0);
    }
  });

  it("persists Space order", async () => {
    const { repository } = setup();
    const first = await repository.createBlankSpace("First");
    const second = await repository.createBlankSpace("Second");
    await repository.reorderSpaces([second.id, first.id]);
    expect((await repository.listSpaces()).map((space) => space.id)).toEqual([second.id, first.id]);
  });

  it("keeps object types and objects isolated", async () => {
    const { repository } = setup();
    const first = await repository.createBlankSpace("First");
    const second = await repository.createBlankSpace("Second");

    await repository.createObjectType(first.id, {
      singularName: "Book",
      pluralName: "Books",
      iconName: "book",
      tone: "purple",
      lifecycleKind: "document",
    });
    const type = (await repository.listObjectTypes(first.id))[0];
    expect(type?.pluralName).toBe("Books");
    expect(await repository.listObjectTypes(second.id)).toEqual([]);

    if (!type) throw new Error("Book type was not created");
    await repository.createEntity(first.id, type.id, "Domain-Driven Design");
    expect((await repository.listEntities(first.id)).map((entity) => entity.title)).toEqual([
      "Domain-Driven Design",
    ]);
    expect(await repository.listEntities(second.id)).toEqual([]);
  });

  it("allows the same logical id in different Spaces", async () => {
    const { database, repository } = setup();
    const first = await repository.createBlankSpace("First");
    const second = await repository.createBlankSpace("Second");
    await database.entities.bulkAdd([
      entityFixture({ id: "same", spaceId: first.id, objectTypeId: "page" }),
      entityFixture({ id: "same", spaceId: second.id, objectTypeId: "page" }),
    ]);
    expect(await database.entities.get([first.id, "same"])).toBeDefined();
    expect(await database.entities.get([second.id, "same"])).toBeDefined();
  });

  it("rejects cross-Space relations", async () => {
    const { database, repository } = setup();
    const first = await repository.createBlankSpace("First");
    const second = await repository.createBlankSpace("Second");
    await database.entities.bulkAdd([
      entityFixture({ id: "source", spaceId: first.id, objectTypeId: "page" }),
      entityFixture({ id: "target", spaceId: second.id, objectTypeId: "page" }),
    ]);

    await expect(
      repository.createRelation({
        id: "relation:source:target",
        spaceId: first.id,
        sourceId: "source",
        targetId: "target",
        propertyId: "related",
        createdAt: "2026-01-01T00:00:00.000Z",
      }),
    ).rejects.toThrow("Cross-Space relation");
  });
});
