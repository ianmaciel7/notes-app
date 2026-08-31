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
import {
  projectTableViewColumns,
  reorderTableViewColumns,
  setTableViewColumnVisibility,
  setTableViewColumnWidth,
  setTableViewColumnWrapping,
  type WorkspaceDataView,
} from "@/lib/workspace-object-views";
import type { WorkspaceEntity } from "@/lib/workspace-objects";

function commitTableUpdate(
  props: ProjectedDataViewProps,
  result: { readonly ok: true; readonly value: WorkspaceDataView } | { readonly ok: false },
) {
  if (!result.ok) return;
  props.onViewUpdate?.(props.view, { presentation: result.value.presentation });
}

function moveTableColumn(
  props: ProjectedDataViewProps,
  columnId: string,
  delta: -1 | 1,
) {
  if (props.view.presentation.kind !== "table") return;
  const ids = props.view.presentation.columns.map((column) => column.id);
  const index = ids.indexOf(columnId);
  const target = index + delta;
  if (index === -1 || target < 0 || target >= ids.length) return;
  const next = [...ids];
  const [column] = next.splice(index, 1);
  next.splice(target, 0, column);
  commitTableUpdate(props, reorderTableViewColumns(props.view, next));
}

function DataViewTableControls(props: ProjectedDataViewProps) {
  if (props.view.presentation.kind !== "table" || !props.structure) {
    return null;
  }
  const projected = projectTableViewColumns(props.view, props.structure);
  const columns = projected.ok
    ? projected.value
    : props.view.presentation.columns.map((column) => ({
        ...column,
        missing: false,
      }));
  return (
    <div
      data-slot="table-view-customization"
      className="grid gap-2 rounded-lg border bg-card p-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3"
    >
      {columns.map((column, index) => (
        <div
          key={column.id}
          data-missing={column.missing || undefined}
          className="grid gap-2 rounded-md border border-transparent bg-muted/30 p-2"
        >
          <label className="flex min-w-0 items-center gap-2">
            <input
              type="checkbox"
              checked={column.visible}
              onChange={(event) =>
                commitTableUpdate(
                  props,
                  setTableViewColumnVisibility(
                    props.view,
                    column.id,
                    event.currentTarget.checked,
                  ),
                )
              }
            />
            <span className="truncate text-foreground">
              {props.propertyLabels?.[column.propertyId] ?? column.label}
            </span>
          </label>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <label className="flex min-w-0 items-center gap-1">
              <span>{props.labels.wrapColumn}</span>
              <input
                type="checkbox"
                checked={column.wrap ?? false}
                onChange={(event) =>
                  commitTableUpdate(
                    props,
                    setTableViewColumnWrapping(
                      props.view,
                      column.id,
                      event.currentTarget.checked,
                    ),
                  )
                }
              />
            </label>
            <label className="flex min-w-0 items-center gap-1">
              <span>{props.labels.columnWidth}</span>
              <input
                type="number"
                min={96}
                step={8}
                value={column.width ?? ""}
                placeholder="auto"
                className="h-7 w-20 rounded-md border bg-background px-2 text-foreground"
                onChange={(event) => {
                  const width = Number(event.currentTarget.value);
                  if (!Number.isFinite(width) || width <= 0) return;
                  commitTableUpdate(
                    props,
                    setTableViewColumnWidth(props.view, column.id, width),
                  );
                }}
              />
            </label>
            <button
              type="button"
              className="rounded-md px-1.5 py-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
              disabled={index === 0}
              aria-label={props.labels.moveColumnLeft(column.label)}
              onClick={() => moveTableColumn(props, column.id, -1)}
            >
              ←
            </button>
            <button
              type="button"
              className="rounded-md px-1.5 py-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
              disabled={index === columns.length - 1}
              aria-label={props.labels.moveColumnRight(column.label)}
              onClick={() => moveTableColumn(props, column.id, 1)}
            >
              →
            </button>
          </div>
          {column.missing ? (
            <span className="text-[11px] text-destructive">
              {props.labels.missingColumn}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

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
      <DataViewTableControls {...props} />
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
