import assert from "node:assert/strict";
import test from "node:test";

import { blockEditorDocumentFromPlainText } from "../src/editor/document.ts";
import { createWorkspaceObjectLinkIndex } from "../src/lib/workspace-object-links.ts";
import {
  parseWorkspaceObjectSnapshot,
  serializeWorkspaceObjectState,
} from "../src/lib/workspace-object-storage.ts";
import {
  createInitialWorkspaceObjectState,
  selectActiveEntities,
  selectTrashRecords,
  selectTrashedEntities,
  workspaceObjectReducer,
} from "../src/lib/workspace-objects.ts";
import {
  buildWorkspaceSearchIndex,
  evaluateQuery,
} from "../src/lib/workspace-query-engine.ts";
import { garbageCollectMediaAssets } from "../src/lib/workspace-media-storage.ts";
import {
  createEmptyWorkspaceSyncState,
  createMemoryWorkspaceSyncServer,
  createWorkspaceOperation,
  enqueueWorkspaceOperations,
  pushWorkspaceOperations,
} from "../src/lib/workspace-offline-sync.ts";

function reduce(state, ...actions) {
  return actions.reduce(workspaceObjectReducer, state);
}

function createTwoPageState() {
  return reduce(
    createInitialWorkspaceObjectState(),
    { type: "beginCreate", objectTypeId: "page" },
    {
      id: "created-page-1",
      patch: { title: "Active Alpha" },
      type: "updateEntity",
    },
    { type: "beginCreate", objectTypeId: "page" },
    {
      id: "created-page-2",
      patch: { title: "Trashed Beta" },
      type: "updateEntity",
    },
  );
}

test("trash transitions are space scoped idempotent and retain canonical content", () => {
  const trashedAt = "2026-08-31T12:00:00.000Z";
  const initial = createTwoPageState();
  const trashed = reduce(
    initial,
    {
      id: "created-page-2",
      source: "user",
      spaceId: "space-a",
      trashedAt,
      type: "deleteEntity",
    },
    {
      id: "created-page-2",
      source: "user",
      spaceId: "space-a",
      trashedAt,
      type: "deleteEntity",
    },
  );

  assert.equal(trashed.entities.length, 2);
  assert.deepEqual(
    selectActiveEntities(trashed).map((entity) => entity.id),
    ["created-page-1"],
  );
  assert.deepEqual(selectTrashRecords(trashed), [
    {
      actorId: null,
      entityId: "created-page-2",
      originalActiveEntityId: "created-page-2",
      purgeAfter: "2026-09-30T12:00:00.000Z",
      schemaVersion: 1,
      source: "user",
      spaceId: "space-a",
      trashedAt,
    },
  ]);

  const restored = reduce(
    trashed,
    { id: "created-page-2", type: "restoreEntity" },
    { id: "created-page-2", type: "restoreEntity" },
  );
  assert.deepEqual(selectTrashRecords(restored), []);
  assert.deepEqual(
    selectActiveEntities(restored).map((entity) => entity.id),
    ["created-page-1", "created-page-2"],
  );
  assert.equal(restored.entities[1].title, "Trashed Beta");
});

test("invalid restore and permanent purge are explicit idempotent commands", () => {
  const trashed = workspaceObjectReducer(createTwoPageState(), {
    id: "created-page-2",
    spaceId: "space-a",
    trashedAt: "2026-08-31T12:00:00.000Z",
    type: "deleteEntity",
  });
  const missingStructure = {
    ...trashed,
    structures: trashed.structures.filter(
      (structure) => structure.id !== "page",
    ),
  };
  const failedRestore = workspaceObjectReducer(missingStructure, {
    id: "created-page-2",
    type: "restoreEntity",
  });
  assert.equal(failedRestore.error, "restore-target-invalid");
  assert.equal(selectTrashRecords(failedRestore).length, 1);

  const purged = reduce(
    trashed,
    {
      id: "created-page-2",
      purgedAt: "2026-09-30T12:00:00.000Z",
      type: "purgeEntity",
    },
    {
      id: "created-page-2",
      purgedAt: "2026-09-30T12:00:00.000Z",
      type: "purgeEntity",
    },
  );
  assert.deepEqual(
    purged.entities.map((entity) => entity.id),
    ["created-page-1"],
  );
  assert.deepEqual(purged.trashRecords, []);
  assert.deepEqual(purged.tombstones, [
    {
      entityId: "created-page-2",
      purgedAt: "2026-09-30T12:00:00.000Z",
      spaceId: "space-a",
    },
  ]);
});

test("retention cleanup is bounded resumable and uses exact thirty day purge dates", () => {
  let state = createTwoPageState();
  state = reduce(
    state,
    {
      id: "created-page-1",
      spaceId: "space-a",
      trashedAt: "2026-08-01T00:00:00.000Z",
      type: "deleteEntity",
    },
    {
      id: "created-page-2",
      spaceId: "space-a",
      trashedAt: "2026-08-20T00:00:00.000Z",
      type: "deleteEntity",
    },
  );

  const cleaned = workspaceObjectReducer(state, {
    limit: 1,
    now: "2026-08-31T00:00:00.000Z",
    type: "cleanupTrash",
  });
  assert.deepEqual(
    cleaned.entities.map((entity) => entity.id),
    ["created-page-2"],
  );
  assert.deepEqual(
    cleaned.trashRecords.map((record) => record.entityId),
    ["created-page-2"],
  );
});

