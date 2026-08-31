"use client";

import * as React from "react";
import { ObjectViewPreview } from "@/components/object-view-preview";
import type {
  ObjectViewProps,
  ReadyObjectViewProps,
} from "@/components/object-view-types";
import {
  entityDescription,
  entityValue,
  ObjectProperties,
  ObjectTypeLabel,
  OpenSurface,
} from "@/components/object-view-support";
import {
  workspaceEmptyStateSurfaceClass,
  workspaceListRowClass,
  workspaceLongformColumnClass,
  workspaceNamedCardClass,
} from "@/components/ui/workspace-surface";
import { cn } from "@/lib/utils";
import type { WorkspaceEntity } from "@/lib/workspace-objects";
import {
  createDefaultObjectViewConfig,
  projectObjectCardProperties,
  type ObjectViewConfig,
  type ObjectViewKind,
} from "@/lib/workspace-object-views";
import type { WorkspaceStructure } from "@/lib/workspace-object-types";

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
        workspaceListRowClass,
        "gap-3 border border-transparent bg-card px-3 py-2 text-card-foreground shadow-xs",
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
        workspaceLongformColumnClass,
        "grid gap-6 lg:pt-24",
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
  return Array.from(new Set([...collections, ...tags].filter(Boolean))).slice(
    0,
    4,
  );
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
    <span
      data-slot="object-view-card-metadata"
      className="mt-2 flex flex-wrap gap-1.5"
    >
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

function cardStructureFor(
  entity: WorkspaceEntity,
  structures: readonly WorkspaceStructure[] | undefined,
): WorkspaceStructure | undefined {
  return structures?.find((structure) => structure.id === entity.objectTypeId);
}

function cardPropertyInputValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === "string"
      ? first
      : first && typeof first === "object" && "id" in first
        ? String(first.id)
        : "";
  }
  if (typeof value === "object" && "start" in value) {
    return String(value.start).slice(0, 16);
  }
  return "";
}

function cardLabelSelectedIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) =>
    item && typeof item === "object" && "id" in item ? [String(item.id)] : [],
  );
}

