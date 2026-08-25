const WORKSPACE_SIDEBAR_STORAGE_KEY = "notes-app:workspace-sidebar:v1";
const WORKSPACE_SIDEBAR_SCHEMA_VERSION = 1;

type WorkspaceSidebarCustomSection = {
  id: string;
  label: string;
  open: boolean;
};

type WorkspaceSidebarState = {
  customSections: WorkspaceSidebarCustomSection[];
  objectTypeCollections: Record<string, string[]>;
  objectTypeQueries: Record<string, string[]>;
};

type WorkspaceSidebarSnapshot = {
  version: typeof WORKSPACE_SIDEBAR_SCHEMA_VERSION;
} & WorkspaceSidebarState;

type WorkspaceSidebarSnapshotParseResult =
  | { ok: false; reason: "invalid-json" | "invalid-record" }
  | { ok: true; state: WorkspaceSidebarState };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringArrayMap(value: unknown): Record<string, string[]> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, items]) => {
      if (!key.trim() || !Array.isArray(items)) return [];
      const normalizedItems = items.flatMap((item) => {
        if (typeof item !== "string") return [];
        const label = item.trim();
        return label ? [label] : [];
      });
      return normalizedItems.length > 0 ? [[key, normalizedItems]] : [];
    }),
  );
}

function toCustomSections(value: unknown): WorkspaceSidebarCustomSection[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      typeof item.label !== "string"
    ) {
      return [];
    }
    const id = item.id.trim();
    const label = item.label.trim();
    if (!id || !label) return [];
    return [
      {
        id,
        label,
        open: typeof item.open === "boolean" ? item.open : true,
      },
    ];
  });
}

function parseWorkspaceSidebarState(
  raw: string,
): WorkspaceSidebarSnapshotParseResult {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "invalid-json" };
  }

  if (!isRecord(value) || value.version !== WORKSPACE_SIDEBAR_SCHEMA_VERSION) {
    return { ok: false, reason: "invalid-record" };
  }

  return {
    ok: true,
    state: {
      customSections: toCustomSections(value.customSections),
      objectTypeCollections: toStringArrayMap(value.objectTypeCollections),
      objectTypeQueries: toStringArrayMap(value.objectTypeQueries),
    },
  };
}

function serializeWorkspaceSidebarState(
  state: WorkspaceSidebarState,
): string {
  return JSON.stringify({
    version: WORKSPACE_SIDEBAR_SCHEMA_VERSION,
    customSections: toCustomSections(state.customSections),
    objectTypeCollections: toStringArrayMap(state.objectTypeCollections),
    objectTypeQueries: toStringArrayMap(state.objectTypeQueries),
  } satisfies WorkspaceSidebarSnapshot);
}

export {
  WORKSPACE_SIDEBAR_STORAGE_KEY,
  parseWorkspaceSidebarState,
  serializeWorkspaceSidebarState,
  type WorkspaceSidebarSnapshotParseResult,
  type WorkspaceSidebarState,
};
