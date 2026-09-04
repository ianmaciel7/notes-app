import Dexie, { type EntityTable, type Table } from "dexie";

import type {
  AppSettingRecord,
  SpaceCollectionRecord,
  SpaceEntityRecord,
  SpaceMediaRecord,
  SpaceObjectTypeRecord,
  SpaceRecord,
  SpaceRelationRecord,
  SpaceSettingRecord,
  SpaceTagRecord,
  SpaceTrashRecord,
} from "@/lib/spaces/space-types";

export class KnowledgeDatabase extends Dexie {
  spaces!: EntityTable<SpaceRecord, "id">;
  appSettings!: EntityTable<AppSettingRecord, "id">;
  objectTypes!: Table<SpaceObjectTypeRecord, [string, string]>;
  entities!: Table<SpaceEntityRecord, [string, string]>;
  collections!: Table<SpaceCollectionRecord, [string, string]>;
  tags!: Table<SpaceTagRecord, [string, string]>;
  relations!: Table<SpaceRelationRecord, [string, string]>;
  media!: Table<SpaceMediaRecord, [string, string]>;
  spaceSettings!: Table<SpaceSettingRecord, [string, string]>;
  trash!: Table<SpaceTrashRecord, [string, string]>;

  constructor(name = "KnowledgeOS_DB") {
    super(name);
    this.version(1).stores({
      spaces: "id, accountId, sortOrder, [accountId+sortOrder], name, createdAt, updatedAt",
      appSettings: "id",
      objectTypes: "[spaceId+id], spaceId, id, ownership, lifecycleKind",
      entities:
        "[spaceId+id], spaceId, id, [spaceId+objectTypeId], objectTypeId, type, updatedAt, *tags",
      collections: "[spaceId+id], spaceId, id, [spaceId+structureId], structureId, name",
      tags: "[spaceId+id], spaceId, id, [spaceId+name], name",
      relations:
        "[spaceId+id], spaceId, id, [spaceId+sourceId], [spaceId+targetId], sourceId, targetId, propertyId",
      media: "[spaceId+id], spaceId, id, [spaceId+mimeType], mimeType, updatedAt",
      spaceSettings: "[spaceId+id], spaceId, id, [spaceId+key], key, updatedAt",
      trash: "[spaceId+id], spaceId, id, [spaceId+entityId], entityId, purgeAfter, trashedAt",
    });
  }
}

export function createKnowledgeDatabase(name?: string) {
  return new KnowledgeDatabase(name);
}

export const db = createKnowledgeDatabase();
