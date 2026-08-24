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
  if (projection.items.length === 0) {
    return (
      <div
        role="status"
        className={cn(
          "rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground",
          props.className,
        )}
      >
        {props.labels.emptyView}
      </div>
    );
  }
  if (projection.groups.length === 0) {
    return <DataViewBody {...props} entities={projection.items} />;
  }
  return (
    <div className={cn("grid gap-6", props.className)}>
      {projection.groups.map((group) => (
        <section key={group.id} aria-labelledby={`${props.view.id}-${group.id}`}>
          <h2
            id={`${props.view.id}-${group.id}`}
            className="mb-2 text-sm font-semibold"
          >
            {props.objectTypeLabels?.[group.id] ?? group.label}
          </h2>
          <DataViewBody {...props} entities={group.items} />
        </section>
      ))}
    </div>
  );
}

export { DataViewRenderer };
