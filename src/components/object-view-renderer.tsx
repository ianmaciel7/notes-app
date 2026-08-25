"use client";

import { ObjectViewPreview } from "@/components/object-view-preview";
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
import type { WorkspaceEntity } from "@/lib/workspace-objects";
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
        "mx-auto grid w-full gap-6 px-10 pb-12 pt-24",
        config.pageLayout.contentWidth === "narrow" && "max-w-2xl",
        config.pageLayout.contentWidth === "standard" && "max-w-[50rem]",
        config.pageLayout.contentWidth === "wide" && "max-w-6xl",
        className,
      )}
    >
      {config.pageLayout.header !== "hidden" ? (
        <header
          className={cn(
            "grid gap-3",
            config.pageLayout.header === "cover" &&
              "rounded-xl bg-muted px-6 py-12",
          )}
        >
          <ObjectTypeLabel
            entity={entity}
            labels={objectTypeLabels}
            structures={structures}
            variant="chip"
          />
          <h1 className="text-[40px] font-bold leading-[44px] tracking-[-0.02em]">
            {title}
          </h1>
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
        <div className="min-w-0 whitespace-pre-wrap text-base leading-7">
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

function readEntityMetadata(entity: WorkspaceEntity): readonly string[] {
  const collections =
    "collections" in entity && Array.isArray(entity.collections)
      ? entity.collections
      : [];
  const tags = "tags" in entity && Array.isArray(entity.tags) ? entity.tags : [];
  return Array.from(new Set([...collections, ...tags].filter(Boolean))).slice(0, 4);
}

function CardMetadata({
  entity,
  fallbackLabel,
}: {
  readonly entity: WorkspaceEntity;
  readonly fallbackLabel?: string;
}) {
  const values = readEntityMetadata(entity);
  if (values.length === 0 && !fallbackLabel) return null;
  return (
    <span data-slot="object-view-card-metadata" className="mt-2 flex flex-wrap gap-1.5">
      {values.length > 0 ? (
        values.map((value) => (
          <span
            key={value}
            className="max-w-full truncate rounded-md border bg-muted/60 px-2 py-1 text-xs text-muted-foreground"
          >
            {value}
          </span>
        ))
      ) : (
        <span className="text-xs italic text-muted-foreground">
          {fallbackLabel}
        </span>
      )}
    </span>
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
  const wide = config.kind === "wide-card";
  return (
    <OpenSurface
      ariaLabel={labels.openObject(title)}
      className={cn(
        "group flex min-h-[25rem] w-full flex-col rounded-xl border bg-card p-3 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.02)] transition-[border-color,background-color,box-shadow] duration-150 hover:border-foreground/15 hover:bg-accent/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
        wide && "sm:grid sm:min-h-[18rem] sm:grid-cols-[minmax(0,1fr)_16rem] sm:gap-5",
        config.kind === "embed" && "bg-muted/30 shadow-none",
        className,
      )}
      entityId={entity.id}
      onOpen={onOpen}
    >
      <span className="flex min-w-0 flex-col">
        <ObjectTypeLabel
          entity={entity}
          labels={objectTypeLabels}
          structures={structures}
          variant="chip"
          className="self-start"
        />
        <span className="mt-3 block truncate text-[17px] font-semibold leading-6">
          {title}
        </span>
      </span>
      <ObjectViewPreview
        entity={entity}
        className={cn("mt-4 flex-1", wide && "sm:mt-0")}
      />
      <CardMetadata entity={entity} fallbackLabel={props.propertyLabels?.tags} />
    </OpenSurface>
  );
}

function ObjectView(props: ObjectViewProps) {
  if (!props.entity) {
    return (
      <div
        data-slot="object-view-missing"
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
