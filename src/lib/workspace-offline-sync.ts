import type { WorkspaceDatabaseRecordKey } from "./workspace-database.ts";
import type { MediaAssetId } from "./workspace-media-storage.ts";

type OfflineCapabilityState =
  | "available-offline"
  | "local-data-only"
  | "degraded-offline"
  | "online-required";

type OfflineCapabilityId =
  | "ai-assistant"
  | "block-editor"
  | "calendar-integrations"
  | "import-export"
  | "local-query-index"
  | "media-binary"
  | "media-metadata"
  | "mcp-server"
  | "object-navigation"
  | "public-api"
  | "remote-enrichment"
  | "remote-search"
  | "task-editing";

type OfflineCapability = {
  readonly id: OfflineCapabilityId;
  readonly label: string;
  readonly offlineState: OfflineCapabilityState;
  readonly localDataRequired: boolean;
  readonly unavailableMessage: string | null;
};

type WorkspaceOperationKind =
  | "aggregate-delete"
  | "aggregate-upsert"
  | "media-download"
  | "media-upload";

type WorkspaceOperationStatus = "acked" | "failed" | "in-flight" | "pending";

type WorkspaceOperation = {
  readonly aggregateKey: WorkspaceDatabaseRecordKey;
  readonly baseRevision: number;
  readonly createdAt: string;
  readonly id: string;
  readonly idempotencyKey: string;
  readonly kind: WorkspaceOperationKind;
  readonly lastError: string | null;
  readonly payload: unknown;
  readonly retry: WorkspaceOperationRetry;
  readonly spaceId: string;
  readonly status: WorkspaceOperationStatus;
};

type WorkspaceOperationRetry = {
  readonly attempts: number;
  readonly nextAttemptAt: string | null;
};

type WorkspaceSyncCursor = {
  readonly cursor: string;
  readonly scope: "workspace";
  readonly spaceId: string;
  readonly updatedAt: string;
};

type WorkspaceRemoteChange = {
  readonly aggregateKey: WorkspaceDatabaseRecordKey;
  readonly baseRevision: number;
  readonly deleted: boolean;
  readonly id: string;
  readonly operationId: string;
  readonly payload: unknown;
  readonly remoteRevision: number;
  readonly sequence: number;
  readonly spaceId: string;
  readonly updatedAt: string;
};

type WorkspaceTombstone = {
  readonly aggregateKey: WorkspaceDatabaseRecordKey;
  readonly deletedAt: string;
  readonly remoteRevision: number;
  readonly spaceId: string;
};

type WorkspaceConflict = {
  readonly aggregateKey: WorkspaceDatabaseRecordKey;
  readonly detectedAt: string;
  readonly id: string;
  readonly localCandidate: unknown;
  readonly remoteCandidate: unknown;
  readonly spaceId: string;
  readonly status: "open" | "resolved";
};

type MediaSyncStatus =
  | "available-local"
  | "available-remote"
  | "missing"
  | "queued-download"
  | "queued-upload"
  | "syncing"
  | "unavailable-offline";

type WorkspaceMediaSyncState = {
  readonly assetId: MediaAssetId;
  readonly lastError: string | null;
  readonly localAvailable: boolean;
  readonly remoteAvailable: boolean;
  readonly spaceId: string;
  readonly status: MediaSyncStatus;
  readonly updatedAt: string;
};

type WorkspaceSyncRecord = {
  readonly aggregateKey: WorkspaceDatabaseRecordKey;
  readonly value: unknown;
  readonly revision: number;
};

type WorkspaceSyncState = {
  readonly appliedRemoteChangeIds: readonly string[];
  readonly conflicts: readonly WorkspaceConflict[];
  readonly cursors: readonly WorkspaceSyncCursor[];
  readonly media: readonly WorkspaceMediaSyncState[];
  readonly outbox: readonly WorkspaceOperation[];
  readonly records: readonly WorkspaceSyncRecord[];
  readonly tombstones: readonly WorkspaceTombstone[];
};

type SyncPushResult = {
  readonly acceptedOperationIds: readonly string[];
  readonly outbox: readonly WorkspaceOperation[];
};

type SyncPullResult = {
  readonly conflicts: readonly WorkspaceConflict[];
  readonly cursor: WorkspaceSyncCursor;
  readonly records: readonly WorkspaceSyncRecord[];
  readonly tombstones: readonly WorkspaceTombstone[];
};

type SyncRunResult = {
  readonly pushed: SyncPushResult;
  readonly pulled: SyncPullResult;
  readonly state: WorkspaceSyncState;
};

