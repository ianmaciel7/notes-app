"use client";

import type * as React from "react";

import { AppSidebarDotsIcon } from "@/components/app-sidebar-icons";
import {
  objectIconToneBadgeClass,
  objectIconToneTextClass,
  objectTypeDefinitionById,
} from "@/components/object-icons";
import { objectLifecycleContractSlots } from "@/components/object-lifecycle-contracts";
import type {
  ObjectViewProps,
  ProjectionLabels,
} from "@/components/object-view-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import { readWorkspaceEntityProperty } from "@/lib/workspace-object-views";
import type { WorkspaceEntity } from "@/lib/workspace-objects";
import {
  type FormattedNumberValue,
  formatNumberValue,
} from "@/lib/workspace-property-values";

function structureFor(
  entity: WorkspaceEntity,
  structures: readonly WorkspaceStructure[] | undefined,
): WorkspaceStructure | undefined {
  return structures?.find((structure) => structure.id === entity.objectTypeId);
}

function typeLabel(
  entity: WorkspaceEntity,
  labels: ProjectionLabels["objectTypeLabels"],
  structures: readonly WorkspaceStructure[] | undefined,
): string {
  return (
    labels?.[entity.objectTypeId] ??
    structureFor(entity, structures)?.singularName ??
    entity.objectTypeId
  );
}

type ObjectTypeLabelProps = {
  readonly className?: string;
  readonly entity: WorkspaceEntity;
  readonly labels?: ProjectionLabels["objectTypeLabels"];
  readonly structures?: readonly WorkspaceStructure[];
  readonly variant?: "chip" | "plain";
};

function ObjectTypeLabel({
  className,
  entity,
  labels,
  structures,
  variant = "plain",
}: ObjectTypeLabelProps) {
  const structure = structureFor(entity, structures);
  const definition =
    objectTypeDefinitionById[structure?.iconName ?? entity.objectTypeId] ??
    objectTypeDefinitionById.page;
  const Icon = definition.icon;
  const tone = structure?.tone ?? definition.tone;
  return (
    <span
      data-slot="object-type-label"
      data-variant={variant}
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5",
        variant === "chip" &&
          "h-6 max-w-full rounded-md border px-2 text-xs font-medium",
        variant === "chip"
          ? objectIconToneBadgeClass[tone]
          : objectIconToneTextClass[tone],
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5 shrink-0" />
      <span className="truncate">{typeLabel(entity, labels, structures)}</span>
    </span>
  );
}

function propertyDefinitionFor(
  structure: WorkspaceStructure | undefined,
  propertyId: string,
) {
  return structure?.propertyDefinitions.find(
    (definition) => definition.id === propertyId,
  );
}

const numberProgressColorClass = {
  blue: "bg-blue-500",
  gray: "bg-muted-foreground",
  green: "bg-emerald-500",
  orange: "bg-orange-500",
  purple: "bg-violet-500",
  red: "bg-red-500",
} as const;

function NumberValueDisplay({
  className,
  formatted,
  variant = "inline",
}: {
  readonly className?: string;
  readonly formatted: FormattedNumberValue;
  readonly variant?: "inline" | "field";
}) {
  if (formatted.progress) {
    return (
      <span
        data-slot="number-value-display"
        data-number-presentation="progress"
        data-invalid-config={formatted.diagnostics.length > 0 || undefined}
        className={cn(
          "inline-flex min-w-0 items-center gap-2",
          variant === "field" && "w-full",
          className,
        )}
      >
        <span
          role="progressbar"
          aria-label={formatted.text}
          aria-valuemin={0}
          aria-valuemax={formatted.progress.max}
          aria-valuenow={formatted.progress.value}
          aria-valuetext={formatted.progress.text}
          className="h-1.5 min-w-12 flex-1 overflow-hidden rounded-full bg-muted"
        >
          <span
            aria-hidden="true"
            className={cn(
              "block h-full rounded-full",
              numberProgressColorClass[formatted.progress.color],
            )}
            style={{ width: `${formatted.progress.percent}%` }}
          />
        </span>
        <span className="shrink-0 tabular-nums">{formatted.text}</span>
      </span>
    );
  }
  return (
    <span
      data-slot="number-value-display"
      data-number-presentation={formatted.presentation.type}
      data-invalid-config={formatted.diagnostics.length > 0 || undefined}
      className={cn("tabular-nums", className)}
    >
      {formatted.text}
    </span>
  );
}

