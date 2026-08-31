import assert from "node:assert/strict";
import test from "node:test";

import {
  BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  blockEditorDocumentToPlainText,
} from "../src/editor/document.ts";
import { parseWorkspaceObjectSnapshot } from "../src/lib/workspace-object-storage.ts";
import {
  createInitialWorkspaceObjectState,
  WORKSPACE_OBJECT_SCHEMA_VERSION,
  workspaceObjectReducer,
} from "../src/lib/workspace-objects.ts";
import {
  parseWorkspaceSidebarState,
  serializeWorkspaceSidebarState,
} from "../src/lib/workspace-sidebar-storage.ts";

test("new document entities use current block schema and typed property map", () => {
  const state = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    type: "beginCreate",
    objectTypeId: "page",
  });

  assert.equal(WORKSPACE_OBJECT_SCHEMA_VERSION, 6);
  assert.equal(
    state.entities[0].body.schemaVersion,
    BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  );
  assert.equal(state.entities[0].body.doc.type, "doc");
  assert.equal(state.entities[0].body.doc.content[0].type, "paragraph");
  assert.match(state.entities[0].body.doc.content[0].attrs.id, /^block:/);
  assert.deepEqual(state.entities[0].propertyValues.title, {
    title: { value: "" },
    type: "title",
  });
});

test("sidebar collection records retain their ids when display names change", () => {
  const migrated = parseWorkspaceSidebarState(
    JSON.stringify({
      customSections: [],
      objectTypeCollections: { page: ["Reading list"] },
      objectTypeQueries: {},
      version: 1,
    }),
  );

  assert.equal(migrated.ok, true);
  assert.deepEqual(migrated.state.collectionRecords, {
    "collection:page:reading-list": {
      id: "collection:page:reading-list",
      name: "Reading list",
      structureId: "page",
    },
  });

  const restored = parseWorkspaceSidebarState(
    serializeWorkspaceSidebarState({
      ...migrated.state,
      collectionRecords: {
        "collection:page:reading-list": {
          id: "collection:page:reading-list",
          name: "Reference shelf",
          structureId: "page",
        },
      },
    }),
  );

  assert.equal(restored.ok, true);
  assert.deepEqual(restored.state.collectionRecords, {
    "collection:page:reading-list": {
      id: "collection:page:reading-list",
      name: "Reference shelf",
      structureId: "page",
    },
  });
});

test("version 4 identities and legacy block bodies migrate atomically", () => {
  const parsed = parseWorkspaceObjectSnapshot(
    JSON.stringify({
      activeEntityId: "page-1",
      entities: [
        {
          id: "tag-existing",
          title: "Research",
          createdAt: "2026-01-01T00:00:00.000Z",
          objectTypeId: "tag",
          kind: "tag",
          propertyValues: {},
        },
        {
          id: "page-1",
          title: "Imported",
          createdAt: "2026-01-01T00:00:00.000Z",
          objectTypeId: "page",
          kind: "document",
          body: {
            schemaVersion: 1,
            doc: { type: "doc", content: [{ type: "paragraph" }] },
          },
          collections: ["Reading"],
          tags: ["Research", "New Topic"],
          propertyValues: {},
        },
      ],
      nextId: 2,
      structures: createInitialWorkspaceObjectState().structures,
      version: 4,
    }),
  );

  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.state.entities[1].tags, [
    "tag-existing",
    "tag:new-topic",
  ]);
  assert.deepEqual(parsed.state.entities[1].collections, [
    "collection:page:reading",
  ]);
  assert.equal(
    parsed.state.entities[1].body.schemaVersion,
    BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  );
  assert.deepEqual(parsed.state.entities[1].propertyValues.title, {
    title: { value: "Imported" },
    type: "title",
  });
  assert.deepEqual(parsed.state.entities[1].propertyValues.createdAt, {
    createdAt: { value: "2026-01-01T00:00:00.000Z" },
    type: "createdAt",
  });
  assert.deepEqual(parsed.state.entities[1].propertyValues.lastUpdatedAt, {
    lastUpdatedAt: { value: "2026-01-01T00:00:00.000Z" },
    type: "lastUpdatedAt",
  });
  assert.equal(
    parsed.state.entities[1].body.doc.content[0].attrs.id,
    "block:page-1:0",
  );
});

