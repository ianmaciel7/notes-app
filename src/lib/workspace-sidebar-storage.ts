const WORKSPACE_SIDEBAR_STORAGE_KEY = "notes-app:workspace-sidebar:v1";

import {
  migrateLegacyCollectionsByStructure,
  type WorkspaceCollectionRecord,
} from "./workspace-domain-identities.ts";

const WORKSPACE_SIDEBAR_SCHEMA_VERSION = 2;

type WorkspaceSidebarCustomSection = {
  id: string;
  label: string;
  open: boolean;
};

type WorkspaceSidebarState = {
  collectionRecords: Record<string, WorkspaceCollectionRecord>;
  customSections: WorkspaceSidebarCustomSection[];
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

function toCollectionRecordMap(
  value: unknown,
): Record<string, WorkspaceCollectionRecord> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([id, record]) => {
      if (!isRecord(record)) return [];
      const name = typeof record.name === "string" ? record.name.trim() : "";
      const structureId =
        typeof record.structureId === "string" ? record.structureId.trim() : "";
      if (!id.trim() || record.id !== id || !name || !structureId) return [];
      return [[id, { id, name, structureId }]];
    }),
  );
}

function collectionRecordsFromLegacy(
  value: unknown,
): Record<string, WorkspaceCollectionRecord> {
  return Object.fromEntries(
    migrateLegacyCollectionsByStructure(toStringArrayMap(value)).map(
      (record) => [record.id, record],
    ),
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

  if (!isRecord(value)) {
    return { ok: false, reason: "invalid-record" };
  }

  if (value.version === 1) {
    return {
      ok: true,
      state: {
        collectionRecords: collectionRecordsFromLegacy(
          value.objectTypeCollections,
        ),
        customSections: toCustomSections(value.customSections),
        objectTypeQueries: toStringArrayMap(value.objectTypeQueries),
      },
    };
  }

  if (value.version !== WORKSPACE_SIDEBAR_SCHEMA_VERSION) {
    return { ok: false, reason: "invalid-record" };
  }

  return {
    ok: true,
    state: {
      collectionRecords: toCollectionRecordMap(value.collectionRecords),
      customSections: toCustomSections(value.customSections),
      objectTypeQueries: toStringArrayMap(value.objectTypeQueries),
    },
  };
}

function serializeWorkspaceSidebarState(state: WorkspaceSidebarState): string {
  return JSON.stringify({
    version: WORKSPACE_SIDEBAR_SCHEMA_VERSION,
    collectionRecords: toCollectionRecordMap(state.collectionRecords),
    customSections: toCustomSections(state.customSections),
    objectTypeQueries: toStringArrayMap(state.objectTypeQueries),
  } satisfies WorkspaceSidebarSnapshot);
}

export {
  parseWorkspaceSidebarState,
  serializeWorkspaceSidebarState,
  WORKSPACE_SIDEBAR_STORAGE_KEY,
  type WorkspaceSidebarSnapshotParseResult,
  type WorkspaceSidebarState,
};
