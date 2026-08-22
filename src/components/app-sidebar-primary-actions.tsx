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
} from "@/components/app-sidebar-icons";
import {
  type AppSidebarCollectionAction,
  type AppSidebarObjectType,
  AppSidebarOverview,
  appSidebarCollectionId,
} from "@/components/app-sidebar-overview";
import {
  ObjectCollectionIcon,
  ObjectIconBadge,
} from "@/components/object-icons";
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

type AppSidebarPrimaryActionId = "new" | "search" | "explore" | "calendar";

type AppSidebarPrimaryNavigationAction = Exclude<
  AppSidebarPrimaryActionId,
  "new"
>;

type AppSidebarShortcut = {
  windows: string[];
  mac: string[];
};

type AppSidebarPrimaryActionHint = {
  description: string;
  shortcut?: AppSidebarShortcut;
};

function normalizeMenuQuery(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
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
  const normalizedQuery = normalizeMenuQuery(query.trim());
  const localizedItems = objectTypes;
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
    label: "Novo",
    icon: AppSidebarPlusIcon,
    hints: [
      {
        description: "Novo",
        shortcut: {
          windows: ["Ctrl", "U"],
          mac: ["⌘", "U"],
        },
      },
    ],
  },
  {
    id: "search",
    label: "Buscar",
    icon: AppSidebarSearchIcon,
    hints: [
      {
        description: "Buscar",
        shortcut: {
          windows: ["Ctrl", "P", "or", "Ctrl", "K"],
          mac: ["⌘", "P", "or", "⌘", "K"],
        },
      },
      {
        description: "Abrir busca estendida",
        shortcut: {
          windows: ["Ctrl", "⇧", "P"],
          mac: ["⌘", "⇧", "P"],
        },
      },
    ],
  },
  {
    id: "explore",
    label: "Explorar",
    icon: AppSidebarExploreIcon,
    hints: [
      {
        description:
          "Abrir Explorar. Use o atalho novamente para iniciar um novo chat.",
        shortcut: {
          windows: ["Ctrl", "J"],
          mac: ["⌘", "J"],
        },
      },
      {
        description: "Abrir Explorar no painel lateral",
        shortcut: {
          windows: ["Ctrl", "⇧", "J"],
          mac: ["⇧", "⌘", "J"],
        },
      },
    ],
  },
  {
    id: "calendar",
    label: "Calendário",
    icon: AppSidebarCalendarIcon,
    hints: [
      {
        description:
          "Ir para o Calendário. Clique duas vezes para ir para hoje.",
        shortcut: {
          windows: ["Ctrl", "Alt", "H"],
          mac: ["⌃", "⌘", "H"],
        },
      },
    ],
  },
];

function useIsMac() {
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform));
  }, []);

  return isMac;
}

function AppSidebarShortcut({ shortcut }: { shortcut: AppSidebarShortcut }) {
  const t = useTranslations("workspace.primaryNavigation");
  const isMac = useIsMac();
  const keys = isMac ? shortcut.mac : shortcut.windows;
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
          <Kbd key={id}>{value}</Kbd>
        ),
      )}
    </KbdGroup>
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
            onPointerDown={closeHint}
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
  const visibleActions =
    actions === defaultActions
      ? actions.map((action) => {
          const labels = {
            new: t("new"),
            search: t("search"),
            explore: t("explore"),
            calendar: t("calendar"),
          } satisfies Record<AppSidebarPrimaryActionId, string>;
          const descriptions: Record<AppSidebarPrimaryActionId, string[]> = {
            new: [t("new")],
            search: [t("searchHint"), t("extendedSearchHint")],
            explore: [t("exploreHint"), t("exploreSideHint")],
            calendar: [t("calendarHint")],
          };
          return {
            ...action,
            label: labels[action.id],
            hints: action.hints.map((hint, index) => ({
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
    setSpaceId,
    activeAction,
    setActiveAction,
    activeEntityId,
    setActiveEntityId,
    selectEntity,
    pinnedEntities,
    availablePinnedEntities,
    objectTypes,
    objectTypeCollections,
    customSections,
    setPinnedEntities,
    createWorkspaceStructureFromPreset,
    createWorkspaceStructure,
    updateWorkspaceStructure,
    deleteWorkspaceStructure,
    setObjectTypeCollections,
    setCustomSections,
    setSideSearchOpen,
    setSideValue,
    createWorkspaceEntity,
    showMessage,
  } = useWorkspace();
  const [hiddenCollectionIds, setHiddenCollectionIds] = React.useState<
    Set<string>
  >(() => new Set());

  const visibleObjectTypeCollections = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(objectTypeCollections).map(
          ([objectTypeId, collections]) => [
            objectTypeId,
            collections.filter(
              (collection) =>
                !hiddenCollectionIds.has(
                  appSidebarCollectionId(objectTypeId, collection),
                ),
            ),
          ],
        ),
      ),
    [hiddenCollectionIds, objectTypeCollections],
  );

  function handleCollectionAction(
    action: AppSidebarCollectionAction,
    objectType: AppSidebarObjectType,
    collection: string,
  ) {
    const collectionId = appSidebarCollectionId(objectType.id, collection);

    if (action === "open") {
      selectEntity(objectType.id);
      setActiveEntityId(collectionId);
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
                label: collection,
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
      void navigator.clipboard?.writeText(collection);
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
        const existing = current[objectType.id] ?? [];
        let suffix = 1;
        let copy = `${collection} copy`;
        while (existing.includes(copy)) {
          suffix += 1;
          copy = `${collection} copy ${suffix}`;
        }
        return { ...current, [objectType.id]: [...existing, copy] };
      });
      showMessage(t("objectTypeOverview.collectionCreated"));
      return;
    }

    setObjectTypeCollections((current) => ({
      ...current,
      [objectType.id]: (current[objectType.id] ?? []).filter(
        (item) => item !== collection,
      ),
    }));
    setPinnedEntities((current) =>
      current.filter((item) => item.id !== collectionId),
    );
    setActiveEntityId(objectType.id);
  }

  return (
    <TooltipProvider delay={200}>
      <AppSidebar
        spaces={spaces}
        value={spaceId}
        onValueChange={setSpaceId}
        onReorder={setSpaces}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="my-px mt-0 shrink-0 px-2 pr-1 pb-1.5">
            <AppSidebarPrimaryActions
              activeAction={activeAction}
              objectTypes={objectTypes}
              onSelectObjectType={createWorkspaceEntity}
              onAction={(action) => {
                if (action !== "new") {
                  setActiveAction(action);
                  setActiveEntityId(null);
                  if (action === "search") setSideSearchOpen(true);
                  if (action === "explore") setSideValue("explore");
                }
              }}
            />
          </div>

          <AppSidebarOverview
            activeId={activeEntityId}
            onActiveIdChange={(id) => {
              if (id !== null) selectEntity(id);
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
