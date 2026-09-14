import type { KnowledgeDatabase } from "../schema";
import type { SpaceCollectionRecord } from "../types";

export class CollectionRepository {
  constructor(private readonly db: KnowledgeDatabase) {}

  async listCollections(spaceId: string, structureId?: string): Promise<SpaceCollectionRecord[]> {
    if (structureId) {
      return this.db.collections
        .where("[spaceId+structureId]")
        .equals([spaceId, structureId])
        .toArray();
    }
    return this.db.collections.where("spaceId").equals(spaceId).toArray();
  }

  async getCollection(spaceId: string, id: string): Promise<SpaceCollectionRecord | undefined> {
    return this.db.collections.get([spaceId, id]);
  }

  async createCollection(
    spaceId: string,
    structureId: string,
    name: string,
  ): Promise<SpaceCollectionRecord> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Collection name cannot be empty.");

    const id = `col-${crypto.randomUUID()}`;
    const record: SpaceCollectionRecord = {
      spaceId,
      id,
      structureId,
      name: trimmed,
    };

    await this.db.collections.put(record);
    return record;
  }

  async renameCollection(spaceId: string, id: string, name: string): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Collection name cannot be empty.");

    await this.db.collections.update([spaceId, id], { name: trimmed });
  }

  async deleteCollection(spaceId: string, id: string): Promise<void> {
    await this.db.collections.delete([spaceId, id]);
  }
}
