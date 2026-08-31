"use client";

import {
  entityDescription,
  entityValue,
  ObjectTypeLabel,
  OpenSurface,
} from "@/components/object-view-support";
import type {
  DataViewRendererProps,
  ProjectedDataViewProps,
} from "@/components/object-view-types";
import {
  workspaceListRowClass,
  workspaceListSurfaceClass,
} from "@/components/ui/workspace-surface";
import { cn } from "@/lib/utils";
import type { WorkspaceEntity } from "@/lib/workspace-objects";

function DataViewListRow({
  entity,
  props,
}: {
  readonly entity: WorkspaceEntity;
  readonly props: DataViewRendererProps;
}) {
  if (props.view.presentation.kind !== "list") return null;
  const presentation = props.view.presentation;
  const title = entity.title.trim() || props.labels.untitledObject;
  const description = entityDescription(entity);
  return (
    <OpenSurface
      ariaLabel={props.labels.openObject(title)}
      className={cn(workspaceListRowClass, "items-start gap-3 px-3 py-2")}
      entityId={entity.id}
      onOpen={props.onOpen}
    >
      {presentation.showIcon ? (
        <ObjectTypeLabel
          entity={entity}
          labels={props.objectTypeLabels}
          structures={props.structures}
        />
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{title}</span>
        {presentation.showDescription && description ? (
          <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </OpenSurface>
  );
}

function DataViewList(props: ProjectedDataViewProps) {
  const compact =
    props.view.presentation.kind === "list" &&
    props.view.presentation.density === "compact";
  return (
    <ul className={cn(workspaceListSurfaceClass, "divide-y divide-border")}>
      {props.entities.map((entity) => (
        <li key={entity.id} className={compact ? "p-1" : "p-2"}>
          <DataViewListRow entity={entity} props={props} />
        </li>
      ))}
    </ul>
  );
}

function DataViewTable(props: ProjectedDataViewProps) {
  if (props.view.presentation.kind !== "table") return null;
  const presentation = props.view.presentation;
  const columns = presentation.columns.filter((column) => column.visible);
  return (
    <div className="grid gap-4">
      <div className={cn(workspaceListSurfaceClass, "overflow-x-auto p-0")}>
        <table className="w-full min-w-xl border-collapse text-sm">
          <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "border-b px-3 py-2",
                    column.wrap ? "whitespace-normal" : "whitespace-nowrap",
                  )}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {props.propertyLabels?.[column.propertyId] ??
                    column.propertyId}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.entities.map((entity) => (
              <tr
                key={entity.id}
                className="border-b transition-colors duration-150 last:border-b-0 hover:bg-muted/40 motion-reduce:transition-none"
              >
                {columns.map((column, index) => (
                  <td
                    key={column.id}
                    className={cn(
                      "max-w-xs px-3",
                      column.wrap ? "whitespace-normal" : "whitespace-nowrap",
                      presentation.rowDensity === "compact" ? "py-1" : "py-2",
                    )}
                  >
                    {index === 0 && props.onOpen ? (
                      <button
                        type="button"
                        className="max-w-full truncate text-left font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={props.labels.openObject(
                          entity.title.trim() || props.labels.untitledObject,
                        )}
                        onClick={() => props.onOpen?.(entity.id)}
                      >
                        {entityValue(
                          entity,
                          column.propertyId,
                          props.objectTypeLabels,
                          props.structures,
                        )}
                      </button>
                    ) : (
                      <span className={cn("block", !column.wrap && "truncate")}>
                        {entityValue(
                          entity,
                          column.propertyId,
                          props.objectTypeLabels,
                          props.structures,
                        )}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {props.trailingContent}
    </div>
  );
}

export { DataViewList, DataViewTable };
