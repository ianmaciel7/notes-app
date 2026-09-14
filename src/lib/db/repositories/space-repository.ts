import { validateCreateSpaceInput } from "@/lib/validations/space";
import type { CreateSpaceInput, SpaceRecord } from "@/types/space";
import type { KnowledgeDatabase } from "../schema";
import {
  ACTIVE_SPACE_SETTING_ID,
  DEFAULT_SPACES,
  LOCAL_ACCOUNT_ID,
  PERSONAL_SPACE_ID,
} from "../types";

export const SPACES_STORAGE_KEY = "notes_app_spaces_v1";
export const ACTIVE_SPACE_STORAGE_KEY = "notes_app_active_space_id_v1";

export class SpaceRepository {
  constructor(private readonly db: KnowledgeDatabase) {}

  private syncLocalStorage(spaces: SpaceRecord[], activeSpaceId?: string) {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      window.localStorage.setItem(SPACES_STORAGE_KEY, JSON.stringify(spaces));
      if (activeSpaceId) {
        window.localStorage.setItem(ACTIVE_SPACE_STORAGE_KEY, activeSpaceId);
      }
      window.dispatchEvent(new CustomEvent("spaces-updated", { detail: spaces }));
      if (activeSpaceId) {
        window.dispatchEvent(
          new CustomEvent("space-changed", { detail: { spaceId: activeSpaceId } }),
        );
      }
    } catch (e) {
      console.warn("Failed to sync spaces to localStorage:", e);
    }
  }

  async ensureDefaultSpaces(): Promise<void> {
    const count = await this.db.spaces.count();
    if (count === 0) {
      await this.db.transaction("rw", this.db.spaces, this.db.appSettings, async () => {
        for (const space of DEFAULT_SPACES) {
          await this.db.spaces.put(space);
        }
        await this.db.appSettings.put({
          id: ACTIVE_SPACE_SETTING_ID,
          value: PERSONAL_SPACE_ID,
        });
      });
      this.syncLocalStorage([...DEFAULT_SPACES], PERSONAL_SPACE_ID);
    }
  }

  async listSpaces(accountId = LOCAL_ACCOUNT_ID): Promise<SpaceRecord[]> {
    await this.ensureDefaultSpaces();
    const spaces = await this.db.spaces.where("accountId").equals(accountId).sortBy("sortOrder");
    return spaces;
  }

  async getSpace(id: string): Promise<SpaceRecord | undefined> {
    return this.db.spaces.get(id);
  }

  async getActiveSpaceId(): Promise<string> {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem(ACTIVE_SPACE_STORAGE_KEY);
      if (stored) return stored;
    }
    const setting = await this.db.appSettings.get(ACTIVE_SPACE_SETTING_ID);
    if (setting?.value) return setting.value;
    await this.ensureDefaultSpaces();
    return PERSONAL_SPACE_ID;
  }

  async setActiveSpace(spaceId: string): Promise<void> {
    const space = await this.db.spaces.get(spaceId);
    if (!space) {
      throw new Error(`Space with ID "${spaceId}" does not exist.`);
    }

    await this.db.appSettings.put({
      id: ACTIVE_SPACE_SETTING_ID,
      value: spaceId,
    });

    const spaces = await this.listSpaces();
    this.syncLocalStorage(spaces, spaceId);
  }

  async createSpace(input: CreateSpaceInput): Promise<SpaceRecord> {
    const validation = validateCreateSpaceInput(input);
    if (!validation.success || !validation.data) {
      throw new Error(validation.error || "Invalid space input.");
    }

    const currentSpaces = await this.listSpaces();
    const now = new Date().toISOString();
    const newSpace: SpaceRecord = {
      id: `space-${crypto.randomUUID()}`,
      name: validation.data.name,
      description: validation.data.description,
      icon: validation.data.icon || "folder",
      color: validation.data.color || "blue",
      accountId: LOCAL_ACCOUNT_ID,
      sortOrder: currentSpaces.length,
      createdAt: now,
      updatedAt: now,
    };

    await this.db.spaces.add(newSpace);
    const updated = await this.listSpaces();
    this.syncLocalStorage(updated);
    return newSpace;
  }

  async renameSpace(spaceId: string, name: string): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Space name cannot be empty.");
    const space = await this.db.spaces.get(spaceId);
    if (!space) throw new Error(`Space with ID "${spaceId}" not found.`);

    await this.db.spaces.update(spaceId, {
      name: trimmed,
      updatedAt: new Date().toISOString(),
    });

    const updated = await this.listSpaces();
    this.syncLocalStorage(updated);
  }

  async reorderSpaces(orderedIds: readonly string[]): Promise<void> {
    await this.db.transaction("rw", this.db.spaces, async () => {
      for (let i = 0; i < orderedIds.length; i++) {
        await this.db.spaces.update(orderedIds[i], {
          sortOrder: i,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    const updated = await this.listSpaces();
    this.syncLocalStorage(updated);
  }

  async deleteSpace(spaceId: string): Promise<{ fallbackSpaceId: string }> {
    const spaces = await this.listSpaces();
    if (spaces.length <= 1) {
      throw new Error("Cannot delete the only remaining space.");
    }

    const fallback = spaces.find((s) => s.id !== spaceId);
    if (!fallback) {
      throw new Error("No fallback space available.");
    }

    await this.db.transaction(
      "rw",
      [
        this.db.spaces,
        this.db.appSettings,
        this.db.objectTypes,
        this.db.entities,
        this.db.collections,
        this.db.tags,
        this.db.relations,
        this.db.media,
        this.db.spaceSettings,
        this.db.trash,
        this.db.syncMutations,
      ],
      async () => {
        // Cascade delete all space-scoped tables
        await this.db.objectTypes.where("spaceId").equals(spaceId).delete();
        await this.db.entities.where("spaceId").equals(spaceId).delete();
        await this.db.collections.where("spaceId").equals(spaceId).delete();
        await this.db.tags.where("spaceId").equals(spaceId).delete();
        await this.db.relations.where("spaceId").equals(spaceId).delete();
        await this.db.media.where("spaceId").equals(spaceId).delete();
        await this.db.spaceSettings.where("spaceId").equals(spaceId).delete();
        await this.db.trash.where("spaceId").equals(spaceId).delete();
        await this.db.syncMutations.where("spaceId").equals(spaceId).delete();

        await this.db.spaces.delete(spaceId);

        const currentActive = await this.getActiveSpaceId();
        if (currentActive === spaceId) {
          await this.db.appSettings.put({
            id: ACTIVE_SPACE_SETTING_ID,
            value: fallback.id,
          });
        }
      },
    );

    const remaining = await this.listSpaces();
    this.syncLocalStorage(remaining, fallback.id);

    return { fallbackSpaceId: fallback.id };
  }
}
