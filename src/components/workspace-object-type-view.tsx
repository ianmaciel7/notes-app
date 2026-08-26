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
  objectIconToneBadgeClass,
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
import {
  WorkspaceEmptyState,
  workspaceFieldGroupClass,
  workspaceOverviewContentClass,
  workspaceRouteClass,
  workspaceSectionTitleClass,
} from "@/components/ui/workspace-surface";
import { useWorkspace } from "@/components/workspace-controller";
import { useWorkspaceViews } from "@/components/workspace-views-controller";
import { cn } from "@/lib/utils";
import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import {
  executeQueryDefinition,
  type DataViewKind,
  type WorkspaceDataView,
} from "@/lib/workspace-object-views";
import type { WorkspaceEntity } from "@/lib/workspace-objects";

type WorkspaceObjectTypeViewProps = {
  readonly objectType: AppSidebarObjectType;
  readonly structure: WorkspaceStructure;
  readonly view: WorkspaceDataView;
};

type Mode = "all" | "overview";
type ObjectTypeNamedItemKind = "collection" | "query";

function objectTypeNamedItemTabId(
  kind: ObjectTypeNamedItemKind,
  objectTypeId: string,
  index: number,
) {
  return `object-type-item:${kind}:${objectTypeId}:${index}`;
}

type ObjectTypeHeaderProps = {
  readonly collapsed: boolean;
  readonly objectType: AppSidebarObjectType;
  readonly onAddCollection: () => void;
  readonly onAddQuery: () => void;
  readonly onCreateObject: () => void;
  readonly onSearch: (value: string) => void;
  readonly onSearchOpenChange: (value: boolean) => void;
  readonly onToggleCollapsed: () => void;
  readonly searchOpen: boolean;
  readonly searchValue?: string;
};

function ObjectTypeHeaderSearch({
  onSearch,
  onSearchOpenChange,
  searchOpen,
  searchValue,
}: Pick<
  ObjectTypeHeaderProps,
  "onSearch" | "onSearchOpenChange" | "searchOpen" | "searchValue"
>) {
  const t = useTranslations("workspace");
  if (searchOpen) {
    return (
      <Input
        autoFocus
        aria-label={t("objectTypeOverview.searchPlaceholder")}
        placeholder={t("objectTypeOverview.searchPlaceholder")}
        defaultValue={searchValue ?? ""}
        className="h-7 w-44 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
        onChange={(event) => onSearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onSearchOpenChange(false);
            onSearch("");
          }
        }}
      />
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={t("actions.search")}
      className="size-8 rounded-none"
      onClick={() => onSearchOpenChange(true)}
    >
      <AppSidebarSearchIcon className="size-4" />
    </Button>
  );
}

