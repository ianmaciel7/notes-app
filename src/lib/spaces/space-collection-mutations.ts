import type { KnowledgeDatabase } from "@/lib/db";
import { createCollectionId } from "@/lib/space-domain-identities";
import { createSyncQueue } from "@/lib/sync/sync-queue";

function copyName(name: string, names: readonly string[]) {
  let suffix = 1;
  let next = `${name} copy`;
  while (names.includes(next)) {
    suffix += 1;
    next = `${name} copy ${suffix}`;
  }
  return next;
}

export async function duplicateSpaceCollection(
  database: KnowledgeDatabase,
  spaceId: string,
  id: string,
) {
  const tables = [database.collections, database.entities, database.syncMutations];
  return database.transaction("rw", tables, async () => {
    const source = await database.collections.get([spaceId, id]);
    if (!source) throw new Error("Collection not found in this Space.");
    const existing = await database.collections.where("spaceId").equals(spaceId).toArray();
    const name = copyName(
      source.name,
      existing.map((collection) => collection.name),
    );
    const newId = createCollectionId(
      source.structureId,
      name,
      new Set(existing.map((collection) => collection.id)),
    );
    const copy = { ...source, id: newId, name };
    await database.collections.add(copy);
    const members = await database.entities
      .where("[spaceId+objectTypeId]")
      .equals([spaceId, source.structureId])
      .filter((entity) => entity.collections?.includes(id) === true)
      .toArray();
    const queue = createSyncQueue(database);
    for (const entity of members) {
      const updated = {
        ...entity,
        collections: [...(entity.collections ?? []), newId],
        updatedAt: new Date().toISOString(),
        _syncStatus: "pending" as const,
      };
      await database.entities.put(updated);
      await queue.enqueueEntityMutation({ entity: updated, operation: "set" });
    }
    return copy;
  });
}
