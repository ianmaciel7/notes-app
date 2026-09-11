import type { SpaceCollectionRecord } from "@/lib/spaces/space-types";

type TabSource = {
  entityIds: readonly string[];
  objectTypeIds: readonly string[];
  collections: Record<string, SpaceCollectionRecord>;
};
export type WorkspaceTabTarget =
  | { kind: "entity" | "type"; id: string }
  | { kind: "collection"; id: string; objectTypeId: string };

function exactTarget(value: string, source: TabSource): WorkspaceTabTarget | null {
  if (source.entityIds.includes(value)) return { kind: "entity", id: value };
  if (source.objectTypeIds.includes(value)) return { kind: "type", id: value };
  const prefix = "object-type-item:collection:";
  const id = value.startsWith(prefix) ? value.slice(prefix.length) : value;
  const collection = Object.hasOwn(source.collections, id) ? source.collections[id] : undefined;
  return collection ? { kind: "collection", id, objectTypeId: collection.structureId } : null;
}

export function resolveWorkspaceTabTarget(value: string, source: TabSource) {
  const exact = exactTarget(value, source);
  if (exact) return exact;
  // Sidebar-generated duplicate instances append Date.now(), never a content identifier.
  const match = /^(.*):\d+$/.exec(value);
  return match ? exactTarget(match[1], source) : null;
}