function ObjectTypeMoreMenu({
  onAddCollection,
  onAddQuery,
  onCreateObject,
}: Pick<
  ObjectTypeHeaderProps,
  "onAddCollection" | "onAddQuery" | "onCreateObject"
>) {
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
            className="size-8 rounded-none"
          >
            <AppSidebarDotsIcon className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={onCreateObject}>
          {t("objectTypeOverview.newFromTemplate")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddQuery}>
          {t("objectTypeOverview.newQuery")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddCollection}>
          {t("objectTypeOverview.newCollection")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {t("objectTypeOverview.typeSettings")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ObjectTypeHeader({
  collapsed,
  objectType,
  onAddCollection,
  onAddQuery,
  onCreateObject,
  onSearch,
  onSearchOpenChange,
  onToggleCollapsed,
  searchOpen,
  searchValue,
}: ObjectTypeHeaderProps) {
  const t = useTranslations("workspace");
  return (
    <header className="@container flex flex-wrap items-center justify-between px-3 pt-4">
      <div className="flex min-w-0 items-center gap-[13px]">
        <ObjectIconBadge
          icon={objectType.icon}
          tone={objectType.tone}
          className="ml-[3px] size-[26px] rounded-lg"
          iconClassName="size-[15px]"
        />
        <h1 className="truncate text-[20px] font-bold leading-5 tracking-[-0.02em]">
          {objectType.label}
        </h1>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex h-8 items-center overflow-hidden rounded-lg bg-card text-muted-foreground shadow-[0_2px_8px_rgb(0_0_0/0.04)]">
          <ObjectTypeHeaderSearch
            onSearch={onSearch}
            onSearchOpenChange={onSearchOpenChange}
            searchOpen={searchOpen}
            searchValue={searchValue}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("actions.collapse")}
            aria-expanded={!collapsed}
            className="size-8 rounded-none"
            onClick={onToggleCollapsed}
          >
            <AppHeaderCaretDownIcon
              className={cn("size-4", !collapsed && "rotate-180")}
            />
          </Button>
          <ObjectTypeMoreMenu
            onAddCollection={onAddCollection}
            onAddQuery={onAddQuery}
            onCreateObject={onCreateObject}
          />
        </div>
        <div className="flex h-8 overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Button
            type="button"
            className="h-8 w-[73px] rounded-none border-r border-white/15 bg-transparent px-2 text-sm font-normal hover:bg-white/10"
            onClick={onCreateObject}
          >
            <AppSidebarPlusIcon className="size-4" />
            {t("actions.new")}
          </Button>
          <Button
            type="button"
            className="h-8 w-[30px] rounded-none bg-transparent px-0 hover:bg-white/10"
            aria-label={t("objectTypeOverview.newObjectOptions")}
            onClick={onCreateObject}
          >
            <AppHeaderCaretDownIcon className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

type ObjectTypeToolbarProps = {
  readonly count: number;
  readonly filterOpen: boolean;
  readonly mode: Mode;
  readonly onFilterOpenChange: (value: boolean) => void;
  readonly onLayoutChange: (kind: DataViewKind) => void;
  readonly onModeChange: (mode: Mode) => void;
  readonly onToggleSort: () => void;
  readonly view: WorkspaceDataView;
};

function ObjectTypeToolbar({
  count,
  filterOpen,
  mode,
  onFilterOpenChange,
  onLayoutChange,
  onModeChange,
  onToggleSort,
  view,
}: ObjectTypeToolbarProps) {
  const t = useTranslations("workspace");
  return (
    <div className="mt-4 flex items-center justify-between px-3 text-[13px] text-muted-foreground">
      <div
        role="tablist"
        aria-label={t("objectTypeOverview.viewLabel")}
        className="flex items-center"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "overview"}
          className={cn(
            "flex h-8 items-center gap-2 rounded-lg px-3.5 hover:bg-muted/70",
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
            "flex h-8 items-center gap-2 rounded-lg px-3.5 hover:bg-muted/70",
            mode === "all" && "bg-muted text-foreground",
          )}
          onClick={() => onModeChange("all")}
        >
          <ObjectTypeToolbarIcon name="all" className="size-3.5" />
          {t("views.all")}
        </button>
      </div>
      <ObjectTypeAllControls
        count={count}
        filterOpen={filterOpen}
        mode={mode}
        onFilterOpenChange={onFilterOpenChange}
        onLayoutChange={onLayoutChange}
        onToggleSort={onToggleSort}
        view={view}
      />
    </div>
  );
}

function ObjectTypeAllControls({
  count,
  filterOpen,
  mode,
  onFilterOpenChange,
  onLayoutChange,
  onToggleSort,
  view,
}: Omit<ObjectTypeToolbarProps, "onModeChange">) {
  const t = useTranslations("workspace");
  if (mode !== "all") return null;
  return (
    <div className="flex items-center gap-1">
      <span className="flex h-8 items-center gap-1 px-2">
        <ObjectTypeToolbarIcon name="count" className="size-3.5" />
        {count}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.filter")}
        aria-pressed={filterOpen}
        onClick={() => onFilterOpenChange(!filterOpen)}
      >
        <ObjectTypeToolbarIcon name="filter" className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.sort")}
        onClick={onToggleSort}
      >
        <ObjectTypeToolbarIcon name="sort" className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.list")}
        aria-pressed={view.presentation.kind === "list"}
        onClick={() => onLayoutChange("list")}
      >
        <ObjectTypeToolbarIcon name="list" className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.grid")}
        aria-pressed={view.presentation.kind === "gallery"}
        onClick={() => onLayoutChange("gallery")}
      >
        <ObjectTypeToolbarIcon name="grid" className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("objectTypeStudio.objectTypes.table")}
        aria-pressed={view.presentation.kind === "table"}
        onClick={() => onLayoutChange("table")}
      >
        <ObjectTypeToolbarIcon name="caret" className="size-3" />
      </Button>
    </div>
  );
}

type ObjectTypeFilterRowProps = {
  readonly filterOpen: boolean;
  readonly mode: Mode;
  readonly onFilterOpenChange: (value: boolean) => void;
  readonly onSearch: (value: string) => void;
};

function ObjectTypeFilterRow({
  filterOpen,
  mode,
  onFilterOpenChange,
  onSearch,
}: ObjectTypeFilterRowProps) {
  const t = useTranslations("workspace");
  if (mode !== "all" || !filterOpen) return null;
  return (
    <div
      data-slot="object-type-filter-row"
      className={cn(
        workspaceFieldGroupClass,
        "mx-5 mt-2 flex h-9 items-center gap-2 px-3 py-0 text-xs",
      )}
    >
      <span>{t("objectTypeOverview.where")}</span>
      <Input
        aria-label={t("objectTypeOverview.searchPlaceholder")}
        placeholder={t("objectTypeOverview.searchPlaceholder")}
        className="h-7 max-w-52"
        onChange={(event) => onSearch(event.target.value)}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-auto h-7"
        onClick={() => {
          onFilterOpenChange(false);
          onSearch("");
        }}
      >
        {t("objectTypeOverview.remove")}
      </Button>
    </div>
  );
}

type ObjectTypeContentProps = {
  readonly createdEntities: readonly WorkspaceEntity[];
  readonly filtered: readonly WorkspaceEntity[];
  readonly labels: ObjectViewLabels;
  readonly mode: Mode;
  readonly objectTypeLabels: Readonly<Record<string, string>>;
  readonly onCreateObject: () => void;
  readonly onOpen: (id: string) => void;
  readonly propertyLabels: Readonly<Record<string, string>>;
  readonly structures: readonly WorkspaceStructure[];
  readonly view: WorkspaceDataView;
};

function ObjectTypeContent({
  createdEntities,
  filtered,
  labels,
  mode,
  objectTypeLabels,
  onCreateObject,
  onOpen,
  propertyLabels,
  structures,
  view,
}: ObjectTypeContentProps) {
  if (mode === "overview") {
    return (
      <ObjectTypeOverviewContent
        filtered={filtered}
        labels={labels}
        objectTypeLabels={objectTypeLabels}
        onOpen={onOpen}
        propertyLabels={propertyLabels}
        structures={structures}
        view={view}
      />
    );
  }

  return (
    <ObjectTypeAllContent
      createdEntities={createdEntities}
      filtered={filtered}
      labels={labels}
      objectTypeLabels={objectTypeLabels}
      onCreateObject={onCreateObject}
      onOpen={onOpen}
      propertyLabels={propertyLabels}
      structures={structures}
      view={view}
    />
  );
}

function ObjectTypeOverviewContent({
  filtered,
  labels,
  objectTypeLabels,
  onOpen,
  propertyLabels,
  structures,
  view,
}: Omit<
  ObjectTypeContentProps,
  "createdEntities" | "mode" | "onCreateObject"
>) {
  const t = useTranslations("workspace");
  return (
    <div data-slot="object-type-overview" className="grid gap-6">
      <section>
        <h2 className={cn(workspaceSectionTitleClass, "mb-3")}>
          {t("objectTypeOverview.recentlyOpened")}
        </h2>
        {filtered.length ? (
          <DataViewRenderer
            entities={filtered.slice(0, 4)}
            labels={labels}
            objectTypeLabels={objectTypeLabels}
            onOpen={onOpen}
            propertyLabels={propertyLabels}
            structures={structures}
            view={view}
          />
        ) : (
          <WorkspaceEmptyState
            compact
            title={t("objectTypeOverview.noRecentDescription")}
          />
        )}
      </section>
    </div>
  );
}

function ObjectTypeAllContent({
  createdEntities,
  filtered,
  labels,
  objectTypeLabels,
  onCreateObject,
  onOpen,
  propertyLabels,
  structures,
  view,
}: Omit<ObjectTypeContentProps, "mode">) {
  return (
    <DataViewRenderer
      entities={createdEntities}
      labels={labels}
      objectTypeLabels={objectTypeLabels}
      onOpen={onOpen}
      propertyLabels={propertyLabels}
      structures={structures}
      trailingContent={
        <ObjectTypeTrailingContent
          filteredCount={filtered.length}
          onCreateObject={onCreateObject}
          view={view}
        />
      }
      view={view}
    />
  );
}

function ObjectTypeTrailingContent({
  filteredCount,
  onCreateObject,
  view,
}: {
  readonly filteredCount: number;
  readonly onCreateObject: () => void;
  readonly view: WorkspaceDataView;
}) {
  const t = useTranslations("workspace");
  if (filteredCount === 0 || view.presentation.kind !== "gallery") return null;
  return (
    <button
      type="button"
      className="flex min-h-[25rem] items-start gap-2 pt-4 text-muted-foreground"
      onClick={onCreateObject}
    >
      <AppSidebarPlusIcon className="mt-0.5 size-4" />
      <span>{t("objectTypeOverview.newObject")}</span>
    </button>
  );
}

function WorkspaceObjectTypeView({
  objectType,
  structure,
  view,
}: WorkspaceObjectTypeViewProps) {
  const t = useTranslations("workspace");
  const {
    createWorkspaceEntity,
    createdEntities,
    objectTypeCollections,
    objectTypeQueries,
    selectEntity,
    setActiveAction,
    setActiveEntityId,
    setMainTabs,
    setMainValue,
    setObjectTypeCollections,
    setObjectTypeQueries,
    structures,
  } = useWorkspace();
  const { switchWorkspaceDataViewKind, updateWorkspaceDataView } =
    useWorkspaceViews();
  const [mode, setMode] = React.useState<Mode>("all");
  const [collapsed, setCollapsed] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const filtered = executeQueryDefinition(createdEntities, view.query);
  const labels = React.useMemo<ObjectViewLabels>(
    () => ({
      emptyView: t("empty.title"),
      missingObject: t("objectTypeOverview.namedItemViewNotReady"),
      openObject: (title) => `${t("lifecycle.task.open")}: ${title}`,
      untitledObject: t("lifecycle.untitled"),
    }),
    [t],
  );
  const objectTypeLabels = React.useMemo(
    () =>
      Object.fromEntries(
        structures.map((item) => [item.id, item.singularName]),
      ) as Readonly<Record<string, string>>,
    [structures],
  );
  const propertyLabels = React.useMemo(
    () => ({
      createdAt: t("lifecycle.query.created"),
      objectTypeId: t("footer.objectTypes"),
      title: t("fields.title"),
    }),
    [t],
  );

  function createObject() {
    createWorkspaceEntity(objectType.id, objectType.label);
  }

  function openNamedItem(
    kind: ObjectTypeNamedItemKind,
    index: number,
    label: string,
  ) {
    const tabId = objectTypeNamedItemTabId(kind, objectType.id, index);
    const Icon = kind === "collection" ? ObjectCollectionIcon : ObjectQueryIcon;
    const tab = {
      draggable: true,
      icon: Icon,
      iconClassName: objectIconToneBadgeClass.gray,
      id: tabId,
      label,
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
    const label = t("objectTypeOverview.untitled");
    const index = objectTypeCollections[objectType.id]?.length ?? 0;
    setObjectTypeCollections((current) => ({
      ...current,
      [objectType.id]: [...(current[objectType.id] ?? []), label],
    }));
    openNamedItem("collection", index, label);
  }

  function addQuery() {
    const label = t("objectTypeOverview.untitled");
    const index = objectTypeQueries[objectType.id]?.length ?? 0;
    setObjectTypeQueries((current) => ({
      ...current,
      [objectType.id]: [...(current[objectType.id] ?? []), label],
    }));
    openNamedItem("query", index, label);
  }

  function setLayout(kind: DataViewKind) {
    switchWorkspaceDataViewKind(view.id, kind);
  }

  function toggleSort() {
    const titleSort = view.query.sorts[0]?.field === "title";
    updateWorkspaceDataView(view.id, {
      query: {
        ...view.query,
        sorts: titleSort
          ? [{ direction: "descending", field: "createdAt" }]
          : [{ direction: "ascending", field: "title" }],
      },
    });
  }

  function setSearch(value: string) {
    updateWorkspaceDataView(view.id, {
      query: { ...view.query, search: value.trim() || undefined },
    });
  }

  return (
    <section
      data-slot="workspace-object-type-view"
      data-structure-id={structure.id}
      className={workspaceRouteClass}
    >
      <ObjectTypeHeader
        collapsed={collapsed}
        objectType={objectType}
        onAddCollection={addCollection}
        onAddQuery={addQuery}
        onCreateObject={createObject}
        onSearch={setSearch}
        onSearchOpenChange={setSearchOpen}
        onToggleCollapsed={() => setCollapsed((current) => !current)}
        searchOpen={searchOpen}
        searchValue={view.query.search}
      />

      {!collapsed && (
        <ObjectTypeToolbar
          count={filtered.length}
          filterOpen={filterOpen}
          mode={mode}
          onFilterOpenChange={setFilterOpen}
          onLayoutChange={setLayout}
          onModeChange={setMode}
          onToggleSort={toggleSort}
          view={view}
        />
      )}

      <ObjectTypeFilterRow
        filterOpen={filterOpen}
        mode={mode}
        onFilterOpenChange={setFilterOpen}
        onSearch={setSearch}
      />

      <div className={workspaceOverviewContentClass}>
        <ObjectTypeContent
          createdEntities={createdEntities}
          filtered={filtered}
          labels={labels}
          mode={mode}
          objectTypeLabels={objectTypeLabels}
          onCreateObject={createObject}
          onOpen={selectEntity}
          propertyLabels={propertyLabels}
          structures={structures}
          view={view}
        />
      </div>
    </section>
  );
}

export { WorkspaceObjectTypeView };
export type { WorkspaceObjectTypeViewProps };
