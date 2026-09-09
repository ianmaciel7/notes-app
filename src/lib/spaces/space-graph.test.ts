import { describe, expect, it } from "vitest";

import {
  buildEntityBacklinks,
  buildLocalEntityGraph,
} from "@/lib/spaces/space-graph";
import type { SpaceEntityRecord, SpaceRelationRecord } from "@/lib/spaces/space-types";

function entityFixture(input: Partial<SpaceEntityRecord> & Pick<SpaceEntityRecord, "id">) {
  return {
    id: input.id,
    spaceId: input.spaceId ?? "space-a",
    objectTypeId: input.objectTypeId ?? "page",
    type: input.type ?? "page",
    title: input.title ?? input.id,
    createdAt: input.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-01-01T00:00:00.000Z",
    blocks: input.blocks ?? [],
    tags: input.tags ?? [],
    relations: input.relations ?? [],
    properties: input.properties ?? {},
    _syncStatus: input._syncStatus ?? "pending",
  } satisfies SpaceEntityRecord;
}

function relationFixture(input: Partial<SpaceRelationRecord> & Pick<SpaceRelationRecord, "sourceId" | "targetId">) {
  return {
    id: input.id ?? `relation:${input.sourceId}:${input.targetId}`,
    spaceId: input.spaceId ?? "space-a",
    sourceId: input.sourceId,
    targetId: input.targetId,
    propertyId: input.propertyId ?? "related",
    createdAt: input.createdAt ?? "2026-01-01T00:00:00.000Z",
  } satisfies SpaceRelationRecord;
}

describe("Space graph", () => {
  it("builds incoming backlinks from same-space relations", () => {
    const source = entityFixture({ id: "source", title: "Source note", type: "page" });
    const target = entityFixture({ id: "target", title: "Target note", type: "book" });
    const otherSpaceSource = entityFixture({
      id: "other-source",
      spaceId: "space-b",
      title: "Other note",
    });

    const backlinks = buildEntityBacklinks({
      targetEntityId: target.id,
      targetSpaceId: target.spaceId,
      entities: [source, target, otherSpaceSource],
      relations: [
        relationFixture({ sourceId: source.id, targetId: target.id, propertyId: "cites" }),
        relationFixture({
          sourceId: otherSpaceSource.id,
          targetId: target.id,
          spaceId: "space-b",
        }),
      ],
      propertyLabels: { cites: "Cites" },
    });

    expect(backlinks).toEqual([
      {
        sourceEntityId: "source",
        sourceEntityType: "page",
        sourceTitle: "Source note",
        propertyId: "cites",
        propertyName: "Cites",
      },
    ]);
  });

  it("builds a local graph centered on an entity with only reachable same-space neighbors", () => {
    const center = entityFixture({ id: "center", title: "Center" });
    const outgoing = entityFixture({ id: "outgoing", title: "Outgoing" });
    const incoming = entityFixture({ id: "incoming", title: "Incoming" });
    const unrelated = entityFixture({ id: "unrelated", title: "Unrelated" });

    const graph = buildLocalEntityGraph({
      centerEntityId: center.id,
      spaceId: center.spaceId,
      entities: [center, outgoing, incoming, unrelated],
      relations: [
        relationFixture({ sourceId: center.id, targetId: outgoing.id }),
        relationFixture({ sourceId: incoming.id, targetId: center.id }),
        relationFixture({ sourceId: unrelated.id, targetId: outgoing.id }),
      ],
    });

    expect(graph.nodes).toEqual([
      { id: "center", title: "Center", type: "page", depth: 0 },
      { id: "outgoing", title: "Outgoing", type: "page", depth: 1 },
      { id: "incoming", title: "Incoming", type: "page", depth: 1 },
    ]);
    expect(graph.edges).toEqual([
      { id: "relation:center:outgoing", sourceId: "center", targetId: "outgoing", propertyId: "related" },
      { id: "relation:incoming:center", sourceId: "incoming", targetId: "center", propertyId: "related" },
    ]);
  });
});
