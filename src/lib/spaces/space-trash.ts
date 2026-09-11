import type { KnowledgeDatabase } from "@/lib/db";
import type { SpaceRelationRecord, SpaceTrashRecord } from "@/lib/spaces/space-types";
import { createSyncQueue } from "@/lib/sync/sync-queue";

async function restoreRelations(
  database: KnowledgeDatabase,
  spaceId: string,
  entityId: string,
  relations: readonly SpaceRelationRecord[],
) {
  const candidates = relations.filter(
    (relation) =>
      relation.spaceId === spaceId &&
      (relation.sourceId === entityId || relation.targetId === entityId),
  );
  for (const relation of candidates) {
    const [source, target, existing] = await Promise.all([
      database.entities.get([spaceId, relation.sourceId]),
      database.entities.get([spaceId, relation.targetId]),
      database.relations.get([spaceId, relation.id]),
    ]);
    if (source && target && !existing) await database.relations.add(relation);
  }
}

function recoverableSnapshot(record: SpaceTrashRecord | undefined, spaceId: string) {
  const snapshot = record?.entitySnapshot;
  if (!record || !snapshot) throw new Error("This trash entry has no recoverable snapshot.");
  if (snapshot.spaceId !== spaceId || snapshot.id !== record.entityId) {
    throw new Error("Trash snapshot does not belong to this Space.");
  }
  return snapshot;
}

export function createTrashOperations(database: KnowledgeDatabase) {
  const tables = [
    database.spaces,
    database.objectTypes,
    database.entities,
    database.relations,
    database.trash,
    database.syncMutations,
  ];
  const queue = createSyncQueue(database);

  async function trashEntity(spaceId: string, entityId: string, now = new Date()) {
    return database.transaction("rw", tables, async () => {
      const entity = await database.entities.get([spaceId, entityId]);
      if (!entity) throw new Error("Entity not found in this Space.");
      const objectType = await database.objectTypes.get([spaceId, entity.objectTypeId]);
      const relations = await database.relations
        .where("spaceId")
        .equals(spaceId)
        .filter((item) => item.sourceId === entityId || item.targetId === entityId)
        .toArray();
      const record: SpaceTrashRecord = {
        id: `trash-${crypto.randomUUID()}`,
        spaceId,
        entityId,
        label: entity.title,
        typeLabel: objectType?.singularName ?? entity.objectTypeId,
        trashedAt: now.toISOString(),
        purgeAfter: new Date(now.getTime() + 30 * 86400000).toISOString(),
        entitySnapshot: entity,
        relationSnapshots: relations,
      };
      await database.trash.add(record);
      await database.relations.bulkDelete(relations.map((item) => [spaceId, item.id]));
      await database.entities.delete([spaceId, entityId]);
      await queue.enqueueEntityMutation({ entity, operation: "delete", referenceDate: now });
      return record;
    });
  }

  async function restoreTrash(spaceId: string, trashId: string) {
    return database.transaction("rw", tables, async () => {
      const record = await database.trash.get([spaceId, trashId]);
      const snapshot = recoverableSnapshot(record, spaceId);
      if (
        !(await database.spaces.get(spaceId)) ||
        !(await database.objectTypes.get([spaceId, snapshot.objectTypeId]))
      ) {
        throw new Error("Restore the object's Space and type first.");
      }
      if (await database.entities.get([spaceId, snapshot.id])) {
        throw new Error("An object with this identity already exists. Nothing was overwritten.");
      }
      const entity = {
        ...snapshot,
        updatedAt: new Date().toISOString(),
        _syncStatus: "pending" as const,
      };
      await database.entities.add(entity);
      await restoreRelations(database, spaceId, entity.id, record?.relationSnapshots ?? []);
      await queue.enqueueEntityMutation({ entity, operation: "set" });
      await database.trash.delete([spaceId, trashId]);
      return entity;
    });
  }
  return { trashEntity, restoreTrash };
}
