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

test("validated documents support Capacities-style heading 4 and horizontal lines", () => {
  const document = blockEditorDocumentFromMarkdown("#### Detail\n\n---");

  assert.equal(isBlockEditorDocument(document), true);
  assert.equal(document.doc.content[0].type, "heading");
  assert.equal(document.doc.content[0].attrs.level, 4);
  assert.equal(document.doc.content[1].type, "horizontalRule");
  assert.match(blockEditorDocumentToMarkdown(document), /^#### Detail/m);
});

test("normalization removes editor-only link defaults but preserves safe href", () => {
  const normalized = normalizeBlockEditorDocument({
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
  });

  assert.deepEqual(normalized, {
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

test("task-list Markdown stays a task-list document across export and import", () => {
  const source = "- [ ] Open task\n- [x] Completed task";
  const document = blockEditorDocumentFromMarkdown(source);

  assert.equal(isBlockEditorDocument(document), true);
  assert.equal(document.doc.content[0].type, "taskList");
  assert.equal(document.doc.content[0].content[0].attrs.checked, false);
  assert.equal(document.doc.content[0].content[1].attrs.checked, true);

  const markdown = blockEditorDocumentToMarkdown(document);
  assert.match(markdown, /- \[ \] Open task/);
  assert.match(markdown, /- \[x\] Completed task/i);
  assert.deepEqual(blockEditorDocumentFromMarkdown(markdown), document);
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

  assert.deepEqual(normalizeBlockEditorDocument(safe), safe);
  assert.equal(normalizeBlockEditorDocument(unsafe), null);
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
