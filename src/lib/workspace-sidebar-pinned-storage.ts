import type { ObjectIconTone } from "./workspace-object-types";

const WORKSPACE_SIDEBAR_PINNED_STORAGE_KEY =
  "notes-app:workspace-sidebar-pinned:v1";
const WORKSPACE_SIDEBAR_PINNED_SCHEMA_VERSION = 1;
const objectIconTones = new Set<ObjectIconTone>([
  "amber",
  "blue",
  "cyan",
  "emerald",
  "gray",
  "green",
  "orange",
  "purple",
  "red",
  "rose",
  "sky",
]);

type WorkspaceSidebarPinnedItem = {
  id: string;
  iconHint?: string;
  toneHint?: ObjectIconTone;
};

type WorkspaceSidebarPinnedSnapshot = {
  version: typeof WORKSPACE_SIDEBAR_PINNED_SCHEMA_VERSION;
  items: WorkspaceSidebarPinnedItem[];
};

type WorkspaceSidebarPinnedSnapshotParseResult =
  | {
      ok: false;
      reason: "invalid-json" | "invalid-record" | "unsupported-version";
    }
  | { ok: true; state: WorkspaceSidebarPinnedSnapshot };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toWorkspaceSidebarPinnedItems(
  value: unknown,
): WorkspaceSidebarPinnedItem[] {
  if (!isRecord(value)) return [];
  if (value.version === 1) {
    if (!Array.isArray(value.items)) return [];
    return value.items.flatMap((item): WorkspaceSidebarPinnedItem[] => {
      if (!isRecord(item) || typeof item.id !== "string") return [];
      const id = item.id.trim();
      if (!id) return [];
      return [
        {
          id,
          iconHint:
            typeof item.iconHint === "string" ? item.iconHint : undefined,
          toneHint:
            typeof item.toneHint === "string" &&
            objectIconTones.has(item.toneHint as ObjectIconTone)
              ? (item.toneHint as ObjectIconTone)
              : undefined,
        },
      ];
    });
  }
  return [];
}

function parseLegacyWorkspaceSidebarPinnedState(
  value: unknown,
): WorkspaceSidebarPinnedItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) =>
    typeof item === "string" && item.length > 0
      ? [{ id: item }]
      : [],
  );
}

function parseWorkspaceSidebarPinnedState(
  raw: string,
): WorkspaceSidebarPinnedSnapshotParseResult {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "invalid-json" };
  }

  if (isRecord(value) && value.version === 1) {
    if (!Array.isArray(value.items)) {
      return { ok: false, reason: "invalid-record" };
    }
    const items = toWorkspaceSidebarPinnedItems(value);
    return {
      ok: true,
      state: {
        version: WORKSPACE_SIDEBAR_PINNED_SCHEMA_VERSION,
        items,
      },
    };
  }

  if (Array.isArray(value)) {
    return {
      ok: true,
      state: {
        version: WORKSPACE_SIDEBAR_PINNED_SCHEMA_VERSION,
        items: parseLegacyWorkspaceSidebarPinnedState(value),
      },
    };
  }

  if (!isRecord(value) || value.version !== 1) {
    return { ok: false, reason: "unsupported-version" };
  }
  return { ok: false, reason: "invalid-record" };
}

function serializeWorkspaceSidebarPinnedState(
  items: readonly WorkspaceSidebarPinnedItem[],
): string {
  const unique = new Map<string, WorkspaceSidebarPinnedItem>();
  for (const item of items) {
    const id = item.id.trim();
    if (!id) continue;
    if (!unique.has(id)) unique.set(id, { ...item, id });
  }
  return JSON.stringify({
    version: WORKSPACE_SIDEBAR_PINNED_SCHEMA_VERSION,
    items: Array.from(unique.values()),
  } satisfies WorkspaceSidebarPinnedSnapshot);
}

export {
  WORKSPACE_SIDEBAR_PINNED_STORAGE_KEY,
  parseWorkspaceSidebarPinnedState,
  serializeWorkspaceSidebarPinnedState,
  type WorkspaceSidebarPinnedItem,
  type WorkspaceSidebarPinnedSnapshotParseResult,
};
