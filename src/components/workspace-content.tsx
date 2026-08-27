"use client";

import {
  AlignLeftIcon,
  BarChart3Icon,
  CalendarDaysIcon,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ExpandIcon,
  FilePenLineIcon,
  ImageIcon,
  Maximize2Icon,
  PinIcon,
  PresentationIcon,
  SearchIcon,
  Settings2Icon,
  Share2Icon,
  SmileIcon,
  SparklesIcon,
  Trash2Icon,
  UploadIcon,
  WandSparklesIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import {
  AppHeaderCaretDownIcon,
  AppHeaderGraphIcon,
} from "@/components/app-header-icons";
import type { AppHeaderTab } from "@/components/app-header-tabs";
import {
  AppSidebarDotsIcon,
  AppSidebarPlusIcon,
  AppSidebarSearchIcon,
} from "@/components/app-sidebar-icons";
import type { AppSidebarObjectType } from "@/components/app-sidebar-overview";
import { AppSidebarSourceIcon } from "@/components/app-sidebar-source-icon";
import { BlockEditor } from "@/components/block-editor";
import {
  ObjectAiChatIcon,
  ObjectAreaIcon,
  ObjectCollectionIcon,
  ObjectIconBadge,
  ObjectPageIcon,
  ObjectQueryIcon,
  ObjectTagIcon,
  type ObjectTypeDefinition,
  objectIconToneBadgeClass,
  objectTypeDefinitionById,
} from "@/components/object-icons";
import { objectLifecycleContractSlots } from "@/components/object-lifecycle-contracts";
import { ObjectTypeToolbarIcon } from "@/components/object-type-toolbar-icon";
import { MediaAssetRenderer } from "@/components/object-view-preview";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { floatingSearchListItemClass } from "@/components/ui/shared-styles";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/components/workspace-controller";
import {
  blockEditorDocumentFromMarkdown,
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToMarkdown,
} from "@/editor/document";
import { useBufferedTextCommit } from "@/hooks/use-buffered-text-commit";
import { cn } from "@/lib/utils";
import {
  type CalendarProjectionEntry,
  type CalendarSpan,
  createDayContext,
  projectCalendarEntries,
} from "@/lib/workspace-dates-calendar";
import {
  createCollectionId,
  createTagId,
  selectWorkspaceCollectionRecordsForStructure,
  type WorkspaceCollectionRecord,
} from "@/lib/workspace-domain-identities";
import { projectWorkspaceGraph } from "@/lib/workspace-graph";
import {
  createWorkspaceObjectLinkIndex,
  selectBacklinksForObject,
  selectObjectsInside,
} from "@/lib/workspace-object-links";
import {
  acceptsFileForType,
  applyQueryDescription,
  type FileEntity,
  type QueryEntity,
  selectQueryResults,
  type TableEntity,
  type TaskEntity,
  type UrlEntity,
  type WorkspaceEntity,
} from "@/lib/workspace-objects";

function AtomicNotesWorkspace() {
  const t = useTranslations("workspace");
  const { mainTabs, mainValue, activeAction, objectTypes, createdEntities } =
    useWorkspace();
  const navigationAction =
    activeAction ?? primaryActionFromMainValue(mainValue);
  const activeTab = mainTabs.find((tab) => tab.id === mainValue);
  const activeObjectType = objectTypes.find((item) => item.id === mainValue);
  const activePresetObjectType: AppSidebarObjectType | undefined =
    !activeObjectType && mainValue === "atomic-note"
      ? {
          id: "atomic-note",
          label:
            activeTab?.label ??
            t("objectTypeStudio.objectTypePlurals.atomic-note"),
          singularLabel: t("objectTypeStudio.objectTypes.atomic-note"),
          icon: objectTypeDefinitionById["atomic-note"].icon,
          iconName: "atomic-note",
          ownership: "legacy",
          tone: objectTypeDefinitionById["atomic-note"].tone,
          count: createdEntities.filter(
            (entity) => entity.objectTypeId === "atomic-note",
          ).length,
        }
      : undefined;
  const activeCreatedEntity = createdEntities.find(
    (entity) => entity.id === mainValue,
  );
  const activeNamedItem = activeTab
    ? parseObjectTypeNamedItemTabId(activeTab.id)
    : null;

  if (navigationAction === "explore") {
    return <ExploreWorkspace />;
  }

  if (navigationAction === "calendar") {
    return <CalendarWorkspace />;
  }

  if (activeCreatedEntity) {
    return <CreatedObjectWorkspace entity={activeCreatedEntity} />;
  }

  const renderedObjectType = activeObjectType ?? activePresetObjectType;
  if (renderedObjectType) {
    return (
      <ObjectTypeWorkspace
        objectType={renderedObjectType}
        presetId={activePresetObjectType ? "atomic-note" : undefined}
      />
    );
  }

  if (activeNamedItem) {
    return <ObjectTypeNamedItemWorkspace item={activeNamedItem} />;
  }

  if (activeTab && activeTab.id !== "new-tab-draft") {
    return <OpenedTabWorkspace label={activeTab.label} />;
  }

  const fallbackObjectType = objectTypes[0];
  return fallbackObjectType ? (
    <ObjectTypeWorkspace objectType={fallbackObjectType} />
  ) : null;
}

function primaryActionFromMainValue(value: string) {
  if (value === "primary-action:explore") return "explore";
  if (value === "primary-action:calendar") return "calendar";
  return undefined;
}

function todayInputValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

const calendarSpans = ["month", "week", "three-day", "day"] as const;

function CalendarWorkspace() {
  const t = useTranslations("workspace");
  const {
    createOrAppendDailyNote,
    createdEntities,
    selectEntity,
    setWorkspaceEntityPropertyValue,
    showMessage,
    spaceId,
    structures,
    updateWorkspaceEntity,
  } = useWorkspace();
  const [date, setDate] = React.useState(todayInputValue);
  const [span, setSpan] = React.useState<CalendarSpan>("week");
  const projection = React.useMemo(
    () =>
      projectCalendarEntries(createdEntities, structures, {
        date,
        spaceId,
        span,
      }),
    [createdEntities, date, spaceId, span, structures],
  );
  const dayContext = React.useMemo(
    () => createDayContext(createdEntities, structures, { date, spaceId }),
    [createdEntities, date, spaceId, structures],
  );

  function openDailyNote() {
    createOrAppendDailyNote(date, undefined, `# ${date}`);
  }

  function reschedule(entry: CalendarProjectionEntry, nextDate: string) {
    if (!nextDate) return;
    if (entry.kind === "task") {
      updateWorkspaceEntity(entry.entity.id, { dueDate: nextDate });
      return;
    }
    if (entry.kind === "dated-object" && entry.propertyId) {
      setWorkspaceEntityPropertyValue(
        entry.entity.id,
        entry.propertyId,
        nextDate,
      );
      return;
    }
    showMessage(t("calendar.derivedItem"));
  }

  return (
    <div
      data-slot="calendar-workspace"
      className="flex h-full min-h-0 flex-col overflow-hidden px-6 py-5 text-foreground"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex min-w-0 items-center gap-2">
          <CalendarDaysIcon className="size-5 text-muted-foreground" />
          <h1 className="truncate text-lg font-semibold">
            {t("calendar.title")}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="date"
            aria-label={t("calendar.date")}
            value={date}
            onChange={(event) =>
              setDate(event.target.value || todayInputValue())
            }
            className="h-8 w-auto"
          />
          <div className="flex overflow-hidden rounded-md border border-border">
            {calendarSpans.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={span === item}
                onClick={() => setSpan(item)}
                className={cn(
                  "h-8 px-3 text-xs font-medium capitalize",
                  span === item
                    ? "bg-accent text-accent-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                {t(`calendar.spans.${item}`)}
              </button>
            ))}
          </div>
          <Button type="button" size="sm" onClick={openDailyNote}>
            <FilePenLineIcon className="size-4" />
            {t("calendar.dailyNote")}
          </Button>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 gap-5 overflow-hidden pt-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-h-0 overflow-auto">
          <div
            className={cn(
              "grid gap-px overflow-hidden rounded-lg border border-border bg-border",
              span === "day"
                ? "grid-cols-1"
                : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-7",
            )}
          >
            {projection.days.map((day) => (
              <section
                key={day.date}
                className="min-h-32 bg-background p-3"
                aria-label={t("calendar.day", { date: day.date })}
              >
                <div className="text-xs font-medium text-muted-foreground">
                  {day.date}
                </div>
                <div className="mt-2 space-y-1">
                  {day.entries.map((entry, index) => (
                    <CalendarEntryRow
                      key={`${entry.kind}:${entry.entity.id}:${entry.propertyId ?? index}`}
                      entry={entry}
                      onOpen={() => selectEntity(entry.entity.id)}
                      onReschedule={(nextDate) => reschedule(entry, nextDate)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        <aside className="min-h-0 overflow-auto border-l border-border pl-5">
          <h2 className="text-sm font-semibold">{t("calendar.dayTitle")}</h2>
          <button
            type="button"
            className="mt-2 block text-left text-sm font-medium hover:underline"
            onClick={() =>
              dayContext.dailyNote
                ? selectEntity(dayContext.dailyNote.id)
                : openDailyNote()
            }
          >
            {dayContext.dailyNote?.title ||
              t("calendar.dailyNoteForDate", { date })}
          </button>
          <h3 className="mt-5 text-xs font-semibold uppercase text-muted-foreground">
            {t("calendar.timeline")}
          </h3>
          <div className="mt-2 space-y-1">
            {dayContext.timeline.map((entry) => (
              <CalendarEntryRow
                key={`timeline:${entry.kind}:${entry.entity.id}:${entry.propertyId ?? entry.date}`}
                entry={entry}
                onOpen={() => selectEntity(entry.entity.id)}
                onReschedule={(nextDate) => reschedule(entry, nextDate)}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function CalendarEntryRow({
  entry,
  onOpen,
  onReschedule,
}: {
  readonly entry: CalendarProjectionEntry;
  readonly onOpen: () => void;
  readonly onReschedule: (date: string) => void;
}) {
  const t = useTranslations("workspace");
  const canReschedule = entry.kind === "task" || entry.kind === "dated-object";
  return (
    <div className="group flex min-h-9 items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted">
      <button
        type="button"
        className="min-w-0 flex-1 truncate text-left"
        onClick={onOpen}
      >
        {entry.title || "Untitled"}
      </button>
      <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
        {t(`calendar.entryKinds.${entry.kind}`)}
      </span>
      {canReschedule ? (
        <Input
          type="date"
          aria-label={t("calendar.reschedule", {
            title: entry.title || t("calendar.item"),
          })}
          value={entry.date}
          onChange={(event) => onReschedule(event.target.value)}
          className="h-7 w-32 opacity-80 group-hover:opacity-100"
        />
      ) : null}
    </div>
  );
}

function CreatedObjectWorkspace({ entity }: { entity: WorkspaceEntity }) {
  const t = useTranslations("workspace");
  const { createdEntities, structures, updateWorkspaceEntity } = useWorkspace();
  const structure = structures.find((item) => item.id === entity.objectTypeId);
  if (!structure) return null;
  const definition = objectTypeDefinitionById[structure.iconName];
  const Icon = definition.icon;
  const objectTypeLabel =
    structure.ownership === "custom"
      ? structure.singularName
      : t(`objectTypeStudio.objectTypes.${entity.objectTypeId}`);

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
        <ObjectIconBadge icon={Icon} tone={definition.tone} variant="menu" />
        <span>{objectTypeLabel}</span>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.moreOptions")}
        className="h-7 w-7 border border-border"
      >
        <AppSidebarDotsIcon className="size-4" />
      </Button>
    </div>
  );

  const update = (patch: Record<string, unknown>) =>
    updateWorkspaceEntity(entity.id, patch);

  let content: React.ReactNode;
  if (entity.kind === "table") {
    content = (
      <TableObjectEditor entity={entity} header={header} update={update} />
    );
  } else if (entity.kind === "task") {
    content = (
      <TaskObjectEditor entity={entity} header={header} update={update} />
    );
  } else if (entity.kind === "url") {
    content = (
      <UrlObjectEditor entity={entity} header={header} update={update} />
    );
  } else if (entity.kind === "tag") {
    const matching = createdEntities.filter(
      (item) =>
        item.id !== entity.id &&
        "tags" in item &&
        entity.title.trim() &&
        item.tags.includes(entity.id),
    );
    content = (
      <TagObjectEditor
        entity={entity}
        header={header}
        matching={matching}
        update={update}
      />
    );
  } else if (entity.kind === "query") {
    content = (
      <QueryObjectEditor
        entity={entity}
        entities={createdEntities}
        header={header}
        update={update}
      />
    );
  } else if (entity.kind === "file") {
    content = (
      <FileObjectEditor entity={entity} header={header} update={update} />
    );
  } else {
    content = (
      <DocumentObjectEditor
        definition={definition}
        entity={entity}
        objectTypeLabel={objectTypeLabel}
        update={update}
      />
    );
  }

  return (
    <div
      data-slot="created-object-workspace"
      data-object-type={entity.objectTypeId}
      className="relative flex h-full min-h-0 flex-col text-foreground"
    >
      {content}
    </div>
  );
}

function ObjectTypeNamedItemWorkspace({
  item,
}: {
  item: ObjectTypeNamedItemTab;
}) {
  const t = useTranslations("workspace");
  const {
    createWorkspaceEntity,
    createdEntities,
    objectTypes,
    objectTypeCollections,
    objectTypeQueries,
    setMainTabs,
    setObjectTypeCollections,
    setObjectTypeQueries,
  } = useWorkspace();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const objectType = objectTypes.find((type) => type.id === item.objectTypeId);
  const collection =
    item.kind === "collection"
      ? objectTypeCollections[item.collectionId]
      : undefined;
  const title =
    collection?.name ??
    (item.kind === "query"
      ? objectTypeQueries[item.objectTypeId]?.[item.index]
      : undefined) ??
    t("objectTypeOverview.untitled");
  const count =
    item.kind === "collection" && collection
      ? createdEntities.filter(
          (entity) =>
            entity.objectTypeId === item.objectTypeId &&
            "collections" in entity &&
            entity.collections.includes(collection.id),
        ).length
      : 0;

  React.useEffect(() => {
    titleRef.current?.focus();
    titleRef.current?.select();
  }, []);

  if (!objectType) return null;

  const ItemIcon =
    item.kind === "collection" ? ObjectCollectionIcon : ObjectQueryIcon;
  const tabId = objectTypeNamedItemTabId(item);

  function rename(value: string) {
    if (item.kind === "collection" && collection) {
      setObjectTypeCollections((current) => ({
        ...current,
        [collection.id]: {
          ...collection,
          name: value.trim() || collection.name,
        },
      }));
    } else if (item.kind === "query") {
      setObjectTypeQueries((current) => ({
        ...current,
        [item.objectTypeId]: (current[item.objectTypeId] ?? []).map(
          (currentItem, currentIndex) =>
            currentIndex === item.index ? value : currentItem,
        ),
      }));
    }
    setMainTabs((current) =>
      current.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              label: value.trim() || t("objectTypeOverview.untitled"),
            }
          : tab,
      ),
    );
  }

  return (
    <div
      data-slot="object-type-named-item-workspace"
      data-kind={item.kind}
      className="relative flex h-full min-h-0 flex-col text-[#282522]"
    >
      <div className="mx-auto flex w-full max-w-[50rem] flex-1 flex-col px-10 pb-12 pt-9">
        <div className="flex items-center justify-between">
          <div className="inline-flex min-w-0 items-center gap-2 rounded-lg px-1.5 py-1 text-sm text-[#77716b]">
            <ObjectIconBadge
              icon={objectType.icon}
              tone={objectType.tone}
              variant="menu"
            />
            <span className="truncate">{objectType.label}</span>
          </div>
          <Button
            className="h-8 rounded-lg px-3 text-sm font-normal"
            onClick={() =>
              createWorkspaceEntity(objectType.id, objectType.label)
            }
          >
            <AppSidebarPlusIcon className="size-4" />
            {t("actions.new")}
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-3 text-[#77716b]">
          <ObjectIconBadge icon={ItemIcon} tone="gray" />
          <span className="text-sm">
            {t("objectTypeOverview.entryCount", { count })}
          </span>
        </div>

        <BufferedTextInput
          inputRef={titleRef}
          aria-label={t("fields.title")}
          value={title}
          onCommit={rename}
          className="mt-3 w-full bg-transparent text-[40px] font-bold leading-[44px] tracking-[-0.02em] text-[#282522] outline-none placeholder:text-[#b8b2ac]"
          placeholder={t("objectTypeOverview.untitled")}
        />

        <section className="mt-10 flex min-h-[220px] flex-col items-center justify-center rounded-2xl text-center">
          <ItemIcon className="mb-3 size-5 text-[#77716b]" />
          <p className="text-sm font-medium text-[#34312f]">
            {t("objectTypeOverview.namedItemViewNotReady")}
          </p>
          <p className="mt-1 max-w-md text-[13px] leading-5 text-[#77716b]">
            {t("objectTypeOverview.namedItemViewNotReadyDescription")}
          </p>
        </section>
      </div>
    </div>
  );
}

type ObjectEditorProps = {
  header: React.ReactNode;
  update: (patch: Record<string, unknown>) => void;
};
type DocumentWorkspaceEntity =
  | Extract<WorkspaceEntity, { kind: "document" }>
  | Extract<WorkspaceEntity, { kind: "quote" }>;

const editorCardClass =
  "mx-3 mt-6 min-h-[302px] shrink-0 rounded-2xl border border-border bg-card px-10 pt-8";
const titleFieldClass =
  "mt-[14px] block min-h-[39px] w-full resize-none overflow-x-hidden overflow-y-hidden bg-transparent px-0 py-0 text-[30px] font-bold leading-[33px] tracking-normal text-foreground shadow-none outline-none placeholder:text-sidebar-foreground [overflow-wrap:anywhere]";
const bodyFieldClass =
  "mt-3 min-h-28 w-full resize-none overflow-x-hidden overflow-y-hidden bg-transparent px-0 py-0 text-base leading-6 text-foreground shadow-none outline-none placeholder:text-sidebar-foreground [overflow-wrap:anywhere]";

function ObjectEditorShell({
  children,
  className,
  dataSlot,
}: {
  children: React.ReactNode;
  className?: string;
  dataSlot: string;
}) {
  return (
    <section
      className={cn(editorCardClass, className)}
      data-lifecycle-contract={objectLifecycleContractSlots.ObjectEditorShell}
      data-slot={dataSlot}
    >
      {children}
    </section>
  );
}

function useAutosizeTextarea(ref: React.RefObject<HTMLTextAreaElement | null>) {
  React.useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  });
}

type AutosizeTextareaProps = React.ComponentProps<typeof Textarea> & {
  value: string;
};

function AutosizeTextarea({
  value,
  className,
  ...props
}: AutosizeTextareaProps) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  useAutosizeTextarea(ref);

  return <Textarea ref={ref} value={value} className={className} {...props} />;
}

type BufferedTextInputProps<TValue> = Omit<
  React.ComponentProps<"input">,
  "onBlur" | "onChange" | "value"
> & {
  value: TValue;
  onCommit: (value: TValue) => void;
  delay?: number;
  format?: (value: TValue) => string;
  inputRef?: React.Ref<HTMLInputElement>;
  parse?: (draft: string) => TValue;
};

function BufferedTextInput<TValue>({
  value,
  onCommit,
  delay,
  format,
  inputRef,
  parse,
  ...props
}: BufferedTextInputProps<TValue>) {
  const { inputProps } = useBufferedTextCommit({
    value,
    onCommit,
    delay,
    format,
    parse,
  });

  return <input ref={inputRef} {...props} {...inputProps} />;
}

type BufferedInputProps<TValue> = Omit<
  React.ComponentProps<typeof Input>,
  "onBlur" | "onChange" | "value"
> & {
  value: TValue;
  onCommit: (value: TValue) => void;
  delay?: number;
  format?: (value: TValue) => string;
  parse?: (draft: string) => TValue;
};

function BufferedInput<TValue>({
  value,
  onCommit,
  delay,
  format,
  parse,
  ...props
}: BufferedInputProps<TValue>) {
  const { inputProps } = useBufferedTextCommit({
    value,
    onCommit,
    delay,
    format,
    parse,
  });

  return <Input {...props} {...inputProps} />;
}

type BufferedAutosizeTextareaProps = Omit<
  AutosizeTextareaProps,
  "onBlur" | "onChange"
> & {
  onCommit: (value: string) => void;
};

function BufferedAutosizeTextarea({
  value,
  onCommit,
  ...props
}: BufferedAutosizeTextareaProps) {
  const { inputProps } = useBufferedTextCommit({
    value,
    onCommit,
  });

  return <AutosizeTextarea {...props} {...inputProps} />;
}

function EditableObjectTitle({
  label,
  placeholder,
  value,
  onValueChange,
  className,
}: {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { draft, inputProps, setDraft, commitNow } = useBufferedTextCommit({
    value,
    onCommit: onValueChange,
  });

  React.useLayoutEffect(() => {
    const heading = ref.current;
    if (!heading || document.activeElement === heading) return;
    if (heading.textContent !== draft) heading.textContent = draft;
  }, [draft]);

  return (
    // biome-ignore lint/a11y/useSemanticElements: Capacities-style editable titles need contentEditable wrapping and selection behavior that input/textarea cannot match here.
    <div
      ref={ref}
      role="textbox"
      aria-label={label}
      aria-multiline={false}
      tabIndex={0}
      contentEditable="plaintext-only"
      data-lifecycle-contract={objectLifecycleContractSlots.EditableObjectTitle}
      data-placeholder={placeholder}
      suppressContentEditableWarning
      className={cn(
        titleFieldClass,
        "cursor-text whitespace-pre-wrap empty:before:text-sidebar-foreground empty:before:content-[attr(data-placeholder)]",
        className,
      )}
      onInput={(event) => setDraft(event.currentTarget.textContent ?? "")}
      onBlur={inputProps.onBlur}
      onCompositionEnd={inputProps.onCompositionEnd}
      onCompositionStart={inputProps.onCompositionStart}
      onFocus={inputProps.onFocus}
      onKeyDown={(event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        commitNow();
      }}
    />
  );
}

function EntityTitleField({
  title,
  update,
}: {
  title: string;
  update: ObjectEditorProps["update"];
}) {
  const t = useTranslations("workspace");
  return (
    <EditableObjectTitle
      label={t("fields.title")}
      placeholder={t("fields.title")}
      value={title}
      onValueChange={(value) => update({ title: value })}
    />
  );
}

function isDocumentWorkspaceEntity(
  entity: WorkspaceEntity | undefined,
): entity is DocumentWorkspaceEntity {
  return entity?.kind === "document" || entity?.kind === "quote";
}

function DocumentObjectEditor({
  definition,
  entity,
  objectTypeLabel,
  update,
}: {
  definition: ObjectTypeDefinition;
  entity:
    | Extract<WorkspaceEntity, { kind: "document" }>
    | Extract<WorkspaceEntity, { kind: "quote" }>;
  objectTypeLabel: string;
  update: ObjectEditorProps["update"];
}) {
  const t = useTranslations("workspace");
  const Icon = definition.icon;
  const {
    changeWorkspaceEntityType,
    createWorkspacePage,
    createdEntities,
    deleteWorkspaceEntity,
    duplicateWorkspaceEntity,
    objectTypeCollections,
    pinnedEntities,
    selectEntity,
    setFocusMode,
    setPinnedEntities,
    showMessage,
  } = useWorkspace();
  const [wideLayout, setWideLayout] = React.useState(false);
  const [showDescription, setShowDescription] = React.useState(
    Boolean(entity.description),
  );
  const [showAliases, setShowAliases] = React.useState(
    Boolean(entity.aliases?.length),
  );
  const [findOpen, setFindOpen] = React.useState(false);
  const importInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);
  const isPinned = pinnedEntities.some((item) => item.id === entity.id);
  const editorLabels = React.useMemo(
    () => ({
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
        alphabeticalList: t("editor.slashMenu.alphabeticalList"),
        bulletList: t("editor.slashMenu.bulletList"),
        orderedList: t("editor.slashMenu.orderedList"),
        romanList: t("editor.slashMenu.romanList"),
        taskList: t("editor.slashMenu.taskList"),
        select: t("editor.slashMenu.select"),
        blockquote: t("editor.slashMenu.blockquote"),
        codeBlock: t("editor.slashMenu.codeBlock"),
        horizontalRule: t("editor.slashMenu.horizontalRule"),
        title: t("editor.slashMenu.title"),
      },
    }),
    [t],
  );
  const linkIndex = React.useMemo(
    () => createWorkspaceObjectLinkIndex(createdEntities),
    [createdEntities],
  );
  const backlinks = selectBacklinksForObject(linkIndex, entity.id);
  const backlinkPreviewSources = React.useMemo(
    () =>
      backlinks.reduce<DocumentWorkspaceEntity[]>((sources, backlink) => {
        if (sources.some((source) => source.id === backlink.sourceId)) {
          return sources;
        }
        const source = createdEntities.find(
          (candidate) => candidate.id === backlink.sourceId,
        );
        if (isDocumentWorkspaceEntity(source)) sources.push(source);
        return sources;
      }, []),
    [backlinks, createdEntities],
  );

  const changeType = (objectTypeId: "tag" | "task") =>
    changeWorkspaceEntityType(entity.id, objectTypeId);

  function togglePin() {
    setPinnedEntities((current) =>
      isPinned
        ? current.filter((item) => item.id !== entity.id)
        : [
            ...current,
            {
              id: entity.id,
              label: entity.title || t("fields.title"),
              icon: Icon,
              tone: definition.tone,
            },
          ],
    );
    showMessage(t(isPinned ? "documentMenu.unpinned" : "documentMenu.pinned"));
  }

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

  function importCover(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () =>
      update({
        coverImage:
          typeof reader.result === "string" ? reader.result : undefined,
      }),
    );
    reader.readAsDataURL(file);
  }

  function fillDescription() {
    setShowDescription(true);
    update({
      description: entity.description || entity.title || t("fields.title"),
    });
  }

  function fillAliases() {
    setShowAliases(true);
    const title = entity.title.trim();
    update({ aliases: title ? [title.toLocaleLowerCase()] : [] });
  }

  return (
    <section
      className="h-full min-h-0 w-full overflow-y-auto px-6"
      data-lifecycle-contract={objectLifecycleContractSlots.ObjectEditorShell}
      data-slot="document-object-editor"
    >
      <div
        className={cn(
          "mx-auto w-full pb-12 pl-10 pr-8 pt-9 transition-[max-width]",
          wideLayout ? "max-w-none" : "max-w-[50rem]",
        )}
      >
        {entity.coverImage && (
          <div
            className="mb-8 h-40 w-full rounded-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${entity.coverImage})` }}
          />
        )}
        {findOpen && (
          <div className="mb-3 flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-3 shadow-sm">
            <SearchIcon className="size-4 text-muted-foreground" />
            <input
              aria-label={t("documentMenu.findPage")}
              placeholder={t("documentMenu.findPage")}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              aria-label={t("actions.close")}
              onClick={() => setFindOpen(false)}
              className="text-xs text-muted-foreground"
            >
              Esc
            </button>
          </div>
        )}
        <div className="group/page-view-header flex h-[26px] min-w-0 items-center gap-1.5 overflow-hidden">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden text-sm text-sidebar-foreground">
            <CompoundChip
              className={cn(objectIconToneBadgeClass[definition.tone])}
            >
              <CompoundChipPrimary
                onClick={() => selectEntity(entity.objectTypeId)}
              >
                <InlinePropertyIcon icon={Icon} className="mr-[0.325em]" />
                <span className="min-w-[1.3em] text-center text-[1em]">
                  {objectTypeLabel}
                </span>
              </CompoundChipPrimary>
              <ObjectTypePickerTrigger onSelect={changeType} />
            </CompoundChip>
            <CollectionPropertyEditor
              collections={entity.collections}
              objectTypeId={entity.objectTypeId}
              suggestions={selectWorkspaceCollectionRecordsForStructure(
                objectTypeCollections,
                entity.objectTypeId,
              )}
              update={update}
            />
          </div>
          <div className="ml-auto flex h-[26px] max-w-[9rem] shrink-0 items-center justify-end gap-1.5 overflow-hidden">
            <CustomizeDocumentMenu
              wideLayout={wideLayout}
              onWideLayoutChange={setWideLayout}
              onShowAliases={() => setShowAliases(true)}
              onShowDescription={() => setShowDescription(true)}
              onAddCover={() => coverInputRef.current?.click()}
              onIcon={(customIcon) => update({ customIcon })}
              onFillAliases={fillAliases}
              onFillDescription={fillDescription}
            />
          </div>
          <DocumentMoreMenu
            isPinned={isPinned}
            onChangeType={changeType}
            onCustomize={() => {
              setWideLayout((current) => !current);
              showMessage(t("documentMenu.customizeHint"));
            }}
            onDelete={() => deleteWorkspaceEntity(entity.id)}
            onDuplicate={() => duplicateWorkspaceEntity(entity.id)}
            onEditCollections={() =>
              showMessage(t("documentMenu.collectionsHint"))
            }
            onExport={exportMarkdown}
            onFind={() => setFindOpen(true)}
            onImport={() => importInputRef.current?.click()}
            onPin={togglePin}
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
            onTypeSettings={() => selectEntity(entity.objectTypeId)}
            onUseTemplate={() => duplicateWorkspaceEntity(entity.id)}
            onCopy={() => {
              void navigator.clipboard
                ?.writeText(blockEditorDocumentToMarkdown(entity.body))
                .catch(() => undefined);
              showMessage(t("documentMenu.copied"));
            }}
          />
        </div>
        <EntityTitleField title={entity.title} update={update} />
        {entity.customIcon && (
          <button
            type="button"
            aria-label={t("documentMenu.addIcon")}
            className="mt-1 text-3xl"
            onClick={() => update({ customIcon: undefined })}
          >
            {entity.customIcon}
          </button>
        )}
        {showDescription && (
          <BufferedInput
            aria-label={t("documentMenu.description")}
            placeholder={t("documentMenu.description")}
            value={entity.description ?? ""}
            onCommit={(description) => update({ description })}
            className="mt-1 block w-full bg-transparent text-sm text-muted-foreground outline-none"
          />
        )}
        {showAliases && (
          <BufferedTextInput
            aria-label={t("documentMenu.aliases")}
            placeholder={t("documentMenu.aliases")}
            value={entity.aliases ?? []}
            format={(aliases) => aliases.join(", ")}
            parse={(draft) =>
              draft
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            }
            onCommit={(aliases) => update({ aliases })}
            className="mt-1 block w-full bg-transparent text-sm text-muted-foreground outline-none"
          />
        )}
        <TagPropertyEditor
          tags={entity.tags}
          suggestions={createdEntities
            .filter((item) => item.kind === "tag")
            .map((item) => ({
              id: item.id,
              name: item.title.trim() || item.id,
            }))}
          update={update}
        />
        <div
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
            labels={editorLabels}
          />
        </div>
        {backlinkPreviewSources.map((source) => (
          <section
            key={`${source.id}-readonly-backlink`}
            data-slot="workspace-readonly-backlink-preview"
            className="mt-10 grid gap-2 border-l pl-3"
          >
            <h3 className="truncate text-sm font-medium">
              {source.title.trim() || t("lifecycle.untitled")}
            </h3>
            <BlockEditor
              ariaLabel={t("fields.text")}
              placeholder={t("fields.text")}
              value={source.body}
              editable={false}
              className="mt-0 min-h-0"
              labels={editorLabels}
            />
          </section>
        ))}
        <input
          ref={importInputRef}
          type="file"
          accept=".md,.txt,text/plain,text/markdown"
          className="hidden"
          onChange={(event) => void importMarkdown(event.target.files?.[0])}
        />
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => importCover(event.target.files?.[0])}
        />
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.collapseEditor")}
        className="absolute right-3 top-1/2 hidden h-7 w-7 text-lg font-light md:inline-flex"
      >
        <span aria-hidden="true">−</span>
      </Button>
    </section>
  );
}

function ObjectTypePickerTrigger({
  onSelect,
}: {
  onSelect: (id: "tag" | "task") => void;
}) {
  const t = useTranslations("workspace");
  const [query, setQuery] = React.useState("");
  const choices = ["tag", "task"] as const;
  const visibleChoices = choices.filter((id) =>
    t(`objectTypeStudio.objectTypes.${id}`)
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );

  return (
    <DropdownMenu onOpenChange={(open) => !open && setQuery("")}>
      <DropdownMenuTrigger
        render={
          <CompoundChipDisclosure aria-label={t("lifecycle.changeObjectType")}>
            <AppHeaderCaretDownIcon className="size-[1em]" />
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
        {visibleChoices.map((id) => {
          const choice = objectTypeDefinitionById[id];
          const ChoiceIcon = choice.icon;
          return (
            <DropdownMenuItem
              key={id}
              className="h-8 gap-2 px-1.5"
              onClick={() => onSelect(id)}
            >
              <ObjectIconBadge
                icon={ChoiceIcon}
                tone={choice.tone}
                variant="menu"
              />
              <span>{t(`objectTypeStudio.objectTypes.${id}`)}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CollectionPropertyEditor({
  collections,
  objectTypeId,
  suggestions,
  update,
}: {
  collections: string[];
  objectTypeId: string;
  suggestions: readonly WorkspaceCollectionRecord[];
  update: ObjectEditorProps["update"];
}) {
  const t = useTranslations("workspace");
  const { objectTypeCollections, setObjectTypeCollections } = useWorkspace();
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(query);
  const [open, setOpen] = React.useState(false);
  const visible = suggestions.filter((item) => {
    return (
      !collections.includes(item.id) &&
      item.name
        .toLocaleLowerCase()
        .includes(deferredQuery.trim().toLocaleLowerCase())
    );
  });
  const collectionNamesById = new Map(
    suggestions.map((collection) => [collection.id, collection.name]),
  );

  function createCollection() {
    const requested = query.trim() || t("documentMenu.untitledCollection");
    const taken = new Set([
      ...suggestions.map((collection) => collection.name),
      ...collections.map((collection) => collectionNamesById.get(collection)),
    ]);
    let collection = requested;
    let suffix = 2;
    while (taken.has(collection)) {
      collection = `${requested} ${suffix}`;
      suffix += 1;
    }
    const collectionId = createCollectionId(
      objectTypeId,
      collection,
      new Set(Object.keys(objectTypeCollections)),
    );
    setObjectTypeCollections((current) => ({
      ...current,
      [collectionId]: {
        id: collectionId,
        name: collection,
        structureId: objectTypeId,
      },
    }));
    update({ collections: [...collections, collectionId] });
    setQuery("");
    setOpen(false);
  }
  return (
    <div className="flex min-w-0 shrink items-center gap-1 overflow-hidden">
      {collections.map((collection) => (
        <button
          key={collection}
          type="button"
          aria-label={`${t("objectTypeOverview.remove")} ${
            collectionNamesById.get(collection) ?? collection
          }`}
          onClick={() =>
            update({
              collections: collections.filter((item) => item !== collection),
            })
          }
          className="inline-flex max-w-24 min-w-0 shrink items-center overflow-x-clip whitespace-nowrap rounded-[0.475em] border border-[oklch(0.9856_0.0016_67)] bg-[oklch(0.9856_0.0016_67)] px-[0.49em] py-[0.2em] leading-[1.3] text-[oklch(0.2987_0.0072_285.88)] active:brightness-[0.94] sm:max-w-32"
        >
          <span className="truncate">
            {collectionNamesById.get(collection) ?? collection}
          </span>
        </button>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          nativeButton={false}
          render={
            <label
              role="presentation"
              className="inline-flex min-w-0 shrink items-center overflow-hidden whitespace-nowrap rounded-[0.475em] border border-transparent px-[0.49em] py-[0.2em] leading-[1.3] hover:bg-muted/70"
            >
              <InlinePropertyIcon icon={ObjectCollectionIcon} />
              <input
                aria-label={t("objects.collections")}
                placeholder={t("objects.collections")}
                value={query}
                onFocus={() => setOpen(true)}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setOpen(true);
                }}
                className="ml-1.5 w-[68px] min-w-0 flex-none truncate bg-transparent leading-[18.2px] outline-none placeholder:text-sidebar-foreground"
              />
            </label>
          }
        />
        <PopoverContent
          align="start"
          sideOffset={5}
          initialFocus={false}
          className="w-[254px] min-w-[254px] gap-0 p-1.5"
        >
          <button
            type="button"
            className={floatingSearchListItemClass}
            onClick={createCollection}
          >
            <AppSidebarPlusIcon className="size-4" />
            {query.trim()
              ? t("documentMenu.newCollectionNamed", {
                  collection: query.trim(),
                })
              : t("documentMenu.newCollection")}
          </button>
          {visible.length
            ? visible.map((collection) => (
                <button
                  type="button"
                  key={collection.id}
                  className={floatingSearchListItemClass}
                  onClick={() => {
                    update({
                      collections: [...collections, collection.id],
                    });
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <ObjectCollectionIcon className="size-4" />
                  <span className="truncate">{collection.name}</span>
                </button>
              ))
            : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}

const documentMenuItemClass = cn(workspaceOverflowMenuItemClass, "gap-2 px-2");

function CustomizeDocumentMenu({
  wideLayout,
  onWideLayoutChange,
  onShowAliases,
  onShowDescription,
  onAddCover,
  onIcon,
  onFillAliases,
  onFillDescription,
}: {
  wideLayout: boolean;
  onWideLayoutChange: (value: boolean) => void;
  onShowAliases: () => void;
  onShowDescription: () => void;
  onAddCover: () => void;
  onIcon: (icon: string) => void;
  onFillAliases: () => void;
  onFillDescription: () => void;
}) {
  const t = useTranslations("workspace");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="pointer-events-none flex h-[26px] max-w-full min-w-0 items-center gap-1.5 rounded-[0.475em] border border-transparent bg-transparent px-2 pr-1 text-sm text-sidebar-foreground opacity-0 transition-opacity duration-200 hover:bg-muted/70 group-hover/page-view-header:pointer-events-auto group-hover/page-view-header:opacity-100 data-popup-open:pointer-events-auto data-popup-open:opacity-100"
      >
        <Settings2Icon className="size-3.5 shrink-0" />
        <span className="truncate">{t("actions.customize")}</span>
        <AppHeaderCaretDownIcon className="size-3.5 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={5}
        className="w-[276px] min-w-[276px] p-1.5"
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={documentMenuItemClass}>
            <SmileIcon className="size-4" />
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
        <DropdownMenuItem
          className={documentMenuItemClass}
          onClick={onShowDescription}
        >
          <AlignLeftIcon className="size-4" />
          {t("documentMenu.addDescription")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={documentMenuItemClass}
          onClick={onFillDescription}
        >
          <SparklesIcon className="size-4" />
          {t("documentMenu.fillDescription")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={documentMenuItemClass}
          onClick={onShowAliases}
        >
          <CopyIcon className="size-4" />
          {t("documentMenu.addAliases")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={documentMenuItemClass}
          onClick={onFillAliases}
        >
          <WandSparklesIcon className="size-4" />
          {t("documentMenu.fillAliases")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={documentMenuItemClass}
          onClick={onAddCover}
        >
          <ImageIcon className="size-4" />
          {t("documentMenu.addCover")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={documentMenuItemClass}
          onClick={() => {
            onFillDescription();
            onFillAliases();
          }}
        >
          <SparklesIcon className="size-4" />
          {t("documentMenu.fillProperties")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={documentMenuItemClass}
          onClick={() => onWideLayoutChange(!wideLayout)}
        >
          <ExpandIcon className="size-4" />
          {t("documentMenu.wideLayout")}{" "}
          {wideLayout && <CheckIcon className="ml-auto size-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TypeChangeSubmenu({
  onSelect,
}: {
  onSelect: (id: "tag" | "task") => void;
}) {
  const t = useTranslations("workspace");
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={documentMenuItemClass}>
        {t("documentMenu.changeType")}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-[220px] p-1.5">
        {(["tag", "task"] as const).map((id) => {
          const definition = objectTypeDefinitionById[id];
          const Icon = definition.icon;
          return (
            <DropdownMenuItem
              key={id}
              className={documentMenuItemClass}
              onClick={() => onSelect(id)}
            >
              <ObjectIconBadge
                icon={Icon}
                tone={definition.tone}
                variant="menu"
              />
              {t(`objectTypeStudio.objectTypes.${id}`)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

function DocumentMoreMenu({
  isPinned,
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
}: {
  isPinned: boolean;
  onChangeType: (id: "tag" | "task") => void;
  onCustomize: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onEditCollections: () => void;
  onExport: () => void;
  onFind: () => void;
  onImport: () => void;
  onPin: () => void;
  onPresent: () => void;
  onShare: () => void;
  onStats: () => void;
  onTypeSettings: () => void;
  onUseTemplate: () => void;
  onCopy: () => void;
}) {
  const t = useTranslations("workspace");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        aria-label={t("actions.moreOptions")}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "h-[26px] w-[26px] shrink-0 rounded-[0.475em] border border-border",
        )}
      >
        <AppSidebarDotsIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={5}
        className={cn(workspaceOverflowMenuContentClass, "min-w-[269px] p-1.5")}
      >
        <DropdownMenuItem className={documentMenuItemClass} onClick={onFind}>
          <SearchIcon className="size-4" />
          {t("documentMenu.findPage")}
          <DropdownMenuShortcut>CtrlF</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={documentMenuItemClass}>
            <Settings2Icon className="size-4" />
            {t("actions.customize")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-[220px]">
            <DropdownMenuItem
              className={documentMenuItemClass}
              onClick={onCustomize}
            >
              {t("documentMenu.customizeHint")}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={documentMenuItemClass}>
            <FilePenLineIcon className="size-4" />
            {t("documentMenu.useTemplate")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              className={documentMenuItemClass}
              onClick={onUseTemplate}
            >
              {t("documentMenu.defaultTemplate")}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem
          className={documentMenuItemClass}
          onClick={onEditCollections}
        >
          <ObjectCollectionIcon className="size-4" />
          {t("documentMenu.editCollections")}
        </DropdownMenuItem>
        <DropdownMenuItem className={documentMenuItemClass} onClick={onPin}>
          <PinIcon className="size-4" />
          {t(
            isPinned ? "documentMenu.unpinSidebar" : "documentMenu.pinSidebar",
          )}
          <DropdownMenuShortcut>Ctrl⇧*</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <TypeChangeSubmenu onSelect={onChangeType} />
        <DropdownMenuItem
          className={documentMenuItemClass}
          onClick={onTypeSettings}
        >
          <Settings2Icon className="size-4" />
          {t("documentMenu.typeSettings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={documentMenuItemClass} onClick={onShare}>
          <Share2Icon className="size-4" />
          {t("documentMenu.share")}
        </DropdownMenuItem>
        <DropdownMenuItem className={documentMenuItemClass} onClick={onPresent}>
          <PresentationIcon className="size-4" />
          {t("documentMenu.present")}
          <DropdownMenuShortcut>CtrlAltP</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className={documentMenuItemClass} onClick={onExport}>
          <DownloadIcon className="size-4" />
          {t("documentMenu.export")}
          <DropdownMenuShortcut>CtrlE</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className={documentMenuItemClass} onClick={onImport}>
          <UploadIcon className="size-4" />
          {t("documentMenu.import")}
          <DropdownMenuShortcut>CtrlI</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={documentMenuItemClass}>
            <BarChart3Icon className="size-4" />
            {t("documentMenu.textStats")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              className={documentMenuItemClass}
              onClick={onStats}
            >
              {t("documentMenu.statsHint")}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={documentMenuItemClass}>
            <CopyIcon className="size-4" />
            {t("documentMenu.copy")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              className={documentMenuItemClass}
              onClick={onCopy}
            >
              <CopyIcon className="size-4" />
              {t("documentMenu.copyText")}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem
          className={documentMenuItemClass}
          onClick={onDuplicate}
        >
          <CopyIcon className="size-4" />
          {t("documentMenu.duplicate")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className={documentMenuItemClass}
          onClick={onDelete}
        >
          <Trash2Icon className="size-4" />
          {t("documentMenu.deleteObject")}
          <DropdownMenuShortcut>Ctrl⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function InlinePropertyIcon({
  icon: Icon,
  className,
}: {
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "ml-[-0.1em] inline-flex size-[17.09375px] shrink-0 items-center justify-center rounded-[0.33em]",
        className ?? "mr-[-0.1em]",
      )}
    >
      <Icon className="size-[14.46875px]" />
    </span>
  );
}

function TagPropertyEditor({
  tags,
  suggestions,
  update,
}: {
  tags: string[];
  suggestions: readonly { id: string; name: string }[];
  update: ObjectEditorProps["update"];
}) {
  const t = useTranslations("workspace");
  const [draft, setDraft] = React.useState("");
  const deferredDraft = React.useDeferredValue(draft);
  const [open, setOpen] = React.useState(false);
  const visibleSuggestions = suggestions.filter(
    (tag) =>
      !tags.includes(tag.id) &&
      tag.name
        .toLocaleLowerCase()
        .includes(deferredDraft.trim().toLocaleLowerCase()),
  );
  const tagNamesById = new Map(suggestions.map((tag) => [tag.id, tag.name]));

  function commitDraft() {
    const nextTags = draft
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => createTagId(tag, new Set(tags)))
      .filter((tag) => !tags.includes(tag));
    if (nextTags.length) update({ tags: [...tags, ...nextTags] });
    setDraft("");
    setOpen(false);
  }

  return (
    <div className="mt-1 flex min-h-0 min-w-0 flex-wrap items-center gap-1.5 py-0.5 text-sm text-sidebar-foreground">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          aria-label={`${t("objectTypeOverview.remove")} ${
            tagNamesById.get(tag) ?? tag
          }`}
          className="inline-flex max-w-full min-w-0 shrink-0 items-center overflow-x-clip whitespace-nowrap rounded-[0.475em] border border-[oklch(0.9563_0.0444_203.48)] bg-[oklch(0.9563_0.0444_203.48)] px-[0.49em] py-[0.2em] leading-[1.3] text-[oklch(0.3622_0.0423_219.72)] active:brightness-[0.94]"
          onClick={() => update({ tags: tags.filter((item) => item !== tag) })}
        >
          <span className="block min-w-0 truncate text-left text-[1em]">
            {tagNamesById.get(tag) ?? tag}
          </span>
        </button>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          nativeButton={false}
          render={
            <label
              role="presentation"
              className="inline-flex min-w-0 items-center whitespace-nowrap rounded-[0.475em] border border-transparent px-[0.49em] py-[0.2em] leading-[1.3] hover:bg-muted/70"
            >
              <InlinePropertyIcon icon={ObjectTagIcon} />
              <input
                aria-label={t("fields.tags")}
                placeholder={t("fields.tags")}
                value={draft}
                onFocus={() => setOpen(true)}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    commitDraft();
                  }
                }}
                className="ml-1.5 min-w-[3.9rem] max-w-48 bg-transparent leading-[18.2px] outline-none [field-sizing:content] placeholder:text-sidebar-foreground"
              />
            </label>
          }
        />
        <PopoverContent
          align="start"
          sideOffset={5}
          initialFocus={false}
          className="w-[257px] min-w-[257px] gap-0 p-1.5"
        >
          {visibleSuggestions.map((tag) => (
            <button
              type="button"
              key={tag.id}
              className={floatingSearchListItemClass}
              onClick={() => {
                update({ tags: [...tags, tag.id] });
                setDraft("");
                setOpen(false);
              }}
            >
              <ObjectTagIcon className="size-4" />
              <span className="truncate">{tag.name}</span>
            </button>
          ))}
          {draft.trim() &&
            !suggestions.some(
              (tag) =>
                tag.name.toLocaleLowerCase() ===
                draft.trim().toLocaleLowerCase(),
            ) && (
              <button
                type="button"
                className={floatingSearchListItemClass}
                onClick={commitDraft}
              >
                <AppSidebarPlusIcon className="size-4" />
                {t("documentMenu.newTag", { tag: draft.trim() })}
              </button>
            )}
          {!draft.trim() && (
            <button
              type="button"
              className={floatingSearchListItemClass}
              onClick={() => setDraft("")}
            >
              <AppSidebarPlusIcon className="size-4" />
              {t("documentMenu.newTagEmpty")}
            </button>
          )}
          <button
            type="button"
            className={floatingSearchListItemClass}
            onClick={() => setDraft("")}
          >
            <SearchIcon className="size-4" />
            {t("documentMenu.searchAllTags")}
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function TableObjectEditor({
  entity,
  header,
  update,
}: ObjectEditorProps & { entity: TableEntity }) {
  const t = useTranslations("workspace");
  return (
    <ObjectEditorShell className="pb-8" dataSlot="table-object-editor">
      {header}
      <EntityTitleField title={entity.title} update={update} />
      <BufferedAutosizeTextarea
        data-lifecycle-contract={
          objectLifecycleContractSlots.EditableObjectBody
        }
        aria-label={t("lifecycle.table.notes")}
        placeholder={t("lifecycle.table.notes")}
        value={entity.notes}
        onCommit={(notes) => update({ notes })}
        className="mt-1 min-h-16 w-full resize-none overflow-x-hidden overflow-y-hidden bg-transparent px-0 py-0 text-sm shadow-none outline-none [overflow-wrap:anywhere]"
      />
      <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-lg border">
        {entity.cells.map((cell) => (
          <BufferedTextInput
            key={cell.id}
            data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
            aria-label={t("lifecycle.table.cell", {
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
            className="rounded-none border-0 border-b border-r shadow-none last:border-b-0 even:border-r-0"
          />
        ))}
      </div>
    </ObjectEditorShell>
  );
}

function TaskObjectEditor({
  entity,
  header,
  update,
}: ObjectEditorProps & { entity: TaskEntity }) {
  const t = useTranslations("workspace");
  return (
    <ObjectEditorShell dataSlot="task-object-editor">
      {header}
      <EntityTitleField title={entity.title} update={update} />
      <div
        className="mt-2 flex flex-wrap items-center gap-4 text-sm"
        data-lifecycle-contract={objectLifecycleContractSlots.ObjectFieldGroup}
      >
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={entity.completed}
            onChange={(event) => update({ completed: event.target.checked })}
          />
          {t("lifecycle.task.completed")}
        </label>
        <Input
          type="date"
          aria-label={t("lifecycle.task.dueDate")}
          value={entity.dueDate ?? ""}
          onChange={(event) => update({ dueDate: event.target.value || null })}
          className="h-8 w-auto"
        />
      </div>
      <BufferedAutosizeTextarea
        data-lifecycle-contract={
          objectLifecycleContractSlots.EditableObjectBody
        }
        aria-label={t("fields.text")}
        placeholder={t("fields.text")}
        value={entity.body}
        onCommit={(body) => update({ body })}
        className={bodyFieldClass}
      />
    </ObjectEditorShell>
  );
}

function UrlObjectEditor({
  entity,
  header,
  update,
}: ObjectEditorProps & { entity: UrlEntity }) {
  const t = useTranslations("workspace");
  return (
    <ObjectEditorShell dataSlot="url-object-editor">
      {header}
      <a
        href={entity.url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 block truncate text-sm text-blue-600 underline-offset-4 hover:underline"
      >
        {entity.url}
      </a>
      <EntityTitleField title={entity.title} update={update} />
      <BufferedAutosizeTextarea
        data-lifecycle-contract={
          objectLifecycleContractSlots.EditableObjectBody
        }
        aria-label={t("lifecycle.url.notes")}
        placeholder={t("lifecycle.url.notes")}
        value={entity.body}
        onCommit={(body) => update({ body })}
        className={bodyFieldClass}
      />
    </ObjectEditorShell>
  );
}

function TagObjectEditor({
  entity,
  header,
  matching,
  update,
}: ObjectEditorProps & {
  entity: Extract<WorkspaceEntity, { kind: "tag" }>;
  matching: WorkspaceEntity[];
}) {
  const t = useTranslations("workspace");
  return (
    <ObjectEditorShell className="pb-8" dataSlot="tag-object-editor">
      {header}
      <EntityTitleField title={entity.title} update={update} />
      <h2 className="mt-5 text-sm font-medium">{t("lifecycle.tag.matches")}</h2>
      {matching.length ? (
        <ul className="mt-2 space-y-1 text-sm">
          {matching.map((item) => (
            <li key={item.id} className="rounded-lg bg-muted px-3 py-2">
              {item.title || t("lifecycle.untitled")}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          {t("lifecycle.tag.empty")}
        </p>
      )}
    </ObjectEditorShell>
  );
}

function QueryObjectEditor({
  entity,
  entities,
  header,
  update,
}: ObjectEditorProps & { entity: QueryEntity; entities: WorkspaceEntity[] }) {
  const t = useTranslations("workspace");
  const { objectTypes } = useWorkspace();
  const [description, setDescription] = React.useState(entity.description);
  const deferredEntity = React.useDeferredValue(entity);
  const deferredEntities = React.useDeferredValue(entities);
  const results = React.useMemo(
    () => selectQueryResults(deferredEntities, deferredEntity),
    [deferredEntities, deferredEntity],
  );

  function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = applyQueryDescription(entity, description);
    update({
      description: next.description,
      filters: next.filters,
      title: next.title,
    });
  }

  return (
    <ObjectEditorShell className="pb-8" dataSlot="query-object-editor">
      {header}
      <EntityTitleField title={entity.title} update={update} />
      <form onSubmit={generate} className="mt-2 flex gap-2">
        <Input
          data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t("lifecycle.query.placeholder")}
          aria-label={t("lifecycle.query.description")}
        />
        <Button type="submit">{t("lifecycle.query.generate")}</Button>
      </form>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <select
          data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
          aria-label={t("lifecycle.query.objectType")}
          value={entity.filters.objectTypeId ?? ""}
          onChange={(event) =>
            update({
              filters: {
                ...entity.filters,
                objectTypeId: event.target.value || undefined,
              },
            })
          }
          className="h-9 rounded-lg border bg-background px-2 text-sm"
        >
          <option value="">{t("lifecycle.query.allTypes")}</option>
          {objectTypes.map((objectType) => (
            <option key={objectType.id} value={objectType.id}>
              {objectType.label}
            </option>
          ))}
        </select>
        <select
          data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
          aria-label={t("lifecycle.query.created")}
          value={entity.filters.created ?? ""}
          onChange={(event) =>
            update({
              filters: {
                ...entity.filters,
                created: event.target.value || undefined,
              },
            })
          }
          className="h-9 rounded-lg border bg-background px-2 text-sm"
        >
          <option value="">{t("lifecycle.query.anyDate")}</option>
          <option value="today">{t("lifecycle.query.today")}</option>
        </select>
        <BufferedInput
          data-lifecycle-contract={objectLifecycleContractSlots.ObjectField}
          aria-label={t("fields.tags")}
          placeholder={t("fields.tags")}
          value={entity.filters.tags}
          format={(tags) => tags.join(", ")}
          parse={(draft) =>
            draft
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          }
          onCommit={(tags) =>
            update({
              filters: {
                ...entity.filters,
                tags,
              },
            })
          }
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        {t("lifecycle.query.resultCount", { count: results.length })}
      </p>
      <ul className="mt-2 space-y-1 text-sm">
        {results.map((item) => (
          <li key={item.id} className="rounded-lg bg-muted px-3 py-2">
            {item.title || t("lifecycle.untitled")}
          </li>
        ))}
      </ul>
    </ObjectEditorShell>
  );
}

function FileObjectEditor({
  entity,
  header,
  update,
}: ObjectEditorProps & { entity: FileEntity }) {
  const t = useTranslations("workspace");
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
    <ObjectEditorShell className="pb-8" dataSlot="file-object-editor">
      {header}
      <EntityTitleField title={entity.title} update={update} />
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
      <Input
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
    </ObjectEditorShell>
  );
}

function chooseNode(
  condition: boolean,
  whenTrue: React.ReactNode,
  whenFalse: React.ReactNode,
) {
  return condition ? whenTrue : whenFalse;
}

function optionalNode(condition: boolean, node: React.ReactNode) {
  return condition ? node : null;
}

function both(left: boolean, right: boolean) {
  return left && right;
}

function getImportAccept(objectTypeId: AppSidebarObjectType["id"]) {
  if (objectTypeId === "image") return "image/*";
  if (objectTypeId === "audio") return "audio/*";
  if (objectTypeId === "pdf") return "application/pdf,.pdf";
  return undefined;
}

type OverviewSection =
  | "recent"
  | "collections"
  | "queries"
  | "noCollection"
  | "untagged"
  | "noBacklinks";

type OptionalOverviewSection = Exclude<
  OverviewSection,
  "collections" | "queries"
>;

type ObjectTypeView = "overview" | "all" | OptionalOverviewSection;
type ObjectTypeNamedItemTab =
  | {
      kind: "collection";
      objectTypeId: string;
      collectionId: string;
    }
  | { kind: "query"; objectTypeId: string; index: number };

function objectTypeNamedItemTabId(item: ObjectTypeNamedItemTab) {
  return item.kind === "collection"
    ? `object-type-item:collection:${item.collectionId}`
    : `object-type-item:query:${item.objectTypeId}:${item.index}`;
}

function parseObjectTypeNamedItemTabId(
  id: string,
): ObjectTypeNamedItemTab | null {
  const collectionMatch = /^object-type-item:collection:(.+)$/.exec(id);
  if (collectionMatch) {
    const parts = collectionMatch[1].split(":");
    return parts.length >= 3
      ? {
          kind: "collection",
          collectionId: collectionMatch[1],
          objectTypeId: parts[1],
        }
      : null;
  }
  const queryMatch = /^object-type-item:query:([^:]+):(\d+)$/.exec(id);
  return queryMatch
    ? {
        kind: "query",
        objectTypeId: queryMatch[1],
        index: Number(queryMatch[2]),
      }
    : null;
}

function ObjectTypeWorkspace({
  objectType,
  presetId,
}: {
  objectType: AppSidebarObjectType;
  presetId?: string;
}) {
  const t = useTranslations("workspace");
  const Icon = objectType.icon;
  const {
    createWorkspaceEntity,
    createWorkspaceEntityFromPreset,
    createdEntities,
    importWorkspaceFiles,
    objectTypeCollections: collectionsByType,
    objectTypeQueries: queriesByType,
    pinnedEntities,
    selectEntity,
    setActiveAction,
    setActiveEntityId,
    setMainTabs,
    setMainValue,
    setPinnedEntities,
    setObjectTypeCollections: setCollectionsByType,
    setObjectTypeQueries: setQueriesByType,
    showMessage,
  } = useWorkspace();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [view, setView] = React.useState<ObjectTypeView>("overview");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [toolbarCollapsed, setToolbarCollapsed] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);
  const [sortMode, setSortMode] = React.useState<"recent" | "title">("recent");
  const [layout, setLayout] = React.useState<"list" | "grid">("list");
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [filterMode, setFilterMode] = React.useState<"all" | "untitled">("all");
  const [visibleSections, setVisibleSections] = React.useState({
    recent: true,
    collections: true,
    queries: true,
    noCollection: false,
    untagged: false,
    noBacklinks: false,
  });
  const [collapsedSections, setCollapsedSections] = React.useState({
    recent: false,
    collections: false,
    queries: false,
    noCollection: false,
    untagged: false,
    noBacklinks: false,
  });
  const [editingItem, setEditingItem] = React.useState<{
    kind: "collection" | "query";
    id: string;
  } | null>(null);
  const collections = selectWorkspaceCollectionRecordsForStructure(
    collectionsByType,
    objectType.id,
  );
  const queries = queriesByType[objectType.id] ?? [];
  React.useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);
  React.useEffect(() => {
    if (!filterOpen && !sortOpen) return;
    function closeTransientRows(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setFilterOpen(false);
      setSortOpen(false);
    }
    window.addEventListener("keydown", closeTransientRows);
    return () => window.removeEventListener("keydown", closeTransientRows);
  }, [filterOpen, sortOpen]);
  const deferredSearchQuery = React.useDeferredValue(searchQuery);
  const recentEntities = React.useMemo(
    () =>
      createdEntities.filter((entity) => entity.objectTypeId === objectType.id),
    [createdEntities, objectType.id],
  );
  const visibleEntities = React.useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLocaleLowerCase();
    const searched = normalizedQuery
      ? recentEntities.filter((entity) =>
          entity.title.toLocaleLowerCase().includes(normalizedQuery),
        )
      : recentEntities;
    const filtered =
      filterMode === "untitled"
        ? searched.filter((entity) => !entity.title.trim())
        : searched;
    return sortMode === "title"
      ? [...filtered].sort((left, right) =>
          left.title.localeCompare(right.title),
        )
      : [...filtered].sort((left, right) =>
          right.createdAt.localeCompare(left.createdAt),
        );
  }, [deferredSearchQuery, filterMode, recentEntities, sortMode]);

  function openEntity(entityId: string) {
    selectEntity(entityId);
  }

  function createObject() {
    if (presetId) {
      createWorkspaceEntityFromPreset(presetId);
      return;
    }
    createWorkspaceEntity(objectType.id, objectType.label);
  }

  function openNamedItem(item: ObjectTypeNamedItemTab, label: string) {
    const tabId = objectTypeNamedItemTabId(item);
    const Icon =
      item.kind === "collection" ? ObjectCollectionIcon : ObjectQueryIcon;
    const tab: AppHeaderTab = {
      id: tabId,
      label,
      icon: Icon,
      iconClassName: objectIconToneBadgeClass.gray,
      draggable: true,
    };
    setMainTabs((current) =>
      current.some((currentTab) => currentTab.id === tabId)
        ? current.map((currentTab) =>
            currentTab.id === tabId ? { ...currentTab, ...tab } : currentTab,
          )
        : [...current, tab],
    );
    setMainValue(tabId);
    setActiveEntityId(tabId);
    setActiveAction(undefined);
  }

  function addCollection() {
    const nextCollection = t("objectTypeOverview.untitled");
    const collectionId = createCollectionId(
      objectType.id,
      nextCollection,
      new Set(Object.keys(collectionsByType)),
    );
    setCollectionsByType((current) => ({
      ...current,
      [collectionId]: {
        id: collectionId,
        name: nextCollection,
        structureId: objectType.id,
      },
    }));
    setEditingItem(null);
    openNamedItem(
      { kind: "collection", collectionId, objectTypeId: objectType.id },
      nextCollection,
    );
    showMessage(t("objectTypeOverview.collectionCreated"));
  }

  function addQuery() {
    const nextQuery = t("objectTypeOverview.untitled");
    const nextIndex = queries.length;
    setQueriesByType((current) => ({
      ...current,
      [objectType.id]: [...(current[objectType.id] ?? []), nextQuery],
    }));
    setEditingItem(null);
    openNamedItem(
      { kind: "query", index: nextIndex, objectTypeId: objectType.id },
      nextQuery,
    );
    showMessage(t("objectTypeOverview.queryCreated"));
  }

  function exportObjects() {
    const payload = JSON.stringify(visibleEntities, null, 2);
    const url = URL.createObjectURL(
      new Blob([payload], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${objectType.id}-objects.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    showMessage(t("objectTypeOverview.exportComplete"));
  }

  function createFromTemplate() {
    createObject();
    showMessage(t("objectTypeOverview.templateCreated"));
  }

  function togglePin() {
    const isPinned = pinnedEntities.some((item) => item.id === objectType.id);
    setPinnedEntities((current) =>
      isPinned
        ? current.filter((item) => item.id !== objectType.id)
        : [...current, objectType],
    );
    showMessage(
      t(
        `objectTypeOverview.${isPinned ? "unpinnedFromSidebar" : "pinnedToSidebar"}`,
      ),
    );
  }

  function openGlobalNewPalette() {
    window.setTimeout(
      () => window.dispatchEvent(new CustomEvent("workspace:open-new-palette")),
      0,
    );
  }

  function openOverviewSettings() {
    setView("overview");
    setToolbarCollapsed(false);
    setSearchOpen(false);
    setFilterOpen(false);
    setSortOpen(false);
    setSettingsOpen(true);
  }

  function renameNamedItem(
    kind: "collection" | "query",
    id: string,
    value: string,
  ) {
    if (kind === "collection") {
      const collection = collectionsByType[id];
      const nextName = value.trim();
      if (!collection || !nextName) return;
      setCollectionsByType((current) => ({
        ...current,
        [collection.id]: { ...collection, name: nextName },
      }));
      return;
    }
    const index = Number(id);
    setQueriesByType((current) => ({
      ...current,
      [objectType.id]: (current[objectType.id] ?? []).map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  }

  async function importFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    if (files.length > 0) {
      await importWorkspaceFiles(objectType.id, files);
    }
    input.value = "";
  }

  const importAccept = getImportAccept(objectType.id);
  const optionalViews: Array<{
    id: OptionalOverviewSection;
    label: string;
    icon: "recent" | "no-collection" | "untagged" | "no-backlinks";
  }> = [
    {
      id: "recent",
      label: t("objectTypeOverview.recentlyOpened"),
      icon: "recent",
    },
    {
      id: "noCollection",
      label: t("objectTypeOverview.noCollection"),
      icon: "no-collection",
    },
    {
      id: "untagged",
      label: t("objectTypeOverview.untagged"),
      icon: "untagged",
    },
    {
      id: "noBacklinks",
      label: t("objectTypeOverview.noBacklinks"),
      icon: "no-backlinks",
    },
  ];

  function changeOverviewSection(
    section: OptionalOverviewSection,
    checked: boolean,
  ) {
    setVisibleSections((current) => ({ ...current, [section]: checked }));
    if (!checked) {
      if (section === "recent") setView("all");
      else if (view === section) setView("overview");
      setSettingsOpen(false);
    }
  }

  return (
    <div
      data-slot="object-type-workspace"
      data-object-type={objectType.id}
      className="relative flex h-full min-h-0 flex-col text-[#282522]"
    >
      <input
        id={`object-type-import-${objectType.id}`}
        ref={fileInputRef}
        type="file"
        multiple
        accept={importAccept}
        aria-label={t("actions.importFiles")}
        className="sr-only"
        onChange={importFiles}
      />
      <div className="@container flex flex-wrap items-center justify-between px-3 pt-4">
        <div className="flex min-w-0 items-center gap-[13px] @max-[450px]:basis-full">
          <ObjectIconBadge
            icon={Icon}
            tone={objectType.tone}
            className="ml-[3px] size-[26px] rounded-lg"
            iconClassName="size-[15px]"
          />
          <h1 className="truncate text-[20px] font-bold leading-5 tracking-[-0.02em]">
            {objectType.label}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 @max-[450px]:mt-2 @max-[450px]:w-full @max-[450px]:justify-between">
          <div className="flex h-8 items-center rounded-lg border border-transparent bg-card text-sidebar-foreground shadow-[0_2px_8px_rgb(0_0_0/0.04)]">
            {chooseNode(
              searchOpen,
              <Input
                ref={searchInputRef}
                value={searchQuery}
                placeholder={t("objectTypeOverview.searchPlaceholder")}
                aria-label={t("objectTypeOverview.searchPlaceholder")}
                className="h-7 w-44 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
              />,
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t("actions.search")}
                className="size-8"
                onClick={() => setSearchOpen(true)}
              >
                <AppSidebarSearchIcon className="size-4" />
              </Button>,
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("actions.collapse")}
              aria-expanded={!toolbarCollapsed}
              className="size-8"
              onClick={() => setToolbarCollapsed((current) => !current)}
            >
              <AppHeaderCaretDownIcon
                className={cn("size-4", !toolbarCollapsed && "rotate-180")}
              />
            </Button>
            <ObjectTypeOptionsMenu
              onAddCollection={addCollection}
              onAddQuery={addQuery}
              isPinned={pinnedEntities.some(
                (item) => item.id === objectType.id,
              )}
              onExport={exportObjects}
              onImport={() => fileInputRef.current?.click()}
              onOpenSettings={openOverviewSettings}
              onCreateFromTemplate={createFromTemplate}
              onTogglePin={togglePin}
            />
          </div>
          <div className="flex h-8 overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Button
              className="h-8 w-[73px] rounded-none border-r border-white/15 bg-transparent px-2 text-sm font-normal hover:bg-white/10"
              onClick={createObject}
            >
              <AppSidebarPlusIcon className="size-4" />
              {t("actions.new")}
            </Button>
            <ObjectTypeNewMenu
              objectTypeLabel={objectType.label}
              onCreate={createObject}
              onImport={() => fileInputRef.current?.click()}
              onOpenPalette={openGlobalNewPalette}
            />
          </div>
        </div>
      </div>

      {optionalNode(
        !toolbarCollapsed,
        <div className="mt-4 flex items-center justify-between px-3 text-[13px] text-[#77716b]">
          <div
            role="tablist"
            aria-label={t("objectTypeOverview.viewLabel")}
            className="group/object-type-views flex items-center"
          >
            <button
              type="button"
              id={`object-type-${objectType.id}-overview-tab`}
              role="tab"
              aria-selected={view === "overview"}
              aria-controls={`object-type-${objectType.id}-overview-panel`}
              className={cn(
                "flex h-8 items-center gap-2 rounded-lg px-3.5 text-[#77716b] hover:bg-[#f5f3f1]",
                view === "overview" && "bg-[#f5f3f1] text-[#3b3835]",
              )}
              onClick={() => setView("overview")}
            >
              <ObjectTypeToolbarIcon
                name="overview"
                className="size-3.5 text-[oklch(0.5725_0.0051_33.89)]"
              />
              {t("views.overview")}
            </button>
            <button
              type="button"
              id={`object-type-${objectType.id}-all-tab`}
              role="tab"
              aria-selected={view === "all"}
              aria-controls={`object-type-${objectType.id}-all-panel`}
              className={cn(
                "flex h-8 items-center gap-2 rounded-lg px-3.5 text-[#77716b] hover:bg-[#f5f3f1]",
                view === "all" && "bg-[#f5f3f1] text-[#3b3835]",
              )}
              onClick={() => setView("all")}
            >
              <ObjectTypeToolbarIcon
                name="all"
                className="size-3.5 text-[oklch(0.5725_0.0051_33.89)]"
              />
              {t("views.all")}
            </button>
            {optionalViews
              .filter(({ id }) => id !== "recent" && visibleSections[id])
              .map(({ id, icon, label }) => (
                <button
                  key={id}
                  type="button"
                  id={`object-type-${objectType.id}-${id}-tab`}
                  role="tab"
                  aria-selected={view === id}
                  aria-controls={`object-type-${objectType.id}-${id}-panel`}
                  className={cn(
                    "flex h-8 items-center gap-2 rounded-lg px-3.5 text-[#77716b] hover:bg-[#f5f3f1]",
                    view === id && "bg-[#f5f3f1] text-[#3b3835]",
                  )}
                  onClick={() => setView(id)}
                >
                  <ObjectTypeToolbarIcon
                    name={icon}
                    className="size-3.5 text-[oklch(0.5725_0.0051_33.89)]"
                  />
                  {label}
                </button>
              ))}
            <ObjectTypeAddViewMenu
              onAddCollection={addCollection}
              onAddQuery={addQuery}
              onShowUntitled={() => {
                setFilterMode("untitled");
                setView("all");
              }}
            />
          </div>
          {chooseNode(
            view === "overview",
            <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("objectTypeOverview.viewSettings")}
                    aria-pressed={settingsOpen}
                  >
                    <span className="inline-flex size-3 [&>svg]:size-3">
                      <AppSidebarSourceIcon
                        name="settings"
                        className="text-[oklch(0.3887_0.0052_301.05)]"
                      />
                    </span>
                  </Button>
                }
              />
              <PopoverContent
                side="bottom"
                align="start"
                alignOffset={-2}
                sideOffset={5}
                aria-label={t("objectTypeOverview.viewSettings")}
                className="w-[290px] gap-0 rounded-[12px] border-[oklch(0.9163_0.0017_67.07)] bg-[oklch(1_0.0001_263.28)] p-[6px] text-[14px] leading-5 text-[oklch(0.3887_0.0052_301.05)] shadow-[0_3px_5px_rgb(0_0_0/0.01),0_5px_10px_rgb(0_0_0/0.02),0_10px_14px_rgb(0_0_0/0.01)] ring-0"
              >
                <ObjectTypeOverviewSettings
                  sections={visibleSections}
                  onChange={changeOverviewSection}
                />
              </PopoverContent>
            </Popover>,
            <ObjectTypeAllActions
              count={visibleEntities.length}
              filterOpen={filterOpen}
              layout={layout}
              sortOpen={sortOpen}
              onFilter={() => {
                setSortOpen(false);
                setFilterOpen((current) => !current);
              }}
              onLayout={setLayout}
              onSort={() => {
                setFilterOpen(false);
                setSortOpen((current) => !current);
              }}
            />,
          )}
        </div>,
      )}

      {optionalNode(
        both(view === "all", filterOpen),
        <div
          data-slot="object-type-filter-row"
          className="mx-5 mt-2 flex h-9 items-center gap-2 rounded-lg border bg-card px-3 text-xs"
        >
          <span>{t("objectTypeOverview.where")}</span>
          <button
            type="button"
            className="rounded-md bg-muted px-2 py-1"
            onClick={() =>
              setFilterMode((current) =>
                current === "all" ? "untitled" : "all",
              )
            }
          >
            {t(
              `objectTypeOverview.${filterMode === "all" ? "allObjects" : "untitledOnly"}`,
            )}
          </button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-7"
            onClick={() => setFilterOpen(false)}
          >
            {t("objectTypeOverview.remove")}
          </Button>
        </div>,
      )}
      {optionalNode(
        both(view === "all", sortOpen),
        <div
          data-slot="object-type-sort-row"
          className="mx-5 mt-2 flex h-9 items-center gap-2 rounded-lg border bg-card px-3 text-xs"
        >
          <span>{t("objectTypeOverview.sortBy")}</span>
          <button
            type="button"
            className="rounded-md bg-muted px-2 py-1"
            onClick={() =>
              setSortMode((current) =>
                current === "recent" ? "title" : "recent",
              )
            }
          >
            {t(
              `objectTypeOverview.${sortMode === "recent" ? "recentSort" : "titleSort"}`,
            )}
          </button>
        </div>,
      )}

      {chooseNode(
        view === "overview",
        <ObjectTypeOverview
          objectType={objectType}
          entities={visibleEntities}
          onOpenEntity={openEntity}
          collections={collections}
          queries={queries}
          visibleSections={visibleSections}
          collapsedSections={collapsedSections}
          editingItem={editingItem}
          onAddCollection={addCollection}
          onAddQuery={addQuery}
          onRenameItem={renameNamedItem}
          onToggleSection={(section) =>
            setCollapsedSections((current) => ({
              ...current,
              [section]: !current[section],
            }))
          }
          onToggleRecent={() => {
            setView("all");
          }}
        />,
        chooseNode(
          view === "all",
          <ObjectTypeAllView
            objectType={objectType}
            entities={visibleEntities}
            layout={layout}
            onOpenEntity={openEntity}
            onCreate={createObject}
            onImport={() => fileInputRef.current?.click()}
          />,
          <ObjectTypeSpecialView
            view={view as OptionalOverviewSection}
            objectType={objectType}
            entities={visibleEntities}
            onOpenEntity={openEntity}
          />,
        ),
      )}
    </div>
  );
}

function ObjectTypeOptionsMenu({
  onAddCollection,
  onAddQuery,
  isPinned,
  onCreateFromTemplate,
  onExport,
  onImport,
  onOpenSettings,
  onTogglePin,
}: {
  onAddCollection: () => void;
  onAddQuery: () => void;
  isPinned: boolean;
  onCreateFromTemplate: () => void;
  onExport: () => void;
  onImport: () => void;
  onOpenSettings: () => void;
  onTogglePin: () => void;
}) {
  const t = useTranslations("workspace.objectTypeOverview");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("moreOptions")}
            className="size-8"
          >
            <AppSidebarDotsIcon className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={onCreateFromTemplate}>
          {t("newFromTemplate")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddQuery}>
          {t("newQuery")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddCollection}>
          {t("newCollection")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onTogglePin}>
          {t(isPinned ? "unpinFromSidebar" : "pinToSidebar")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenSettings}>
          {t("typeSettings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onExport}>{t("export")}</DropdownMenuItem>
        <DropdownMenuItem onClick={onImport}>{t("import")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ObjectTypeAddViewMenu({
  onAddCollection,
  onAddQuery,
  onShowUntitled,
}: {
  onAddCollection: () => void;
  onAddQuery: () => void;
  onShowUntitled: () => void;
}) {
  const t = useTranslations("workspace.objectTypeOverview");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("addView")}
            className="h-8 w-8 text-[#77716b] transition-opacity duration-300 [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:opacity-0 group-hover/object-type-views:pointer-events-auto group-hover/object-type-views:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 data-popup-open:pointer-events-auto data-popup-open:opacity-100"
          >
            <ObjectTypeToolbarIcon
              name="add"
              className="size-3.5 text-[oklch(0.5725_0.0051_33.89)]"
            />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuItem onClick={onAddQuery}>
          {t("newQuery")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddCollection}>
          {t("newCollection")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onShowUntitled}>
          {t("untitledOnly")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ObjectTypeOverviewSettings({
  sections,
  onChange,
}: {
  sections: Record<OverviewSection, boolean>;
  onChange: (section: OptionalOverviewSection, checked: boolean) => void;
}) {
  const t = useTranslations("workspace.objectTypeOverview");
  const viewT = useTranslations("workspace.views");
  const optionalEntries: Array<{
    id: OptionalOverviewSection;
    label: string;
    icon: "recent" | "no-collection" | "untagged" | "no-backlinks";
  }> = [
    { id: "recent", label: t("recentlyOpened"), icon: "recent" },
    {
      id: "noCollection",
      label: t("noCollection"),
      icon: "no-collection",
    },
    { id: "untagged", label: t("untagged"), icon: "untagged" },
    {
      id: "noBacklinks",
      label: t("noBacklinks"),
      icon: "no-backlinks",
    },
  ];
  const visibleOptional = optionalEntries.filter(({ id }) => sections[id]);
  const hidden = optionalEntries.filter(({ id }) => !sections[id]);

  return (
    <div role="menu" aria-label={t("viewSettings")}>
      <div className="mb-1.5 mt-1 px-1 text-xs leading-4 text-[oklch(0.5725_0.0051_33.89)]">
        {t("visibleSections")}
      </div>
      <ObjectTypeOverviewSettingsRow label={viewT("all")} icon="all" active />
      {visibleOptional
        .filter(({ id }) => id === "recent")
        .map(({ id, icon, label }) => (
          <ObjectTypeOverviewSettingsRow
            key={id}
            label={label}
            suffix={t("overviewOnly")}
            icon={icon}
            draggable
            checked
            onClick={() => onChange(id, false)}
          />
        ))}
      <ObjectTypeOverviewSettingsRow
        label={t("collections")}
        suffix={t("overviewOnly")}
        icon="collection"
        draggable
      />
      <ObjectTypeOverviewSettingsRow
        label={t("queries")}
        suffix={t("overviewOnly")}
        icon="query"
        draggable
      />
      {visibleOptional
        .filter(({ id }) => id !== "recent")
        .map(({ id, icon, label }) => (
          <ObjectTypeOverviewSettingsRow
            key={id}
            label={label}
            icon={icon}
            draggable
            checked
            onClick={() => onChange(id, false)}
          />
        ))}
      <div className="mb-1.5 mt-2 px-1 text-xs leading-4 text-[oklch(0.5725_0.0051_33.89)]">
        {t("hiddenSections")}
      </div>
      {hidden.map(({ id, icon, label }) => (
        <ObjectTypeOverviewSettingsRow
          key={id}
          label={label}
          icon={icon}
          onClick={() => onChange(id, true)}
        />
      ))}
    </div>
  );
}

function ObjectTypeOverviewSettingsRow({
  active = false,
  checked = false,
  draggable = false,
  icon,
  label,
  suffix,
  onClick,
}: {
  active?: boolean;
  checked?: boolean;
  draggable?: boolean;
  icon:
    | "all"
    | "recent"
    | "collection"
    | "query"
    | "no-collection"
    | "untagged"
    | "no-backlinks";
  label: string;
  suffix?: string;
  onClick?: () => void;
}) {
  const className = cn(
    "group/overview-settings-row flex h-8 w-full items-center gap-1 rounded-lg px-1 text-sm leading-5 outline-none transition-colors duration-100",
    active && "bg-[oklch(0.9676_0.0016_67.02)]",
    onClick &&
      "cursor-pointer hover:bg-[oklch(0.9676_0.0016_67.02)] focus-visible:bg-[oklch(0.9676_0.0016_67.02)]",
  );
  const content = (
    <>
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <ObjectTypeToolbarIcon
          name={icon}
          className={cn(
            "size-3.5 text-[oklch(0.5725_0.0051_33.89)] transition-opacity duration-100",
            draggable &&
              "group-hover/overview-settings-row:opacity-0 group-focus-visible/overview-settings-row:opacity-0",
          )}
        />
        {draggable && (
          <ObjectTypeToolbarIcon
            name="drag"
            className="absolute size-3.5 text-[oklch(0.5725_0.0051_33.89)] opacity-0 transition-opacity duration-100 group-hover/overview-settings-row:opacity-100 group-focus-visible/overview-settings-row:opacity-100"
          />
        )}
      </span>
      <span className="min-w-0 flex-1 truncate text-left">
        {label}
        {suffix && (
          <span className="ml-1 text-xs text-[oklch(0.5725_0.0051_33.89)]">
            ({suffix})
          </span>
        )}
      </span>
      {checked && (
        <ObjectTypeToolbarIcon
          name="check"
          className="size-3.5 shrink-0 text-[oklch(0.3887_0.0052_301.05)]"
        />
      )}
    </>
  );

  return onClick ? (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      className={className}
      onClick={onClick}
    >
      {content}
    </button>
  ) : (
    <div
      role="menuitem"
      aria-disabled="true"
      tabIndex={-1}
      className={className}
    >
      {content}
    </div>
  );
}

function ObjectTypeNewMenu({
  objectTypeLabel,
  onCreate,
  onImport,
  onOpenPalette,
}: {
  objectTypeLabel: string;
  onCreate: () => void;
  onImport: () => void;
  onOpenPalette: () => void;
}) {
  const t = useTranslations("workspace.objectTypeOverview");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="h-8 w-[30px] rounded-none bg-transparent px-0 hover:bg-white/10"
            aria-label={t("newObjectOptions")}
          >
            <AppHeaderCaretDownIcon className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onCreate}>
          {t("newCurrentType", { type: objectTypeLabel })}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onImport}>
          {t("importFiles")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenPalette}>
          {t("newObject")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ObjectTypeAllActions({
  count,
  filterOpen,
  layout,
  sortOpen,
  onFilter,
  onLayout,
  onSort,
}: {
  count: number;
  filterOpen: boolean;
  layout: "list" | "grid";
  sortOpen: boolean;
  onFilter: () => void;
  onLayout: (layout: "list" | "grid") => void;
  onSort: () => void;
}) {
  const t = useTranslations("workspace");

  return (
    <div className="flex items-center gap-1 text-[oklch(0.3887_0.0052_301.05)]">
      <span className="flex h-8 items-center gap-1 rounded-lg px-2">
        <ObjectTypeToolbarIcon name="count" className="size-3.5" />
        {count}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.filter")}
        aria-pressed={filterOpen}
        onClick={onFilter}
      >
        <ObjectTypeToolbarIcon name="filter" className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.sort")}
        aria-pressed={sortOpen}
        onClick={onSort}
      >
        <ObjectTypeToolbarIcon name="sort" className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.list")}
        aria-pressed={layout === "list"}
        onClick={() => onLayout("list")}
      >
        <ObjectTypeToolbarIcon name="list" className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.grid")}
        aria-pressed={layout === "grid"}
        onClick={() => onLayout("grid")}
      >
        <ObjectTypeToolbarIcon name="grid" className="size-3.5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("actions.moreViews")}
            >
              <ObjectTypeToolbarIcon name="caret" className="size-3" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => onLayout("list")}>
            {layout === "list" && <CheckIcon className="size-4" />}
            {t("actions.list")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onLayout("grid")}>
            {layout === "grid" && <CheckIcon className="size-4" />}
            {t("actions.grid")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ObjectTypeOverview({
  collections,
  objectType,
  entities,
  queries,
  visibleSections,
  collapsedSections,
  editingItem,
  onAddCollection,
  onAddQuery,
  onOpenEntity,
  onRenameItem,
  onToggleSection,
  onToggleRecent,
}: {
  collections: readonly WorkspaceCollectionRecord[];
  objectType: AppSidebarObjectType;
  entities: WorkspaceEntity[];
  queries: string[];
  visibleSections: Record<OverviewSection, boolean>;
  collapsedSections: Record<OverviewSection, boolean>;
  editingItem: { kind: "collection" | "query"; id: string } | null;
  onAddCollection: () => void;
  onAddQuery: () => void;
  onOpenEntity: (entityId: string) => void;
  onRenameItem: (
    kind: "collection" | "query",
    id: string,
    value: string,
  ) => void;
  onToggleSection: (section: OverviewSection) => void;
  onToggleRecent: () => void;
}) {
  const t = useTranslations("workspace.objectTypeOverview");

  return (
    <div
      id={`object-type-${objectType.id}-overview-panel`}
      role="tabpanel"
      aria-labelledby={`object-type-${objectType.id}-overview-tab`}
      data-slot="object-type-overview"
      className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-4"
    >
      {visibleSections.recent && (
        <section
          aria-labelledby={`object-type-${objectType.id}-recent-heading`}
        >
          <ObjectTypeSectionHeader
            id={`object-type-${objectType.id}-recent-heading`}
            title={t("recentlyOpened")}
            actionLabel={t("expandSection")}
            actionIcon={Maximize2Icon}
            collapsed={collapsedSections.recent}
            onToggle={() => onToggleSection("recent")}
            onAction={onToggleRecent}
          />
          {!collapsedSections.recent && (
            <div className="flex min-h-[134px] items-center justify-center py-4">
              {entities.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-1 sm:grid-cols-2">
                  {entities.map((entity) => (
                    <ObjectProjectionRow
                      key={entity.id}
                      entity={entity}
                      objectType={objectType}
                      onClick={() => onOpenEntity(entity.id)}
                    />
                  ))}
                </div>
              ) : (
                <ObjectTypeSectionEmpty
                  title={t("noRecentTitle")}
                  description={t("noRecentDescription")}
                />
              )}
            </div>
          )}
        </section>
      )}

      {visibleSections.collections && (
        <section
          aria-labelledby={`object-type-${objectType.id}-collections-heading`}
        >
          <ObjectTypeSectionHeader
            id={`object-type-${objectType.id}-collections-heading`}
            title={t("collections")}
            actionLabel={t("addCollection")}
            actionIcon={ObjectCollectionIcon}
            showPlus
            collapsed={collapsedSections.collections}
            onToggle={() => onToggleSection("collections")}
            onAction={onAddCollection}
          />
          {!collapsedSections.collections && (
            <div className="flex min-h-[134px] items-center justify-center py-4">
              {collections.length > 0 ? (
                <ObjectTypeNamedItems
                  items={collections.map((collection) => ({
                    count: entities.filter(
                      (entity) =>
                        "collections" in entity &&
                        entity.collections.includes(collection.id),
                    ).length,
                    id: collection.id,
                    label: collection.name,
                  }))}
                  kind="collection"
                  editingIndex={
                    editingItem?.kind === "collection" ? editingItem.id : null
                  }
                  onRename={(id, value) =>
                    onRenameItem("collection", id, value)
                  }
                />
              ) : (
                <ObjectTypeSectionEmpty
                  title={t("noCollections")}
                  description={t("noCollectionsDescription")}
                />
              )}
            </div>
          )}
        </section>
      )}

      {visibleSections.queries && (
        <section
          aria-labelledby={`object-type-${objectType.id}-queries-heading`}
        >
          <ObjectTypeSectionHeader
            id={`object-type-${objectType.id}-queries-heading`}
            title={t("queries")}
            actionLabel={t("addQuery")}
            actionIcon={ObjectQueryIcon}
            showPlus
            collapsed={collapsedSections.queries}
            onToggle={() => onToggleSection("queries")}
            onAction={onAddQuery}
          />
          {!collapsedSections.queries && (
            <div className="flex min-h-[134px] items-center justify-center py-4">
              {queries.length > 0 ? (
                <ObjectTypeNamedItems
                  items={queries.map((query, index) => ({
                    count: 0,
                    id: String(index),
                    label: query,
                  }))}
                  kind="query"
                  editingIndex={
                    editingItem?.kind === "query" ? editingItem.id : null
                  }
                  onRename={(id, value) => onRenameItem("query", id, value)}
                />
              ) : (
                <ObjectTypeSectionEmpty
                  title={t("noQueries")}
                  description={t("noQueriesDescription")}
                />
              )}
            </div>
          )}
        </section>
      )}

      {(["noCollection", "untagged", "noBacklinks"] as const).map(
        (section) =>
          visibleSections[section] && (
            <ObjectTypeSpecialSection
              key={section}
              section={section}
              objectType={objectType}
              entities={entities}
              collapsed={collapsedSections[section]}
              onToggle={() => onToggleSection(section)}
              onOpenEntity={onOpenEntity}
            />
          ),
      )}
    </div>
  );
}

function filterOverviewSectionEntities(
  entities: WorkspaceEntity[],
  section: OptionalOverviewSection,
) {
  if (section === "noCollection") {
    return entities.filter(
      (entity) => "collections" in entity && entity.collections.length === 0,
    );
  }
  if (section === "untagged") {
    return entities.filter(
      (entity) => "tags" in entity && entity.tags.length === 0,
    );
  }
  return entities;
}

function ObjectTypeSpecialSection({
  collapsed,
  entities,
  objectType,
  onOpenEntity,
  onToggle,
  section,
}: {
  collapsed: boolean;
  entities: WorkspaceEntity[];
  objectType: AppSidebarObjectType;
  onOpenEntity: (entityId: string) => void;
  onToggle: () => void;
  section: Exclude<OptionalOverviewSection, "recent">;
}) {
  const t = useTranslations("workspace.objectTypeOverview");
  const matches = filterOverviewSectionEntities(entities, section);
  const label =
    section === "noCollection"
      ? t("noCollection")
      : section === "untagged"
        ? t("untagged")
        : t("noBacklinks");

  return (
    <section
      aria-labelledby={`object-type-${objectType.id}-${section}-heading`}
    >
      <ObjectTypeSectionHeader
        id={`object-type-${objectType.id}-${section}-heading`}
        title={label}
        collapsed={collapsed}
        onToggle={onToggle}
      />
      {!collapsed && (
        <div className="flex min-h-[134px] items-center justify-center py-4">
          {matches.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-1 sm:grid-cols-2">
              {matches.map((entity) => (
                <ObjectProjectionRow
                  key={entity.id}
                  entity={entity}
                  objectType={objectType}
                  onClick={() => onOpenEntity(entity.id)}
                />
              ))}
            </div>
          ) : (
            <ObjectTypeSectionEmpty
              title={t("noMatchingObjects")}
              description={t("noMatchingObjectsDescription")}
            />
          )}
        </div>
      )}
    </section>
  );
}

function ObjectTypeSpecialView({
  entities,
  objectType,
  onOpenEntity,
  view,
}: {
  entities: WorkspaceEntity[];
  objectType: AppSidebarObjectType;
  onOpenEntity: (entityId: string) => void;
  view: OptionalOverviewSection;
}) {
  const t = useTranslations("workspace.objectTypeOverview");
  const matches = filterOverviewSectionEntities(entities, view);

  return (
    <div
      id={`object-type-${objectType.id}-${view}-panel`}
      role="tabpanel"
      aria-labelledby={`object-type-${objectType.id}-${view}-tab`}
      className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-4"
    >
      {matches.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-1 sm:grid-cols-2">
          {matches.map((entity) => (
            <ObjectProjectionRow
              key={entity.id}
              entity={entity}
              objectType={objectType}
              onClick={() => onOpenEntity(entity.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[190px] items-center justify-center">
          <ObjectTypeSectionEmpty
            title={t("noMatchingObjects")}
            description={t("noMatchingObjectsDescription")}
          />
        </div>
      )}
    </div>
  );
}

function ObjectTypeSectionHeader({
  id,
  title,
  actionLabel,
  actionIcon: ActionIcon,
  showPlus = false,
  collapsed,
  onToggle,
  onAction,
}: {
  id: string;
  title: string;
  actionLabel?: string;
  actionIcon?: React.ElementType;
  showPlus?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  onAction?: () => void;
}) {
  return (
    <div className="flex h-9 items-center justify-between">
      <button
        type="button"
        className="group/object-type-section -ml-1.5 flex h-8 items-center gap-1 rounded-lg px-1.5 text-sm font-medium text-[#34312f] hover:bg-muted/60"
        aria-expanded={!collapsed}
        onClick={onToggle}
      >
        <h2 id={id} className="flex h-7 items-center">
          {title}
        </h2>
        <AppHeaderCaretDownIcon
          className={cn(
            "size-3.5 opacity-100 transition-[opacity,transform] duration-150 [@media(hover:hover)]:opacity-0 group-hover/object-type-section:opacity-100 group-focus-visible/object-type-section:opacity-100",
            collapsed && "-rotate-90",
          )}
        />
      </button>
      {onAction && actionLabel && ActionIcon && (
        <Button
          variant="ghost"
          size={showPlus ? "sm" : "icon-sm"}
          aria-label={actionLabel}
          aria-expanded={undefined}
          className="h-8 gap-1.5 px-2 font-normal text-[#77716b]"
          onClick={onAction}
        >
          {showPlus && <AppSidebarPlusIcon className="size-3.5" />}
          {!showPlus && <ActionIcon className="size-3.5" />}
          {showPlus && <span>{actionLabel}</span>}
        </Button>
      )}
    </div>
  );
}

function ObjectTypeNamedItems({
  items,
  kind,
  editingIndex,
  onRename,
}: {
  items: readonly { count: number; id: string; label: string }[];
  kind: "collection" | "query";
  editingIndex: string | null;
  onRename: (id: string, value: string) => void;
}) {
  const t = useTranslations("workspace.objectTypeOverview");
  const inputRefs = React.useRef(new Map<string, HTMLInputElement>());
  React.useEffect(() => {
    if (editingIndex === null) return;
    inputRefs.current.get(editingIndex)?.focus();
    inputRefs.current.get(editingIndex)?.select();
  }, [editingIndex]);

  return (
    <div className="grid w-full grid-cols-1 gap-1 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={`${kind}-${item.id}`}
          data-slot="object-type-named-card"
          data-kind={kind}
          data-item-id={item.id}
          className="group/object-type-named-card flex min-h-[68px] cursor-text flex-col justify-center rounded-xl border border-[#e4e0dc] bg-card px-3 py-2 text-left shadow-[0_1px_2px_rgb(0_0_0/0.02)] transition-colors duration-150 hover:bg-[#faf9f8] focus-within:border-[#cfc8c1] focus-within:bg-[#faf9f8] focus-within:ring-2 focus-within:ring-ring/20"
        >
          <span className="flex min-w-0 items-center gap-2">
            {kind === "collection" ? (
              <ObjectCollectionIcon className="size-4 shrink-0 text-[#77716b]" />
            ) : (
              <ObjectQueryIcon className="size-4 shrink-0 text-[#77716b]" />
            )}
            <BufferedTextInput
              inputRef={(node) => {
                if (node) inputRefs.current.set(item.id, node);
                else inputRefs.current.delete(item.id);
              }}
              aria-label={item.label}
              value={item.label}
              onCommit={(value) => onRename(item.id, value)}
              className="min-w-0 flex-1 truncate bg-transparent text-[15px] font-medium leading-5 text-[#34312f] outline-none"
            />
          </span>
          <span className="mt-1 text-xs leading-4 text-[#77716b]">
            {t("entryCount", { count: item.count })}
          </span>
        </div>
      ))}
    </div>
  );
}

function ObjectTypeSectionEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-md text-center">
      <p className="text-sm font-medium text-[#68635e]">{title}</p>
      <p className="mt-1 text-[13px] leading-5 text-[#938d87]">{description}</p>
    </div>
  );
}

function ObjectProjectionRow({
  entity,
  objectType,
  onClick,
}: {
  entity: WorkspaceEntity;
  objectType: AppSidebarObjectType;
  onClick: () => void;
}) {
  const t = useTranslations("workspace.objectTypeOverview");
  const Icon = objectType.icon;

  return (
    <button
      type="button"
      data-lifecycle-contract={objectLifecycleContractSlots.ObjectProjectionRow}
      className="flex min-h-12 items-center gap-2 rounded-lg px-2 text-left hover:bg-[#f5f3f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={onClick}
    >
      <ObjectIconBadge icon={Icon} tone={objectType.tone} />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">
          {entity.title || t("untitled")}
        </span>
        <span className="block truncate text-xs text-[#938d87]">
          {objectType.label}
        </span>
      </span>
    </button>
  );
}

function ObjectTypeAllView({
  objectType,
  entities,
  layout,
  onOpenEntity,
  onCreate,
  onImport,
}: {
  objectType: AppSidebarObjectType;
  entities: WorkspaceEntity[];
  layout: "list" | "grid";
  onOpenEntity: (entityId: string) => void;
  onCreate: () => void;
  onImport: () => void;
}) {
  const t = useTranslations("workspace");
  const Icon = objectType.icon;

  return (
    <div
      id={`object-type-${objectType.id}-all-panel`}
      role="tabpanel"
      aria-labelledby={`object-type-${objectType.id}-all-tab`}
      data-slot="object-type-all"
      className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-4"
    >
      {entities.length > 0 ? (
        <div
          data-layout={layout}
          className={cn(
            "grid grid-cols-1 gap-1",
            layout === "grid" && "sm:grid-cols-2",
          )}
        >
          {entities.map((entity) => (
            <ObjectProjectionRow
              key={entity.id}
              entity={entity}
              objectType={objectType}
              onClick={() => onOpenEntity(entity.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-full items-center justify-center pb-16">
          <div className="flex max-w-sm flex-col items-center text-center">
            <div className="relative mb-3 flex size-40 items-center justify-center text-[#d9d7d4]">
              <Icon className="size-32" />
              <AppSidebarPlusIcon className="absolute left-5 top-10 size-4 text-[#9b9894]" />
              <AppSidebarPlusIcon className="absolute bottom-8 right-5 size-4 rotate-12 text-[#77746f]" />
            </div>
            <h2 className="text-[16px] font-semibold">{t("empty.title")}</h2>
            <p className="mt-1.5 text-sm text-[#918b85]">
              {t("empty.description")}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <Button
                variant="outline"
                className="h-9 rounded-lg border-[#dedbd7] bg-white px-3 font-normal text-[#615c57] shadow-sm"
                onClick={onImport}
              >
                {t("actions.importFiles")}
              </Button>
              <Button
                className="h-9 rounded-lg bg-primary px-3 font-normal text-primary-foreground hover:bg-[oklch(0.4668_0.0039_16.75)]"
                onClick={onCreate}
              >
                <AppSidebarPlusIcon className="size-4" />
                {t("actions.new")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OpenedTabWorkspace({ label }: { label: string }) {
  const t = useTranslations("workspace");

  return (
    <div className="flex h-full min-h-0 flex-col text-[#282522]">
      <div className="flex items-center gap-2.5 px-4 pt-4">
        <ObjectIconBadge
          icon={ObjectPageIcon}
          tone="blue"
          className="size-8 rounded-lg"
          iconClassName="size-[18px]"
        />
        <h1 className="truncate text-[21px] font-semibold tracking-[-0.02em]">
          {label}
        </h1>
      </div>
      <div className="mx-auto flex w-full max-w-[42rem] flex-1 flex-col px-8 pt-16">
        <h2 className="text-[30px] font-semibold tracking-[-0.025em]">
          {label}
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          {t("openedTab.description")}
        </p>
      </div>
    </div>
  );
}

function ExploreWorkspace() {
  const t = useTranslations("workspace");
  const {
    activeEntityId,
    createdEntities,
    objectTypes,
    openInSidePanel,
    selectEntity,
    setSideSearchOpen,
    sideValue,
  } = useWorkspace();
  const actions = [
    {
      id: "graphView",
      label: t("explore.graphView"),
      icon: AppHeaderGraphIcon,
    },
    { id: "backlinks", label: t("explore.backlinks"), icon: ObjectPageIcon },
    {
      id: "objectsInside",
      label: t("explore.objectsInside"),
      icon: ObjectAreaIcon,
    },
    {
      id: "relatedContent",
      label: t("explore.relatedContent"),
      icon: ObjectCollectionIcon,
    },
    {
      id: "aiAssistantChat",
      label: t("explore.aiChat"),
      icon: ObjectAiChatIcon,
    },
    {
      id: "localSpaceQuery",
      label: t("actions.search"),
      icon: AppSidebarSearchIcon,
    },
  ];

  function openExploreAction(id: (typeof actions)[number]["id"]) {
    if (id === "localSpaceQuery") {
      setSideSearchOpen(true);
      return;
    }
    openInSidePanel({
      id: id === "aiAssistantChat" ? `aiAssistantChat_${Date.now()}` : id,
      label: actions.find((action) => action.id === id)?.label ?? id,
      icon:
        actions.find((action) => action.id === id)?.icon ?? AppHeaderGraphIcon,
      iconClassName: objectIconToneBadgeClass.gray,
      draggable: true,
    });
  }

  const contextualSideValues = new Set([
    "backlinks",
    "objectsInside",
    "relatedContent",
    "aiAssistantChat",
    "localSpaceQuery",
  ]);

  if (contextualSideValues.has(sideValue)) {
    const activeEntity = createdEntities.find(
      (entity) => entity.id === activeEntityId,
    );
    const linkIndex = createWorkspaceObjectLinkIndex(createdEntities);
    const backlinks = activeEntityId
      ? selectBacklinksForObject(linkIndex, activeEntityId)
      : [];
    const objectsInside = activeEntityId
      ? selectObjectsInside(linkIndex, activeEntityId)
      : [];
    const relatedIds = Array.from(
      new Set([
        ...backlinks.map((item) => item.sourceId),
        ...objectsInside.map((item) => item.targetId),
      ]),
    );
    const items =
      sideValue === "backlinks"
        ? backlinks.map((item) => item.sourceId)
        : sideValue === "objectsInside"
          ? objectsInside.map((item) => item.targetId)
          : relatedIds;
    const title =
      actions.find((action) => action.id === sideValue)?.label ??
      t("explore.title");
    const itemEntities = items
      .map((id) => createdEntities.find((entity) => entity.id === id))
      .filter((entity): entity is WorkspaceEntity => Boolean(entity));

    return (
      <div className="flex h-full min-h-0 items-start justify-center overflow-auto px-8 py-10 text-sidebar-foreground">
        <div className="w-full max-w-[36rem]">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {activeEntity ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {activeEntity.title || t("lifecycle.untitled")}
            </p>
          ) : null}
          {sideValue === "aiAssistantChat" ? (
            <div className="mt-6 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
              {t("documentMenu.aiUnavailable")}
            </div>
          ) : itemEntities.length > 0 ? (
            <div className="mt-5 grid gap-1">
              {itemEntities.map((entity) => {
                const objectType = objectTypes.find(
                  (item) => item.id === entity.objectTypeId,
                );
                const definition = objectTypeDefinitionById[entity.kind];
                return (
                  <button
                    key={entity.id}
                    type="button"
                    className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => selectEntity(entity.id)}
                  >
                    <ObjectIconBadge
                      icon={objectType?.icon ?? definition.icon}
                      tone={objectType?.tone ?? definition.tone}
                    />
                    <span className="min-w-0 truncate text-sm text-foreground">
                      {entity.title || t("lifecycle.untitled")}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {objectTypes.find(
                        (item) => item.id === entity.objectTypeId,
                      )?.label ?? entity.kind}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="mt-6 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              {sideValue === "backlinks"
                ? t("linking.noBacklinks")
                : sideValue === "objectsInside"
                  ? t("linking.noObjectsInside")
                  : t("empty.title")}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 items-center justify-center px-8 text-sidebar-foreground">
      <div className="w-full max-w-[331px] -translate-y-2">
        <h2 className="mb-2 text-xs text-muted-foreground">
          {t("explore.title")}
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                aria-label={action.label}
                onClick={() => openExploreAction(action.id)}
                className="flex h-[112px] min-w-0 flex-col justify-between rounded-[8px] border border-border bg-card p-4 text-left transition-colors duration-150 hover:bg-accent motion-reduce:transition-none"
              >
                <Icon className="size-5 shrink-0 text-foreground" />
                <span className="truncate text-xs text-muted-foreground">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-[38px] flex items-center justify-between text-xs text-muted-foreground">
          <span>{t("explore.relevantContent")}</span>
          <button
            type="button"
            aria-label={t("explore.findMore")}
            onClick={() => setSideSearchOpen(true)}
            className="flex items-center gap-1.5 text-[#5f5a55]"
          >
            <AppSidebarSearchIcon className="size-3.5" />
            {t("explore.findMore")}
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-foreground">
          <ObjectIconBadge
            icon={ObjectPageIcon}
            tone="blue"
            className="size-5 rounded"
            iconClassName="size-3.5"
          />
          <span>{t("empty.title")}</span>
        </div>
      </div>
    </div>
  );
}

function GraphWorkspace() {
  const t = useTranslations("workspace");
  const { activeEntityId, createdEntities } = useWorkspace();
  const [showRelated, setShowRelated] = React.useState(true);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const dragStateRef = React.useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [graphOptions, setGraphOptions] = React.useState({
    completedTasks: false,
    highLinkObjects: false,
    dates: false,
    simplified: false,
  });
  const graph = React.useMemo(
    () => projectWorkspaceGraph(createdEntities, activeEntityId),
    [activeEntityId, createdEntities],
  );
  const center = graph.nodes[0];
  const related = showRelated ? graph.nodes.slice(1) : [];
  const positions = related.map((_, index) => {
    const angle =
      (index / Math.max(related.length, 1)) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + Math.cos(angle) * 31, y: 50 + Math.sin(angle) * 31 };
  });

  function toggleGraphOption(option: keyof typeof graphOptions) {
    setGraphOptions((current) => ({
      ...current,
      [option]: !current[option],
    }));
  }

  function startGraphDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    };
    setDragging(true);
  }

  function moveGraph(event: React.PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    setPan({
      x: dragState.originX + event.clientX - dragState.startX,
      y: dragState.originY + event.clientY - dragState.startY,
    });
  }

  function stopGraphDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStateRef.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = null;
    setDragging(false);
  }

  const graphButtonClass =
    "inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-[8px] border border-transparent px-2 text-xs text-sidebar-foreground transition-opacity duration-200 ease-out hover:bg-muted hover:text-sidebar-foreground active:brightness-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none";

  return (
    <div
      data-slot="workspace-graph"
      className="relative flex h-full min-h-0 flex-col overflow-hidden bg-card text-card-foreground"
    >
      <div className="absolute inset-0 bottom-11 overflow-hidden">
        {center ? (
          <div
            data-slot="workspace-graph-canvas"
            data-dragging={dragging || undefined}
            className="absolute inset-0 origin-center cursor-grab touch-none select-none transition-transform duration-200 ease-out active:cursor-grabbing data-[dragging=true]:transition-none motion-reduce:transition-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
            onPointerDown={startGraphDrag}
            onPointerMove={moveGraph}
            onPointerUp={stopGraphDrag}
            onPointerCancel={stopGraphDrag}
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {positions.map((position, index) => (
                <line
                  key={graph.edges[index]?.target}
                  x1="50"
                  y1="50"
                  x2={position.x}
                  y2={position.y}
                  stroke="currentColor"
                  strokeOpacity="0.16"
                  strokeWidth="0.18"
                />
              ))}
            </svg>
            <div className="absolute left-1/2 top-1/2 flex max-w-[140px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center">
              <ObjectIconBadge
                icon={ObjectPageIcon}
                tone="blue"
                className="size-9 rounded-xl border border-blue-200 bg-blue-50"
                iconClassName="size-5"
              />
              <span className="max-w-[140px] truncate text-xs text-muted-foreground">
                {center.title || t("lifecycle.untitled")}
              </span>
            </div>

            {related.map((node, index) => (
              <div
                key={node.id}
                className="absolute flex max-w-[120px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center"
                style={{
                  left: `${positions[index].x}%`,
                  top: `${positions[index].y}%`,
                }}
              >
                <ObjectIconBadge
                  icon={ObjectPageIcon}
                  tone="gray"
                  className="size-8 rounded-xl border border-border bg-card"
                  iconClassName="size-4"
                />
                <span className="max-w-[120px] truncate text-xs text-muted-foreground">
                  {node.title || t("lifecycle.untitled")}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative mt-auto flex h-14 items-center justify-between px-3 text-xs text-muted-foreground">
        <div className="ml-[9px] flex items-center rounded-lg bg-card">
          <button
            type="button"
            aria-label={t("graph.showLess")}
            className={cn(
              graphButtonClass,
              "w-[129px] rounded-l-[8px] rounded-r-none px-3",
            )}
            onClick={() => setShowRelated(false)}
          >
            <AppHeaderGraphIcon className="size-3.5" />
            {t("graph.showLess")}
          </button>
          <button
            type="button"
            aria-label={t("graph.showMore")}
            className={cn(
              graphButtonClass,
              "-ml-px w-[118px] rounded-l-none rounded-r-[8px] px-3",
            )}
            onClick={() => setShowRelated(true)}
          >
            <SparklesIcon className="size-3.5" />
            {t("graph.showMore")}
          </button>
        </div>

        <div className="flex items-center">
          <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  aria-label={t("graph.settings")}
                  className={cn(graphButtonClass, "mr-0.5 w-8 px-0")}
                >
                  <Settings2Icon className="size-4" />
                </button>
              }
            />
            <PopoverContent
              side="top"
              align="end"
              sideOffset={4}
              className="w-72 rounded-[12px] border-border p-[6px] ring-0 shadow-[0_3px_5px_rgb(0_0_0/0.01),0_5px_10px_rgb(0_0_0/0.02),0_10px_14px_rgb(0_0_0/0.01)]"
            >
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                {t("graph.excludeObjectTypes")}
              </p>
              {(
                [
                  ["completedTasks", "graph.completedTasks"],
                  ["highLinkObjects", "graph.highLinkObjects"],
                  ["dates", "graph.dates"],
                  ["simplified", "graph.simplified"],
                ] as const
              ).map(([option, label]) => (
                <label
                  key={option}
                  className="flex min-h-8 cursor-pointer items-center justify-between gap-3 rounded-lg px-2 text-xs hover:bg-muted"
                >
                  <span>{t(label)}</span>
                  <input
                    type="checkbox"
                    checked={graphOptions[option]}
                    onChange={() => toggleGraphOption(option)}
                    className="relative size-[19px] shrink-0 appearance-none rounded-[7px] border border-input bg-transparent transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none checked:after:absolute checked:after:left-[5px] checked:after:top-[1px] checked:after:h-[10px] checked:after:w-[6px] checked:after:rotate-45 checked:after:border-b-2 checked:after:border-r-2 checked:after:border-primary-foreground checked:after:content-['']"
                  />
                </label>
              ))}
            </PopoverContent>
          </Popover>
          <div className="flex items-center">
            <button
              type="button"
              aria-label={t("graph.fit")}
              className={cn(
                graphButtonClass,
                "w-8 rounded-l-[8px] rounded-r-none px-0",
              )}
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
            >
              <Maximize2Icon className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t("graph.zoomOut")}
              className={cn(graphButtonClass, "-ml-px w-8 rounded-none px-0")}
              onClick={() =>
                setZoom((current) => Math.max(2 / 3, current - 1 / 3))
              }
            >
              <ZoomOutIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t("graph.zoomIn")}
              className={cn(
                graphButtonClass,
                "-ml-px w-8 rounded-l-none rounded-r-[8px] px-0",
              )}
              onClick={() =>
                setZoom((current) => Math.min(5 / 3, current + 1 / 3))
              }
            >
              <ZoomInIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AtomicNotesWorkspace, ExploreWorkspace, GraphWorkspace };
