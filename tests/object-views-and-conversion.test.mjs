import assert from "node:assert/strict";
import test from "node:test";

import {
  DATA_VIEW_KINDS,
  OBJECT_VIEW_KINDS,
  canCommitObjectConversion,
  commitObjectConversion,
  createDataView,
  createDefaultDataViewPresentation,
  createDefaultObjectViewConfig,
  createDefaultQueryDefinition,
  createInitialWorkspaceViewState,
  createObjectConversionPlan,
  executeQueryDefinition,
  instantiateObjectTemplate,
  parseWorkspaceViewState,
  projectDataView,
  resolveConversionField,
  resolveObjectView,
  serializeWorkspaceViewState,
  switchDataViewKind,
} from "../src/lib/workspace-object-views.ts";

const entities = [
  {
    id: "page-1",
    objectTypeId: "page",
    title: "Alpha",
    createdAt: "2026-01-01T10:00:00.000Z",
    kind: "document",
    tags: ["work"],
  },
  {
    id: "page-2",
    objectTypeId: "page",
    title: "Beta",
    createdAt: "2026-01-02T10:00:00.000Z",
    kind: "document",
    tags: ["personal"],
  },
  {
    id: "task-1",
    objectTypeId: "task",
    title: "Write tests",
    createdAt: "2026-01-03T10:00:00.000Z",
    kind: "task",
  },
];

function expectSuccess(result) {
  assert.equal(result.ok, true, result.ok ? undefined : result.error.message);
  return result.value;
}

test("object and data view taxonomies stay distinct and never persist grid", () => {
  assert.deepEqual(OBJECT_VIEW_KINDS, [
    "inline",
    "link-block",
    "small-card",
    "wide-card",
    "embed",
    "page",
  ]);
  assert.deepEqual(DATA_VIEW_KINDS, [
    "list",
    "table",
    "gallery",
    "wall",
    "embed",
  ]);
  assert.equal(DATA_VIEW_KINDS.includes("grid"), false);
});

test("switching Data View layout preserves query membership", () => {
  const query = {
    version: 1,
    filters: [
      { field: "structure", operator: "is-any-of", value: ["page"] },
    ],
    sorts: [{ field: "title", direction: "ascending" }],
  };
  const [listView] = expectSuccess(
    createDataView(
      [],
      {
        creatorId: "user-1",
        name: "Pages",
        query,
        workspaceId: "workspace-1",
      },
      () => "view-1",
      () => "2026-01-10T10:00:00.000Z",
    ),
  );
  const tableView = switchDataViewKind(
    listView,
    "table",
    () => "2026-01-10T11:00:00.000Z",
  );
  const galleryView = switchDataViewKind(
    tableView,
    "gallery",
    () => "2026-01-10T12:00:00.000Z",
  );

  assert.strictEqual(tableView.query, listView.query);
  assert.strictEqual(galleryView.query, listView.query);
  assert.deepEqual(
    executeQueryDefinition(entities, listView.query).map((entity) => entity.id),
    ["page-1", "page-2"],
  );
  assert.deepEqual(
    executeQueryDefinition(entities, galleryView.query).map(
      (entity) => entity.id,
    ),
    ["page-1", "page-2"],
  );
});

test("query execution filters, searches, sorts, and limits canonical entities", () => {
  const result = executeQueryDefinition(entities, {
    version: 1,
    filters: [
      { field: "kind", operator: "is-not", value: "task" },
      { field: "title", operator: "contains", value: "a" },
    ],
    search: "page",
    sorts: [{ field: "createdAt", direction: "descending" }],
    limit: 1,
  });

  assert.deepEqual(result.map((entity) => entity.id), ["page-2"]);
  assert.strictEqual(result[0], entities[1]);
});

test("Object Views resolve the same canonical object and expose a safe missing state", () => {
  const config = createDefaultObjectViewConfig("page");
  const ready = resolveObjectView(entities, "page-1", config);
  const missing = resolveObjectView(entities, "deleted-object", config);

  assert.equal(ready.status, "ready");
  assert.strictEqual(ready.entity, entities[0]);
  assert.deepEqual(missing, {
    config,
    entityId: "deleted-object",
    status: "missing",
  });
});

