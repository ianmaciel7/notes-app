import assert from "node:assert/strict";
import test from "node:test";

import {
  BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  blockEditorDocumentFromMarkdown,
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToMarkdown,
  blockEditorDocumentToPlainText,
  createEmptyBlockEditorDocument,
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
  assert.equal(new Set(collectBlockIds(document)).size, collectBlockIds(document).length);

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
    schemaVersion: 2,
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
  assert.equal(blockEditorDocumentToPlainText(roundTrip), blockEditorDocumentToPlainText(document));
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
  unsafe.doc.content[0].content[0].marks[0].attrs.href =
    "javascript:alert(1)";

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
  assert.deepEqual(normalizeBlockEditorDocument(normalized, "source"), normalized);
  assert.deepEqual(
    normalizeBlockEditorDocument(legacy, "source"),
    normalizeBlockEditorDocument(legacy, "source"),
  );
});

test("new empty documents receive independent globally unique block ids", () => {
  const first = createEmptyBlockEditorDocument();
  const second = createEmptyBlockEditorDocument();

  assert.equal(isBlockEditorDocument(first), true);
  assert.equal(first.schemaVersion, 2);
  assert.equal(first.doc.content[0].type, "paragraph");
  assert.match(first.doc.content[0].attrs.id, /^block:/);
  assert.notEqual(first.doc.content[0].attrs.id, second.doc.content[0].attrs.id);
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
  assert.equal(repaired.schemaVersion, 2);
  assert.equal(repaired.doc.content[0].type, "paragraph");
  assert.match(repaired.doc.content[0].attrs.id, /^block:/);
});