test("file entities persist canonical media asset metadata without temporary preview URLs", () => {
  const created = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    type: "beginCreate",
    objectTypeId: "image",
  });
  const state = workspaceObjectReducer(created, {
    type: "commitFile",
    assetId: "asset-1",
    contentHash: "hash-1",
    fileName: "image.png",
    mimeType: "image/png",
    previewUrl: "blob:temporary",
    size: 12,
    storageState: "stored",
  });

  const parsed = parseWorkspaceObjectSnapshot(
    JSON.stringify({
      activeEntityId: state.activeEntityId,
      entities: state.entities,
      nextId: state.nextId,
      structures: state.structures,
      version: WORKSPACE_OBJECT_SCHEMA_VERSION,
    }),
  );

  assert.equal(parsed.ok, true);
  assert.equal(parsed.state.entities[0].assetId, "asset-1");
  assert.equal(parsed.state.entities[0].contentHash, "hash-1");
  assert.equal(parsed.state.entities[0].previewUrl, undefined);
  assert.equal(parsed.state.entities[0].storageState, "stored");
});

test("version 1 document and quote strings migrate to current block bodies", () => {
  const parsed = parseWorkspaceObjectSnapshot(
    JSON.stringify({
      activeEntityId: "page-1",
      entities: [
        {
          id: "page-1",
          title: "Imported",
          createdAt: "2026-01-01T00:00:00.000Z",
          objectTypeId: "page",
          kind: "document",
          body: "First\n\nThird",
          collections: [],
          tags: [],
        },
        {
          id: "quote-1",
          title: "Quote",
          createdAt: "2026-01-01T00:00:00.000Z",
          objectTypeId: "quote",
          kind: "quote",
          body: "Words",
          collections: [],
          tags: [],
        },
      ],
      nextId: 3,
      version: 1,
    }),
  );

  assert.equal(parsed.ok, true);
  assert.equal(
    parsed.state.entities[0].body.schemaVersion,
    BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  );
  assert.equal(
    parsed.state.entities[1].body.schemaVersion,
    BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  );
  assert.equal(
    blockEditorDocumentToPlainText(parsed.state.entities[0].body),
    "First\n\nThird",
  );
  assert.equal(
    blockEditorDocumentToPlainText(parsed.state.entities[1].body),
    "Words",
  );
});

test("version 2 rejects malformed structured document bodies", () => {
  const parsed = parseWorkspaceObjectSnapshot(
    JSON.stringify({
      activeEntityId: null,
      entities: [
        {
          id: "page-1",
          title: "Invalid",
          createdAt: "2026-01-01T00:00:00.000Z",
          objectTypeId: "page",
          kind: "document",
          body: {
            schemaVersion: 1,
            doc: { type: "doc", content: [{ type: "image" }] },
          },
          collections: [],
          tags: [],
        },
      ],
      nextId: 2,
      version: 2,
    }),
  );

  assert.deepEqual(parsed, { ok: false, reason: "invalid-record" });
});

test("version 2 migration creates legacy preset Structures only for referenced entities", () => {
  const parsed = parseWorkspaceObjectSnapshot(
    JSON.stringify({
      activeEntityId: "book-1",
      entities: [
        {
          id: "book-1",
          title: "Runtime Systems",
          createdAt: "2026-01-01T00:00:00.000Z",
          objectTypeId: "book",
          kind: "document",
          body: {
            schemaVersion: 2,
            doc: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  attrs: { id: "block:book-1:0" },
                },
              ],
            },
          },
          collections: [],
          tags: [],
          propertyValues: {},
        },
      ],
      nextId: 2,
      version: 2,
    }),
  );

  assert.equal(parsed.ok, true);
  const legacyIds = parsed.state.structures
    .filter((structure) => structure.ownership === "legacy")
    .map((structure) => structure.id);
  assert.deepEqual(legacyIds, ["book"]);
  assert.equal(
    parsed.state.structures.some((structure) => structure.id === "person"),
    false,
  );
  assert.equal(parsed.state.entities[0].objectTypeId, "book");
});

test("hydration restores required object types without preserving unreferenced legacy presets", () => {
  const current = createInitialWorkspaceObjectState();
  const retainedIds = new Set([
    "page",
    "table",
    "weblink",
    "tweet",
    "tag",
    "query",
    "book",
  ]);
  const storedStructures = current.structures.filter((structure) =>
    retainedIds.has(structure.id),
  );

  const parsed = parseWorkspaceObjectSnapshot(
    JSON.stringify({
      activeEntityId: null,
      entities: [],
      nextId: 1,
      structures: storedStructures,
      version: WORKSPACE_OBJECT_SCHEMA_VERSION,
    }),
  );

  assert.equal(parsed.ok, true);
  const restoredIds = parsed.state.structures.map((structure) => structure.id);
  assert.deepEqual(restoredIds.slice(0, 4), [
    "page",
    "table",
    "task",
    "weblink",
  ]);
  assert.ok(restoredIds.includes("task"));
  assert.ok(restoredIds.includes("image"));
  assert.ok(restoredIds.includes("archive"));
  assert.equal(restoredIds.includes("book"), false);
  assert.equal(restoredIds.includes("person"), false);
});
