"use client";

import { Tag as PhosphorTag } from "@phosphor-icons/react";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";

import {
  ObjectCollectionIcon,
  ObjectTypeIconBadge,
  ObjectTypeLabelChip,
} from "@/app/_components/objects/object-icons";
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
  collectionNamesById?: Readonly<Record<string, string>>;
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

function WorkspaceCardPropertyIcon({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex size-4 shrink-0 items-center justify-center text-[var(--app-text-subtle)]">
      {children}
    </span>
  );
}

function WorkspaceCardPropertyChip({
  children,
  kind,
}: {
  children: ReactNode;
  kind: "collection" | "tag";
}) {
  return (
    <span
      data-slot={`workspace-object-type-card-${kind}-chip`}
      className={cn(
        "inline-flex max-w-full min-w-0 items-center rounded-[0.475em] border px-[0.49em] py-[0.2em] leading-[1.3]",
        kind === "collection"
          ? "border-[var(--app-border-front)] bg-muted/30 text-[var(--app-text-secondary)]"
          : "border-[var(--app-tag-bg-lime)] bg-[var(--app-tag-bg-lime)] text-[var(--app-tag-text-lime)]",
      )}
    >
      {children}
    </span>
  );
}

function ObjectTypeDataViewCard({
  collectionNamesById = {},
  entity,
  layout,
  objectType,
  onOpenEntity,
}: Pick<
  WorkspaceObjectDataViewProps,
  "collectionNamesById" | "layout" | "objectType" | "onOpenEntity"
> & {
  entity: SpaceEntityRecord;
}) {
  const previewLines = getCardPreviewLines(entity);
  const singularName = objectType.singularName || objectType.pluralName;
  const collectionLabels = (entity.collections ?? []).map(
    (collectionId) => collectionNamesById[collectionId] ?? collectionId,
  );

  return (
    <li data-slot="workspace-object-type-list-item" className={cn(layout === "cards" && "min-w-0")}>
      <button
        type="button"
        disabled={!onOpenEntity}
        className={cn(
          "group flex text-left outline-none transition-[background-color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring/30",
          layout === "cards"
            ? "h-[21rem] w-[calc(100%-1px)] flex-col gap-y-1 overflow-hidden rounded-[12px] border border-[var(--app-border-front)] bg-[var(--app-bg-front)] py-2.5 text-sm shadow-[0_2px_3px_0_rgba(0,0,0,0.004),0_4px_9px_0_rgba(0,0,0,0.01),0_8px_12px_0_rgba(0,0,0,0.004)] hover:shadow-[0_2px_3px_0_rgba(0,0,0,0.008),0_4px_9px_0_rgba(0,0,0,0.01),0_8px_12px_0_rgba(0,0,0,0.008)] disabled:cursor-default disabled:opacity-100"
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
            <ObjectTypeLabelChip
              id={objectType.id}
              iconName={objectType.iconName}
              label={singularName}
              tone={objectType.tone ?? "gray"}
              variant="compact"
            />
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
                className="h-full w-full overflow-hidden rounded-[8px] border border-[var(--app-border-front)] bg-[var(--app-bg-back)] px-4 pb-4 pt-3 text-sm leading-5 text-[var(--app-text-secondary)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
              >
                {previewLines.map((line) => (
                  <p key={line.id} className="mb-3 line-clamp-3 last:mb-0">
                    {line.content}
                  </p>
                ))}
              </div>
            </div>
            <div
              data-slot="workspace-object-type-card-collections"
              className="flex h-6 w-full items-center overflow-hidden px-2.5 text-[13.5px] leading-[19.2px] text-[var(--app-text-primary)]"
            >
              <div className="flex h-6 min-w-0 flex-1 items-center gap-1.5">
                <WorkspaceCardPropertyIcon>
                  <ObjectCollectionIcon className="!h-4 !w-[13.5px] text-[var(--app-text-subtle)]" />
                </WorkspaceCardPropertyIcon>
                <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                  {collectionLabels.length ? (
                    collectionLabels.slice(0, 2).map((label) => (
                      <WorkspaceCardPropertyChip key={label} kind="collection">
                        <ObjectCollectionIcon className="mr-[0.325em] ml-[-0.1em] text-[var(--app-text-secondary)]" />
                        <span className="truncate">{label}</span>
                      </WorkspaceCardPropertyChip>
                    ))
                  ) : (
                    <span className="truncate text-[var(--app-text-subtle)]">Vazio</span>
                  )}
                </div>
              </div>
            </div>
            <div
              data-slot="workspace-object-type-card-tags"
              className="flex h-6 w-full items-center overflow-hidden px-2.5 text-[13.5px] leading-[19.2px] text-[var(--app-text-primary)]"
            >
              <div className="flex h-6 min-w-0 flex-1 items-center gap-1.5">
                <WorkspaceCardPropertyIcon>
                  <PhosphorTag className="relative top-[-0.625px] left-[0.703125px] h-4 w-[13.953125px]" />
                </WorkspaceCardPropertyIcon>
                <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                  {entity.tags.length ? (
                    entity.tags.slice(0, 2).map((tag) => (
                      <WorkspaceCardPropertyChip key={tag} kind="tag">
                        <span className="truncate">{tag}</span>
                      </WorkspaceCardPropertyChip>
                    ))
                  ) : (
                    <span className="truncate text-[var(--app-text-subtle)]">Vazio</span>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </button>
    </li>
  );
}

export function WorkspaceObjectDataView({
  collectionNamesById,
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
              collectionNamesById={collectionNamesById}
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
