import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";

import { createKnowledgeDatabase } from "@/lib/db";
import {
  buildGraphInSpace,
  listBacklinksInSpace,
  searchEntitiesInSpace,
} from "@/lib/spaces/space-projections";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

const opened: ReturnType<typeof createKnowledgeDatabase>[] = [];

afterEach(async () => {
  await Promise.all(opened.map((database) => database.delete()));
  opened.length = 0;
});

function entity(id: string, spaceId: string, title: string): SpaceEntityRecord {
  return {
    id,
    spaceId,
    objectTypeId: "page",
    type: "page",
    title,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    blocks: [],
    tags: [],
    relations: [],
    properties: {},
    _syncStatus: "pending",
  };
}

describe("Space projections", () => {
  it("never leaks search results between Spaces", async () => {
    const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
    opened.push(database);
    await database.entities.bulkAdd([
      entity("personal-a", "personal", "Shared phrase"),
      entity("other-a", "other", "Shared phrase"),
    ]);
    expect(
      (await searchEntitiesInSpace(database, "personal", "shared")).map((item) => item.id),
    ).toEqual(["personal-a"]);
  });

  it("filters backlinks and graph edges by Space before resolving entities", async () => {
    const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
    opened.push(database);
    await database.entities.bulkAdd([
      entity("p-source", "personal", "Personal source"),
      entity("p-target", "personal", "Personal target"),
      entity("o-source", "other", "Other source"),
    ]);
    await database.relations.bulkAdd([
      {
        id: "p-rel",
        spaceId: "personal",
        sourceId: "p-source",
        targetId: "p-target",
        propertyId: "related",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "o-rel",
        spaceId: "other",
        sourceId: "o-source",
        targetId: "p-target",
        propertyId: "related",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ]);

    expect(
      (await listBacklinksInSpace(database, "personal", "p-target")).map((item) => item.id),
    ).toEqual(["p-source"]);
    const graph = await buildGraphInSpace(database, "personal");
    expect(graph.nodes.map((node) => node.id)).toEqual(["p-source", "p-target"]);
    expect(graph.edges.map((edge) => edge.id)).toEqual(["p-rel"]);
  });
});
