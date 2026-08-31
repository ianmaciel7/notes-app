import assert from "node:assert/strict";
import test from "node:test";

import {
  BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  blockEditorDocumentFromMarkdown,
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToMarkdown,
  blockEditorDocumentToPlainText,
  copyBlockEditorDocumentWithFreshIds,
  createEmptyBlockEditorDocument,
  documentHasAdvancedMarkdownLossiness,
  isAdvancedBlockType,
  isBlockEditorDocument,
  normalizeBlockEditorDocument,
} from "../src/editor/document.ts";

function collectBlockIds(document) {
  const ids = [];
  const visit = (node) => {
    if (node.attrs?.id) ids.push(node.attrs.id);
    for (const child of node.content ?? []) visit(child);
  };
  for (const node of document.doc.content) visit(node);
  return ids;
}

test("supported Markdown converts to validated JSON and semantic round-trips", () => {
  const source =
    "## Heading\n\nParagraph with **bold** and `code`.\n\n- one\n- two";
  const document = blockEditorDocumentFromMarkdown(source);
  assert.equal(isBlockEditorDocument(document), true);
  assert.equal(document.schemaVersion, BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION);
  assert.equal(
    new Set(collectBlockIds(document)).size,
    collectBlockIds(document).length,
  );

  const markdown = blockEditorDocumentToMarkdown(document);
  assert.match(markdown, /^## Heading/m);
  assert.match(markdown, /\*\*bold\*\*/);
  assert.equal(
    blockEditorDocumentToPlainText(blockEditorDocumentFromMarkdown(markdown)),
    blockEditorDocumentToPlainText(document),
  );
});

test("validated documents support Capacities-style heading 4 and horizontal lines", () => {
  const document = blockEditorDocumentFromMarkdown("#### Detail\n\n---");

  assert.equal(isBlockEditorDocument(document), true);
  assert.equal(document.doc.content[0].type, "heading");
  assert.equal(document.doc.content[0].attrs.level, 4);
  assert.match(document.doc.content[0].attrs.id, /^block:/);
  assert.equal(document.doc.content[1].type, "horizontalRule");
  assert.match(document.doc.content[1].attrs.id, /^block:/);
  assert.match(blockEditorDocumentToMarkdown(document), /^#### Detail/m);
});

test("legacy normalization removes editor-only link defaults and migrates stable ids", () => {
  const normalized = normalizeBlockEditorDocument(
    {
      schemaVersion: 1,
      doc: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Example",
                marks: [
                  {
                    type: "link",
                    attrs: {
                      href: "https://example.com",
                      target: "_blank",
                      rel: "noopener noreferrer nofollow",
                      class: null,
                      title: null,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    "object-1",
  );

  assert.deepEqual(normalized, {
    schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    doc: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { id: "block:object-1:0" },
          content: [
            {
              type: "text",
              text: "Example",
              marks: [
                {
                  type: "link",
                  attrs: { href: "https://example.com" },
                },
              ],
            },
          ],
        },
      ],
    },
  });
});

test("normalization strips null paragraph defaults without dropping stable ids", () => {
  const normalized = normalizeBlockEditorDocument({
    schemaVersion: 2,
    doc: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { id: "block:typed-paragraph", size: null },
          content: [{ type: "text", text: "Persisted text" }],
        },
      ],
    },
  });

  assert.deepEqual(normalized, {
    schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    doc: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { id: "block:typed-paragraph" },
          content: [{ type: "text", text: "Persisted text" }],
        },
      ],
    },
  });
});

test("task-list Markdown allocates unique ids and preserves task semantics", () => {
  const source = "- [ ] Open task\n- [x] Completed task";
  const document = blockEditorDocumentFromMarkdown(source);

  assert.equal(isBlockEditorDocument(document), true);
  assert.equal(document.doc.content[0].type, "taskList");
  assert.equal(document.doc.content[0].content[0].attrs.checked, false);
  assert.equal(document.doc.content[0].content[1].attrs.checked, true);
  const ids = collectBlockIds(document);
  assert.equal(new Set(ids).size, ids.length);

  const markdown = blockEditorDocumentToMarkdown(document);
  assert.match(markdown, /- \[ \] Open task/);
  assert.match(markdown, /- \[x\] Completed task/i);
  const roundTrip = blockEditorDocumentFromMarkdown(markdown);
  assert.equal(
    blockEditorDocumentToPlainText(roundTrip),
    blockEditorDocumentToPlainText(document),
  );
  assert.notDeepEqual(collectBlockIds(roundTrip), ids);
});

