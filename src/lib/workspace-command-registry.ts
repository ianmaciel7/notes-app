import { resolveShortcutChord, type ShortcutPlatform } from "./workspace-shortcuts.ts";

export type WorkspaceCommandCategory =
  | "navigation"
  | "creation"
  | "workspace"
  | "search"
  | "page"
  | "calendar";

export type WorkspaceCommandId =
  | "workspace.openPalette"
  | "workspace.openNewContent"
  | "workspace.openExtendedSearch"
  | "workspace.openFindInPage"
  | "workspace.openShortcuts"
  | "workspace.search"
  | "workspace.openSettings"
  | "workspace.navigateHome"
  | "workspace.navigateToday"
  | "workspace.navigateBack"
  | "workspace.navigateForward"
  | "workspace.openExplore"
  | "workspace.toggleSidebar"
  | "workspace.toggleSidePanel"
  | "workspace.toggleFocusMode"
  | "workspace.toggleTheme"
  | "workspace.toggleTabsBar"
  | "workspace.closeCurrentTab"
  | "workspace.createTask"
  | "workspace.calendar.month"
  | "workspace.calendar.week"
  | "workspace.calendar.threeDay"
  | "workspace.calendar.day"
  | "workspace.calendar.previous"
  | "workspace.calendar.next"
  | `workspace.createObject.${string}`;

export type WorkspaceStructureCommandSource = {
  readonly id: string;
  readonly label: string;
  readonly enabled?: boolean;
};

export type WorkspaceCommandActions = {
  readonly openPalette?: () => void;
  readonly openNewContent?: () => void;
  readonly openExtendedSearch?: () => void;
  readonly openFindInPage?: () => void;
  readonly openShortcuts?: () => void;
  readonly focusSidebarSearch?: () => void;
  readonly openSettings?: () => void;
  readonly navigateHome?: () => void;
  readonly navigateToday?: () => void;
  readonly navigateBack?: () => void;
  readonly navigateForward?: () => void;
  readonly openExplore?: () => void;
  readonly toggleSidebar?: () => void;
  readonly toggleSidePanel?: () => void;
  readonly toggleFocusMode?: () => void;
  readonly toggleTheme?: () => void;
  readonly toggleTabsBar?: () => void;
  readonly closeCurrentTab?: () => void;
  readonly createTask?: () => void;
  readonly setCalendarView?: (view: "month" | "week" | "three-day" | "day") => void;
  readonly moveCalendar?: (direction: "previous" | "next") => void;
  readonly createObject?: (structureId: string) => void;
};

export type WorkspaceCommandState = {
  readonly canNavigateToday?: boolean;
  readonly canUseExtendedSearch?: boolean;
  readonly canFindInPage?: boolean;
  readonly canOpenSettings?: boolean;
  readonly canToggleTheme?: boolean;
  readonly canToggleTabsBar?: boolean;
  readonly canCloseCurrentTab?: boolean;
  readonly canCreateTask?: boolean;
  readonly calendarActive?: boolean;
  readonly structures?: readonly WorkspaceStructureCommandSource[];
};

export type WorkspaceCommandRuntime = {
  readonly locale: string;
  readonly t: (key: string, values?: Record<string, string | number>) => string;
  readonly actions: WorkspaceCommandActions;
  readonly state: WorkspaceCommandState;
};

export type WorkspaceCommand = {
  readonly id: WorkspaceCommandId;
  readonly category: WorkspaceCommandCategory;
  readonly order: number;
  readonly label: string;
  readonly description: string;
  readonly aliases: readonly string[];
  readonly shortcuts: readonly string[];
  readonly available: boolean;
  readonly execute: () => void;
};

export type WorkspaceShortcutCatalogGroup =
  | "general"
  | "navigation"
  | "page"
  | "calendar"
  | "creation"
  | "workspace";

export type WorkspaceShortcutCatalogEntry = WorkspaceCommand & {
  readonly group: WorkspaceShortcutCatalogGroup;
  readonly disabledReason?: string;
};

export type WorkspaceShortcutPriority =
  | "modal"
  | "specialized"
  | "editor"
  | "block-selection"
  | "page"
  | "global";

export type WorkspaceShortcutClaim = {
  readonly id: string;
  readonly priority: WorkspaceShortcutPriority;
  readonly shortcuts: readonly string[];
  readonly commandId?: WorkspaceCommandId;
  readonly allowEditableTarget?: boolean;
  readonly isAvailable?: () => boolean;
  readonly run?: () => void;
};

