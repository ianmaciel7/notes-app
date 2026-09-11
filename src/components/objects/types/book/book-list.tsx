"use client";

import { ObjectListControls } from "@/components/objects/list/object-list-controls";
import { ObjectListHeading } from "@/components/objects/list/object-list-heading";
import { ObjectListResults } from "@/components/objects/list/object-list-results";
import { useObjectList } from "@/components/objects/list/use-object-list";
import {
  ObjectList,
  ObjectListContent,
  ObjectListHeader,
  ObjectListToolbar,
} from "@/components/objects/object-list";
import type { ObjectTypeListProps } from "@/components/objects/object-view-types";

export function BookList(props: ObjectTypeListProps) {
  const view = useObjectList(props);
  return (
    <ObjectList data-object-view="book-list">
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
