"use client";

import * as React from "react";

import { AtomicNotesWorkspace } from "@/components/workspace-content";
import { useWorkspace } from "@/components/workspace-controller";
import {
  canRenderWorkspaceObjectPage,
  WorkspaceObjectPageView,
} from "@/components/workspace-object-page-view";
import { WorkspaceObjectTypeView } from "@/components/workspace-object-type-view";
import { useWorkspaceViews } from "@/components/workspace-views-controller";
import {
  createDefaultDataViewPresentation,
  type QueryDefinition,
  type WorkspaceDataView,
} from "@/lib/workspace-object-views";

const LOCAL_WORKSPACE_ID = "local-workspace";
const OBJECT_TYPE_VIEW_CREATOR_ID = "object-type-view-surface-v2";

function isStructureDataView(
  view: WorkspaceDataView,
  structureId: string,
): boolean {
  return (
    view.creatorId === OBJECT_TYPE_VIEW_CREATOR_ID &&
    view.query.filters.some(
      (filter) =>
        filter.field === "structure" &&
        filter.operator === "is-any-of" &&
        filter.value.length === 1 &&
        filter.value[0] === structureId,
    )
  );
}

function createStructureQuery(structureId: string): QueryDefinition {
  return {
    filters: [
      {
        field: "structure",
        operator: "is-any-of",
        value: [structureId],
      },
    ],
    sorts: [{ direction: "descending", field: "createdAt" }],
    version: 1,
  };
}

function WorkspaceViewsSurface() {
  const {
    activeAction,
    createdEntities,
    mainValue,
    objectTypes,
    structures,
  } = useWorkspace();
  const { createWorkspaceDataView, dataViews, hydrationStatus } =
    useWorkspaceViews();
  const activeEntity = createdEntities.find((entity) => entity.id === mainValue);
  const activeStructure = structures.find((structure) => structure.id === mainValue);
  const activeObjectType = objectTypes.find((objectType) => objectType.id === mainValue);
  const activeDataView = activeStructure
    ? dataViews.find((view) => isStructureDataView(view, activeStructure.id))
    : undefined;

  React.useEffect(() => {
    if (hydrationStatus === "loading" || !activeStructure || activeDataView) {
      return;
    }
    createWorkspaceDataView({
      creatorId: OBJECT_TYPE_VIEW_CREATOR_ID,
      name: activeStructure.pluralName,
      presentation: createDefaultDataViewPresentation("gallery"),
      query: createStructureQuery(activeStructure.id),
      workspaceId: LOCAL_WORKSPACE_ID,
    });
  }, [
    activeDataView,
    activeStructure,
    createWorkspaceDataView,
    hydrationStatus,
  ]);

  if (activeAction) return <AtomicNotesWorkspace />;
  if (canRenderWorkspaceObjectPage(activeEntity)) {
    return <WorkspaceObjectPageView entity={activeEntity} />;
  }
  if (activeStructure && activeObjectType && activeDataView) {
    return (
      <WorkspaceObjectTypeView
        objectType={activeObjectType}
        structure={activeStructure}
        view={activeDataView}
      />
    );
  }
  return <AtomicNotesWorkspace />;
}

export { WorkspaceViewsSurface };