export type WorkspaceShortcutEvent = {
  readonly key: string;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
  readonly altKey?: boolean;
  readonly shiftKey?: boolean;
  readonly isComposing?: boolean;
  readonly target?: unknown;
  readonly preventDefault?: () => void;
};

export type WorkspaceShortcutRouteResult =
  | {
      readonly accepted: true;
      readonly chord: string;
      readonly claimId: string;
    }
  | {
      readonly accepted: false;
      readonly chord: string | null;
      readonly reason: "composition" | "editable-target" | "no-chord" | "no-claim" | "unavailable";
    };

type StaticCommandDefinition = {
  readonly id: Exclude<WorkspaceCommandId, `workspace.createObject.${string}`>;
  readonly category: WorkspaceCommandCategory;
  readonly order: number;
  readonly labelKey: string;
  readonly descriptionKey: string;
  readonly aliasKeys?: readonly string[];
  readonly shortcuts?: readonly string[];
  readonly isAvailable: (runtime: WorkspaceCommandRuntime) => boolean;
  readonly execute: (runtime: WorkspaceCommandRuntime) => void;
};

const STATIC_COMMANDS: readonly StaticCommandDefinition[] = [
  {
    id: "workspace.openPalette",
    category: "search",
    order: 10,
    labelKey: "commands.openPalette.label",
    descriptionKey: "commands.openPalette.description",
    aliasKeys: ["commands.openPalette.alias"],
    shortcuts: ["Mod+K", "Mod+P"],
    isAvailable: (runtime) => Boolean(runtime.actions.openPalette),
    execute: (runtime) => runtime.actions.openPalette?.(),
  },
  {
    id: "workspace.openNewContent",
    category: "creation",
    order: 11,
    labelKey: "commands.openNewContent.label",
    descriptionKey: "commands.openNewContent.description",
    aliasKeys: ["commands.openNewContent.alias"],
    shortcuts: ["Mod+U"],
    isAvailable: (runtime) => Boolean(runtime.actions.openNewContent),
    execute: (runtime) => runtime.actions.openNewContent?.(),
  },
  {
    id: "workspace.openExtendedSearch",
    category: "search",
    order: 12,
    labelKey: "commands.openExtendedSearch.label",
    descriptionKey: "commands.openExtendedSearch.description",
    aliasKeys: ["commands.openExtendedSearch.alias"],
    shortcuts: ["Mod+Shift+P"],
    isAvailable: (runtime) =>
      Boolean(runtime.actions.openExtendedSearch && runtime.state.canUseExtendedSearch),
    execute: (runtime) => runtime.actions.openExtendedSearch?.(),
  },
  {
    id: "workspace.openFindInPage",
    category: "page",
    order: 14,
    labelKey: "commands.openFindInPage.label",
    descriptionKey: "commands.openFindInPage.description",
    aliasKeys: ["commands.openFindInPage.alias"],
    shortcuts: ["Mod+F"],
    isAvailable: (runtime) =>
      Boolean(runtime.actions.openFindInPage && runtime.state.canFindInPage),
    execute: (runtime) => runtime.actions.openFindInPage?.(),
  },
  {
    id: "workspace.openShortcuts",
    category: "workspace",
    order: 16,
    labelKey: "commands.openShortcuts.label",
    descriptionKey: "commands.openShortcuts.description",
    aliasKeys: ["commands.openShortcuts.alias"],
    shortcuts: ["Mod+Shift+B"],
    isAvailable: (runtime) => Boolean(runtime.actions.openShortcuts),
    execute: (runtime) => runtime.actions.openShortcuts?.(),
  },
  {
    id: "workspace.search",
    category: "search",
    order: 20,
    labelKey: "commands.search.label",
    descriptionKey: "commands.search.description",
    aliasKeys: ["commands.search.alias"],
    isAvailable: (runtime) => Boolean(runtime.actions.focusSidebarSearch),
    execute: (runtime) => runtime.actions.focusSidebarSearch?.(),
  },
  {
    id: "workspace.openSettings",
    category: "workspace",
    order: 22,
    labelKey: "commands.openSettings.label",
    descriptionKey: "commands.openSettings.description",
    shortcuts: ["Mod+,"],
    isAvailable: (runtime) =>
      Boolean(runtime.actions.openSettings && runtime.state.canOpenSettings),
    execute: (runtime) => runtime.actions.openSettings?.(),
  },
  {
    id: "workspace.navigateHome",
    category: "navigation",
    order: 30,
    labelKey: "commands.navigateHome.label",
    descriptionKey: "commands.navigateHome.description",
    isAvailable: (runtime) => Boolean(runtime.actions.navigateHome),
    execute: (runtime) => runtime.actions.navigateHome?.(),
  },
  {
    id: "workspace.navigateBack",
    category: "navigation",
    order: 32,
    labelKey: "commands.navigateBack.label",
    descriptionKey: "commands.navigateBack.description",
    shortcuts: ["Mod+ArrowLeft", "Mod+["],
    isAvailable: (runtime) => Boolean(runtime.actions.navigateBack),
    execute: (runtime) => runtime.actions.navigateBack?.(),
  },
  {
    id: "workspace.navigateForward",
    category: "navigation",
    order: 34,
    labelKey: "commands.navigateForward.label",
    descriptionKey: "commands.navigateForward.description",
    shortcuts: ["Mod+ArrowRight", "Mod+]"],
    isAvailable: (runtime) => Boolean(runtime.actions.navigateForward),
    execute: (runtime) => runtime.actions.navigateForward?.(),
  },
  {
    id: "workspace.navigateToday",
    category: "navigation",
    order: 40,
    labelKey: "commands.navigateToday.label",
    descriptionKey: "commands.navigateToday.description",
    shortcuts: ["Mod+Alt+H"],
    isAvailable: (runtime) =>
      Boolean(runtime.actions.navigateToday && runtime.state.canNavigateToday),
    execute: (runtime) => runtime.actions.navigateToday?.(),
  },
  {
    id: "workspace.openExplore",
    category: "navigation",
    order: 50,
    labelKey: "commands.openExplore.label",
    descriptionKey: "commands.openExplore.description",
    shortcuts: ["Mod+J"],
    isAvailable: (runtime) => Boolean(runtime.actions.openExplore),
    execute: (runtime) => runtime.actions.openExplore?.(),
  },
  {
    id: "workspace.toggleSidebar",
    category: "workspace",
    order: 60,
    labelKey: "commands.toggleSidebar.label",
    descriptionKey: "commands.toggleSidebar.description",
    shortcuts: ["Mod+Shift+ArrowLeft"],
    isAvailable: (runtime) => Boolean(runtime.actions.toggleSidebar),
    execute: (runtime) => runtime.actions.toggleSidebar?.(),
  },
  {
    id: "workspace.toggleSidePanel",
    category: "workspace",
    order: 62,
    labelKey: "commands.toggleSidePanel.label",
    descriptionKey: "commands.toggleSidePanel.description",
    shortcuts: ["Mod+Shift+ArrowRight"],
    isAvailable: (runtime) => Boolean(runtime.actions.toggleSidePanel),
    execute: (runtime) => runtime.actions.toggleSidePanel?.(),
  },
  {
    id: "workspace.toggleFocusMode",
    category: "workspace",
    order: 64,
    labelKey: "commands.toggleFocusMode.label",
    descriptionKey: "commands.toggleFocusMode.description",
    shortcuts: ["Mod+Shift+M"],
    isAvailable: (runtime) => Boolean(runtime.actions.toggleFocusMode),
    execute: (runtime) => runtime.actions.toggleFocusMode?.(),
  },
  {
    id: "workspace.toggleTheme",
    category: "workspace",
    order: 66,
    labelKey: "commands.toggleTheme.label",
    descriptionKey: "commands.toggleTheme.description",
    shortcuts: ["Mod+Shift+L"],
    isAvailable: (runtime) =>
      Boolean(runtime.actions.toggleTheme && (runtime.state.canToggleTheme ?? true)),
    execute: (runtime) => runtime.actions.toggleTheme?.(),
  },
  {
    id: "workspace.toggleTabsBar",
    category: "workspace",
    order: 68,
    labelKey: "commands.toggleTabsBar.label",
    descriptionKey: "commands.toggleTabsBar.description",
    shortcuts: ["Mod+Shift+ArrowUp"],
    isAvailable: (runtime) =>
      Boolean(runtime.actions.toggleTabsBar && runtime.state.canToggleTabsBar),
    execute: (runtime) => runtime.actions.toggleTabsBar?.(),
  },
  {
    id: "workspace.closeCurrentTab",
    category: "page",
    order: 70,
    labelKey: "commands.closeCurrentTab.label",
    descriptionKey: "commands.closeCurrentTab.description",
    shortcuts: ["Mod+W"],
    isAvailable: (runtime) =>
      Boolean(runtime.actions.closeCurrentTab && runtime.state.canCloseCurrentTab),
    execute: (runtime) => runtime.actions.closeCurrentTab?.(),
  },
  {
    id: "workspace.createTask",
    category: "creation",
    order: 80,
    labelKey: "commands.createTask.label",
    descriptionKey: "commands.createTask.description",
    shortcuts: ["Alt+Enter"],
    isAvailable: (runtime) => Boolean(runtime.actions.createTask && runtime.state.canCreateTask),
    execute: (runtime) => runtime.actions.createTask?.(),
  },
  {
    id: "workspace.calendar.month",
    category: "calendar",
    order: 90,
    labelKey: "commands.calendar.month.label",
    descriptionKey: "commands.calendar.month.description",
    shortcuts: ["M"],
    isAvailable: (runtime) =>
      Boolean(runtime.actions.setCalendarView && runtime.state.calendarActive),
    execute: (runtime) => runtime.actions.setCalendarView?.("month"),
  },
  {
    id: "workspace.calendar.week",
    category: "calendar",
    order: 92,
    labelKey: "commands.calendar.week.label",
    descriptionKey: "commands.calendar.week.description",
    shortcuts: ["W"],
    isAvailable: (runtime) =>
      Boolean(runtime.actions.setCalendarView && runtime.state.calendarActive),
    execute: (runtime) => runtime.actions.setCalendarView?.("week"),
  },
  {
    id: "workspace.calendar.threeDay",
    category: "calendar",
    order: 94,
    labelKey: "commands.calendar.threeDay.label",
    descriptionKey: "commands.calendar.threeDay.description",
    shortcuts: ["R"],
    isAvailable: (runtime) =>
      Boolean(runtime.actions.setCalendarView && runtime.state.calendarActive),
    execute: (runtime) => runtime.actions.setCalendarView?.("three-day"),
  },
  {
    id: "workspace.calendar.day",
    category: "calendar",
    order: 96,
    labelKey: "commands.calendar.day.label",
    descriptionKey: "commands.calendar.day.description",
    shortcuts: ["D"],
    isAvailable: (runtime) =>
      Boolean(runtime.actions.setCalendarView && runtime.state.calendarActive),
    execute: (runtime) => runtime.actions.setCalendarView?.("day"),
  },
  {
    id: "workspace.calendar.previous",
    category: "calendar",
    order: 98,
    labelKey: "commands.calendar.previous.label",
    descriptionKey: "commands.calendar.previous.description",
    shortcuts: ["ArrowLeft"],
    isAvailable: (runtime) => Boolean(runtime.actions.moveCalendar && runtime.state.calendarActive),
    execute: (runtime) => runtime.actions.moveCalendar?.("previous"),
  },
  {
    id: "workspace.calendar.next",
    category: "calendar",
    order: 100,
    labelKey: "commands.calendar.next.label",
    descriptionKey: "commands.calendar.next.description",
    shortcuts: ["ArrowRight"],
    isAvailable: (runtime) => Boolean(runtime.actions.moveCalendar && runtime.state.calendarActive),
    execute: (runtime) => runtime.actions.moveCalendar?.("next"),
  },
];

