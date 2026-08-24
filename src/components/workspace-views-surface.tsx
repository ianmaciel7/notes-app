"use client";

import { useTranslations } from "next-intl";
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
const OBJECT_TYPE_VIEW_KINDS = [
  "list",
  "table",
] as const satisfies readonly DataViewKind[];

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
  const t = useTranslations("workspace");
  const {
    createdEntities,
    mainValue,
    objectTypes,
    selectEntity,
    structures,
  } = useWorkspace();
  const {
    createWorkspaceDataView,
    dataViews,
    hydrationStatus,
    switchWorkspaceDataViewKind,
  } = useWorkspaceViews();
  const activeStructure = structures.find((item) => item.id === mainValue);
  const activeObjectType = objectTypes.find((item) => item.id === mainValue);
  const activeDataView = activeStructure
    ? dataViews.find((view) => isStructureDataView(view, activeStructure.id))
    : undefined;
  const activeLabel = activeObjectType?.label ?? activeStructure?.pluralName;
  const objectTypeLabels = React.useMemo(
    () =>
      Object.fromEntries([
        ...structures.map((structure) => [
          structure.id,
          structure.singularName,
        ]),
        ...objectTypes.map((item) => [item.id, item.label]),
      ]) as Readonly<Record<string, string>>,
    [objectTypes, structures],
  );
  const objectViewLabels = React.useMemo<ObjectViewLabels>(
    () => ({
      emptyView: t("empty.title"),
      missingObject: t("objectTypeOverview.namedItemViewNotReady"),
      openObject: (title) => `${t("lifecycle.task.open")}: ${title}`,
      untitledObject: t("lifecycle.untitled"),
    }),
    [t],
  );
  const dataViewLabels = React.useMemo(
    () => ({
      list: t("actions.list"),
      table: t("objectTypeStudio.objectTypes.table"),
    }),
    [t],
  );
  const propertyLabels = React.useMemo(
    () => ({
      createdAt: t("lifecycle.query.created"),
      objectTypeId: t("footer.objectTypes"),
      title: t("fields.title"),
    }),
    [t],
  );

  React.useEffect(() => {
    if (hydrationStatus === "loading" || !activeStructure || activeDataView) {
      return;
    }
    createWorkspaceDataView({
      creatorId: OBJECT_TYPE_VIEW_CREATOR_ID,
      name: activeStructure.pluralName,
      query: createStructureQuery(activeStructure.id),
      workspaceId: LOCAL_WORKSPACE_ID,
    });
  }, [
    activeDataView,
    activeStructure,
    createWorkspaceDataView,
    hydrationStatus,
  ]);

  if (!activeStructure || !activeLabel || !activeDataView) {
    return <AtomicNotesWorkspace />;
  }

  return (
    <section
      data-slot="workspace-views-surface"
      className="flex h-full min-h-0 flex-col"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            {t("footer.objectTypes")}
          </p>
          <h1 className="truncate text-lg font-semibold">{activeLabel}</h1>
        </div>
        <DataViewLayoutSwitcher
          ariaLabel={t("actions.moreViews")}
          kinds={OBJECT_TYPE_VIEW_KINDS}
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
          objectTypeLabels={objectTypeLabels}
          onOpen={selectEntity}
          propertyLabels={propertyLabels}
          structures={structures}
          view={activeDataView}
        />
      </div>
    </section>
  );
}

export { WorkspaceViewsSurface };
