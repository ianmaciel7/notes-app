import type { CollectionId, StructureId, TagId, WorkspaceStructure } from "./space-object-types.ts";

// Minimal inline type (workspace-objects.ts removed from project)
// biome-ignore lint/suspicious/noExplicitAny: stub type
type WorkspaceEntity = Record<string, any> & { readonly id: string };

type WorkspaceTagRecord = {
  readonly id: TagId;
  readonly name: string;
};

type WorkspaceCollectionRecord = {
  readonly id: CollectionId;
  readonly name: string;
  readonly structureId: StructureId;
};

type WorkspaceReverseProjections = {
  readonly collectionMembershipsByCollectionId: ReadonlyMap<CollectionId, readonly string[]>;
  readonly relationSourcesByTargetId: ReadonlyMap<string, readonly string[]>;
  readonly tagMembershipsByTagId: ReadonlyMap<TagId, readonly string[]>;
};

const textEncoder = new TextEncoder();

function normalizeIdentityName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function slugify(value: string): string {
  const slug = normalizeIdentityName(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "untitled";
}

function deterministicSuffix(value: string): string {
  let hash = 2166136261;
  for (const byte of textEncoder.encode(value)) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).slice(0, 6);
}

function uniqueId(baseId: string, source: string, usedIds: Set<string>): string {
  let id = baseId;
  if (usedIds.has(id)) id = `${baseId}-${deterministicSuffix(source)}`;
  let suffix = 2;
  while (usedIds.has(id)) {
    id = `${baseId}-${deterministicSuffix(source)}-${suffix}`;
    suffix += 1;
  }
  usedIds.add(id);
  return id;
}

function createTagId(name: string, usedIds: Set<string> = new Set()): TagId {
  const normalized = normalizeIdentityName(name);
  return uniqueId(`tag:${slugify(normalized)}`, normalized, usedIds);
}

function createCollectionId(
  structureId: StructureId,
  name: string,
  usedIds: Set<string> = new Set(),
): CollectionId {
  const normalized = normalizeIdentityName(name);
  return uniqueId(
    `collection:${structureId}:${slugify(normalized)}`,
    `${structureId}:${normalized}`,
    usedIds,
  );
}

function migrateLegacyTagNames(names: readonly string[]): readonly WorkspaceTagRecord[] {
  const usedIds = new Set<string>();
  return names.flatMap((name) => {
    const normalized = normalizeIdentityName(name);
    return normalized ? [{ id: createTagId(normalized, usedIds), name: normalized }] : [];
  });
}

function migrateLegacyCollectionsByStructure(
  collectionsByStructureId: Readonly<Record<string, readonly string[]>>,
): readonly WorkspaceCollectionRecord[] {
  const usedIds = new Set<string>();
  return Object.entries(collectionsByStructureId).flatMap(([structureId, names]) =>
    names.flatMap((name) => {
      const normalized = normalizeIdentityName(name);
      return normalized
        ? [
            {
              id: createCollectionId(structureId, normalized, usedIds),
              name: normalized,
              structureId,
            },
          ]
        : [];
    }),
  );
}

function selectTagRecordsFromEntities(
  entities: readonly WorkspaceEntity[],
): readonly WorkspaceTagRecord[] {
  const usedIds = new Set<string>();
  return entities
    .filter((entity) => entity.kind === "tag")
    .map((entity) => ({
      id: createTagId(entity.id, usedIds),
      name: normalizeIdentityName(entity.title) || entity.id,
    }));
}

function appendMembership<TKey extends string>(
  map: Map<TKey, string[]>,
  key: TKey,
  objectId: string,
) {
  const current = map.get(key) ?? [];
  if (!current.includes(objectId)) map.set(key, [...current, objectId]);
}

function selectWorkspaceReverseProjections(
  entities: readonly WorkspaceEntity[],
): WorkspaceReverseProjections {
  const collectionMembershipsByCollectionId = new Map<CollectionId, string[]>();
  const relationSourcesByTargetId = new Map<string, string[]>();
  const tagMembershipsByTagId = new Map<TagId, string[]>();

  for (const entity of entities) {
    if ("collections" in entity) {
      for (const collectionId of entity.collections) {
        appendMembership(collectionMembershipsByCollectionId, collectionId, entity.id);
      }
    }
    if ("tags" in entity) {
      for (const tagId of entity.tags) {
        appendMembership(tagMembershipsByTagId, tagId, entity.id);
      }
    }
    // biome-ignore lint/suspicious/noExplicitAny: stub — workspace-objects removed
    for (const value of Object.values(entity.propertyValues) as any[]) {
      if (value.type !== "entity") continue;
      for (const target of value.entity) {
        appendMembership(relationSourcesByTargetId, target.id, entity.id);
      }
    }
  }

  return {
    collectionMembershipsByCollectionId,
    relationSourcesByTargetId,
    tagMembershipsByTagId,
  };
}

function selectCollectionsForStructure(
  structures: readonly WorkspaceStructure[],
  structureId: StructureId,
): readonly CollectionId[] {
  return structures.find((structure) => structure.id === structureId)?.collectionIds ?? [];
}

function selectWorkspaceCollectionRecordsForStructure(
  records: Readonly<Record<string, WorkspaceCollectionRecord>>,
  structureId: StructureId,
): readonly WorkspaceCollectionRecord[] {
  return Object.values(records).filter((record) => record.structureId === structureId);
}

export type { WorkspaceCollectionRecord, WorkspaceReverseProjections, WorkspaceTagRecord };
export {
  createCollectionId,
  createTagId,
  migrateLegacyCollectionsByStructure,
  migrateLegacyTagNames,
  selectCollectionsForStructure,
  selectTagRecordsFromEntities,
  selectWorkspaceCollectionRecordsForStructure,
  selectWorkspaceReverseProjections,
};
