import assert from "node:assert/strict";
import test from "node:test";

import {
  createCollectionId,
  createTagId,
  migrateLegacyCollectionsByStructure,
  migrateLegacyTagNames,
  selectWorkspaceCollectionRecordsForStructure,
  selectWorkspaceReverseProjections,
} from "../src/lib/workspace-domain-identities.ts";

function entity(overrides = {}) {
  return {
    id: "page-1",
    objectTypeId: "page",
    title: "Page",
    createdAt: "2026-08-25T00:00:00.000Z",
    propertyValues: {},
    kind: "document",
    body: { schemaVersion: 1, doc: { type: "doc", content: [] } },
    collections: [],
    tags: [],
    ...overrides,
  };
}

test("tag and collection ids are stable across display renames", () => {
  const used = new Set();
  const tagId = createTagId("Decision Making", used);
  const collectionId = createCollectionId("book", "Reading List", new Set());

  assert.equal(tagId, "tag:decision-making");
  assert.equal(collectionId, "collection:book:reading-list");
  assert.equal(
    createTagId("Decision Making", used),
    "tag:decision-making-cf0qgk",
  );
});

test("legacy names migrate to deterministic collision-safe records", () => {
  assert.deepEqual(migrateLegacyTagNames(["AI", "AI", " ai "]), [
    { id: "tag:ai", name: "AI" },
    { id: "tag:ai-9xx36n", name: "AI" },
    { id: "tag:ai-iwobdr", name: "ai" },
  ]);
  assert.deepEqual(
    migrateLegacyCollectionsByStructure({
      book: ["Reading", "Reading"],
      person: ["Reading"],
    }).map((collection) => collection.id),
    [
      "collection:book:reading",
      "collection:book:reading-1kf8ao",
      "collection:person:reading",
    ],
  );
});

test("collection records are selected by their owning structure without recreating ids", () => {
  const collections = {
    "collection:book:reading": {
      id: "collection:book:reading",
      name: "Reading",
      structureId: "book",
    },
    "collection:page:reading": {
      id: "collection:page:reading",
      name: "Reading",
      structureId: "page",
    },
  };

  assert.deepEqual(
    selectWorkspaceCollectionRecordsForStructure(collections, "page"),
    [collections["collection:page:reading"]],
  );
});

test("reverse projections keep tags collections and relations distinct", () => {
  const index = selectWorkspaceReverseProjections([
    entity({
      id: "page-1",
      collections: ["collection:page:research"],
      tags: ["tag:ai"],
      propertyValues: {
        related: { type: "entity", entity: [{ id: "page-2" }] },
      },
    }),
    entity({ id: "page-2", title: "Target" }),
  ]);

  assert.deepEqual(index.tagMembershipsByTagId.get("tag:ai"), ["page-1"]);
  assert.deepEqual(
    index.collectionMembershipsByCollectionId.get("collection:page:research"),
    ["page-1"],
  );
  assert.deepEqual(index.relationSourcesByTargetId.get("page-2"), ["page-1"]);
});
