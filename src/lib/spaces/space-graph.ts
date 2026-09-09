import type { SpaceEntityRecord, SpaceRelationRecord } from "@/lib/spaces/space-types";

export type EntityBacklinkRecord = {
  sourceEntityId: string;
  sourceEntityType: string;
  sourceTitle: string;
  propertyId?: string;
  propertyName?: string;
};

export type LocalEntityGraph = {
  nodes: Array<{
    id: string;
    title: string;
    type: string;
    depth: number;
  }>;
  edges: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    propertyId: string;
  }>;
};

function sameSpaceEntities(entities: readonly SpaceEntityRecord[], spaceId: string) {
  return new Map(
    entities.filter((entity) => entity.spaceId === spaceId).map((entity) => [entity.id, entity]),
  );
}

export function buildEntityBacklinks(input: {
  targetEntityId: string;
  targetSpaceId: string;
  entities: readonly SpaceEntityRecord[];
  relations: readonly SpaceRelationRecord[];
  propertyLabels?: Record<string, string>;
}): EntityBacklinkRecord[] {
  const entitiesById = sameSpaceEntities(input.entities, input.targetSpaceId);
  return input.relations
    .filter(
      (relation) =>
        relation.spaceId === input.targetSpaceId && relation.targetId === input.targetEntityId,
    )
    .flatMap((relation) => {
      const source = entitiesById.get(relation.sourceId);
      if (!source) return [];
      return [
        {
          sourceEntityId: source.id,
          sourceEntityType: source.type,
          sourceTitle: source.title,
          propertyId: relation.propertyId,
          propertyName: input.propertyLabels?.[relation.propertyId] ?? relation.propertyId,
        },
      ];
    });
}

export function buildLocalEntityGraph(input: {
  centerEntityId: string;
  spaceId: string;
  entities: readonly SpaceEntityRecord[];
  relations: readonly SpaceRelationRecord[];
}): LocalEntityGraph {
  const entitiesById = sameSpaceEntities(input.entities, input.spaceId);
  const center = entitiesById.get(input.centerEntityId);
  if (!center) return { nodes: [], edges: [] };

  const relatedRelations = input.relations.filter(
    (relation) =>
      relation.spaceId === input.spaceId &&
      (relation.sourceId === input.centerEntityId || relation.targetId === input.centerEntityId) &&
      entitiesById.has(relation.sourceId) &&
      entitiesById.has(relation.targetId),
  );
  const relatedIds = new Set<string>([input.centerEntityId]);
  for (const relation of relatedRelations) {
    relatedIds.add(relation.sourceId);
    relatedIds.add(relation.targetId);
  }

  const nodes = Array.from(relatedIds).flatMap((id) => {
    const entity = entitiesById.get(id);
    if (!entity) return [];
    return [
      {
        id: entity.id,
        title: entity.title,
        type: entity.type,
        depth: entity.id === input.centerEntityId ? 0 : 1,
      },
    ];
  });

  return {
    nodes,
    edges: relatedRelations.map((relation) => ({
      id: relation.id,
      sourceId: relation.sourceId,
      targetId: relation.targetId,
      propertyId: relation.propertyId,
    })),
  };
}
