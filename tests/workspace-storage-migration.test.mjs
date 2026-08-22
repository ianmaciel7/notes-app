import assert from "node:assert/strict";
import test from "node:test";

import { blockEditorDocumentToPlainText } from "../src/editor/document.ts";
import { parseWorkspaceObjectSnapshot } from "../src/lib/workspace-object-storage.ts";
import {
  WORKSPACE_OBJECT_SCHEMA_VERSION,
  createInitialWorkspaceObjectState,
  workspaceObjectReducer,
} from "../src/lib/workspace-objects.ts";

test("new document entities use the structured block schema", () => {
  const state = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    type: "beginCreate",
    objectTypeId: "page",
  });

  assert.equal(WORKSPACE_OBJECT_SCHEMA_VERSION, 2);
  assert.deepEqual(state.entities[0].body, {
    schemaVersion: 1,
    doc: { type: "doc", content: [{ type: "paragraph" }] },
  });
});

test("version 1 document and quote strings migrate to version 2 block bodies", () => {
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
  assert.equal(blockEditorDocumentToPlainText(parsed.state.entities[0].body), "First\n\nThird");
  assert.equal(blockEditorDocumentToPlainText(parsed.state.entities[1].body), "Words");
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
          body: { schemaVersion: 1, doc: { type: "doc", content: [{ type: "image" }] } },
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
