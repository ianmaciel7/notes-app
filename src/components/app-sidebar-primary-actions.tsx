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
import { useWorkspace } from "@/components/space-controller";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CompactMenuItemText,
  compactMenuItemClass,
  compactMenuSearchClass,
  compactMenuSurfaceClass,
} from "@/components/ui/compact-menu";
import { Input } from "@/components/ui/input";
import type { InteractionTooltipConfig } from "@/components/ui/interaction-hint";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { objectLifecycleContractSlots } from "@/lib/object-lifecycle-contracts";
import { cn } from "@/lib/utils";

const workspaceRowStateClass =
  "transition-[background-color,color,filter,opacity] duration-200 ease-out motion-reduce:transition-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-foreground data-[active=true]:brightness-[0.965]";

import {
  createWorkspaceCommandRuntime,
  projectWorkspaceCommands,
  type WorkspaceCommandId,
} from "@/lib/space-command-registry";
import { createCollectionId, type WorkspaceCollectionRecord } from "@/lib/space-domain-identities";
import { formatShortcutAriaChord, type ShortcutPlatform } from "@/lib/space-shortcuts";
import {
  recordSidebarNavigationTrace,
  sidebarNavigationTraceEnabled,
} from "@/lib/sidebar-navigation-trace";

type AppSidebarPrimaryActionId = "new" | "search" | "explore" | "calendar" | "tasks";

type AppSidebarPrimaryNavigationAction = Exclude<AppSidebarPrimaryActionId, "new"> | "trash";

type AppSidebarShortcut = string;

type AppSidebarPrimaryActionHint = {
  description: string;
  shortcut?: string;
};

type NewContentMenuItem = AppSidebarObjectType & {
  objectTypeId: string;
  createTitle?: string;
  badgeLabel?: string;
  isCreateFallback?: boolean;
  hasChevron?: boolean;
  searchLabels?: string[];
};

type NewContentDialogKind = "file" | "query" | "task" | "url";

type NewContentDialogConfig = {
  actionLabel: string;
  description: string;
  kind: NewContentDialogKind;
  linkPlaceholder?: string;
  title: string;
};

type SidebarNavigationIntent = "current" | "new-tab" | "side-panel";

type SidebarModifierEvent = {
  readonly __sidebarNavigationIntent?: SidebarNavigationIntent;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
  readonly shiftKey?: boolean;
};

type SidebarMainTab = {
  readonly id: string;
  readonly label: string;
  readonly draggable?: boolean;
  readonly [key: string]: unknown;
};

type SidebarMainTabUpdateInput = {
  readonly currentTabs: readonly SidebarMainTab[];
  readonly intent: Exclude<SidebarNavigationIntent, "side-panel">;
  readonly mainValue: string;
  readonly newTabId?: string;
  readonly nextTab: SidebarMainTab;
};

function shouldLogSidebarNavigation() {
  return sidebarNavigationTraceEnabled();
}

function logSidebarNavigation(label: string, details: Record<string, unknown>) {
  recordSidebarNavigationTrace("sidebar-navigation", label, details);
  if (!shouldLogSidebarNavigation()) return;
  console.info(`[sidebar-navigation] ${label}`, details);
}

function getObjectIconToneClass(tone: unknown) {
  return typeof tone === "string" && tone in objectIconToneBadgeClass
    ? objectIconToneBadgeClass[tone as keyof typeof objectIconToneBadgeClass]
    : undefined;
}

function getSidebarNavigationIntent(event?: SidebarModifierEvent): SidebarNavigationIntent {
  if (event?.__sidebarNavigationIntent) return event.__sidebarNavigationIntent;
  if (event?.shiftKey) return "side-panel";
  if (event?.ctrlKey || event?.metaKey) return "new-tab";
  return "current";
}

