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
import { ObjectIconBadge } from "@/components/object-icons";
import { ObjectTypeToolbarIcon } from "@/components/object-type-toolbar-icon";
import { DataViewRenderer, type ObjectViewLabels } from "@/components/object-views";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/components/workspace-controller";
import { useWorkspaceViews } from "@/components/workspace-views-controller";
import { cn } from "@/lib/utils";
import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import {
  executeQueryDefinition,
  type DataViewKind,
  type WorkspaceDataView,
} from "@/lib/workspace-object-views";

type WorkspaceObjectTypeViewProps = {
  readonly objectType: AppSidebarObjectType;
  readonly structure: WorkspaceStructure;
  readonly view: WorkspaceDataView;
};

type Mode = "all" | "overview";

function WorkspaceObjectTypeView({ objectType, structure, view }: WorkspaceObjectTypeViewProps) {
  const t = useTranslations("workspace");
  const {
    createWorkspaceEntity,
    createdEntities,
    selectEntity,
    structures,
  } = useWorkspace();
  const { switchWorkspaceDataViewKind, updateWorkspaceDataView } = useWorkspaceViews();
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
    () => Object.fromEntries(structures.map((item) => [item.id, item.singularName])) as Readonly<Record<string, string>>,
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
      className="relative flex h-full min-h-0 flex-col text-foreground"
    >
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
            {searchOpen ? (
              <Input
                autoFocus
                aria-label={t("objectTypeOverview.searchPlaceholder")}
                placeholder={t("objectTypeOverview.searchPlaceholder")}
                defaultValue={view.query.search ?? ""}
                className="h-7 w-44 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSearchOpen(false);
                    setSearch("");
                  }
                }}
              />
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={t("actions.search")}
                className="size-8 rounded-none"
                onClick={() => setSearchOpen(true)}
              >
                <AppSidebarSearchIcon className="size-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={t("actions.collapse")}
              aria-expanded={!collapsed}
              className="size-8 rounded-none"
              onClick={() => setCollapsed((current) => !current)}
            >
              <AppHeaderCaretDownIcon className={cn("size-4", !collapsed && "rotate-180")} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={t("actions.moreOptions")}
              className="size-8 rounded-none"
            >
              <AppSidebarDotsIcon className="size-4" />
            </Button>
          </div>
          <div className="flex h-8 overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Button
              type="button"
              className="h-8 w-[73px] rounded-none border-r border-white/15 bg-transparent px-2 text-sm font-normal hover:bg-white/10"
              onClick={createObject}
            >
              <AppSidebarPlusIcon className="size-4" />
              {t("actions.new")}
            </Button>
            <Button
              type="button"
              className="h-8 w-[30px] rounded-none bg-transparent px-0 hover:bg-white/10"
              aria-label={t("objectTypeOverview.newObjectOptions")}
              onClick={createObject}
            >
              <AppHeaderCaretDownIcon className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      {!collapsed ? (
        <div className="mt-4 flex items-center justify-between px-3 text-[13px] text-muted-foreground">
          <div role="tablist" aria-label={t("objectTypeOverview.viewLabel")} className="flex items-center">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "overview"}
              className={cn(
                "flex h-8 items-center gap-2 rounded-lg px-3.5 hover:bg-muted/70",
                mode === "overview" && "bg-muted text-foreground",
              )}
              onClick={() => setMode("overview")}
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
              onClick={() => setMode("all")}
            >
              <ObjectTypeToolbarIcon name="all" className="size-3.5" />
              {t("views.all")}
            </button>
          </div>
          {mode === "all" ? (
            <div className="flex items-center gap-1">
              <span className="flex h-8 items-center gap-1 px-2">
                <ObjectTypeToolbarIcon name="count" className="size-3.5" />
                {filtered.length}
              </span>
              <Button type="button" variant="ghost" size="icon-sm" aria-label={t("actions.filter")} aria-pressed={filterOpen} onClick={() => setFilterOpen((current) => !current)}>
                <ObjectTypeToolbarIcon name="filter" className="size-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" aria-label={t("actions.sort")} onClick={toggleSort}>
                <ObjectTypeToolbarIcon name="sort" className="size-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" aria-label={t("actions.list")} aria-pressed={view.presentation.kind === "list"} onClick={() => setLayout("list")}>
                <ObjectTypeToolbarIcon name="list" className="size-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" aria-label={t("actions.grid")} aria-pressed={view.presentation.kind === "gallery"} onClick={() => setLayout("gallery")}>
                <ObjectTypeToolbarIcon name="grid" className="size-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" aria-label={t("objectTypeStudio.objectTypes.table")} aria-pressed={view.presentation.kind === "table"} onClick={() => setLayout("table")}>
                <ObjectTypeToolbarIcon name="caret" className="size-3" />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {mode === "all" && filterOpen ? (
        <div data-slot="object-type-filter-row" className="mx-5 mt-2 flex h-9 items-center gap-2 rounded-lg border bg-card px-3 text-xs">
          <span>{t("objectTypeOverview.where")}</span>
          <Input
            aria-label={t("objectTypeOverview.searchPlaceholder")}
            placeholder={t("objectTypeOverview.searchPlaceholder")}
            className="h-7 max-w-52"
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button type="button" variant="ghost" size="sm" className="ml-auto h-7" onClick={() => {
            setFilterOpen(false);
            setSearch("");
          }}>
            {t("objectTypeOverview.remove")}
          </Button>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-4">
        {mode === "overview" ? (
          <div data-slot="object-type-overview" className="grid gap-6">
            <section>
              <h2 className="mb-3 text-sm font-medium">{t("objectTypeOverview.recentlyOpened")}</h2>
              {filtered.length ? (
                <DataViewRenderer
                  entities={filtered.slice(0, 4)}
                  labels={labels}
                  objectTypeLabels={objectTypeLabels}
                  onOpen={selectEntity}
                  propertyLabels={propertyLabels}
                  structures={structures}
                  view={view}
                />
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">{t("objectTypeOverview.noRecentDescription")}</p>
              )}
            </section>
          </div>
        ) : (
          <DataViewRenderer
            entities={createdEntities}
            labels={labels}
            objectTypeLabels={objectTypeLabels}
            onOpen={selectEntity}
            propertyLabels={propertyLabels}
            structures={structures}
            trailingContent={
              filtered.length > 0 && view.presentation.kind === "gallery" ? (
                <button type="button" className="flex min-h-[25rem] items-start gap-2 pt-4 text-muted-foreground" onClick={createObject}>
                  <AppSidebarPlusIcon className="mt-0.5 size-4" />
                  <span>{t("objectTypeOverview.newObject")}</span>
                </button>
              ) : null
            }
            view={view}
          />
        )}
      </div>
    </section>
  );
}

export { WorkspaceObjectTypeView };
export type { WorkspaceObjectTypeViewProps };
