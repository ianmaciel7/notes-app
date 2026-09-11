import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

/** In-memory fixtures for tests and isolated Ladle stories, never a production data source. */
export function objectEntityFixture(
  input: Partial<SpaceEntityRecord> = {},
): SpaceEntityRecord {
  return {
    id: "fixture-page",
    spaceId: "personal",
    objectTypeId: "page",
    type: "page",
    title: "Research notes",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    blocks: [{ id: "block-1", type: "paragraph", content: "Saved content for this object." }],
    tags: ["research"],
    relations: [],
    properties: { status: "draft" },
    _syncStatus: "pending",
    ...input,
  };
}

export function objectTypeFixture(
  input: Partial<SpaceObjectTypeRecord> = {},
): SpaceObjectTypeRecord {
  return {
    id: "page",
    spaceId: "personal",
    ownership: "built-in",
    singularName: "Page",
    pluralName: "Pages",
    iconName: "page",
    tone: "blue",
    lifecycleKind: "document",
    propertyDefinitions: [],
    collectionIds: [],
    presentation: { defaultView: "list", availableViews: ["list"] },
    ...input,
  };
}
