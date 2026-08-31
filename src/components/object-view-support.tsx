"use client";

import type * as React from "react";

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
import { cn } from "@/lib/utils";
import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import { readWorkspaceEntityProperty } from "@/lib/workspace-object-views";
import type { WorkspaceEntity } from "@/lib/workspace-objects";
import { formatNumberValue } from "@/lib/workspace-property-values";

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

function formatValue(
  value: unknown,
  structure: WorkspaceStructure | undefined,
  propertyId: string,
): string {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "✓" : "—";
  if (typeof value === "number") {
    return formatNumberValue(
      value,
      propertyDefinitionFor(structure, propertyId)?.numberPresentation,
    ).text;
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
): string {
  const structure = structureFor(entity, structures);
  return propertyId === "objectTypeId"
    ? typeLabel(entity, labels, structures)
    : formatValue(readWorkspaceEntityProperty(entity, propertyId), structure, propertyId);
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
  ObjectProperties,
  ObjectTypeLabel,
  OpenSurface,
  typeLabel,
};
