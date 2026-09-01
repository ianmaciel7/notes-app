"use client";

import { ArrowSquareOutIcon as ExternalLinkIcon } from "@phosphor-icons/react/dist/csr/ArrowSquareOut";
import { ArrowsOutSimpleIcon as ExpandIcon } from "@phosphor-icons/react/dist/csr/ArrowsOutSimple";
import { CalendarDotsIcon as CalendarClockIcon } from "@phosphor-icons/react/dist/csr/CalendarDots";
import { ChartBarIcon as BarChart3Icon } from "@phosphor-icons/react/dist/csr/ChartBar";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { CheckSquareIcon } from "@phosphor-icons/react/dist/csr/CheckSquare";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { CursorClickIcon as MousePointer2Icon } from "@phosphor-icons/react/dist/csr/CursorClick";
import { DownloadSimpleIcon as DownloadIcon } from "@phosphor-icons/react/dist/csr/DownloadSimple";
import { FileTextIcon as FilePenLineIcon } from "@phosphor-icons/react/dist/csr/FileText";
import { ImageSquareIcon as ImageIcon } from "@phosphor-icons/react/dist/csr/ImageSquare";
import { LinkIcon } from "@phosphor-icons/react/dist/csr/Link";
import { ListBulletsIcon as ListIcon } from "@phosphor-icons/react/dist/csr/ListBullets";
import { ListNumbersIcon as ListChecksIcon } from "@phosphor-icons/react/dist/csr/ListNumbers";
import { MagicWandIcon as WandSparklesIcon } from "@phosphor-icons/react/dist/csr/MagicWand";
import { MagnifyingGlassIcon as SearchIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { PresentationChartIcon as PresentationIcon } from "@phosphor-icons/react/dist/csr/PresentationChart";
import { PushPinIcon as PinIcon } from "@phosphor-icons/react/dist/csr/PushPin";
import { ShapesIcon } from "@phosphor-icons/react/dist/csr/Shapes";
import { ShareNetworkIcon as Share2Icon } from "@phosphor-icons/react/dist/csr/ShareNetwork";
import { SlidersHorizontalIcon as Settings2Icon } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import { SmileyIcon as SmileIcon } from "@phosphor-icons/react/dist/csr/Smiley";
import { SparkleIcon as SparklesIcon } from "@phosphor-icons/react/dist/csr/Sparkle";
import { TextAlignLeftIcon as AlignLeftIcon } from "@phosphor-icons/react/dist/csr/TextAlignLeft";
import { TextTIcon as TypeIcon } from "@phosphor-icons/react/dist/csr/TextT";
import { TrashIcon as Trash2Icon } from "@phosphor-icons/react/dist/csr/Trash";
import { UploadSimpleIcon as UploadIcon } from "@phosphor-icons/react/dist/csr/UploadSimple";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import {
  AppHeaderCaretDownIcon,
  AppHeaderCustomizeIcon,
  AppHeaderDotsIcon,
} from "@/components/app-header-icons";
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
import { MediaAssetRenderer } from "@/components/object-view-preview";
import { NumberValueDisplay } from "@/components/object-view-support";
import { Button, buttonVariants } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { selectEditorUtilities } from "@/lib/editor-utilities";
import { cn } from "@/lib/utils";
import { createCollectionId } from "@/lib/workspace-domain-identities";
import {
  convertUnlinkedMentionCandidate,
  createWorkspaceObjectLinkIndex,
  findUnlinkedMentionCandidates,
  selectBacklinksForObject,
  selectObjectsInside,
} from "@/lib/workspace-object-links";
import type {
  NumberPresentation,
  NumberPresentationColor,
  PropertyDefinition,
  PropertyValueType,
  WorkspaceStructure,
} from "@/lib/workspace-object-types";
import { selectObjectTypeConversionTargets } from "@/lib/workspace-object-types";
import {
  createObjectConversionPlan,
  type ObjectConversionPlan,
  readWorkspaceEntityProperty,
} from "@/lib/workspace-object-views";
import {
  acceptsFileForType,
  type WorkspaceEntity,
} from "@/lib/workspace-objects";
import {
  formatNumberValue,
  parseNumberInput,
} from "@/lib/workspace-property-values";
import {
  RELATED_CONTENT_PANEL_LIMIT,
  type RelatedContentState,
  selectRelatedContent,
} from "@/lib/workspace-related-content";
import {
  createFormulaTable,
  createFormulaValue,
  errorDisplay,
  evaluateFormulaTable,
  exportFormulaCell,
  type FormulaErrorCode,
  type FormulaTable,
  type FormulaTableCell,
  type FormulaValue,
  formatNumber,
  isFormulaCell,
} from "@/lib/workspace-table-formulas";

type DocumentWorkspaceEntity =
  | Extract<WorkspaceEntity, { kind: "document" }>
  | Extract<WorkspaceEntity, { kind: "quote" }>;
type TableWorkspaceEntity = Extract<WorkspaceEntity, { kind: "table" }>;
type TableWorkspaceCell = TableWorkspaceEntity["cells"][number];
type FileWorkspaceEntity = Extract<WorkspaceEntity, { kind: "file" }>;
type SupportedWorkspaceEntity =
  | DocumentWorkspaceEntity
  | FileWorkspaceEntity
  | TableWorkspaceEntity;

type WorkspaceObjectPageViewProps = {
  readonly entity: SupportedWorkspaceEntity;
};

type EntityUpdate = (patch: Record<string, unknown>) => void;
type EntityPropertyUpdate = (propertyId: string, value: unknown) => void;

const tagChipClass =
  "inline-flex max-w-full items-center rounded-[0.475em] border border-[oklch(0.9669_0.0659_122.38)] bg-[oklch(0.9669_0.0659_122.38)] px-[0.49em] py-[0.2em] text-sm leading-[1.3] text-[oklch(0.3653_0.0648_128.67)]";
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
      className="mt-[14px] block min-h-[39px] w-full bg-transparent text-[30px] font-bold leading-[33px] tracking-[-0.02em] text-foreground outline-none placeholder:text-muted-foreground/50"
    />
  );
}