type WorkspaceSyncServer = {
  readonly pull: (
    spaceId: string,
    cursor: string | null,
  ) => Promise<{
    readonly changes: readonly WorkspaceRemoteChange[];
    readonly cursor: string;
  }>;
  readonly push: (
    operations: readonly WorkspaceOperation[],
  ) => Promise<readonly WorkspaceRemoteChange[]>;
};

const offlineCapabilityMatrix: readonly OfflineCapability[] = [
  {
    id: "object-navigation",
    label: "Object navigation",
    localDataRequired: true,
    offlineState: "local-data-only",
    unavailableMessage: null,
  },
  {
    id: "block-editor",
    label: "Block editing",
    localDataRequired: true,
    offlineState: "available-offline",
    unavailableMessage: null,
  },
  {
    id: "task-editing",
    label: "Task editing",
    localDataRequired: true,
    offlineState: "available-offline",
    unavailableMessage: null,
  },
  {
    id: "local-query-index",
    label: "Local query index",
    localDataRequired: true,
    offlineState: "local-data-only",
    unavailableMessage: null,
  },
  {
    id: "media-metadata",
    label: "Media metadata",
    localDataRequired: true,
    offlineState: "local-data-only",
    unavailableMessage: null,
  },
  {
    id: "media-binary",
    label: "Media bytes",
    localDataRequired: true,
    offlineState: "degraded-offline",
    unavailableMessage:
      "Remote media bytes must be downloaded before offline use.",
  },
  {
    id: "import-export",
    label: "Import and export",
    localDataRequired: true,
    offlineState: "degraded-offline",
    unavailableMessage:
      "Remote sources and destinations require network access.",
  },
  {
    id: "ai-assistant",
    label: "AI assistant",
    localDataRequired: false,
    offlineState: "online-required",
    unavailableMessage: "AI requests require network access.",
  },
  {
    id: "calendar-integrations",
    label: "Calendar integrations",
    localDataRequired: false,
    offlineState: "online-required",
    unavailableMessage: "Calendar sync requires network access.",
  },
  {
    id: "mcp-server",
    label: "MCP server",
    localDataRequired: false,
    offlineState: "online-required",
    unavailableMessage: "External MCP actions require network access.",
  },
  {
    id: "public-api",
    label: "Public API",
    localDataRequired: false,
    offlineState: "online-required",
    unavailableMessage: "Public API calls require network access.",
  },
  {
    id: "remote-enrichment",
    label: "Remote enrichment",
    localDataRequired: false,
    offlineState: "online-required",
    unavailableMessage: "Remote enrichment requires network access.",
  },
  {
    id: "remote-search",
    label: "Remote search",
    localDataRequired: false,
    offlineState: "online-required",
    unavailableMessage: "Server search requires network access.",
  },
];

function createEmptyWorkspaceSyncState(): WorkspaceSyncState {
  return {
    appliedRemoteChangeIds: [],
    conflicts: [],
    cursors: [],
    media: [],
    outbox: [],
    records: [],
    tombstones: [],
  };
}

function createWorkspaceOperation(input: {
  readonly aggregateKey: WorkspaceDatabaseRecordKey;
  readonly baseRevision?: number;
  readonly createdAt: string;
  readonly kind?: WorkspaceOperationKind;
  readonly payload: unknown;
  readonly spaceId: string;
}): WorkspaceOperation {
  const baseRevision = input.baseRevision ?? 0;
  const kind = input.kind ?? "aggregate-upsert";
  return {
    aggregateKey: input.aggregateKey,
    baseRevision,
    createdAt: input.createdAt,
    id: operationId(input.spaceId, input.aggregateKey, baseRevision, kind),
    idempotencyKey: operationId(
      input.spaceId,
      input.aggregateKey,
      baseRevision,
      kind,
    ),
    kind,
    lastError: null,
    payload: input.payload,
    retry: { attempts: 0, nextAttemptAt: null },
    spaceId: input.spaceId,
    status: "pending",
  };
}

function enqueueWorkspaceOperations(
  state: WorkspaceSyncState,
  operations: readonly WorkspaceOperation[],
): WorkspaceSyncState {
  const known = new Set(
    state.outbox.map((operation) => operation.idempotencyKey),
  );
  const next: WorkspaceOperation[] = [];
  for (const operation of operations) {
    if (known.has(operation.idempotencyKey)) continue;
    known.add(operation.idempotencyKey);
    next.push(operation);
  }
  return { ...state, outbox: [...state.outbox, ...next] };
}

function operationId(
  spaceId: string,
  aggregateKey: WorkspaceDatabaseRecordKey,
  baseRevision: number,
  kind: WorkspaceOperationKind,
): string {
  return [
    "op",
    encodeURIComponent(spaceId),
    encodeURIComponent(aggregateKey),
    baseRevision,
    kind,
  ].join(":");
}