const SHORTCUT_PRIORITY_ORDER: readonly WorkspaceShortcutPriority[] = [
  "modal",
  "specialized",
  "editor",
  "block-selection",
  "page",
  "global",
];

export function createWorkspaceCommandRuntime(
  runtime: WorkspaceCommandRuntime,
): WorkspaceCommandRuntime {
  return runtime;
}

function localizeAliases(
  runtime: WorkspaceCommandRuntime,
  aliasKeys: readonly string[] | undefined,
): readonly string[] {
  return (aliasKeys ?? []).map((key) => runtime.t(key)).filter((alias) => alias.trim().length > 0);
}

export function projectWorkspaceCommands(
  runtime: WorkspaceCommandRuntime,
): readonly WorkspaceCommand[] {
  const staticCommands = STATIC_COMMANDS.filter((definition) =>
    definition.isAvailable(runtime),
  ).map((definition) => ({
    id: definition.id,
    category: definition.category,
    order: definition.order,
    label: runtime.t(definition.labelKey),
    description: runtime.t(definition.descriptionKey),
    aliases: localizeAliases(runtime, definition.aliasKeys),
    shortcuts: definition.shortcuts ?? [],
    available: true,
    execute: () => definition.execute(runtime),
  }));

  const creationCommands = (runtime.state.structures ?? [])
    .filter((structure) => structure.enabled !== false)
    .map((structure, index) => ({
      id: `workspace.createObject.${structure.id}` as WorkspaceCommandId,
      category: "creation" as const,
      order: 1000 + index,
      label: runtime.t("commands.createObject.label", {
        label: structure.label,
      }),
      description: runtime.t("commands.createObject.description", {
        label: structure.label,
      }),
      aliases: [structure.label],
      shortcuts: [],
      available: Boolean(runtime.actions.createObject),
      execute: () => runtime.actions.createObject?.(structure.id),
    }))
    .filter((command) => command.available);

  return [...staticCommands, ...creationCommands].sort((left, right) => {
    if (left.order !== right.order) return left.order - right.order;
    return left.id.localeCompare(right.id);
  });
}

