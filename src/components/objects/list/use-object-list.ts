"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  defaultObjectListPreferences,
  type ObjectListPreferences,
  objectListPreferencesKey,
  resolveObjectListSpaceId,
  selectObjectListEntities,
} from "@/components/objects/list/object-list-model";
import {
  readObjectListPreferences,
  writeObjectListPreferences,
} from "@/components/objects/list/object-list-storage";
import type { ObjectTypeListProps } from "@/components/objects/object-view-types";

type PreferencesState = {
  key: string | null;
  value: ObjectListPreferences;
};

export function useObjectList(props: ObjectTypeListProps) {
  const { entities, objectType, tabName } = props;
  const spaceId = resolveObjectListSpaceId(entities, objectType);
  const key = spaceId ? objectListPreferencesKey(spaceId, objectType.id) : null;
  const [stored, setStored] = useState<PreferencesState>({
    key: null,
    value: { ...defaultObjectListPreferences },
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const preferences = stored.key === key ? stored.value : defaultObjectListPreferences;
  const listName = objectType.pluralName || tabName;
  const singularName = objectType.singularName || listName;

  useEffect(() => {
    const value = key ? readObjectListPreferences(key) : { ...defaultObjectListPreferences };
    setStored({ key, value });
    setSearchOpen(Boolean(value.query));
  }, [key]);

  useEffect(() => {
    if (key && stored.key === key) writeObjectListPreferences(key, stored.value);
  }, [key, stored]);

  const items = useMemo(
    () => selectObjectListEntities(entities, objectType, preferences),
    [entities, objectType, preferences],
  );

  function updatePreferences(update: Partial<ObjectListPreferences>) {
    setStored((current) => ({
      key,
      value: {
        ...(current.key === key ? current.value : defaultObjectListPreferences),
        ...update,
      },
    }));
  }

  return {
    ...props,
    onCreateEntity: spaceId ? props.onCreateEntity : undefined,
    headerCollapsed,
    items,
    listName,
    preferences,
    searchOpen,
    searchTriggerRef,
    setHeaderCollapsed,
    setSearchOpen,
    singularName,
    updatePreferences,
  };
}

export type ObjectListView = ReturnType<typeof useObjectList>;