function createSidebarMainTabUpdate({
  currentTabs,
  intent,
  mainValue,
  newTabId,
  nextTab,
}: SidebarMainTabUpdateInput) {
  const tab = { ...nextTab, draggable: true };

  if (intent === "new-tab") {
    const tabId = newTabId ?? `${tab.id}:${Date.now()}`;
    logSidebarNavigation("create-new-tab", {
      baseTabId: tab.id,
      mainValue,
      newTabId: tabId,
      tabCountBefore: currentTabs.length,
    });
    return {
      mainValue: tabId,
      tabs: [...currentTabs, { ...tab, id: tabId }],
    };
  }

  if (currentTabs.some((item) => item.id === tab.id)) {
    return {
      mainValue: tab.id,
      tabs: currentTabs.map((item) => (item.id === tab.id ? { ...item, ...tab } : item)),
    };
  }

  const activeIndex = currentTabs.findIndex((item) => item.id === mainValue);
  if (activeIndex >= 0) {
    return {
      mainValue: tab.id,
      tabs: currentTabs.map((item, index) => (index === activeIndex ? tab : item)),
    };
  }

  return {
    mainValue: tab.id,
    tabs: currentTabs.length > 0 ? [tab, ...currentTabs.slice(1)] : [tab],
  };
}

function NewContentUploadFileIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 3.75h6.25L18 8.5v11.75H7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 3"
      />
      <path
        d="M13.25 3.75V8.5H18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NewContentFolderIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3.75 7.25h5.1l1.65 2h9.75v8.9a1.6 1.6 0 0 1-1.6 1.6H5.35a1.6 1.6 0 0 1-1.6-1.6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.75 9.25V6.85a1.6 1.6 0 0 1 1.6-1.6h3.1l1.7 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const newContentDialogObjectTypes = new Set([
  "file",
  "image",
  "pdf",
  "task",
  "tweet",
  "weblink",
]);

function getNewContentDialogConfig(item: NewContentMenuItem): NewContentDialogConfig {
  if (item.objectTypeId === "query") {
    return {
      actionLabel: "Criar query",
      description: "Defina filtros para criar uma query salva.",
      kind: "query",
      title: "Adicionar Query",
    };
  }

  if (item.objectTypeId === "task") {
    return {
      actionLabel: "Criar tarefa",
      description: "Digite o titulo da tarefa antes de criar.",
      kind: "task",
      title: "Adicionar Tarefa",
    };
  }

  if (item.objectTypeId === "tweet") {
    return {
      actionLabel: "Adicionar Tweet",
      description: "Cole o link de um Tweet/X para criar o objeto.",
      kind: "url",
      linkPlaceholder: "https://x.com/...",
      title: "Adicionar Tweet",
    };
  }

  if (item.objectTypeId === "weblink") {
    return {
      actionLabel: "Adicionar link",
      description: "Cole uma URL para criar o Weblink.",
      kind: "url",
      linkPlaceholder: "https://example.com",
      title: "Adicionar Weblink",
    };
  }

  if (item.objectTypeId === "pdf") {
    return {
      actionLabel: "Selecionar arquivo(s)",
      description: "Selecione um ou varios arquivos. O limite maximo de tamanho total dos arquivos e 10 GB.",
      kind: "file",
      linkPlaceholder: "https://example.com/file.pdf",
      title: "Adicionar PDF",
    };
  }

  if (item.objectTypeId === "image") {
    return {
      actionLabel: "Selecionar arquivo(s)",
      description: "Selecione uma ou varias imagens. O limite maximo de tamanho total dos arquivos e 10 GB.",
      kind: "file",
      linkPlaceholder: "https://example.com/image.png",
      title: "Adicionar Imagem",
    };
  }

  return {
    actionLabel: "Selecionar arquivo(s)",
    description: "Selecione um ou varios arquivos. O limite maximo de tamanho total dos arquivos e 10 GB.",
    kind: "file",
    linkPlaceholder: "https://example.com/file",
    title: "Adicionar Arquivo",
  };
}