function formatValue(
  value: unknown,
  structure: WorkspaceStructure | undefined,
  propertyId: string,
): React.ReactNode {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "✓" : "—";
  if (typeof value === "number") {
    return (
      <NumberValueDisplay
        formatted={formatNumberValue(
          value,
          propertyDefinitionFor(structure, propertyId)?.numberPresentation,
        )}
      />
    );
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => formatValue(item, structure, propertyId))
      .join(", ");
  }
  if (typeof value !== "string") return JSON.stringify(value);
  const parsed = Date.parse(value);
  return /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(parsed)
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        new Date(parsed),
      )
    : value;
}

function entityValue(
  entity: WorkspaceEntity,
  propertyId: string,
  labels: ProjectionLabels["objectTypeLabels"],
  structures: readonly WorkspaceStructure[] | undefined,
): React.ReactNode {
  const structure = structureFor(entity, structures);
  return propertyId === "objectTypeId"
    ? typeLabel(entity, labels, structures)
    : formatValue(
        readWorkspaceEntityProperty(entity, propertyId),
        structure,
        propertyId,
      );
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

function ObjectProperties({
  config,
  entity,
  objectTypeLabels,
  propertyLabels,
  structures,
}: Pick<
  ObjectViewProps,
  "config" | "objectTypeLabels" | "propertyLabels" | "structures"
> & { readonly entity: WorkspaceEntity }) {
  const rows = config.visiblePropertyIds
    .filter((propertyId) => propertyId !== "title")
    .map((propertyId) => ({
      id: propertyId,
      label: propertyLabels?.[propertyId] ?? propertyId,
      value: entityValue(entity, propertyId, objectTypeLabels, structures),
    }));
  if (rows.length === 0) return null;
  return (
    <dl
      data-slot="object-properties"
      className="grid gap-2 text-xs text-muted-foreground"
    >
      {rows.map((row) => (
        <div key={row.id} className="flex min-w-0 items-baseline gap-2">
          <dt className="shrink-0 font-medium">{row.label}</dt>
          <dd className="truncate">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ObjectProjectionActions({
  className,
  labels,
  title,
}: {
  readonly className?: string;
  readonly labels: ObjectViewProps["labels"];
  readonly title: string;
}) {
  const actions = labels.objectActions;
  if (!actions) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={actions.moreOptions(title)}
            data-slot="object-projection-actions-trigger"
            className={cn(
              "inline-flex size-[22px] items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity duration-150 hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/object-projection:opacity-100 group-focus-within/object-projection:opacity-100 data-popup-open:opacity-100 motion-reduce:transition-none",
              className,
            )}
          >
            <AppSidebarDotsIcon aria-hidden className="size-3.5" />
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>{actions.pinSidebar}</DropdownMenuItem>
        <DropdownMenuItem>{actions.export}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{actions.duplicate}</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          {actions.deleteObject}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type OpenSurfaceProps = {
  readonly ariaLabel: string;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly entityId: string;
  readonly onOpen?: (entityId: string) => void;
};

function OpenSurface({
  ariaLabel,
  children,
  className,
  entityId,
  onOpen,
}: OpenSurfaceProps) {
  if (!onOpen) {
    return (
      <div
        data-slot="open-surface"
        data-lifecycle-contract={
          objectLifecycleContractSlots.ObjectProjectionRow
        }
        className={className}
      >
        {children}
      </div>
    );
  }
  return (
    <button
      type="button"
      data-slot="open-surface"
      data-lifecycle-contract={objectLifecycleContractSlots.ObjectProjectionRow}
      aria-label={ariaLabel}
      className={cn("text-left", className)}
      onClick={() => onOpen(entityId)}
    >
      {children}
    </button>
  );
}

export type { ObjectTypeLabelProps, OpenSurfaceProps };
export {
  entityDescription,
  entityValue,
  NumberValueDisplay,
  ObjectProperties,
  ObjectProjectionActions,
  ObjectTypeLabel,
  OpenSurface,
  typeLabel,
};
