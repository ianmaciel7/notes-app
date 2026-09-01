import assert from "node:assert/strict";
import test from "node:test";
import { blockEditorDocumentFromPlainText } from "../src/editor/document.ts";
import {
  createBlockReferenceSuggestionItems,
  createObjectReferenceSuggestionItems,
  createReferenceReplacement,
  insertReferenceSuggestion,
} from "../src/editor/reference-suggestions.ts";
import {
  createObjectReferenceMark,
  createWorkspaceObjectLinkIndex,
  selectBacklinksForObject,
} from "../src/lib/workspace-object-links.ts";
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

test("@ lookup excludes objects whose runtime Structure is unavailable", () => {
  const entities = [
    page("atlas", "Project Atlas", { objectTypeId: "project" }),
    page("orphan", "Orphan Atlas", { objectTypeId: "missing-structure" }),
  ];

  assert.deepEqual(
    createObjectReferenceSuggestionItems({
      entities,
      index: buildWorkspaceSearchIndex(entities),
      query: "atlas",
      structures,
      trigger: "@",
    }).map((item) => item.objectId),
    ["atlas"],
  );
});

test("@ lookup carries the runtime Structure icon identity and tone", () => {
  const entities = [page("atlas", "Project Atlas", { objectTypeId: "project" })];

  assert.deepEqual(
    createObjectReferenceSuggestionItems({
      entities,
      index: buildWorkspaceSearchIndex(entities),
      query: "atlas",
      structures: [
        {
          iconName: "project",
          id: "project",
          singularName: "Project",
          tone: "emerald",
        },
      ],
      trigger: "@",
    }),
    [
      {
        context: "Project",
        iconName: "project",
        id: "object:atlas",
        label: "Project Atlas",
        objectId: "atlas",
        tone: "emerald",
      },
    ],
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

test("@ selection commits focus, replacement, and stable identity in one transaction", () => {
  const calls = [];
  const chain = {
    deleteRange: (range) => {
      calls.push(["deleteRange", range]);
      return chain;
    },
    focus: () => {
      calls.push(["focus"]);
      return chain;
    },
    insertContent: (label) => {
      calls.push(["insertContent", label]);
      return chain;
    },
    run: () => {
      calls.push(["run"]);
      return true;
    },
    setMark: (name, attrs) => {
      calls.push(["setMark", name, attrs]);
      return chain;
    },
    unsetMark: (name) => {
      calls.push(["unsetMark", name]);
      return chain;
    },
  };
  const editor = {
    chain: () => {
      calls.push(["chain"]);
      return chain;
    },
  };

  assert.equal(
    insertReferenceSuggestion(editor, { from: 5, to: 9 }, {
      context: "Project",
      iconName: "project",
      id: "object:atlas",
      kind: "object",
      label: "Project Atlas",
      mark: createObjectReferenceMark("atlas"),
      objectId: "atlas",
      tone: "emerald",
    }),
    true,
  );
  assert.deepEqual(calls, [
    ["chain"],
    ["focus"],
    ["deleteRange", { from: 5, to: 9 }],
    ["setMark", "objectLink", { objectId: "atlas" }],
    ["insertContent", "Project Atlas"],
    ["unsetMark", "objectLink"],
    ["run"],
  ]);
});

test("reference replacement rejects invalid ranges and identities atomically", () => {
  assert.equal(
    createReferenceReplacement({
      label: "Project Atlas",
      range: { from: 5, to: 99 },
      target: { kind: "object", objectId: "atlas" },
      text: "Meet @atl soon",
    }),
    null,
  );
  assert.equal(
    createReferenceReplacement({
      label: "Project Atlas",
      range: { from: 5, to: 9 },
      target: { kind: "object", objectId: "" },
      text: "Meet @atl soon",
    }),
    null,
  );
});

test("renamed targets keep stable @ identity and refresh backlink labels", () => {
  const source = page("source", "Source", { body: "Project Atlas" });
  source.body.doc.content[0].content[0].marks = [
    createObjectReferenceMark("atlas"),
  ];
  const renamedTarget = page("atlas", "Atlas Renamed", {
    aliases: ["Project Atlas"],
  });
  const entities = [source, renamedTarget];

  assert.deepEqual(
    createObjectReferenceSuggestionItems({
      entities,
      index: buildWorkspaceSearchIndex(entities),
      query: "Project Atlas",
      structures,
      trigger: "@",
    })
      .filter((item) => item.objectId === "atlas")
      .map((item) => [item.objectId, item.label]),
    [["atlas", "Atlas Renamed"]],
  );
  assert.deepEqual(
    selectBacklinksForObject(
      createWorkspaceObjectLinkIndex(entities),
      "atlas",
    ).map((backlink) => [backlink.sourceId, backlink.targetTitle]),
    [["source", "Atlas Renamed"]],
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
      range: { from: 5, to: 11 },
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