test("link normalization accepts safe relative links and rejects unsafe protocols", () => {
  const safe = {
    schemaVersion: 1,
    doc: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Safe",
              marks: [{ type: "link", attrs: { href: "../safe" } }],
            },
          ],
        },
      ],
    },
  };
  const unsafe = structuredClone(safe);
  unsafe.doc.content[0].content[0].marks[0].attrs.href = "javascript:alert(1)";

  const normalized = normalizeBlockEditorDocument(safe, "safe-object");
  assert.equal(normalized?.doc.content[0].attrs.id, "block:safe-object:0");
  assert.equal(normalizeBlockEditorDocument(unsafe, "unsafe-object"), null);
});

test("legacy documents migrate deterministically and duplicate ids are repaired", () => {
  const legacy = {
    schemaVersion: 1,
    doc: {
      type: "doc",
      content: [
        { type: "paragraph", attrs: { id: "kept" } },
        { type: "paragraph", attrs: { id: "kept" } },
        { type: "paragraph" },
      ],
    },
  };

  assert.equal(isBlockEditorDocument(legacy), false);
  const normalized = normalizeBlockEditorDocument(legacy, "source");
  assert.ok(normalized);
  assert.deepEqual(
    normalized.doc.content.map((node) => node.attrs.id),
    ["kept", "block:source:1", "block:source:2"],
  );
  assert.equal(isBlockEditorDocument(normalized), true);
  assert.deepEqual(
    normalizeBlockEditorDocument(normalized, "source"),
    normalized,
  );
  assert.deepEqual(
    normalizeBlockEditorDocument(legacy, "source"),
    normalizeBlockEditorDocument(legacy, "source"),
  );
});

test("new empty documents receive independent globally unique block ids", () => {
  const first = createEmptyBlockEditorDocument();
  const second = createEmptyBlockEditorDocument();

  assert.equal(isBlockEditorDocument(first), true);
  assert.equal(first.schemaVersion, BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION);
  assert.equal(first.doc.content[0].type, "paragraph");
  assert.match(first.doc.content[0].attrs.id, /^block:/);
  assert.notEqual(
    first.doc.content[0].attrs.id,
    second.doc.content[0].attrs.id,
  );
});

test("plain text conversion preserves line boundaries and allocates fresh ids", () => {
  const source = "First line\n\nThird line";
  const first = blockEditorDocumentFromPlainText(source);
  const second = blockEditorDocumentFromPlainText(source);

  assert.equal(blockEditorDocumentToPlainText(first), source);
  assert.equal(isBlockEditorDocument(first), true);
  assert.equal(new Set(collectBlockIds(first)).size, 3);
  assert.notDeepEqual(collectBlockIds(first), collectBlockIds(second));
});

