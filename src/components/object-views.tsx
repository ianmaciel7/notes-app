"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { WorkspaceEntity } from "@/lib/workspace-objects";
import {
  DATA_VIEW_KINDS,
  OBJECT_VIEW_KINDS,
  createDefaultObjectViewConfig,
  type DataViewKind,
  type ObjectViewConfig,
  type ObjectViewKind,
  projectDataView,
  readWorkspaceEntityProperty,
  type WorkspaceDataView,
} from "@/lib/workspace-object-views";

export type ObjectViewLabels = {
  readonly emptyView: string;
  readonly missingObject: string;
  readonly openObject: (title: string) => string;
  readonly untitledObject: string;
};

type ObjectViewProps = {
  readonly className?: string;
  readonly config: ObjectViewConfig;
  readonly entity?: WorkspaceEntity | null;
  readonly labels: ObjectViewLabels;
  readonly onOpen?: (entityId: string) => void;
};

type DataViewRendererProps = {
  readonly className?: string;
  readonly entities: readonly WorkspaceEntity[];
  readonly labels: ObjectViewLabels;
  readonly onOpen?: (entityId: string) => void;
  readonly view: WorkspaceDataView;
};

type DataViewLayoutSwitcherProps = {
  readonly ariaLabel: string;
  readonly labels: Readonly<Record<DataViewKind, string>>;
  readonly onValueChange: (kind: DataViewKind) => void;
  readonly value: DataViewKind;
};

type ObjectViewLayoutSwitcherProps = {
  readonly ariaLabel: string;
  readonly labels: Readonly<Record<ObjectViewKind, string>>;
  readonly onValueChange: (kind: ObjectViewKind) => void;
  readonly value: ObjectViewKind;
};

function formatPropertyValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "✓" : "—";
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(parsed)
      ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
          new Date(parsed),
        )
      : value;
  }
  if (typeof value === "number") return new Intl.NumberFormat().format(value);
  if (Array.isArray(value)) return value.map(formatPropertyValue).join(", ");
  return JSON.stringify(value);
}

function entityDescription(entity: WorkspaceEntity): string {
  if ("description" in entity && typeof entity.description === "string") {
    return entity.description;
  }
  if (entity.kind === "task" || entity.kind === "url") return entity.body;
  if (entity.kind === "table") return entity.notes;
  if (entity.kind === "file") return entity.fileName;
  return "";
}

function visibleProperties(
  entity: WorkspaceEntity,
  config: ObjectViewConfig,
): readonly { id: string; value: string }[] {
  return config.visiblePropertyIds
    .filter((propertyId) => propertyId !== "title")
    .map((propertyId) => ({
      id: propertyId,
      value: formatPropertyValue(
        readWorkspaceEntityProperty(entity, propertyId),
      ),
    }));
}

