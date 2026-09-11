"use client";

import { resolveObjectComponents } from "@/components/objects/object-components";
import type { ObjectTypeDetailProps } from "@/components/objects/object-view-types";

export function ObjectDetailResolver({ entity, objectType, tabName }: ObjectTypeDetailProps) {
  // Keep support for records created before objectTypeId and type were aligned.
  const kind = entity.type === "weblink" ? "weblink" : entity.objectTypeId;
  const { Detail } = resolveObjectComponents(kind);
  const matchingType =
    objectType?.id === entity.objectTypeId && objectType.spaceId === entity.spaceId
      ? objectType
      : undefined;
  return (
    <Detail
      key={JSON.stringify([entity.spaceId, entity.id])}
      entity={entity}
      objectType={matchingType}
      tabName={tabName}
    />
  );
}
