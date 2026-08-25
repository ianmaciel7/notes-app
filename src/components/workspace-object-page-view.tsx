"use client";

import { useTranslations } from "next-intl";
import * as React from "react";

import { AppHeaderCaretDownIcon } from "@/components/app-header-icons";
import { AppSidebarDotsIcon } from "@/components/app-sidebar-icons";
import { BlockEditor } from "@/components/block-editor";
import {
  ObjectCollectionIcon,
  ObjectIconBadge,
  ObjectTagIcon,
  objectIconToneBadgeClass,
  objectTypeDefinitionById,
} from "@/components/object-icons";
import { Button } from "@/components/ui/button";
import {
  workspaceFieldGroupClass,
  workspaceListRowClass,
  workspaceListSurfaceClass,
  workspaceLongformColumnClass,
  workspaceRouteClass,
} from "@/components/ui/workspace-surface";
import {
  CompoundChip,
  CompoundChipDisclosure,
  CompoundChipPrimary,
} from "@/components/ui/compound-chip";
import { useWorkspace } from "@/components/workspace-controller";
import { useBufferedTextCommit } from "@/hooks/use-buffered-text-commit";
import { cn } from "@/lib/utils";
import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import type { WorkspaceEntity } from "@/lib/workspace-objects";

type DocumentWorkspaceEntity =
  | Extract<WorkspaceEntity, { kind: "document" }>
  | Extract<WorkspaceEntity, { kind: "quote" }>;
type TableWorkspaceEntity = Extract<WorkspaceEntity, { kind: "table" }>;
type SupportedWorkspaceEntity = DocumentWorkspaceEntity | TableWorkspaceEntity;

type WorkspaceObjectPageViewProps = {
  readonly entity: SupportedWorkspaceEntity;
};

type EntityUpdate = (patch: Record<string, unknown>) => void;

const tagChipClass =
  "inline-flex max-w-full items-center rounded-[0.475em] border border-[oklch(0.9563_0.0444_203.48)] bg-[oklch(0.9563_0.0444_203.48)] px-[0.49em] py-[0.2em] text-sm leading-[1.3] text-[oklch(0.3622_0.0423_219.72)]";
const collectionChipClass =
  "inline-flex max-w-full items-center rounded-[0.475em] border border-border bg-muted/50 px-[0.49em] py-[0.2em] text-sm leading-[1.3] text-foreground";

function entityCollections(entity: SupportedWorkspaceEntity): readonly string[] {
  return "collections" in entity && Array.isArray(entity.collections)
    ? entity.collections
    : [];
}

function entityTags(entity: SupportedWorkspaceEntity): readonly string[] {
  return "tags" in entity && Array.isArray(entity.tags) ? entity.tags : [];
}

function resolveStructure(
  entity: WorkspaceEntity,
  structures: readonly WorkspaceStructure[],
): WorkspaceStructure | undefined {
  return structures.find((structure) => structure.id === entity.objectTypeId);
}

function BufferedTitle({
  label,
  onCommit,
  value,
}: {
  readonly label: string;
  readonly onCommit: (value: string) => void;
  readonly value: string;
}) {
  const { inputProps } = useBufferedTextCommit({ value, onCommit });
  return (
    <input
      {...inputProps}
      data-slot="workspace-object-page-title"
      aria-label={label}
      placeholder={label}
      className="mt-4 block min-h-[44px] w-full bg-transparent text-[40px] font-bold leading-[44px] tracking-[-0.02em] text-foreground outline-none placeholder:text-muted-foreground/50"
    />
  );
}

function BufferedTableCell({
  ariaLabel,
  onCommit,
  value,
}: {
  readonly ariaLabel: string;
  readonly onCommit: (value: string) => void;
  readonly value: string;
}) {
  const { inputProps } = useBufferedTextCommit({ value, onCommit });
  return (
    <input
      {...inputProps}
      data-slot="workspace-table-cell"
      aria-label={ariaLabel}
      className="min-h-10 min-w-0 border-b border-r bg-transparent px-3 py-2 text-sm outline-none even:border-r-0 focus:bg-muted/30 [&:nth-last-child(-n+2)]:border-b-0"
    />
  );
}

function BufferedNotes({
  ariaLabel,
  onCommit,
  value,
}: {
  readonly ariaLabel: string;
  readonly onCommit: (value: string) => void;
  readonly value: string;
}) {
  const { inputProps } = useBufferedTextCommit({ value, onCommit });
  return (
    <textarea
      {...inputProps}
      data-slot="workspace-table-notes"
      aria-label={ariaLabel}
      placeholder={ariaLabel}
      rows={3}
      className="mt-3 min-h-20 w-full resize-none bg-transparent text-base leading-7 outline-none placeholder:text-muted-foreground"
    />
  );
}

