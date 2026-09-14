import "server-only";
import { DEFAULT_SPACES, type SpaceEntityRecord } from "@/lib/db/types";
import type { CreateSpaceInput, SpaceRecord } from "@/types/space";

export interface ServerStorageAdapter {
  listSpaces(accountId: string): Promise<SpaceRecord[]>;
  getSpace(spaceId: string): Promise<SpaceRecord | undefined>;
  createSpace(accountId: string, input: CreateSpaceInput): Promise<SpaceRecord>;
  deleteSpace(accountId: string, spaceId: string): Promise<{ fallbackSpaceId: string }>;
  listEntities(spaceId: string): Promise<SpaceEntityRecord[]>;
  getEntity(spaceId: string, entityId: string): Promise<SpaceEntityRecord | undefined>;
}

class InMemoryServerStorage implements ServerStorageAdapter {
  private spaces: Map<string, SpaceRecord> = new Map();
  private entities: Map<string, SpaceEntityRecord> = new Map();

  constructor() {
    for (const space of DEFAULT_SPACES) {
      this.spaces.set(space.id, { ...space });
    }
  }

  async listSpaces(accountId: string): Promise<SpaceRecord[]> {
    const list = Array.from(this.spaces.values()).filter((s) => s.accountId === accountId);
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getSpace(spaceId: string): Promise<SpaceRecord | undefined> {
    return this.spaces.get(spaceId);
  }

  async createSpace(accountId: string, input: CreateSpaceInput): Promise<SpaceRecord> {
    const currentSpaces = await this.listSpaces(accountId);
    const now = new Date().toISOString();
    const newSpace: SpaceRecord = {
      id: `space-${crypto.randomUUID()}`,
      name: input.name,
      description: input.description,
      icon: input.icon || "folder",
      color: input.color || "blue",
      accountId,
      sortOrder: currentSpaces.length,
      createdAt: now,
      updatedAt: now,
    };
    this.spaces.set(newSpace.id, newSpace);
    return newSpace;
  }

  async deleteSpace(accountId: string, spaceId: string): Promise<{ fallbackSpaceId: string }> {
    const currentSpaces = await this.listSpaces(accountId);
    if (currentSpaces.length <= 1) {
      throw new Error("Cannot delete the only remaining space.");
    }
    const fallback = currentSpaces.find((s) => s.id !== spaceId);
    if (!fallback) {
      throw new Error("No fallback space available.");
    }

    this.spaces.delete(spaceId);

    // Delete associated entities
    for (const [key, entity] of this.entities.entries()) {
      if (entity.spaceId === spaceId) {
        this.entities.delete(key);
      }
    }

    return { fallbackSpaceId: fallback.id };
  }

  async listEntities(spaceId: string): Promise<SpaceEntityRecord[]> {
    const list = Array.from(this.entities.values()).filter((e) => e.spaceId === spaceId);
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getEntity(spaceId: string, entityId: string): Promise<SpaceEntityRecord | undefined> {
    return this.entities.get(`${spaceId}:${entityId}`);
  }
}

let serverStorageInstance: ServerStorageAdapter | null = null;

export function getServerStorage(): ServerStorageAdapter {
  if (!serverStorageInstance) {
    serverStorageInstance = new InMemoryServerStorage();
  }
  return serverStorageInstance;
}
