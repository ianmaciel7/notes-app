import type { KnowledgeDatabase } from "@/lib/db";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

export async function searchEntitiesInSpace(
  database: KnowledgeDatabase,
  spaceId: string,
  query: string,
) {
  const normalized = normalizeSearchText(query.trim());
  const entities = await database.entities.where("spaceId").equals(spaceId).toArray();
  if (!normalized) return entities;
  return entities.filter((entity) =>
    normalizeSearchText([entity.title, entity.type, entity.objectTypeId].join(" ")).includes(
      normalized,
    ),
  );
}

export async function listBacklinksInSpace(
  database: KnowledgeDatabase,
  spaceId: string,
  targetId: string,
) {
  const relations = await database.relations.where("spaceId").equals(spaceId).toArray();
  const sourceIds = new Set(
    relations.filter((relation) => relation.targetId === targetId).map((relation) => relation.sourceId),
  );
  if (sourceIds.size === 0) return [];
  const entities = await database.entities.where("spaceId").equals(spaceId).toArray();
  return entities.filter((entity) => sourceIds.has(entity.id));
}

export type SpaceGraphProjection = {
  nodes: { id: string; title: string; objectTypeId: string }[];
  edges: { id: string; sourceId: string; targetId: string; propertyId: string }[];
};

export async function buildGraphInSpace(
  database: KnowledgeDatabase,
  spaceId: string,
): Promise<SpaceGraphProjection> {
  const [entities, relations] = await Promise.all([
    database.entities.where("spaceId").equals(spaceId).toArray(),
    database.relations.where("spaceId").equals(spaceId).toArray(),
  ]);
  const nodeIds = new Set(entities.map((entity) => entity.id));
  return {
    nodes: entities.map((entity) => ({
      id: entity.id,
      title: entity.title,
      objectTypeId: entity.objectTypeId,
    })),
    edges: relations
      .filter(
        (relation) => nodeIds.has(relation.sourceId) && nodeIds.has(relation.targetId),
      )
      .map((relation) => ({
        id: relation.id,
        sourceId: relation.sourceId,
        targetId: relation.targetId,
        propertyId: relation.propertyId,
      })),
  };
}

export function groupEntitiesByObjectType(entities: readonly SpaceEntityRecord[]) {
  return entities.reduce<Record<string, number>>((counts, entity) => {
    counts[entity.objectTypeId] = (counts[entity.objectTypeId] ?? 0) + 1;
    return counts;
  }, {});
}
