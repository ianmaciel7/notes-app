import assert from "node:assert/strict";
import test from "node:test";

import { blockEditorDocumentFromPlainText } from "../src/editor/document.ts";
import { createWorkspaceObjectLinkIndex } from "../src/lib/workspace-object-links.ts";
import {
  buildWorkspaceSearchIndex,
  evaluateQuery,
  queryDefinitionFromLegacy,
  searchWorkspaceIndex,
  updateWorkspaceSearchIndex,
} from "../src/lib/workspace-query-engine.ts";

function page(id, title, options = {}) {
  return {
    id,
    objectTypeId: options.objectTypeId ?? "page",
    title,
    createdAt: options.createdAt ?? "2026-08-20T00:00:00.000Z",
    kind: "document",
    body: blockEditorDocumentFromPlainText(options.body ?? title),
    collections: [],
    tags: options.tags ?? [],
    aliases: options.aliases ?? [],
    propertyValues: options.propertyValues ?? {},
  };
}

const emptyFilters = { filters: [], operator: "all" };

function query(overrides = {}) {
  return {
    filters: emptyFilters,
    resultKind: "object",
    selection: { mode: "all" },
    sorts: [],
    source: "search",
    variables: {},
    version: 1,
    ...overrides,
  };
}

test("typed nested filters, sorts, grouping, and limits evaluate deterministically", () => {
  const entities = [
    page("a", "Alpha", {
      objectTypeId: "project",
      createdAt: "2026-08-21T00:00:00.000Z",
      propertyValues: { score: { type: "number", number: 9 } },
    }),
    page("b", "Beta", {
      objectTypeId: "project",
      createdAt: "2026-08-22T00:00:00.000Z",
      propertyValues: { score: { type: "number", number: 4 } },
    }),
    page("c", "Gamma", { objectTypeId: "page" }),
  ];
  const definition = query({
    filters: {
      operator: "all",
      filters: [
        { kind: "structure", operator: "is-any-of", structureIds: ["project"] },
        {
          operator: "any",
          filters: [
            { kind: "property", propertyId: "score", operator: "greater-than", value: 8 },
            { kind: "text", operator: "equals", value: "Beta" },
          ],
        },
      ],
    },
    grouping: { propertyId: "objectTypeId" },
    limit: 1,
    sorts: [{ propertyId: "createdAt", direction: "descending" }],
  });

  const result = evaluateQuery(definition, entities);
  assert.equal(result.status, "ready");
  assert.deepEqual(result.items.map((item) => item.id), ["b"]);
  assert.deepEqual(result.groups.get("project").map((item) => item.id), ["b"]);
});

test("relation, content-link, and backlink filters stay distinct", () => {
  const target = page("target", "Target");
  const linked = page("linked", "Linked", {
    propertyValues: {
      owner: { type: "entity", entity: [{ id: "target", structureId: "page" }] },
    },
  });
  linked.body.doc.content[0].content = [
    {
      type: "text",
      text: "Target",
      marks: [{ type: "objectLink", attrs: { objectId: "target" } }],
    },
  ];
  const relationOnly = page("relation-only", "Relation", {
    propertyValues: {
      owner: { type: "entity", entity: [{ id: "target", structureId: "page" }] },
    },
  });
  const entities = [target, linked, relationOnly];
  const linkIndex = createWorkspaceObjectLinkIndex(entities);

  const relation = evaluateQuery(
    query({ filters: { operator: "all", filters: [{ kind: "relation", propertyId: "owner", operator: "contains", target: "target" }] } }),
    entities,
    { linkIndex },
  );
  assert.deepEqual(relation.items.map((item) => item.id).sort(), ["linked", "relation-only"]);

  const content = evaluateQuery(
    query({ filters: { operator: "all", filters: [{ kind: "content-link", operator: "contains", target: "target" }] } }),
    entities,
    { linkIndex },
  );
  assert.deepEqual(content.items.map((item) => item.id), ["linked"]);

  const backlink = evaluateQuery(
    query({ filters: { operator: "all", filters: [{ kind: "backlink", operator: "contains", target: "linked" }] } }),
    entities,
    { linkIndex },
  );
  assert.deepEqual(backlink.items.map((item) => item.id), ["target"]);
});

test("host variables resolve context and report an explicit unresolved state", () => {
  const host = page("host", "Host", {
    propertyValues: {
      owner: { type: "entity", entity: [{ id: "target", structureId: "page" }] },
    },
  });
  const target = page("target", "Target");
  const definition = query({
    variables: { current: { kind: "host-object" } },
    filters: {
      operator: "all",
      filters: [{ kind: "property", propertyId: "id", operator: "equals", value: { kind: "variable", name: "current" } }],
    },
  });

  assert.deepEqual(evaluateQuery(definition, [host, target]), {
    missingVariables: ["current"],
    status: "unresolved",
  });
  const resolved = evaluateQuery(definition, [host, target], { hostObjectId: "host" });
  assert.equal(resolved.status, "ready");
  assert.deepEqual(resolved.items.map((item) => item.id), ["host"]);
});

test("seeded random selection is stable and independent of incidental input order", () => {
  const entities = [page("a", "A"), page("b", "B"), page("c", "C"), page("d", "D")];
  const definition = query({ selection: { mode: "random", count: 2, seed: "daily" } });
  const first = evaluateQuery(definition, entities);
  const second = evaluateQuery(definition, [...entities].reverse());
  assert.equal(first.status, "ready");
  assert.equal(second.status, "ready");
  assert.deepEqual(first.items.map((item) => item.id), second.items.map((item) => item.id));
});

test("object and block search indexes are rebuildable and incrementally replace one entity", () => {
  const alpha = page("a", "Project Atlas", { aliases: ["Atlas"], body: "Milestone launch" });
  const beta = page("b", "Meeting", { body: "Discuss Atlas risks" });
  const index = buildWorkspaceSearchIndex([alpha, beta]);

  const results = searchWorkspaceIndex(index, "atlas");
  assert.ok(results.some((result) => result.kind === "object" && result.entityId === "a"));
  assert.ok(results.some((result) => result.kind === "block" && result.entityId === "b"));

  const updated = page("a", "Project Nova", { body: "Nova launch" });
  const nextIndex = updateWorkspaceSearchIndex(index, updated);
  assert.equal(searchWorkspaceIndex(nextIndex, "Project Atlas", "object").length, 0);
  assert.equal(searchWorkspaceIndex(nextIndex, "Project Nova", "object")[0].entityId, "a");
});

test("legacy query entities adapt into the canonical declarative definition", () => {
  const definition = queryDefinitionFromLegacy({
    filters: { tags: ["tag:research"] },
    objectTypeId: "page",
    search: "atlas",
  });

  assert.equal(definition.source, "search");
  assert.equal(definition.resultKind, "object");
  assert.equal(definition.filters.filters.length, 3);
  assert.deepEqual(definition.selection, { mode: "all" });
});
