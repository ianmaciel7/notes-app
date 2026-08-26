"use client";

import { DataViewCards } from "@/components/data-view-cards";
import {
  DataViewList,
  DataViewTable,
} from "@/components/data-view-list-table";
import type {
  DataViewRendererProps,
  ProjectedDataViewProps,
} from "@/components/object-view-types";
import {
  WorkspaceEmptyState,
  workspaceSectionTitleClass,
} from "@/components/ui/workspace-surface";
import { cn } from "@/lib/utils";
import { projectDataView } from "@/lib/workspace-object-views";

function DataViewBody(props: ProjectedDataViewProps) {
  if (props.view.presentation.kind === "table") {
    return <DataViewTable {...props} />;
  }
  if (props.view.presentation.kind === "list") {
    return <DataViewList {...props} />;
  }
  return <DataViewCards {...props} />;
}

function DataViewRenderer(props: DataViewRendererProps) {
  const projection = projectDataView(props.view, props.entities);
  if (
    projection.items.length === 0 &&
    props.view.presentation.kind === "table"
  ) {
    return <DataViewBody {...props} entities={projection.items} />;
  }
  if (projection.items.length === 0) {
    return (
      <WorkspaceEmptyState
        compact
        className={props.className}
        title={props.labels.emptyView}
      />
    );
  }
  if (projection.groups.length === 0) {
    return <DataViewBody {...props} entities={projection.items} />;
  }
  return (
    <div
      data-slot="data-view-groups"
      className={cn("grid gap-6", props.className)}
    >
      {projection.groups.map((group) => (
        <section key={group.id} aria-labelledby={`${props.view.id}-${group.id}`}>
          <h2
            id={`${props.view.id}-${group.id}`}
            className={cn(workspaceSectionTitleClass, "mb-2")}
          >
            {props.objectTypeLabels?.[group.id] ?? group.label}
          </h2>
          <DataViewBody
            {...props}
            entities={group.items}
            trailingContent={undefined}
          />
        </section>
      ))}
    </div>
  );
}

export { DataViewRenderer };
