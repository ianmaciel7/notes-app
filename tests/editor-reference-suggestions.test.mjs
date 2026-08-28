import assert from "node:assert/strict";
import test from "node:test";
import { blockEditorDocumentFromPlainText } from "../src/editor/document.ts";
import {
  createBlockReferenceSuggestionItems,
  createObjectReferenceSuggestionItems,
  createReferenceReplacement,
} from "../src/editor/reference-suggestions.ts";
import { buildWorkspaceSearchIndex } from "../src/lib/workspace-query-engine.ts";

function page(id, title, options = {}) {
  return {
    aliases: options.aliases ?? [],
    body: blockEditorDocumentFromPlainText(options.body ?? title),
    collections: [],
    createdAt: options.createdAt ?? "2026-08-20T00:00:00.000Z",
    id,
    kind: "document",
    objectTypeId: options.objectTypeId ?? "page",
    propertyValues: options.propertyValues ?? {},
    tags: [],
    title,
  };
}

const structures = [
  { id: "page", singularName: "Page" },
  { id: "project", singularName: "Project" },
];

test("@ and [[ share eligible object lookup with alias dedupe and structure context", () => {
  const entities = [
    page("atlas", "Project Atlas", {
      aliases: ["Atlas", "Projeto Atlas"],
      objectTypeId: "project",
    }),
    page("alpha", "Project Atlas", { objectTypeId: "page" }),
    page("notes", "Notes", { body: "Atlas appears in body only" }),
  ];
  const index = buildWorkspaceSearchIndex(entities);

  const atItems = createObjectReferenceSuggestionItems({
    entities,
    index,
    query: "atlas",
    structures,
    trigger: "@",
  });
  const wikiItems = createObjectReferenceSuggestionItems({
    entities,
    index,
    query: "atlas",
    structures,
    trigger: "[[",
  });

  assert.deepEqual(
    atItems.map((item) => [item.id, item.label, item.context, item.objectId]),
    [
      ["object:atlas", "Project Atlas", "Project", "atlas"],
      ["object:alpha", "Project Atlas", "Page", "alpha"],
      ["object:notes", "Notes", "Page", "notes"],
    ],
  );
  assert.deepEqual(wikiItems, atItems);
  assert.equal(
    createObjectReferenceSuggestionItems({
      entities,
      index,
      query: "Projeto Atlas",
      structures,
      trigger: "@",
    }).filter((item) => item.objectId === "atlas").length,
    1,
  );
});

test("reference replacement preserves exact trigger range and canonical object mark", () => {
  assert.deepEqual(
    createReferenceReplacement({
      label: "Project Atlas",
      range: { from: 5, to: 9 },
      target: { kind: "object", objectId: "atlas" },
      text: "Meet @atl soon",
    }),
    {
      mark: { attrs: { objectId: "atlas" }, type: "objectLink" },
      text: "Meet Project Atlas soon",
    },
  );
});

test("(( block lookup includes duplicate text, owner context, and stable identity", () => {
  const entities = [
    page("atlas", "Project Atlas", { body: "Same note" }),
    page("journal", "Journal", { body: "Same note" }),
  ];
  const index = buildWorkspaceSearchIndex(entities);
  const items = createBlockReferenceSuggestionItems({ entities, index, query: "same" });

  assert.deepEqual(
    items.map((item) => ({
      blockId: item.blockId,
      context: item.context,
      id: item.id,
      label: item.label,
      objectId: item.objectId,
    })),
    [
      {
        blockId: entities[0].body.doc.content[0].attrs.id,
        context: "Project Atlas",
        id: `block:atlas:${entities[0].body.doc.content[0].attrs.id}`,
        label: "Same note",
        objectId: "atlas",
      },
      {
        blockId: entities[1].body.doc.content[0].attrs.id,
        context: "Journal",
        id: `block:journal:${entities[1].body.doc.content[0].attrs.id}`,
        label: "Same note",
        objectId: "journal",
      },
    ],
  );
  assert.deepEqual(
    createReferenceReplacement({
      label: "Same note",
      range: { from: 6, to: 12 },
      target: {
        blockId: entities[0].body.doc.content[0].attrs.id,
        kind: "block",
        objectId: "atlas",
      },
      text: "Read ((same later",
    }).mark,
    {
      attrs: { blockId: entities[0].body.doc.content[0].attrs.id, objectId: "atlas" },
      type: "blockLink",
    },
  );
});
