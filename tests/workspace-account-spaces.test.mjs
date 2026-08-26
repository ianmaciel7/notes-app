import assert from "node:assert/strict";
import test from "node:test";

import { blockEditorDocumentFromPlainText } from "../src/editor/document.ts";
import {
  createInitialActiveSpaceState,
  createSearchIndex,
  createSpace,
  defaultSessionCachePolicy,
  deleteSpace,
  executeQueryInSpace,
  migrateSingleWorkspaceToDefaultSpace,
  readMediaAssetInSpace,
  readSyncCursorInSpace,
  renameSpace,
  replaceSpaceRepository,
  requireRemoteAuthorization,
  resolveEntityInSpace,
  searchEntitiesInSpace,
  signOutSession,
  switchActiveSpace,
  validateContentReferencesInSpace,
  validateRelationTargetsInSpace,
} from "../src/lib/workspace-account-spaces.ts";
import {
  createObjectReferenceMark,
  selectForwardContentReferences,
} from "../src/lib/workspace-object-links.ts";
import {
  createInitialWorkspaceObjectState,
  workspaceObjectReducer,
} from "../src/lib/workspace-objects.ts";

function expectSuccess(result) {
  assert.equal(result.ok, true, result.ok ? undefined : result.error.message);
  return result.value;
}

function expectFailure(result, code) {
  assert.equal(result.ok, false);
  assert.equal(result.error.code, code);
}

function page(id, title, body = title, propertyValues = {}) {
  return {
    body: blockEditorDocumentFromPlainText(body),
    collections: [],
    createdAt: "2026-08-25T00:00:00.000Z",
    id,
    kind: "document",
    objectTypeId: "page",
    propertyValues,
    tags: [],
    title,
  };
}

function repositoryWithEntities(spaceId, entities) {
  return {
    mediaAssets: [],
    objectState: {
      ...createInitialWorkspaceObjectState(),
      activeEntityId: entities.at(-1)?.id ?? null,
      entities,
      nextId: entities.length + 1,
    },
    operations: [],
    searchIndex: createSearchIndex(spaceId, entities),
    syncCursors: [],
  };
}

function twoSpaceState() {
  const first = migrateSingleWorkspaceToDefaultSpace({
    ...createInitialWorkspaceObjectState(),
    activeEntityId: "same-id",
    entities: [page("same-id", "Alpha evidence")],
    nextId: 2,
  });
  const withSecond = expectSuccess(
    createSpace(
      first,
      { id: "second-space", name: "Second" },
      () => new Date("2026-08-25T00:00:00.000Z"),
    ),
  );
  return expectSuccess(
    replaceSpaceRepository(
      withSecond,
      "second-space",
      repositoryWithEntities("second-space", [page("same-id", "Beta notes")]),
    ),
  );
}

test("active Space service isolates equal object ids", () => {
  const state = twoSpaceState();

  assert.equal(
    resolveEntityInSpace(state, "default-space", "same-id")?.title,
    "Alpha evidence",
  );
  assert.equal(
    resolveEntityInSpace(state, "second-space", "same-id")?.title,
    "Beta notes",
  );
});

test("search and query execution never read another Space", () => {
  const state = twoSpaceState();

  assert.deepEqual(
    searchEntitiesInSpace(state, "default-space", "Beta").map(
      (entity) => entity.title,
    ),
    [],
  );
  assert.deepEqual(
    executeQueryInSpace(state, "default-space", {
      filters: [{ field: "title", operator: "contains", value: "Beta" }],
      sorts: [{ direction: "ascending", field: "title" }],
      version: 1,
    }).map((entity) => entity.title),
    [],
  );
});

test("relations and content links reject targets from another Space", () => {
  const first = migrateSingleWorkspaceToDefaultSpace({
    ...createInitialWorkspaceObjectState(),
    activeEntityId: "local-id",
    entities: [page("local-id", "Local")],
    nextId: 2,
  });
  const withSecond = expectSuccess(
    createSpace(
      first,
      { id: "second-space", name: "Second" },
      () => new Date("2026-08-25T00:00:00.000Z"),
    ),
  );
  const state = expectSuccess(
    replaceSpaceRepository(
      withSecond,
      "second-space",
      repositoryWithEntities("second-space", [page("external-id", "External")]),
    ),
  );

  expectFailure(
    validateRelationTargetsInSpace(state, "default-space", {
      related: { entity: [{ id: "external-id" }], type: "entity" },
    }),
    "cross-space-reference",
  );

  const source = page("source", "Source");
  source.body = {
    schemaVersion: 1,
    doc: {
      content: [
        {
          content: [
            {
              marks: [createObjectReferenceMark("external-id")],
              text: "Other",
              type: "text",
            },
          ],
          type: "paragraph",
        },
      ],
      type: "doc",
    },
  };
  expectFailure(
    validateContentReferencesInSpace(
      state,
      "default-space",
      selectForwardContentReferences([source]),
    ),
    "cross-space-reference",
  );
});

