import {
  resolveShortcutChord,
  type ShortcutPlatform,
} from "./workspace-shortcuts.ts";

export type WorkspaceCommandCategory =
  | "navigation"
  | "creation"
  | "workspace"
  | "search";

export type WorkspaceCommandId =
  | "workspace.openPalette"
  | "workspace.search"
  | "workspace.navigateHome"
  | "workspace.navigateToday"
  | "workspace.openExplore"
  | "workspace.toggleSidebar"
  | `workspace.createObject.${string}`;

export type WorkspaceStructureCommandSource = {
  readonly id: string;
  readonly label: string;
  readonly enabled?: boolean;
};

export type WorkspaceCommandActions = {
  readonly openPalette?: () => void;
  readonly focusSidebarSearch?: () => void;
  readonly navigateHome?: () => void;
  readonly navigateToday?: () => void;
  readonly openExplore?: () => void;
  readonly toggleSidebar?: () => void;
  readonly createObject?: (structureId: string) => void;
};

export type WorkspaceCommandState = {
  readonly canNavigateToday?: boolean;
  readonly structures?: readonly WorkspaceStructureCommandSource[];
};

export type WorkspaceCommandRuntime = {
  readonly locale: string;
  readonly t: (
    key: string,
    values?: Record<string, string | number>,
  ) => string;
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
      readonly reason:
        | "composition"
        | "editable-target"
        | "no-chord"
        | "no-claim"
        | "unavailable";
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
    id: "workspace.navigateHome",
    category: "navigation",
    order: 30,
    labelKey: "commands.navigateHome.label",
    descriptionKey: "commands.navigateHome.description",
    isAvailable: (runtime) => Boolean(runtime.actions.navigateHome),
    execute: (runtime) => runtime.actions.navigateHome?.(),
  },
  {
    id: "workspace.navigateToday",
    category: "navigation",
    order: 40,
    labelKey: "commands.navigateToday.label",
    descriptionKey: "commands.navigateToday.description",
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
    isAvailable: (runtime) => Boolean(runtime.actions.openExplore),
    execute: (runtime) => runtime.actions.openExplore?.(),
  },
  {
    id: "workspace.toggleSidebar",
    category: "workspace",
    order: 60,
    labelKey: "commands.toggleSidebar.label",
    descriptionKey: "commands.toggleSidebar.description",
    isAvailable: (runtime) => Boolean(runtime.actions.toggleSidebar),
    execute: (runtime) => runtime.actions.toggleSidebar?.(),
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
  return (aliasKeys ?? [])
    .map((key) => runtime.t(key))
    .filter((alias) => alias.trim().length > 0);
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

export function runWorkspaceCommand(
  runtime: WorkspaceCommandRuntime,
  id: WorkspaceCommandId,
): boolean {
  const command = projectWorkspaceCommands(runtime).find(
    (candidate) => candidate.id === id,
  );
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
  const chord = resolveShortcutChord(event, platform);
  if (!chord) return { accepted: false, chord: null, reason: "no-chord" };
  if (event.isComposing) {
    return { accepted: false, chord, reason: "composition" };
  }

  const orderedClaims = [...claims].sort(
    (left, right) =>
      SHORTCUT_PRIORITY_ORDER.indexOf(left.priority) -
      SHORTCUT_PRIORITY_ORDER.indexOf(right.priority),
  );
  const matchingClaim = orderedClaims.find((claim) =>
    claimAcceptsChord(claim, chord),
  );

  if (!matchingClaim) return { accepted: false, chord, reason: "no-claim" };
  if (
    targetIsEditable(event.target) &&
    matchingClaim.priority === "global" &&
    matchingClaim.allowEditableTarget !== true
  ) {
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