function ObjectPageHeader({
  entity,
  structure,
}: {
  readonly entity: SupportedWorkspaceEntity;
  readonly structure: WorkspaceStructure;
}) {
  const t = useTranslations("workspace");
  const { objectTypes } = useWorkspace();
  const definition =
    objectTypeDefinitionById[structure.iconName] ?? objectTypeDefinitionById.page;
  const Icon = definition.icon;
  const objectType = objectTypes.find((item) => item.id === structure.id);
  const objectTypeLabel =
    objectType?.singularLabel ?? objectType?.label ?? structure.singularName;
  const collections = entityCollections(entity);
  return (
    <div
      data-slot="workspace-object-page-header"
      className="group/object-page-header flex min-h-[26px] items-center gap-1.5"
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
        <CompoundChip className={objectIconToneBadgeClass[structure.tone]}>
          <CompoundChipPrimary>
            <Icon className="mr-1 size-3.5 shrink-0" />
            <span className="truncate">{objectTypeLabel}</span>
          </CompoundChipPrimary>
          <CompoundChipDisclosure aria-label={t("lifecycle.changeObjectType")}>
            <AppHeaderCaretDownIcon className="size-3.5" />
          </CompoundChipDisclosure>
        </CompoundChip>
        {collections.map((collection) => (
          <span key={collection} className={collectionChipClass}>
            <ObjectCollectionIcon className="mr-1.5 size-3.5 shrink-0" />
            <span className="truncate">{collection}</span>
          </span>
        ))}
        {collections.length === 0 ? (
          <span className="inline-flex items-center gap-1.5 px-1.5 text-sm text-muted-foreground">
            <ObjectCollectionIcon className="size-3.5" />
            {t("objects.collections")}
          </span>
        ) : null}
      </div>
      <span className="hidden items-center gap-1.5 text-sm text-muted-foreground opacity-0 transition-opacity group-hover/object-page-header:opacity-100 sm:inline-flex">
        {t("actions.customize")}
        <AppHeaderCaretDownIcon className="size-3.5" />
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.moreOptions")}
        className="h-[30px] w-[30px] rounded-lg border border-border"
      >
        <AppSidebarDotsIcon className="size-4" />
      </Button>
    </div>
  );
}

function ObjectPageTags({
  entity,
  update,
}: {
  readonly entity: SupportedWorkspaceEntity;
  readonly update: EntityUpdate;
}) {
  const t = useTranslations("workspace");
  const tags = entityTags(entity);
  return (
    <div
      data-slot="workspace-object-page-tags"
      className="mt-3 flex min-h-7 flex-wrap items-center gap-1.5"
    >
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className={tagChipClass}
          aria-label={`${t("objectTypeOverview.remove")} ${tag}`}
          onClick={() => update({ tags: tags.filter((item) => item !== tag) })}
        >
          <span className="truncate">{tag}</span>
        </button>
      ))}
      <span className="inline-flex items-center gap-1.5 px-1 text-sm text-muted-foreground">
        <ObjectTagIcon className="size-3.5" />
        {t("fields.tags")}
      </span>
    </div>
  );
}

