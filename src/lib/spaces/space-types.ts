import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import type { BaseEntity } from "@/types/schema";

export const PERSONAL_SPACE_ID = "personal";
export const LOCAL_ACCOUNT_ID = "local-account";
export const ACTIVE_SPACE_SETTING_ID = "activeSpaceId";

export type SpaceRecord = {
  id: string;
  accountId: string;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AppSettingRecord = {
  id: string;
  value: string;
};

export type SpaceObjectTypeRecord = WorkspaceStructure & {
  spaceId: string;
};

export type SpaceEntityRecord = BaseEntity & {
  spaceId: string;
  objectTypeId: string;
};

export type SpaceCollectionRecord = {
  id: string;
  spaceId: string;
  structureId: string;
  name: string;
};

export type SpaceTagRecord = {
  id: string;
  spaceId: string;
  name: string;
};

export type SpaceRelationRecord = {
  id: string;
  spaceId: string;
  sourceId: string;
  targetId: string;
  propertyId: string;
  createdAt: string;
};

export type SpaceMediaRecord = {
  id: string;
  spaceId: string;
  name: string;
  mimeType: string;
  blobKey?: string;
  createdAt: string;
  updatedAt: string;
};

export type SpaceSettingRecord = {
  id: string;
  spaceId: string;
  key: string;
  value: unknown;
  updatedAt: string;
};

export type SpaceTrashRecord = {
  id: string;
  spaceId: string;
  entityId: string;
  label: string;
  typeLabel: string;
  trashedAt: string;
  purgeAfter: string;
};
