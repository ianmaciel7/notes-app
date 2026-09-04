"use client";

import { useLiveQuery } from "dexie-react-hooks";
import * as React from "react";

import { presentWorkspaceObjectType } from "@/components/workspace-object-type-presenter";
import { db } from "@/lib/db";
import { bootstrapWorkspace } from "@/lib/spaces/bootstrap-workspace";
import { groupEntitiesByObjectType } from "@/lib/spaces/space-projections";
import { createSpaceRepository } from "@/lib/spaces/space-repository";
import {
  ACTIVE_SPACE_SETTING_ID,
  type SpaceCollectionRecord,
  type SpaceEntityRecord,
  type SpaceObjectTypeRecord,
  type SpaceRecord,
  type SpaceTagRecord,
  type SpaceTrashRecord,
} from "@/lib/spaces/space-types";

export function useSpaceData() {
  const repository = React.useMemo(() => createSpaceRepository(db), []);
  const [bootstrapError, setBootstrapError] = React.useState<Error | null>(null);
  const [bootstrapped, setBootstrapped] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    void bootstrapWorkspace(db)
      .then(() => {
        if (!cancelled) setBootstrapped(true);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setBootstrapError(error instanceof Error ? error : new Error(String(error)));
          setBootstrapped(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const spaces = useLiveQuery<SpaceRecord[]>(
    () => db.spaces.orderBy("sortOrder").toArray(),
    [],
    [],
  );
  const activeSpaceId = useLiveQuery<string | null>(
    async () => (await db.appSettings.get(ACTIVE_SPACE_SETTING_ID))?.value ?? null,
    [],
    null,
  );
  const objectTypeRecords = useLiveQuery<SpaceObjectTypeRecord[]>(
    async () =>
      activeSpaceId
        ? await db.objectTypes.where("spaceId").equals(activeSpaceId).toArray()
        : [],
    [activeSpaceId],
    [],
  );
  const entities = useLiveQuery<SpaceEntityRecord[]>(
    async () =>
      activeSpaceId ? await db.entities.where("spaceId").equals(activeSpaceId).toArray() : [],
    [activeSpaceId],
    [],
  );
  const collections = useLiveQuery<SpaceCollectionRecord[]>(
    async () =>
      activeSpaceId
        ? await db.collections.where("spaceId").equals(activeSpaceId).toArray()
        : [],
    [activeSpaceId],
    [],
  );
  const tags = useLiveQuery<SpaceTagRecord[]>(
    async () =>
      activeSpaceId ? await db.tags.where("spaceId").equals(activeSpaceId).toArray() : [],
    [activeSpaceId],
    [],
  );
  const trash = useLiveQuery<SpaceTrashRecord[]>(
    async () =>
      activeSpaceId ? await db.trash.where("spaceId").equals(activeSpaceId).toArray() : [],
    [activeSpaceId],
    [],
  );

  const counts = React.useMemo(() => groupEntitiesByObjectType(entities), [entities]);
  const objectTypes = React.useMemo(
    () => objectTypeRecords.map((record) => presentWorkspaceObjectType(record, counts[record.id] ?? 0)),
    [counts, objectTypeRecords],
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
    ready: bootstrapped && !bootstrapError && activeSpaceId !== null,
    error: bootstrapError,
    spaces: uiSpaces,
    spaceId: activeSpaceId,
    objectTypes,
    objectTypeRecords,
    createdEntities: entities,
    objectTypeCollections,
    tags,
    trashItems,
  };
}
