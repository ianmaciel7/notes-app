"use client";

import { DownloadIcon, UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { AppHeaderCaretDownIcon } from "@/components/app-header-icons";
import { AppSidebarDotsIcon } from "@/components/app-sidebar-icons";
import { BlockEditor } from "@/components/block-editor";
import { ObjectConversionPlanner } from "@/components/object-conversion-planner";
import {
  ObjectCollectionIcon,
  ObjectIconBadge,
  ObjectTagIcon,
  objectIconToneBadgeClass,
  objectTypeDefinitionById,
} from "@/components/object-icons";
import { objectLifecycleContractSlots } from "@/components/object-lifecycle-contracts";
import { Button } from "@/components/ui/button";
import {
  workspaceOverflowMenuContentClass,
  workspaceOverflowMenuItemClass,
} from "@/components/ui/compact-menu";
import {
  CompoundChip,
  CompoundChipDisclosure,
  CompoundChipPrimary,
} from "@/components/ui/compound-chip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  workspaceFieldGroupClass,
  workspaceListRowClass,
  workspaceListSurfaceClass,
  workspaceLongformColumnClass,
  workspaceRouteClass,
} from "@/components/ui/workspace-surface";
import { useWorkspace } from "@/components/workspace-controller";
import {
  blockEditorDocumentFromMarkdown,
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToMarkdown,
} from "@/editor/document";
import { useBufferedTextCommit } from "@/hooks/use-buffered-text-commit";
import { cn } from "@/lib/utils";
import {
  createObjectEmbedNode,
  createObjectReferenceMark,
  createWorkspaceObjectLinkIndex,
  findUnlinkedMentionCandidates,
  selectBacklinksForObject,
  selectContextualGraphEdges,
  selectObjectsInside,
  selectPropertyRelationGraphEdges,
} from "@/lib/workspace-object-links";
import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import {
  createObjectConversionPlan,
  type ObjectConversionPlan,
  readWorkspaceEntityProperty,
} from "@/lib/workspace-object-views";
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
type EntityPropertyUpdate = (propertyId: string, value: unknown) => void;

const tagChipClass =
  "inline-flex max-w-full items-center rounded-[0.475em] border border-[oklch(0.9563_0.0444_203.48)] bg-[oklch(0.9563_0.0444_203.48)] px-[0.49em] py-[0.2em] text-sm leading-[1.3] text-[oklch(0.3622_0.0423_219.72)]";
const collectionChipClass =
  "inline-flex max-w-full items-center rounded-[0.475em] border border-border bg-muted/50 px-[0.49em] py-[0.2em] text-sm leading-[1.3] text-foreground";

function entityCollections(
  entity: SupportedWorkspaceEntity,
): readonly string[] {
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
      data-lifecycle-contract={objectLifecycleContractSlots.EditableObjectTitle}
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
      data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
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
      data-lifecycle-contract={objectLifecycleContractSlots.EditableObjectBody}
      aria-label={ariaLabel}
      placeholder={ariaLabel}
      rows={3}
      className="mt-3 min-h-20 w-full resize-none bg-transparent text-base leading-7 outline-none placeholder:text-muted-foreground"
    />
  );
}

