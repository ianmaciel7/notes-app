"use client";

import { resolveObjectListSpaceId } from "@/app/_components/objects/list/object-list-model";
import { resolveObjectComponents } from "@/app/_components/objects/object-components";
import type { ObjectTypeListProps } from "@/app/_components/objects/object-view-types";

export function ObjectListResolver(props: ObjectTypeListProps) {
  const { List } = resolveObjectComponents(props.objectType.id);
  const spaceId = resolveObjectListSpaceId(props.entities, props.objectType);
  return <List key={JSON.stringify([spaceId, props.objectType.id])} {...props} />;
}
