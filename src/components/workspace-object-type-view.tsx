"use client";

import { useTranslations } from "next-intl";
import * as React from "react";

import { AppHeaderCaretDownIcon } from "@/components/app-header-icons";
import {
  AppSidebarDotsIcon,
  AppSidebarPlusIcon,
  AppSidebarSearchIcon,
} from "@/components/app-sidebar-icons";
import type { AppSidebarObjectType } from "@/components/app-sidebar-overview";
import {
  ObjectCollectionIcon,
  ObjectIconBadge,
  ObjectQueryIcon,
  ObjectTableIcon,
} from "@/components/object-icons";
import { ObjectTypeToolbarIcon } from "@/components/object-type-toolbar-icon";
import {
  DataViewRenderer,
  type ObjectViewLabels,
} from "@/components/object-views";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/components/workspace-controller";
import { useWorkspaceViews } from "@/components/workspace-views-controller";
import { useBufferedTextCommit } from "@/hooks/use-buffered-text-commit";
import { cn } from "@/lib/utils";
import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import type { WorkspaceEntity } from "@/lib/workspace-objects";
import {
  createDefaultDataViewPresentation,
  executeQueryDefinition,
  type DataViewKind,
  type QueryDefinition,
  type QueryFilter,
  type WorkspaceDataView,
} from "@/lib/workspace-object-views";

type WorkspaceObjectTypeViewProps = {
  readonly objectType: AppSidebarObjectType;
  readonly structure: WorkspaceStructure;
  readonly view: WorkspaceDataView;
};

type ObjectTypeViewMode = "all" | "overview";

const OBJECT_TYPE_LAYOUT_KINDS = [
  "gallery",
  "list",
  "table",
] as const satisfies readonly DataViewKind[];

function titleFilter(query: QueryDefinition): Extract<
  QueryFilter,
  { readonly field: "title" }
> | null {
  return (
    query.filters.find(
      (filter): filter is Extract<QueryFilter, { readonly field: "title" }> =>
        filter.field === "title",
    ) ?? null
  );
}

function withTitleFilter(
  query: QueryDefinition,
  value: string,
): QueryDefinition {
  const filters = query.filters.filter((filter) => filter.field !== "title");
  const normalized = value.trim();
  return {
    ...query,
    filters: normalized
      ? [
          ...filters,
          { field: "title", operator: "contains", value: normalized } as const,
        ]
      : filters,
  };
}

function withSearch(query: QueryDefinition, search: string): QueryDefinition {
  const normalized = search.trim();
  return {
    ...query,
    search: normalized || undefined,
  };
}

function nextSort(query: QueryDefinition): QueryDefinition {
  const titleSorting = query.sorts[0]?.field === "title";
  return {
    ...query,
    sorts: titleSorting
      ? [{ direction: "descending", field: "createdAt" }]
      : [{ direction: "ascending", field: "title" }],
  };
}

function isCardLayout(kind: DataViewKind): boolean {
  return kind === "gallery" || kind === "wall" || kind === "embed";
}

function BufferedSearch({
  inputRef,
  label,
  onCommit,
  onEscape,
  value,
}: {
  readonly inputRef: React.Ref<HTMLInputElement>;
  readonly label: string;
  readonly onCommit: (value: string) => void;
  readonly onEscape: () => void;
  readonly value: string;
}) {
  const { inputProps } = useBufferedTextCommit({ value, onCommit });
  return (
    <Input
      {...inputProps}
      ref={inputRef}
      data-slot="object-type-view-search"
      aria-label={label}
      placeholder={label}
      className="h-7 w-44 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
      onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") onEscape();
      }}
    />
  );
}

