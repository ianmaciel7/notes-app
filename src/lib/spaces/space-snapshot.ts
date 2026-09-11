import type { KnowledgeDatabase } from "@/lib/db";
import {
  createSpaceRepository,
  OBJECT_TYPE_ORDER_SETTING_KEY,
} from "@/lib/spaces/space-repository";

/** A single scoped read prevents hydration from mixing data from two Spaces. */
export async function readSpaceSnapshot(database: KnowledgeDatabase, spaceId: string | null) {
  if (!spaceId) return null;
  const repository = createSpaceRepository(database);
  const tables = [
    database.spaces,
    database.objectTypes,
    database.entities,
    database.collections,
    database.tags,
    database.trash,
    database.spaceSettings,
  ];
  return database.transaction("r", tables, async () => {
    if (!(await database.spaces.get(spaceId))) return null;
    const [objectTypes, entities, collections, tags, trash, pinnedEntityIds, objectTypeOrder] =
      await Promise.all([
        database.objectTypes.where("spaceId").equals(spaceId).toArray(),
        database.entities.where("spaceId").equals(spaceId).toArray(),
        database.collections.where("spaceId").equals(spaceId).toArray(),
        database.tags.where("spaceId").equals(spaceId).toArray(),
        database.trash.where("spaceId").equals(spaceId).toArray(),
        repository.listPinnedEntityIds(spaceId),
        repository.getSpaceSetting(spaceId, OBJECT_TYPE_ORDER_SETTING_KEY),
      ]);
    return {
      spaceId,
      objectTypes,
      entities,
      collections,
      tags,
      trash,
      pinnedEntityIds,
      objectTypeOrder,
    };
  });
}
