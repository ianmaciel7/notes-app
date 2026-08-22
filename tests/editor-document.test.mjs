import assert from "node:assert/strict";
import test from "node:test";

import {
  blockEditorDocumentFromMarkdown,
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToMarkdown,
  blockEditorDocumentToPlainText,
  createEmptyBlockEditorDocument,
  isBlockEditorDocument,
  normalizeBlockEditorDocument,
} from "../src/editor/document.ts";

test("supported Markdown converts to validated JSON and round-trips", () => {
  const source =
    "## Heading\n\nParagraph with **bold** and `code`.\n\n- one\n- two";
  const document = blockEditorDocumentFromMarkdown(source);
  assert.equal(isBlockEditorDocument(document), true);
  const markdown = blockEditorDocumentToMarkdown(document);
  assert.match(markdown, /^## Heading/m);
  assert.match(markdown, /\*\*bold\*\*/);
  assert.deepEqual(blockEditorDocumentFromMarkdown(markdown), document);
});

test("empty block documents are valid, normalized, and independent", () => {
  const first = createEmptyBlockEditorDocument();
  const second = createEmptyBlockEditorDocument();

  assert.equal(isBlockEditorDocument(first), true);
  assert.deepEqual(first, {
    schemaVersion: 1,
    doc: { type: "doc", content: [{ type: "paragraph" }] },
  });
  assert.notEqual(first.doc.content, second.doc.content);
});

test("plain text conversion preserves line boundaries deterministically", () => {
  const source = "First line\n\nThird line";
  const document = blockEditorDocumentFromPlainText(source);

  assert.equal(blockEditorDocumentToPlainText(document), source);
  assert.equal(isBlockEditorDocument(document), true);
});

test("normalization rejects unknown nodes and repairs an empty root", () => {
  assert.equal(
    normalizeBlockEditorDocument({
      schemaVersion: 1,
      doc: { type: "doc", content: [{ type: "image" }] },
    }),
    null,
  );
  assert.deepEqual(
    normalizeBlockEditorDocument({
      schemaVersion: 1,
      doc: { type: "doc", content: [] },
    }),
    createEmptyBlockEditorDocument(),
  );
});
