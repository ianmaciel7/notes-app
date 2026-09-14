import { createEmptyBlockDocument } from "@/lib/editor/document-schema";
import type { KnowledgeDatabase } from "../schema";
import type { SpaceEntityRecord } from "../types";
import { SyncMutationRepository } from "./sync-mutation-repository";
import { TrashRepository } from "./trash-repository";

export interface CreateEntityInput {
  id?: string;
  objectTypeId: string;
  type?: string;
  title: string;
  icon?: string;
  coverImage?: string;
  tags?: string[];
  properties?: Record<string, unknown>;
  inboxStatus?: SpaceEntityRecord["inboxStatus"];
  captureSource?: SpaceEntityRecord["captureSource"];
  captureMetadata?: Record<string, unknown>;
}

export interface EntityFilter {
  objectTypeId?: string;
  type?: string;
  tag?: string;
  inboxStatus?: SpaceEntityRecord["inboxStatus"];
  limit?: number;
}

export class EntityRepository {
  private readonly syncRepo: SyncMutationRepository;
  private readonly trashRepo: TrashRepository;

  constructor(private readonly db: KnowledgeDatabase) {
    this.syncRepo = new SyncMutationRepository(db);
    this.trashRepo = new TrashRepository(db);
  }

  async createEntity(spaceId: string, input: CreateEntityInput): Promise<SpaceEntityRecord> {
    const id = input.id || `ent-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const type = input.type || input.objectTypeId;

    const entity: SpaceEntityRecord = {
      spaceId,
      id,
      objectTypeId: input.objectTypeId,
      type,
      title: input.title.trim() || "Untitled",
      createdAt: now,
      updatedAt: now,
      icon: input.icon,
      coverImage: input.coverImage,
      document: createEmptyBlockDocument(),
      tags: input.tags || [],
      relations: [],
      properties: input.properties || {},
      inboxStatus: input.inboxStatus || "inbox",
      captureSource: input.captureSource || "manual",
      captureMetadata: input.captureMetadata,
      _syncStatus: "pending",
    };

    await this.db.transaction("rw", this.db.entities, this.db.syncMutations, async () => {
      await this.db.entities.put(entity);
      await this.syncRepo.enqueueMutation({
        spaceId,
        entityId: id,
        entityType: type,
        operation: "set",
        payload: entity,
      });
    });

    return entity;
  }

  async getEntity(spaceId: string, entityId: string): Promise<SpaceEntityRecord | undefined> {
    return this.db.entities.get([spaceId, entityId]);
  }

  async listEntities(spaceId: string, filter?: EntityFilter): Promise<SpaceEntityRecord[]> {
    let collection = this.db.entities.where("spaceId").equals(spaceId);

    if (filter?.objectTypeId) {
      collection = this.db.entities
        .where("[spaceId+objectTypeId]")
        .equals([spaceId, filter.objectTypeId]);
    }

    let results = await collection.reverse().sortBy("updatedAt");

    if (filter?.type && !filter.objectTypeId) {
      results = results.filter((e) => e.type === filter.type);
    }

    if (filter?.tag) {
      const tag = filter.tag;
      results = results.filter((e) => e.tags.includes(tag));
    }

    if (filter?.inboxStatus) {
      results = results.filter((e) => e.inboxStatus === filter.inboxStatus);
    }

    if (filter?.limit && filter.limit > 0) {
      return results.slice(0, filter.limit);
    }

    return results;
  }

  async updateEntity(
    spaceId: string,
    entityId: string,
    patch: Partial<Omit<SpaceEntityRecord, "spaceId" | "id" | "createdAt">>,
  ): Promise<SpaceEntityRecord> {
    const existing = await this.getEntity(spaceId, entityId);
    if (!existing) {
      throw new Error(`Entity "${entityId}" not found in space "${spaceId}".`);
    }

    const now = new Date().toISOString();
    const updated: SpaceEntityRecord = {
      ...existing,
      ...patch,
      updatedAt: now,
      _syncStatus: "pending",
    };

    await this.db.transaction("rw", this.db.entities, this.db.syncMutations, async () => {
      await this.db.entities.put(updated);
      await this.syncRepo.enqueueMutation({
        spaceId,
        entityId,
        entityType: updated.type,
        operation: "set",
        payload: updated,
      });
    });

    return updated;
  }

  async deleteEntity(spaceId: string, entityId: string) {
    const entity = await this.getEntity(spaceId, entityId);
    if (!entity) return;

    // Graph-safe soft deletion via TrashRepository
    const trashRecord = await this.trashRepo.moveToTrash(spaceId, entityId);

    // Enqueue delete mutation for outbox sync
    await this.syncRepo.enqueueMutation({
      spaceId,
      entityId,
      entityType: entity.type,
      operation: "delete",
    });

    return trashRecord;
  }

  async hardDeleteEntity(spaceId: string, entityId: string): Promise<void> {
    const entity = await this.getEntity(spaceId, entityId);
    if (!entity) return;

    await this.db.transaction(
      "rw",
      this.db.entities,
      this.db.relations,
      this.db.syncMutations,
      async () => {
        // Delete outgoing & incoming relations
        await this.db.relations.where("[spaceId+sourceId]").equals([spaceId, entityId]).delete();
        await this.db.relations.where("[spaceId+targetId]").equals([spaceId, entityId]).delete();
        await this.db.entities.delete([spaceId, entityId]);
        await this.syncRepo.enqueueMutation({
          spaceId,
          entityId,
          entityType: entity.type,
          operation: "delete",
        });
      },
    );
  }
}
