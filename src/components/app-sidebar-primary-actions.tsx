"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  AppSidebarCalendarIcon,
  AppSidebarChevronRightIcon,
  AppSidebarExploreIcon,
  AppSidebarPlusIcon,
  AppSidebarSearchIcon,
  AppSidebarTaskIcon,
} from "@/components/app-sidebar-icons";
import {
  type AppSidebarCollectionAction,
  type AppSidebarObjectType,
  AppSidebarOverview,
} from "@/components/app-sidebar-overview";
import {
  ObjectCollectionIcon,
  ObjectIconBadge,
  objectIconToneBadgeClass,
} from "@/components/object-icons";
import { objectLifecycleContractSlots } from "@/components/object-lifecycle-contracts";
import { Button } from "@/components/ui/button";
import {
  CompactMenuItemText,
  compactMenuItemClass,
  compactMenuSearchClass,
  compactMenuSurfaceClass,
} from "@/components/ui/compact-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { workspaceRowStateClass } from "@/components/ui/shared-styles";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useWorkspace } from "@/components/workspace-controller";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  createWorkspaceCommandRuntime,
  projectWorkspaceCommands,
  type WorkspaceCommandId,
} from "@/lib/workspace-command-registry";
import {
  createCollectionId,
  type WorkspaceCollectionRecord,
} from "@/lib/workspace-domain-identities";
import { formatShortcutChord, type ShortcutPlatform } from "@/lib/workspace-shortcuts";

type AppSidebarPrimaryActionId =
  | "new"
  | "search"
  | "explore"
  | "calendar"
  | "tasks";

type AppSidebarPrimaryNavigationAction = Exclude<
  AppSidebarPrimaryActionId,
  "new"
>;

type AppSidebarShortcut = string;

type AppSidebarPrimaryActionHint = {
  description: string;
  shortcut?: string;
};