function ObjectProperties({
  config,
  entity,
}: {
  readonly config: ObjectViewConfig;
  readonly entity: WorkspaceEntity;
}) {
  const properties = visibleProperties(entity, config);
  if (properties.length === 0) return null;
  return (
    <dl className="grid gap-2 text-xs text-muted-foreground">
      {properties.map((property) => (
        <div key={property.id} className="flex min-w-0 items-baseline gap-2">
          <dt className="shrink-0 font-medium">{property.id}</dt>
          <dd className="truncate">{property.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ObjectOpenSurface({
  ariaLabel,
  children,
  className,
  entityId,
  onOpen,
}: {
  readonly ariaLabel: string;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly entityId: string;
  readonly onOpen?: (entityId: string) => void;
}) {
  return onOpen ? (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn("text-left", className)}
      onClick={() => onOpen(entityId)}
    >
      {children}
    </button>
  ) : (
    <div className={className}>{children}</div>
  );
}

type ReadyObjectViewProps = Omit<ObjectViewProps, "entity"> & {
  readonly entity: WorkspaceEntity;
};

function MissingObjectView({
  className,
  labels,
}: Pick<ObjectViewProps, "className" | "labels">) {
  return (
    <div
      role="status"
      data-slot="object-view-missing"
      className={cn(
        "rounded-md border border-dashed p-3 text-sm text-muted-foreground",
        className,
      )}
    >
      {labels.missingObject}
    </div>
  );
}

function InlineObjectView({
  className,
  entity,
  labels,
  onOpen,
}: ReadyObjectViewProps) {
  const title = entity.title.trim() || labels.untitledObject;
  return (
    <ObjectOpenSurface
      ariaLabel={labels.openObject(title)}
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-sm px-1 py-0.5 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      entityId={entity.id}
      onOpen={onOpen}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />
      <span className="truncate">{title}</span>
    </ObjectOpenSurface>
  );
}

function LinkBlockObjectView({
  className,
  entity,
  labels,
  onOpen,
}: ReadyObjectViewProps) {
  const title = entity.title.trim() || labels.untitledObject;
  return (
    <ObjectOpenSurface
      ariaLabel={labels.openObject(title)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border bg-card px-3 py-2 text-card-foreground shadow-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      entityId={entity.id}
      onOpen={onOpen}
    >
      <span aria-hidden className="size-2 shrink-0 rounded-full bg-primary" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{title}</span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {entity.objectTypeId}
      </span>
    </ObjectOpenSurface>
  );
}

function PageObjectView({
  className,
  config,
  entity,
  labels,
}: ReadyObjectViewProps) {
  const title = entity.title.trim() || labels.untitledObject;
  const description = entityDescription(entity);
  const properties = <ObjectProperties config={config} entity={entity} />;
  return (
    <article
      data-slot="object-view-page"
      data-content-width={config.pageLayout.contentWidth}
      className={cn(
        "mx-auto flex w-full flex-col gap-6 px-4 py-8",
        config.pageLayout.contentWidth === "narrow" && "max-w-2xl",
        config.pageLayout.contentWidth === "standard" && "max-w-4xl",
        config.pageLayout.contentWidth === "wide" && "max-w-6xl",
        className,
      )}
    >
      {config.pageLayout.header !== "hidden" ? (
        <header
          className={cn(
            "space-y-2",
            config.pageLayout.header === "cover" &&
              "rounded-xl bg-muted px-6 py-12",
          )}
        >
          <p className="text-sm text-muted-foreground">{entity.objectTypeId}</p>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        </header>
      ) : null}
      {config.pageLayout.properties === "top" ? properties : null}
      <div
        className={cn(
          "grid min-h-24 gap-8",
          config.pageLayout.properties === "side" &&
            "md:grid-cols-[minmax(0,1fr)_16rem]",
        )}
      >
        <div className="min-w-0 whitespace-pre-wrap text-sm leading-7">
          {description}
        </div>
        {config.pageLayout.properties === "side" ? (
          <aside>{properties}</aside>
        ) : null}
      </div>
    </article>
  );
}

function CardObjectView({
  className,
  config,
  entity,
  labels,
  onOpen,
}: ReadyObjectViewProps) {
  const title = entity.title.trim() || labels.untitledObject;
  const description = entityDescription(entity);
  const wide = config.kind === "wide-card";
  const embedded = config.kind === "embed";
  return (
    <ObjectOpenSurface
      ariaLabel={labels.openObject(title)}
      className={cn(
        "flex w-full flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-xs hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        wide && "sm:grid sm:grid-cols-[minmax(0,1fr)_14rem] sm:gap-6",
        embedded && "bg-muted/40 shadow-none",
        className,
      )}
      entityId={entity.id}
      onOpen={onOpen}
    >
      <div className="min-w-0 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {entity.objectTypeId}
        </p>
        <h2 className="truncate text-base font-semibold">{title}</h2>
        {description ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <ObjectProperties config={config} entity={entity} />
    </ObjectOpenSurface>
  );
}

function ObjectView(props: ObjectViewProps) {
  if (!props.entity) return <MissingObjectView {...props} />;
  const readyProps = { ...props, entity: props.entity };
  if (props.config.kind === "inline") return <InlineObjectView {...readyProps} />;
  if (props.config.kind === "link-block") {
    return <LinkBlockObjectView {...readyProps} />;
  }
  if (props.config.kind === "page") return <PageObjectView {...readyProps} />;
  return <CardObjectView {...readyProps} />;
}

function createObjectConfig(
  kind: ObjectViewKind,
  visiblePropertyIds: readonly string[],
): ObjectViewConfig {
  return {
    ...createDefaultObjectViewConfig(kind),
    visiblePropertyIds,
  };
}

function DataViewList({
  entities,
  labels,
  onOpen,
  view,
}: Omit<DataViewRendererProps, "className">) {
  const compact =
    view.presentation.kind === "list" &&
    view.presentation.density === "compact";
  return (
    <ul className="divide-y rounded-md border bg-card">
      {entities.map((entity) => (
        <li key={entity.id} className={cn(compact ? "p-1" : "p-2")}>
          <ObjectView
            config={createObjectConfig(
              "link-block",
              view.presentation.visiblePropertyIds,
            )}
            entity={entity}
            labels={labels}
            onOpen={onOpen}
          />
        </li>
      ))}
    </ul>
  );
}

function DataViewTable({
  entities,
  labels,
  onOpen,
  view,
}: Omit<DataViewRendererProps, "className">) {
  if (view.presentation.kind !== "table") return null;
  const presentation = view.presentation;
  const columns = presentation.columns.filter((column) => column.visible);
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full min-w-xl border-collapse text-sm">
        <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className="border-b px-3 py-2 font-medium"
                style={column.width ? { width: column.width } : undefined}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entities.map((entity) => (
            <tr
              key={entity.id}
              className="border-b last:border-b-0 hover:bg-muted/40"
            >
              {columns.map((column, columnIndex) => (
                <td
                  key={column.id}
                  className={cn(
                    "max-w-xs px-3",
                    presentation.rowDensity === "compact" ? "py-1" : "py-2",
                  )}
                >
                  {columnIndex === 0 && onOpen ? (
                    <button
                      type="button"
                      className="max-w-full truncate text-left font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={labels.openObject(
                        entity.title.trim() || labels.untitledObject,
                      )}
                      onClick={() => onOpen(entity.id)}
                    >
                      {formatPropertyValue(
                        readWorkspaceEntityProperty(entity, column.propertyId),
                      )}
                    </button>
                  ) : (
                    <span className="block truncate">
                      {formatPropertyValue(
                        readWorkspaceEntityProperty(entity, column.propertyId),
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
  );
}

function DataViewGallery({
  entities,
  labels,
  onOpen,
  view,
}: Omit<DataViewRendererProps, "className">) {
  if (view.presentation.kind !== "gallery") return null;
  const presentation = view.presentation;
  return (
    <div
      className={cn(
        "grid gap-3",
        presentation.cardSize === "small" &&
          "grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]",
        presentation.cardSize === "medium" &&
          "grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]",
        presentation.cardSize === "large" &&
          "grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]",
      )}
    >
      {entities.map((entity) => (
        <ObjectView
          key={entity.id}
          config={createObjectConfig(
            "small-card",
            view.presentation.visiblePropertyIds,
          )}
          entity={entity}
          labels={labels}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

function DataViewWall({
  entities,
  labels,
  onOpen,
  view,
}: Omit<DataViewRendererProps, "className">) {
  if (view.presentation.kind !== "wall") return null;
  const presentation = view.presentation;
  return (
    <div
      className={cn(
        "columns-1 gap-3 sm:columns-2",
        presentation.columnWidth === "narrow" && "lg:columns-4",
        presentation.columnWidth === "standard" && "lg:columns-3",
        presentation.columnWidth === "wide" && "lg:columns-2",
      )}
    >
      {entities.map((entity) => (
        <ObjectView
          key={entity.id}
          className="mb-3 break-inside-avoid"
          config={createObjectConfig(
            "small-card",
            view.presentation.visiblePropertyIds,
          )}
          entity={entity}
          labels={labels}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

function DataViewEmbed({
  entities,
  labels,
  onOpen,
  view,
}: Omit<DataViewRendererProps, "className">) {
  if (view.presentation.kind !== "embed") return null;
  const presentation = view.presentation;
  return (
    <div className="grid gap-3">
      {entities.map((entity) => (
        <ObjectView
          key={entity.id}
          config={createObjectConfig(
            presentation.objectViewKind,
            view.presentation.visiblePropertyIds,
          )}
          entity={entity}
          labels={labels}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

function DataViewLayout(props: Omit<DataViewRendererProps, "className">) {
  if (props.view.presentation.kind === "table") {
    return <DataViewTable {...props} />;
  }
  if (props.view.presentation.kind === "gallery") {
    return <DataViewGallery {...props} />;
  }
  if (props.view.presentation.kind === "wall") {
    return <DataViewWall {...props} />;
  }
  if (props.view.presentation.kind === "embed") {
    return <DataViewEmbed {...props} />;
  }
  return <DataViewList {...props} />;
}

function DataViewRenderer({
  className,
  entities,
  labels,
  onOpen,
  view,
}: DataViewRendererProps) {
  const projection = projectDataView(view, entities);
  if (projection.items.length === 0) {
    return (
      <div
        role="status"
        className={cn(
          "rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        {labels.emptyView}
      </div>
    );
  }

  if (projection.groups.length > 0) {
    return (
      <div className={cn("grid gap-6", className)}>
        {projection.groups.map((group) => (
          <section key={group.id} aria-labelledby={`${view.id}-${group.id}`}>
            <h2
              id={`${view.id}-${group.id}`}
              className="mb-2 text-sm font-semibold"
            >
              {group.label}
            </h2>
            <DataViewLayout
              entities={group.items}
              labels={labels}
              onOpen={onOpen}
              view={view}
            />
          </section>
        ))}
      </div>
    );
  }

  return (
    <div
      className={className}
      data-slot="data-view"
      data-view-kind={view.presentation.kind}
    >
      <DataViewLayout
        entities={projection.items}
        labels={labels}
        onOpen={onOpen}
        view={view}
      />
    </div>
  );
}

function DataViewLayoutSwitcher({
  ariaLabel,
  labels,
  onValueChange,
  value,
}: DataViewLayoutSwitcherProps) {
  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap gap-1 rounded-md border bg-muted/40 p-1"
    >
      {DATA_VIEW_KINDS.map((kind) => (
        <button
          key={kind}
          type="button"
          aria-pressed={value === kind}
          className={cn(
            "rounded px-2 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === kind
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => onValueChange(kind)}
        >
          {labels[kind]}
        </button>
      ))}
    </div>
  );
}

function ObjectViewLayoutSwitcher({
  ariaLabel,
  labels,
  onValueChange,
  value,
}: ObjectViewLayoutSwitcherProps) {
  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap gap-1 rounded-md border bg-muted/40 p-1"
    >
      {OBJECT_VIEW_KINDS.map((kind) => (
        <button
          key={kind}
          type="button"
          aria-pressed={value === kind}
          className={cn(
            "rounded px-2 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === kind
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => onValueChange(kind)}
        >
          {labels[kind]}
        </button>
      ))}
    </div>
  );
}

export {
  DataViewLayoutSwitcher,
  DataViewRenderer,
  ObjectView,
  ObjectViewLayoutSwitcher,
};
