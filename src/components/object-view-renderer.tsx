"use client";

import type {
  ObjectViewProps,
  ReadyObjectViewProps,
} from "@/components/object-view-types";
import {
  entityDescription,
  ObjectProperties,
  ObjectTypeLabel,
  OpenSurface,
} from "@/components/object-view-support";
import { cn } from "@/lib/utils";
import {
  createDefaultObjectViewConfig,
  type ObjectViewConfig,
  type ObjectViewKind,
} from "@/lib/workspace-object-views";

function InlineObjectView(props: ReadyObjectViewProps) {
  const { className, entity, labels, objectTypeLabels, onOpen, structures } =
    props;
  const title = entity.title.trim() || labels.untitledObject;
  return (
    <OpenSurface
      ariaLabel={labels.openObject(title)}
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-sm px-1 py-0.5 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      entityId={entity.id}
      onOpen={onOpen}
    >
      <ObjectTypeLabel
        entity={entity}
        labels={objectTypeLabels}
        structures={structures}
      />
      <span className="truncate">{title}</span>
    </OpenSurface>
  );
}

function LinkObjectView(props: ReadyObjectViewProps) {
  const { className, entity, labels, objectTypeLabels, onOpen, structures } =
    props;
  const title = entity.title.trim() || labels.untitledObject;
  return (
    <OpenSurface
      ariaLabel={labels.openObject(title)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border bg-card px-3 py-2 text-card-foreground shadow-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      entityId={entity.id}
      onOpen={onOpen}
    >
      <ObjectTypeLabel
        entity={entity}
        labels={objectTypeLabels}
        structures={structures}
      />
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {title}
      </span>
    </OpenSurface>
  );
}

function PageObjectView(props: ReadyObjectViewProps) {
  const { className, config, entity, labels, objectTypeLabels, structures } =
    props;
  const title = entity.title.trim() || labels.untitledObject;
  return (
    <article
      data-slot="object-view-page"
      data-show-backlinks={config.pageLayout.showBacklinks}
      data-show-table-of-contents={config.pageLayout.showTableOfContents}
      className={cn(
        "mx-auto grid w-full gap-6 px-4 py-8",
        config.pageLayout.contentWidth === "narrow" && "max-w-2xl",
        config.pageLayout.contentWidth === "standard" && "max-w-4xl",
        config.pageLayout.contentWidth === "wide" && "max-w-6xl",
        className,
      )}
    >
      {config.pageLayout.header !== "hidden" ? (
        <header
          className={cn(
            "grid gap-2",
            config.pageLayout.header === "cover" &&
              "rounded-xl bg-muted px-6 py-12",
          )}
        >
          <ObjectTypeLabel
            entity={entity}
            labels={objectTypeLabels}
            structures={structures}
          />
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        </header>
      ) : null}
      {config.pageLayout.properties === "top" ? (
        <ObjectProperties {...props} entity={entity} />
      ) : null}
      <div
        className={cn(
          "grid min-h-24 gap-8",
          config.pageLayout.properties === "side" &&
            "md:grid-cols-[minmax(0,1fr)_16rem]",
        )}
      >
        <div className="min-w-0 whitespace-pre-wrap text-sm leading-7">
          {entityDescription(entity)}
        </div>
        {config.pageLayout.properties === "side" ? (
          <aside>
            <ObjectProperties {...props} entity={entity} />
          </aside>
        ) : null}
      </div>
    </article>
  );
}

function CardObjectView(props: ReadyObjectViewProps) {
  const {
    className,
    config,
    entity,
    labels,
    objectTypeLabels,
    onOpen,
    structures,
  } = props;
  const title = entity.title.trim() || labels.untitledObject;
  const description = entityDescription(entity);
  return (
    <OpenSurface
      ariaLabel={labels.openObject(title)}
      className={cn(
        "grid w-full gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-xs hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        config.kind === "wide-card" &&
          "sm:grid-cols-[minmax(0,1fr)_14rem] sm:gap-6",
        config.kind === "embed" && "bg-muted/40 shadow-none",
        className,
      )}
      entityId={entity.id}
      onOpen={onOpen}
    >
      <div className="min-w-0 space-y-2">
        <ObjectTypeLabel
          entity={entity}
          labels={objectTypeLabels}
          structures={structures}
        />
        <h2 className="truncate text-base font-semibold">{title}</h2>
        {description ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <ObjectProperties {...props} entity={entity} />
    </OpenSurface>
  );
}

function ObjectView(props: ObjectViewProps) {
  if (!props.entity) {
    return (
      <div
        role="status"
        className={cn(
          "rounded-md border border-dashed p-3 text-sm text-muted-foreground",
          props.className,
        )}
      >
        {props.labels.missingObject}
      </div>
    );
  }
  const ready = { ...props, entity: props.entity };
  if (props.config.kind === "inline") return <InlineObjectView {...ready} />;
  if (props.config.kind === "link-block") return <LinkObjectView {...ready} />;
  if (props.config.kind === "page") return <PageObjectView {...ready} />;
  return <CardObjectView {...ready} />;
}

function objectConfig(
  kind: ObjectViewKind,
  visiblePropertyIds: readonly string[],
): ObjectViewConfig {
  return {
    ...createDefaultObjectViewConfig(kind),
    visiblePropertyIds,
  };
}

export { ObjectView, objectConfig };
