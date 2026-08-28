import assert from "node:assert/strict";
import test from "node:test";

import {
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToPlainText,
  normalizeBlockEditorDocument,
} from "../src/editor/document.ts";
import {
  convertUnlinkedMentionCandidate,
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
  selectRelatedEntities,
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
  assert.deepEqual(
    selectObjectsInside(index, "source").map((reference) => reference.targetId),
    ["target"],
  );
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

test("related Page content is derived from documented explicit relation rules", () => {
  const source = documentEntity(
    "source",
    "Source",
    {
      schemaVersion: 2,
      doc: {
        type: "doc",
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
    },
    {
      propertyValues: {
        relation: {
          type: "entity",
          entity: [{ id: "property", structureId: "page" }],
        },
      },
    },
  );
  const target = documentEntity(
    "target",
    "Target",
    blockEditorDocumentFromPlainText("Target"),
  );
  const property = documentEntity(
    "property",
    "Property",
    blockEditorDocumentFromPlainText("Property"),
  );
  const collection = {
    ...documentEntity(
      "collection",
      "Collection",
      blockEditorDocumentFromPlainText("Collection"),
    ),
    collections: ["shared"],
  };
  const sourceWithCollection = { ...source, collections: ["shared"] };
  const unrelated = documentEntity(
    "unrelated",
    "Unrelated",
    blockEditorDocumentFromPlainText("Unrelated"),
  );

  assert.deepEqual(
    selectRelatedEntities(
      [sourceWithCollection, target, property, collection, unrelated],
      "source",
    ).map(({ entity, rules }) => ({ id: entity.id, rules })),
    [
      { id: "target", rules: ["content-reference"] },
      { id: "property", rules: ["property-relation"] },
      { id: "collection", rules: ["shared-collection"] },
    ],
  );
});

test("unlinked mentions find source objects that name the focused target", () => {
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

  const candidates = findUnlinkedMentionCandidates([source, target], "target");
  assert.deepEqual(candidates, [
    {
      blockId: source.body.doc.content[0].attrs.id,
      end: 13,
      excerpt: "Project Atlas should be linked later.",
      label: "Project Atlas",
      sourceId: "source",
      start: 0,
      targetId: "target",
    },
  ]);
  assert.equal(selectForwardContentReferences([source]).length, 0);
});

test("unlinked mentions require title boundaries", () => {
  const source = documentEntity(
    "source",
    "Source",
    blockEditorDocumentFromPlainText("Atlassian is not Atlas."),
  );
  const target = documentEntity(
    "target",
    "Atlas",
    blockEditorDocumentFromPlainText("Target"),
  );

  assert.deepEqual(findUnlinkedMentionCandidates([source, target], "target"), [
    {
      blockId: source.body.doc.content[0].attrs.id,
      end: 22,
      excerpt: "Atlassian is not Atlas.",
      label: "Atlas",
      sourceId: "source",
      start: 17,
      targetId: "target",
    },
  ]);
});

test("unlinked mentions exclude linked ranges without hiding plain occurrences", () => {
  const source = documentEntity("source", "Source", {
    schemaVersion: 2,
    doc: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { id: "source-block" },
          content: [
            {
              type: "text",
              text: "Atlas",
              marks: [createObjectReferenceMark("target")],
            },
            { type: "text", text: " linked; Atlas plain" },
          ],
        },
      ],
    },
  });
  const target = documentEntity(
    "target",
    "Atlas",
    blockEditorDocumentFromPlainText("Target"),
  );

  assert.deepEqual(findUnlinkedMentionCandidates([source, target], "target"), [
    {
      blockId: "source-block",
      end: 19,
      excerpt: "Atlas linked; Atlas plain",
      label: "Atlas",
      sourceId: "source",
      start: 14,
      targetId: "target",
    },
  ]);
});

test("unlinked mentions keep distinct source ranges", () => {
  const source = documentEntity(
    "source",
    "Source",
    blockEditorDocumentFromPlainText("Atlas one. Atlas two."),
  );
  const target = documentEntity(
    "target",
    "Atlas",
    blockEditorDocumentFromPlainText("Target"),
  );
  const blockId = source.body.doc.content[0].attrs.id;

  assert.deepEqual(findUnlinkedMentionCandidates([source, target], "target"), [
    {
      blockId,
      end: 5,
      excerpt: "Atlas one. Atlas two.",
      label: "Atlas",
      sourceId: "source",
      start: 0,
      targetId: "target",
    },
    {
      blockId,
      end: 16,
      excerpt: "Atlas one. Atlas two.",
      label: "Atlas",
      sourceId: "source",
      start: 11,
      targetId: "target",
    },
  ]);
});

test("unlinked mentions normalize title and alias matches locally", () => {
  const source = documentEntity(
    "source",
    "Source",
    blockEditorDocumentFromPlainText("cafe atlas e PROJETO NORTE"),
  );
  const target = documentEntity(
    "target",
    "Café Atlas",
    blockEditorDocumentFromPlainText("Target"),
    { aliases: ["Projeto Norte"] },
  );

  assert.deepEqual(
    findUnlinkedMentionCandidates([source, target], "target").map(
      ({ start, end, label }) => ({ start, end, label }),
    ),
    [
      { start: 0, end: 10, label: "Café Atlas" },
      { start: 13, end: 26, label: "Projeto Norte" },
    ],
  );
});

