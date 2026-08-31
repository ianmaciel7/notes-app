import assert from "node:assert/strict";
import test from "node:test";

import { blockEditorDocumentFromPlainText } from "../src/editor/document.ts";
import { createObjectReferenceMark } from "../src/lib/workspace-object-links.ts";
import {
  NOTES_APP_RELATED_CONTENT_PROVIDER_ID,
  NOTES_APP_RELATED_CONTENT_PROVIDER_VERSION,
  RelatedContentCache,
  notesAppLocalRelatedContentProvider,
  relatedContentCacheKey,
  selectRelatedContent,
  validateRelatedContentResults,
} from "../src/lib/workspace-related-content.ts";

function documentEntity(id, title, body, options = {}) {
  return {
    id,
    title,
    objectTypeId: "page",
    createdAt: options.createdAt ?? "2026-08-20T00:00:00.000Z",
    kind: "document",
    body: options.body ?? blockEditorDocumentFromPlainText(body),
    collections: options.collections ?? [],
    tags: options.tags ?? [],
    propertyValues: options.propertyValues ?? {},
    aliases: options.aliases,
    dailyNote: options.spaceId ? { date: "2026-08-20", spaceId: options.spaceId } : undefined,
    trashed: options.trashed,
  };
}

function linkedSourceBody() {
  return {
    schemaVersion: 2,
    doc: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { id: "source-link-block" },
          content: [
            { type: "text", text: "alpha beta notes " },
            {
              type: "text",
              text: "Linked",
              marks: [createObjectReferenceMark("link-target")],
            },
          ],
        },
      ],
    },
  };
}

function baseInput(overrides = {}) {
  return {
    entities: [
      documentEntity("source", "Research planning", "alpha beta notes", {
        body: linkedSourceBody(),
        collections: ["collection:page:research"],
        tags: ["tag:alpha"],
        propertyValues: {
          relation: {
            type: "entity",
            entity: [{ id: "relation-target" }],
          },
        },
        spaceId: "space-a",
      }),
      documentEntity("lexical-target", "Alpha field notes", "beta archive", {
        spaceId: "space-a",
      }),
      documentEntity("link-target", "Linked", "reference", {
        spaceId: "space-a",
      }),
      documentEntity("relation-target", "Relation", "object", {
        spaceId: "space-a",
      }),
      documentEntity("tag-target", "Shared tag", "other", {
        tags: ["tag:alpha"],
        spaceId: "space-a",
      }),
      documentEntity("collection-target", "Shared collection", "other", {
        collections: ["collection:page:research"],
        spaceId: "space-a",
      }),
      documentEntity("recent-target", "Recent", "other", {
        createdAt: "2026-08-30T00:00:00.000Z",
        spaceId: "space-a",
      }),
    ],
    generatedAt: "2026-08-31T00:00:00.000Z",
    indexRevision: "index-1",
    limit: 5,
    sourceId: "source",
    sourceRevision: "source-1",
    spaceId: "space-a",
    ...overrides,
  };
}

test("provider validation rejects invalid targets and bounds results", () => {
  const input = baseInput({
    entities: [
      documentEntity("source", "Source", "same", { spaceId: "space-a" }),
      documentEntity("valid", "Valid", "same", { spaceId: "space-a" }),
      documentEntity("trashed", "Trashed", "same", {
        spaceId: "space-a",
        trashed: true,
      }),
      documentEntity("cross-space", "Cross", "same", { spaceId: "space-b" }),
    ],
    limit: 1,
  });
  const result = validateRelatedContentResults(input, {
    generatedAt: input.generatedAt,
    providerId: "provider",
    providerVersion: "1",
    revision: "revision",
    results: [
      { providerId: "provider", providerVersion: "1", reasons: [], score: 9, targetId: "source" },
      { providerId: "provider", providerVersion: "1", reasons: [], score: Number.NaN, targetId: "valid" },
      { providerId: "provider", providerVersion: "1", reasons: [], score: 8, targetId: "missing" },
      { providerId: "provider", providerVersion: "1", reasons: [], score: 7, targetId: "trashed" },
      { providerId: "provider", providerVersion: "1", reasons: [], score: 6, targetId: "cross-space" },
      { providerId: "provider", providerVersion: "1", reasons: [], score: 5, targetId: "valid" },
      { providerId: "provider", providerVersion: "1", reasons: [], score: 4, targetId: "valid" },
    ],
  });

  assert.deepEqual(result.results.map((item) => item.targetId), ["valid"]);
  assert.equal(result.results.every((item) => Number.isFinite(item.score)), true);
  assert.deepEqual(input.entities.map((entity) => entity.id), [
    "source",
    "valid",
    "trashed",
    "cross-space",
  ]);
});

test("Notes App local ranker is deterministic and reports signal reasons", () => {
  const input = baseInput();
  const first = selectRelatedContent(input);
  const second = selectRelatedContent(input);

  assert.equal(first.kind, "ready");
  assert.equal(second.kind, "ready");
  assert.deepEqual(first.results, second.results);
  assert.equal(first.providerId, NOTES_APP_RELATED_CONTENT_PROVIDER_ID);
  assert.equal(first.providerVersion, NOTES_APP_RELATED_CONTENT_PROVIDER_VERSION);
  assert.equal(first.results.length, 5);
  assert.equal(first.results.every((item) => Number.isFinite(item.score)), true);
  assert.equal(first.results.every((item) => item.targetId !== "source"), true);
  assert.equal(first.results.some((item) => item.reasons.includes("lexical")), true);
  assert.equal(first.results.some((item) => item.reasons.includes("property-relation")), true);
  assert.equal(first.results.some((item) => item.reasons.includes("shared-tag")), true);
  assert.equal(first.results.some((item) => item.reasons.includes("shared-collection")), true);
  assert.deepEqual(
    first.results.map((item) => item.targetId),
    [...first.results.map((item) => item.targetId)],
  );
});

test("provider states distinguish unavailable empty error and offline local ranking", () => {
  const unavailable = selectRelatedContent(baseInput({ sourceId: "missing" }));
  assert.deepEqual(unavailable, {
    kind: "unavailable",
    providerId: NOTES_APP_RELATED_CONTENT_PROVIDER_ID,
    providerVersion: NOTES_APP_RELATED_CONTENT_PROVIDER_VERSION,
    reason: "missing-source",
  });

  const empty = selectRelatedContent(baseInput({ entities: [
    documentEntity("source", "Source", "alpha", { spaceId: "space-a" }),
    documentEntity("candidate", "Candidate", "omega", { spaceId: "space-a" }),
  ] }));
  assert.equal(empty.kind, "empty");

  const offline = selectRelatedContent(baseInput({ offline: true }));
  assert.equal(offline.kind, "ready");
  assert.equal(offline.partial, false);

  const error = selectRelatedContent(baseInput(), {
    id: "failing-provider",
    version: "1",
    rank() {
      throw new Error("boom");
    },
  });
  assert.equal(error.kind, "error");
  assert.equal(error.providerId, "failing-provider");
});

test("cache keys include scope revisions provider version and limit", () => {
  const input = baseInput();
  const key = relatedContentCacheKey(input);
  assert.match(key, /space-a:source:source-1:index-1/);
  assert.match(key, /notes-app-local-related-content:1:5$/);

  const cache = new RelatedContentCache();
  const state = selectRelatedContent(input);
  cache.set(key, state);
  assert.equal(cache.get(key), state);
  cache.invalidate({ type: "entity", entityId: "source" });
  assert.equal(cache.get(key), undefined);

  const providerResult = notesAppLocalRelatedContentProvider.rank(input);
  assert.equal(providerResult.revision, key);
});