function CardPropertyEditor({
  entity,
  propertyId,
  structure,
  value,
  onCommit,
}: {
  readonly entity: WorkspaceEntity;
  readonly propertyId: string;
  readonly structure: WorkspaceStructure;
  readonly value: unknown;
  readonly onCommit: (propertyId: string, value: unknown) => void;
}) {
  const definition = structure.propertyDefinitions.find(
    (property) => property.id === propertyId,
  );
  const inputId = React.useId();
  const [draft, setDraft] = React.useState(cardPropertyInputValue(value));

  React.useEffect(() => {
    setDraft(cardPropertyInputValue(value));
  }, [value]);

  if (!definition) return null;
  if (definition.valueType === "boolean") {
    return (
      <input
        aria-label={definition.name}
        checked={Boolean(value)}
        className="size-4"
        type="checkbox"
        onChange={(event) => onCommit(propertyId, event.currentTarget.checked)}
      />
    );
  }
  if (definition.valueType === "label") {
    const selectedIds = cardLabelSelectedIds(value);
    return (
      <select
        id={inputId}
        aria-label={definition.name}
        multiple={definition.multiple}
        value={definition.multiple ? selectedIds : (selectedIds[0] ?? "")}
        className="min-h-7 min-w-0 rounded-md border border-transparent bg-transparent px-1 text-xs text-foreground outline-none hover:border-border focus:border-ring"
        onChange={(event) => {
          const optionIds = Array.from(
            event.currentTarget.selectedOptions,
          ).map((option) => option.value);
          onCommit(
            propertyId,
            definition.multiple ? optionIds : (optionIds[0] ?? ""),
          );
        }}
      >
        {!definition.multiple && <option value="" />}
        {(definition.options ?? []).map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    );
  }
  if (
    definition.valueType !== "title" &&
    definition.valueType !== "url" &&
    definition.valueType !== "date"
  ) {
    return (
      <span className="truncate text-xs">
        {entityValue(entity, propertyId, undefined, [structure])}
      </span>
    );
  }
  return (
    <input
      id={inputId}
      aria-label={definition.name}
      type={definition.valueType === "date" ? "datetime-local" : "text"}
      value={draft}
      className="min-h-7 min-w-0 rounded-md border border-transparent bg-transparent px-1 text-xs text-foreground outline-none hover:border-border focus:border-ring"
      onBlur={() =>
        onCommit(
          propertyId,
          definition.valueType === "date"
            ? {
                allDay: false,
                start: draft,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              }
            : draft,
        )
      }
      onChange={(event) => setDraft(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
      }}
    />
  );
}

function CardConfiguredProperties(props: ReadyObjectViewProps) {
  const structure = cardStructureFor(props.entity, props.structures);
  if (!structure) return null;
  const surface = props.cardSurface ?? (props.config.kind === "embed" ? "embed" : "small-card");
  return (
    <CardConfiguredPropertyRows
      {...props}
      structure={structure}
      surface={surface}
    />
  );
}

function CardConfiguredPropertyRows({
  entity,
  objectTypeLabels,
  onPropertyCommit,
  structures,
  structure,
  surface,
}: ReadyObjectViewProps & {
  readonly structure: WorkspaceStructure;
  readonly surface: "embed" | "gallery" | "small-card" | "wall";
}) {
  const properties = projectObjectCardProperties(entity, structure, surface);
  if (properties.length === 0) return null;
  return (
    <dl data-slot="object-view-card-properties" className="mt-3 grid gap-1.5">
      {properties.map((property) => (
        <div
          key={property.propertyId}
          data-direct-edit={property.directEdit || undefined}
          data-empty={property.empty || undefined}
          className="grid min-h-7 grid-cols-[5rem_minmax(0,1fr)] items-center gap-2 text-xs"
        >
          <dt className="truncate text-muted-foreground">{property.label}</dt>
          <dd className="min-w-0">
            {property.directEdit && onPropertyCommit ? (
              <CardPropertyEditor
                entity={entity}
                propertyId={property.propertyId}
                structure={structure}
                value={property.value}
                onCommit={(propertyId, value) =>
                  onPropertyCommit(entity.id, propertyId, value)
                }
              />
            ) : (
              <span className="block truncate">
                {entityValue(
                  entity,
                  property.propertyId,
                  objectTypeLabels,
                  structures,
                )}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
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
  const content = (
    <>
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
      <CardConfiguredProperties {...props} />
      <CardMetadata entity={entity} fallbackLabel={props.propertyLabels?.tags} />
    </>
  );
  if (props.onPropertyCommit) {
    return (
      <article
        data-slot="object-view-card"
        className={cn(
          workspaceNamedCardClass,
          "min-h-[25rem] w-full p-3 text-card-foreground hover:border-foreground/15 hover:shadow-sm focus-within:ring-2 focus-within:ring-ring",
          wide &&
            "sm:grid sm:min-h-[18rem] sm:grid-cols-[minmax(0,1fr)_16rem] sm:gap-5",
          config.kind === "embed" && "bg-muted/30 shadow-none",
          className,
        )}
      >
        {content}
        {onOpen ? (
          <button
            type="button"
            className="mt-3 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onOpen(entity.id)}
          >
            {labels.openObject(title)}
          </button>
        ) : null}
      </article>
    );
  }
  return (
    <OpenSurface
      ariaLabel={labels.openObject(title)}
      className={cn(
        workspaceNamedCardClass,
        "min-h-[25rem] w-full p-3 text-card-foreground hover:border-foreground/15 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring",
        wide &&
          "sm:grid sm:min-h-[18rem] sm:grid-cols-[minmax(0,1fr)_16rem] sm:gap-5",
        config.kind === "embed" && "bg-muted/30 shadow-none",
        className,
      )}
      entityId={entity.id}
      onOpen={onOpen}
    >
      {content}
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
          workspaceEmptyStateSurfaceClass,
          "min-h-[96px] p-3 text-sm text-muted-foreground",
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