function backoffAfterAttempt(attempts: number, now: Date): string {
  const delay = Math.min(30_000, 1_000 * 2 ** Math.max(0, attempts - 1));
  return new Date(now.getTime() + delay).toISOString();
}

function markOperationFailure(
  operation: WorkspaceOperation,
  error: string,
  now: Date,
): WorkspaceOperation {
  const attempts = operation.retry.attempts + 1;
  return {
    ...operation,
    lastError: error,
    retry: {
      attempts,
      nextAttemptAt: backoffAfterAttempt(attempts, now),
    },
    status: "failed",
  };
}

function operationReady(operation: WorkspaceOperation, now: Date): boolean {
  if (operation.status === "acked" || operation.status === "in-flight")
    return false;
  if (!operation.retry.nextAttemptAt) return true;
  return Date.parse(operation.retry.nextAttemptAt) <= now.getTime();
}

async function pushWorkspaceOperations(
  state: WorkspaceSyncState,
  server: WorkspaceSyncServer,
  now: () => Date = () => new Date(),
): Promise<SyncPushResult> {
  const timestamp = now();
  const ready = state.outbox.filter((operation) =>
    operationReady(operation, timestamp),
  );
  if (ready.length === 0)
    return { acceptedOperationIds: [], outbox: state.outbox };
  try {
    await server.push(
      ready.map((operation) => ({ ...operation, status: "in-flight" })),
    );
  } catch (error) {
    return {
      acceptedOperationIds: [],
      outbox: state.outbox.map((operation) =>
        ready.some((item) => item.id === operation.id)
          ? markOperationFailure(operation, errorMessage(error), timestamp)
          : operation,
      ),
    };
  }
  const accepted = new Set(ready.map((operation) => operation.id));
  return {
    acceptedOperationIds: [...accepted],
    outbox: state.outbox.map((operation) =>
      accepted.has(operation.id)
        ? { ...operation, lastError: null, status: "acked" }
        : operation,
    ),
  };
}

async function pullWorkspaceChanges(
  state: WorkspaceSyncState,
  server: WorkspaceSyncServer,
  spaceId: string,
  now: () => Date = () => new Date(),
): Promise<SyncPullResult> {
  const existingCursor = readCursor(state, spaceId);
  const response = await server.pull(spaceId, existingCursor?.cursor ?? null);
  const pulled = applyRemoteChanges(state, response.changes, now);
  return {
    conflicts: pulled.conflicts,
    cursor: {
      cursor: response.cursor,
      scope: "workspace",
      spaceId,
      updatedAt: now().toISOString(),
    },
    records: pulled.records,
    tombstones: pulled.tombstones,
  };
}

async function synchronizeWorkspace(
  state: WorkspaceSyncState,
  server: WorkspaceSyncServer,
  spaceId: string,
  now: () => Date = () => new Date(),
): Promise<SyncRunResult> {
  const pushed = await pushWorkspaceOperations(state, server, now);
  const afterPush = { ...state, outbox: pushed.outbox };
  const pulled = await pullWorkspaceChanges(afterPush, server, spaceId, now);
  const nextState = {
    ...afterPush,
    conflicts: pulled.conflicts,
    cursors: upsertCursor(afterPush.cursors, pulled.cursor),
    records: pulled.records,
    tombstones: pulled.tombstones,
  };
  return { pulled, pushed, state: nextState };
}

function applyRemoteChanges(
  state: WorkspaceSyncState,
  changes: readonly WorkspaceRemoteChange[],
  now: () => Date = () => new Date(),
): WorkspaceSyncState {
  let records: readonly WorkspaceSyncRecord[] = [...state.records];
  let tombstones: readonly WorkspaceTombstone[] = [...state.tombstones];
  let conflicts: readonly WorkspaceConflict[] = [...state.conflicts];
  const applied = new Set(state.appliedRemoteChangeIds);
  for (const change of changes) {
    if (applied.has(change.id)) continue;
    const local = records.find(
      (record) => record.aggregateKey === change.aggregateKey,
    );
    if (changeConflicts(local, change)) {
      conflicts = upsertConflict(
        conflicts,
        createConflict(change, local?.value, now),
      );
      applied.add(change.id);
      continue;
    }
    records = applyRecordChange(records, change);
    tombstones = applyTombstoneChange(tombstones, change);
    applied.add(change.id);
  }
  return {
    ...state,
    appliedRemoteChangeIds: [...applied],
    conflicts,
    records,
    tombstones,
  };
}