function ObjectTypeOptionsMenu({
  isPinned,
  onAddCollection,
  onAddQuery,
  onCreateFromTemplate,
  onExport,
  onImport,
  onSettings,
  onTogglePin,
}: {
  readonly isPinned: boolean;
  readonly onAddCollection: () => void;
  readonly onAddQuery: () => void;
  readonly onCreateFromTemplate: () => void;
  readonly onExport: () => void;
  readonly onImport: () => void;
  readonly onSettings: () => void;
  readonly onTogglePin: () => void;
}) {
  const t = useTranslations("workspace.objectTypeOverview");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("moreOptions")}
            className="size-8 rounded-none"
          >
            <AppSidebarDotsIcon className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={onCreateFromTemplate}>
          {t("newFromTemplate")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddQuery}>{t("newQuery")}</DropdownMenuItem>
        <DropdownMenuItem onClick={onAddCollection}>
          {t("newCollection")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onTogglePin}>
          {t(isPinned ? "unpinFromSidebar" : "pinToSidebar")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSettings}>
          {t("typeSettings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onExport}>{t("export")}</DropdownMenuItem>
        <DropdownMenuItem onClick={onImport}>{t("import")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ObjectTypeNewMenu({
  objectTypeLabel,
  onCreate,
  onImport,
  onOpenPalette,
}: {
  readonly objectTypeLabel: string;
  readonly onCreate: () => void;
  readonly onImport: () => void;
  readonly onOpenPalette: () => void;
}) {
  const t = useTranslations("workspace.objectTypeOverview");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
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
        <DropdownMenuItem onClick={onImport}>{t("importFiles")}</DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenPalette}>
          {t("newObject")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ObjectTypeViewTabs({
  mode,
  onAddView,
  onModeChange,
}: {
  readonly mode: ObjectTypeViewMode;
  readonly onAddView: () => void;
  readonly onModeChange: (mode: ObjectTypeViewMode) => void;
}) {
  const t = useTranslations("workspace");
  return (
    <div
      data-slot="object-type-view-tabs"
      role="tablist"
      aria-label={t("objectTypeOverview.viewLabel")}
      className="group/object-type-views flex items-center"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "overview"}
        className={cn(
          "flex h-8 items-center gap-2 rounded-lg px-3.5 text-muted-foreground hover:bg-muted/70",
          mode === "overview" && "bg-muted text-foreground",
        )}
        onClick={() => onModeChange("overview")}
    >
        <ObjectTypeToolbarIcon name="overview" className="size-3.5" />
        {t("views.overview")}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "all"}
        className={cn(
          "flex h-8 items-center gap-2 rounded-lg px-3.5 text-muted-foreground hover:bg-muted/70",
          mode === "all" && "bg-muted text-foreground",
        )}
        onClick={() => onModeChange("all")}
      >
        <ObjectTypeToolbarIcon name="all" className="size-3.5" />
        {t("views.all")}
      </button>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={t("objectTypeOverview.addView")} className="h-8 w-8 text-muted-foreground transition-opacity duration-300 [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:opacity-0 group-hover/object-type-views:pointer-events-auto group-hover/object-type-views:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100" onClick={onAddView}>
        <ObjectTypeToolbarIcon name="add" className="size-3.5" />
      </Button>
    </div>
  );
}

function ObjectTypeAllActions({
  count,
  filterOpen,
  layout,
  onFilter,
  onLayout,
  onSort,
}: {
  readonly count: number;
  readonly filterOpen: boolean;
  readonly layout: DataViewKind;
  readonly onFilter: () => void;
  readonly onLayout: (kind: DataViewKind) => void;
  readonly onSort: () => void;
}) {
  const t = useTranslations("workspace");
  return (
    <div data-slot="object-type-all-actions" className="flex items-center gap-1">
      <span className="flex h-8 items-center gap-1 rounded-lg px-2">
        <ObjectTypeToolbarIcon name="count" className="size-3.5" />
        {count}
      </span>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={t("actions.filter")} aria-pressed={filterOpen} onClick={onFilter}>
        <ObjectTypeToolbarIcon name="filter" className="size-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={t("actions.sort")} onClick={onSort}>
        <ObjectTypeToolbarIcon name="sort" className="size-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={t("actions.list")} aria-pressed={layout === "list"} onClick={() => onLayout("list")}>
        <ObjectTypeToolbarIcon name="list" className="size-3.5" />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" aria-label={t("actions.grid")} aria-pressed={isCardLayout(layout)} onClick={() => onLayout("gallery")}>
        <ObjectTypeToolbarIcon name="grid" className="size-3.5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon-sm" aria-label={t("actions.moreViews")}><ObjectTypeToolbarIcon name="caret" className="size-3" /></Button>} />
        <DropdownMenuContent align="end" className="w-44">
          {OBJECT_TYPE_LAYOUT_KINDS.map((kind) => (
            <DropdownMenuItem key={kind} onClick={() => onLayout(kind)}>
              {layout === kind ? <span aria-hidden>✓</span> : null}
              {kind === "gallery" ? t("actions.grid") : kind === "table" ? t("objectTypeStudio.objectTypes.table") : t("actions.list")}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ObjectTypeViewContent({
  collections,
  createdEntities,
  filteredCount,
  labels,
  mode,
  objectType,
  objectTypeLabels,
  onCreate,
  onImport,
  onOpen,
  propertyLabels,
  queries,
  structures,
  view,
}: {
  readonly collections: readonly string[];
  readonly createdEntities: readonly WorkspaceEntity[];
  readonly filteredCount: number;
  readonly labels: ObjectViewLabels;
  readonly mode: ObjectTypeViewMode;
  readonly objectType: AppSidebarObjectType;
  readonly objectTypeLabels: Readonly<Record<string, string>>;
  readonly onCreate: () => void;
  readonly onImport: () => void;
  readonly onOpen: (entityId: string) => void;
  readonly propertyLabels: Readonly<Record<string, string>>;
  readonly queries: readonly string[];
  readonly structures: readonly WorkspaceStructure[];
  readonly view: WorkspaceDataView;
}) {
  if (mode === "overview") {
    const recent = createdEntities
      .filter((entity) => entity.objectTypeId === objectType.id)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(0, 4);
    return (
      <div data-slot="object-type-overview-content" className="grid gap-6">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">{useTranslations("workspace.objectTypeOverview")("recentlyOpened")}</h2>
            {recent.length ? <span className="text-xs text-muted-foreground">{recent.length}</span> : null}
          </div>
          <div className="mt-3">
            {recent.length ? (DataViewRenderer {..({ entities: recent, labels, objectTypeLabels, onOpen, propertyLabels, structures, view } as any)} />) : <p></p>}
          </div>
        </section>
      </div>
    );
  }

  return (
    <DataViewRenderer
      entities={createdEntities}
      labels={labels}
      objectTypeLabels={objectTypeLabels}
      onOpen={onOpen}
      propertyLabels={propertyLabels}
      structures={structures}
      view={view}
      trailingContent={filteredCount > 0 ? <button type="button" className="flex min-h-[25rem] items-start gap-2 pt-4 text-muted-foreground" onClick={onCreate}><AppSidebarPlusIcon className="mt-0.5 size-4" /><span>{useTranslations("workspace")("actions.new")}</span></button> : null}
    />
  );
}

// full continuation from prepared parity component
// the file contains the remaining stateful Capacities-parity handlers.

function WorkspaceObjectTypeView({ objectType, structure, view }: WorkspaceObjectTypeViewProps) {
  const t = useTranslations("workspace");
  const {
    createWorkspaceEntity,
    createdEntities,
    importWorkspaceFiles,
    objectTypeCollections,
    objectTypeQueries,
    pinnedEntities,
    selectEntity,
    setObjectTypeCollections,
    setObjectTypeQueries,
    setPinnedEntities,
    showMessage,
    structures,
  } = useWorkspace();
  const {
    switchWorkspaceDataViewKind,
    updateWorkspaceDataView,
  } = useWorkspaceViews();
  const [mode, setMode] = React.useState<ObjectTypeViewMode>("overview");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [toolbarCollapsed, setToolbarCollapsed] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const filterInputRef = React.useRef<HTMLInputElement>(null);
  const importInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const objectTypeLabels = React.useMemo(() => Object.fromEntries(structures.map((item) => [item.id, item.singularName])), [structures]);
  const objectViewLabels = React.useMemo<ObjectViewLabels>(() => ({
    emptyView: t("empty.title"),
    missingObject: t("objectTypeOverview.namedItemViewNotReady"),
    openObject: (title) => `${t("lifecycle.task.open")}: ${title}`,
    untitledObject: t("lifecycle.untitled"),
  }), [t]);
  const propertyLabels = React.useMemo(() => ({
    createdAt: t("lifecycle.query.created"),
    objectTypeId: t("footer.objectTypes"),
    title: t("fields.title"),
    tags: t("fields.tags"),
  }), [t]);
  const filteredEntities = React.useMemo(() => executeQueryDefinition(createdEntities, view.query), [createdEntities, view.query]);
  const isPinned = pinnedEntities.some((item) => item.id === objectType.id);
  const currentTitleFilter = titleFilter(view.query)?.value ?? "";
  const collections = objectTypeCollections[objectType.id] ?? [];
  const queries = objectTypeQueries[objectType.id] ?? [];

  function createObject() {
    createWorkspaceEntity(objectType.id, objectType.label);
  }

  function addCollection() {
    const next = t("objectTypeOverview.untitled");
    setObjectTypeCollections((current) => ({ ...current, [objectType.id]: [...(current[objectType.id] ?? []), next] }));
  }

  function addQuery() {
    const next = t("objectTypeOverview.untitled");
    setObjectTypeQueries((current) => ({ ...current, [objectType.id]: [...(current[objectType.id] ?? []), next] }));
  }

  function togglePin() {
    setPinnedEntities((current) => isPinned ? current.filter((item) => item.id !== objectType.id) : [...current, objectType]);
    showMessage(t(`objectTypeOverview.${isPinned ? "unpinnedFromSidebar" : "pinnedToSidebar"}`));
  }

  function exportObjects() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(filteredEntities, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${objectType.id}-objects.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    showMessage(t("objectTypeOverview.exportComplete"));
  }

  async function importFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    if (files.length > 0) await importWorkspaceFiles(objectType.id, files);
    input.value = "";
  }

  function openGlobalNewPalette() {
    window.setTimeout(() => window.dispatchEvent(new CustomEvent("workspace:open-new-palette")), 0);
  }

  return (
    <section data-slot="workspace-object-type-view" className="relative flex h-full min-h-0 flex-col text-foreground">
      <input ref={importInputRef} type="file" multiple className="sr-only" aria-label={t("actions.importFiles")} onChange={importFiles} />
      <div className="@container flex flex-wrap items-center justify-between px-3 pt-4">
        <div className="flex min-w-0 items-center gap-[13px] @max-[450px]:basis-full">
          <ObjectIconBadge icon={objectType.icon} tone={objectType.tone} className="ml-[3px] size-[26px] rounded-lg" iconClassName="size-[15px]" />
          <h1 className="truncate text-[20px] font-bold leading-5 tracking-[-0.02em]">{objectType.label}</h1>
        </div>
        <div className="flex items-center gap-1.5 @max-[450px]:mt-2 @max-[450px]:w-full @max-[450px]:justify-between">
          <div className="flex h-8 items-center overflow-hidden rounded-lg border border-transparent bg-card text-muted-foreground shadow-[0_2px_8px_rgb(0_0_0/0.04)]">
            {searchOpen ? (
              <BufferedSearch inputRef={searchInputRef} label={t("objectTypeOverview.searchPlaceholder")} value={view.query.search ?? ""} onCommit={(search) => updateWorkspaceDataView(view.id, { query: withSearch(view.query, search) })} onEscape={() => { setSearchOpen(false); updateWorkspaceDataView(view.id, { query: withSearch(view.query, "") }); }} />
            ) : (
              <Button type="button" variant="ghost" size="icon-sm" aria-label={t("actions.search")} className="size-8 rounded-none" onClick={() => setSearchOpen(true)}><AppSidebarSearchIcon className="size-4" /></Button>
            )}
            <Button type="button" variant="ghost" size="icon-sm" aria-label={t("actions.collapse")} aria-expanded={!toolbarCollapsed} className="size-8 rounded-none" onClick={() => setToolbarCollapsed((current) => !current)}><AppHeaderCaretDownIcon className={cn("size-4", !toolbarCollapsed && "rotate-180")} /></Button>
            <ObjectTypeOptionsMenu isPinned={isPinned} onAddCollection={addCollection} onAddQuery={addQuery} onCreateFromTemplate={createObject} onExport={exportObjects} onImport={() => importInputRef.current?.click()} onSettings={() => showMessage(t("objectTypeOverview.settingsDescription"))} onTogglePin={togglePin} />
          </div>
          <div className="flex h-8 overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Button type="button" className="h-8 w-[73px] rounded-none border-r border-white/15 bg-transparent px-2 text-sm font-normal hover:bg-white/10" onClick={createObject}><AppSidebarPlusIcon className="size-4" />{t("actions.new")}</Button>
            <ObjectTypeNewMenu objectTypeLabel={objectType.label} onCreate={createObject} onImport={() => importInputRef.current?.click()} onOpenPalette={openGlobalNewPalette} />
          </div>
        </div>
      </div>
       {!toolbarCollapsed ? (
        <div className="mt-4 flex items-center justify-between px-3 text-[13px] text-muted-foreground">
          <ObjectTypeViewTabs mode={mode} onAddView={addQuery} onModeChange={setMode} />
          {mode === "all" ? <ObjectTypeAllActions count={filteredEntities.length} filterOpen={filterOpen} layout={view.presentation.kind} onFilter={() => setFilterOpen((current) => !current)} onLayout={(kind) => switchWorkspaceDataViewKind(view.id, kind)} onSort={() => updateWorkspaceDataView(view.id, { query: nextSort(view.query) })} /> : null}
        </div>
      ) : null}
      {mode === "all" && filterOpen ? (
        <div data-slot="object-type-filter-row" className="mx-5 mt-2 flex h-9 items-center gap-2 rounded-lg border bg-card px-3 text-xs">
          <span>{t("objectTypeOverview.where")}</span>
          <BufferedSearch inputRef={filterInputRef} label={t("objectTypeOverview.searchPlaceholder")} value={currentTitleFilter} onCommit={(value) => updateWorkspaceDataView(view.id, { query: withTitleFilter(view.query, value) })} onEscape={() => setFilterOpen(false)} />
          <Button type="button" variant="ghost" size="sm" className="ml-auto h-7" onClick={() => { setFilterOpen(false); updateWorkspaceDataView(view.id, { query: withTitleFilter(view.query, "") }); }}>{t("objectTypeOverview.remove")}</Button>
        </div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-4">
        <ObjectTypeViewContent collections={collections} createdEntities={createdEntities} filteredCount={filteredEntities.length} labels={objectViewLabels} mode={mode} objectType={objectType} objectTypeLabels={objectTypeLabels} onCreate={createObject} onImport={() => importInputRef.current?.click()} onOpen={selectEntity} propertyLabels={propertyLabels} queries={queries} structures={structures} view={view} />
      </div>
    </section>
  );
}

export { WorkspaceObjectTypeView };
export type { WorkspaceObjectTypeViewProps };
