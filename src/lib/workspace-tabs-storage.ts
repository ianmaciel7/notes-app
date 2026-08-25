const WORKSPACE_TABS_STORAGE_KEY = "notes-app:workspace-tabs:v1";
const WORKSPACE_TABS_SCHEMA_VERSION = 1;

type WorkspaceTabStorageItem = {
  id: string;
  pinned?: boolean;
  draggable?: boolean;
};

type WorkspaceTabStoragePane = {
  value: string | null;
  tabs: WorkspaceTabStorageItem[];
};

type WorkspaceTabsState = {
  main: WorkspaceTabStoragePane;
  side: WorkspaceTabStoragePane;
};

type WorkspaceTabsSnapshot = {
  version: typeof WORKSPACE_TABS_SCHEMA_VERSION;
} & WorkspaceTabsState;

type WorkspaceTabsSnapshotParseResult =
  | { ok: false; reason: "invalid-json" | "invalid-record" }
  | { ok: true; state: WorkspaceTabsState };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toTabItems(value: unknown): WorkspaceTabStorageItem[] {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, WorkspaceTabStorageItem>();
  for (const item of value) {
    if (!isRecord(item) || typeof item.id !== "string") continue;
    const id = item.id.trim();
    if (!id || unique.has(id)) continue;
    unique.set(id, {
      id,
      pinned: typeof item.pinned === "boolean" ? item.pinned : undefined,
      draggable:
        typeof item.draggable === "boolean" ? item.draggable : undefined,
    });
  }
  return Array.from(unique.values());
}

function toPane(value: unknown): WorkspaceTabStoragePane {
  if (!isRecord(value)) return { value: null, tabs: [] };
  const activeValue = typeof value.value === "string" ? value.value.trim() : "";
  return {
    value: activeValue || null,
    tabs: toTabItems(value.tabs),
  };
}

function parseWorkspaceTabsState(
  raw: string,
): WorkspaceTabsSnapshotParseResult {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "invalid-json" };
  }

  if (!isRecord(value) || value.version !== WORKSPACE_TABS_SCHEMA_VERSION) {
    return { ok: false, reason: "invalid-record" };
  }

  return {
    ok: true,
    state: {
      main: toPane(value.main),
      side: toPane(value.side),
    },
  };
}

function serializeWorkspaceTabsState(state: WorkspaceTabsState): string {
  return JSON.stringify({
    version: WORKSPACE_TABS_SCHEMA_VERSION,
    main: toPane(state.main),
    side: toPane(state.side),
  } satisfies WorkspaceTabsSnapshot);
}

export {
  parseWorkspaceTabsState,
  serializeWorkspaceTabsState,
  WORKSPACE_TABS_STORAGE_KEY,
  type WorkspaceTabStorageItem,
  type WorkspaceTabsSnapshotParseResult,
  type WorkspaceTabsState,
};
