import assert from "node:assert/strict";
import test from "node:test";

import { selectEditorUtilities } from "../src/lib/editor-utilities.ts";

test("editor utilities preserve heading hierarchy and calculate local statistics", () => {
  const result = selectEditorUtilities(
    {
      schemaVersion: 2,
      doc: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { id: "heading-one", level: 1 },
            content: [{ type: "text", text: "Visão geral" }],
          },
          {
            type: "paragraph",
            attrs: { id: "paragraph-one" },
            content: [{ type: "text", text: "Olá mundo. Tudo bem?" }],
          },
          {
            type: "heading",
            attrs: { id: "heading-two", level: 3 },
            content: [{ type: "text", text: "Detalhes" }],
          },
        ],
      },
    },
    {
      createdAt: "2026-08-27T12:00:00.000Z",
      updatedAt: "2026-08-28T13:30:00.000Z",
    },
  );

  assert.deepEqual(result.outline, [
    { id: "heading-one", level: 1, title: "Visão geral" },
    { id: "heading-two", level: 3, title: "Detalhes" },
  ]);
  assert.deepEqual(result.statistics, {
    characters: 41,
    paragraphs: 3,
    sentences: 2,
    words: 7,
  });
  assert.equal(result.createdAt, "2026-08-27T12:00:00.000Z");
  assert.equal(result.updatedAt, "2026-08-28T13:30:00.000Z");
});

test("editor utilities return stable empty values", () => {
  const result = selectEditorUtilities(
    {
      schemaVersion: 2,
      doc: {
        type: "doc",
        content: [{ type: "paragraph", attrs: { id: "empty" } }],
      },
    },
    { createdAt: "2026-08-28T00:00:00.000Z" },
  );

  assert.deepEqual(result.outline, []);
  assert.deepEqual(result.statistics, {
    characters: 0,
    paragraphs: 1,
    sentences: 0,
    words: 0,
  });
  assert.equal(result.updatedAt, undefined);
});
