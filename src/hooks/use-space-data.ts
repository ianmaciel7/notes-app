"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useTranslations } from "next-intl";
import * as React from "react";

import { presentWorkspaceObjectType } from "@/components/space-object-type-presenter";
import { useBootstrapSpace } from "@/hooks/use-bootstrap-space";
import { db } from "@/lib/db";
import { groupEntitiesByObjectType } from "@/lib/spaces/space-projections";
import { createSpaceRepository } from "@/lib/spaces/space-repository";
import { readSpaceSnapshot } from "@/lib/spaces/space-snapshot";
import { ACTIVE_SPACE_SETTING_ID, type SpaceRecord } from "@/lib/spaces/space-types";

export function useSpaceData() {
  const objectTypeName = useTranslations("workspace.objectTypeStudio.objectTypes");
  const objectTypePluralName = useTranslations("workspace.objectTypeStudio.objectTypePlurals");
  const repository = React.useMemo(() => createSpaceRepository(db), []);
  const { bootstrapped, bootstrapError } = useBootstrapSpace();

  const spacesQuery = useLiveQuery<SpaceRecord[]>(
    () => db.spaces.orderBy("sortOrder").toArray(),
    [],
  );
  const activeSpaceIdQuery = useLiveQuery<string | null>(
    async () => (await db.appSettings.get(ACTIVE_SPACE_SETTING_ID))?.value ?? null,
    [],
  );
  const activeSpaceId = activeSpaceIdQuery ?? null;

  const snapshotQuery = useLiveQuery(() => readSpaceSnapshot(db, activeSpaceId), [activeSpaceId]);
  const snapshot = snapshotQuery?.spaceId === activeSpaceId ? snapshotQuery : undefined;
  const spaces = spacesQuery ?? [];
  const objectTypeRecords = snapshot?.objectTypes ?? [];
  const entities = snapshot?.entities ?? [];
  const collections = snapshot?.collections ?? [];
  const tags = snapshot?.tags ?? [];
  const trash = snapshot?.trash ?? [];
  const pinnedEntityIds = snapshot?.pinnedEntityIds ?? [];
  const objectTypeOrder = Array.isArray(snapshot?.objectTypeOrder)
    ? snapshot.objectTypeOrder.filter((id): id is string => typeof id === "string")
    : [];

  const counts = React.useMemo(() => groupEntitiesByObjectType(entities), [entities]);
  const objectTypes = React.useMemo(
    () =>
      objectTypeRecords.map((record) => {
        const localizedLabels =
          record.ownership === "built-in"
            ? {
                plurals: { [record.id]: objectTypePluralName(record.id) },
                singulars: { [record.id]: objectTypeName(record.id) },
              }
            : undefined;

        return presentWorkspaceObjectType(record, counts[record.id] ?? 0, localizedLabels);
      }),
    [counts, objectTypeName, objectTypePluralName, objectTypeRecords],
  );
  const objectTypeCollections = React.useMemo(
    () => Object.fromEntries(collections.map((collection) => [collection.id, collection])),
    [collections],
  );
  const uiSpaces = React.useMemo(
    () => spaces.map((space) => ({ id: space.id, name: space.name, icon: "user" as const })),
    [spaces],
  );
  const trashItems = React.useMemo(
    () =>
      trash.map(({ id, label, purgeAfter, trashedAt, typeLabel }) => ({
        id,
        label,
        purgeAfter,
        trashedAt,
        typeLabel,
      })),
    [trash],
  );

  return {
    repository,
    ready: bootstrapped && !bootstrapError && Boolean(snapshot),
    error: bootstrapError,
    spaces: uiSpaces,
    spaceId: activeSpaceId,
    objectTypes,
    objectTypeRecords,
    createdEntities: entities,
    objectTypeCollections,
    pinnedEntityIds,
    objectTypeOrder,
    tags,
    trashItems,
  };
}
