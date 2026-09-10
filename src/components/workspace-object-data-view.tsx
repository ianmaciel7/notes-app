"use client";

import { Plus, Tag } from "lucide-react";

import { ObjectTypeIconBadge } from "@/components/object-icons";
import { Button } from "@/components/ui/button";
import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";
import { cn } from "@/lib/utils";

export type WorkspaceObjectDataViewLayout = "cards" | "list";
export type WorkspaceObjectDataViewGroup = "none" | "tag";

export type WorkspaceObjectDataViewType = Pick<
  SpaceObjectTypeRecord,
  "id" | "pluralName" | "singularName"
> &
  Partial<Pick<SpaceObjectTypeRecord, "iconName" | "spaceId" | "tone">>;

type WorkspaceObjectDataViewProps = {
  entities: readonly SpaceEntityRecord[];
  layout: WorkspaceObjectDataViewLayout;
  groupBy?: WorkspaceObjectDataViewGroup;
  objectType: WorkspaceObjectDataViewType;
  onCreateEntity?: () => void;
  onOpenEntity?: (entity: SpaceEntityRecord) => void;
};

function getCardPreviewLines(entity: SpaceEntityRecord) {
  return entity.blocks
    .filter((block) => block.type !== "divider")
    .map((block) => ({
      id: block.id,
      content: block.content.replace(/\s+/g, " ").trim(),
    }))
    .filter((line) => line.content)
    .slice(0, 3);
}