test("copied documents remap every nested referenceable block id without changing content", () => {
  const source = {
    schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    doc: {
      type: "doc",
      content: [
        {
          type: "bulletList",
          attrs: { id: "source-list" },
          content: [
            {
              type: "listItem",
              attrs: { id: "source-item" },
              content: [
                {
                  type: "paragraph",
                  attrs: { id: "source-paragraph" },
                  content: [{ type: "text", text: "Nested content" }],
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const copied = copyBlockEditorDocumentWithFreshIds(source);

  assert.equal(isBlockEditorDocument(copied), true);
  assert.deepEqual(blockEditorDocumentToPlainText(copied), "Nested content");
  assert.equal(new Set(collectBlockIds(copied)).size, 3);
  assert.deepEqual(collectBlockIds(source), [
    "source-list",
    "source-item",
    "source-paragraph",
  ]);
  assert.ok(
    collectBlockIds(copied).every(
      (id) => !collectBlockIds(source).includes(id),
    ),
  );
});

test("normalization rejects unknown nodes and repairs an empty root", () => {
  assert.equal(
    normalizeBlockEditorDocument({
      schemaVersion: 1,
      doc: { type: "doc", content: [{ type: "image" }] },
    }),
    null,
  );
  const repaired = normalizeBlockEditorDocument({
    schemaVersion: 1,
    doc: { type: "doc", content: [] },
  });
  assert.ok(repaired);
  assert.equal(repaired.schemaVersion, BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION);
  assert.equal(repaired.doc.content[0].type, "paragraph");
  assert.match(repaired.doc.content[0].attrs.id, /^block:/);
});

test("version 2 documents migrate to schema 3 while preserving stable block ids", () => {
  const normalized = normalizeBlockEditorDocument(
    {
      schemaVersion: 2,
      doc: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            attrs: { id: "stable-paragraph" },
            content: [{ type: "text", text: "v2 body" }],
          },
        ],
      },
    },
    "v2-object",
  );

  assert.equal(normalized?.schemaVersion, BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION);
  assert.equal(normalized?.doc.content[0].attrs.id, "stable-paragraph");
  assert.equal(blockEditorDocumentToPlainText(normalized), "v2 body");
});

test("advanced block schema validates attributes depth and stable ids", () => {
  const document = {
    schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    doc: {
      type: "doc",
      content: [
        {
          type: "highlightBlock",
          attrs: {
            color: "yellow",
            id: "highlight-1",
            sourceLabel: "Reference",
          },
          content: [{ type: "text", text: "Quoted text" }],
        },
        {
          type: "mathBlock",
          attrs: {
            displayMode: "block",
            id: "math-1",
            source: "E = mc^2",
            sourceStatus: "valid",
          },
        },
        {
          type: "columnLayout",
          attrs: { id: "layout-1", layoutMode: "columns", width: "content" },
          content: [
            {
              type: "column",
              attrs: { id: "column-a", width: 0.5 },
              content: [{ type: "paragraph", attrs: { id: "paragraph-a" } }],
            },
            {
              type: "column",
              attrs: { id: "column-b", width: 0.5 },
              content: [{ type: "paragraph", attrs: { id: "paragraph-b" } }],
            },
          ],
        },
        {
          type: "groupBlock",
          attrs: { appearance: "card", id: "group-1", width: "wide" },
          content: [{ type: "paragraph", attrs: { id: "group-child" } }],
        },
        {
          type: "objectBlock",
          attrs: {
            id: "object-block-1",
            state: "read-only",
            targetId: "page-1",
            title: "Linked page",
            viewKind: "embed",
          },
        },
      ],
    },
  };

  assert.equal(isBlockEditorDocument(document), true);
  assert.equal(isAdvancedBlockType("groupBlock"), true);
  const ids = collectBlockIds(document);
  assert.equal(new Set(ids).size, ids.length);

  const invalid = structuredClone(document);
  invalid.doc.content[1].attrs.source = "<script>alert(1)</script>";
  assert.equal(isBlockEditorDocument(invalid), false);
});

test("future advanced nodes normalize to safe unsupported blocks", () => {
  const normalized = normalizeBlockEditorDocument(
    {
      schemaVersion: 99,
      doc: {
        type: "doc",
        content: [
          {
            type: "futureWidget",
            attrs: { vendor: "unknown" },
          },
        ],
      },
    },
    "future",
  );

  assert.equal(normalized?.schemaVersion, BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION);
  assert.equal(normalized?.doc.content[0].type, "unsupportedBlock");
  assert.equal(normalized?.doc.content[0].attrs.originalType, "futureWidget");
  assert.equal(isBlockEditorDocument(normalized), true);
});

test("advanced Markdown export declares reduced layout and transclusion semantics", () => {
  const document = {
    schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    doc: {
      type: "doc",
      content: [
        {
          type: "columnLayout",
          attrs: { id: "layout-export", layoutMode: "columns" },
          content: [
            {
              type: "column",
              attrs: { id: "column-export-a" },
              content: [
                {
                  type: "paragraph",
                  attrs: { id: "paragraph-export-a" },
                  content: [{ type: "text", text: "First" }],
                },
              ],
            },
            {
              type: "column",
              attrs: { id: "column-export-b" },
              content: [
                {
                  type: "objectBlock",
                  attrs: {
                    id: "object-export",
                    targetId: "page-2",
                    title: "Projected",
                    viewKind: "transclusion",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  };

  assert.equal(documentHasAdvancedMarkdownLossiness(document), true);
  const markdown = blockEditorDocumentToMarkdown(document);
  assert.match(markdown, /lossiness: column layout/);
  assert.match(markdown, /lossiness: object transclusion view/);
  assert.match(markdown, /\[Projected\]\(object:page-2\)/);
});