function BufferedTableCell({
  ariaLabel,
  displayValue,
  errorDescription,
  formulaMode,
  onCommit,
  references,
  suggestions,
  value,
}: {
  readonly ariaLabel: string;
  readonly displayValue: string | null;
  readonly errorDescription: string | null;
  readonly formulaMode: boolean;
  readonly onCommit: (value: string) => void;
  readonly references: readonly string[];
  readonly suggestions: readonly string[];
  readonly value: FormulaValue | string;
}) {
  const formatValue = React.useCallback(
    (cellValue: FormulaValue | string) =>
      isFormulaCell(cellValue) ? cellValue.source : cellValue,
    [],
  );
  const formattedValue = formatValue(value);
  const { commitNow, inputProps, setDraft } = useBufferedTextCommit({
    value: formattedValue,
    onCommit,
  });
  const [focused, setFocused] = React.useState(false);
  const describedBy = `${React.useId()}-formula`;
  const showFormulaAssist =
    focused && (formulaMode || inputProps.value.trimStart().startsWith("="));
  return (
    <div
      data-slot="workspace-table-cell-shell"
      data-formula-mode={formulaMode}
      className="min-h-20 min-w-0 border-b border-r px-3 py-2 even:border-r-0 [&:nth-last-child(-n+2)]:border-b-0"
    >
      <input
        {...inputProps}
        data-slot="workspace-table-cell"
        data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
        aria-describedby={formulaMode ? describedBy : undefined}
        aria-label={ariaLabel}
        className="min-h-6 w-full min-w-0 bg-transparent text-sm outline-none focus:bg-muted/30"
        onBlur={() => {
          inputProps.onBlur();
          setFocused(false);
        }}
        onFocus={() => {
          inputProps.onFocus();
          setFocused(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitNow();
            event.currentTarget.blur();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            setDraft(formattedValue);
            event.currentTarget.blur();
          }
        }}
      />
      {displayValue ? (
        <div
          id={describedBy}
          data-slot="workspace-table-formula-result"
          className={cn(
            "mt-1 truncate text-xs",
            errorDescription ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {displayValue}
          {errorDescription ? ` - ${errorDescription}` : ""}
        </div>
      ) : null}
      {references.length > 0 ? (
        <div
          data-slot="workspace-table-formula-references"
          className="mt-1 flex flex-wrap gap-1"
        >
          {references.map((reference) => (
            <span
              key={reference}
              className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary"
            >
              {reference}
            </span>
          ))}
        </div>
      ) : null}
      {showFormulaAssist ? (
        <div
          data-slot="workspace-table-formula-suggestions"
          className="mt-2 grid gap-1 text-[11px] text-muted-foreground"
        >
          {suggestions.map((suggestion) => (
            <div key={suggestion}>{suggestion}</div>
          ))}
        </div>
      ) : null}
    </div>
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
  const { changeWorkspaceEntityType, objectTypes, selectEntity, structures } =
    useWorkspace();
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
          className="h-[26px] w-[26px] rounded-lg border border-border"
        >
          <AppHeaderDotsIcon className="size-3.5" />
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
  const objectTypesById = new Map(objectTypes.map((item) => [item.id, item]));
  const eligibleChoices = selectObjectTypeConversionTargets(
    structures,
    sourceStructure.id,
  ).flatMap((structure) => {
    const item = objectTypesById.get(structure.id);
    return item ? [item] : [];
  });
  const visibleChoices = eligibleChoices.filter((item) =>
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
          {visibleChoices.length === 0 ? (
            <p
              role="status"
              data-slot="object-page-type-picker-empty"
              className="px-2 py-3 text-center text-sm text-muted-foreground"
            >
              {t("documentMenu.noMatchingObjectTypes")}
            </p>
          ) : null}
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
                {t("objectConversion.description")}
              </DialogDescription>
            </DialogHeader>
            <ObjectConversionPlanner
              initialPlan={pendingConversion.initialPlan}
              labels={{
                cancel: t("lifecycle.cancel"),
                commit: t("documentMenu.changeType"),
                discardValue: t("objectConversion.discardValue"),
                incompatible: t("objectConversion.incompatible"),
                mapTo: t("objectConversion.mapTo"),
                requiresConfirmation: t(
                  "objectConversion.requiresConfirmation",
                ),
                unresolved: t("objectConversion.unresolved"),
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
  onChangeType,
  onCustomize,
  onDelete,
  onDuplicate,
  onEditCollections,
  onExport,
  onFind,
  onImport,
  onPin,
  onPresent,
  onShare,
  onStats,
  onTypeSettings,
  onUseTemplate,
  onCopy,
  onToggleWideLayout,
  isPinned,
  wideLayout,
}: {
  readonly isPinned: boolean;
  readonly onCustomize: () => void;
  readonly onChangeType: () => void;
  readonly onDelete: () => void;
  readonly onDuplicate: () => void;
  readonly onEditCollections?: () => void;
  readonly onExport: () => void;
  readonly onFind?: () => void;
  readonly onImport: () => void;
  readonly onPin: () => void;
  readonly onPresent: () => void;
  readonly onShare: () => void;
  readonly onStats: () => void;
  readonly onTypeSettings: () => void;
  readonly onUseTemplate: () => void;
  readonly onCopy: () => void;
  readonly onToggleWideLayout?: () => void;
  readonly wideLayout?: boolean;
}) {
  const t = useTranslations("workspace");
  const primaryItems: readonly {
    readonly handler: () => void;
    readonly Icon: React.ElementType;
    readonly key: string;
  }[] = [
    { key: "useTemplate", handler: onUseTemplate, Icon: FilePenLineIcon },
    ...(onEditCollections
      ? [
          {
            key: "editCollections",
            handler: onEditCollections,
            Icon: ObjectCollectionIcon,
          },
        ]
      : []),
    {
      key: isPinned ? "unpinSidebar" : "pinSidebar",
      handler: onPin,
      Icon: PinIcon,
    },
    { key: "changeType", handler: onChangeType, Icon: ShapesIcon },
    { key: "typeSettings", handler: onTypeSettings, Icon: Settings2Icon },
    { key: "share", handler: onShare, Icon: Share2Icon },
    { key: "present", handler: onPresent, Icon: PresentationIcon },
  ];
  const secondaryItems: readonly {
    readonly handler: () => void;
    readonly Icon: React.ElementType;
    readonly key: string;
  }[] = [
    { key: "textStats", handler: onStats, Icon: BarChart3Icon },
    { key: "copy", handler: onCopy, Icon: CopyIcon },
    { key: "duplicate", handler: onDuplicate, Icon: CopyIcon },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        aria-label={t("actions.moreOptions")}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "h-[26px] w-[26px] rounded-lg border border-border",
        )}
      >
        <AppHeaderDotsIcon className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={5}
        className={cn(
          workspaceOverflowMenuContentClass,
          "w-[269px] min-w-[269px] p-1.5",
        )}
      >
        {onFind ? (
          <DropdownMenuItem
            className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
            onClick={onFind}
          >
            <SearchIcon aria-hidden="true" className="size-4" />
            {t("documentMenu.findPage")}
            <DropdownMenuShortcut>CtrlF</DropdownMenuShortcut>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          >
            <Settings2Icon aria-hidden="true" className="size-4" />
            {t("actions.customize")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {onToggleWideLayout ? (
              <DropdownMenuItem
                className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
                onClick={onToggleWideLayout}
              >
                {t("documentMenu.wideLayout")}
                {wideLayout ? <CheckIcon className="ml-auto size-4" /> : null}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
                onClick={onCustomize}
              >
                <Settings2Icon aria-hidden="true" className="size-4" />
                {t("documentMenu.customizeHint")}
              </DropdownMenuItem>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        {primaryItems.map(({ key, handler, Icon }) => (
          <DropdownMenuItem
            key={key}
            className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
            onClick={handler}
          >
            <Icon aria-hidden="true" className="size-4" />
            {t(`documentMenu.${key}`)}
            {key === "pinSidebar" || key === "unpinSidebar" ? (
              <DropdownMenuShortcut>Ctrl⇧*</DropdownMenuShortcut>
            ) : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          onClick={onExport}
        >
          <DownloadIcon aria-hidden="true" className="size-4" />
          {t("documentMenu.export")}
          <DropdownMenuShortcut>CtrlE</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          onClick={onImport}
        >
          <UploadIcon aria-hidden="true" className="size-4" />
          {t("documentMenu.import")}
          <DropdownMenuShortcut>CtrlI</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {secondaryItems.map(({ key, handler, Icon }) => (
          <DropdownMenuItem
            key={key}
            className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
            onClick={handler}
          >
            <Icon aria-hidden="true" className="size-4" />
            {t(`documentMenu.${key}`)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
          onClick={onDelete}
        >
          <Trash2Icon aria-hidden="true" className="size-4" />
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
  const { createWorkspaceTag, createdEntities, selectEntity } = useWorkspace();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [tagPickerOpen, setTagPickerOpen] = React.useState(false);
  const [tagPickerQuery, setTagPickerQuery] = React.useState("");
  const [pendingTagIds, setPendingTagIds] = React.useState<readonly string[]>(
    [],
  );
  const deferredQuery = React.useDeferredValue(query);
  const deferredPickerQuery = React.useDeferredValue(tagPickerQuery);
  const tags = entityTags(entity);
  const tagNamesById = new Map(
    createdEntities
      .filter((item) => item.kind === "tag")
      .map((item) => [item.id, item.title.trim() || item.id]),
  );
  const availableTags = createdEntities.filter(
    (item) =>
      item.kind === "tag" &&
      !tags.includes(item.id) &&
      (item.title.trim() || item.id)
        .toLocaleLowerCase()
        .includes(deferredQuery.trim().toLocaleLowerCase()),
  );
  const pickerTags = createdEntities.filter(
    (item) =>
      item.kind === "tag" &&
      (item.title.trim() || item.id)
        .toLocaleLowerCase()
        .includes(deferredPickerQuery.trim().toLocaleLowerCase()),
  );
  const optionCount = availableTags.length + 2;
  const closeTagPicker = () => {
    setOpen(false);
    setTagPickerOpen(false);
    setTagPickerQuery("");
    setPendingTagIds([]);
  };
  const togglePendingTag = (tagId: string) => {
    setPendingTagIds((current) =>
      current.includes(tagId)
        ? current.filter((item) => item !== tagId)
        : [...current, tagId],
    );
  };
  const createTagFromPicker = () => {
    const name = tagPickerQuery.trim();
    if (!name) return;
    const tagId = createWorkspaceTag(name);
    setPendingTagIds((current) =>
      current.includes(tagId) ? current : [...current, tagId],
    );
    setTagPickerQuery("");
  };
  const openTagPicker = () => {
    const nextQuery = query;
    setOpen(false);
    setTagPickerQuery(nextQuery);
    setPendingTagIds(tags);
    window.setTimeout(() => setTagPickerOpen(true));
  };
  const createAndSelectTag = () => {
    const tagId = createWorkspaceTag(query.trim());
    update({ tags: [...tags, tagId] });
    setQuery("");
    setActiveIndex(0);
  };
  const activateTagOption = (index: number) => {
    if (index === 0) {
      createAndSelectTag();
      return;
    }
    if (index === 1) {
      openTagPicker();
      return;
    }
    const tag = availableTags[index - 2];
    if (!tag) return;
    update({ tags: [...tags, tag.id] });
    setQuery("");
    setActiveIndex(0);
  };
  return (
    <div
      data-slot="workspace-object-page-tags"
      className="mt-[6px] flex min-h-5 flex-wrap items-center gap-1.5"
    >
      {tags.map((tagId) => (
        <span
          key={tagId}
          data-slot="workspace-object-page-tag-chip"
          className={cn(
            tagChipClass,
            "group/tag-chip gap-0 overflow-hidden p-0",
          )}
        >
          <button
            type="button"
            className="min-w-0 truncate py-[0.2em] pl-[0.49em] pr-1 outline-none focus-visible:underline"
            aria-label={tagNamesById.get(tagId) ?? tagId}
            onClick={() => selectEntity(tagId)}
          >
            {tagNamesById.get(tagId) ?? tagId}
          </button>
          <button
            type="button"
            data-slot="workspace-object-page-tag-remove"
            aria-label={t("actions.removeTag", {
              tag: tagNamesById.get(tagId) ?? tagId,
            })}
            className="pointer-events-none flex w-[31.56px] shrink-0 items-center justify-center opacity-0 outline-none transition-opacity duration-200 ease-out hover:bg-muted group-hover/tag-chip:pointer-events-auto group-hover/tag-chip:opacity-100 group-focus-within/tag-chip:pointer-events-auto group-focus-within/tag-chip:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none"
            onClick={() => {
              update({ tags: tags.filter((item) => item !== tagId) });
            }}
          >
            <XIcon aria-hidden="true" className="size-[12.6px]" />
          </button>
        </span>
      ))}
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          setActiveIndex(0);
          if (!nextOpen) setQuery("");
        }}
      >
        <PopoverTrigger
          nativeButton={false}
          render={
            <label
              data-slot="workspace-object-page-tags-empty-selector"
              className="group/tag-selector inline-flex min-w-0 items-center whitespace-nowrap rounded-[0.475em] border border-transparent px-[0.49em] py-[0.2em] leading-[1.3]"
            >
              <ObjectTagIcon className="size-3.5" />
              <input
                ref={inputRef}
                data-slot="object-page-tags-input"
                aria-label={t("fields.tags")}
                placeholder={t("fields.tags")}
                value={query}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls="object-page-tags-options"
                aria-activedescendant={
                  open
                    ? activeIndex < 2
                      ? `object-page-tag-action-${activeIndex}`
                      : `object-page-tag-${availableTags[activeIndex - 2]?.id}`
                    : undefined
                }
                onClick={(event) => {
                  event.stopPropagation();
                  setOpen(true);
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  setOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape" && open) {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpen(false);
                    inputRef.current?.blur();
                  } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setOpen(true);
                    setActiveIndex((current) =>
                      Math.min(current + 1, optionCount - 1),
                    );
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setOpen(true);
                    setActiveIndex((current) => Math.max(current - 1, 0));
                  } else if (event.key === "Enter") {
                    event.preventDefault();
                    if (open) activateTagOption(activeIndex);
                    else setOpen(true);
                  }
                }}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                  setOpen(true);
                }}
                className="ml-1.5 min-w-[3.9rem] max-w-48 cursor-pointer bg-transparent leading-[18.2px] outline-none focus:cursor-text [field-sizing:content] placeholder:text-muted-foreground"
              />
              <SparklesIcon
                aria-hidden="true"
                data-slot="workspace-object-page-tags-sparkle"
                className="ml-1 size-3.5 shrink-0 text-violet-500 opacity-0 transition-opacity duration-200 ease-out group-hover/tag-selector:opacity-100 group-focus-within/tag-selector:opacity-100 motion-reduce:transition-none"
              />
            </label>
          }
        />
        <PopoverContent
          data-slot="workspace-object-page-tags-menu"
          align="start"
          initialFocus={false}
          finalFocus={false}
          sideOffset={5}
          className={cn(
            workspaceOverflowMenuContentClass,
            "w-[257.6px] min-w-[257.6px] gap-0 p-1.5",
          )}
        >
          <div id="object-page-tags-options" className="grid">
            <button
              id="object-page-tag-action-0"
              type="button"
              data-active={activeIndex === 0}
              className={cn(
                workspaceOverflowMenuItemClass,
                "flex w-full gap-2 px-1 text-left data-[active=true]:bg-accent",
              )}
              onPointerMove={() => setActiveIndex(0)}
              onClick={createAndSelectTag}
            >
              <ObjectTagIcon className="size-3.5 shrink-0 text-muted-foreground" />
              {query.trim()
                ? t("documentMenu.newTag", { tag: query.trim() })
                : t("documentMenu.newTagEmpty")}
            </button>
            <button
              id="object-page-tag-action-1"
              type="button"
              data-active={activeIndex === 1}
              className={cn(
                workspaceOverflowMenuItemClass,
                "flex w-full gap-2 px-1 text-left data-[active=true]:bg-accent",
              )}
              onPointerMove={() => setActiveIndex(1)}
              onClick={openTagPicker}
            >
              <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
              {t("documentMenu.searchAllTags")}
            </button>
            {availableTags.length > 0 ? (
              <div className="mt-[8.8px] grid">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    id={`object-page-tag-${tag.id}`}
                    type="button"
                    data-active={activeIndex === availableTags.indexOf(tag) + 2}
                    onPointerMove={() =>
                      setActiveIndex(availableTags.indexOf(tag) + 2)
                    }
                    onClick={() => {
                      update({ tags: [...tags, tag.id] });
                      setQuery("");
                      setActiveIndex(0);
                    }}
                    className={cn(
                      workspaceOverflowMenuItemClass,
                      "flex w-full gap-2 px-1 text-left data-[active=true]:bg-accent",
                    )}
                  >
                    <ObjectTagIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">
                      {tag.title.trim() || tag.id}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
      <Dialog
        open={tagPickerOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) closeTagPicker();
        }}
      >
        <DialogContent
          data-slot="object-page-tag-picker"
          showCloseButton={false}
          className="h-[min(48rem,calc(100vh-4rem))] max-w-[calc(100vw-2rem)] p-5 sm:w-[64rem] sm:max-w-[64rem]"
        >
          <DialogHeader>
            <DialogTitle>{t("documentMenu.addTag")}</DialogTitle>
          </DialogHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="flex gap-2">
              <input
                aria-label={t("actions.search")}
                placeholder={t("actions.search")}
                value={tagPickerQuery}
                onChange={(event) => setTagPickerQuery(event.target.value)}
                className="h-8 w-56 rounded-lg border border-border bg-transparent px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
              <Button
                type="button"
                size="sm"
                disabled={!tagPickerQuery.trim()}
                onClick={createTagFromPicker}
              >
                {t("actions.create")}
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {pickerTags.map((tag) => {
                const selected = pendingTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    aria-pressed={selected}
                    className={cn(
                      workspaceOverflowMenuItemClass,
                      "flex w-full gap-2 px-2 text-left",
                      selected && "bg-muted",
                    )}
                    onClick={() => togglePendingTag(tag.id)}
                  >
                    <ObjectTagIcon className="size-3.5 shrink-0" />
                    <span className="truncate">
                      {tag.title.trim() || tag.id}
                    </span>
                    {selected ? <CheckIcon className="ml-auto size-4" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
          <DialogFooter className="-mx-5 -mb-5 sm:justify-between">
            <Button type="button" variant="outline" onClick={closeTagPicker}>
              {t("lifecycle.cancel")}
            </Button>
            <Button
              type="button"
              onClick={() => {
                update({ tags: pendingTagIds });
                closeTagPicker();
              }}
            >
              {t("actions.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ObjectPageCollections({
  activationRequest = 0,
  entity,
  update,
}: {
  readonly activationRequest?: number;
  readonly entity: SupportedWorkspaceEntity;
  readonly update: EntityUpdate;
}) {
  const t = useTranslations("workspace");
  const { objectTypeCollections, setObjectTypeCollections } = useWorkspace();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const deferredQuery = React.useDeferredValue(query);
  const collections = entityCollections(entity);
  const choices = Object.values(objectTypeCollections).filter(
    (collection) => collection.structureId === entity.objectTypeId,
  );
  const availableChoices = choices.filter(
    (collection) => !collections.includes(collection.id),
  );
  const visibleChoices = availableChoices.filter((collection) =>
    collection.name
      .toLocaleLowerCase()
      .includes(deferredQuery.trim().toLocaleLowerCase()),
  );
  const showCreate = visibleChoices.length === 0;
  const optionCount = Math.max(visibleChoices.length, 1);
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
  const createCollection = () => {
    const requested = query.trim() || t("documentMenu.untitledCollection");
    const taken = new Set(choices.map((collection) => collection.name));
    let name = requested;
    let suffix = 2;
    while (taken.has(name)) {
      name = `${requested} ${suffix}`;
      suffix += 1;
    }
    const id = createCollectionId(
      entity.objectTypeId,
      name,
      new Set(Object.keys(objectTypeCollections)),
    );
    setObjectTypeCollections((current) => ({
      ...current,
      [id]: { id, name, structureId: entity.objectTypeId },
    }));
    update({ collections: [...collections, id] });
    setQuery("");
    setOpen(false);
  };
  const activateOption = (index: number) => {
    if (showCreate) {
      createCollection();
      return;
    }
    const collection = visibleChoices[index];
    if (collection) {
      toggleCollection(collection.id);
      setActiveIndex(0);
    }
  };
  React.useEffect(() => {
    setActiveIndex((current) => Math.min(current, optionCount - 1));
  }, [optionCount]);
  React.useEffect(() => {
    if (activationRequest === 0) return;
    setOpen(true);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus());
    return () => window.clearTimeout(focusTimer);
  }, [activationRequest]);
  return (
    <div className="inline-flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
      {collections.map((collectionId) => (
        <div
          key={collectionId}
          data-slot="workspace-object-page-collection-chip"
          className={cn(
            collectionChipClass,
            "group/collection-chip items-stretch overflow-hidden p-0",
          )}
        >
          <span className="inline-flex min-w-0 items-center py-[0.2em] pl-[0.49em] pr-1">
            <ObjectCollectionIcon className="mr-1.5 size-3.5 shrink-0" />
            <span className="truncate">
              {collectionNames.get(collectionId) ?? collectionId}
            </span>
          </span>
          <button
            type="button"
            data-slot="workspace-object-page-collection-remove"
            aria-label={`${t("objectTypeOverview.remove")} ${collectionNames.get(collectionId) ?? collectionId}`}
            onClick={() => toggleCollection(collectionId)}
            className="inline-flex w-[31.56px] items-center justify-center opacity-0 transition-opacity duration-200 ease-out hover:bg-muted group-hover/collection-chip:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
          >
            <XIcon aria-hidden="true" className="size-[12.6px]" />
          </button>
        </div>
      ))}
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          setActiveIndex(0);
          if (!nextOpen) setQuery("");
        }}
      >
        <PopoverTrigger
          nativeButton={false}
          render={
            <label className="inline-flex min-w-0 items-center whitespace-nowrap rounded-[0.475em] border border-transparent px-[0.49em] py-[0.2em] leading-[1.3] hover:bg-muted/70">
              <ObjectCollectionIcon className="size-3.5" />
              <input
                ref={inputRef}
                data-slot="object-page-collections-input"
                aria-label={t("objects.collections")}
                placeholder={t("objects.collections")}
                value={query}
                role="combobox"
                aria-autocomplete="list"
                aria-activedescendant={
                  open
                    ? showCreate
                      ? "object-page-collection-create"
                      : `object-page-collection-${visibleChoices[activeIndex]?.id}`
                    : undefined
                }
                aria-controls="object-page-collections-options"
                aria-expanded={open}
                onClick={(event) => {
                  event.stopPropagation();
                  setOpen(true);
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Escape" && open) {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpen(false);
                    inputRef.current?.blur();
                  } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setOpen(true);
                    setActiveIndex((current) =>
                      Math.min(current + 1, optionCount - 1),
                    );
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setOpen(true);
                    setActiveIndex((current) => Math.max(current - 1, 0));
                  } else if (event.key === "Enter") {
                    event.preventDefault();
                    if (open) activateOption(activeIndex);
                    else setOpen(true);
                  }
                }}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                  setOpen(true);
                }}
                className="ml-1.5 min-w-[3.9rem] max-w-48 cursor-pointer bg-transparent leading-[18.2px] outline-none focus:cursor-text [field-sizing:content] placeholder:text-muted-foreground"
              />
            </label>
          }
        />
        <PopoverContent
          align="start"
          initialFocus={false}
          finalFocus={false}
          sideOffset={5}
          className={cn(
            workspaceOverflowMenuContentClass,
            "w-[257.6px] min-w-[257.6px] gap-0 p-1.5",
          )}
        >
          <div id="object-page-collections-options" className="grid">
            {showCreate ? (
              <button
                id="object-page-collection-create"
                type="button"
                data-active={activeIndex === 0}
                data-slot="workspace-object-page-collections-create"
                className={cn(
                  workspaceOverflowMenuItemClass,
                  "w-full gap-2 px-1 text-left data-[active=true]:bg-accent",
                )}
                onPointerMove={() => setActiveIndex(0)}
                onClick={createCollection}
              >
                <PlusIcon
                  aria-hidden="true"
                  className="size-3.5 shrink-0"
                  weight="regular"
                />
                {query.trim()
                  ? t("documentMenu.newCollectionNamed", {
                      collection: query.trim(),
                    })
                  : t("documentMenu.newCollection")}
              </button>
            ) : (
              visibleChoices.map((collection, index) => (
                <button
                  key={collection.id}
                  id={`object-page-collection-${collection.id}`}
                  type="button"
                  data-active={activeIndex === index}
                  onClick={() => {
                    toggleCollection(collection.id);
                    setActiveIndex(0);
                  }}
                  onPointerMove={() => setActiveIndex(index)}
                  className={cn(
                    workspaceOverflowMenuItemClass,
                    "w-full gap-2 px-1 text-left data-[active=true]:bg-accent",
                  )}
                >
                  <ObjectCollectionIcon className="size-3.5 shrink-0" />
                  <span className="truncate">{collection.name}</span>
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function PageCustomizeControl({
  entity,
  isCustomStructure,
  onAddCover,
  onIcon,
  onUpdate,
}: {
  readonly entity: DocumentWorkspaceEntity;
  readonly isCustomStructure: boolean;
  readonly onAddCover: () => void;
  readonly onIcon: (icon: string) => void;
  readonly onUpdate: EntityUpdate;
}) {
  const t = useTranslations("workspace");
  const bodyText = blockEditorDocumentToMarkdown(entity.body).trim();
  const generatedTitle =
    bodyText
      .split(/\r?\n/)
      .find((line) => line.trim())
      ?.trim()
      .slice(0, 80) ?? entity.title.trim();
  const generatedDescription =
    bodyText.replace(/\s+/g, " ").trim().slice(0, 180) || entity.title.trim();
  const generatedAliases = entity.title.trim() ? [entity.title.trim()] : [];
  const wideLayout = entity.wideLayout === true;
  const fullActions = [
    {
      Icon: AlignLeftIcon,
      label: t("documentMenu.addDescription"),
      run: () => onUpdate({ description: entity.description ?? "" }),
    },
    {
      Icon: SparklesIcon,
      label: t("documentMenu.fillDescription"),
      run: () => onUpdate({ description: generatedDescription }),
    },
    {
      Icon: CopyIcon,
      label: t("documentMenu.addAliases"),
      run: () => onUpdate({ aliases: entity.aliases ?? [] }),
    },
    {
      Icon: WandSparklesIcon,
      label: t("documentMenu.fillAliases"),
      run: () => onUpdate({ aliases: generatedAliases }),
    },
    { Icon: ImageIcon, label: t("documentMenu.addCover"), run: onAddCover },
    {
      Icon: SparklesIcon,
      label: t("documentMenu.fillProperties"),
      run: () =>
        onUpdate({
          ...(entity.title.trim() || !generatedTitle
            ? {}
            : { title: generatedTitle }),
          aliases: entity.aliases?.length ? entity.aliases : generatedAliases,
          description: entity.description?.trim()
            ? entity.description
            : generatedDescription,
        }),
    },
    {
      Icon: ExpandIcon,
      label: t("documentMenu.wideLayout"),
      pressed: wideLayout,
      run: () => onUpdate({ wideLayout: !wideLayout }),
    },
  ];
  const customActions = [
    {
      Icon: WandSparklesIcon,
      label: t("documentMenu.generateTitle"),
      run: () => onUpdate({ title: generatedTitle }),
    },
    {
      Icon: SparklesIcon,
      label: t("documentMenu.fillProperties"),
      run: () =>
        onUpdate({
          ...(entity.title.trim() || !generatedTitle
            ? {}
            : { title: generatedTitle }),
          aliases: entity.aliases?.length ? entity.aliases : generatedAliases,
          description: entity.description?.trim()
            ? entity.description
            : generatedDescription,
        }),
    },
    {
      Icon: ExpandIcon,
      label: t("documentMenu.wideLayout"),
      pressed: wideLayout,
      run: () => onUpdate({ wideLayout: !wideLayout }),
    },
  ];
  const actions = isCustomStructure ? customActions : fullActions;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={t("actions.customize")}
            className="pointer-events-none h-[26px] gap-1.5 px-2 pr-1 text-sm font-normal text-muted-foreground opacity-0 transition-opacity duration-300 ease-linear hover:bg-muted hover:text-foreground group-hover/object-page-header:pointer-events-auto group-hover/object-page-header:opacity-50 data-popup-open:pointer-events-auto data-popup-open:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100 motion-reduce:transition-none"
          >
            <AppHeaderCustomizeIcon className="size-3.5" />
            {t("actions.customize")}
            <AppHeaderCaretDownIcon className="size-3.5" />
          </Button>
        }
      />
      <DropdownMenuContent
        aria-label={t("actions.customize")}
        align="center"
        sideOffset={5}
        className="w-[277px] rounded-[12px] p-1.5 ring-0 shadow-[0_3px_5px_rgb(0_0_0/0.01),0_5px_10px_rgb(0_0_0/0.02),0_10px_14px_rgb(0_0_0/0.01)]"
      >
        {!isCustomStructure ? (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
            >
              <SmileIcon aria-hidden="true" className="size-4" />
              {t("documentMenu.addIcon")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="grid w-[156px] grid-cols-4 gap-1 p-2">
              {["📄", "💡", "📌", "🧭", "✍️", "🗂️", "⭐", "🚀"].map((icon) => (
                <DropdownMenuItem
                  key={icon}
                  className="h-8 justify-center text-lg"
                  onClick={() => onIcon(icon)}
                >
                  {icon}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ) : null}
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            className={cn(workspaceOverflowMenuItemClass, "gap-2 px-2")}
            aria-pressed={action.pressed}
            onClick={action.run}
          >
            <action.Icon aria-hidden="true" className="size-4" />
            {action.label}
            {action.pressed ? <CheckIcon className="ml-auto size-4" /> : null}
          </DropdownMenuItem>
        ))}
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

function relationCandidateEntities(
  entity: SupportedWorkspaceEntity,
  property: WorkspaceStructure["propertyDefinitions"][number],
  createdEntities: readonly WorkspaceEntity[],
) {
  return createdEntities.filter(
    (candidate): candidate is SupportedWorkspaceEntity => {
      if (!canRenderWorkspaceObjectPage(candidate)) return false;
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
    },
  );
}

function WorkspaceEntityPropertyField({
  candidates,
  entity,
  inputId,
  property,
  setLinkedEntityPropertyValue,
}: {
  readonly candidates: readonly SupportedWorkspaceEntity[];
  readonly entity: SupportedWorkspaceEntity;
  readonly inputId: string;
  readonly property: WorkspaceStructure["propertyDefinitions"][number];
  readonly setLinkedEntityPropertyValue: (
    entityId: string,
    propertyId: string,
    targetIds: string | readonly string[],
  ) => void;
}) {
  const relation = entity.propertyValues[property.id];
  const selectedIds =
    relation?.type === "entity"
      ? relation.entity.map((target) => target.id)
      : [];
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
          const targetIds = Array.from(event.currentTarget.selectedOptions).map(
            (option) => option.value,
          );
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

function WorkspaceBooleanPropertyField({
  property,
  updateProperty,
  value,
}: {
  readonly property: WorkspaceStructure["propertyDefinitions"][number];
  readonly updateProperty: EntityPropertyUpdate;
  readonly value: unknown;
}) {
  return (
    <label
      data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
      className="flex min-h-8 items-center justify-between gap-3 rounded-md px-2 text-sm"
    >
      <span className="truncate text-muted-foreground">{property.name}</span>
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(event) => updateProperty(property.id, event.target.checked)}
      />
    </label>
  );
}

function WorkspaceLabelPropertyField({
  entity,
  inputId,
  property,
  updateProperty,
}: {
  readonly entity: SupportedWorkspaceEntity;
  readonly inputId: string;
  readonly property: WorkspaceStructure["propertyDefinitions"][number];
  readonly updateProperty: EntityPropertyUpdate;
}) {
  const label = entity.propertyValues[property.id];
  const selectedIds =
    label?.type === "label" ? label.label.map((option) => option.id) : [];
  return (
    <label
      htmlFor={inputId}
      data-slot="workspace-label-property"
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
          const optionIds = Array.from(event.currentTarget.selectedOptions).map(
            (option) => option.value,
          );
          updateProperty(
            property.id,
            property.multiple ? optionIds : (optionIds[0] ?? ""),
          );
        }}
      >
        {!property.multiple && <option value="" />}
        {(property.options ?? []).map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function workspacePropertyInputType(
  valueType: WorkspaceStructure["propertyDefinitions"][number]["valueType"],
) {
  if (valueType === "number") return "number";
  if (valueType === "date") return "datetime-local";
  if (valueType === "url") return "url";
  return "text";
}

function coerceWorkspacePropertyDraft(
  valueType: WorkspaceStructure["propertyDefinitions"][number]["valueType"],
  draft: unknown,
) {
  const text = String(draft);
  if (valueType === "number") return Number(text);
  if (valueType === "date") {
    return {
      allDay: false,
      start: text,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }
  if (valueType === "richText") return blockEditorDocumentFromPlainText(text);
  return text;
}

const numberFormatOptions = [
  "number",
  "percent",
  "currency",
  "progress",
] as const;
const numberProgressColorOptions = [
  "blue",
  "gray",
  "green",
  "orange",
  "purple",
  "red",
] as const satisfies readonly NumberPresentationColor[];

function numberPresentationWithType(
  current: NumberPresentation | undefined,
  type: NumberPresentation["type"],
): NumberPresentation {
  const fixedDecimals = current?.fixedDecimals;
  if (type === "currency") {
    return {
      currency: current?.type === "currency" ? current.currency : "USD",
      ...(fixedDecimals === undefined ? {} : { fixedDecimals }),
      type,
    };
  }
  if (type === "progress") {
    return {
      color: current?.type === "progress" ? current.color : "blue",
      ...(fixedDecimals === undefined ? {} : { fixedDecimals }),
      steps: current?.type === "progress" ? current.steps : 100,
      type,
    };
  }
  return {
    ...(fixedDecimals === undefined ? {} : { fixedDecimals }),
    type,
  };
}

function numberPresentationWithDecimals(
  current: NumberPresentation | undefined,
  rawValue: string,
): NumberPresentation {
  const decimals = rawValue === "" ? undefined : Number(rawValue);
  const base = numberPresentationWithType(current, current?.type ?? "number");
  return decimals === undefined
    ? (Object.fromEntries(
        Object.entries(base).filter(([key]) => key !== "fixedDecimals"),
      ) as NumberPresentation)
    : { ...base, fixedDecimals: decimals };
}

function NumberPresentationSettings({
  property,
  structureId,
}: {
  readonly property: WorkspaceStructure["propertyDefinitions"][number];
  readonly structureId: string;
}) {
  const { updateWorkspacePropertyNumberPresentation } = useWorkspace();
  const presentation = property.numberPresentation ?? { type: "number" };
  const updatePresentation = (next: NumberPresentation) =>
    updateWorkspacePropertyNumberPresentation(structureId, property.id, next);
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        aria-label={`${property.name} number format`}
        className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md border border-border px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {presentation.type}
        <AppHeaderCaretDownIcon className="size-3" />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={6} className="w-64 gap-3 p-3">
        <PopoverTitle className="text-sm">{property.name}</PopoverTitle>
        <label className="grid gap-1 text-xs text-muted-foreground">
          Format
          <select
            value={presentation.type}
            className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
            onChange={(event) =>
              updatePresentation(
                numberPresentationWithType(
                  presentation,
                  event.currentTarget.value as NumberPresentation["type"],
                ),
              )
            }
          >
            {numberFormatOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          Decimals
          <input
            type="number"
            min={0}
            max={6}
            value={presentation.fixedDecimals ?? ""}
            placeholder="auto"
            className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
            onChange={(event) =>
              updatePresentation(
                numberPresentationWithDecimals(
                  presentation,
                  event.currentTarget.value,
                ),
              )
            }
          />
        </label>
        {presentation.type === "currency" ? (
          <label className="grid gap-1 text-xs text-muted-foreground">
            Currency
            <input
              value={presentation.currency}
              maxLength={3}
              className="h-8 rounded-md border border-border bg-background px-2 text-sm uppercase text-foreground"
              onChange={(event) =>
                updatePresentation({
                  ...presentation,
                  currency: event.currentTarget.value.toUpperCase(),
                })
              }
            />
          </label>
        ) : null}
        {presentation.type === "progress" ? (
          <div className="grid grid-cols-2 gap-2">
            <label className="grid gap-1 text-xs text-muted-foreground">
              Steps
              <input
                type="number"
                min={1}
                max={1000}
                value={presentation.steps}
                className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                onChange={(event) =>
                  updatePresentation({
                    ...presentation,
                    steps: Number(event.currentTarget.value),
                  })
                }
              />
            </label>
            <label className="grid gap-1 text-xs text-muted-foreground">
              Color
              <select
                value={presentation.color}
                className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
                onChange={(event) =>
                  updatePresentation({
                    ...presentation,
                    color: event.currentTarget.value as NumberPresentationColor,
                  })
                }
              >
                {numberProgressColorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

function WorkspaceNumberPropertyField({
  inputId,
  property,
  structureId,
  updateProperty,
  value,
}: {
  readonly inputId: string;
  readonly property: WorkspaceStructure["propertyDefinitions"][number];
  readonly structureId: string;
  readonly updateProperty: EntityPropertyUpdate;
  readonly value: unknown;
}) {
  const locale = useLocale();
  const numericValue = typeof value === "number" ? value : null;
  const formatted =
    numericValue === null
      ? null
      : formatNumberValue(numericValue, property.numberPresentation, locale);
  return (
    <label
      htmlFor={inputId}
      data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
      className="grid min-h-8 grid-cols-[8rem_minmax(0,1fr)] items-center gap-3 text-sm"
    >
      <span className="truncate text-muted-foreground">{property.name}</span>
      <span className="flex min-w-0 items-center gap-2">
        <BufferedWorkspacePropertyInput
          inputId={inputId}
          inputType="text"
          value={numericValue ?? ""}
          onCommit={(draft) => {
            const parsed = parseNumberInput(String(draft), locale);
            if (parsed.ok) updateProperty(property.id, parsed.value);
          }}
        />
        {formatted ? (
          <NumberValueDisplay
            className="max-w-36 shrink-0 text-xs text-muted-foreground"
            formatted={formatted}
            variant="field"
          />
        ) : null}
        <NumberPresentationSettings
          property={property}
          structureId={structureId}
        />
      </span>
    </label>
  );
}

function WorkspaceScalarPropertyField({
  inputId,
  property,
  updateProperty,
  value,
}: {
  readonly inputId: string;
  readonly property: WorkspaceStructure["propertyDefinitions"][number];
  readonly updateProperty: EntityPropertyUpdate;
  readonly value: unknown;
}) {
  return (
    <label
      htmlFor={inputId}
      data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
      className="grid min-h-8 grid-cols-[8rem_minmax(0,1fr)] items-center gap-3 text-sm"
    >
      <span className="truncate text-muted-foreground">{property.name}</span>
      <BufferedWorkspacePropertyInput
        inputId={inputId}
        inputType={workspacePropertyInputType(property.valueType)}
        value={value}
        onCommit={(draft) => {
          const coerced = coerceWorkspacePropertyDraft(
            property.valueType,
            draft,
          );
          updateProperty(
            property.id,
            property.multiple && typeof coerced === "string"
              ? coerced
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              : coerced,
          );
        }}
      />
    </label>
  );
}

function WorkspacePropertyField({
  entity,
  property,
  structureId,
  updateProperty,
}: {
  readonly entity: SupportedWorkspaceEntity;
  readonly property: WorkspaceStructure["propertyDefinitions"][number];
  readonly structureId: string;
  readonly updateProperty: EntityPropertyUpdate;
}) {
  const { createdEntities, setLinkedEntityPropertyValue } = useWorkspace();
  const inputId = React.useId();
  const value = readWorkspaceEntityProperty(entity, property.id);
  if (property.valueType === "entity") {
    return (
      <WorkspaceEntityPropertyField
        candidates={relationCandidateEntities(
          entity,
          property,
          createdEntities,
        )}
        entity={entity}
        inputId={inputId}
        property={property}
        setLinkedEntityPropertyValue={setLinkedEntityPropertyValue}
      />
    );
  }
  if (property.valueType === "boolean") {
    return (
      <WorkspaceBooleanPropertyField
        property={property}
        updateProperty={updateProperty}
        value={value}
      />
    );
  }
  if (property.valueType === "number") {
    return (
      <WorkspaceNumberPropertyField
        inputId={inputId}
        property={property}
        structureId={structureId}
        updateProperty={updateProperty}
        value={value}
      />
    );
  }
  if (property.valueType === "label") {
    return (
      <WorkspaceLabelPropertyField
        entity={entity}
        inputId={inputId}
        property={property}
        updateProperty={updateProperty}
      />
    );
  }
  return (
    <WorkspaceScalarPropertyField
      inputId={inputId}
      property={property}
      updateProperty={updateProperty}
      value={value}
    />
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
    (property) => {
      const explicitlyAdded =
        (property.id === "aliases" &&
          "aliases" in entity &&
          entity.aliases !== undefined) ||
        (property.id === "description" &&
          "description" in entity &&
          entity.description !== undefined);
      return (
        property.writable &&
        property.ownership !== "system" &&
        !["title", "tags", "icon", "cover"].includes(property.id) &&
        [
          "text",
          "number",
          "boolean",
          "date",
          "url",
          "entity",
          "label",
          "richText",
          "media",
        ].includes(property.valueType) &&
        !(
          ["aliases", "description"].includes(property.id) &&
          !explicitlyAdded &&
          !propertyInputValue(
            readWorkspaceEntityProperty(entity, property.id),
          ).trim()
        )
      );
    },
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
          structureId={structure.id}
          updateProperty={updateProperty}
        />
      ))}
    </div>
  );
}

const structurePropertyCatalog: readonly {
  readonly key:
    | "propertyText"
    | "propertyContent"
    | "propertyLabel"
    | "propertyObject"
    | "propertyCheckbox"
    | "propertyDateTime"
    | "propertyNumber"
    | "propertyDescription"
    | "propertyCover"
    | "propertyIcon"
    | "propertyCreatedAt"
    | "propertyLastUpdatedAt"
    | "propertyAliases";
  readonly valueType: PropertyValueType;
  readonly Icon: React.ElementType;
  readonly specialId?: "aliases" | "cover" | "description" | "icon";
}[] = [
  { key: "propertyText", valueType: "text", Icon: TypeIcon },
  { key: "propertyContent", valueType: "richText", Icon: AlignLeftIcon },
  { key: "propertyLabel", valueType: "label", Icon: ListIcon },
  { key: "propertyObject", valueType: "entity", Icon: MousePointer2Icon },
  { key: "propertyCheckbox", valueType: "boolean", Icon: CheckSquareIcon },
  { key: "propertyDateTime", valueType: "date", Icon: CalendarClockIcon },
  { key: "propertyNumber", valueType: "number", Icon: ListChecksIcon },
  {
    key: "propertyDescription",
    valueType: "text",
    Icon: AlignLeftIcon,
    specialId: "description",
  },
  {
    key: "propertyCover",
    valueType: "media",
    Icon: ImageIcon,
    specialId: "cover",
  },
  {
    key: "propertyIcon",
    valueType: "text",
    Icon: SmileIcon,
    specialId: "icon",
  },
  { key: "propertyCreatedAt", valueType: "createdAt", Icon: CalendarClockIcon },
  {
    key: "propertyLastUpdatedAt",
    valueType: "lastUpdatedAt",
    Icon: CalendarClockIcon,
  },
  {
    key: "propertyAliases",
    valueType: "text",
    Icon: CopyIcon,
    specialId: "aliases",
  },
];

function AddStructurePropertyControl({
  entity,
  onAddCover,
  onAddIcon,
  onReplaceSchema,
  propertyDefinitions,
  structures,
  update,
}: {
  readonly entity: SupportedWorkspaceEntity;
  readonly onAddCover: () => void;
  readonly onAddIcon: () => void;
  readonly onReplaceSchema: (
    propertyDefinitions: readonly PropertyDefinition[],
  ) => void;
  readonly propertyDefinitions: readonly PropertyDefinition[];
  readonly structures: readonly WorkspaceStructure[];
  readonly update: EntityUpdate;
}) {
  const t = useTranslations("workspace");
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [objectTypeQuery, setObjectTypeQuery] = React.useState("");
  const visibleCatalog = structurePropertyCatalog.filter((item) =>
    t(`documentMenu.${item.key}`)
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [activeObjectTypeIndex, setActiveObjectTypeIndex] = React.useState(0);
  const [objectSubOpen, setObjectSubOpen] = React.useState(false);
  const objectSubTriggerRef = React.useRef<HTMLDivElement>(null);
  const objectTypeInputRef = React.useRef<HTMLInputElement>(null);
  const visibleTargetStructures = structures.filter((targetStructure) =>
    targetStructure.singularName
      .toLocaleLowerCase()
      .includes(objectTypeQuery.trim().toLocaleLowerCase()),
  );
  React.useEffect(() => {
    if (!objectSubOpen) return;
    const focusTimer = window.setTimeout(() =>
      objectTypeInputRef.current?.focus(),
    );
    return () => window.clearTimeout(focusTimer);
  }, [objectSubOpen]);

  function addSpecialProperty(item: (typeof structurePropertyCatalog)[number]) {
    if (item.specialId === "description") {
      if ("description" in entity) {
        update({ description: entity.description ?? "" });
      }
      return true;
    }
    if (item.specialId === "aliases") {
      if ("aliases" in entity) update({ aliases: entity.aliases ?? [] });
      return true;
    }
    if (item.specialId === "cover") {
      onAddCover();
      return true;
    }
    if (item.specialId === "icon") {
      onAddIcon();
      return true;
    }
    return false;
  }

  function addProperty(
    item: (typeof structurePropertyCatalog)[number],
    targetStructure?: WorkspaceStructure,
  ) {
    if (addSpecialProperty(item)) return;
    if (item.valueType === "entity" && !targetStructure) return;
    const definition: PropertyDefinition = {
      id: `property-${crypto.randomUUID()}`,
      name: targetStructure?.singularName ?? t(`documentMenu.${item.key}`),
      ownership: "normal",
      valueType: item.valueType,
      writable: !["createdAt", "lastUpdatedAt"].includes(item.valueType),
      multiple: item.valueType === "entity",
      ...(item.valueType === "label" ? { options: [] } : {}),
      ...(targetStructure ? { targetStructureIds: [targetStructure.id] } : {}),
    };
    onReplaceSchema([...propertyDefinitions, definition]);
  }

  return (
    <div className="group/add-property -mx-1.5 mt-2 flex h-8 items-center">
      <DropdownMenu
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) setActiveIndex(0);
          else {
            setQuery("");
            setObjectTypeQuery("");
            setActiveObjectTypeIndex(0);
            setObjectSubOpen(false);
          }
        }}
      >
        <DropdownMenuTrigger className="pointer-events-none inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground opacity-0 outline-none transition-opacity duration-300 ease-out group-hover/add-property:pointer-events-auto group-hover/add-property:opacity-100 data-popup-open:pointer-events-auto data-popup-open:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/40 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100 motion-reduce:transition-none">
          <span aria-hidden className="text-xs">
            ＋
          </span>
          {t("documentMenu.addProperty")}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={4}
          className={cn(
            workspaceOverflowMenuContentClass,
            "h-[430px] w-[290px] min-w-[290px] overflow-hidden p-1.5",
          )}
        >
          <input
            aria-label={t("documentMenu.searchProperties")}
            aria-activedescendant={
              visibleCatalog[activeIndex]
                ? `structure-property-${visibleCatalog[activeIndex].key}`
                : undefined
            }
            placeholder={t("documentMenu.searchProperties")}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                event.stopPropagation();
                setActiveIndex((current) =>
                  Math.min(current + 1, visibleCatalog.length - 1),
                );
                return;
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                event.stopPropagation();
                setActiveIndex((current) => Math.max(current - 1, 0));
                return;
              }
              if (event.key === "Enter" && visibleCatalog[activeIndex]) {
                event.preventDefault();
                event.stopPropagation();
                const activeItem = visibleCatalog[activeIndex];
                if (activeItem.valueType === "entity") {
                  objectSubTriggerRef.current?.click();
                } else {
                  addProperty(activeItem);
                  setOpen(false);
                }
                return;
              }
              if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                setOpen(false);
                return;
              }
              event.stopPropagation();
            }}
            className="mb-1 h-8 w-full rounded-lg bg-muted px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="max-h-[378px] overflow-y-auto">
            {visibleCatalog.map((item) => {
              const itemContent = (
                <>
                  <item.Icon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                  {t(`documentMenu.${item.key}`)}
                </>
              );
              if (item.valueType === "entity") {
                return (
                  <DropdownMenuSub
                    key={item.key}
                    open={objectSubOpen}
                    onOpenChange={(nextOpen) => {
                      setObjectSubOpen(nextOpen);
                      if (!nextOpen) {
                        setObjectTypeQuery("");
                        setActiveObjectTypeIndex(0);
                      }
                    }}
                  >
                    <DropdownMenuSubTrigger
                      ref={objectSubTriggerRef}
                      id={`structure-property-${item.key}`}
                      data-active={item === visibleCatalog[activeIndex]}
                      data-property-type={item.valueType}
                      className={cn(
                        workspaceOverflowMenuItemClass,
                        "gap-2 px-2 data-[active=true]:bg-accent",
                      )}
                      onPointerMove={() =>
                        setActiveIndex(visibleCatalog.indexOf(item))
                      }
                    >
                      {itemContent}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent
                      sideOffset={-16}
                      className="h-[346px] w-[222px] min-w-[222px] overflow-hidden p-1.5"
                    >
                      <input
                        ref={objectTypeInputRef}
                        aria-label={t("documentMenu.searchObjectTypes")}
                        aria-activedescendant={
                          visibleTargetStructures[activeObjectTypeIndex]
                            ? `structure-property-target-${visibleTargetStructures[activeObjectTypeIndex].id}`
                            : undefined
                        }
                        placeholder={t("documentMenu.searchObjectTypes")}
                        value={objectTypeQuery}
                        onChange={(event) => {
                          setObjectTypeQuery(event.target.value);
                          setActiveObjectTypeIndex(0);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowDown") {
                            event.preventDefault();
                            event.stopPropagation();
                            setActiveObjectTypeIndex((current) =>
                              Math.min(
                                current + 1,
                                visibleTargetStructures.length - 1,
                              ),
                            );
                            return;
                          }
                          if (event.key === "ArrowUp") {
                            event.preventDefault();
                            event.stopPropagation();
                            setActiveObjectTypeIndex((current) =>
                              Math.max(current - 1, 0),
                            );
                            return;
                          }
                          if (
                            event.key === "Enter" &&
                            visibleTargetStructures[activeObjectTypeIndex]
                          ) {
                            event.preventDefault();
                            event.stopPropagation();
                            addProperty(
                              item,
                              visibleTargetStructures[activeObjectTypeIndex],
                            );
                            setOpen(false);
                            return;
                          }
                          if (event.key === "Escape") {
                            event.preventDefault();
                            event.stopPropagation();
                            setObjectSubOpen(false);
                            objectSubTriggerRef.current?.focus();
                            return;
                          }
                          event.stopPropagation();
                        }}
                        className="mb-1 h-8 w-full rounded-lg bg-muted px-2 text-sm outline-none placeholder:text-muted-foreground"
                      />
                      <div className="max-h-[296px] overflow-y-auto">
                        {visibleTargetStructures.map(
                          (targetStructure, targetIndex) => (
                            <DropdownMenuItem
                              key={targetStructure.id}
                              id={`structure-property-target-${targetStructure.id}`}
                              data-active={
                                targetIndex === activeObjectTypeIndex
                              }
                              className={cn(
                                workspaceOverflowMenuItemClass,
                                "gap-2 px-2 data-[active=true]:bg-accent",
                              )}
                              onPointerMove={() =>
                                setActiveObjectTypeIndex(targetIndex)
                              }
                              onClick={() => {
                                addProperty(item, targetStructure);
                                setObjectSubOpen(false);
                                setOpen(false);
                              }}
                            >
                              <ObjectIconBadge
                                icon={
                                  objectTypeDefinitionById[
                                    targetStructure.iconName
                                  ]?.icon ?? objectTypeDefinitionById.page.icon
                                }
                                tone={targetStructure.tone}
                                variant="menu"
                              />
                              {targetStructure.singularName}
                            </DropdownMenuItem>
                          ),
                        )}
                        {visibleTargetStructures.length === 0 ? (
                          <p
                            role="status"
                            className="px-2 py-3 text-center text-sm text-muted-foreground"
                          >
                            {t("documentMenu.noMatchingObjectTypes")}
                          </p>
                        ) : null}
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                );
              }
              return (
                <DropdownMenuItem
                  key={item.key}
                  id={`structure-property-${item.key}`}
                  data-active={item === visibleCatalog[activeIndex]}
                  data-property-type={item.valueType}
                  data-property-id={item.specialId}
                  className={cn(
                    workspaceOverflowMenuItemClass,
                    "gap-2 px-2 data-[active=true]:bg-accent",
                  )}
                  onPointerMove={() =>
                    setActiveIndex(visibleCatalog.indexOf(item))
                  }
                  onClick={() => addProperty(item)}
                >
                  {itemContent}
                </DropdownMenuItem>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function workspaceEntityRevision(entity: WorkspaceEntity): string {
  const lastUpdatedAt = entity.propertyValues.lastUpdatedAt;
  return [
    entity.id,
    entity.title,
    entity.createdAt,
    lastUpdatedAt?.type === "lastUpdatedAt"
      ? lastUpdatedAt.lastUpdatedAt.value
      : "",
  ].join(":");
}

function RelatedContentStateMessage({
  state,
}: {
  readonly state: Exclude<RelatedContentState, { kind: "ready" }>;
}) {
  const t = useTranslations("workspace");
  const label =
    state.kind === "empty"
      ? t("linking.noRelatedContent")
      : state.kind === "error"
        ? t("linking.relatedContentError")
        : state.reason === "unsupported-source"
          ? t("linking.relatedContentUnsupported")
          : t("linking.relatedContentUnavailable");
  return (
    <p
      data-slot="workspace-object-related-content-state"
      data-state={state.kind}
      className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground"
      role={state.kind === "error" ? "alert" : "status"}
    >
      {label}
    </p>
  );
}

function RelatedContentInlineTitle({
  label,
  onCommit,
  value,
}: {
  readonly label: string;
  readonly onCommit: (value: string) => void;
  readonly value: string;
}) {
  const { commitNow, inputProps, setDraft } = useBufferedTextCommit({
    value,
    onCommit,
  });
  return (
    <input
      {...inputProps}
      type="text"
      data-slot="workspace-object-related-content-title-input"
      aria-label={label}
      placeholder={label}
      className="mb-1 h-7 w-full rounded-md bg-transparent px-1 text-[15px] font-medium leading-[19px] outline-none transition-colors duration-100 placeholder:text-muted-foreground/50 hover:bg-muted focus:bg-background focus:ring-2 focus:ring-ring/30 motion-reduce:transition-none"
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commitNow();
          event.currentTarget.blur();
        }
        if (event.key === "Escape") {
          event.preventDefault();
          setDraft(value);
          event.currentTarget.blur();
        }
      }}
    />
  );
}

function RelatedContent({ entityId }: { readonly entityId: string }) {
  const t = useTranslations("workspace");
  const [expandedRelatedIds, setExpandedRelatedIds] = React.useState<
    ReadonlySet<string>
  >(() => new Set());
  const {
    createdEntities,
    objectTypes,
    openInSidePanel,
    selectEntity,
    spaceId,
    updateWorkspaceEntity,
  } = useWorkspace();
  const source = createdEntities.find((item) => item.id === entityId);
  const state = React.useMemo(
    () =>
      selectRelatedContent({
        entities: createdEntities,
        generatedAt: "local",
        indexRevision: createdEntities.map(workspaceEntityRevision).join("|"),
        limit: RELATED_CONTENT_PANEL_LIMIT,
        sourceId: entityId,
        sourceRevision: source ? workspaceEntityRevision(source) : "missing",
        spaceId,
      }),
    [createdEntities, entityId, source, spaceId],
  );
  if (state.kind === "unavailable" && state.reason === "unsupported-source") {
    return null;
  }
  const related = state.kind === "ready" ? state.results.slice(0, 5) : [];
  if (state.kind === "empty") return null;
  const openContinuation = () =>
    openInSidePanel({
      id: "relatedContent",
      label: t("explore.relatedContent"),
      icon: ObjectCollectionIcon,
      iconClassName: objectIconToneBadgeClass.gray,
      draggable: true,
    });
  return (
    <section
      data-slot="workspace-object-related-content"
      data-state={state.kind}
      data-result-revision={"revision" in state ? state.revision : undefined}
      className="mt-16"
      aria-labelledby={`${entityId}-related-heading`}
    >
      <div
        data-slot="workspace-object-related-content-heading"
        className="group/related-heading flex h-8 items-center"
      >
        <h2
          id={`${entityId}-related-heading`}
          className="-ml-1.5 flex items-center rounded-lg px-1.5 py-0.5 text-sm font-medium hover:bg-muted"
        >
          {t("explore.relatedContent")}
          <span
            data-slot="workspace-object-related-content-count"
            className="ml-1.5 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-normal leading-4 text-muted-foreground"
          >
            {related.length}
          </span>
        </h2>
        {state.kind === "ready" ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="pointer-events-none ml-auto h-7 w-[109.859px] px-2 text-xs text-muted-foreground opacity-0 transition-opacity duration-200 ease-out group-hover/related-heading:pointer-events-auto group-hover/related-heading:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 motion-reduce:transition-none"
            data-slot="workspace-object-related-content-more"
            onClick={openContinuation}
          >
            {t("explore.showMore")}
          </Button>
        ) : null}
      </div>
      <div className="mt-1 grid gap-1">
        {state.kind === "ready" ? (
          related.map((result) => {
            const item = createdEntities.find(
              (candidate) => candidate.id === result.targetId,
            );
            if (!item) return null;
            const objectType = objectTypes.find(
              (candidate) => candidate.id === item.objectTypeId,
            );
            const Icon = objectType?.icon ?? objectTypeDefinitionById.page.icon;
            const expanded = expandedRelatedIds.has(item.id);
            return (
              <div
                key={item.id}
                data-slot="workspace-object-related-content-row"
                className="group/related-row w-full rounded-lg bg-transparent px-1 transition-colors duration-100 ease-out hover:bg-muted focus-within:bg-muted motion-reduce:transition-none"
              >
                <div className="flex h-[33px] items-center">
                  <button
                    type="button"
                    data-slot="workspace-object-related-content-disclosure"
                    aria-expanded={expandedRelatedIds.has(item.id)}
                    aria-label={t("explore.openEntity", {
                      title: item.title || t("lifecycle.untitled"),
                    })}
                    className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-lg outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring/30"
                    onClick={() =>
                      setExpandedRelatedIds((current) => {
                        const next = new Set(current);
                        if (next.has(item.id)) next.delete(item.id);
                        else next.add(item.id);
                        return next;
                      })
                    }
                  >
                    <AppHeaderCaretDownIcon
                      className={cn(
                        "size-3.5 text-foreground transition-transform duration-200 ease-in-out motion-reduce:transition-none",
                        !expanded && "-rotate-90",
                      )}
                    />
                  </button>
                  <button
                    type="button"
                    data-slot="workspace-object-related-content-navigation"
                    className="min-w-0 flex-1 truncate text-left text-[15px] font-medium leading-[19px] outline-none focus-visible:underline"
                    onClick={() => selectEntity(item.id)}
                  >
                    {item.title || t("lifecycle.untitled")}
                  </button>
                  <div className="pointer-events-none ml-1 flex shrink-0 items-center gap-1 opacity-20 transition-opacity duration-300 linear group-hover/related-row:pointer-events-auto group-hover/related-row:opacity-100 group-focus-within/related-row:pointer-events-auto group-focus-within/related-row:opacity-100 motion-reduce:transition-none">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="h-[22px] w-[22px]"
                      data-slot="workspace-object-related-content-side-panel"
                      aria-label={t("tabs.openInSidePanel")}
                      onClick={() =>
                        openInSidePanel({
                          id: item.id,
                          label: item.title || t("lifecycle.untitled"),
                          icon: Icon,
                          iconClassName:
                            objectIconToneBadgeClass[
                              objectType?.tone ?? "blue"
                            ],
                          draggable: true,
                        })
                      }
                    >
                      <ExternalLinkIcon className="size-3.5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        type="button"
                        data-slot="workspace-object-related-content-options"
                        aria-label={t("actions.moreOptions")}
                        className={cn(
                          buttonVariants({
                            variant: "ghost",
                            size: "icon-sm",
                          }),
                          "h-[22px] w-[22px]",
                        )}
                      >
                        <AppHeaderDotsIcon className="size-3.5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => selectEntity(item.id)}>
                          {t("explore.openEntity", {
                            title: item.title || t("lifecycle.untitled"),
                          })}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            openInSidePanel({
                              id: item.id,
                              label: item.title || t("lifecycle.untitled"),
                              icon: Icon,
                              iconClassName:
                                objectIconToneBadgeClass[
                                  objectType?.tone ?? "blue"
                                ],
                              draggable: true,
                            })
                          }
                        >
                          {t("tabs.openInSidePanel")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <span className="mr-1 inline-flex h-[22px] items-center gap-1 rounded-md border border-primary/35 bg-primary/5 px-1.5 text-xs text-primary">
                    <Icon className="size-3" />
                    {objectType?.singularLabel ??
                      objectType?.label ??
                      t("objectTypeStudio.untitled")}
                  </span>
                </div>
                {expanded ? (
                  <div
                    data-slot="workspace-object-related-content-preview"
                    className="ml-7 min-h-16 border-l border-border px-3 pb-3 pt-1"
                  >
                    <RelatedContentInlineTitle
                      label={t("fields.title")}
                      value={item.title}
                      onCommit={(title) =>
                        updateWorkspaceEntity(item.id, { title })
                      }
                    />
                    {isDocumentWorkspaceEntity(item) ? (
                      <BlockEditor
                        ariaLabel={t("fields.text")}
                        placeholder={t("fields.text")}
                        value={item.body}
                        editable={false}
                        className="mt-0 min-h-0"
                        labels={editorLabels(t)}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {objectType?.singularLabel ?? objectType?.label}
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <RelatedContentStateMessage state={state} />
        )}
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

function MentionSourceRow({
  convertLabel,
  excerpt,
  onConvert,
  onOpen,
  openLabel,
  optionsLabel,
  sourceTitle,
  sourceTypeLabel,
}: {
  readonly convertLabel: string;
  readonly excerpt: string;
  readonly onConvert: () => void;
  readonly onOpen: () => void;
  readonly openLabel: string;
  readonly optionsLabel: string;
  readonly sourceTitle: string;
  readonly sourceTypeLabel: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div
      className={cn(
        workspaceListRowClass,
        "group/mention relative grid min-h-14 gap-1",
      )}
    >
      <button
        type="button"
        data-slot="workspace-mention-disclosure"
        aria-expanded={expanded}
        className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 pr-1 text-left"
        onClick={() => setExpanded((current) => !current)}
      >
        <AppHeaderCaretDownIcon
          className={cn(
            "size-3 text-muted-foreground transition-transform motion-reduce:transition-none",
            !expanded && "-rotate-90",
          )}
        />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">
            {sourceTitle}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {excerpt}
          </span>
        </span>
        <span className="rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground transition-opacity group-hover/mention:opacity-0 group-focus-within/mention:opacity-0 motion-reduce:transition-none">
          {sourceTypeLabel}
        </span>
      </button>
      <div className="pointer-events-none absolute right-1 top-1 flex items-center gap-0.5 rounded-md bg-background/95 opacity-0 shadow-sm transition-opacity group-hover/mention:pointer-events-auto group-hover/mention:opacity-100 group-focus-within/mention:pointer-events-auto group-focus-within/mention:opacity-100 motion-reduce:transition-none">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={openLabel}
          onClick={onOpen}
        >
          <ExternalLinkIcon className="size-3.5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            aria-label={optionsLabel}
            className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          >
            <AppHeaderDotsIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpen}>{openLabel}</DropdownMenuItem>
            <DropdownMenuItem onClick={onConvert}>
              {convertLabel}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={convertLabel}
          onClick={onConvert}
        >
          <LinkIcon className="size-3.5" />
        </Button>
      </div>
      {expanded ? (
        <p className="border-t pt-1 text-xs text-muted-foreground">{excerpt}</p>
      ) : null}
    </div>
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
      tableBlock: t("editor.slashMenu.tableBlock"),
      select: t("editor.slashMenu.select"),
      blockquote: t("editor.slashMenu.blockquote"),
      codeBlock: t("editor.slashMenu.codeBlock"),
      columns: t("editor.slashMenu.columns"),
      emojiText: t("editor.slashMenu.emojiText"),
      group: t("editor.slashMenu.group"),
      highlight: t("editor.slashMenu.highlight"),
      horizontalRule: t("editor.slashMenu.horizontalRule"),
      math: t("editor.slashMenu.math"),
      mermaid: t("editor.slashMenu.mermaid"),
      objectEmbed: t("editor.slashMenu.objectEmbed"),
      objectInline: t("editor.slashMenu.objectInline"),
      title: t("editor.slashMenu.title"),
      toggle: t("editor.slashMenu.toggle"),
    },
  };
}

function ReferencePanel({
  entity,
}: {
  readonly entity: DocumentWorkspaceEntity;
}) {
  const t = useTranslations("workspace");
  const {
    createdEntities,
    objectTypes,
    selectEntity,
    structures,
    updateWorkspaceEntity,
  } = useWorkspace();
  const linkIndex = React.useMemo(
    () => createWorkspaceObjectLinkIndex(createdEntities),
    [createdEntities],
  );
  const backlinks = selectBacklinksForObject(linkIndex, entity.id);
  const objectsInside = selectObjectsInside(linkIndex, entity.id).filter(
    (reference) => reference.kind === "embed",
  );
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
  function convertMention(candidate: (typeof mentionCandidates)[number]) {
    const source = createdEntities.find(
      (item) => item.id === candidate.sourceId,
    );
    if (!isDocumentWorkspaceEntity(source)) return;
    const body = convertUnlinkedMentionCandidate(source.body, candidate);
    if (!body) return;
    updateWorkspaceEntity(source.id, { body });
  }

  const mentionsSection =
    mentionCandidates.length > 0 ? (
      <details
        open
        data-slot="workspace-unlinked-mentions"
        aria-describedby={`${entity.id}-mentions-help`}
      >
        <summary className="cursor-pointer text-sm font-medium">
          {t("linking.unlinkedMentions")} {mentionCandidates.length}
        </summary>
        <p id={`${entity.id}-mentions-help`} className="sr-only">
          {t("linking.mentionsHelp")}
        </p>
        <div className="mt-2 grid gap-2">
          {mentionCandidates.map((candidate) => {
            const source = createdEntities.find(
              (item) => item.id === candidate.sourceId,
            );
            const sourceTitle = getEntityTitle(source, t("lifecycle.untitled"));
            const sourceType = objectTypes.find(
              (type) => type.id === source?.objectTypeId,
            );
            const sourceTypeLabel =
              sourceType?.singularLabel ??
              sourceType?.label ??
              t("lifecycle.untitled");
            return (
              <MentionSourceRow
                key={`${candidate.sourceId}-${candidate.blockId ?? "block"}-${candidate.start}-${candidate.end}`}
                convertLabel={t("linking.convertMentionFrom", {
                  title: sourceTitle,
                })}
                excerpt={candidate.excerpt}
                onConvert={() => convertMention(candidate)}
                onOpen={() => selectEntity(candidate.sourceId)}
                openLabel={t("linking.openMentionSource")}
                optionsLabel={t("linking.mentionOptions", {
                  title: sourceTitle,
                })}
                sourceTitle={sourceTitle}
                sourceTypeLabel={sourceTypeLabel}
              />
            );
          })}
        </div>
      </details>
    ) : null;

  const hasRelationshipReadingContent =
    backlinks.length > 0 ||
    backlinkPreviewSources.length > 0 ||
    mentionCandidates.length > 0 ||
    objectsInside.length > 0;
  if (!hasRelationshipReadingContent) return null;

  return (
    <section
      data-slot="workspace-object-linking"
      className="mt-16 grid gap-6"
      aria-labelledby={`${entity.id}-linking-heading`}
    >
      <h2 id={`${entity.id}-linking-heading`} className="sr-only">
        {t("linking.title")}
      </h2>

      {backlinks.length > 0 ? (
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
      ) : null}

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

      {mentionsSection}

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
                referenceEntities={createdEntities}
                referenceStructures={structures}
              />
            </section>
          );
        })}

      {objectsInside.length > 0 ? (
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
  const coverInputRef = React.useRef<HTMLInputElement>(null);
  const [collectionsActivationRequest, setCollectionsActivationRequest] =
    React.useState(0);
  const [customizeOpen, setCustomizeOpen] = React.useState(false);
  const {
    createdEntities,
    createOrReuseWorkspaceTag,
    createWorkspaceObjectReference,
    createWorkspacePage,
    deleteWorkspaceEntity,
    duplicateWorkspaceEntity,
    pinnedEntities,
    replaceWorkspaceStructureSchema,
    setFindInPageOpen,
    setFocusMode,
    setPinnedEntities,
    selectEntity,
    setWorkspaceEntityPropertyValue,
    showMessage,
    structures,
  } = useWorkspace();
  const tags = entityTags(entity);
  const isCustomStructure = structure.ownership === "custom";
  const isPinned = pinnedEntities.some((item) => item.id === entity.id);

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
        collectionsControl={
          <ObjectPageCollections
            activationRequest={collectionsActivationRequest}
            entity={entity}
            update={update}
          />
        }
        customize={
          <PageCustomizeControl
            entity={entity}
            isCustomStructure={isCustomStructure}
            onAddCover={() => coverInputRef.current?.click()}
            onIcon={(customIcon) => update({ customIcon })}
            onUpdate={update}
          />
        }
        menu={
          <DocumentMoreMenu
            isPinned={isPinned}
            onChangeType={() => showMessage(t("documentMenu.changeType"))}
            onCustomize={() => setCustomizeOpen(true)}
            onDelete={() => deleteWorkspaceEntity(entity.id)}
            onDuplicate={() => duplicateWorkspaceEntity(entity.id)}
            onEditCollections={
              isCustomStructure
                ? undefined
                : () =>
                    setCollectionsActivationRequest((current) => current + 1)
            }
            onExport={exportMarkdown}
            onFind={
              isCustomStructure ? undefined : () => setFindInPageOpen(true)
            }
            onImport={() => importInputRef.current?.click()}
            onPin={() => {
              const Icon =
                objectTypeDefinitionById[structure.iconName]?.icon ??
                objectTypeDefinitionById.page.icon;
              setPinnedEntities((current) =>
                current.some((item) => item.id === entity.id)
                  ? current.filter((item) => item.id !== entity.id)
                  : [
                      ...current,
                      {
                        id: entity.id,
                        label: entity.title || t("lifecycle.untitled"),
                        icon: Icon,
                        tone: structure.tone,
                      },
                    ],
              );
              showMessage(
                t(isPinned ? "documentMenu.unpinned" : "documentMenu.pinned"),
              );
            }}
            onPresent={() => setFocusMode(true)}
            onShare={() => {
              void navigator.clipboard
                ?.writeText(window.location.href)
                .catch(() => undefined);
              showMessage(t("documentMenu.shared"));
            }}
            onStats={() => {
              const words = blockEditorDocumentToMarkdown(entity.body)
                .trim()
                .split(/\s+/)
                .filter(Boolean).length;
              showMessage(t("documentMenu.stats", { words }));
            }}
            onToggleWideLayout={() =>
              update({ wideLayout: !(entity.wideLayout === true) })
            }
            onTypeSettings={() => selectEntity(entity.objectTypeId)}
            onUseTemplate={() => duplicateWorkspaceEntity(entity.id)}
            onCopy={() => {
              void navigator.clipboard
                ?.writeText(blockEditorDocumentToMarkdown(entity.body))
                .catch(() => undefined);
              showMessage(t("documentMenu.copied"));
            }}
            wideLayout={entity.wideLayout === true}
          />
        }
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        aria-label={t("documentMenu.addCover")}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            if (typeof reader.result === "string") {
              update({ coverImage: reader.result });
            }
          });
          reader.readAsDataURL(file);
          event.target.value = "";
        }}
      />
      {entity.coverImage ? (
        <Image
          src={entity.coverImage}
          alt=""
          width={768}
          height={160}
          unoptimized
          data-slot="workspace-object-cover"
          className="mt-3 h-40 w-full rounded-xl object-cover"
        />
      ) : null}
      {entity.customIcon ? (
        <button
          type="button"
          aria-label={t("documentMenu.addIcon")}
          className="mt-3 block text-5xl leading-none"
          onClick={() => update({ customIcon: undefined })}
        >
          {entity.customIcon}
        </button>
      ) : null}
      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("actions.customize")}</DialogTitle>
            <DialogDescription>
              {t("documentMenu.wideLayout")}
            </DialogDescription>
          </DialogHeader>
          <Button
            type="button"
            variant={entity.wideLayout === true ? "default" : "outline"}
            aria-pressed={entity.wideLayout === true}
            onClick={() =>
              update({ wideLayout: !(entity.wideLayout === true) })
            }
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
      {structure.ownership === "custom" ? (
        <div data-slot="workspace-add-structure-property">
          <AddStructurePropertyControl
            entity={entity}
            onAddCover={() => coverInputRef.current?.click()}
            onAddIcon={() => update({ customIcon: entity.customIcon || "📄" })}
            onReplaceSchema={(propertyDefinitions) =>
              replaceWorkspaceStructureSchema(structure.id, propertyDefinitions)
            }
            propertyDefinitions={structure.propertyDefinitions}
            structures={structures}
            update={update}
          />
        </div>
      ) : null}
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
          onCreateObjectReference={createWorkspaceObjectReference}
          onCreateOrReuseTag={createOrReuseWorkspaceTag}
          onCreatePageRequest={createWorkspacePage}
          onTagReference={(tagId) => {
            if (!tags.includes(tagId)) update({ tags: [...tags, tagId] });
          }}
          referenceEntities={createdEntities}
          referenceStructures={structures}
          className="mt-4 min-h-0"
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
              tableBlock: t("editor.slashMenu.tableBlock"),
              select: t("editor.slashMenu.select"),
              blockquote: t("editor.slashMenu.blockquote"),
              codeBlock: t("editor.slashMenu.codeBlock"),
              columns: t("editor.slashMenu.columns"),
              emojiText: t("editor.slashMenu.emojiText"),
              group: t("editor.slashMenu.group"),
              highlight: t("editor.slashMenu.highlight"),
              horizontalRule: t("editor.slashMenu.horizontalRule"),
              math: t("editor.slashMenu.math"),
              mermaid: t("editor.slashMenu.mermaid"),
              objectEmbed: t("editor.slashMenu.objectEmbed"),
              objectInline: t("editor.slashMenu.objectInline"),
              title: t("editor.slashMenu.title"),
              toggle: t("editor.slashMenu.toggle"),
            },
          }}
        />
      </div>
      <ReferencePanel entity={entity} />
      <RelatedContent entityId={entity.id} />
      <input
        ref={importInputRef}
        type="file"
        accept=".md,.txt,text/plain,text/markdown"
        className="hidden"
        onChange={(event) => void importMarkdown(event.target.files?.[0])}
      />
    </>
  );
}

const formulaSuggestionLabels = [
  "SUM(range)",
  "AVG(range)",
  "ROUND(value, decimals)",
  "MIN(range)",
  "MAX(range)",
  "RAND()",
] as const;

function tableAxisIds(length: number, prefix: "column" | "row") {
  return Array.from({ length }, (_, index) => `${prefix}-${index + 1}`);
}

function tableCellFormulaKey(cell: TableWorkspaceCell) {
  return `row-${cell.row + 1}:column-${cell.column + 1}`;
}

function tableEntityToFormulaTable(entity: TableWorkspaceEntity): FormulaTable {
  const maxRow = Math.max(0, ...entity.cells.map((cell) => cell.row + 1));
  const maxColumn = Math.max(0, ...entity.cells.map((cell) => cell.column + 1));
  return createFormulaTable({
    cells: Object.fromEntries(
      entity.cells.map((cell) => [tableCellFormulaKey(cell), cell.value]),
    ),
    columns: tableAxisIds(maxColumn, "column"),
    rows: tableAxisIds(maxRow, "row"),
  });
}

function formulaCellInputValue(value: FormulaValue | string) {
  return isFormulaCell(value) ? value.source : value;
}

function evaluatedTableCellValue(
  table: FormulaTable,
  cell: TableWorkspaceCell,
): FormulaTableCell {
  return table.cells[tableCellFormulaKey(cell)] ?? cell.value;
}

function formulaResultDisplay(value: FormulaTableCell): string | null {
  if (!isFormulaCell(value)) return null;
  if (value.result.type === "number") {
    return formatNumber(value.result.value, value.presentation);
  }
  if (value.result.type === "error") return errorDisplay(value.result.code);
  return "";
}

function formulaErrorCode(value: FormulaTableCell): FormulaErrorCode | null {
  return isFormulaCell(value) && value.result.type === "error"
    ? value.result.code
    : null;
}

function formulaReferenceLabels(
  value: FormulaTableCell,
  table: FormulaTable,
): readonly string[] {
  if (!isFormulaCell(value)) return [];
  return value.dependencies.map((dependency) => {
    const row = table.rows.indexOf(dependency.rowId);
    const column = table.columns.indexOf(dependency.columnId);
    if (row < 0 || column < 0) return "#REF!";
    let index = column + 1;
    let label = "";
    while (index > 0) {
      const remainder = (index - 1) % 26;
      label = String.fromCharCode(65 + remainder) + label;
      index = Math.floor((index - 1) / 26);
    }
    return `${label}${row + 1}`;
  });
}

function commitFormulaTableCell(
  entity: TableWorkspaceEntity,
  cellId: string,
  rawValue: string,
): TableWorkspaceEntity["cells"] {
  const nextCells = entity.cells.map((cell) =>
    cell.id === cellId
      ? {
          ...cell,
          value: rawValue.trimStart().startsWith("=")
            ? createFormulaValue(rawValue)
            : rawValue,
        }
      : cell,
  );
  const evaluated = evaluateFormulaTable(
    tableEntityToFormulaTable({ ...entity, cells: nextCells }),
  );
  return nextCells.map((cell) => {
    const value = evaluated.cells[tableCellFormulaKey(cell)] ?? cell.value;
    return {
      ...cell,
      value: typeof value === "number" ? String(value) : value,
    };
  });
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
  const {
    deleteWorkspaceEntity,
    duplicateWorkspaceEntity,
    pinnedEntities,
    selectEntity,
    setFocusMode,
    setPinnedEntities,
    setWorkspaceEntityPropertyValue,
    showMessage,
  } = useWorkspace();
  const isPinned = pinnedEntities.some((item) => item.id === entity.id);
  const cells = [...entity.cells].sort(
    (left, right) => left.row - right.row || left.column - right.column,
  );
  const evaluatedTable = React.useMemo(
    () => evaluateFormulaTable(tableEntityToFormulaTable(entity)),
    [entity],
  );
  const localizedFormulaError = React.useCallback(
    (value: FormulaTableCell) => {
      const code = formulaErrorCode(value);
      return code ? t(`lifecycle.table.formulaErrors.${code}`) : null;
    },
    [t],
  );
  return (
    <>
      <ObjectPageHeader
        entity={entity}
        structure={structure}
        collectionsControl={
          <ObjectPageCollections entity={entity} update={update} />
        }
        menu={
          <DocumentMoreMenu
            isPinned={isPinned}
            onChangeType={() => showMessage(t("documentMenu.changeType"))}
            onCustomize={() => showMessage(t("documentMenu.customizeHint"))}
            onDelete={() => deleteWorkspaceEntity(entity.id)}
            onDuplicate={() => duplicateWorkspaceEntity(entity.id)}
            onEditCollections={() =>
              showMessage(t("documentMenu.collectionsHint"))
            }
            onExport={() => {
              const source = entity.cells
                .map(
                  (cell) =>
                    `${cell.row + 1},${cell.column + 1},${exportFormulaCell(
                      evaluatedTableCellValue(evaluatedTable, cell),
                      "csv-result",
                    )}`,
                )
                .join("\n");
              const url = URL.createObjectURL(
                new Blob([source], { type: "text/csv" }),
              );
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = `${entity.title || "table"}.csv`;
              anchor.click();
              URL.revokeObjectURL(url);
              showMessage(t("documentMenu.exported"));
            }}
            onImport={() => showMessage(t("documentMenu.imported"))}
            onPin={() => {
              const Icon =
                objectTypeDefinitionById[structure.iconName]?.icon ??
                objectTypeDefinitionById.table.icon;
              setPinnedEntities((current) =>
                current.some((item) => item.id === entity.id)
                  ? current.filter((item) => item.id !== entity.id)
                  : [
                      ...current,
                      {
                        id: entity.id,
                        label: entity.title || t("lifecycle.untitled"),
                        icon: Icon,
                        tone: structure.tone,
                      },
                    ],
              );
              showMessage(
                t(isPinned ? "documentMenu.unpinned" : "documentMenu.pinned"),
              );
            }}
            onPresent={() => setFocusMode(true)}
            onShare={() => {
              void navigator.clipboard
                ?.writeText(window.location.href)
                .catch(() => undefined);
              showMessage(t("documentMenu.shared"));
            }}
            onStats={() =>
              showMessage(
                t("documentMenu.stats", { words: entity.cells.length }),
              )
            }
            onTypeSettings={() => selectEntity(entity.objectTypeId)}
            onUseTemplate={() => duplicateWorkspaceEntity(entity.id)}
            onCopy={() => {
              void navigator.clipboard
                ?.writeText(
                  entity.cells
                    .map((cell) =>
                      exportFormulaCell(
                        evaluatedTableCellValue(evaluatedTable, cell),
                        "csv-result",
                      ),
                    )
                    .join("\t"),
                )
                .catch(() => undefined);
              showMessage(t("documentMenu.copied"));
            }}
          />
        }
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
            displayValue={formulaResultDisplay(
              evaluatedTableCellValue(evaluatedTable, cell),
            )}
            errorDescription={localizedFormulaError(
              evaluatedTableCellValue(evaluatedTable, cell),
            )}
            formulaMode={isFormulaCell(cell.value)}
            references={formulaReferenceLabels(
              evaluatedTableCellValue(evaluatedTable, cell),
              evaluatedTable,
            )}
            suggestions={formulaSuggestionLabels}
            value={formulaCellInputValue(cell.value)}
            onCommit={(value) =>
              update({
                cells: commitFormulaTableCell(entity, cell.id, String(value)),
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

function FilePage({
  entity,
  structure,
  update,
}: {
  readonly entity: FileWorkspaceEntity;
  readonly structure: WorkspaceStructure;
  readonly update: EntityUpdate;
}) {
  const t = useTranslations("workspace");
  const {
    deleteWorkspaceEntity,
    duplicateWorkspaceEntity,
    pinnedEntities,
    selectEntity,
    setFocusMode,
    setPinnedEntities,
    showMessage,
  } = useWorkspace();
  const isPinned = pinnedEntities.some((item) => item.id === entity.id);
  const [fileError, setFileError] = React.useState(false);
  const replaceInputRef = React.useRef<HTMLInputElement>(null);
  const download = React.useCallback(() => {
    if (!entity.previewUrl) return;
    const link = document.createElement("a");
    link.href = entity.previewUrl;
    link.download = entity.fileName;
    link.click();
  }, [entity.fileName, entity.previewUrl]);

  return (
    <>
      <ObjectPageHeader
        entity={entity}
        structure={structure}
        menu={
          <DocumentMoreMenu
            isPinned={isPinned}
            onChangeType={() => showMessage(t("documentMenu.changeType"))}
            onCustomize={() => showMessage(t("documentMenu.customizeHint"))}
            onDelete={() => deleteWorkspaceEntity(entity.id)}
            onDuplicate={() => duplicateWorkspaceEntity(entity.id)}
            onEditCollections={() =>
              showMessage(t("documentMenu.collectionsHint"))
            }
            onExport={download}
            onImport={() => replaceInputRef.current?.click()}
            onPin={() => {
              const Icon =
                objectTypeDefinitionById[structure.iconName]?.icon ??
                objectTypeDefinitionById.file.icon;
              setPinnedEntities((current) =>
                current.some((item) => item.id === entity.id)
                  ? current.filter((item) => item.id !== entity.id)
                  : [
                      ...current,
                      {
                        id: entity.id,
                        label: entity.title || t("lifecycle.untitled"),
                        icon: Icon,
                        tone: structure.tone,
                      },
                    ],
              );
              showMessage(
                t(isPinned ? "documentMenu.unpinned" : "documentMenu.pinned"),
              );
            }}
            onPresent={() => setFocusMode(true)}
            onShare={() => {
              void navigator.clipboard
                ?.writeText(window.location.href)
                .catch(() => undefined);
              showMessage(t("documentMenu.shared"));
            }}
            onStats={() =>
              showMessage(t("documentMenu.stats", { words: entity.size }))
            }
            onTypeSettings={() => selectEntity(entity.objectTypeId)}
            onUseTemplate={() => duplicateWorkspaceEntity(entity.id)}
            onCopy={() => {
              void navigator.clipboard
                ?.writeText(entity.fileName)
                .catch(() => undefined);
              showMessage(t("documentMenu.copied"));
            }}
          />
        }
      />
      <BufferedTitle
        label={t("fields.title")}
        value={entity.title}
        onCommit={(title) => update({ title })}
      />
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-muted-foreground">{t("lifecycle.file.name")}</dt>
        <dd>{entity.fileName}</dd>
        <dt className="text-muted-foreground">{t("lifecycle.file.type")}</dt>
        <dd>{entity.mimeType || t("lifecycle.file.unknownType")}</dd>
        <dt className="text-muted-foreground">{t("lifecycle.file.size")}</dt>
        <dd>{entity.size} B</dd>
      </dl>
      <MediaAssetRenderer
        className="mt-4"
        downloadLabel={t("lifecycle.file.download")}
        entity={entity}
        onDownload={entity.previewUrl ? download : undefined}
        onRemove={() =>
          update({
            assetId: undefined,
            contentHash: undefined,
            previewUrl: undefined,
            storageState: "missing",
          })
        }
        removeLabel={t("lifecycle.file.remove")}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => replaceInputRef.current?.click()}
        >
          <UploadIcon className="size-4" />
          {t("lifecycle.file.replace")}
        </Button>
      </div>
      <input
        ref={replaceInputRef}
        type="file"
        data-lifecycle-contract={
          objectLifecycleContractSlots.ObjectAttachmentControl
        }
        className="sr-only"
        aria-label={t("lifecycle.file.reselectAction")}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          if (!acceptsFileForType(entity.objectTypeId, file.type, file.name)) {
            setFileError(true);
            return;
          }
          setFileError(false);
          update({ file });
          event.currentTarget.value = "";
        }}
      />
      {fileError && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {t("lifecycle.errors.incompatible-file")}
        </p>
      )}
    </>
  );
}

function WorkspaceObjectPageContent({
  entity,
  structure,
  update,
}: {
  readonly entity: SupportedWorkspaceEntity;
  readonly structure: WorkspaceStructure;
  readonly update: EntityUpdate;
}) {
  if (entity.kind === "file") {
    return <FilePage entity={entity} structure={structure} update={update} />;
  }
  if (entity.kind === "table") {
    return <TablePage entity={entity} structure={structure} update={update} />;
  }
  return <DocumentPage entity={entity} structure={structure} update={update} />;
}

function EditorUtilitiesPopover({
  createdAt,
  onOpenChange,
  onPinToggle,
  open,
  outline,
  pinned,
  statistics,
}: {
  readonly createdAt: string;
  readonly onOpenChange: (open: boolean) => void;
  readonly onPinToggle: () => void;
  readonly open: boolean;
  readonly outline: ReturnType<typeof selectEditorUtilities>["outline"];
  readonly pinned: boolean;
  readonly statistics: ReturnType<typeof selectEditorUtilities>["statistics"];
}) {
  const t = useTranslations("workspace");
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        aria-label={t("editorUtilities.open")}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "absolute right-3 top-1/2 inline-flex h-7 w-7 text-lg font-light",
        )}
      >
        <span aria-hidden>−</span>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="left"
        sideOffset={8}
        className="w-[min(22rem,calc(100vw-2rem))] gap-3 p-3"
      >
        <div className="flex items-center justify-between gap-3">
          <PopoverTitle>{t("editorUtilities.title")}</PopoverTitle>
          <Button
            type="button"
            variant={pinned ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label={t(
              pinned ? "editorUtilities.unpin" : "editorUtilities.pin",
            )}
            aria-pressed={pinned}
            onClick={onPinToggle}
          >
            <PinIcon className="size-4" />
          </Button>
        </div>
        <Tabs defaultValue="outline">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="outline">
              {t("editorUtilities.outline")}
            </TabsTrigger>
            <TabsTrigger value="statistics">
              {t("editorUtilities.statistics")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="outline" className="pt-2">
            {outline.length > 0 ? (
              <ol className="grid gap-1">
                {outline.map((item) => (
                  <li
                    key={item.id}
                    style={{ paddingInlineStart: `${(item.level - 1) * 12}px` }}
                  >
                    <button
                      type="button"
                      className="w-full truncate rounded-sm px-1 py-0.5 text-left text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => {
                        const block = document.querySelector<HTMLElement>(
                          `[data-block-id="${CSS.escape(item.id)}"]`,
                        );
                        block?.scrollIntoView({ block: "center" });
                      }}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("editorUtilities.emptyOutline")}
              </p>
            )}
          </TabsContent>
          <TabsContent value="statistics" className="pt-2">
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
              <dt>{t("editorUtilities.words")}</dt>
              <dd>{statistics.words}</dd>
              <dt>{t("editorUtilities.sentences")}</dt>
              <dd>{statistics.sentences}</dd>
              <dt>{t("editorUtilities.paragraphs")}</dt>
              <dd>{statistics.paragraphs}</dd>
              <dt>{t("editorUtilities.characters")}</dt>
              <dd>{statistics.characters}</dd>
              <dt>{t("editorUtilities.created")}</dt>
              <dd>{new Date(createdAt).toLocaleDateString()}</dd>
            </dl>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

function WorkspaceObjectPageView({ entity }: WorkspaceObjectPageViewProps) {
  const { structures, updateWorkspaceEntity } = useWorkspace();
  const [utilitiesOpen, setUtilitiesOpen] = React.useState(false);
  const [utilitiesPinned, setUtilitiesPinned] = React.useState(false);
  const wideLayout = "wideLayout" in entity && entity.wideLayout === true;
  const structure = resolveStructure(entity, structures);
  const body = isDocumentWorkspaceEntity(entity) ? entity.body : null;
  const editorUtilities = React.useMemo(
    () =>
      body
        ? selectEditorUtilities(body, { createdAt: entity.createdAt })
        : null,
    [body, entity.createdAt],
  );
  const outline = editorUtilities?.outline ?? [];
  const statistics = editorUtilities?.statistics ?? {
    characters: 0,
    paragraphs: 0,
    sentences: 0,
    words: 0,
  };
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
        data-slot="workspace-object-page-column"
        data-wide-layout={wideLayout || undefined}
        className={cn(
          workspaceLongformColumnClass,
          wideLayout && "lg:max-w-[72rem]",
          "lg:pt-[100px]",
        )}
      >
        <WorkspaceObjectPageContent
          entity={entity}
          structure={structure}
          update={update}
        />
      </div>
      <EditorUtilitiesPopover
        createdAt={entity.createdAt}
        onOpenChange={(open) => {
          if (open || !utilitiesPinned) setUtilitiesOpen(open);
        }}
        onPinToggle={() => setUtilitiesPinned((current) => !current)}
        open={utilitiesOpen}
        outline={outline}
        pinned={utilitiesPinned}
        statistics={statistics}
      />
    </section>
  );
}

function canRenderWorkspaceObjectPage(
  entity: WorkspaceEntity | undefined,
): entity is SupportedWorkspaceEntity {
  return (
    entity?.kind === "document" ||
    entity?.kind === "file" ||
    entity?.kind === "quote" ||
    entity?.kind === "table"
  );
}

export type { WorkspaceObjectPageViewProps };
export { canRenderWorkspaceObjectPage, WorkspaceObjectPageView };