function ObjectTypeDataViewCard({
  entity,
  layout,
  objectType,
  onOpenEntity,
}: Pick<WorkspaceObjectDataViewProps, "layout" | "objectType" | "onOpenEntity"> & {
  entity: SpaceEntityRecord;
}) {
  const previewLines = getCardPreviewLines(entity);
  const singularName = objectType.singularName || objectType.pluralName;
  const tone = objectType.tone ?? "gray";
  const typeLabelStyle = {
    backgroundColor: `var(--type-label-bg-${tone})`,
    borderColor: `var(--type-label-border-${tone})`,
    color: `var(--type-label-text-${tone})`,
  };

  return (
    <li data-slot="workspace-object-type-list-item" className={cn(layout === "cards" && "min-w-0")}>
      <button
        type="button"
        disabled={!onOpenEntity}
        className={cn(
          "group flex text-left outline-none transition-[background-color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring/30",
          layout === "cards"
            ? "h-[19.25rem] w-[calc(100%-1px)] flex-col gap-y-1 overflow-hidden rounded-[12px] border border-[var(--app-border-el)] bg-[var(--app-bg-front)] py-2.5 text-sm shadow-[0_2px_3px_0_rgba(0,0,0,0.004),0_4px_9px_0_rgba(0,0,0,0.01),0_8px_12px_0_rgba(0,0,0,0.004)] hover:shadow-[0_2px_3px_0_rgba(0,0,0,0.008),0_4px_9px_0_rgba(0,0,0,0.01),0_8px_12px_0_rgba(0,0,0,0.008)] disabled:cursor-default disabled:opacity-100"
            : "min-h-12 w-full items-center gap-3 rounded-[8px] border border-[var(--app-border-el)] bg-[var(--app-bg-front)] px-3 py-2 hover:bg-[var(--app-bg-el-subtle)]",
        )}
        onClick={() => onOpenEntity?.(entity)}
      >
        <div
          className={cn(
            "flex min-w-0 items-center",
            layout === "cards" ? "h-[1.625rem] px-2.5" : "",
          )}
        >
          {layout === "cards" ? (
            <span
              className="inline-flex h-[20.671875px] items-center rounded-[0.475em] border px-[0.49em] py-[0.2em] text-[11px] leading-[1.3]"
              style={typeLabelStyle}
            >
              <ObjectTypeIconBadge
                id={objectType.id}
                iconName={objectType.iconName}
                tone={objectType.tone ?? "gray"}
                className="-ml-[0.1em] mr-[0.325em] size-[1.3em] border-0 bg-transparent"
                iconClassName="size-[0.94em]"
              />
              <span className="min-w-[1.3em] text-center">{singularName}</span>
            </span>
          ) : (
            <>
              <ObjectTypeIconBadge
                id={objectType.id}
                iconName={objectType.iconName}
                tone={objectType.tone ?? "gray"}
                className="size-5 rounded-md"
                iconClassName="size-3"
              />
              <p className="ml-2 min-w-0 truncate text-sm font-medium text-[var(--app-text-primary)]">
                {entity.title || "Sem título"}
              </p>
            </>
          )}
        </div>

        {layout === "cards" ? (
          <>
            <div className="flex min-h-8 w-full grow shrink-0 px-2.5">
              <p className="self-start w-full px-0.5 pt-[2px] text-[16px] font-semibold leading-[22px] !text-[var(--app-text-primary)] line-clamp-2">
                {entity.title || "Sem título"}
              </p>
            </div>
            <div className="h-48 px-2.5">
              <div
                data-slot="workspace-object-type-card-preview"
                className="h-full w-full overflow-hidden rounded-[8px] border border-[var(--app-border-el-subtle)] bg-[var(--app-bg-el)] px-4 pb-4 pt-3 text-sm leading-5 text-[var(--app-text-secondary)]"
              >
                {previewLines.map((line) => (
                  <p key={line.id} className="mb-3 line-clamp-3 last:mb-0">
                    {line.content}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex h-6 w-full items-center overflow-hidden px-2.5 text-[13.5px] leading-[19.2px] text-[var(--app-text-primary)]">
              <Tag className="mr-1 size-3 shrink-0 text-[var(--app-text-secondary)]" />
              {entity.tags.length ? (
                <span className="truncate">{entity.tags.slice(0, 2).join(", ")}</span>
              ) : (
                <span>Vazio</span>
              )}
            </div>
          </>
        ) : null}
      </button>
    </li>
  );
}

export function WorkspaceObjectDataView({
  entities,
  groupBy = "none",
  layout,
  objectType,
  onCreateEntity,
  onOpenEntity,
}: WorkspaceObjectDataViewProps) {
  const useCards = layout === "cards";
  const groups =
    groupBy === "tag"
      ? Array.from(
          entities.reduce((result, entity) => {
            const keys = entity.tags.length ? entity.tags : ["Sem etiqueta"];
            for (const key of keys) {
              const group = result.get(key) ?? [];
              group.push(entity);
              result.set(key, group);
            }
            return result;
          }, new Map<string, SpaceEntityRecord[]>()),
        )
      : [[null, [...entities]] as const];

  function renderItems(groupEntities: readonly SpaceEntityRecord[], groupName: string | null) {
    return (
      <div key={groupName ?? "all"} className={groupName ? "mb-5 last:mb-0" : undefined}>
        {groupName ? (
          <h2 className="mb-2 px-0.5 text-sm font-medium text-[var(--app-text-secondary)]">
            {groupName}
          </h2>
        ) : null}
        <ul
          data-slot={
            useCards ? "workspace-object-data-view-cards" : "workspace-object-data-view-list"
          }
          className={cn(
            useCards
              ? "grid w-full max-w-[507.3125px] grid-cols-2 items-start gap-3"
              : "flex flex-col gap-1.5",
          )}
          aria-label={`${groupName ? `${groupName} ` : ""}${objectType.pluralName} objects`}
        >
          {groupEntities.map((entity) => (
            <ObjectTypeDataViewCard
              key={entity.id}
              entity={entity}
              layout={layout}
              objectType={objectType}
              onOpenEntity={onOpenEntity}
            />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div data-slot="workspace-object-data-view" className="w-full">
      {groups.map(([groupName, groupEntities]) => renderItems(groupEntities, groupName))}
      {entities.length > 0 && onCreateEntity ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-4 -ml-[5px] w-[12.875rem] justify-start rounded-xl px-3 pl-[13px] py-2 text-sm text-[var(--app-text-secondary)] hover:bg-[var(--app-bg-el-hover)]"
          onClick={onCreateEntity}
        >
          <Plus className="size-3.5" />
          Novo Objeto
        </Button>
      ) : null}
    </div>
  );
}