function ObjectPageHeader({
  collectionsControl,
  customize,
  menu,
  entity,
  structure,
}: {
  readonly collectionsControl?: React.ReactNode;
  readonly customize?: React.ReactNode;
  readonly menu?: React.ReactNode;
  readonly entity: SupportedWorkspaceEntity;
  readonly structure: WorkspaceStructure;
}) {
  const t = useTranslations("workspace");
  const {
    changeWorkspaceEntityType,
    objectTypes,
    selectEntity,
    structures,
  } = useWorkspace();
  const definition =
    objectTypeDefinitionById[structure.iconName] ??
    objectTypeDefinitionById.page;
  const Icon = definition.icon;
  const objectType = objectTypes.find((item) => item.id === structure.id);
  const objectTypeLabel =
    objectType?.singularLabel ?? objectType?.label ?? structure.singularName;
  return (
    <div
      data-slot="workspace-object-page-header"
      className="group/object-page-header flex min-h-[26px] items-center gap-1.5"
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
        <CompoundChip className={objectIconToneBadgeClass[structure.tone]}>
          <CompoundChipPrimary
            onClick={() => selectEntity(entity.objectTypeId)}
          >
            <Icon className="mr-1 size-3.5 shrink-0" />
            <span className="truncate">{objectTypeLabel}</span>
          </CompoundChipPrimary>
          <ObjectPageTypePickerTrigger
            changeWorkspaceEntityType={changeWorkspaceEntityType}
            entity={entity}
            objectTypes={objectTypes}
            sourceStructure={structure}
            structures={structures}
          />
        </CompoundChip>
        {collectionsControl}
      </div>
      {customize}
      {menu ?? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t("actions.moreOptions")}
          className="h-[30px] w-[30px] rounded-lg border border-border"
        >
          <AppSidebarDotsIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}

function ObjectPageTypePickerTrigger({
  changeWorkspaceEntityType,
  entity,
  objectTypes,
  sourceStructure,
  structures,
}: {
  readonly changeWorkspaceEntityType: (
    id: string,
    objectTypeId: string,
    propertyValues?: Readonly<Record<string, unknown>>,
  ) => void;
  readonly entity: SupportedWorkspaceEntity;
  readonly objectTypes: ReturnType<typeof useWorkspace>["objectTypes"];
  readonly sourceStructure: WorkspaceStructure;
  readonly structures: readonly WorkspaceStructure[];
}) {
  const t = useTranslations("workspace");
  const [query, setQuery] = React.useState("");
  const [pendingConversion, setPendingConversion] = React.useState<{
    readonly initialPlan: ObjectConversionPlan;
    readonly target: WorkspaceStructure;
    readonly targetObjectTypeId: string;
  } | null>(null);
  const visibleChoices = objectTypes.filter((item) =>
    (item.singularLabel ?? item.label)
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  function beginTypeChange(objectTypeId: string) {
    if (objectTypeId === entity.objectTypeId) return;
    const target = structures.find(
      (structure) => structure.id === objectTypeId,
    );
    if (!target) return;
    setPendingConversion({
      initialPlan: createObjectConversionPlan(
        sourceStructure,
        target,
        entity.propertyValues,
      ),
      target,
      targetObjectTypeId: objectTypeId,
    });
  }
  return (
    <>
      <DropdownMenu onOpenChange={(open) => !open && setQuery("")}>
        <DropdownMenuTrigger
          render={
            <CompoundChipDisclosure
              aria-label={t("lifecycle.changeObjectType")}
            >
              <AppHeaderCaretDownIcon className="size-3.5" />
            </CompoundChipDisclosure>
          }
        />
        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={6}
          className="w-[253px] min-w-[253px] p-1.5"
        >
          <input
            aria-label={t("actions.search")}
            placeholder={t("actions.search")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mb-1 h-8 w-full rounded-lg bg-muted px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          {visibleChoices.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className="h-8 gap-2 px-1.5"
              onClick={() => beginTypeChange(item.id)}
            >
              <ObjectIconBadge
                icon={item.icon}
                tone={item.tone}
                variant="menu"
              />
              <span>{item.singularLabel ?? item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={Boolean(pendingConversion)}
        onOpenChange={(open) => !open && setPendingConversion(null)}
      >
        {pendingConversion ? (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("documentMenu.changeType")}</DialogTitle>
              <DialogDescription>
                Property conversion requires explicit resolution before the
                object type changes.
              </DialogDescription>
            </DialogHeader>
            <ObjectConversionPlanner
              initialPlan={pendingConversion.initialPlan}
              labels={{
                cancel: t("lifecycle.cancel"),
                commit: t("documentMenu.changeType"),
                discardValue: "Discard value",
                incompatible: "Incompatible",
                mapTo: "Map to",
                requiresConfirmation: "Requires confirmation",
                unresolved: "Unresolved",
              }}
              target={pendingConversion.target}
              onCancel={() => setPendingConversion(null)}
              onCommit={(conversion) => {
                changeWorkspaceEntityType(
                  entity.id,
                  pendingConversion.targetObjectTypeId,
                  conversion.propertyValues,
                );
                setPendingConversion(null);
              }}
            />
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}

function DocumentMoreMenu({
  onCustomize,
  onDelete,
  onExport,
  onImport,
}: {
  readonly onCustomize: () => void;
  readonly onDelete: () => void;
  readonly onExport: () => void;
  readonly onImport: () => void;
}) {
  const t = useTranslations("workspace");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("actions.moreOptions")}
            className="h-[30px] w-[30px] rounded-lg border border-border"
          >
            <AppSidebarDotsIcon className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        sideOffset={5}
        className={cn(
          workspaceOverflowMenuContentClass,
          "w-[269px] min-w-[269px] p-1.5",
        )}
      >
        <DropdownMenuItem
          className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          onClick={onCustomize}
        >
          {t("actions.customize")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          onClick={onExport}
        >
          <DownloadIcon className="size-4" />
          {t("documentMenu.export")}
          <DropdownMenuShortcut>CtrlE</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          onClick={onImport}
        >
          <UploadIcon className="size-4" />
          {t("documentMenu.import")}
          <DropdownMenuShortcut>CtrlI</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          onClick={onDelete}
        >
          {t("documentMenu.deleteObject")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
  const { createdEntities } = useWorkspace();
  const tags = entityTags(entity);
  const tagNamesById = new Map(
    createdEntities
      .filter((item) => item.kind === "tag")
      .map((item) => [item.id, item.title.trim() || item.id]),
  );
  return (
    <div
      data-slot="workspace-object-page-tags"
      className="mt-3 flex min-h-7 flex-wrap items-center gap-1.5"
    >
      {tags.map((tagId) => (
        <button
          key={tagId}
          type="button"
          className={tagChipClass}
          aria-label={`${t("objectTypeOverview.remove")} ${
            tagNamesById.get(tagId) ?? tagId
          }`}
          onClick={() =>
            update({ tags: tags.filter((item) => item !== tagId) })
          }
        >
          <span className="truncate">{tagNamesById.get(tagId) ?? tagId}</span>
        </button>
      ))}
      <label className="inline-flex min-w-0 items-center gap-1.5 px-1 text-sm text-muted-foreground">
        <ObjectTagIcon className="size-3.5" />
        <select
          aria-label={t("fields.tags")}
          multiple
          value={tags}
          className="min-w-0 bg-transparent outline-none"
          onChange={(event) =>
            update({
              tags: Array.from(event.currentTarget.selectedOptions).map(
                (option) => option.value,
              ),
            })
          }
        >
          {createdEntities
            .filter((item) => item.kind === "tag")
            .map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.title.trim() || tag.id}
              </option>
            ))}
        </select>
      </label>
    </div>
  );
}

function ObjectPageCollections({
  entity,
  update,
}: {
  readonly entity: SupportedWorkspaceEntity;
  readonly update: EntityUpdate;
}) {
  const t = useTranslations("workspace");
  const { objectTypeCollections } = useWorkspace();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const collections = entityCollections(entity);
  const choices = Object.values(objectTypeCollections).filter(
    (collection) => collection.structureId === entity.objectTypeId,
  );
  const visibleChoices = choices.filter((collection) =>
    collection.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  const collectionNames = new Map(
    choices.map((collection) => [collection.id, collection.name]),
  );
  const toggleCollection = (collectionId: string) => {
    update({
      collections: collections.includes(collectionId)
        ? collections.filter((item) => item !== collectionId)
        : [...collections, collectionId],
    });
  };
  return (
    <div className="inline-flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
      {collections.map((collectionId) => (
        <button
          key={collectionId}
          type="button"
          aria-label={`${t("objectTypeOverview.remove")} ${collectionNames.get(collectionId) ?? collectionId}`}
          onClick={() => toggleCollection(collectionId)}
          className={collectionChipClass}
        >
          <ObjectCollectionIcon className="mr-1.5 size-3.5 shrink-0" />
          <span className="truncate">{collectionNames.get(collectionId) ?? collectionId}</span>
        </button>
      ))}
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setQuery("");
        }}
      >
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={t("objects.collections")}
              className="h-7 min-w-0 gap-1.5 px-1.5 font-normal text-muted-foreground"
            >
              <ObjectCollectionIcon className="size-3.5" />
              {t("objects.collections")}
            </Button>
          }
        />
        <PopoverContent align="start" sideOffset={5} className="w-64 p-1.5">
          <input
            aria-label={t("actions.search")}
            placeholder={t("actions.search")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mb-1 h-8 w-full rounded-lg bg-muted px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          {visibleChoices.length > 0 ? (
            visibleChoices.map((collection) => (
              <button
                key={collection.id}
                type="button"
                aria-pressed={collections.includes(collection.id)}
                onClick={() => toggleCollection(collection.id)}
                className="flex h-8 w-full items-center rounded-md px-2 text-left text-sm hover:bg-muted"
              >
                <span className="truncate">{collection.name}</span>
                {collections.includes(collection.id) ? (
                  <span className="ml-auto text-xs text-muted-foreground">✓</span>
                ) : null}
              </button>
            ))
          ) : (
            <p className="px-2 py-2 text-sm text-muted-foreground">
              {t("documentMenu.noCollections")}
            </p>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

function PageCustomizeControl({
  wideLayout,
  onWideLayoutChange,
}: {
  readonly wideLayout: boolean;
  readonly onWideLayoutChange: (wideLayout: boolean) => void;
}) {
  const t = useTranslations("workspace");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={t("actions.customize")}
            className="hidden h-7 gap-1.5 px-1.5 text-sm font-normal text-muted-foreground sm:inline-flex"
          >
            {t("actions.customize")}
            <AppHeaderCaretDownIcon className="size-3.5" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" sideOffset={5} className="w-52 p-1.5">
        <DropdownMenuItem
          className={workspaceOverflowMenuItemClass}
          aria-checked={wideLayout}
          onClick={() => onWideLayoutChange(!wideLayout)}
        >
          <span>{t("documentMenu.wideLayout")}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {wideLayout ? "✓" : ""}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type DateInputPropertyValue = {
  readonly allDay: boolean;
  readonly start: string;
  readonly timeZone: string;
};

function isDateInputPropertyValue(
  value: unknown,
): value is DateInputPropertyValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "allDay" in value &&
    "start" in value &&
    "timeZone" in value &&
    typeof value.start === "string" &&
    typeof value.timeZone === "string"
  );
}

function formatDateInputPropertyValue(value: DateInputPropertyValue): string {
  if (value.allDay) return `${value.start}T00:00`;
  const date = new Date(value.start);
  if (!Number.isFinite(date.valueOf())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    timeZone: value.timeZone,
    year: "numeric",
  }).formatToParts(date);
  const byType = new Map(parts.map((part) => [part.type, part.value]));
  return `${byType.get("year")}-${byType.get("month")}-${byType.get("day")}T${byType.get("hour")}:${byType.get("minute")}`;
}

function propertyInputValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(propertyInputValue).join(", ");
  return isDateInputPropertyValue(value)
    ? formatDateInputPropertyValue(value)
    : "";
}

function BufferedWorkspacePropertyInput({
  inputId,
  inputType,
  onCommit,
  value,
}: {
  readonly inputId: string;
  readonly inputType: string;
  readonly onCommit: (value: unknown) => void;
  readonly value: unknown;
}) {
  const { inputProps } = useBufferedTextCommit({
    format: propertyInputValue,
    onCommit,
    value,
  });
  return (
    <input
      {...inputProps}
      id={inputId}
      type={inputType}
      className="min-h-8 w-full min-w-0 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-foreground outline-none hover:border-border focus:border-ring"
    />
  );
}

function WorkspacePropertyField({
  entity,
  property,
  updateProperty,
}: {
  readonly entity: SupportedWorkspaceEntity;
  readonly property: WorkspaceStructure["propertyDefinitions"][number];
  readonly updateProperty: EntityPropertyUpdate;
}) {
  const { createdEntities, setLinkedEntityPropertyValue } = useWorkspace();
  const inputId = React.useId();
  const value = readWorkspaceEntityProperty(entity, property.id);
  if (property.valueType === "entity") {
    const relation = entity.propertyValues[property.id];
    const selectedIds =
      relation?.type === "entity"
        ? relation.entity.map((target) => target.id)
        : [];
    const candidates = createdEntities.filter((candidate) => {
      if (candidate.id === entity.id) return false;
      if (
        property.targetStructureIds?.length &&
        !property.targetStructureIds.includes(candidate.objectTypeId)
      ) {
        return false;
      }
      return (
        !property.fixedTargetObjectIds?.length ||
        property.fixedTargetObjectIds.includes(candidate.id)
      );
    });
    return (
      <label
        htmlFor={inputId}
        data-slot="workspace-entity-property"
        data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
        className="grid min-h-8 grid-cols-[8rem_minmax(0,1fr)] items-center gap-3 text-sm"
      >
        <span className="truncate text-muted-foreground">{property.name}</span>
        <select
          id={inputId}
          aria-label={property.name}
          multiple={property.multiple}
          value={property.multiple ? selectedIds : (selectedIds[0] ?? "")}
          className="min-h-8 w-full min-w-0 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-foreground outline-none hover:border-border focus:border-ring"
          onChange={(event) => {
            const targetIds = Array.from(
              event.currentTarget.selectedOptions,
            ).map((option) => option.value);
            setLinkedEntityPropertyValue(
              entity.id,
              property.id,
              property.multiple ? targetIds : (targetIds[0] ?? []),
            );
          }}
        >
          {!property.multiple && <option value="" />}
          {candidates.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.title.trim() || candidate.id}
            </option>
          ))}
        </select>
      </label>
    );
  }
  if (property.valueType === "boolean") {
    return (
      <label
        data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
        className="flex min-h-8 items-center justify-between gap-3 rounded-md px-2 text-sm"
      >
        <span className="truncate text-muted-foreground">{property.name}</span>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) =>
            updateProperty(property.id, event.target.checked)
          }
        />
      </label>
    );
  }
  const inputType =
    property.valueType === "number"
      ? "number"
      : property.valueType === "date"
        ? "datetime-local"
        : property.valueType === "url"
          ? "url"
          : "text";
  return (
    <label
      htmlFor={inputId}
      data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
      className="grid min-h-8 grid-cols-[8rem_minmax(0,1fr)] items-center gap-3 text-sm"
    >
      <span className="truncate text-muted-foreground">{property.name}</span>
      <BufferedWorkspacePropertyInput
        inputId={inputId}
        inputType={inputType}
        value={value}
        onCommit={(draft) => {
          const text = String(draft);
          updateProperty(
            property.id,
            property.valueType === "number"
              ? Number(text)
              : property.valueType === "date"
                ? {
                    allDay: false,
                    start: text,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  }
                : text,
          );
        }}
      />
    </label>
  );
}

