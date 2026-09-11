import type { WorkspaceObjectDataViewType } from "@/app/_components/workspace/workspace-object-data-view";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

export type ObjectListPreferences = {
  allLayout: "cards" | "list";
  filter: "all" | "tagged" | "untagged";
  groupBy: "none" | "tag";
  mode: "all" | "overview";
  query: string;
  sort: "updated-desc" | "updated-asc" | "title-asc" | "title-desc";
};

export const defaultObjectListPreferences: ObjectListPreferences = {
  allLayout: "cards",
  filter: "all",
  groupBy: "none",
  mode: "overview",
  query: "",
  sort: "updated-desc",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readSort(value: Record<string, unknown>): ObjectListPreferences["sort"] {
  switch (value.sort) {
    case "updated-desc":
    case "updated-asc":
    case "title-asc":
    case "title-desc":
      return value.sort;
    default:
      return value.sortNewestFirst === false ? "updated-asc" : "updated-desc";
  }
}

export function parseObjectListPreferences(raw: string | null): ObjectListPreferences {
  try {
    const value: unknown = raw ? JSON.parse(raw) : null;
    if (!isRecord(value)) return { ...defaultObjectListPreferences };
    return {
      allLayout: value.allLayout === "list" ? "list" : "cards",
      filter: value.filter === "tagged" || value.filter === "untagged" ? value.filter : "all",
      groupBy: value.groupBy === "tag" ? "tag" : "none",
      mode: value.mode === "all" ? "all" : "overview",
      query: typeof value.query === "string" ? value.query : "",
      sort: readSort(value),
    };
  } catch {
    return { ...defaultObjectListPreferences };
  }
}

export function resolveObjectListSpaceId(
  entities: readonly SpaceEntityRecord[],
  objectType: WorkspaceObjectDataViewType,
): string | undefined {
  if (objectType.spaceId) return objectType.spaceId;
  const matching = entities.filter((entity) => entity.objectTypeId === objectType.id);
  const spaces = new Set(matching.map((entity) => entity.spaceId));
  if (spaces.size > 1) return undefined;
  return matching[0]?.spaceId ?? "personal";
}

export function objectListPreferencesKey(spaceId: string, objectTypeId: string): string {
  return `knowledgeos.workspace.objectTypeList.${spaceId}.${objectTypeId}`;
}

function matchesFilter(entity: SpaceEntityRecord, preferences: ObjectListPreferences): boolean {
  if (preferences.filter === "tagged" && entity.tags.length === 0) return false;
  if (preferences.filter === "untagged" && entity.tags.length > 0) return false;
  const query = preferences.query.trim().toLocaleLowerCase();
  if (!query) return true;
  return `${entity.title} ${entity.blocks.map((block) => block.content).join(" ")}`
    .toLocaleLowerCase()
    .includes(query);
}

function compareEntities(
  left: SpaceEntityRecord,
  right: SpaceEntityRecord,
  sort: ObjectListPreferences["sort"],
): number {
  if (sort === "title-asc" || sort === "title-desc") {
    const order = (left.title || "Sem título").localeCompare(right.title || "Sem título");
    return sort === "title-asc" ? order : -order;
  }
  const order = left.updatedAt.localeCompare(right.updatedAt);
  return sort === "updated-desc" ? -order : order;
}

export function selectObjectListEntities(
  entities: readonly SpaceEntityRecord[],
  objectType: WorkspaceObjectDataViewType,
  preferences: ObjectListPreferences,
): SpaceEntityRecord[] {
  const spaceId = resolveObjectListSpaceId(entities, objectType);
  if (!spaceId) return [];
  return entities
    .filter((entity) => entity.spaceId === spaceId && entity.objectTypeId === objectType.id)
    .filter((entity) => matchesFilter(entity, preferences))
    .sort((left, right) => compareEntities(left, right, preferences.sort));
}