test("unlinked mentions derive multiple sources offline and deduplicate aliases", () => {
  const first = documentEntity(
    "first",
    "First",
    blockEditorDocumentFromPlainText("Atlas"),
  );
  const second = documentEntity(
    "second",
    "Second",
    blockEditorDocumentFromPlainText("ATLAS"),
  );
  const target = documentEntity(
    "target",
    "Atlas",
    blockEditorDocumentFromPlainText("Target"),
    { aliases: ["Atlas", "atlas"] },
  );
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error("Mention derivation must stay offline.");
  };

  try {
    assert.deepEqual(
      findUnlinkedMentionCandidates([first, second, target], "target").map(
        ({ sourceId, start, end }) => ({ sourceId, start, end }),
      ),
      [
        { sourceId: "first", start: 0, end: 5 },
        { sourceId: "second", start: 0, end: 5 },
      ],
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("unlinked mentions exclude self and unsupported sources", () => {
  const target = documentEntity(
    "target",
    "Atlas",
    blockEditorDocumentFromPlainText("Atlas"),
  );
  const table = {
    id: "table",
    title: "Table",
    objectTypeId: "table",
    createdAt: "2026-08-22T00:00:00.000Z",
    kind: "table",
    cells: [{ id: "cell", column: 0, row: 0, value: "Atlas" }],
    columns: [],
    propertyValues: {},
  };

  assert.deepEqual(
    findUnlinkedMentionCandidates([target, table], "target"),
    [],
  );
});

test("property relations stay distinct from unlinked body occurrences", () => {
  const source = documentEntity(
    "source",
    "Source",
    blockEditorDocumentFromPlainText("Atlas"),
    {
      propertyValues: {
        relation: { type: "entity", entity: [{ id: "target" }] },
      },
    },
  );
  const target = documentEntity(
    "target",
    "Atlas",
    blockEditorDocumentFromPlainText("Target"),
  );

  assert.equal(findUnlinkedMentionCandidates([source, target], "target").length, 1);
  assert.equal(selectPropertyRelationGraphEdges([source, target]).length, 1);
});

test("unlinked mentions refresh when the focused target is renamed", () => {
  const source = documentEntity(
    "source",
    "Source",
    blockEditorDocumentFromPlainText("New Atlas"),
  );
  const target = documentEntity(
    "target",
    "Old Atlas",
    blockEditorDocumentFromPlainText("Target"),
  );

  assert.equal(findUnlinkedMentionCandidates([source, target], "target").length, 0);
  assert.equal(
    findUnlinkedMentionCandidates(
      [source, { ...target, title: "New Atlas" }],
      "target",
    ).length,
    1,
  );
});

test("converting a mention marks only the selected source range", () => {
  const source = documentEntity(
    "source",
    "Source",
    blockEditorDocumentFromPlainText("Atlas one. Atlas two."),
  );
  const target = documentEntity(
    "target",
    "Atlas",
    blockEditorDocumentFromPlainText("Target"),
  );
  const [, secondMention] = findUnlinkedMentionCandidates(
    [source, target],
    "target",
  );

  const converted = convertUnlinkedMentionCandidate(source.body, secondMention);

  assert.ok(converted);
  assert.equal(blockEditorDocumentToPlainText(converted), "Atlas one. Atlas two.");
  assert.equal(
    selectForwardContentReferences([{ ...source, body: converted }]).length,
    1,
  );
  assert.deepEqual(
    findUnlinkedMentionCandidates(
      [{ ...source, body: converted }, target],
      "target",
    ).map(({ start }) => start),
    [0],
  );
});

test("converting a stale mention candidate leaves the source unchanged", () => {
  const source = documentEntity(
    "source",
    "Source",
    blockEditorDocumentFromPlainText("Atlas"),
  );
  const target = documentEntity(
    "target",
    "Atlas",
    blockEditorDocumentFromPlainText("Target"),
  );
  const [candidate] = findUnlinkedMentionCandidates(
    [source, target],
    "target",
  );
  const changedSource = blockEditorDocumentFromPlainText("Atlas changed");

  assert.equal(convertUnlinkedMentionCandidate(changedSource, candidate), null);
});

test("mention conversion survives source reload and block reordering", () => {
  const source = documentEntity("source", "Source", {
    schemaVersion: 2,
    doc: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { id: "intro" },
          content: [{ type: "text", text: "Intro" }],
        },
        {
          type: "paragraph",
          attrs: { id: "mention" },
          content: [{ type: "text", text: "Atlas" }],
        },
      ],
    },
  });
  const target = documentEntity(
    "target",
    "Atlas",
    blockEditorDocumentFromPlainText("Target"),
  );
  const [candidate] = findUnlinkedMentionCandidates(
    [source, target],
    "target",
  );
  const reloaded = JSON.parse(JSON.stringify(source.body));
  reloaded.doc.content.reverse();

  const converted = convertUnlinkedMentionCandidate(reloaded, candidate);

  assert.ok(converted);
  assert.equal(
    selectForwardContentReferences([{ ...source, body: converted }]).length,
    1,
  );
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
