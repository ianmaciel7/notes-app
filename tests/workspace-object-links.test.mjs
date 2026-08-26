import assert from "node:assert/strict";
import test from "node:test";

import {
  blockEditorDocumentFromPlainText,
  normalizeBlockEditorDocument,
} from "../src/editor/document.ts";
import {
  createBlockReferenceMark,
  createObjectEmbedNode,
  createObjectReferenceMark,
  createWorkspaceObjectLinkIndex,
  findUnlinkedMentionCandidates,
  selectBacklinksForObject,
  selectContextualGraphEdges,
  selectForwardContentReferences,
  selectObjectsInside,
  selectPropertyRelationGraphEdges,
  wouldCreateReferenceCycle,
} from "../src/lib/workspace-object-links.ts";

function documentEntity(id, title, body, options = {}) {
  return {
    id,
    title,
    objectTypeId: "page",
    createdAt: "2026-08-22T00:00:00.000Z",
    kind: "document",
    body,
    collections: [],
    tags: [],
    propertyValues: options.propertyValues ?? {},
    aliases: options.aliases,
  };
}

test("object links, block references, and embeds derive backlinks and contextual graph once", () => {
  const sourceBody = {
    schemaVersion: 2,
    doc: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { id: "source-block-1" },
          content: [
            {
              type: "text",
              text: "Target",
              marks: [createObjectReferenceMark("target")],
            },
            {
              type: "text",
              text: "Block",
              marks: [createBlockReferenceMark("target", "target-block-1")],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { id: "source-block-2" },
          content: [createObjectEmbedNode("target")],
        },
      ],
    },
  };
  const targetBody = {
    schemaVersion: 2,
    doc: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { id: "target-block-1" },
          content: [{ type: "text", text: "Target body" }],
        },
      ],
    },
  };
  const source = documentEntity("source", "Source", sourceBody);
  const target = documentEntity("target", "Target", targetBody);
  const index = createWorkspaceObjectLinkIndex([source, target]);

  assert.equal(selectBacklinksForObject(index, "target").length, 3);
  assert.equal(selectObjectsInside(index, "source").length, 3);
  assert.equal(index.referenceCountsByTargetId.get("target"), 3);
  assert.equal(index.missingReferences.length, 0);
  assert.equal(selectContextualGraphEdges(index, "target").length, 3);
});

test("missing targets are explicit repairable states", () => {
  const body = {
    schemaVersion: 2,
    doc: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { id: "source-block-1" },
          content: [
            {
              type: "text",
              text: "Missing",
              marks: [createObjectReferenceMark("missing")],
            },
          ],
        },
      ],
    },
  };
  const index = createWorkspaceObjectLinkIndex([
    documentEntity("source", "Source", body),
  ]);

  assert.equal(index.missingReferences.length, 1);
  assert.equal(index.missingReferences[0].missing, true);
  assert.equal(index.missingReferences[0].targetId, "missing");
});

test("property relation graph edges stay distinct from content backlinks", () => {
  const source = documentEntity(
    "source",
    "Source",
    blockEditorDocumentFromPlainText("Source"),
    {
      propertyValues: {
        relation: {
          type: "entity",
          entity: [{ id: "target", structureId: "page" }],
        },
      },
    },
  );
  const target = documentEntity(
    "target",
    "Target",
    blockEditorDocumentFromPlainText("Target"),
  );

  assert.equal(selectForwardContentReferences([source, target]).length, 0);
  assert.deepEqual(selectPropertyRelationGraphEdges([source, target]), [
    {
      from: "source",
      id: "source->target:property:relation",
      kind: "property",
      to: "target",
    },
  ]);
});

test("unlinked mention candidates are advisory until explicitly converted", () => {
  const source = documentEntity(
    "source",
    "Source",
    blockEditorDocumentFromPlainText("Project Atlas should be linked later."),
  );
  const target = documentEntity(
    "target",
    "Project Atlas",
    blockEditorDocumentFromPlainText("Target"),
  );

  const candidates = findUnlinkedMentionCandidates([source, target], "source");
  assert.deepEqual(candidates, [
    {
      label: "Project Atlas",
      sourceId: "source",
      targetId: "target",
    },
  ]);
  assert.equal(selectForwardContentReferences([source]).length, 0);
});

test("cycle checks reject recursive embed/reference paths", () => {
  const references = [
    { kind: "embed", sourceId: "a", targetId: "b" },
    { kind: "object", sourceId: "b", targetId: "c" },
  ];

  assert.equal(wouldCreateReferenceCycle(references, "c", "a"), true);
  assert.equal(wouldCreateReferenceCycle(references, "c", "d"), false);
});

test("block link indexing consumes centrally normalized recursive block ids", () => {
  const original = blockEditorDocumentFromPlainText("One\nTwo");
  const firstId = original.doc.content[0].attrs.id;
  const secondId = original.doc.content[1].attrs.id;
  const preserved = normalizeBlockEditorDocument(original, "source");

  assert.equal(preserved?.doc.content[0].attrs.id, firstId);
  assert.equal(preserved?.doc.content[1].attrs.id, secondId);

  const legacy = {
    schemaVersion: 1,
    doc: {
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Target",
                      marks: [createObjectReferenceMark("target")],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
  const normalized = normalizeBlockEditorDocument(legacy, "source");
  assert.ok(normalized);
  const ids = [
    normalized.doc.content[0].attrs.id,
    normalized.doc.content[0].content[0].attrs.id,
    normalized.doc.content[0].content[0].content[0].attrs.id,
  ];
  assert.deepEqual(ids, [
    "block:source:0",
    "block:source:0.0",
    "block:source:0.0.0",
  ]);
  const index = createWorkspaceObjectLinkIndex([
    documentEntity("source", "Source", normalized),
    documentEntity(
      "target",
      "Target",
      blockEditorDocumentFromPlainText("Target"),
    ),
  ]);
  assert.equal(
    selectObjectsInside(index, "source")[0].blockId,
    "block:source:0.0.0",
  );
});
