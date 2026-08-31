import assert from "node:assert/strict";
import test from "node:test";

import { BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION } from "../src/editor/document.ts";
import {
  parseWorkspaceObjectSnapshot,
  serializeWorkspaceObjectState,
} from "../src/lib/workspace-object-storage.ts";
import {
  countEntitiesByType,
  createInitialWorkspaceObjectState,
  WORKSPACE_OBJECT_SCHEMA_VERSION,
  workspaceObjectReducer,
} from "../src/lib/workspace-objects.ts";

test("version 2 migrates to the current version while preserving entity and block content", () => {
  const body = {
    schemaVersion: 1,
    doc: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Preserve this block document exactly",
              marks: [{ type: "bold" }],
            },
          ],
        },
      ],
    },
  };
  const parsed = parseWorkspaceObjectSnapshot(
    JSON.stringify({
      activeEntityId: "legacy-book-7",
      entities: [
        {
          id: "legacy-book-7",
          title: "Legacy book",
          createdAt: "2026-08-22T00:00:00.000Z",
          objectTypeId: "book",
          kind: "document",
          body,
          collections: ["Reading"],
          tags: ["reference"],
          description: "Specialized payload",
        },
      ],
      nextId: 41,
      version: 2,
    }),
  );

  assert.equal(WORKSPACE_OBJECT_SCHEMA_VERSION, 6);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.state.activeEntityId, "legacy-book-7");
  assert.equal(parsed.state.nextId, 41);
  assert.equal(parsed.state.entities.length, 1);
  assert.equal(parsed.state.entities[0].id, "legacy-book-7");
  assert.equal(parsed.state.entities[0].objectTypeId, "book");
  assert.equal(parsed.state.entities[0].description, "Specialized payload");
  assert.equal(
    parsed.state.entities[0].body.schemaVersion,
    BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  );
  assert.equal(
    parsed.state.entities[0].body.doc.content[0].attrs.id,
    "block:legacy-book-7:0",
  );
  assert.deepEqual(
    parsed.state.entities[0].body.doc.content[0].content,
    body.doc.content[0].content,
  );
  assert.deepEqual(parsed.state.entities[0].propertyValues.description, {
    text: { value: "Specialized payload" },
    type: "text",
  });
  assert.ok(
    parsed.state.structures.some(
      (structure) =>
        structure.id === "book" && structure.ownership === "legacy",
    ),
  );
});

test("runtime custom Structures drive creation, metadata, schema, and guarded deletion", () => {
  const structureId = "77777777-7777-4777-8777-777777777777";
  let state = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    type: "createStructure",
    id: structureId,
    input: {
      iconName: "book",
      lifecycleKind: "document",
      pluralName: "Research notes",
      singularName: "Research note",
      tone: "purple",
    },
  });

  assert.equal(state.structureError, null);
  assert.equal(state.structures.at(-1)?.id, structureId);

  state = workspaceObjectReducer(state, {
    type: "beginCreate",
    objectTypeId: structureId,
  });
  assert.equal(state.entities.length, 1);
  assert.equal(state.entities[0].kind, "document");
  assert.equal(state.entities[0].objectTypeId, structureId);
  assert.deepEqual(countEntitiesByType(state.entities), { [structureId]: 1 });

  state = workspaceObjectReducer(state, {
    type: "renameStructure",
    id: structureId,
    pluralName: "Sources",
    singularName: "Source",
  });
  assert.equal(
    state.structures.find((structure) => structure.id === structureId)
      ?.singularName,
    "Source",
  );
  assert.equal(state.entities[0].objectTypeId, structureId);

  state = workspaceObjectReducer(state, {
    type: "replaceStructureSchema",
    id: structureId,
    propertyDefinitions: [
      {
        id: "summary",
        multiple: false,
        name: "Summary",
        ownership: "normal",
        valueType: "text",
        writable: true,
      },
    ],
  });
  assert.equal(
    state.structures.find((structure) => structure.id === structureId)
      ?.propertyDefinitions[0]?.id,
    "summary",
  );

  const beforeDelete = state.structures;
  state = workspaceObjectReducer(state, {
    type: "deleteStructure",
    id: structureId,
  });
  assert.equal(state.structureError?.code, "structure-in-use");
  assert.deepEqual(state.structures, beforeDelete);
});

test("version 4 round-trips custom Structures and rejects invalid references atomically", () => {
  const structureId = "88888888-8888-4888-8888-888888888888";
  let state = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    type: "createStructureFromPreset",
    id: structureId,
    presetId: "person",
  });
  state = workspaceObjectReducer(state, {
    type: "beginCreate",
    objectTypeId: structureId,
  });

  const parsed = parseWorkspaceObjectSnapshot(
    serializeWorkspaceObjectState(state),
  );
  assert.equal(parsed.ok, true);
  assert.equal(
    parsed.state.structures.filter((structure) => structure.id === structureId)
      .length,
    1,
  );
  assert.equal(parsed.state.entities[0].objectTypeId, structureId);
  assert.deepEqual(countEntitiesByType(parsed.state.entities), {
    [structureId]: 1,
  });

  const snapshot = JSON.parse(serializeWorkspaceObjectState(state));
  snapshot.entities[0].objectTypeId = "missing-structure";
  assert.deepEqual(parseWorkspaceObjectSnapshot(JSON.stringify(snapshot)), {
    ok: false,
    reason: "invalid-record",
  });

  snapshot.entities[0].objectTypeId = structureId;
  snapshot.structures.push(structuredClone(snapshot.structures[0]));
  assert.deepEqual(parseWorkspaceObjectSnapshot(JSON.stringify(snapshot)), {
    ok: false,
    reason: "invalid-record",
  });
});