function normalizeMenuQuery(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function NewContentMenu({
  action,
  objectTypes,
  onSelectObjectType,
}: {
  action: AppSidebarPrimaryAction;
  objectTypes: readonly AppSidebarObjectType[];
  onSelectObjectType?: (objectTypeId: string, objectTypeLabel?: string) => void;
}) {
  const t = useTranslations("workspace");
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const optionRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const Icon = action.icon;
  const deferredQuery = React.useDeferredValue(query);
  const normalizedQuery = normalizeMenuQuery(deferredQuery.trim());
  const localizedItems = objectTypes.map((item) => ({
    ...item,
    label: item.singularLabel ?? item.label,
  }));
  const items = React.useMemo(
    () =>
      localizedItems.filter((item) =>
        normalizeMenuQuery(item.label).includes(normalizedQuery),
      ),
    [localizedItems, normalizedQuery],
  );

  function resetMenu() {
    setQuery("");
    setActiveIndex(0);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) resetMenu();
  }

  function selectItem(objectTypeId: string) {
    const selectedItem = localizedItems.find(
      (item) => item.id === objectTypeId,
    );
    onSelectObjectType?.(objectTypeId, selectedItem?.label);
    setOpen(false);
    resetMenu();
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      handleOpenChange(false);
      return;
    }

    if (items.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex(
        (current) => (current + direction + items.length) % items.length,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const activeItem = items[activeIndex];
      if (activeItem) selectItem(activeItem.id);
    }
  }

  React.useEffect(() => {
    const activeItem = items[activeIndex];
    if (!open || !activeItem) return;
    optionRefs.current.get(activeItem.id)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, items, open]);

  React.useEffect(() => {
    function openFromWorkspace() {
      setQuery("");
      setActiveIndex(0);
      setOpen(true);
    }
    window.addEventListener("workspace:open-new-palette", openFromWorkspace);
    return () =>
      window.removeEventListener(
        "workspace:open-new-palette",
        openFromWorkspace,
      );
  }, []);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            id="workspace-new-trigger"
            data-lifecycle-contract={
              objectLifecycleContractSlots.ObjectCreationTrigger
            }
            type="button"
            variant="ghost"
            size="default"
            className="h-8 w-full justify-start gap-x-1.5 px-2 font-normal text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&_svg]:size-4"
          />
        }
      >
        <Icon data-icon="inline-start" />
        <span className="min-w-0 truncate">{action.label}</span>
      </PopoverTrigger>
      <PopoverContent
        data-lifecycle-contract={
          objectLifecycleContractSlots.ObjectCreationMenu
        }
        side="bottom"
        align="start"
        sideOffset={-1}
        alignOffset={6}
        className={cn(
          compactMenuSurfaceClass,
          "box-content h-[361px] w-[22rem] min-w-0 max-w-[calc(100vw-1rem)] gap-0 rounded-[12px] border-[oklch(0.9163_0.0017_67.07)] shadow-[0_3px_5px_rgb(0_0_0/0.01),0_5px_10px_rgb(0_0_0/0.02),0_10px_14px_rgb(0_0_0/0.01)] ring-0",
        )}
      >
        <div className="h-11 shrink-0 p-1.5">
          <div
            className={cn(
              compactMenuSearchClass,
              "flex h-8 items-center rounded-[8px] bg-[oklch(0.9676_0.0016_67.02)]",
            )}
          >
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder={t("primaryNavigation.search")}
              aria-label={t("primaryNavigation.searchContentType")}
              aria-controls="new-content-menu-listbox"
              aria-activedescendant={
                items[activeIndex]
                  ? `new-content-option-${items[activeIndex].id}`
                  : undefined
              }
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              className="h-full border-0 bg-transparent p-0 shadow-none placeholder:text-muted-foreground placeholder:opacity-60 focus-visible:ring-0"
              autoFocus
            />
          </div>
        </div>

        <div
          id="new-content-menu-listbox"
          role="listbox"
          aria-label={t("primaryNavigation.typesLabel")}
          className="h-72 min-h-0 shrink-0 overflow-y-auto px-1.5"
        >
          {items.map(({ id, icon: Icon, label, tone }, index) => {
            return (
              <button
                key={id}
                data-lifecycle-contract={
                  objectLifecycleContractSlots.ObjectTypeOptionRow
                }
                ref={(node) => {
                  if (node) optionRefs.current.set(id, node);
                  else optionRefs.current.delete(id);
                }}
                id={`new-content-option-${id}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                tabIndex={-1}
                data-active={index === activeIndex || undefined}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => selectItem(id)}
                className={cn(
                  compactMenuItemClass,
                  "flex h-8 min-h-8 items-center justify-between gap-2 rounded-[8px] px-1 text-left font-normal outline-none hover:bg-[#f3f1ee] data-[active=true]:bg-[#f3f1ee]",
                )}
              >
                <ObjectIconBadge icon={Icon} tone={tone} variant="menu" />
                <CompactMenuItemText>{label}</CompactMenuItemText>
                <AppSidebarChevronRightIcon className="ml-auto size-3 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        <div className="mx-1 flex h-[29px] shrink-0 items-center gap-x-3 border-t border-border px-1 py-1.5 text-xs leading-4 text-muted-foreground">
          <span className="whitespace-nowrap">
            <span className="font-medium text-muted-foreground">↑↓</span>{" "}
            {t("primaryNavigation.navigate")}
          </span>
          <span className="whitespace-nowrap">
            <span className="font-medium text-muted-foreground">Esc</span>{" "}
            {t("primaryNavigation.cancel")}
          </span>
          <span className="whitespace-nowrap">
            <span className="font-medium text-muted-foreground">↵</span>{" "}
            {t("primaryNavigation.select")}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

type AppSidebarPrimaryAction = {
  id: AppSidebarPrimaryActionId;
  label: string;
  icon: React.ElementType;
  commandIds: readonly WorkspaceCommandId[];
  hints: AppSidebarPrimaryActionHint[];
};

type AppSidebarPrimaryActionsProps = {
  activeAction?: AppSidebarPrimaryNavigationAction;
  onAction?: (action: AppSidebarPrimaryActionId) => void;
  onSelectObjectType?: (objectTypeId: string, objectTypeLabel?: string) => void;
  objectTypes?: readonly AppSidebarObjectType[];
  actions?: AppSidebarPrimaryAction[];
  className?: string;
};

const defaultActions: AppSidebarPrimaryAction[] = [
  {
    id: "new",
    label: "New",
    icon: AppSidebarPlusIcon,
    commandIds: ["workspace.openNewContent"],
    hints: [],
  },
  {
    id: "search",
    label: "Search",
    icon: AppSidebarSearchIcon,
    commandIds: ["workspace.openPalette", "workspace.openExtendedSearch"],
    hints: [],
  },
  {
    id: "explore",
    label: "Explore",
    icon: AppSidebarExploreIcon,
    commandIds: ["workspace.openExplore"],
    hints: [],
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: AppSidebarCalendarIcon,
    commandIds: ["workspace.navigateToday"],
    hints: [],
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: AppSidebarTaskIcon,
    commandIds: ["workspace.createTask"],
    hints: [],
  },
];

function useIsMac() {
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform));
  }, []);

  return isMac;
}

function useShortcutPlatform(): ShortcutPlatform {
  return useIsMac() ? "mac" : "windows";
}

function AppSidebarShortcut({ shortcut }: { shortcut: string }) {
  const t = useTranslations("workspace.primaryNavigation");
  const platform = useShortcutPlatform();
  const keys = shortcut.split(/\s+or\s+/i);
  const keyOccurrences = new Map<string, number>();
  const keyedKeys = keys.map((key) => {
    const occurrence = (keyOccurrences.get(key) ?? 0) + 1;
    keyOccurrences.set(key, occurrence);
    return { id: `${key}-${occurrence}`, value: key };
  });

  return (
    <KbdGroup className="flex-wrap">
      {keyedKeys.map(({ id, value }) =>
        value === "or" ? (
          <span key={id} className="px-0.5 text-xs text-muted-foreground">
            {t("or")}
          </span>
        ) : (
          <Kbd key={id}>{formatShortcutChord(value, platform)}</Kbd>
        ),
      )}
    </KbdGroup>
  );
}

function useSidebarPrimaryCommandHints() {
  const t = useTranslations("workspace");
  const runtime = React.useMemo(
    () =>
      createWorkspaceCommandRuntime({
        locale: "workspace",
        t,
        actions: {
          openPalette: () => undefined,
          openNewContent: () => undefined,
          openExtendedSearch: () => undefined,
          openExplore: () => undefined,
          navigateToday: () => undefined,
          createTask: () => undefined,
        },
        state: {
          canCreateTask: true,
          canNavigateToday: true,
          canUseExtendedSearch: true,
        },
      }),
    [t],
  );
  const commands = React.useMemo(
    () => new Map(projectWorkspaceCommands(runtime).map((command) => [command.id, command])),
    [runtime],
  );

  return React.useCallback(
    (commandIds: readonly WorkspaceCommandId[]) =>
      commandIds.flatMap((id) => {
        const command = commands.get(id);
        if (!command) return [];
        return [
          {
            description: command.description,
            shortcut: command.shortcuts.join(" or ") || undefined,
          },
        ];
      }),
    [commands],
  );
}

function AppSidebarPrimaryActionHintContent({
  hints,
}: {
  hints: AppSidebarPrimaryActionHint[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {hints.map((hint) => (
        <div key={hint.description} className="flex flex-col gap-1.5">
          <p>{hint.description}</p>
          {hint.shortcut && <AppSidebarShortcut shortcut={hint.shortcut} />}
        </div>
      ))}
    </div>
  );
}

function AppSidebarPrimaryActionItem({
  action,
  active,
  objectTypes,
  onAction,
  onSelectObjectType,
}: {
  action: AppSidebarPrimaryAction;
  active: boolean;
  objectTypes: readonly AppSidebarObjectType[];
  onAction?: (action: AppSidebarPrimaryActionId) => void;
  onSelectObjectType?: (objectTypeId: string, objectTypeLabel?: string) => void;
}) {
  const isMobile = useIsMobile();
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = React.useState(false);
  const Icon = action.icon;

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  if (action.id === "new") {
    return (
      <NewContentMenu
        action={action}
        objectTypes={objectTypes}
        onSelectObjectType={onSelectObjectType}
      />
    );
  }

  function clearTimer() {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function scheduleOpen() {
    if (isMobile) return;

    clearTimer();
    timerRef.current = setTimeout(() => {
      setOpen(true);
      timerRef.current = null;
    }, 200);
  }

  function closeHint() {
    clearTimer();
    setOpen(false);
  }

  return (
    <div
      data-slot="app-sidebar-primary-action"
      className="w-full"
      onPointerEnter={scheduleOpen}
      onPointerLeave={closeHint}
    >
      <HoverCard open={open && !isMobile}>
        <HoverCardTrigger render={<span className="block w-full" />}>
          <Button
            type="button"
            variant="ghost"
            size="default"
            data-active={active || undefined}
            className={cn(
              "group/interactive h-8 w-full justify-start gap-x-1.5 px-2 font-normal",
              "text-sm text-muted-foreground",
              workspaceRowStateClass,
              "[&_svg]:size-4",
            )}
            onPointerDown={() => {
              closeHint();
              if (action.id !== "new") onAction?.(action.id);
            }}
            onClick={() => {
              closeHint();
              onAction?.(action.id);
            }}
          >
            <Icon data-icon="inline-start" />
            <span className="min-w-0 truncate">{action.label}</span>
          </Button>
        </HoverCardTrigger>

        <HoverCardContent
          side="right"
          align="center"
          sideOffset={8}
          className="pointer-events-none w-max max-w-56 text-sm leading-snug"
        >
          <AppSidebarPrimaryActionHintContent hints={action.hints} />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

function AppSidebarPrimaryActions({
  activeAction,
  onAction,
  onSelectObjectType,
  objectTypes = [],
  actions = defaultActions,
  className,
}: AppSidebarPrimaryActionsProps) {
  const t = useTranslations("workspace.primaryNavigation");
  const commandHints = useSidebarPrimaryCommandHints();
  const visibleActions =
    actions === defaultActions
      ? actions.map((action) => {
          const labels = {
            new: t("new"),
            search: t("search"),
            explore: t("explore"),
            calendar: t("calendar"),
            tasks: t("tasks"),
          } satisfies Record<AppSidebarPrimaryActionId, string>;
          const descriptions: Record<AppSidebarPrimaryActionId, string[]> = {
            new: [t("new")],
            search: [t("searchHint"), t("extendedSearchHint")],
            explore: [t("exploreHint"), t("exploreSideHint")],
            calendar: [t("calendarHint")],
            tasks: [t("tasksHint")],
          };
          return {
            ...action,
            label: labels[action.id],
            hints: commandHints(action.commandIds).map((hint, index) => ({
              ...hint,
              description: descriptions[action.id][index] ?? hint.description,
            })),
          };
        })
      : actions;
  return (
    <nav
      data-slot="app-sidebar-primary-actions"
      aria-label={t("navigationLabel")}
      className={cn("flex w-full flex-col", className)}
    >
      {visibleActions.map((action) => (
        <AppSidebarPrimaryActionItem
          key={action.id}
          action={action}
          active={action.id !== "new" && action.id === activeAction}
          objectTypes={objectTypes}
          onAction={onAction}
          onSelectObjectType={onSelectObjectType}
        />
      ))}
    </nav>
  );
}

function WorkspaceSidebar() {
  const t = useTranslations("workspace");
  const {
    spaces,
    setSpaces,
    spaceId,
    createSpace,
    deleteSpace,
    renameSpace,
    switchSpace,
    activeAction,
    setActiveAction,
    activeEntityId,
    setActiveEntityId,
    setMainTabs,
    setMainValue,
    selectEntity,
    pinnedEntities,
    availablePinnedEntities,
    objectTypes,
    objectTypeCollections,
    createdEntities,
    customSections,
    setPinnedEntities,
    setCommandPaletteOpen,
    createWorkspaceStructureFromPreset,
    createWorkspaceStructure,
    updateWorkspaceStructure,
    deleteWorkspaceStructure,
    setObjectTypeCollections,
    setCustomSections,
    setSideSearchOpen,
    setSideValue,
    openInSidePanel,
    createWorkspaceEntity,
    showMessage,
  } = useWorkspace();
  const [hiddenCollectionIds, setHiddenCollectionIds] = React.useState<
    Set<string>
  >(() => new Set());

  const visibleObjectTypeCollections = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(objectTypeCollections).filter(
          ([collectionId]) => !hiddenCollectionIds.has(collectionId),
        ),
      ),
    [hiddenCollectionIds, objectTypeCollections],
  );

  function handleCollectionAction(
    action: AppSidebarCollectionAction,
    objectType: AppSidebarObjectType,
    collection: WorkspaceCollectionRecord,
  ) {
    const collectionId = collection.id;

    if (action === "open") {
      const tabId = `object-type-item:collection:${collectionId}`;
      setMainTabs((current) =>
        current.some((item) => item.id === tabId)
          ? current
          : [
              ...current,
              {
                id: tabId,
                label: collection.name,
                icon: ObjectCollectionIcon,
                iconClassName: objectIconToneBadgeClass.gray,
                draggable: true,
              },
            ],
      );
      setActiveAction(undefined);
      setMainValue(tabId);
      setActiveEntityId(tabId);
      return;
    }

    if (action === "create" || action === "template") {
      createWorkspaceEntity(objectType.id, objectType.label);
      if (action === "template") {
        showMessage(t("objectTypeOverview.templateCreated"));
      }
      return;
    }

    if (action === "pin") {
      setPinnedEntities((current) =>
        current.some((item) => item.id === collectionId)
          ? current
          : [
              ...current,
              {
                id: collectionId,
                label: collection.name,
                icon: ObjectCollectionIcon,
                tone: "gray",
              },
            ],
      );
      showMessage(t("objectTypeOverview.pinnedToSidebar"));
      return;
    }

    if (action === "unpin-type") {
      setHiddenCollectionIds((current) => new Set(current).add(collectionId));
      setActiveEntityId(objectType.id);
      showMessage(t("objectTypeOverview.unpinnedFromSidebar"));
      return;
    }

    if (action === "settings") {
      selectEntity(objectType.id);
      showMessage(t("objectTypeOverview.settingsDescription"));
      return;
    }

    if (action === "share") {
      void navigator.clipboard
        ?.writeText(collection.name)
        .catch(() => undefined);
      showMessage(t("documentMenu.shareHint"));
      return;
    }

    if (action === "import") {
      selectEntity(objectType.id);
      window.setTimeout(() => {
        document.getElementById(`object-type-import-${objectType.id}`)?.click();
      }, 0);
      return;
    }

    if (action === "duplicate") {
      setObjectTypeCollections((current) => {
        const existing = Object.values(current).filter(
          (item) => item.structureId === objectType.id,
        );
        let suffix = 1;
        let copy = `${collection.name} copy`;
        while (existing.some((item) => item.name === copy)) {
          suffix += 1;
          copy = `${collection.name} copy ${suffix}`;
        }
        const id = createCollectionId(
          objectType.id,
          copy,
          new Set(Object.keys(current)),
        );
        return {
          ...current,
          [id]: { id, name: copy, structureId: objectType.id },
        };
      });
      showMessage(t("objectTypeOverview.collectionCreated"));
      return;
    }

    if (
      createdEntities.some(
        (entity) =>
          "collections" in entity && entity.collections.includes(collectionId),
      )
    ) {
      showMessage(t("lifecycle.errors.referenced-object"));
      return;
    }

    setObjectTypeCollections((current) => ({
      ...Object.fromEntries(
        Object.entries(current).filter(([id]) => id !== collectionId),
      ),
    }));
    setPinnedEntities((current) =>
      current.filter((item) => item.id !== collectionId),
    );
    setActiveEntityId(objectType.id);
  }

  function openCommandPaletteFromSidebar() {
    setSideSearchOpen(false);
    window.setTimeout(() => setCommandPaletteOpen(true), 0);
  }

  return (
    <TooltipProvider delay={200}>
      <AppSidebar
        spaces={spaces}
        value={spaceId}
        onValueChange={switchSpace}
        onReorder={setSpaces}
        onCreateSpace={createSpace}
        onDeleteSpace={deleteSpace}
        onRenameSpace={renameSpace}
        labels={{
          changeSpace: t("spaces.changeSpace"),
          clearSearch: t("spaces.clearSearch"),
          createSpace: t("spaces.createSpace"),
          createSpaceSubmit: t("spaces.createSpaceSubmit"),
          createSpaceTitle: t("spaces.createSpace"),
          deleteSpace: t("spaces.deleteSpace"),
          deleteSpaceConfirmation: t("spaces.deleteSpaceConfirmation", {
            name: "{name}",
          }),
          deleteSpaceDescription: t("spaces.deleteSpaceDescription"),
          deleteSpaceError: t("spaces.deleteSpaceError"),
          empty: t("spaces.empty"),
          nameSpace: t("spaces.name"),
          renameSpace: t("spaces.renameSpace"),
          saveSpace: t("spaces.save"),
          search: t("spaces.search"),
          spaceSettings: t("spaces.settings"),
          spaceSettingsDescription: t("spaces.settingsDescription"),
        }}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="my-px mt-0 shrink-0 px-2 pr-1 pb-1.5">
            <AppSidebarPrimaryActions
              activeAction={activeAction}
              objectTypes={objectTypes}
              onSelectObjectType={createWorkspaceEntity}
              onAction={(action) => {
                if (action === "search") {
                  openCommandPaletteFromSidebar();
                  return;
                }
                setCommandPaletteOpen(false);
                setSideSearchOpen(false);
                if (action !== "new") {
                  setActiveAction(action);
                  setActiveEntityId(null);
                  setMainValue(`primary-action:${action}`);
                  if (action === "explore") setSideValue("explore");
                }
              }}
            />
          </div>

          <AppSidebarOverview
            activeId={activeEntityId}
            onActiveIdChange={(id) => {
              if (id !== null) {
                setSideSearchOpen(false);
                selectEntity(id);
              }
            }}
            pinnedEntities={pinnedEntities}
            availablePinnedEntities={availablePinnedEntities}
            objectTypes={objectTypes}
            objectTypeCollections={visibleObjectTypeCollections}
            customSections={customSections}
            onCreateObjectTypeFromPreset={createWorkspaceStructureFromPreset}
            onCreateObjectType={createWorkspaceStructure}
            onUpdateObjectType={updateWorkspaceStructure}
            onDeleteObjectType={deleteWorkspaceStructure}
            onPinnedEntitiesChange={setPinnedEntities}
            onOpenPinnedInSidePanel={(entity) => {
              openInSidePanel({
                id: entity.id,
                label: entity.label,
                icon: entity.icon,
                iconClassName: objectIconToneBadgeClass[entity.tone],
                draggable: true,
              });
            }}
            onCustomSectionsChange={setCustomSections}
            onCollectionAction={handleCollectionAction}
          />
        </div>
      </AppSidebar>
    </TooltipProvider>
  );
}

export {
  type AppSidebarPrimaryAction,
  type AppSidebarPrimaryActionHint,
  type AppSidebarPrimaryActionId,
  AppSidebarPrimaryActions,
  type AppSidebarPrimaryActionsProps,
  type AppSidebarPrimaryNavigationAction,
  type AppSidebarShortcut,
  defaultActions,
  WorkspaceSidebar,
};