function WorkspacePropertyGroup({
  entity,
  structure,
  updateProperty,
}: {
  readonly entity: SupportedWorkspaceEntity;
  readonly structure: WorkspaceStructure;
  readonly updateProperty: EntityPropertyUpdate;
}) {
  const editableProperties = structure.propertyDefinitions.filter(
    (property) =>
      property.writable &&
      property.ownership !== "system" &&
      !["title", "tags"].includes(property.id) &&
      ["text", "number", "boolean", "date", "url", "entity"].includes(
        property.valueType,
      ),
  );
  if (editableProperties.length === 0) return null;
  return (
    <div
      data-slot="workspace-property-group"
      data-lifecycle-contract={objectLifecycleContractSlots.ObjectFieldGroup}
      className="mt-5 grid gap-1"
    >
      {editableProperties.map((property) => (
        <WorkspacePropertyField
          key={property.id}
          entity={entity}
          property={property}
          updateProperty={updateProperty}
        />
      ))}
    </div>
  );
}

function RelatedContent({ entityId }: { readonly entityId: string }) {
  const t = useTranslations("workspace");
  const { createdEntities, objectTypes, selectEntity } = useWorkspace();
  const related = createdEntities
    .filter((item) => item.id !== entityId)
    .slice(0, 3);
  if (related.length === 0) return null;
  return (
    <section
      data-slot="workspace-object-related-content"
      className="mt-24 border-t pt-8"
      aria-labelledby={`${entityId}-related-heading`}
    >
      <h2
        id={`${entityId}-related-heading`}
        className="mb-4 inline-flex items-center gap-2 text-base font-semibold"
      >
        {t("explore.relatedContent")}
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {related.length}
        </span>
      </h2>
      <div className="grid gap-1">
        {related.map((item) => {
          const objectType = objectTypes.find(
            (candidate) => candidate.id === item.objectTypeId,
          );
          const Icon = objectType?.icon ?? objectTypeDefinitionById.page.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={cn(workspaceListRowClass, "min-h-11")}
              onClick={() => selectEntity(item.id)}
            >
              <AppHeaderCaretDownIcon className="size-3 -rotate-90 text-muted-foreground" />
              <ObjectIconBadge
                icon={Icon}
                tone={objectType?.tone ?? "blue"}
                className="size-5 rounded-md"
                iconClassName="size-3.5"
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {item.title || t("lifecycle.untitled")}
              </span>
              {objectType ? (
                <span className="hidden rounded-md border px-2 py-1 text-xs text-muted-foreground group-hover:inline-flex">
                  {objectType.singularLabel ?? objectType.label}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function getEntityTitle(entity: WorkspaceEntity | undefined, fallback: string) {
  return entity?.title.trim() || fallback;
}

function isDocumentWorkspaceEntity(
  entity: WorkspaceEntity | undefined,
): entity is DocumentWorkspaceEntity {
  return entity?.kind === "document" || entity?.kind === "quote";
}

function ReferenceList({
  emptyLabel,
  items,
  title,
}: {
  readonly emptyLabel: string;
  readonly items: readonly {
    id: string;
    label: string;
    meta: string;
    onClick?: () => void;
  }[];
  readonly title: string;
}) {
  return (
    <section className="grid gap-2">
      <h3 className="text-sm font-medium">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="grid gap-1">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(workspaceListRowClass, "min-h-10")}
              onClick={item.onClick}
            >
              <span className="min-w-0 flex-1 truncate text-left text-sm">
                {item.label}
              </span>
              <span className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
                {item.meta}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function editorLabels(t: ReturnType<typeof useTranslations<"workspace">>) {
  return {
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
  };
}

function ReferencePanel({
  entity,
  update,
}: {
  readonly entity: DocumentWorkspaceEntity;
  readonly update: EntityUpdate;
}) {
  const t = useTranslations("workspace");
  const { createdEntities, objectTypes, selectEntity, updateWorkspaceEntity } =
    useWorkspace();
  const linkIndex = React.useMemo(
    () => createWorkspaceObjectLinkIndex(createdEntities),
    [createdEntities],
  );
  const propertyEdges = React.useMemo(
    () => selectPropertyRelationGraphEdges(createdEntities),
    [createdEntities],
  );
  const backlinks = selectBacklinksForObject(linkIndex, entity.id);
  const objectsInside = selectObjectsInside(linkIndex, entity.id);
  const graphEdges = selectContextualGraphEdges(linkIndex, entity.id);
  const backlinkPreviewSources = backlinks.reduce<DocumentWorkspaceEntity[]>(
    (sources, backlink) => {
      if (sources.some((source) => source.id === backlink.sourceId)) {
        return sources;
      }
      const source = createdEntities.find(
        (candidate) => candidate.id === backlink.sourceId,
      );
      if (isDocumentWorkspaceEntity(source)) sources.push(source);
      return sources;
    },
    [],
  );
  const mentionCandidates = findUnlinkedMentionCandidates(
    createdEntities,
    entity.id,
  );
  const linkableEntities = createdEntities.filter(
    (item) => item.id !== entity.id,
  );

  function appendReference(targetId: string) {
    const target = createdEntities.find((item) => item.id === targetId);
    if (!target) return;
    update({
      body: {
        ...entity.body,
        doc: {
          ...entity.body.doc,
          content: [
            ...entity.body.doc.content,
            {
              type: "paragraph",
              attrs: { id: `${entity.id}-link-${targetId}` },
              content: [
                {
                  type: "text",
                  text: getEntityTitle(target, targetId),
                  marks: [createObjectReferenceMark(targetId)],
                },
              ],
            },
          ],
        },
      },
    });
  }

  function appendEmbed(targetId: string) {
    update({
      body: {
        ...entity.body,
        doc: {
          ...entity.body.doc,
          content: [
            ...entity.body.doc.content,
            {
              type: "paragraph",
              attrs: { id: `${entity.id}-embed-${targetId}` },
              content: [createObjectEmbedNode(targetId)],
            },
          ],
        },
      },
    });
  }

  return (
    <section
      data-slot="workspace-object-linking"
      className="mt-16 grid gap-6 border-t pt-8"
      aria-labelledby={`${entity.id}-linking-heading`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id={`${entity.id}-linking-heading`}
          className="text-base font-semibold"
        >
          {t("linking.title")}
        </h2>
        <span
          data-slot="workspace-reference-count"
          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
        >
          {t("linking.references", { count: backlinks.length })}
        </span>
      </div>

      {linkableEntities.length > 0 ? (
        <div className="flex flex-wrap gap-2" data-slot="workspace-link-picker">
          {linkableEntities.slice(0, 6).map((target) => (
            <div key={target.id} className="inline-flex rounded-lg border">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-r-none"
                onClick={() => appendReference(target.id)}
              >
                {t("linking.linkObject", {
                  title: getEntityTitle(target, t("lifecycle.untitled")),
                })}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-l-none border-l"
                onClick={() => appendEmbed(target.id)}
              >
                {t("linking.embed")}
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <ReferenceList
          emptyLabel={t("linking.noBacklinks")}
          items={backlinks.map((item) => ({
            id: `${item.sourceId}-${item.kind}-${item.blockId ?? "object"}`,
            label: item.missing
              ? t("linking.missingTarget", { id: item.targetId })
              : item.sourceTitle,
            meta: item.kind,
            onClick: () => selectEntity(item.sourceId),
          }))}
          title={t("explore.backlinks")}
        />
        <ReferenceList
          emptyLabel={t("linking.noObjectsInside")}
          items={objectsInside.map((item) => {
            const target = createdEntities.find(
              (candidate) => candidate.id === item.targetId,
            );
            return {
              id: `${item.targetId}-${item.kind}-${item.targetBlockId ?? "object"}`,
              label: item.missing
                ? t("linking.missingTarget", { id: item.targetId })
                : getEntityTitle(target, item.targetId),
              meta: item.kind,
              onClick: target ? () => selectEntity(target.id) : undefined,
            };
          })}
          title={t("explore.objectsInside")}
        />
      </div>

      {backlinkPreviewSources.map((source) => (
        <section
          key={`${source.id}-readonly-backlink`}
          data-slot="workspace-readonly-backlink-preview"
          className="grid gap-2 border-l pl-3"
        >
          <h3 className="truncate text-sm font-medium">
            {getEntityTitle(source, t("lifecycle.untitled"))}
          </h3>
          <BlockEditor
            ariaLabel={t("fields.text")}
            placeholder={t("fields.text")}
            value={source.body}
            editable={false}
            className="mt-0 min-h-0"
            labels={editorLabels(t)}
          />
        </section>
      ))}

      {objectsInside
        .filter((item) => item.kind === "embed" && !item.missing)
        .map((item) => {
          const target = createdEntities.find(
            (candidate) => candidate.id === item.targetId,
          );
          if (
            !target ||
            (target.kind !== "document" && target.kind !== "quote")
          ) {
            return null;
          }
          const objectType = objectTypes.find(
            (candidate) => candidate.id === target.objectTypeId,
          );
          return (
            <section
              key={`${item.targetId}-embed`}
              data-slot="workspace-object-transclusion"
              className="rounded-lg border bg-muted/20 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="truncate text-sm font-medium">
                  {getEntityTitle(target, t("lifecycle.untitled"))}
                </h3>
                {objectType ? (
                  <span className="text-xs text-muted-foreground">
                    {objectType.singularLabel ?? objectType.label}
                  </span>
                ) : null}
              </div>
              <BlockEditor
                ariaLabel={t("linking.editTransclusion")}
                placeholder={t("fields.text")}
                value={target.body}
                onChange={(body) => updateWorkspaceEntity(target.id, { body })}
                className="mt-0 min-h-20"
                labels={editorLabels(t)}
              />
            </section>
          );
        })}

      <ReferenceList
        emptyLabel={t("linking.noGraphEdges")}
        items={[
          ...graphEdges,
          ...propertyEdges.filter(
            (edge) => edge.from === entity.id || edge.to === entity.id,
          ),
        ].map((edge) => ({
          id: edge.id,
          label: `${getEntityTitle(
            createdEntities.find((item) => item.id === edge.from),
            edge.from,
          )} -> ${getEntityTitle(
            createdEntities.find((item) => item.id === edge.to),
            edge.to,
          )}`,
          meta: edge.kind,
          onClick: () =>
            selectEntity(edge.from === entity.id ? edge.to : edge.from),
        }))}
        title={t("explore.graphView")}
      />

      {mentionCandidates.length > 0 ? (
        <div className="grid gap-2" data-slot="workspace-unlinked-mentions">
          <h3 className="text-sm font-medium">
            {t("linking.unlinkedMentions")}
          </h3>
          {mentionCandidates.map((candidate) => (
            <button
              key={candidate.targetId}
              type="button"
              className={cn(workspaceListRowClass, "min-h-10")}
              onClick={() => appendReference(candidate.targetId)}
            >
              <span className="min-w-0 flex-1 truncate text-left text-sm">
                {candidate.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {t("linking.convertMention")}
              </span>
            </button>
          ))}
        </div>
      ) : null}
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
  const importInputRef = React.useRef<HTMLInputElement>(null);
  const [customizeOpen, setCustomizeOpen] = React.useState(false);
  const {
    createWorkspacePage,
    deleteWorkspaceEntity,
    setWorkspaceEntityPropertyValue,
    showMessage,
  } = useWorkspace();

  function exportMarkdown() {
    const source = `# ${entity.title}\n\n${blockEditorDocumentToMarkdown(entity.body)}`;
    const url = URL.createObjectURL(
      new Blob([source], { type: "text/markdown" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${entity.title || "page"}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    showMessage(t("documentMenu.exported"));
  }

  async function importMarkdown(file: File | undefined) {
    if (!file) return;
    const text = await file.text();
    const normalized = text.replace(/\r\n?/g, "\n");
    const isMarkdown = file.name.toLowerCase().endsWith(".md");
    const titleMatch = isMarkdown
      ? normalized.match(/^#\s+(.+?)(?:\n+|$)/)
      : null;
    update({
      ...(titleMatch ? { title: titleMatch[1].trim() } : {}),
      body: isMarkdown
        ? blockEditorDocumentFromMarkdown(
            titleMatch ? normalized.slice(titleMatch[0].length) : normalized,
          )
        : blockEditorDocumentFromPlainText(normalized),
    });
    showMessage(t("documentMenu.imported"));
  }

  return (
    <>
      <ObjectPageHeader
        entity={entity}
        structure={structure}
        collectionsControl={<ObjectPageCollections entity={entity} update={update} />}
        customize={
          <PageCustomizeControl
            wideLayout={entity.wideLayout === true}
            onWideLayoutChange={(wideLayout) => update({ wideLayout })}
          />
        }
        menu={
          <DocumentMoreMenu
            onCustomize={() => setCustomizeOpen(true)}
            onDelete={() => deleteWorkspaceEntity(entity.id)}
            onExport={exportMarkdown}
            onImport={() => importInputRef.current?.click()}
          />
        }
      />
      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("actions.customize")}</DialogTitle>
            <DialogDescription>{t("documentMenu.wideLayout")}</DialogDescription>
          </DialogHeader>
          <Button
            type="button"
            variant={entity.wideLayout === true ? "default" : "outline"}
            aria-pressed={entity.wideLayout === true}
            onClick={() => update({ wideLayout: !(entity.wideLayout === true) })}
          >
            {t("documentMenu.wideLayout")}
          </Button>
        </DialogContent>
      </Dialog>
      <BufferedTitle
        label={t("fields.title")}
        value={entity.title}
        onCommit={(title) => update({ title })}
      />
      <ObjectPageTags entity={entity} update={update} />
      <WorkspacePropertyGroup
        entity={entity}
        structure={structure}
        updateProperty={(propertyId, value) =>
          setWorkspaceEntityPropertyValue(entity.id, propertyId, value)
        }
      />
      <div
        data-slot="workspace-document-page-editor"
        data-lifecycle-contract={
          objectLifecycleContractSlots.EditableObjectBody
        }
      >
        <BlockEditor
          ariaLabel={
            entity.kind === "quote"
              ? t("fields.quoteContent")
              : t("fields.text")
          }
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
      <input
        ref={importInputRef}
        type="file"
        accept=".md,.txt,text/plain,text/markdown"
        className="hidden"
        onChange={(event) => void importMarkdown(event.target.files?.[0])}
      />
      <ReferencePanel entity={entity} update={update} />
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
  const { setWorkspaceEntityPropertyValue } = useWorkspace();
  const cells = [...entity.cells].sort(
    (left, right) => left.row - right.row || left.column - right.column,
  );
  return (
    <>
      <ObjectPageHeader
        entity={entity}
        structure={structure}
        collectionsControl={<ObjectPageCollections entity={entity} update={update} />}
      />
      <BufferedTitle
        label={t("fields.title")}
        value={entity.title}
        onCommit={(title) => update({ title })}
      />
      <ObjectPageTags entity={entity} update={update} />
      <WorkspacePropertyGroup
        entity={entity}
        structure={structure}
        updateProperty={(propertyId, value) =>
          setWorkspaceEntityPropertyValue(entity.id, propertyId, value)
        }
      />
      <div
        data-slot="workspace-table-grid"
        className={cn(
          workspaceListSurfaceClass,
          "mt-9 grid w-full max-w-[22.5rem] grid-cols-2 p-0",
        )}
      >
        {cells.map((cell) => (
          <BufferedTableCell
            key={cell.id}
            ariaLabel={t("lifecycle.table.cell", {
              column: cell.column + 1,
              row: cell.row + 1,
            })}
            value={cell.value}
            onCommit={(value) =>
              update({
                cells: entity.cells.map((item) =>
                  item.id === cell.id ? { ...item, value } : item,
                ),
              })
            }
          />
        ))}
      </div>
      <section
        className={cn(workspaceFieldGroupClass, "mt-10")}
        aria-labelledby={`${entity.id}-notes-heading`}
      >
        <h2
          id={`${entity.id}-notes-heading`}
          className="text-base font-semibold"
        >
          {t("lifecycle.table.notes")}
        </h2>
        <BufferedNotes
          ariaLabel={t("lifecycle.table.notes")}
          value={entity.notes}
          onCommit={(notes) => update({ notes })}
        />
      </section>
      <RelatedContent entityId={entity.id} />
    </>
  );
}

function WorkspaceObjectPageView({ entity }: WorkspaceObjectPageViewProps) {
  const t = useTranslations("workspace");
  const { structures, updateWorkspaceEntity } = useWorkspace();
  const [collapsed, setCollapsed] = React.useState(false);
  const wideLayout = "wideLayout" in entity && entity.wideLayout === true;
  const structure = resolveStructure(entity, structures);
  if (!structure) return null;
  const update: EntityUpdate = (patch) =>
    updateWorkspaceEntity(entity.id, patch);
  return (
    <section
      data-slot="workspace-object-page-view"
      data-lifecycle-contract={objectLifecycleContractSlots.ObjectEditorShell}
      data-object-kind={entity.kind}
      data-object-type={entity.objectTypeId}
      className={cn(workspaceRouteClass, "w-full overflow-y-auto")}
    >
      <div
        className={cn(
          workspaceLongformColumnClass,
          wideLayout && "lg:max-w-[72rem]",
          "lg:pt-24",
          collapsed && "hidden",
        )}
      >
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
        aria-label={t(
          collapsed ? "actions.expandEditor" : "actions.collapseEditor",
        )}
        aria-expanded={!collapsed}
        className="absolute right-3 top-1/2 hidden h-7 w-7 text-lg font-light md:inline-flex"
        onClick={() => setCollapsed((current) => !current)}
      >
        <span aria-hidden>{collapsed ? "+" : "−"}</span>
      </Button>
    </section>
  );
}

function canRenderWorkspaceObjectPage(
  entity: WorkspaceEntity | undefined,
): entity is SupportedWorkspaceEntity {
  return (
    entity?.kind === "document" ||
    entity?.kind === "quote" ||
    entity?.kind === "table"
  );
}

export type { WorkspaceObjectPageViewProps };
export { canRenderWorkspaceObjectPage, WorkspaceObjectPageView };