function RelatedContent({ entityId }: { readonly entityId: string }) {
  const t = useTranslations("workspace");
  const { createdEntities, objectTypes, selectEntity } = useWorkspace();
  const related = createdEntities.filter((item) => item.id !== entityId).slice(0, 3);
  if (related.length === 0) return null;
  return (
    <section
      data-slot="workspace-object-related-content"
      className="mt-24 border-t pt-8"
      aria-labelledby={`${entityId}-related-heading`}
    >
      <h2 id={`${entityId}-related-heading`} className="mb-4 inline-flex items-center gap-2 text-base font-semibold">
        {t("explore.relatedContent")}
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {related.length}
        </span>
      </h2>
      <div className="grid gap-1">
        {related.map((item) => {
          const objectType = objectTypes.find((candidate) => candidate.id === item.objectTypeId);
          const Icon = objectType?.icon ?? objectTypeDefinitionById.page.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={cn(workspaceListRowClass, "min-h-11")}
              onClick={() => selectEntity(item.id)}
            >
              <AppHeaderCaretDownIcon className="size-3 -rotate-90 text-muted-foreground" />
              <ObjectIconBadge icon={Icon} tone={objectType?.tone ?? "blue"} className="size-5 rounded-md" iconClassName="size-3.5" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.title || t("lifecycle.untitled")}</span>
              {objectType ? (
                <span className="hidden rounded-md border px-2 py-1 text-xs text-muted-foreground group-hover:inline-flex">{objectType.singularLabel ?? objectType.label}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function DocumentPage({
  entity,
  structure,
  update,
}: {
  readonly entity: DocumentWorkspaceEntity;
  readonly structure: WorkspaceStructure;
  readonly update: EntityUpdate;
}) {
  const t = useTranslations("workspace");
  const { createWorkspacePage } = useWorkspace();
  return (
    <>
      <ObjectPageHeader entity={entity} structure={structure} />
      <BufferedTitle label={t("fields.title")} value={entity.title} onCommit={(title) => update({ title })} />
      <ObjectPageTags entity={entity} update={update} />
      <div data-slot="workspace-document-page-editor">
        <BlockEditor
          ariaLabel={entity.kind === "quote" ? t("fields.quoteContent") : t("fields.text")}
          placeholder={t("fields.text")}
          value={entity.body}
          onChange={(body) => update({ body })}
          onCreatePageRequest={createWorkspacePage}
          className="mt-24 min-h-48"
          labels={{
            bold: t("editor.bold"),
            italic: t("editor.italic"),
            code: t("editor.code"),
            slashMenu: {
              cancel: t("editor.slashMenu.cancel"),
              createPage: t("editor.slashMenu.createPage"),
              empty: t("editor.slashMenu.empty"),
              text: t("editor.slashMenu.text"),
              smallText: t("editor.slashMenu.smallText"),
              page: t("editor.slashMenu.page"),
              heading1: t("editor.slashMenu.heading1"),
              heading2: t("editor.slashMenu.heading2"),
              heading3: t("editor.slashMenu.heading3"),
              heading4: t("editor.slashMenu.heading4"),
              navigate: t("editor.slashMenu.navigate"),
              bulletList: t("editor.slashMenu.bulletList"),
              alphabeticalList: t("editor.slashMenu.alphabeticalList"),
              orderedList: t("editor.slashMenu.orderedList"),
              romanList: t("editor.slashMenu.romanList"),
              taskList: t("editor.slashMenu.taskList"),
              select: t("editor.slashMenu.select"),
              blockquote: t("editor.slashMenu.blockquote"),
              codeBlock: t("editor.slashMenu.codeBlock"),
              horizontalRule: t("editor.slashMenu.horizontalRule"),
              title: t("editor.slashMenu.title"),
            },
          }}
        />
      </div>
      <RelatedContent entityId={entity.id} />
    </>
  );
}

function TablePage({
  entity,
  structure,
  update,
}: {
  readonly entity: TableWorkspaceEntity;
  readonly structure: WorkspaceStructure;
  readonly update: EntityUpdate;
}) {
  const t = useTranslations("workspace");
  const cells = [...entity.cells].sort((left, right) => left.row - right.row || left.column - right.column);
  return (
    <>
      <ObjectPageHeader entity={entity} structure={structure} />
      <BufferedTitle label={t("fields.title")} value={entity.title} onCommit={(title) => update({ title })} />
      <ObjectPageTags entity={entity} update={update} />
      <div data-slot="workspace-table-grid" className={cn(workspaceListSurfaceClass, "mt-9 grid w-full max-w-[22.5rem] grid-cols-2 p-0")}>
        {cells.map((cell) => (
          <BufferedTableCell
            key={cell.id}
            ariaLabel={t("lifecycle.table.cell", { column: cell.column + 1, row: cell.row + 1 })}
            value={cell.value}
            onCommit={(value) => update({ cells: entity.cells.map((item) => item.id === cell.id ? { ...item, value } : item) })}
          />
        ))}
      </div>
      <section className={cn(workspaceFieldGroupClass, "mt-10")} aria-labelledby={`${entity.id}-notes-heading`}>
        <h2 id={`${entity.id}-notes-heading`} className="text-base font-semibold">{t("lifecycle.table.notes")}</h2>
        <BufferedNotes ariaLabel={t("lifecycle.table.notes")} value={entity.notes} onCommit={(notes) => update({ notes })} />
      </section>
      <RelatedContent entityId={entity.id} />
    </>
  );
}

function WorkspaceObjectPageView({ entity }: WorkspaceObjectPageViewProps) {
  const t = useTranslations("workspace");
  const { structures, updateWorkspaceEntity } = useWorkspace();
  const [collapsed, setCollapsed] = React.useState(false);
  const structure = resolveStructure(entity, structures);
  if (!structure) return null;
  const update: EntityUpdate = (patch) => updateWorkspaceEntity(entity.id, patch);
  return (
    <section
      data-slot="workspace-object-page-view"
      data-object-kind={entity.kind}
      className={cn(workspaceRouteClass, "w-full overflow-y-auto")}
    >
      <div className={cn(workspaceLongformColumnClass, "lg:pt-24", collapsed && "hidden")}>
        {entity.kind === "table" ? (
          <TablePage entity={entity} structure={structure} update={update} />
        ) : (
          <DocumentPage entity={entity} structure={structure} update={update} />
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.collapseEditor")}
        aria-expanded={!collapsed}
        className="absolute right-3 top-1/2 hidden h-7 w-7 text-lg font-light md:inline-flex"
        onClick={() => setCollapsed((current) => !current)}
      >
        <span aria-hidden>{collapsed ? "+" : "−"}</span>
      </Button>
    </section>
  );
}

function canRenderWorkspaceObjectPage(entity: WorkspaceEntity | undefined): entity is SupportedWorkspaceEntity {
  return (
    entity?.kind === "document" ||
    entity?.kind === "quote" ||
    entity?.kind === "table"
  );
}

export { canRenderWorkspaceObjectPage, WorkspaceObjectPageView };
export type { WorkspaceObjectPageViewProps };
