import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

export const workspaceStoryNow = "2026-09-10T13:00:00.000Z";

export function workspaceEntityFixture(input: Partial<SpaceEntityRecord> = {}): SpaceEntityRecord {
  const objectTypeId = input.objectTypeId ?? "page";

  return {
    id: input.id ?? `entity-${objectTypeId}`,
    spaceId: input.spaceId ?? "personal",
    objectTypeId,
    type: input.type ?? objectTypeId,
    title: input.title ?? "Untitled object",
    createdAt: input.createdAt ?? workspaceStoryNow,
    updatedAt: input.updatedAt ?? workspaceStoryNow,
    blocks: input.blocks ?? [],
    tags: input.tags ?? [],
    relations: input.relations ?? [],
    properties: input.properties ?? {},
    _syncStatus: input._syncStatus ?? "pending",
  };
}

export function workspaceObjectTypeFixture(
  input: Partial<SpaceObjectTypeRecord> & Pick<SpaceObjectTypeRecord, "id" | "singularName">,
): SpaceObjectTypeRecord {
  return {
    id: input.id,
    spaceId: input.spaceId ?? "personal",
    ownership: input.ownership ?? "built-in",
    singularName: input.singularName,
    pluralName: input.pluralName ?? `${input.singularName}s`,
    iconName: input.iconName ?? "page",
    tone: input.tone ?? "blue",
    lifecycleKind: input.lifecycleKind ?? "document",
    propertyDefinitions: input.propertyDefinitions ?? [],
    collectionIds: input.collectionIds ?? [],
    presentation: input.presentation ?? {
      availableViews: ["list"],
      defaultView: "list",
    },
  };
}
