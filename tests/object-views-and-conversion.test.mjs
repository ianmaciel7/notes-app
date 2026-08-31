import assert from "node:assert/strict";
import test from "node:test";

import {
  createDashboardSection,
  DATA_VIEW_KINDS,
  OBJECT_VIEW_KINDS,
  canCommitObjectConversion,
  commitObjectConversion,
  createDataView,
  createDefaultDataViewPresentation,
  createDefaultObjectViewConfig,
  createDefaultStructureDashboard,
  createDefaultQueryDefinition,
  createInitialWorkspaceViewState,
  createObjectConversionPlan,
  executeQueryDefinition,
  instantiateObjectTemplate,
  migrateLegacyStructureDashboard,
  parseWorkspaceViewState,
  projectDashboardBuiltInSection,
  projectTaskDashboardSection,
  projectObjectCardProperties,
  projectTableViewColumns,
  projectDataView,
  removeDashboardSection,
  reorderTableViewColumns,
  reorderDashboardSections,
  resolveConversionField,
  resolveDashboardSectionTitles,
  resolveObjectView,
  resolveStructureSmallCardPropertyIds,
  serializeWorkspaceViewState,
  setDashboardSectionVisibility,
  setStructureSmallCardPropertyIds,
  setTableViewColumnVisibility,
  setTableViewColumnWidth,
  setTableViewColumnWrapping,
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

function pageStructure(overrides = {}) {
  return {
    id: "page",
    ownership: "built-in",
    singularName: "Page",
    pluralName: "Pages",
    iconName: "page",
    tone: "sky",
    lifecycleKind: "document",
    collectionIds: [],
    presentation: {
      availableViews: ["list", "gallery", "wall", "table"],
      defaultView: "list",
    },
    propertyDefinitions: [
      {
        id: "title",
        multiple: false,
        name: "Title",
        ownership: "default",
        valueType: "title",
        writable: true,
      },
      {
        id: "description",
        multiple: false,
        name: "Description",
        ownership: "default",
        valueType: "text",
        writable: true,
      },
      {
        id: "status",
        multiple: false,
        name: "Status",
        ownership: "normal",
        valueType: "label",
        writable: true,
      },
      {
        id: "createdAt",
        multiple: false,
        name: "Created",
        ownership: "system",
        valueType: "createdAt",
        writable: false,
      },
    ],
    ...overrides,
  };
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

test("dashboard commands reject sidebar section ids and keep All immutable", () => {
  const dashboard = {
    structureId: "page",
    updatedAt: "2026-01-10T10:00:00.000Z",
    sections: [
      createDashboardSection({ kind: "all" }, 0),
      createDashboardSection(
        { kind: "built-in", builtInId: "recently-opened" },
        1,
      ),
    ],
  };

  const wrongCommandTarget = removeDashboardSection(
    dashboard,
    "sidebar-section:personal",
  );
  const removeAll = removeDashboardSection(dashboard, "dashboard-section:all");
  const hideAll = setDashboardSectionVisibility(
    dashboard,
    "dashboard-section:all",
    false,
  );

  assert.equal(wrongCommandTarget.ok, false);
  assert.equal(wrongCommandTarget.error.code, "unknown-dashboard-section");
  assert.equal(removeAll.ok, false);
  assert.equal(removeAll.error.code, "immutable-dashboard-section");
  assert.equal(hideAll.ok, false);
  assert.equal(hideAll.error.code, "immutable-dashboard-section");
});

test("dashboard sections use stable source identities and rename through sources", () => {
  const dashboard = {
    structureId: "page",
    updatedAt: "2026-01-10T10:00:00.000Z",
    sections: [
      createDashboardSection({ kind: "all" }, 0),
      createDashboardSection(
        { kind: "collection", collectionId: "collection:page:ideas" },
        1,
        {
          collections: [
            { id: "collection:page:ideas", title: "Ideas" },
          ],
        },
      ),
      createDashboardSection(
        { kind: "query", queryId: "query:page:empty" },
        2,
        {
          queries: [{ id: "query:page:empty", title: "Without title" }],
        },
      ),
    ],
  };

  const renamed = resolveDashboardSectionTitles(
    dashboard,
    {
      collections: [{ id: "collection:page:ideas", title: "Research" }],
      queries: [{ id: "query:page:empty", title: "Needs title" }],
    },
    () => "2026-01-10T11:00:00.000Z",
  );

  assert.deepEqual(
    renamed.sections.map((section) => section.title),
    ["All", "Research", "Needs title"],
  );
  assert.deepEqual(
    renamed.sections.map((section) => section.source),
    dashboard.sections.map((section) => section.source),
  );
});

test("removing and reordering dashboard sections changes presentation only", () => {
  const dashboard = {
    structureId: "page",
    updatedAt: "2026-01-10T10:00:00.000Z",
    sections: [
      createDashboardSection({ kind: "all" }, 0),
      createDashboardSection(
        { kind: "collection", collectionId: "collection:page:ideas" },
        1,
      ),
      createDashboardSection({ kind: "query", queryId: "query:page:empty" }, 2),
    ],
  };

  const hidden = expectSuccess(
    setDashboardSectionVisibility(
      dashboard,
      "dashboard-section:collection:collection:page:ideas",
      false,
    ),
  );
  const reordered = expectSuccess(
    reorderDashboardSections(
      hidden,
      [
        "dashboard-section:all",
        "dashboard-section:query:query:page:empty",
        "dashboard-section:collection:collection:page:ideas",
      ],
      () => "2026-01-10T11:00:00.000Z",
    ),
  );
  const removed = expectSuccess(
    removeDashboardSection(
      reordered,
      "dashboard-section:collection:collection:page:ideas",
      () => "2026-01-10T12:00:00.000Z",
    ),
  );

  assert.deepEqual(
    hidden.sections.map((section) => [section.id, section.visible]),
    [
      ["dashboard-section:all", true],
      ["dashboard-section:collection:collection:page:ideas", false],
      ["dashboard-section:query:query:page:empty", true],
    ],
  );
  assert.deepEqual(
    reordered.sections.map((section) => [section.id, section.order]),
    [
      ["dashboard-section:all", 0],
      ["dashboard-section:query:query:page:empty", 1],
      ["dashboard-section:collection:collection:page:ideas", 2],
    ],
  );
  assert.deepEqual(
    removed.sections.map((section) => section.id),
    ["dashboard-section:all", "dashboard-section:query:query:page:empty"],
  );
});

test("legacy dashboard sections migrate with diagnostics", () => {
  const migrated = expectSuccess(
    migrateLegacyStructureDashboard({
      structureId: "page",
      updatedAt: "2026-01-10T10:00:00.000Z",
      sections: [
        {
          id: "recent",
          kind: "recent",
          limit: 4,
          title: "Recently opened",
        },
        {
          dataViewId: "query:page:custom",
          id: "custom-query",
          kind: "data-view",
          title: "Custom query",
        },
        {
          id: "template-shortcuts",
          kind: "template-shortcuts",
          title: "Templates",
        },
      ],
    }),
  );

  assert.deepEqual(
    migrated.dashboard.sections.map((section) => [
      section.id,
      section.source.kind,
      section.visible,
    ]),
    [
      ["dashboard-section:built-in:recently-opened", "built-in", true],
      ["dashboard-section:query:query:page:custom", "query", true],
      ["dashboard-section:unknown:template-shortcuts", "built-in", false],
    ],
  );
  assert.deepEqual(
    migrated.diagnostics.map((diagnostic) => diagnostic.code),
    [
      "legacy-section-migrated",
      "legacy-section-migrated",
      "unknown-section-hidden",
    ],
  );
});

test("built-in dashboard projections use canonical local data only", () => {
  const relationSourcesByTargetId = new Map([["page-1", ["page-2"]]]);
  const pageEntities = [
    { ...entities[0], collections: ["collection:page:work"] },
    { ...entities[1], collections: [] },
    entities[2],
  ];

  const untagged = projectDashboardBuiltInSection("untagged", {
    entities: pageEntities,
    relationSourcesByTargetId,
    structureId: "page",
  });
  const withoutCollection = projectDashboardBuiltInSection(
    "not-in-collection",
    {
      entities: pageEntities,
      relationSourcesByTargetId,
      structureId: "page",
    },
  );
  const noBacklinks = projectDashboardBuiltInSection("no-backlinks", {
    entities: pageEntities,
    relationSourcesByTargetId,
    structureId: "page",
  });
  const recentlyOpened = projectDashboardBuiltInSection("recently-opened", {
    entities: pageEntities,
    relationSourcesByTargetId,
    structureId: "page",
  });
  const collections = projectDashboardBuiltInSection("collections", {
    collectionRecords: [{ id: "collection:page:work", title: "Work" }],
    entities: pageEntities,
    relationSourcesByTargetId,
    structureId: "page",
  });

  assert.deepEqual(untagged.items.map((entity) => entity.id), []);
  assert.deepEqual(
    withoutCollection.items.map((entity) => entity.id),
    ["page-2"],
  );
  assert.deepEqual(noBacklinks.items.map((entity) => entity.id), ["page-2"]);
  assert.equal(recentlyOpened.supported, false);
  assert.match(recentlyOpened.reason, /opened-at/);
  assert.equal(collections.supported, true);
});

test("task dashboard sections are projected only through a supplied provider", () => {
  const missingProvider = projectTaskDashboardSection(
    "task-dashboard:today",
    "Today",
    { entities, structureId: "task" },
    undefined,
  );
  const provided = projectTaskDashboardSection(
    "task-dashboard:today",
    "Today",
    { entities, structureId: "task" },
    {
      project: (input) => ({
        id: "task-dashboard:today",
        items: input.entities.filter((entity) => entity.kind === "task"),
        supported: true,
        title: "Today",
      }),
    },
  );

  assert.equal(missingProvider.supported, false);
  assert.match(missingProvider.reason, /provider/);
  assert.deepEqual(provided.items.map((entity) => entity.id), ["task-1"]);
});

test("small-card property order is stored on Structure presentation and reused", () => {
  const structure = pageStructure();
  const configured = expectSuccess(
    setStructureSmallCardPropertyIds(structure, [
      "title",
      "status",
      "description",
      "objectTypeId",
    ]),
  );

  assert.deepEqual(resolveStructureSmallCardPropertyIds(structure), [
    "title",
    "objectTypeId",
    "createdAt",
  ]);
  assert.deepEqual(resolveStructureSmallCardPropertyIds(configured), [
    "title",
    "status",
    "description",
    "objectTypeId",
  ]);
  assert.equal(
    setStructureSmallCardPropertyIds(configured, ["title", "title"]).ok,
    false,
  );
  assert.equal(
    setStructureSmallCardPropertyIds(configured, ["missing"]).ok,
    false,
  );
});

test("gallery preserves empty configured card slots while wall stays compact", () => {
  const structure = expectSuccess(
    setStructureSmallCardPropertyIds(pageStructure(), [
      "title",
      "description",
      "status",
    ]),
  );
  const entity = {
    ...entities[0],
    propertyValues: {
      description: { text: { value: "" }, type: "text" },
      status: { label: [{ id: "status:draft", name: "Draft" }], type: "label" },
    },
  };
  const gallery = projectObjectCardProperties(entity, structure, "gallery");
  const wall = projectObjectCardProperties(entity, structure, "wall");

  assert.deepEqual(
    gallery.map((property) => [
      property.propertyId,
      property.empty,
      property.directEdit,
    ]),
    [
      ["title", false, true],
      ["description", true, false],
      ["status", false, true],
    ],
  );
  assert.deepEqual(
    wall.map((property) => property.propertyId),
    ["title", "status"],
  );
});

test("table view column presentation persists independently from object values", () => {
  const view = {
    createdAt: "2026-01-10T10:00:00.000Z",
    creatorId: "user-1",
    id: "view-1",
    name: "Pages table",
    presentation: {
      columns: [
        {
          id: "title",
          label: "Title",
          propertyId: "title",
          visible: true,
          width: 240,
        },
        {
          id: "status",
          label: "Status",
          propertyId: "status",
          visible: true,
        },
        {
          id: "legacy",
          label: "Legacy",
          propertyId: "legacy",
          visible: true,
        },
      ],
      kind: "table",
      rowDensity: "comfortable",
      visiblePropertyIds: ["title", "status"],
    },
    query: createDefaultQueryDefinition(),
    updatedAt: "2026-01-10T10:00:00.000Z",
    workspaceId: "workspace-1",
  };

  const hidden = expectSuccess(
    setTableViewColumnVisibility(view, "legacy", false),
  );
  const wrapped = expectSuccess(
    setTableViewColumnWrapping(hidden, "title", true),
  );
  const resized = expectSuccess(setTableViewColumnWidth(wrapped, "title", 320));
  const reordered = expectSuccess(
    reorderTableViewColumns(resized, ["status", "title", "legacy"]),
  );
  const projected = expectSuccess(
    projectTableViewColumns(reordered, pageStructure()),
  );
  const parsed = expectSuccess(
    parseWorkspaceViewState(
      serializeWorkspaceViewState({
        dashboards: [],
        dataViews: [reordered],
        templates: [],
        version: 1,
      }),
    ),
  );

  assert.deepEqual(
    projected.map((column) => [
      column.id,
      column.visible,
      column.wrap ?? false,
      column.width ?? null,
      column.missing,
    ]),
    [
      ["status", true, false, null, false],
      ["title", true, true, 320, false],
      ["legacy", false, false, null, true],
    ],
  );
  assert.deepEqual(entities.map((entity) => entity.id), [
    "page-1",
    "page-2",
    "task-1",
  ]);
  assert.deepEqual(
    parsed.dataViews[0].presentation.columns.map((column) => [
      column.id,
      column.visible,
      column.wrap ?? false,
      column.width ?? null,
    ]),
    [
      ["status", true, false, null],
      ["title", true, true, 320],
      ["legacy", false, false, null],
    ],
  );
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

test("view state parser upgrades legacy dashboard records on load", () => {
  const parsed = expectSuccess(
    parseWorkspaceViewState(
      JSON.stringify({
        dashboards: [
          {
            structureId: "page",
            updatedAt: "2026-01-10T10:00:00.000Z",
            sections: [
              {
                id: "recent",
                kind: "recent",
                title: "Recently opened",
              },
            ],
          },
        ],
        dataViews: [],
        templates: [],
        version: 1,
      }),
    ),
  );
  const next = createDefaultStructureDashboard(
    "page",
    () => "2026-01-10T10:00:00.000Z",
  );

  assert.deepEqual(parsed.dashboards[0].sections[0], {
    id: "dashboard-section:built-in:recently-opened",
    order: 0,
    source: { builtInId: "recently-opened", kind: "built-in" },
    title: "Recently opened",
    visible: true,
  });
  assert.deepEqual(next.sections[0], {
    id: "dashboard-section:all",
    order: 0,
    source: { kind: "all" },
    title: "All",
    visible: true,
  });
});
