"use client";

import { useLiveQuery } from "dexie-react-hooks";
import type { AppHeaderTab } from "@/components/app-header-tabs";
import { useWorkspace } from "@/components/space-controller";
import { WorkspaceObjectRenderer } from "@/components/workspace-object-renderer";
import { WorkspaceSidePanelRenderer } from "@/components/workspace-side-panel-renderer";
import { db } from "@/lib/db";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";
import { resolveWorkspaceTabTarget } from "@/lib/spaces/workspace-tab-target";

type WorkspaceTabLike = { id: string; label?: string };

export function getWorkspaceSidePanelPendingName(
  tabs: WorkspaceTabLike[] | undefined,
  value: string | undefined,
  fallback: string,
) {
  return tabs?.find((tab) => tab.id === value)?.label ?? fallback;
}

export function WorkspaceSidePanelContent() {
  const {
    createdEntities,
    mainValue,
    objectTypes,
    objectTypeRecords,
    objectTypeCollections,
    spaceId,
    sideTabs,
    sideValue,
    setActiveAction,
    setActiveEntityId,
    setMainTabs,
    setMainValue,
  } = useWorkspace();
  const entities: SpaceEntityRecord[] = createdEntities;
  const relations = useLiveQuery(
    () => (spaceId ? db.relations.where("spaceId").equals(spaceId).toArray() : []),
    [spaceId],
  );
  const target = resolveWorkspaceTabTarget(mainValue, {
    entityIds: entities.map((entity) => entity.id),
    objectTypeIds: objectTypes.map((type: { id: string }) => type.id),
    collections: objectTypeCollections,
  });
  const activeEntityId = target?.kind === "entity" ? target.id : undefined;
  const active = entities.find(
    (entity) => entity.id === activeEntityId && entity.spaceId === spaceId,
  );

  function openEntity(id: string) {
    const entity = entities.find(
      (candidate) => candidate.id === id && candidate.spaceId === spaceId,
    );
    if (!entity) return;
    setActiveAction(undefined);
    setActiveEntityId(id);
    setMainTabs((tabs: AppHeaderTab[]) =>
      tabs.some((tab) => tab.id === id)
        ? tabs
        : [...tabs, { id, label: entity.title || "Sem título", kind: "object", draggable: true }],
    );
    setMainValue(id);
  }

  const sideTarget = resolveWorkspaceTabTarget(sideValue, {
    entityIds: entities.map((entity) => entity.id),
    objectTypeIds: objectTypes.map((type: { id: string }) => type.id),
    collections: objectTypeCollections,
  });
  const sideEntity =
    sideTarget?.kind === "entity"
      ? entities.find((entity) => entity.id === sideTarget.id && entity.spaceId === spaceId)
      : undefined;
  if (sideEntity) {
    return (
      <WorkspaceObjectRenderer
        entity={sideEntity}
        objectType={objectTypeRecords.find(
          (type: { id: string }) => type.id === sideEntity.objectTypeId,
        )}
        tabName={sideEntity.title}
      />
    );
  }

  return (
    <WorkspaceSidePanelRenderer
      activeMainObjectTitle={active?.title}
      activeTabLabel={getWorkspaceSidePanelPendingName(sideTabs, sideValue, "Side panel")}
      sideValue={sideValue}
      activeEntityId={activeEntityId}
      spaceId={spaceId}
      entities={entities}
      relations={relations ?? []}
      onOpenEntity={openEntity}
    />
  );
}
