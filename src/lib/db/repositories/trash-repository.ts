import type { KnowledgeDatabase } from "../schema";
import type { SpaceEntityRecord, SpaceRelationRecord, SpaceTrashRecord } from "../types";

export class TrashRepository {
  constructor(private readonly db: KnowledgeDatabase) {}

  async moveToTrash(spaceId: string, entityId: string): Promise<SpaceTrashRecord> {
    const entity = await this.db.entities.get([spaceId, entityId]);
    if (!entity) {
      throw new Error(`Cannot trash entity "${entityId}": entity not found in space "${spaceId}".`);
    }

    const [outgoing, incoming] = await Promise.all([
      this.db.relations.where("[spaceId+sourceId]").equals([spaceId, entityId]).toArray(),
      this.db.relations.where("[spaceId+targetId]").equals([spaceId, entityId]).toArray(),
    ]);

    const incidentRelations: SpaceRelationRecord[] = [...outgoing, ...incoming];
    const now = new Date();
    const purgeDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days retention

    const trashRecord: SpaceTrashRecord = {
      spaceId,
      id: `trash-${crypto.randomUUID()}`,
      entityId,
      label: entity.title || "Untitled",
      typeLabel: entity.type || entity.objectTypeId,
      trashedAt: now.toISOString(),
      purgeAfter: purgeDate.toISOString(),
      entitySnapshot: structuredClone(entity),
      relationSnapshots: structuredClone(incidentRelations),
    };

    await this.db.transaction("rw", this.db.entities, this.db.relations, this.db.trash, async () => {
      // Remove incident relations from active graph
      for (const rel of incidentRelations) {
        await this.db.relations.delete([spaceId, rel.id]);
      }
      // Remove entity from active entities
      await this.db.entities.delete([spaceId, entityId]);
      // Save soft-delete tombstone
      await this.db.trash.put(trashRecord);
    });

    return trashRecord;
  }

  async restoreFromTrash(spaceId: string, trashId: string): Promise<SpaceEntityRecord> {
    const trash = await this.db.trash.get([spaceId, trashId]);
    if (!trash || !trash.entitySnapshot) {
      throw new Error(`Trash item "${trashId}" not found or contains no entity snapshot.`);
    }

    const restoredEntity: SpaceEntityRecord = {
      ...trash.entitySnapshot,
      updatedAt: new Date().toISOString(),
    };

    await this.db.transaction("rw", this.db.entities, this.db.relations, this.db.trash, async () => {
      // Restore entity
      await this.db.entities.put(restoredEntity);

      // Restore incident relations
      if (trash.relationSnapshots && trash.relationSnapshots.length > 0) {
        for (const rel of trash.relationSnapshots) {
          await this.db.relations.put(rel);
        }
      }

      // Remove tombstone from trash
      await this.db.trash.delete([spaceId, trashId]);
    });

    return restoredEntity;
  }

  async listTrash(spaceId: string): Promise<SpaceTrashRecord[]> {
    return this.db.trash.where("spaceId").equals(spaceId).reverse().sortBy("trashedAt");
  }

  async deletePermanently(spaceId: string, trashId: string): Promise<void> {
    await this.db.trash.delete([spaceId, trashId]);
  }

  async purgeExpiredTrash(spaceId: string, now = new Date()): Promise<number> {
    const expired = await this.db.trash
      .where("spaceId")
      .equals(spaceId)
      .filter((t) => new Date(t.purgeAfter) <= now)
      .toArray();

    await this.db.transaction("rw", this.db.trash, async () => {
      for (const item of expired) {
        await this.db.trash.delete([spaceId, item.id]);
      }
    });

    return expired.length;
  }
}