test("Data View projection groups without copying or mutating object state", () => {
  const [view] = expectSuccess(
    createDataView(
      [],
      {
        creatorId: "user-1",
        name: "By type",
        presentation: {
          ...createDefaultDataViewPresentation("list"),
          groupBy: { propertyId: "objectTypeId", direction: "ascending" },
        },
        query: createDefaultQueryDefinition(),
        workspaceId: "workspace-1",
      },
      () => "view-1",
      () => "2026-01-10T10:00:00.000Z",
    ),
  );
  const projection = projectDataView(view, entities);

  assert.deepEqual(
    projection.groups.map((group) => [
      group.label,
      group.items.map((entity) => entity.id),
    ]),
    [
      ["page", ["page-2", "page-1"]],
      ["task", ["task-1"]],
    ],
  );
  assert.strictEqual(projection.groups[0].items[0], entities[1]);
});

test("template instantiation creates fresh object and nested block ids", () => {
  const ids = ["block-a", "block-b", "object-a"];
  const template = {
    id: "template-1",
    structureId: "page",
    name: "Meeting notes",
    title: "Meeting",
    propertyValues: { status: "draft" },
    blocks: [
      {
        id: "template-block-1",
        type: "heading",
        children: [{ id: "template-block-2", type: "paragraph" }],
      },
    ],
  };
  const instance = instantiateObjectTemplate(template, () => ids.shift());

  assert.equal(instance.objectId, "object-a");
  assert.equal(instance.blocks[0].id, "block-a");
  assert.equal(instance.blocks[0].children[0].id, "block-b");
  assert.notStrictEqual(instance.propertyValues, template.propertyValues);
  assert.equal(template.blocks[0].id, "template-block-1");
});

test("conversion requires explicit resolution and commits atomically", () => {
  const source = {
    id: "source",
    propertyDefinitions: [
      {
        id: "title",
        name: "Title",
        valueType: "title",
        writable: true,
        multiple: false,
      },
      {
        id: "rating",
        name: "Rating",
        valueType: "number",
        writable: true,
        multiple: false,
      },
    ],
  };
  const target = {
    id: "target",
    propertyDefinitions: [
      {
        id: "title",
        name: "Title",
        valueType: "text",
        writable: true,
        multiple: false,
      },
      {
        id: "score",
        name: "Score",
        valueType: "number",
        writable: true,
        multiple: false,
      },
    ],
  };
  const sourceValues = { title: "Example", rating: 5 };
  const initialPlan = createObjectConversionPlan(source, target, sourceValues);

  assert.equal(canCommitObjectConversion(initialPlan), false);
  assert.equal(commitObjectConversion(initialPlan).ok, false);

  const titleResolved = expectSuccess(
    resolveConversionField(
      initialPlan,
      "title",
      { kind: "map", targetPropertyId: "title" },
      target,
    ),
  );
  const completedPlan = expectSuccess(
    resolveConversionField(
      titleResolved,
      "rating",
      { kind: "map", targetPropertyId: "score" },
      target,
    ),
  );
  const conversion = expectSuccess(commitObjectConversion(completedPlan));

  assert.equal(canCommitObjectConversion(completedPlan), true);
  assert.deepEqual(conversion, {
    propertyValues: { title: "Example", score: 5 },
    sourceStructureId: "source",
    targetStructureId: "target",
  });
  assert.deepEqual(sourceValues, { title: "Example", rating: 5 });
});

test("view state round-trips with ownership and presentation only", () => {
  const state = createInitialWorkspaceViewState();
  const serialized = serializeWorkspaceViewState(state);
  const parsed = expectSuccess(parseWorkspaceViewState(serialized));

  assert.deepEqual(parsed, state);
  assert.equal(parseWorkspaceViewState('{"version":1}').ok, false);
});
