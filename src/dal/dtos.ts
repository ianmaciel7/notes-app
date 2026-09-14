import type { SpaceEntityRecord, SpaceRecord } from "@/lib/db/types";
import type { EntityDTO, SpaceDTO, UserDTO } from "@/types/dtos";

export type { EntityDTO, SpaceDTO, UserDTO };

export function toSpaceDTO(record: SpaceRecord, viewerAccountId: string): SpaceDTO {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    icon: record.icon,
    color: record.color,
    sortOrder: record.sortOrder,
    isOwner: record.accountId === viewerAccountId,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function toEntityDTO(record: SpaceEntityRecord): EntityDTO {
  return {
    id: record.id,
    spaceId: record.spaceId,
    objectTypeId: record.objectTypeId,
    type: record.type,
    title: record.title,
    icon: record.icon,
    coverImage: record.coverImage,
    tags: [...record.tags],
    inboxStatus: record.inboxStatus,
    properties: { ...record.properties },
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}
