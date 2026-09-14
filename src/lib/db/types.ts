import type { BlockEditorDocument } from "@/lib/editor/document-schema";
import type {
  ObjectIconName,
  ObjectIconTone,
  StructureLifecycleKind,
  StructureOwnership,
} from "@/lib/space-object-types";
import type { SpaceIconName, SpaceRecord } from "@/types/space";

export type { SpaceIconName, SpaceRecord } from "@/types/space";

export const LOCAL_ACCOUNT_ID = "local-account";
export const PERSONAL_SPACE_ID = "personal-space";
export const ENGINEERING_SPACE_ID = "engineering-space";
export const ACTIVE_SPACE_SETTING_ID = "activeSpaceId";

export const DEFAULT_SPACES: readonly SpaceRecord[] = [
  {
    id: PERSONAL_SPACE_ID,
    name: "Personal Space",
    description: "Personal notes, daily logs, journal, and knowledge capture.",
    icon: "user",
    color: "blue",
    accountId: LOCAL_ACCOUNT_ID,
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: ENGINEERING_SPACE_ID,
    name: "Engineering & Arch",
    description: "Architecture decisions, code patterns, specs, and systems research.",
    icon: "code",
    color: "emerald",
    accountId: LOCAL_ACCOUNT_ID,
    sortOrder: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

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
