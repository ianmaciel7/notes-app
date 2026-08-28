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
  const result = await repository.persistChangedSnapshot(next, () =>
    new Date("2026-01-02"),
  );

  assert.deepEqual(result.writtenKeys, [`object:${initial.entities[0].id}`]);
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
