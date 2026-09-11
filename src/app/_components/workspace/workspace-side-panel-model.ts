import type { SpaceEntityRecord, SpaceRelationRecord } from "@/lib/spaces/space-types";

export function getInspectorEntities(input: {
  entities: readonly SpaceEntityRecord[];
  relations: readonly SpaceRelationRecord[];
  activeEntityId?: string;
  spaceId?: string;
  mode: string;
}) {
  const entities = input.entities.filter((entity) => entity.spaceId === input.spaceId);
  const active = entities.find((entity) => entity.id === input.activeEntityId);
  if (!active) return [];
  if (input.mode === "relatedContent") {
    return entities.filter(
      (entity) => entity.id !== active.id && entity.tags.some((tag) => active.tags.includes(tag)),
    );
  }
  const backlinks = input.mode === "backlinks";
  const ids = new Set(
    input.relations
      .filter(
        (relation) =>
          relation.spaceId === input.spaceId &&
          (backlinks ? relation.targetId === active.id : relation.sourceId === active.id),
      )
      .map((relation) => (backlinks ? relation.sourceId : relation.targetId)),
  );
  return entities.filter((entity) => ids.has(entity.id));
}
