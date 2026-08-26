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
  createReferenceableBlockId,
  createWorkspaceObjectLinkIndex,
  ensureReferenceableBlockIds,
  findUnlinkedMentionCandidates,
  selectBacklinksForObject,
  selectContextualGraphEdges,
  selectForwardContentReferences,
  selectObjectsInside,
  selectPropertyRelationGraphEdges,
  wouldCreateReferenceCycle,
} from "../src/lib/workspace-object-links.ts";

function entity(id, title, content, propertyValues = {}) {
  return {
    id,
    objectTypeId: "page",
    title,
    createdAt: "2026-08-25T00:00:00.000Z",
    propertyValues,
    kind: "document",
    body: {
      schemaVersion: 1,
      doc: {
        type: "doc",
        content,
      },
    },
    collections: [],
    tags: [],
  };
}

test("object links, block references, and embeds derive backlinks and contextual graph once", () => {
  const source = entity("source", "Source", [
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
          text: " again",
          marks: [createObjectReferenceMark("target")],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: { id: "source-block-2" },
      content: [
        {
          type: "text",
          text: "Block target",
          marks: [createBlockReferenceMark("target", "target-block-1")],
        },
      ],
    },
    createObjectEmbedNode("target"),
  ]);
  const target = entity("target", "Target", [
    { type: "paragraph", attrs: { id: "target-block-1" } },
  ]);

  const index = createWorkspaceObjectLinkIndex([source, target]);

  assert.equal(selectForwardContentReferences([source]).length, 3);
  assert.equal(selectBacklinksForObject(index, "target").length, 3);
  assert.equal(index.referenceCountsByTargetId.get("target"), 3);
  assert.deepEqual(
    selectContextualGraphEdges(index, "target").map((edge) => edge.id),
    ["source->target:object", "source->target:block", "source->target:embed"],
  );
  assert.equal(selectObjectsInside(index, "source").length, 3);
});

test("missing targets are explicit repairable states", () => {
  const source = entity("source", "Source", [
    {
      type: "paragraph",
      attrs: { id: "source-block-1" },
      content: [
        {
          type: "text",
          text: "Missing",
          marks: [createObjectReferenceMark("deleted-object")],
        },
      ],
    },
  ]);

  const index = createWorkspaceObjectLinkIndex([source]);

  assert.equal(index.missingReferences.length, 1);
  assert.equal(index.missingReferences[0].missing, true);
  assert.equal(index.missingReferences[0].targetId, "deleted-object");
});

test("property relation graph edges stay distinct from content backlinks", () => {
  const source = entity(
    "source",
    "Source",
    [
      {
        type: "paragraph",
        attrs: { id: "source-block-1" },
        content: [
          {
            type: "text",
            text: "Target",
            marks: [createObjectReferenceMark("target")],
          },
        ],
      },
    ],
    {
      related: {
        entity: [{ id: "target" }],
        type: "entity",
      },
    },
  );
  const target = entity("target", "Target", [{ type: "paragraph" }]);

  const contentIndex = createWorkspaceObjectLinkIndex([source, target]);
  const propertyEdges = selectPropertyRelationGraphEdges([source, target]);

  assert.equal(selectBacklinksForObject(contentIndex, "target").length, 1);
  assert.equal(propertyEdges.length, 1);
  assert.equal(propertyEdges[0].kind, "property");
});

test("unlinked mention candidates are advisory until explicitly converted", () => {
  const source = entity(
    "source",
    "Source",
    blockEditorDocumentFromPlainText("Discuss Project Atlas next week").doc
      .content,
  );
  const target = {
    ...entity("target", "Project Atlas", [{ type: "paragraph" }]),
    aliases: ["Atlas"],
  };

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

test("block identity helpers preserve ids and use stable deterministic fallbacks", () => {
  const document = ensureReferenceableBlockIds(
    "source",
    blockEditorDocumentFromPlainText("One\nTwo"),
  );

  assert.equal(
    document.doc.content[0].attrs.id,
    createReferenceableBlockId("source", 0),
  );
  assert.equal(
    document.doc.content[1].attrs.id,
    createReferenceableBlockId("source", 1),
  );
  assert.equal(
    normalizeBlockEditorDocument(document)?.doc.content[0].attrs.id,
    "source-block-1",
  );
});