function catalogGroupForCommand(command: WorkspaceCommand): WorkspaceShortcutCatalogGroup {
  if (command.category === "search") return "general";
  if (command.category === "page") return "page";
  return command.category;
}

export function projectWorkspaceShortcutCatalog(
  runtime: WorkspaceCommandRuntime,
): readonly WorkspaceShortcutCatalogEntry[] {
  return projectWorkspaceCommands(runtime).map((command) => ({
    ...command,
    group: catalogGroupForCommand(command),
  }));
}

export function runWorkspaceCommand(
  runtime: WorkspaceCommandRuntime,
  id: WorkspaceCommandId,
): boolean {
  const command = projectWorkspaceCommands(runtime).find((candidate) => candidate.id === id);
  if (!command?.available) return false;

  command.execute();
  return true;
}

function targetIsEditable(target: unknown): boolean {
  if (!target || typeof target !== "object") return false;
  if ("editable" in target && target.editable === true) return true;
  if ("isContentEditable" in target && target.isContentEditable === true) {
    return true;
  }
  if ("tagName" in target && typeof target.tagName === "string") {
    const tagName = target.tagName.toLowerCase();
    return tagName === "input" || tagName === "textarea" || tagName === "select";
  }
  return false;
}

function claimAcceptsChord(claim: WorkspaceShortcutClaim, chord: string) {
  return claim.shortcuts.includes(chord) && (claim.isAvailable?.() ?? true);
}

