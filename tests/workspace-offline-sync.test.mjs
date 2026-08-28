import assert from "node:assert/strict";
import test from "node:test";

import { blockEditorDocumentFromPlainText } from "../src/editor/document.ts";
import {
  createMemoryWorkspaceDatabaseAdapter,
  createWorkspaceDatabaseRepository,
} from "../src/lib/workspace-database.ts";
import {
  applyRemoteChanges,
  createEmptyWorkspaceSyncState,
  createMemoryWorkspaceSyncServer,
  createSyncDiagnostics,
  createWorkspaceOperation,
  enqueueWorkspaceOperations,
  evaluateOfflineCapability,
  offlineCapabilityMatrix,
  pushWorkspaceOperations,
  resolveWorkspaceConflict,
  setMediaSyncState,
  synchronizeWorkspace,
} from "../src/lib/workspace-offline-sync.ts";
import {
  createInitialWorkspaceObjectState,
  workspaceObjectReducer,
} from "../src/lib/workspace-objects.ts";

function pageState(title) {
  return workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    objectTypeId: "page",
    title,
    type: "createDocument",
  });
}

function upsertOperation(spaceId, aggregateKey, payload, baseRevision = 0) {
  return createWorkspaceOperation({
    aggregateKey,
    baseRevision,
    createdAt: "2026-08-28T00:00:00.000Z",
    payload,
    spaceId,
  });
}

test("workspace database commits aggregate changes and sync operations together", async () => {
  const adapter = createMemoryWorkspaceDatabaseAdapter();
  const repository = createWorkspaceDatabaseRepository(adapter);
  const initial = pageState("Offline page");

  await repository.persistChangedSnapshot(
    initial,
    () => new Date("2026-08-28T00:00:00.000Z"),
    { spaceId: "default-space" },
  );

  const records = await adapter.list("operation");
  assert.ok(records.length >= 3);
  assert.ok(
    records.some((record) => record.aggregateId === "object:created-page-1"),
  );
  assert.ok(records.some((record) => record.aggregateId === "setting:workspace"));
  assert.ok(records.some((record) => record.aggregateId === "structure:page"));
  assert.equal(records[0].value.status, "pending");
});

test("fake sync server accepts duplicate retries idempotently and preserves cursor order", async () => {
  const server = createMemoryWorkspaceSyncServer();
  const operation = upsertOperation("default-space", "object:one", {
    title: "One",
  });
  const state = enqueueWorkspaceOperations(createEmptyWorkspaceSyncState(), [
    operation,
    operation,
  ]);

  const first = await synchronizeWorkspace(state, server, "default-space");
  const retried = await synchronizeWorkspace(
    { ...first.state, outbox: [operation] },
    server,
    "default-space",
  );

  assert.equal(server.changes().length, 1);
  assert.deepEqual(first.pushed.acceptedOperationIds, [operation.id]);
  assert.equal(first.state.cursors[0].cursor, "1");
  assert.equal(retried.state.cursors[0].cursor, "1");
});

test("pull applies tombstones without whole-workspace overwrite", () => {
  const state = {
    ...createEmptyWorkspaceSyncState(),
    records: [
      { aggregateKey: "object:one", revision: 1, value: { title: "One" } },
      { aggregateKey: "object:two", revision: 1, value: { title: "Two" } },
    ],
  };

  const next = applyRemoteChanges(state, [
    {
      aggregateKey: "object:one",
      baseRevision: 1,
      deleted: true,
      id: "remote-delete-1",
      operationId: "op-1",
      payload: null,
      remoteRevision: 2,
      sequence: 2,
      spaceId: "default-space",
      updatedAt: "2026-08-28T00:00:01.000Z",
    },
  ]);

  assert.deepEqual(
    next.records.map((record) => record.aggregateKey),
    ["object:two"],
  );
  assert.equal(next.tombstones[0].aggregateKey, "object:one");
});

test("network push failures preserve outbox entries with retry backoff", async () => {
  const operation = upsertOperation("default-space", "object:one", {
    title: "Retry me",
  });
  const server = {
    async pull() {
      return { changes: [], cursor: "0" };
    },
    async push() {
      throw new Error("network unavailable");
    },
  };

  const result = await pushWorkspaceOperations(
    enqueueWorkspaceOperations(createEmptyWorkspaceSyncState(), [operation]),
    server,
    () => new Date("2026-08-28T00:00:00.000Z"),
  );

  assert.deepEqual(result.acceptedOperationIds, []);
  assert.equal(result.outbox[0].status, "failed");
  assert.equal(result.outbox[0].lastError, "network unavailable");
  assert.equal(
    result.outbox[0].retry.nextAttemptAt,
    "2026-08-28T00:00:01.000Z",
  );
});

test("unsafe concurrent remote changes preserve conflict candidates", () => {
  const state = {
    ...createEmptyWorkspaceSyncState(),
    records: [
      { aggregateKey: "object:one", revision: 2, value: { title: "Local" } },
    ],
  };

  const conflicted = applyRemoteChanges(
    state,
    [
      {
        aggregateKey: "object:one",
        baseRevision: 1,
        deleted: false,
        id: "remote-change-1",
        operationId: "op-remote",
        payload: { title: "Remote" },
        remoteRevision: 2,
        sequence: 2,
        spaceId: "default-space",
        updatedAt: "2026-08-28T00:00:01.000Z",
      },
    ],
    () => new Date("2026-08-28T00:00:02.000Z"),
  );
  const resolved = resolveWorkspaceConflict(
    conflicted,
    "conflict:remote-change-1",
    "remote",
  );

  assert.equal(conflicted.conflicts[0].status, "open");
  assert.deepEqual(conflicted.conflicts[0].localCandidate, { title: "Local" });
  assert.deepEqual(conflicted.conflicts[0].remoteCandidate, { title: "Remote" });
  assert.equal(resolved.conflicts[0].status, "resolved");
  assert.deepEqual(resolved.records[0].value, { title: "Remote" });
});

test("offline capability matrix gates online-only actions and allows local editing", () => {
  assert.ok(offlineCapabilityMatrix.length >= 10);
  assert.deepEqual(
    evaluateOfflineCapability("ai-assistant", { online: false }),
    { allowed: false, message: "AI requests require network access." },
  );
  assert.deepEqual(
    evaluateOfflineCapability("block-editor", {
      hasLocalData: true,
      online: false,
    }),
    { allowed: true, message: null },
  );
  assert.equal(
    evaluateOfflineCapability("media-binary", {
      hasLocalData: false,
      online: false,
    }).allowed,
    false,
  );
});

test("diagnostics expose offline pending, conflicts, and media availability", () => {
  const operation = upsertOperation("default-space", "object:one", {
    body: blockEditorDocumentFromPlainText("Queued"),
  });
  const state = setMediaSyncState(
    enqueueWorkspaceOperations(createEmptyWorkspaceSyncState(), [operation]),
    {
      assetId: "asset-1",
      lastError: null,
      localAvailable: false,
      remoteAvailable: true,
      spaceId: "default-space",
      status: "unavailable-offline",
      updatedAt: "2026-08-28T00:00:00.000Z",
    },
  );

  assert.deepEqual(createSyncDiagnostics(state, false), {
    conflictCount: 0,
    mediaUnavailableCount: 1,
    pendingCount: 1,
    retryAt: null,
    status: "offline-pending",
  });
});
