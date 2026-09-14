import type { BlockEditorDocument } from "@/lib/editor/document-schema";
import type {
  ObjectIconName,
  ObjectIconTone,
  SpaceIconName,
  StructureLifecycleKind,
  StructureOwnership,
} from "@/lib/space-object-types";

export type {
  ObjectIconName,
  ObjectIconTone,
  SpaceIconName,
  StructureLifecycleKind,
  StructureOwnership,
};

export interface SpaceRecord {
  id: string;
  name: string;
  description?: string;
  icon: SpaceIconName;
  color: ObjectIconTone;
  accountId: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettingRecord {
  id: string;
  value: string;
}

export interface PropertyDefinition {
  id: string;
  name: string;
  ownership: "default" | "normal" | "system";
  valueType: string;
  writable: boolean;
  multiple: boolean;
  targetStructureIds?: readonly string[];
  inversePropertyDefinitionId?: string;
}

export interface SpaceObjectTypeRecord {
  spaceId: string;
  id: string;
  ownership: StructureOwnership;
  singularName: string;
  pluralName: string;
  iconName: ObjectIconName;
  tone: ObjectIconTone;
  lifecycleKind: StructureLifecycleKind;
  propertyDefinitions: readonly PropertyDefinition[];
  collectionIds: readonly string[];
  presentation: {
    defaultView: "gallery" | "list" | "table" | "wall";
    availableViews: readonly ("gallery" | "list" | "table" | "wall")[];
    smallCardVisiblePropertyIds?: readonly string[];
  };
}

export type InboxStatus = "inbox" | "triaged" | "archived";
export type CaptureSource =
  | "manual"
  | "web_clipper"
  | "readwise"
  | "telegram"
  | "whatsapp"
  | "email"
  | "raycast"
  | "mcp_api";

export interface EntityRelation {
  propertyId: string;
  propertyName?: string;
  targetEntityId: string;
  targetEntityType?: string;
  createdAt: string;
}

export interface SpaceEntityRecord {
  spaceId: string;
  id: string;
  objectTypeId: string;
  type: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  icon?: string;
  coverImage?: string;
  document?: BlockEditorDocument;
  blocks?: unknown[];
  tags: string[];
  relations: EntityRelation[];
  collections?: string[];
  properties: Record<string, unknown>;
  inboxStatus?: InboxStatus;
  captureSource?: CaptureSource;
  captureMetadata?: Record<string, unknown>;
  _syncStatus?: "synced" | "pending" | "conflict";
  [key: string]: unknown;
}

export interface SpaceCollectionRecord {
  spaceId: string;
  id: string;
  structureId: string;
  name: string;
}

export interface SpaceTagRecord {
  spaceId: string;
  id: string;
  name: string;
}

export interface SpaceRelationRecord {
  spaceId: string;
  id: string;
  sourceId: string;
  targetId: string;
  propertyId: string;
  createdAt: string;
}

export interface SpaceMediaRecord {
  spaceId: string;
  id: string;
  name: string;
  mimeType: string;
  blobKey?: string;
  data?: Blob;
  createdAt: string;
  updatedAt: string;
}

export interface SpaceSettingRecord {
  spaceId: string;
  id: string;
  key: string;
  value: unknown;
  updatedAt: string;
}

export interface SpaceTrashRecord {
  spaceId: string;
  id: string;
  entityId: string;
  label: string;
  typeLabel: string;
  trashedAt: string;
  purgeAfter: string;
  entitySnapshot?: SpaceEntityRecord;
  relationSnapshots?: SpaceRelationRecord[];
}

export interface SyncMutationRecord {
  id: string;
  spaceId: string;
  entityId: string;
  entityType: string;
  operation: "set" | "delete";
  status: "pending" | "syncing" | "synced" | "failed";
  payload?: unknown;
  error?: string;
  retryCount?: number;
  createdAt: string;
  updatedAt: string;
}
