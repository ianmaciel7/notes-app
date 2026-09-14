import type { SpaceTagRecord } from "@/lib/domain/records";
import type { KnowledgeDatabase } from "../schema";

export class TagRepository {
  constructor(private readonly db: KnowledgeDatabase) {}

  async listTags(spaceId: string): Promise<SpaceTagRecord[]> {
    return this.db.tags.where("spaceId").equals(spaceId).toArray();
  }

  async getTag(spaceId: string, id: string): Promise<SpaceTagRecord | undefined> {
    return this.db.tags.get([spaceId, id]);
  }

  async findByName(spaceId: string, name: string): Promise<SpaceTagRecord | undefined> {
    const trimmed = name.trim().toLowerCase();
    return this.db.tags.where("[spaceId+name]").equals([spaceId, trimmed]).first();
  }

  async createTag(spaceId: string, name: string): Promise<SpaceTagRecord> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Tag name cannot be empty.");

    const existing = await this.findByName(spaceId, trimmed);
    if (existing) return existing;

    const id = `tag-${crypto.randomUUID()}`;
    const record: SpaceTagRecord = {
      spaceId,
      id,
      name: trimmed,
    };

    await this.db.tags.put(record);
    return record;
  }

  async findOrCreateTag(spaceId: string, name: string): Promise<SpaceTagRecord> {
    return this.createTag(spaceId, name);
  }

  async deleteTag(spaceId: string, id: string): Promise<void> {
    await this.db.tags.delete([spaceId, id]);
  }
}