function changeConflicts(
  local: WorkspaceSyncRecord | undefined,
  change: WorkspaceRemoteChange,
): boolean {
  return Boolean(local && local.revision > change.baseRevision);
}

function createConflict(
  change: WorkspaceRemoteChange,
  localCandidate: unknown,
  now: () => Date,
): WorkspaceConflict {
  return {
    aggregateKey: change.aggregateKey,
    detectedAt: now().toISOString(),
    id: `conflict:${change.id}`,
    localCandidate,
    remoteCandidate: change.deleted ? null : change.payload,
    spaceId: change.spaceId,
    status: "open",
  };
}

function applyRecordChange(
  records: readonly WorkspaceSyncRecord[],
  change: WorkspaceRemoteChange,
): readonly WorkspaceSyncRecord[] {
  if (change.deleted) {
    return records.filter(
      (record) => record.aggregateKey !== change.aggregateKey,
    );
  }
  const next = {
    aggregateKey: change.aggregateKey,
    revision: change.remoteRevision,
    value: change.payload,
  };
  const replaced = records.map((record) =>
    record.aggregateKey === change.aggregateKey ? next : record,
  );
  return replaced.some((record) => record.aggregateKey === change.aggregateKey)
    ? replaced
    : [...records, next];
}

function applyTombstoneChange(
  tombstones: readonly WorkspaceTombstone[],
  change: WorkspaceRemoteChange,
): readonly WorkspaceTombstone[] {
  if (!change.deleted) {
    return tombstones.filter(
      (item) => item.aggregateKey !== change.aggregateKey,
    );
  }
  const tombstone = {
    aggregateKey: change.aggregateKey,
    deletedAt: change.updatedAt,
    remoteRevision: change.remoteRevision,
    spaceId: change.spaceId,
  };
  return [
    ...tombstones.filter((item) => item.aggregateKey !== change.aggregateKey),
    tombstone,
  ];
}

function upsertConflict(
  conflicts: readonly WorkspaceConflict[],
  conflict: WorkspaceConflict,
): readonly WorkspaceConflict[] {
  if (conflicts.some((item) => item.id === conflict.id)) return conflicts;
  return [...conflicts, conflict];
}

function upsertCursor(
  cursors: readonly WorkspaceSyncCursor[],
  cursor: WorkspaceSyncCursor,
): readonly WorkspaceSyncCursor[] {
  return [
    ...cursors.filter(
      (item) =>
        !(item.spaceId === cursor.spaceId && item.scope === cursor.scope),
    ),
    cursor,
  ];
}

function readCursor(
  state: WorkspaceSyncState,
  spaceId: string,
): WorkspaceSyncCursor | null {
  return state.cursors.find((cursor) => cursor.spaceId === spaceId) ?? null;
}

function resolveWorkspaceConflict(
  state: WorkspaceSyncState,
  conflictId: string,
  choice: "local" | "remote",
): WorkspaceSyncState {
  const conflict = state.conflicts.find((item) => item.id === conflictId);
  if (!conflict) return state;
  const value =
    choice === "local" ? conflict.localCandidate : conflict.remoteCandidate;
  return {
    ...state,
    conflicts: state.conflicts.map((item) =>
      item.id === conflictId ? { ...item, status: "resolved" } : item,
    ),
    records:
      value === null
        ? state.records.filter(
            (record) => record.aggregateKey !== conflict.aggregateKey,
          )
        : applyRecordChange(state.records, {
            aggregateKey: conflict.aggregateKey,
            baseRevision: 0,
            deleted: false,
            id: `resolved:${conflictId}`,
            operationId: conflictId,
            payload: value,
            remoteRevision:
              readLocalRevision(state.records, conflict.aggregateKey) + 1,
            sequence: 0,
            spaceId: conflict.spaceId,
            updatedAt: conflict.detectedAt,
          }),
  };
}

function readLocalRevision(
  records: readonly WorkspaceSyncRecord[],
  aggregateKey: WorkspaceDatabaseRecordKey,
): number {
  return (
    records.find((record) => record.aggregateKey === aggregateKey)?.revision ??
    0
  );
}

function setMediaSyncState(
  state: WorkspaceSyncState,
  media: WorkspaceMediaSyncState,
): WorkspaceSyncState {
  return {
    ...state,
    media: [
      ...state.media.filter(
        (item) =>
          !(item.spaceId === media.spaceId && item.assetId === media.assetId),
      ),
      media,
    ],
  };
}

