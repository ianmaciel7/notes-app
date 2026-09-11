"use client";

import { ObjectListControls } from "@/app/_components/objects/list/object-list-controls";
import { ObjectListHeading } from "@/app/_components/objects/list/object-list-heading";
import { ObjectListResults } from "@/app/_components/objects/list/object-list-results";
import { useObjectList } from "@/app/_components/objects/list/use-object-list";
import {
  ObjectList,
  ObjectListContent,
  ObjectListHeader,
  ObjectListToolbar,
} from "@/app/_components/objects/object-list";
import type { ObjectTypeListProps } from "@/app/_components/objects/object-view-types";

export function TravelList(props: ObjectTypeListProps) {
  const view = useObjectList(props);
  return (
    <ObjectList data-object-view="travel-list">
      <ObjectListHeader>
        <ObjectListHeading view={view} />
        {!view.headerCollapsed && (
          <ObjectListToolbar>
            <ObjectListControls view={view} />
          </ObjectListToolbar>
        )}
      </ObjectListHeader>
      <ObjectListContent>
        <ObjectListResults view={view} />
      </ObjectListContent>
    </ObjectList>
  );
}
