"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  AppSidebarArrowDownIcon,
  AppSidebarArrowUpIcon,
  AppSidebarCalendarIcon,
  AppSidebarChevronRightIcon,
  AppSidebarCornerDownLeftIcon,
  AppSidebarExploreIcon,
  AppSidebarPlusIcon,
  AppSidebarSearchIcon,
} from "@/components/app-sidebar-icons";
import { AppSidebarOverview } from "@/components/app-sidebar-overview";
import { useWorkspace } from "@/components/workspace-controller";
import {
  ObjectIconBadge,
  objectTypeDefinitionById,
} from "@/components/object-icons";
import { Button } from "@/components/ui/button";
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
import { TooltipProvider } from "@/components/ui/tooltip";
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

const newContentItems = [
  { label: "Nota atômica", objectTypeId: "atomic-note" },
  { label: "Citação", objectTypeId: "quote" },
  { label: "Página", objectTypeId: "page" },
  { label: "Tabela", objectTypeId: "table" },
  { label: "Tarefa", objectTypeId: "task" },
  { label: "Imagem", objectTypeId: "image" },
  { label: "Weblink", objectTypeId: "weblink" },
  { label: "Tweet", objectTypeId: "tweet" },
  { label: "PDF", objectTypeId: "pdf" },
  { label: "Áudio", objectTypeId: "audio" },
  { label: "Arquivo", objectTypeId: "file" },
  { label: "Etiqueta", objectTypeId: "tag" },
  { label: "Query", objectTypeId: "query" },
];

function normalizeMenuQuery(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

function NewContentMenu({
  action,
  onSelectObjectType,
}: {
  action: AppSidebarPrimaryAction;
  onSelectObjectType?: (objectTypeId: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const optionRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const Icon = action.icon;
  const normalizedQuery = normalizeMenuQuery(query.trim());
  const items = React.useMemo(
    () =>
      newContentItems.filter((item) =>
        normalizeMenuQuery(item.label).includes(normalizedQuery),
      ),
    [normalizedQuery],
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
    onSelectObjectType?.(objectTypeId);
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
      setActiveIndex((current) =>
        (current + direction + items.length) % items.length,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const activeItem = items[activeIndex];
      if (activeItem) selectItem(activeItem.objectTypeId);
    }
  }

  React.useEffect(() => {
    const activeItem = items[activeIndex];
    if (!open || !activeItem) return;
    optionRefs.current
      .get(activeItem.objectTypeId)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, items, open]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
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
        className="box-content h-[361px] w-[22rem] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden rounded-[12px] border-[oklch(0.9163_0.0017_67.07)] bg-popover p-0 shadow-[0_3px_5px_rgb(0_0_0/0.01),0_5px_10px_rgb(0_0_0/0.02),0_10px_14px_rgb(0_0_0/0.01)] ring-0"
      >
        <div className="h-11 shrink-0 p-1.5">
          <div className="flex h-8 items-center rounded-[8px] bg-[oklch(0.9676_0.0016_67.02)] px-[9px]">
            <Input
              value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
              onKeyDown={handleInputKeyDown}
              placeholder="Buscar"
              aria-label="Buscar tipo de conteúdo"
              aria-controls="new-content-menu-listbox"
              aria-activedescendant={
                items[activeIndex]
                  ? `new-content-option-${items[activeIndex].objectTypeId}`
                  : undefined
              }
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              className="h-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              autoFocus
            />
          </div>
        </div>

        <div
          id="new-content-menu-listbox"
          role="listbox"
          aria-label="Tipos de conteúdo"
          className="h-72 min-h-0 shrink-0 overflow-y-auto px-1.5"
        >
          {items.map(({ label, objectTypeId }, index) => {
            const definition = objectTypeDefinitionById[objectTypeId];
            if (!definition) return null;
            const Icon = definition.icon;

            return (
              <button
                key={label}
                ref={(node) => {
                  if (node) optionRefs.current.set(objectTypeId, node);
                  else optionRefs.current.delete(objectTypeId);
                }}
                id={`new-content-option-${objectTypeId}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                tabIndex={-1}
                data-active={index === activeIndex || undefined}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => selectItem(objectTypeId)}
                className="flex h-8 w-full items-center gap-2 rounded-[8px] px-1 text-left text-sm font-normal outline-none hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent"
              >
                <ObjectIconBadge
                  icon={Icon}
                  tone={definition.tone}
                  variant="menu"
                />
                <span className="truncate">{label}</span>
                <AppSidebarChevronRightIcon className="ml-auto size-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        <div className="mx-1 flex h-[29px] shrink-0 items-center gap-x-3 border-t border-border px-1 py-1.5 text-xs leading-4 text-muted-foreground">
          <span>
            <Kbd>
              <AppSidebarArrowUpIcon />
            </Kbd>
            <Kbd>
              <AppSidebarArrowDownIcon />
            </Kbd>{" "}
            para navegar
          </span>
          <span>
            <Kbd>Esc</Kbd> para abortar
          </span>
          <span>
            <Kbd>
              <AppSidebarCornerDownLeftIcon />
            </Kbd>{" "}
            para selecionar
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
  onSelectObjectType?: (objectTypeId: string) => void;
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
  const isMac = useIsMac();
  const keys = isMac ? shortcut.mac : shortcut.windows;

  return (
    <KbdGroup className="flex-wrap">
      {keys.map((key, index) =>
        key === "or" ? (
          <span
            key={`${key}-${index}`}
            className="px-0.5 text-xs text-muted-foreground"
          >
            ou
          </span>
        ) : (
          <Kbd key={`${key}-${index}`}>{key}</Kbd>
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
      {hints.map((hint, index) => (
        <div key={index} className="flex flex-col gap-1.5">
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
  onAction,
  onSelectObjectType,
}: {
  action: AppSidebarPrimaryAction;
  active: boolean;
  onAction?: (action: AppSidebarPrimaryActionId) => void;
  onSelectObjectType?: (objectTypeId: string) => void;
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
              "h-8 w-full justify-start gap-x-1.5 px-2 font-normal",
              "text-sm text-muted-foreground",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "[&_svg]:size-4",
              "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
              "data-[active=true]:brightness-[0.965] data-[active=true]:hover:bg-sidebar-accent",
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
  actions = defaultActions,
  className,
}: AppSidebarPrimaryActionsProps) {
  return (
    <nav
      data-slot="app-sidebar-primary-actions"
      aria-label="Primary navigation"
      className={cn("flex w-full flex-col", className)}
    >
      {actions.map((action) => (
        <AppSidebarPrimaryActionItem
          key={action.id}
          action={action}
          active={action.id !== "new" && action.id === activeAction}
          onAction={onAction}
          onSelectObjectType={onSelectObjectType}
        />
      ))}
    </nav>
  );
}

function WorkspaceSidebar() {
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
    customSections,
    setPinnedEntities,
    setObjectTypes,
    setCustomSections,
    setSideSearchOpen,
    setSideValue,
    createWorkspaceEntity,
  } = useWorkspace();

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
            customSections={customSections}
            onPinnedEntitiesChange={setPinnedEntities}
            onObjectTypesChange={setObjectTypes}
            onCustomSectionsChange={setCustomSections}
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
  WorkspaceSidebar,
  type AppSidebarPrimaryActionsProps,
  type AppSidebarPrimaryNavigationAction,
  type AppSidebarShortcut,
  defaultActions,
};