function evaluateOfflineCapability(
  id: OfflineCapabilityId,
  options: {
    readonly hasLocalData?: boolean;
    readonly online: boolean;
  },
): { readonly allowed: boolean; readonly message: string | null } {
  const capability = offlineCapabilityMatrix.find((item) => item.id === id);
  if (!capability)
    return { allowed: false, message: "Unknown offline capability." };
  if (options.online) return { allowed: true, message: null };
  if (capability.offlineState === "online-required") {
    return { allowed: false, message: capability.unavailableMessage };
  }
  if (capability.localDataRequired && !options.hasLocalData) {
    return {
      allowed: false,
      message:
        capability.unavailableMessage ??
        "Local data is required before offline use.",
    };
  }
  return { allowed: true, message: capability.unavailableMessage };
}

function createSyncDiagnostics(state: WorkspaceSyncState, online: boolean) {
  const pending = state.outbox.filter(
    (operation) => operation.status !== "acked",
  );
  const failed = pending.filter((operation) => operation.status === "failed");
  const conflictCount = state.conflicts.filter(
    (conflict) => conflict.status === "open",
  ).length;
  const status = diagnosticStatus(
    online,
    pending.length,
    failed.length,
    conflictCount,
  );
  return {
    conflictCount,
    mediaUnavailableCount: state.media.filter(
      (media) =>
        media.status === "missing" || media.status === "unavailable-offline",
    ).length,
    pendingCount: pending.length,
    retryAt:
      failed
        .map((operation) => operation.retry.nextAttemptAt)
        .filter(Boolean)[0] ?? null,
    status,
  };
}

function diagnosticStatus(
  online: boolean,
  pendingCount: number,
  failedCount: number,
  conflictCount: number,
) {
  if (conflictCount > 0) return "conflict";
  if (!online) return pendingCount > 0 ? "offline-pending" : "offline";
  if (failedCount > 0) return "error";
  if (pendingCount > 0) return "pending";
  return "synced";
}

function createMemoryWorkspaceSyncServer(
  initialChanges: readonly WorkspaceRemoteChange[] = [],
): WorkspaceSyncServer & {
  readonly changes: () => readonly WorkspaceRemoteChange[];
} {
  const changes = [...initialChanges];
  const seen = new Map<string, WorkspaceRemoteChange>();
  return {
    changes: () => [...changes],
    async pull(spaceId, cursor) {
      const after = cursor ? Number.parseInt(cursor, 10) : 0;
      const next = changes.filter(
        (change) => change.spaceId === spaceId && change.sequence > after,
      );
      return {
        changes: next,
        cursor: String(
          Math.max(after, ...next.map((change) => change.sequence), 0),
        ),
      };
    },
    async push(operations) {
      const accepted: WorkspaceRemoteChange[] = [];
      for (const operation of operations) {
        const previous = seen.get(operation.idempotencyKey);
        if (previous) {
          accepted.push(previous);
          continue;
        }
        const change = remoteChangeFromOperation(operation, changes.length + 1);
        seen.set(operation.idempotencyKey, change);
        changes.push(change);
        accepted.push(change);
      }
      return accepted;
    },
  };
}

function remoteChangeFromOperation(
  operation: WorkspaceOperation,
  sequence: number,
): WorkspaceRemoteChange {
  return {
    aggregateKey: operation.aggregateKey,
    baseRevision: operation.baseRevision,
    deleted: operation.kind === "aggregate-delete",
    id: `change:${sequence}`,
    operationId: operation.id,
    payload: operation.payload,
    remoteRevision: operation.baseRevision + 1,
    sequence,
    spaceId: operation.spaceId,
    updatedAt: operation.createdAt,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Sync operation failed.";
}

export type {
  MediaSyncStatus,
  OfflineCapability,
  OfflineCapabilityId,
  OfflineCapabilityState,
  SyncPullResult,
  SyncPushResult,
  SyncRunResult,
  WorkspaceConflict,
  WorkspaceMediaSyncState,
  WorkspaceOperation,
  WorkspaceOperationKind,
  WorkspaceOperationRetry,
  WorkspaceOperationStatus,
  WorkspaceRemoteChange,
  WorkspaceSyncCursor,
  WorkspaceSyncRecord,
  WorkspaceSyncServer,
  WorkspaceSyncState,
  WorkspaceTombstone,
};
export {
  applyRemoteChanges,
  createEmptyWorkspaceSyncState,
  createMemoryWorkspaceSyncServer,
  createSyncDiagnostics,
  createWorkspaceOperation,
  enqueueWorkspaceOperations,
  evaluateOfflineCapability,
  offlineCapabilityMatrix,
  pullWorkspaceChanges,
  pushWorkspaceOperations,
  resolveWorkspaceConflict,
  setMediaSyncState,
  synchronizeWorkspace,
};
