import assert from "node:assert/strict";
import test from "node:test";

import { blockEditorDocumentFromPlainText } from "../src/editor/document.ts";
import {
  createMemoryWorkspaceDatabaseAdapter,
  createWorkspaceDatabaseRepository,
} from "../src/lib/workspace-database.ts";
import {
  serializeWorkspaceObjectState,
  toWorkspaceObjectSnapshot,
} from "../src/lib/workspace-object-storage.ts";
import {
  createInitialWorkspaceObjectState,
  workspaceObjectReducer,
} from "../src/lib/workspace-objects.ts";

function createStateWithPage(title = "Alpha") {
  return workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    type: "createDocument",
    objectTypeId: "page",
    title,
  });
}

test("workspace database transactions do not expose partial failed state", async () => {
  const adapter = createMemoryWorkspaceDatabaseAdapter({
    failOnCommitNumber: 2,
  });
  const repository = createWorkspaceDatabaseRepository(adapter);
  const initial = createStateWithPage("Alpha");
  await repository.replaceSnapshot(initial, () => new Date("2026-01-01"));

  const next = workspaceObjectReducer(initial, {
    type: "updateEntity",
    id: initial.entities[0].id,
    patch: { title: "Beta" },
  });

  await assert.rejects(
    repository.replaceSnapshot(next, () => new Date("2026-01-02")),
    /Simulated transaction failure/,
  );
  const loaded = await repository.loadSnapshot();
  assert.equal(loaded?.entities[0].title, "Alpha");
});

test("workspace database persists only changed aggregates on common edits", async () => {
  const repository = createWorkspaceDatabaseRepository(
    createMemoryWorkspaceDatabaseAdapter(),
  );
  const initial = createStateWithPage("Alpha");
  await repository.replaceSnapshot(initial, () => new Date("2026-01-01"));

  const next = workspaceObjectReducer(initial, {
    type: "updateEntity",
    id: initial.entities[0].id,
    patch: { body: blockEditorDocumentFromPlainText("Only this changed") },
  });
  const result = await repository.persistChangedSnapshot(
    next,
    () => new Date("2026-01-02"),
  );

  assert.deepEqual(result.writtenKeys, [`object:${initial.entities[0].id}`]);
});

test("workspace database persists indexed trash records and purge tombstones", async () => {
  const adapter = createMemoryWorkspaceDatabaseAdapter();
  const repository = createWorkspaceDatabaseRepository(adapter);
  const initial = createStateWithPage("Disposable");
  await repository.replaceSnapshot(initial, () => new Date("2026-01-01"));

  const trashed = workspaceObjectReducer(initial, {
    id: initial.entities[0].id,
    spaceId: "space-a",
    trashedAt: "2026-08-01T00:00:00.000Z",
    type: "deleteEntity",
  });
  const trashCommit = await repository.persistChangedSnapshot(
    trashed,
    () => new Date("2026-08-01T00:00:01.000Z"),
  );
  const trashRecords = await adapter.list("trash");
  const loadedTrash = await repository.loadSnapshot();

  assert.deepEqual(trashCommit.writtenKeys, [
    "setting:workspace",
    `trash:${initial.entities[0].id}`,
  ]);
  assert.equal(trashRecords[0].entityId, initial.entities[0].id);
  assert.equal(trashRecords[0].spaceId, "space-a");
  assert.equal(trashRecords[0].purgeAfter, "2026-08-31T00:00:00.000Z");
  assert.equal(loadedTrash?.trashRecords[0].entityId, initial.entities[0].id);

  const purged = workspaceObjectReducer(trashed, {
    id: initial.entities[0].id,
    purgedAt: "2026-08-31T00:00:00.000Z",
    type: "purgeEntity",
  });
  await repository.persistChangedSnapshot(
    purged,
    () => new Date("2026-08-31T00:00:01.000Z"),
  );
  const loadedPurge = await repository.loadSnapshot();

  assert.deepEqual(await adapter.list("trash"), []);
  assert.equal(loadedPurge?.entities.length, 0);
  assert.deepEqual(loadedPurge?.tombstones, [
    {
      entityId: initial.entities[0].id,
      purgedAt: "2026-08-31T00:00:00.000Z",
      spaceId: "space-a",
    },
  ]);
});

test("workspace database migrates legacy snapshots idempotently", async () => {
  const repository = createWorkspaceDatabaseRepository(
    createMemoryWorkspaceDatabaseAdapter(),
  );
  const state = createStateWithPage("Migrated");
  const raw = JSON.stringify(toWorkspaceObjectSnapshot(state));

  const first = await repository.migrateLegacySnapshot(raw);
  const second = await repository.migrateLegacySnapshot(raw);
  const loaded = await repository.loadSnapshot();

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(
    loaded ? serializeWorkspaceObjectState(loaded) : null,
    serializeWorkspaceObjectState(state),
  );
});

test("workspace database reports deterministic integrity issues", async () => {
  const state = createStateWithPage("Broken");
  const broken = {
    ...state,
    entities: [{ ...state.entities[0], objectTypeId: "missing" }],
  };
  const repository = createWorkspaceDatabaseRepository(
    createMemoryWorkspaceDatabaseAdapter(),
  );

  await repository.replaceSnapshot(broken, () => new Date("2026-01-01"));
  assert.deepEqual(await repository.auditIntegrity(), [
    { code: "missing-structure", id: state.entities[0].id },
  ]);
  assert.deepEqual(await repository.rebuildIndexes(), [
    { code: "missing-structure", id: state.entities[0].id },
  ]);
});