function NewContentCreationDialog({
  item,
  onOpenChange,
}: {
  item: NewContentMenuItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  const config = item ? getNewContentDialogConfig(item) : null;
  const [mode, setMode] = React.useState<"upload" | "link">("upload");

  React.useEffect(() => {
    if (item) setMode("upload");
  }, [item]);

  return (
    <Dialog open={Boolean(item)} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex !max-w-[calc(100vw-3rem)] max-w-none flex-col gap-0 overflow-hidden rounded-[6px] border-border bg-card p-0 shadow-[0_16px_48px_rgb(0_0_0/0.22)] sm:!max-w-none",
          config?.kind === "task"
            ? "!w-[min(42rem,calc(100vw-3rem))] min-h-[154px]"
            : "!h-[min(49rem,calc(100dvh-5rem))] !w-[min(64rem,calc(100vw-3rem))]",
        )}
      >
        {config && (
          <>
            {config.kind === "task" ? (
              <div className="flex min-h-[154px] flex-col justify-between p-4">
                <DialogHeader className="sr-only">
                  <DialogTitle>{config.title}</DialogTitle>
                  <DialogDescription>{config.description}</DialogDescription>
                </DialogHeader>
                <Input placeholder="Adicionar tarefa" autoFocus />
                <div className="flex items-center justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                    Cancelar
                  </Button>
                  <Button type="button" variant="outline">
                    Abrir
                  </Button>
                  <Button type="button">Adicionar tarefa</Button>
                </div>
              </div>
            ) : (
              <DialogHeader className="shrink-0 gap-0 px-3 pt-4 pb-0 text-left">
                <DialogTitle className="text-[1.55rem] font-semibold leading-8 tracking-[-0.03em] text-foreground">
                  {config.title}
                </DialogTitle>
                <DialogDescription className="sr-only">{config.description}</DialogDescription>
              </DialogHeader>
            )}

            {config.kind === "file" && (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex h-[54px] shrink-0 items-center gap-2 px-3">
                  <Button
                    type="button"
                    variant={mode === "upload" ? "secondary" : "ghost"}
                    className="h-9 rounded-[8px] px-3 text-sm"
                    onClick={() => setMode("upload")}
                  >
                    Carregar
                  </Button>
                  <Button
                    type="button"
                    variant={mode === "link" ? "secondary" : "ghost"}
                    className="h-9 rounded-[8px] px-3 text-sm"
                    onClick={() => setMode("link")}
                  >
                    Adicionar um link
                  </Button>
                  {item?.objectTypeId === "image" && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-9 rounded-[8px] px-3 text-sm"
                      >
                        Unsplash
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-9 rounded-[8px] px-3 text-sm"
                      >
                        Gerar
                      </Button>
                    </>
                  )}
                </div>
                {mode === "upload" ? (
                  <>
                    <div className="shrink-0 bg-muted/40 px-5 py-3 text-sm leading-5 text-foreground">
                      <p>{config.description}</p>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col px-3 pt-4 pb-5">
                      <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-[4px] border-2 border-dashed border-border bg-muted/20 text-center text-muted-foreground">
                        <NewContentUploadFileIcon className="mb-3 size-7 text-muted-foreground" />
                        <p className="text-sm">Arraste e solte</p>
                      </div>
                      <div className="mt-5 flex shrink-0 items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-8 gap-1.5 rounded-[6px] px-3"
                        >
                          <NewContentUploadFileIcon className="size-3.5" />
                          {config.actionLabel}
                        </Button>
                        <Button type="button" className="h-8 gap-1.5 rounded-[6px] px-3">
                          <NewContentFolderIcon className="size-3.5" />
                          Selecionar Pasta
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid gap-3 px-4 pt-4">
                    <Input
                      placeholder={config.linkPlaceholder}
                      className="text-foreground placeholder:text-muted-foreground placeholder:opacity-100"
                      autoFocus
                    />
                    <Button type="button" variant="secondary" className="w-fit">
                      Adicionar link
                    </Button>
                  </div>
                )}
              </div>
            )}

            {config.kind === "url" && (
              <div className="grid gap-3 px-4 pt-5">
                <Input
                  placeholder={config.linkPlaceholder}
                  className="text-foreground placeholder:text-muted-foreground placeholder:opacity-100"
                  autoFocus
                />
                <Button type="button" variant="secondary" className="w-fit">
                  {config.actionLabel}
                </Button>
              </div>
            )}

            {config.kind === "query" && (
              <div className="grid gap-3 px-4 pt-5">
                <Input placeholder="Filtrar objetos..." autoFocus />
                <Button type="button" className="w-fit">
                  {config.actionLabel}
                </Button>
              </div>
            )}

            {config.kind === "task" && null}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function normalizeMenuQuery(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

const newContentMenuBuiltinOrder = new Map(
  [
    "query",
    "task",
    "table",
    "tweet",
    "file",
    "audio",
    "pdf",
    "weblink",
    "image",
    "tag",
    "page",
  ].map((id, index) => [id, index]),
);

const newContentMenuExcludedTypes = new Set(["ai-chat", "daily-note"]);

function createNewContentMenuItems(
  objectTypes: readonly AppSidebarObjectType[],
  query: string,
): NewContentMenuItem[] {
  const normalizedQuery = normalizeMenuQuery(query.trim());
  const localizedItems = objectTypes
    .filter((item) => !newContentMenuExcludedTypes.has(item.id))
    .map((item, sourceIndex) => ({
      ...item,
      objectTypeId: item.id,
      hasChevron: true,
      label: item.singularLabel ?? item.label,
      searchLabels: [item.label, item.singularLabel, item.id].filter(
        (value): value is string => Boolean(value),
      ),
      sourceIndex,
    }))
    .sort((a, b) => {
      const aOrder = newContentMenuBuiltinOrder.get(a.id);
      const bOrder = newContentMenuBuiltinOrder.get(b.id);

      if (aOrder === undefined && bOrder === undefined) {
        return a.sourceIndex - b.sourceIndex;
      }

      if (aOrder === undefined) return -1;
      if (bOrder === undefined) return 1;
      return aOrder - bOrder;
    });
  const filteredItems = localizedItems.filter((item) =>
    item.searchLabels.some((value) =>
      normalizeMenuQuery(value ?? "").includes(normalizedQuery),
    ),
  );

  if (filteredItems.length > 0 || normalizedQuery.length === 0) {
    return filteredItems;
  }

  const pageType = localizedItems.find((item) => item.id === "page") ?? localizedItems[0];
  if (!pageType) return [];

  return [
    {
      ...pageType,
      id: "__create-page-from-query",
      objectTypeId: pageType.id,
      label: `Criar '${query.trim()}'`,
      createTitle: query.trim(),
      badgeLabel: pageType.label,
      isCreateFallback: true,
    },
  ];
}

function getActionAriaDescription(hints: readonly AppSidebarPrimaryActionHint[], label: string) {
  const descriptions = hints
    .map((hint) => hint.description.trim())
    .filter((description) => description.length > 0 && description !== label.trim());

  return descriptions.join("\n") || undefined;
}

function getActionShortcutChords(
  hints: readonly AppSidebarPrimaryActionHint[],
  platform: ShortcutPlatform,
) {
  return hints
    .flatMap((hint) => (hint.shortcut ? hint.shortcut.split(/\s+or\s+/i).filter(Boolean) : []))
    .map((shortcut) => formatShortcutAriaChord(shortcut, platform));
}

function getActionAriaShortcuts(
  hints: readonly AppSidebarPrimaryActionHint[],
  platform: ShortcutPlatform,
) {
  const shortcuts = getActionShortcutChords(hints, platform);
  return shortcuts.length > 0 ? shortcuts.join(" ") : undefined;
}

function getActionTooltip(
  label: string,
  description: string | undefined,
  shortcuts: readonly string[],
): InteractionTooltipConfig {
  return {
    text: label,
    description,
    shortcuts,
    side: "right",
  };
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
  const shortcutPlatform = useShortcutPlatform();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [creationDialogItem, setCreationDialogItem] = React.useState<NewContentMenuItem | null>(
    null,
  );
  const optionRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const searchInputId = "new-content-menu-search";
  const Icon = action.icon;
  const deferredQuery = React.useDeferredValue(query);
  const items = React.useMemo(
    () => createNewContentMenuItems(objectTypes, deferredQuery),
    [objectTypes, deferredQuery],
  );
  const hintDescription = getActionAriaDescription(action.hints, action.label);
  const hintShortcutChords = getActionShortcutChords(action.hints, shortcutPlatform);
  const hintShortcuts = getActionAriaShortcuts(action.hints, shortcutPlatform);
  const tooltip = getActionTooltip(action.label, hintDescription, hintShortcutChords);

  function resetMenu() {
    setQuery("");
    setActiveIndex(0);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) resetMenu();
  }

  function selectItem(objectTypeId: string) {
    const selectedItem = items.find(
      (item) => item.id === objectTypeId || item.objectTypeId === objectTypeId,
    );
    if (selectedItem && newContentDialogObjectTypes.has(selectedItem.objectTypeId)) {
      setCreationDialogItem(selectedItem);
      setOpen(false);
      resetMenu();
      return;
    }

    onSelectObjectType?.(
      selectedItem?.objectTypeId ?? objectTypeId,
      selectedItem?.createTitle ?? selectedItem?.label,
    );
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
      setActiveIndex((current) => (current + direction + items.length) % items.length);
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
    if (open) {
      const timer = window.setTimeout(() => {
        document.getElementById(searchInputId)?.focus();
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      document.getElementById("workspace-new-trigger")?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  React.useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(items.length - 1, 0)));
  }, [items.length]);

  React.useEffect(() => {
    function openFromWorkspace() {
      setQuery("");
      setActiveIndex(0);
      setOpen(true);
    }
    window.addEventListener("workspace:open-new-palette", openFromWorkspace);
    return () => window.removeEventListener("workspace:open-new-palette", openFromWorkspace);
  }, []);

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <Button
              id="workspace-new-trigger"
              data-lifecycle-contract={objectLifecycleContractSlots.ObjectCreationTrigger}
              tooltip={tooltip}
              aria-label={action.label}
              aria-description={hintDescription}
              aria-keyshortcuts={hintShortcuts}
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
          data-lifecycle-contract={objectLifecycleContractSlots.ObjectCreationMenu}
          side="bottom"
          align="start"
          sideOffset={-1}
          alignOffset={6}
          className={cn(
            compactMenuSurfaceClass,
            "box-content w-[min(22rem,calc(100vw-1.75rem))] min-w-44 max-h-[min(18rem,calc(100dvh-8rem))] max-w-[calc(100vw-1rem)] gap-0 rounded-[12px] border-border shadow-[0_3px_5px_rgb(0_0_0/0.01),0_5px_10px_rgb(0_0_0/0.02),0_10px_14px_rgb(0_0_0/0.01)] ring-0",
          )}
        >
        <div className="h-11 shrink-0 p-1.5">
          <div
            className={cn(
              compactMenuSearchClass,
              "flex h-8 items-center rounded-[8px] border border-transparent bg-muted transition-[border-color,box-shadow] focus-within:border-ring focus-within:bg-muted focus-within:ring-3 focus-within:ring-ring/50",
            )}
          >
            <Input
              id={searchInputId}
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
              className="h-full border-0 bg-transparent p-0 text-sm text-foreground shadow-none placeholder:text-muted-foreground placeholder:opacity-100 focus-visible:ring-0"
              autoFocus
            />
          </div>
        </div>

        <div
          id="new-content-menu-listbox"
          role="listbox"
          aria-label={t("primaryNavigation.typesLabel")}
          className="min-h-0 max-h-[min(12.5rem,calc(100dvh-15rem))] flex-1 overflow-y-auto px-1.5 pb-1.5"
        >
          {items.map(({ id, icon: Icon, label, tone, badgeLabel, isCreateFallback, hasChevron }, index) => {
            return (
              <button
                key={id}
                data-lifecycle-contract={objectLifecycleContractSlots.ObjectTypeOptionRow}
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
                  "flex h-8 min-h-8 items-center justify-between gap-2 rounded-[8px] border border-transparent px-1 text-left text-sm font-normal outline-none hover:bg-muted focus-visible:border-ring focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:bg-muted",
                )}
              >
                {isCreateFallback ? (
                  <span className="inline-flex shrink-0 items-center justify-center rounded-[0.475em] border border-transparent p-1 text-muted-foreground">
                    <AppSidebarPlusIcon className="size-3" />
                  </span>
                ) : (
                  <ObjectIconBadge
                    icon={Icon}
                    tone={tone}
                    variant="menu"
                    iconClassName="size-3.5"
                  />
                )}
                <CompactMenuItemText>{label}</CompactMenuItemText>
                {badgeLabel && (
                  <span
                    className={cn(
                      "ml-auto inline-flex h-7 shrink-0 items-center gap-1 rounded-[7px] border px-2 text-sm text-foreground",
                      objectIconToneBadgeClass[tone],
                    )}
                  >
                    <Icon className="size-3" />
                    <span>{badgeLabel}</span>
                  </span>
                )}
                {hasChevron && (
                  <AppSidebarChevronRightIcon className="ml-auto size-3.5 text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mx-1 flex h-[29px] shrink-0 items-center gap-x-3 border-t border-border px-1 py-1.5 text-xs leading-4 text-muted-foreground">
          <span className="whitespace-nowrap">
            <span className="font-medium text-muted-foreground">↑↓</span> para navegar
          </span>
          <span className="whitespace-nowrap">
            <span className="font-medium text-muted-foreground">Esc</span> para abortar
          </span>
          <span className="whitespace-nowrap">
            <span className="font-medium text-muted-foreground">↵</span> para selecionar
          </span>
        </div>
        </PopoverContent>
      </Popover>
      <NewContentCreationDialog
        item={creationDialogItem}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setCreationDialogItem(null);
        }}
      />
    </>
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

function shouldHandlePrimaryActionOnPointerDown() {
  return false;
}

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
  const shortcutPlatform = useShortcutPlatform();
  const Icon = action.icon;

  if (action.id === "new") {
    return (
      <NewContentMenu
        action={action}
        objectTypes={objectTypes}
        onSelectObjectType={onSelectObjectType}
      />
    );
  }

  const hintDescription = getActionAriaDescription(action.hints, action.label);
  const hintShortcutChords = getActionShortcutChords(action.hints, shortcutPlatform);
  const hintShortcuts = getActionAriaShortcuts(action.hints, shortcutPlatform);
  const tooltip = getActionTooltip(action.label, hintDescription, hintShortcutChords);

  return (
    <div data-slot="app-sidebar-primary-action" className="w-full">
      <Button
        type="button"
        variant="ghost"
        size="default"
        data-active={active || undefined}
        tooltip={tooltip}
        aria-label={action.label}
        aria-description={hintDescription}
        aria-keyshortcuts={hintShortcuts}
        className={cn(
          "group/interactive h-8 w-full justify-start gap-x-1.5 px-2 font-normal",
          "text-sm text-muted-foreground",
          workspaceRowStateClass,
          "[&_svg]:size-4",
        )}
        onClick={() => onAction?.(action.id)}
      >
        <Icon data-icon="inline-start" />
        <span className="min-w-0 truncate">{action.label}</span>
      </Button>
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
    mainValue,
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
    setShortcutBrowserOpen,
    openInSidePanel,
    createWorkspaceEntity,
    showMessage,
    trashItems,
    emptyTrash,
    purgeTrashItem,
    restoreTrashItem,
  } = useWorkspace();
  const [hiddenCollectionIds, setHiddenCollectionIds] = React.useState<Set<string>>(
    () => new Set(),
  );

  const visibleObjectTypeCollections: Record<string, WorkspaceCollectionRecord> = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(objectTypeCollections ?? {}).filter(
          ([collectionId]) => !hiddenCollectionIds.has(collectionId),
        ),
      ) as Record<string, WorkspaceCollectionRecord>,
    [hiddenCollectionIds, objectTypeCollections],
  );

  function openSidebarSelection(id: string, event?: SidebarModifierEvent) {
    setActiveAction(undefined);
    setActiveEntityId(id);

      function navigateMainTab(tab: any) {
        const nextTab = { ...tab, draggable: true };
        const intent = getSidebarNavigationIntent(event);
        logSidebarNavigation("navigate-main-tab", {
          ctrlKey: Boolean(event?.ctrlKey),
          explicitIntent: event?.__sidebarNavigationIntent,
          id: nextTab.id,
          intent,
          label: nextTab.label,
          metaKey: Boolean(event?.metaKey),
          shiftKey: Boolean(event?.shiftKey),
        });
        if (intent === "side-panel") {
          openInSidePanel(nextTab);
          return;
      }

      const forceNewTabId = intent === "new-tab" ? `${nextTab.id}:${Date.now()}` : undefined;
      setMainTabs((current: any[]) => {
        const result = createSidebarMainTabUpdate({
          currentTabs: current,
          intent,
          mainValue,
          newTabId: forceNewTabId,
          nextTab,
        });
        logSidebarNavigation("tabs-after-update", {
          activeTabId: result.mainValue,
          tabCountAfter: result.tabs.length,
          tabIds: result.tabs.map((item) => item.id),
        });
        return result.tabs;
      });
      setMainValue(forceNewTabId ?? nextTab.id);
    }

    const objectType = objectTypes.find((item: AppSidebarObjectType) => item.id === id);
    if (objectType) {
      navigateMainTab({
        id,
        label: objectType.label,
        icon: objectType.icon,
        iconClassName: getObjectIconToneClass(objectType.tone),
      });
      return;
    }

    const entity = createdEntities.find((item: any) => item.id === id);
    if (entity) {
      const entityType = objectTypes.find(
        (item: AppSidebarObjectType) => item.id === entity.objectTypeId,
      );
      navigateMainTab({
        id,
        label: entity.title,
        icon: entityType?.icon,
        iconClassName: getObjectIconToneClass(entityType?.tone),
      });
      return;
    }

    const pinnedEntity =
      pinnedEntities.find((item: any) => item.id === id) ??
      availablePinnedEntities.find((item: any) => item.id === id);
    if (pinnedEntity) {
      navigateMainTab({
        id,
        label: pinnedEntity.label,
        icon: pinnedEntity.icon,
        iconClassName: getObjectIconToneClass(pinnedEntity.tone),
      });
      return;
    }

    const collection = visibleObjectTypeCollections[id];
    if (collection) {
      const tabId = `object-type-item:collection:${id}`;
      navigateMainTab({
        id: tabId,
        label: collection.name,
        icon: ObjectCollectionIcon,
        iconClassName: objectIconToneBadgeClass.gray,
      });
      return;
    }

    selectEntity(id);
  }

  function handleCollectionAction(
    action: AppSidebarCollectionAction,
    objectType: AppSidebarObjectType,
    collection: WorkspaceCollectionRecord,
    event?: SidebarModifierEvent,
  ) {
    const collectionId = collection.id;

    if (action === "open") {
      openSidebarSelection(collectionId, event);
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
      setPinnedEntities((current: any[]) =>
        current.some((item: any) => item.id === collectionId)
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
      setHiddenCollectionIds((current: Set<string>) => new Set(current).add(collectionId));
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
      void navigator.clipboard?.writeText(collection.name).catch(() => undefined);
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
      setObjectTypeCollections((current: Record<string, any>) => {
        const existing = Object.values(current).filter(
          (item: any) => item.structureId === objectType.id,
        );
        let suffix = 1;
        let copy = `${collection.name} copy`;
        while (existing.some((item: any) => item.name === copy)) {
          suffix += 1;
          copy = `${collection.name} copy ${suffix}`;
        }
        const id = createCollectionId(objectType.id, copy, new Set(Object.keys(current)));
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
        (entity: any) => "collections" in entity && entity.collections.includes(collectionId),
      )
    ) {
      showMessage(t("lifecycle.errors.referenced-object"));
      return;
    }

    setObjectTypeCollections((current: Record<string, any>) => ({
      ...Object.fromEntries(Object.entries(current).filter(([id]) => id !== collectionId)),
    }));
    setPinnedEntities((current: any[]) => current.filter((item: any) => item.id !== collectionId));
    setActiveEntityId(objectType.id);
  }

  function openCommandPaletteFromSidebar() {
    setSideSearchOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("workspace:open-command-palette", {
          detail: { openInNewTab: false },
        }),
      );
    }
  }

  return (
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
          onActiveIdChange={(id, event) => {
            if (id !== null) {
              logSidebarNavigation("active-id-change-received", {
                ctrlKey: Boolean(event?.ctrlKey),
                explicitIntent: event?.__sidebarNavigationIntent,
                id,
                metaKey: Boolean(event?.metaKey),
                shiftKey: Boolean(event?.shiftKey),
              });
              setSideSearchOpen(false);
              openSidebarSelection(id, event);
            }
          }}
          pinnedEntities={pinnedEntities}
          availablePinnedEntities={availablePinnedEntities}
          objectTypes={objectTypes}
          objectTypeCollections={visibleObjectTypeCollections}
          customSections={customSections}
          trashItems={trashItems}
          onCreateEntity={createWorkspaceEntity}
          onCreateObjectTypeFromPreset={createWorkspaceStructureFromPreset}
          onCreateObjectType={createWorkspaceStructure}
          onUpdateObjectType={updateWorkspaceStructure}
          onDeleteObjectType={deleteWorkspaceStructure}
          onEmptyTrash={emptyTrash}
          onPurgeTrashItem={purgeTrashItem}
          onRestoreTrashItem={restoreTrashItem}
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
          onOpenShortcuts={() => setShortcutBrowserOpen(true)}
        />
      </div>
    </AppSidebar>
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
  createSidebarMainTabUpdate,
  createNewContentMenuItems,
  defaultActions,
  getSidebarNavigationIntent,
  logSidebarNavigation,
  shouldHandlePrimaryActionOnPointerDown,
  WorkspaceSidebar,
};