test("media assets and sync cursors are keyed by Space", () => {
  const first = createInitialActiveSpaceState(
    "local-account",
    () => new Date("2026-08-25T00:00:00.000Z"),
  );
  const withSecond = expectSuccess(
    createSpace(
      first,
      { id: "second-space", name: "Second" },
      () => new Date("2026-08-25T00:00:00.000Z"),
    ),
  );
  const state = expectSuccess(
    replaceSpaceRepository(withSecond, "second-space", {
      ...repositoryWithEntities("second-space", []),
      mediaAssets: [
        {
          byteLength: 4,
          createdAt: "2026-08-25T00:00:00.000Z",
          fileName: "file.txt",
          hash: "hash-1",
          id: "asset-1",
          mimeType: "text/plain",
          state: "stored",
          storageKey: "media:hash-1",
          updatedAt: "2026-08-25T00:00:00.000Z",
        },
      ],
      syncCursors: [
        {
          cursor: "cursor-2",
          scope: "objects",
          spaceId: "second-space",
          updatedAt: "2026-08-25T00:00:00.000Z",
        },
      ],
    }),
  );

  assert.equal(readMediaAssetInSpace(state, "default-space", "asset-1"), null);
  assert.equal(
    readMediaAssetInSpace(state, "second-space", "asset-1")?.fileName,
    "file.txt",
  );
  assert.equal(readSyncCursorInSpace(state, "default-space", "objects"), null);
  assert.equal(
    readSyncCursorInSpace(state, "second-space", "objects")?.cursor,
    "cursor-2",
  );
});

test("Space lifecycle guards switching rename and destructive deletion", () => {
  const state = expectSuccess(
    createSpace(createInitialActiveSpaceState(), {
      id: "second-space",
      name: "Second",
    }),
  );

  assert.equal(
    expectSuccess(switchActiveSpace(state, "default-space")).activeSpaceId,
    "default-space",
  );
  assert.equal(
    expectSuccess(renameSpace(state, "second-space", "Renamed")).spaces[1].space
      .name,
    "Renamed",
  );
  expectFailure(
    deleteSpace(state, "second-space", "Wrong"),
    "default-space-required",
  );
  assert.equal(
    expectSuccess(deleteSpace(state, "second-space", "Second")).spaces.length,
    1,
  );
  expectFailure(
    deleteSpace(createInitialActiveSpaceState(), "default-space", "Personal"),
    "last-space-delete",
  );
});

test("auth boundary separates remote authorization from local cache", () => {
  const state = {
    ...createInitialActiveSpaceState(),
    session: {
      accountId: "local-account",
      expiresAt: "2026-08-25T00:00:00.000Z",
      id: "session-1",
      offlineCachePolicy: defaultSessionCachePolicy,
      provider: "test",
      status: "authenticated",
      userId: "user-1",
    },
  };

  expectFailure(
    requireRemoteAuthorization(
      state.session,
      () => new Date("2026-08-25T00:00:01.000Z"),
    ),
    "session-expired",
  );
  const signedOut = signOutSession(state);
  assert.equal(signedOut.session?.status, "signed-out");
  assert.equal(signedOut.spaces.length, state.spaces.length);
});

test("current single workspace migrates transactionally into the default Space", () => {
  const workspace = workspaceObjectReducer(
    createInitialWorkspaceObjectState(),
    {
      objectTypeId: "page",
      type: "beginCreate",
    },
  );
  const migrated = migrateSingleWorkspaceToDefaultSpace(workspace);

  assert.equal(migrated.activeSpaceId, "default-space");
  assert.equal(migrated.spaces.length, 1);
  assert.equal(
    migrated.spaces[0].repository.objectState.entities[0].id,
    workspace.entities[0].id,
  );
});
