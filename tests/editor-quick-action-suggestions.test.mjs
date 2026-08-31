import assert from "node:assert/strict";
import test from "node:test";
import {
  createPlusSuggestionItems,
  createTagSuggestionItems,
  normalizeSuggestionQuery,
  validTagLabel,
} from "../src/editor/quick-action-suggestion-contracts.ts";
import { createInitialStructureRegistry } from "../src/lib/workspace-object-types.ts";

const blockItems = [
  {
    id: "text",
    title: "Padrão",
    searchTerms: ["default", "text"],
    execute: () => undefined,
  },
  {
    id: "heading-1",
    title: "Cabeçalho 1",
    searchTerms: ["heading 1", "h1"],
    execute: () => undefined,
  },
];

function tag(id, title) {
  return {
    createdAt: "2026-08-31T00:00:00.000Z",
    id,
    kind: "tag",
    objectTypeId: "tag",
    propertyValues: {},
    title,
  };
}

test("+ suggestions combine supported block commands and instant Structures", () => {
  const structures = createInitialStructureRegistry();
  const items = createPlusSuggestionItems({
    blockItems,
    query: "pag",
    structures,
  });

  assert.deepEqual(
    items.map((item) => [item.kind, item.id, item.label]),
    [["object-create", "object-create:page", "Page"]],
  );
  assert.ok(
    createPlusSuggestionItems({ blockItems, query: "head", structures }).some(
      (item) => item.kind === "block" && item.id === "block:heading-1",
    ),
  );
  assert.equal(
    createPlusSuggestionItems({ blockItems, query: "web", structures }).some(
      (item) => item.id === "object-create:weblink",
    ),
    false,
  );
});

test("# suggestions normalize labels, dedupe equivalents, and avoid duplicate creates", () => {
  const items = createTagSuggestionItems({
    createTagLabel: "Criar tag",
    entities: [tag("curiosity", "Curiosity"), tag("dupe", "Cúriosity")],
    query: "curi",
    tagTitle: "Tags",
  });

  assert.deepEqual(
    items.map((item) => [item.id, item.label, item.tagId]),
    [
      ["tag:curiosity", "Curiosity", "curiosity"],
      ["tag-create:curi", "Criar tag: curi", undefined],
    ],
  );
  assert.equal(
    createTagSuggestionItems({
      entities: [tag("curiosity", "Curiosity")],
      query: "Curiosity",
    }).some((item) => item.id.startsWith("tag-create:")),
    false,
  );
  assert.deepEqual(
    createTagSuggestionItems({
      createTagLabel: "Criar tag",
      entities: [],
      query: "attention-management",
      tagTitle: "Tags",
    }).map((item) => [item.id, item.label, item.tagId]),
    [["tag-create:attention-management", "Criar tag: attention-management", undefined]],
  );
});

test("# create eligibility rejects empty, punctuation-led, and overlong labels", () => {
  assert.equal(normalizeSuggestionQuery("  Cúrio  "), "curio");
  assert.equal(validTagLabel("Curiosity"), true);
  assert.equal(validTagLabel("decision-making"), true);
  assert.equal(validTagLabel(""), false);
  assert.equal(validTagLabel("-topic"), false);
  assert.equal(validTagLabel("x".repeat(65)), false);
});