function normalizeEventKeyForShortcut(event: WorkspaceShortcutEvent): string | null {
  if (!event.key || event.key === "+") return null;
  if (event.key.length === 1) return event.key.toUpperCase();

  const aliases = new Map<string, string>([
    ["esc", "Escape"],
    ["escape", "Escape"],
    ["up", "ArrowUp"],
    ["arrowup", "ArrowUp"],
    ["down", "ArrowDown"],
    ["arrowdown", "ArrowDown"],
    ["left", "ArrowLeft"],
    ["arrowleft", "ArrowLeft"],
    ["right", "ArrowRight"],
    ["arrowright", "ArrowRight"],
  ]);
  return aliases.get(event.key.toLowerCase()) ?? event.key;
}

function resolveClaimedShortcutChord({
  event,
  platform,
  claims,
}: {
  readonly event: WorkspaceShortcutEvent;
  readonly platform: ShortcutPlatform;
  readonly claims: readonly WorkspaceShortcutClaim[];
}) {
  const modifiedChord = resolveShortcutChord(event, platform);
  if (modifiedChord) return modifiedChord;

  const key = normalizeEventKeyForShortcut(event);
  if (!key) return null;
  return claims.some((claim) => claim.shortcuts.includes(key)) ? key : null;
}

export function routeWorkspaceShortcut({
  runtime,
  platform,
  event,
  claims,
}: {
  readonly runtime: WorkspaceCommandRuntime;
  readonly platform: ShortcutPlatform;
  readonly event: WorkspaceShortcutEvent;
  readonly claims: readonly WorkspaceShortcutClaim[];
}): WorkspaceShortcutRouteResult {
  const chord = resolveClaimedShortcutChord({ event, platform, claims });
  if (!chord) return { accepted: false, chord: null, reason: "no-chord" };
  if (event.isComposing) {
    return { accepted: false, chord, reason: "composition" };
  }

  const orderedClaims = [...claims].sort(
    (left, right) =>
      SHORTCUT_PRIORITY_ORDER.indexOf(left.priority) -
      SHORTCUT_PRIORITY_ORDER.indexOf(right.priority),
  );
  const matchingClaim = orderedClaims.find((claim) => claimAcceptsChord(claim, chord));

  if (!matchingClaim) return { accepted: false, chord, reason: "no-claim" };
  if (targetIsEditable(event.target) && matchingClaim.allowEditableTarget !== true) {
    return { accepted: false, chord, reason: "editable-target" };
  }

  const accepted = matchingClaim.commandId
    ? runWorkspaceCommand(runtime, matchingClaim.commandId)
    : Boolean(matchingClaim.run);
  if (!accepted) return { accepted: false, chord, reason: "unavailable" };

  if (!matchingClaim.commandId) matchingClaim.run?.();
  event.preventDefault?.();

  return { accepted: true, chord, claimId: matchingClaim.id };
}