test("snapshots migrate and preserve trash records and tombstones", () => {
  const trashed = workspaceObjectReducer(createTwoPageState(), {
    id: "created-page-2",
    spaceId: "space-a",
    trashedAt: "2026-08-31T12:00:00.000Z",
    type: "deleteEntity",
  });
  const parsed = parseWorkspaceObjectSnapshot(
    serializeWorkspaceObjectState(trashed),
  );

  assert.equal(parsed.ok, true);
  assert.equal(parsed.state.trashRecords.length, 1);
  assert.equal(parsed.state.trashRecords[0].entityId, "created-page-2");

  const migrated = parseWorkspaceObjectSnapshot(
    JSON.stringify({
      activeEntityId: null,
      entities: [],
      nextId: 1,
      structures: createInitialWorkspaceObjectState().structures,
      version: 5,
    }),
  );
  assert.equal(migrated.ok, true);
  assert.deepEqual(migrated.state.trashRecords, []);
  assert.deepEqual(migrated.state.tombstones, []);
});

test("normal projections exclude trashed entities and keep recoverable missing references", () => {
  const trashed = workspaceObjectReducer(createTwoPageState(), {
    id: "created-page-2",
    spaceId: "space-a",
    trashedAt: "2026-08-31T12:00:00.000Z",
    type: "deleteEntity",
  });
  const linked = workspaceObjectReducer(trashed, {
    id: "created-page-1",
    patch: {
      body: {
        ...blockEditorDocumentFromPlainText("See Beta"),
        doc: {
          content: [
            {
              attrs: { id: "block:source" },
              content: [
                {
                  marks: [
                    {
                      attrs: { objectId: "created-page-2" },
                      type: "objectLink",
                    },
                  ],
                  text: "See Beta",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "doc",
        },
      },
    },
    type: "updateEntity",
  });
  const active = selectActiveEntities(linked);
  const searchIndex = buildWorkspaceSearchIndex(active);
  const query = {
    filters: { filters: [], operator: "all" },
    resultKind: "object",
    selection: { mode: "all" },
    sorts: [],
    source: "search",
    variables: {},
    version: 1,
  };

  assert.deepEqual(
    searchIndex.objects.map((entry) => entry.entityId),
    ["created-page-1"],
  );
  assert.deepEqual(
    evaluateQuery(query, active).items.map((entity) => entity.id),
    ["created-page-1"],
  );
  assert.deepEqual(
    active.map((entity) => entity.id),
    ["created-page-1"],
  );
  assert.deepEqual(
    selectTrashedEntities(linked).map((entity) => entity.id),
    ["created-page-2"],
  );

  const linkIndex = createWorkspaceObjectLinkIndex(
    linked.entities,
    linked.trashRecords,
  );
  assert.deepEqual(linkIndex.missingTargets, [
    { reason: "trashed", targetId: "created-page-2" },
  ]);
});

test("media garbage collection waits until purge removes the recoverable owner", async () => {
  const assets = [{ id: "asset-1", storageKey: "media:asset-1" }];
  const deleted = [];
  const adapter = {
    async delete(storageKey) {
      deleted.push(storageKey);
    },
    async read() {
      return null;
    },
    async write() {},
  };
  const trashedReferences = [
    { assetId: "asset-1", ownerId: "created-page-2", ownerKind: "object" },
  ];

  assert.deepEqual(
    await garbageCollectMediaAssets(adapter, assets, trashedReferences),
    [],
  );
  assert.deepEqual(await garbageCollectMediaAssets(adapter, assets, []), [
    "asset-1",
  ]);
  assert.deepEqual(deleted, ["media:asset-1"]);
});

test("offline purge operations synchronize idempotently", async () => {
  const sync = createEmptyWorkspaceSyncState();
  const operation = createWorkspaceOperation({
    aggregateKey: "entity:created-page-2",
    createdAt: "2026-09-30T12:00:00.000Z",
    kind: "aggregate-delete",
    payload: {
      entityId: "created-page-2",
      purgedAt: "2026-09-30T12:00:00.000Z",
      spaceId: "space-a",
    },
    spaceId: "space-a",
  });
  const queued = enqueueWorkspaceOperations(sync, [operation, operation]);
  const server = createMemoryWorkspaceSyncServer();
  const pushed = await pushWorkspaceOperations(queued, server);

  assert.equal(queued.outbox.length, 1);
  assert.deepEqual(pushed.acceptedOperationIds, [operation.id]);
  assert.equal(server.changes().length, 1);
  assert.equal(server.changes()[0].deleted, true);
});
