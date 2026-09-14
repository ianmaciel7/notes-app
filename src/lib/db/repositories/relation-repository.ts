import type { KnowledgeDatabase } from "../schema";
import type { SpaceRelationRecord } from "../types";

export class RelationRepository {
  constructor(private readonly db: KnowledgeDatabase) {}

  async createRelation(
    spaceId: string,
    sourceId: string,
    targetId: string,
    propertyId: string
  ): Promise<SpaceRelationRecord> {
    // Multi-tenant boundary check: both source and target must reside in the same space
    const [source, target] = await Promise.all([
      this.db.entities.get([spaceId, sourceId]),
      this.db.entities.get([spaceId, targetId]),
    ]);

    if (!source) {
      throw new Error(
        `Cannot link relation: source entity "${sourceId}" does not exist in space "${spaceId}".`
      );
    }
    if (!target) {
      throw new Error(
        `Cannot link relation: target entity "${targetId}" does not exist in space "${spaceId}".`
      );
    }

    const id = `rel-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const relation: SpaceRelationRecord = {
      spaceId,
      id,
      sourceId,
      targetId,
      propertyId,
      createdAt: now,
    };

    await this.db.relations.put(relation);

    // Also update source entity's relations array for fast client hydration
    const existingRelations = source.relations || [];
    if (!existingRelations.some((r) => r.targetEntityId === targetId && r.propertyId === propertyId)) {
      await this.db.entities.update([spaceId, sourceId], {
        relations: [
          ...existingRelations,
          {
            propertyId,
            targetEntityId: targetId,
            targetEntityType: target.type,
            createdAt: now,
          },
        ],
        updatedAt: now,
      });
    }

    return relation;
  }

  async listOutgoingRelations(spaceId: string, sourceId: string): Promise<SpaceRelationRecord[]> {
    return this.db.relations
      .where("[spaceId+sourceId]")
      .equals([spaceId, sourceId])
      .toArray();
  }

  async listIncomingBacklinks(spaceId: string, targetId: string): Promise<SpaceRelationRecord[]> {
    return this.db.relations
      .where("[spaceId+targetId]")
      .equals([spaceId, targetId])
      .toArray();
  }

  async deleteRelation(spaceId: string, id: string): Promise<void> {
    const relation = await this.db.relations.get([spaceId, id]);
    if (!relation) return;

    await this.db.relations.delete([spaceId, id]);

    // Remove from source entity relations array
    const source = await this.db.entities.get([spaceId, relation.sourceId]);
    if (source && source.relations) {
      const updated = source.relations.filter(
        (r) => !(r.targetEntityId === relation.targetId && r.propertyId === relation.propertyId)
      );
      await this.db.entities.update([spaceId, relation.sourceId], {
        relations: updated,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  async deleteRelationsForEntity(spaceId: string, entityId: string): Promise<SpaceRelationRecord[]> {
    const [outgoing, incoming] = await Promise.all([
      this.listOutgoingRelations(spaceId, entityId),
      this.listIncomingBacklinks(spaceId, entityId),
    ]);

    const all = [...outgoing, ...incoming];
    for (const rel of all) {
      await this.db.relations.delete([spaceId, rel.id]);
    }
    return all;
  }
}
