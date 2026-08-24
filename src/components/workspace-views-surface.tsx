"use client";

import * as React from "react";

import {
  DataViewLayoutSwitcher,
  DataViewRenderer,
  type ObjectViewLabels,
} from "@/components/object-views";
import { AtomicNotesWorkspace } from "@/components/workspace-content";
import { useWorkspace } from "@/components/workspace-controller";
import { useWorkspaceViews } from "@/components/workspace-views-controller";
import type {
  DataViewKind,
  QueryDefinition,
  WorkspaceDataView,
} from "@/lib/workspace-object-views";

const LOCAL_WORKSPACE_ID = "local-workspace";
const OBJECT_TYPE_VIEW_CREATOR_ID = "object-type-view-surface";

const dataViewLabels: Readonly<Record<DataViewKind, string>> = {
  embed: "Embed",
  gallery: "Galeria",
  list: "Lista",
  table: "Tabela",
  wall: "Mural",
};

const objectViewLabels: ObjectViewLabels = {
  emptyView: "Nenhum objeto corresponde a esta visualização.",
  missingObject: "Este objeto não está mais disponível.",
  openObject: (title) => `Abrir ${title}`,
  untitledObject: "Sem título",
};

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
  const { createdEntities, mainValue, objectTypes, selectEntity } =
    useWorkspace();
  const {
    createWorkspaceDataView,
    dataViews,
    hydrationStatus,
    switchWorkspaceDataViewKind,
  } = useWorkspaceViews();
  const activeObjectType = objectTypes.find((item) => item.id === mainValue);
  const activeDataView = activeObjectType
    ? dataViews.find((view) =>
        isStructureDataView(view, activeObjectType.id),
      )
    : undefined;

  React.useEffect(() => {
    if (
      hydrationStatus === "loading" ||
      !activeObjectType ||
      activeDataView
    ) {
      return;
    }
    createWorkspaceDataView({
      creatorId: OBJECT_TYPE_VIEW_CREATOR_ID,
      name: activeObjectType.label,
      query: createStructureQuery(activeObjectType.id),
      workspaceId: LOCAL_WORKSPACE_ID,
    });
  }, [
    activeDataView,
    activeObjectType,
    createWorkspaceDataView,
    hydrationStatus,
  ]);

  if (!activeObjectType || !activeDataView) {
    return <AtomicNotesWorkspace />;
  }

  return (
    <section
      data-slot="workspace-views-surface"
      className="flex h-full min-h-0 flex-col"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Tipo de objeto</p>
          <h1 className="truncate text-lg font-semibold">
            {activeObjectType.label}
          </h1>
        </div>
        <DataViewLayoutSwitcher
          ariaLabel="Alterar visualização dos objetos"
          labels={dataViewLabels}
          value={activeDataView.presentation.kind}
          onValueChange={(kind) =>
            switchWorkspaceDataViewKind(activeDataView.id, kind)
          }
        />
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <DataViewRenderer
          entities={createdEntities}
          labels={objectViewLabels}
          onOpen={selectEntity}
          view={activeDataView}
        />
      </div>
    </section>
  );
}

export { WorkspaceViewsSurface };
