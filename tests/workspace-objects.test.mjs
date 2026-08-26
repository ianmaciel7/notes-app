import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToPlainText,
} from "../src/editor/document.ts";
import {
  parseWorkspaceObjectSnapshot,
  serializeWorkspaceObjectState,
} from "../src/lib/workspace-object-storage.ts";
import {
  createCustomStructure,
  OBJECT_TYPE_PRESETS,
} from "../src/lib/workspace-object-types.ts";
import {
  acceptsFileForType,
  applyQueryDescription,
  countEntitiesByType,
  createInitialWorkspaceObjectState,
  deriveUrlMetadata,
  getCreationFlow,
  getWorkspaceImportError,
  selectQueryResults,
  workspaceObjectReducer,
} from "../src/lib/workspace-objects.ts";

function reduce(state, ...actions) {
  return actions.reduce(workspaceObjectReducer, state);
}

function readUpdatedAt(entity) {
  return entity.propertyValues.lastUpdatedAt.lastUpdatedAt.value;
}

test("creation flows cover built-ins while presets remain templates until instantiated", () => {
  for (const id of [
    "book",
    "person",
    "area",
    "meeting",
    "definition",
    "idea",
    "place",
    "project",
    "organization",
    "media",
    "travel",
    "atomic-note",
    "quote",
  ]) {
    assert.equal(getCreationFlow(id), null, id);
  }
  assert.equal(getCreationFlow("page"), "document");
  assert.equal(getCreationFlow("ai-chat"), "document");
  assert.equal(getCreationFlow("table"), "table");
  assert.equal(getCreationFlow("task"), "task");
  assert.equal(getCreationFlow("weblink"), "url");
  assert.equal(getCreationFlow("tweet"), "url");
  assert.equal(getCreationFlow("tag"), "tag");
  assert.equal(getCreationFlow("query"), "query");
  assert.equal(getCreationFlow("image"), "file");
  assert.equal(getCreationFlow("pdf"), "file");
  assert.equal(getCreationFlow("audio"), "file");
  assert.equal(getCreationFlow("file"), "file");
  assert.equal(getCreationFlow("unknown"), null);

  const customBook = reduce(createInitialWorkspaceObjectState(), {
    id: "book-custom",
    presetId: "book",
    type: "createStructureFromPreset",
  });
  assert.equal(
    getCreationFlow("book-custom", customBook.structures),
    "document",
  );
});

test("instantiated preset Structures create persistent entities through custom ids", () => {
  const customIds = OBJECT_TYPE_PRESETS.map((preset) => `${preset.id}-custom`);

  const state = reduce(
    createInitialWorkspaceObjectState(),
    ...OBJECT_TYPE_PRESETS.map((preset, index) => ({
      id: customIds[index],
      presetId: preset.id,
      type: "createStructureFromPreset",
    })),
    ...customIds.map((objectTypeId) => ({ type: "beginCreate", objectTypeId })),
  );

  assert.equal(state.entities.length, customIds.length);
  assert.deepEqual(
    state.entities.map((entity) => entity.objectTypeId),
    customIds,
  );
  assert.deepEqual(
    state.entities.map((entity) => entity.kind),
    OBJECT_TYPE_PRESETS.map((preset) =>
      preset.lifecycleKind === "quote" ? "quote" : "document",
    ),
  );
  assert.equal(state.draft, null);
  assert.deepEqual(countEntitiesByType(state.entities), {
    "area-custom": 1,
    "atomic-note-custom": 1,
    "book-custom": 1,
    "definition-custom": 1,
    "idea-custom": 1,
    "media-custom": 1,
    "meeting-custom": 1,
    "organization-custom": 1,
    "person-custom": 1,
    "place-custom": 1,
    "project-custom": 1,
    "quote-custom": 1,
    "travel-custom": 1,
  });
});

test("reserved and unknown object types cannot mutate entity state", () => {
  const unsupported = ["custom-example", "archive"];

  for (const objectTypeId of unsupported) {
    const initial = createInitialWorkspaceObjectState();
    const next = workspaceObjectReducer(initial, {
      type: "beginCreate",
      objectTypeId,
    });
    assert.equal(next.entities.length, 0, objectTypeId);
    assert.equal(next.nextId, initial.nextId, objectTypeId);
    assert.equal(next.error, "unsupported-object-type", objectTypeId);
  }
});

test("immediate creations receive collision-free ids and derived counts", () => {
  const state = reduce(
    createInitialWorkspaceObjectState(),
    { type: "beginCreate", objectTypeId: "query" },
    { type: "beginCreate", objectTypeId: "query" },
    { type: "beginCreate", objectTypeId: "page" },
  );

  assert.deepEqual(
    state.entities.map((entity) => entity.id),
    ["created-query-1", "created-query-2", "created-page-3"],
  );
  assert.deepEqual(countEntitiesByType(state.entities), { page: 1, query: 2 });
});

test("drafted flows do not create entities until a valid commit", () => {
  const initial = createInitialWorkspaceObjectState();
  const taskDraft = workspaceObjectReducer(initial, {
    type: "beginCreate",
    objectTypeId: "task",
  });

  assert.equal(taskDraft.entities.length, 0);
  assert.equal(taskDraft.draft?.kind, "task");

  const invalid = workspaceObjectReducer(taskDraft, {
    type: "commitTask",
    title: "   ",
  });
  assert.equal(invalid.entities.length, 0);
  assert.equal(invalid.error, "required-title");

  const committed = workspaceObjectReducer(invalid, {
    type: "commitTask",
    title: "Write tests",
  });
  assert.equal(committed.entities.length, 1);
  assert.equal(committed.entities[0].title, "Write tests");
  assert.equal(committed.draft, null);
  assert.equal(committed.activeEntityId, null);
});

test("canonical edits update one entity without inflating counts", () => {
  const created = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    type: "beginCreate",
    objectTypeId: "page",
  });
  const id = created.entities[0].id;
  const edited = workspaceObjectReducer(created, {
    type: "updateEntity",
    id,
    patch: {
      title: "Typed page",
      body: blockEditorDocumentFromPlainText("Body"),
    },
  });

  assert.equal(edited.entities[0].title, "Typed page");
  assert.equal(blockEditorDocumentToPlainText(edited.entities[0].body), "Body");
  assert.deepEqual(countEntitiesByType(edited.entities), { page: 1 });
});

test("document menu lifecycle changes type, duplicates, and deletes canonically", () => {
  let state = reduce(
    createInitialWorkspaceObjectState(),
    { type: "beginCreate", objectTypeId: "page" },
    {
      type: "updateEntity",
      id: "created-page-1",
      patch: {
        title: "Reference page",
        body: blockEditorDocumentFromPlainText("Preserved body"),
      },
    },
    { type: "duplicateEntity", id: "created-page-1" },
  );

  assert.equal(state.entities.length, 2);
  assert.equal(state.activeEntityId, "created-page-2");
  assert.equal(state.entities[1].title, "Reference page");
  const beforeTypeChangeUpdatedAt = readUpdatedAt(state.entities[1]);

  state = reduce(state, {
    type: "changeEntityType",
    id: "created-page-2",
    objectTypeId: "task",
  });
  assert.equal(state.entities[1].kind, "task");
  assert.equal(state.entities[1].body, "Preserved body");
  assert.notEqual(readUpdatedAt(state.entities[1]), beforeTypeChangeUpdatedAt);
  assert.deepEqual(countEntitiesByType(state.entities), { page: 1, task: 1 });

  state = reduce(state, { type: "deleteEntity", id: "created-page-2" });
  assert.deepEqual(countEntitiesByType(state.entities), { page: 1 });
  assert.equal(state.activeEntityId, "created-page-1");
});

test("confirmed type conversion persists resolved property values", () => {
  const sourceProperty = {
    id: "summary",
    multiple: false,
    name: "Summary",
    ownership: "normal",
    valueType: "text",
    writable: true,
  };
  const targetProperty = {
    id: "notes",
    multiple: false,
    name: "Notes",
    ownership: "normal",
    valueType: "text",
    writable: true,
  };
  let registry = createCustomStructure(
    createInitialWorkspaceObjectState().structures,
    {
      iconName: "page",
      lifecycleKind: "document",
      pluralName: "Sources",
      propertyDefinitions: [sourceProperty],
      singularName: "Source",
      tone: "blue",
    },
    () => "source-custom",
  ).value;
  registry = createCustomStructure(
    registry,
    {
      iconName: "page",
      lifecycleKind: "document",
      pluralName: "Targets",
      propertyDefinitions: [targetProperty],
      singularName: "Target",
      tone: "green",
    },
    () => "target-custom",
  ).value;

  let state = reduce(
    { ...createInitialWorkspaceObjectState(), structures: registry },
    { type: "beginCreate", objectTypeId: "source-custom" },
    {
      id: "created-source-custom-1",
      propertyId: "summary",
      type: "setPropertyValue",
      value: "Mapped value",
    },
  );
  const beforeTypeChangeUpdatedAt = readUpdatedAt(state.entities[0]);
  state = reduce(state, {
    id: "created-source-custom-1",
    objectTypeId: "target-custom",
    propertyValues: {
      notes: state.entities[0].propertyValues.summary,
    },
    type: "changeEntityType",
  });

  assert.equal(state.entities[0].objectTypeId, "target-custom");
  assert.equal(state.entities[0].kind, "document");
  assert.deepEqual(state.entities[0].propertyValues.notes, {
    text: { value: "Mapped value" },
    type: "text",
  });
  assert.equal("summary" in state.entities[0].propertyValues, false);
  assert.notEqual(readUpdatedAt(state.entities[0]), beforeTypeChangeUpdatedAt);
});

test("linked entity property writes update inverse values once atomically", () => {
  const author = {
    id: "author",
    inversePropertyDefinitionId: "books",
    multiple: false,
    name: "Author",
    ownership: "normal",
    targetStructureIds: ["person-custom"],
    valueType: "entity",
    writable: true,
  };
  const books = {
    id: "books",
    inversePropertyDefinitionId: "author",
    multiple: true,
    name: "Books",
    ownership: "normal",
    targetStructureIds: ["book-custom"],
    valueType: "entity",
    writable: true,
  };
  let registry = createCustomStructure(
    createInitialWorkspaceObjectState().structures,
    {
      iconName: "book",
      lifecycleKind: "document",
      pluralName: "Books",
      propertyDefinitions: [author],
      singularName: "Book",
      tone: "purple",
    },
    () => "book-custom",
  ).value;
  registry = createCustomStructure(
    registry,
    {
      iconName: "person",
      lifecycleKind: "document",
      pluralName: "People",
      propertyDefinitions: [books],
      singularName: "Person",
      tone: "orange",
    },
    () => "person-custom",
  ).value;

  let state = { ...createInitialWorkspaceObjectState(), structures: registry };
  state = reduce(
    state,
    { type: "beginCreate", objectTypeId: "book-custom" },
    { type: "beginCreate", objectTypeId: "person-custom" },
  );
  const beforeLinkSourceUpdatedAt = readUpdatedAt(state.entities[0]);
  const beforeLinkTargetUpdatedAt = readUpdatedAt(state.entities[1]);
  state = reduce(state, {
    id: "created-book-custom-1",
    propertyId: "author",
    type: "setLinkedEntityPropertyValue",
    value: "created-person-custom-2",
  });

  assert.deepEqual(state.entities[0].propertyValues.author, {
    entity: [{ id: "created-person-custom-2" }],
    type: "entity",
  });
  assert.deepEqual(state.entities[1].propertyValues.books, {
    entity: [{ id: "created-book-custom-1" }],
    type: "entity",
  });
  assert.notEqual(readUpdatedAt(state.entities[0]), beforeLinkSourceUpdatedAt);
  assert.notEqual(readUpdatedAt(state.entities[1]), beforeLinkTargetUpdatedAt);

  const beforeUnlinkSourceUpdatedAt = readUpdatedAt(state.entities[0]);
  const beforeUnlinkTargetUpdatedAt = readUpdatedAt(state.entities[1]);
  state = workspaceObjectReducer(state, {
    id: "created-book-custom-1",
    propertyId: "author",
    type: "setLinkedEntityPropertyValue",
    value: [],
  });
  assert.equal("author" in state.entities[0].propertyValues, true);
  assert.deepEqual(state.entities[0].propertyValues.author.entity, []);
  assert.deepEqual(state.entities[1].propertyValues.books.entity, []);
  assert.notEqual(
    readUpdatedAt(state.entities[0]),
    beforeUnlinkSourceUpdatedAt,
  );
  assert.notEqual(
    readUpdatedAt(state.entities[1]),
    beforeUnlinkTargetUpdatedAt,
  );
});

test("entity deletion is guarded while reverse references exist", () => {
  const state = reduce(
    createInitialWorkspaceObjectState(),
    { type: "beginCreate", objectTypeId: "page" },
    { type: "beginCreate", objectTypeId: "tag" },
    {
      id: "created-page-1",
      propertyId: "tags",
      type: "setPropertyValue",
      value: "created-tag-2",
    },
    { type: "deleteEntity", id: "created-tag-2" },
  );

  assert.equal(state.error, "referenced-object");
  assert.equal(
    state.entities.some((entity) => entity.id === "created-tag-2"),
    true,
  );
});

test("query descriptions produce deterministic filters and local results", () => {
  let state = createInitialWorkspaceObjectState();
  state = reduce(
    state,
    { type: "beginCreate", objectTypeId: "page" },
    { type: "beginCreate", objectTypeId: "query" },
  );
  const query = state.entities.find(
    (entity) => entity.objectTypeId === "query",
  );
  assert.ok(query);

  const configured = applyQueryDescription(query, "Pages created today");
  assert.equal(configured.title, "Pages created today");
  assert.deepEqual(configured.filters, {
    created: "today",
    objectTypeId: "page",
    tags: [],
  });
  assert.deepEqual(
    selectQueryResults(state.entities, configured).map(
      (entity) => entity.objectTypeId,
    ),
    ["page"],
  );
});

test("query descriptions recognize the supported object-type vocabulary", () => {
  const state = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    type: "beginCreate",
    objectTypeId: "query",
  });
  const query = state.entities[0];
  assert.equal(
    applyQueryDescription(query, "tasks created today").filters.objectTypeId,
    "task",
  );
  assert.equal(
    applyQueryDescription(query, "citações de hoje").filters.objectTypeId,
    "quote",
  );
  assert.equal(
    applyQueryDescription(query, "tabelas").filters.objectTypeId,
    "table",
  );
});

test("storage round-trips valid state and removes ephemeral preview data", () => {
  let state = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    type: "beginCreate",
    objectTypeId: "image",
  });
  state = workspaceObjectReducer(state, {
    type: "commitFile",
    fileName: "sample.png",
    mimeType: "image/png",
    previewUrl: "blob:ephemeral",
    size: 42,
  });

  const raw = serializeWorkspaceObjectState(state);
  assert.doesNotMatch(raw, /blob:ephemeral/);
  const parsed = parseWorkspaceObjectSnapshot(raw);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.state.entities[0].fileName, "sample.png");
  assert.equal(parsed.state.entities[0].previewUrl, undefined);
});

test("storage rejects malformed and future-version records", () => {
  assert.deepEqual(parseWorkspaceObjectSnapshot("not json"), {
    ok: false,
    reason: "invalid-json",
  });
  assert.deepEqual(
    parseWorkspaceObjectSnapshot(JSON.stringify({ version: 99, entities: [] })),
    { ok: false, reason: "unsupported-version" },
  );
});

test("URL and file validation follows the selected object type", () => {
  assert.equal(
    deriveUrlMetadata("weblink", "https://example.com/path").ok,
    true,
  );
  assert.equal(
    deriveUrlMetadata("tweet", "https://x.com/user/status/123").ok,
    true,
  );
  assert.equal(
    deriveUrlMetadata("tweet", "https://example.com/path").ok,
    false,
  );
  assert.equal(acceptsFileForType("image", "image/png", "image.png"), true);
  assert.equal(
    acceptsFileForType("image", "application/pdf", "file.pdf"),
    false,
  );
  assert.equal(acceptsFileForType("pdf", "", "file.pdf"), true);
  assert.equal(acceptsFileForType("audio", "audio/mpeg", "sound.mp3"), true);
});

test("imports create active entities and reject incompatible files", () => {
  let state = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    type: "importFile",
    fileName: "research.md",
    mimeType: "text/markdown",
    objectTypeId: "page",
    size: 24,
    text: "Imported body",
  });
  assert.equal(state.entities.length, 1);
  assert.equal(state.entities[0].title, "research");
  assert.equal(
    blockEditorDocumentToPlainText(state.entities[0].body),
    "Imported body",
  );
  assert.equal(state.activeEntityId, state.entities[0].id);

  state = workspaceObjectReducer(state, {
    type: "importFile",
    fileName: "wrong.pdf",
    mimeType: "application/pdf",
    objectTypeId: "image",
    size: 42,
    text: "",
  });
  assert.equal(state.entities.length, 1);
  assert.equal(state.error, "incompatible-file");
  assert.equal(
    getWorkspaceImportError("pdf", "application/pdf", "paper.pdf", ""),
    null,
  );
});

test("hydration restores canonical data without restoring transient drafts", () => {
  const stored = reduce(
    createInitialWorkspaceObjectState(),
    { type: "beginCreate", objectTypeId: "page" },
    { type: "beginCreate", objectTypeId: "task" },
  );
  const hydrated = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    type: "hydrate",
    state: stored,
  });
  assert.equal(hydrated.entities.length, 1);
  assert.equal(hydrated.draft, null);
  assert.equal(hydrated.hydrationStatus, "ready");
});

test("workspace UI exposes every lifecycle family with localized accessible surfaces", async () => {
  const [controller, content, toolbarIcons, primaryActions, en, es, pt] =
    await Promise.all([
      readFile(
        new URL("../src/components/workspace-controller.tsx", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../src/components/workspace-content.tsx", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL(
          "../src/components/object-type-toolbar-icon.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../src/components/app-sidebar-primary-actions.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(new URL("../src/messages/en.json", import.meta.url), "utf8"),
      readFile(new URL("../src/messages/es.json", import.meta.url), "utf8"),
      readFile(new URL("../src/messages/pt-BR.json", import.meta.url), "utf8"),
    ]);

  assert.match(controller, /workspaceObjectReducer/);
  assert.match(controller, /parseWorkspaceObjectSnapshot/);
  assert.match(controller, /data-slot="workspace-creation-dialog"/);
  assert.match(controller, /role="alert"/);
  assert.match(controller, /type="file"/);
  assert.match(controller, /type: "importFile"/);
  assert.match(controller, /objectTypeOverview\.importComplete/);
  assert.match(content, /multiple/);
  assert.match(content, /input\.value = ""/);
  assert.match(content, /onClick=\{createObject\}/);
  assert.match(content, /onClick=\{onImport\}/);
  assert.match(content, /function ObjectTypeOptionsMenu/);
  assert.match(content, /function ObjectTypeNewMenu/);
  assert.match(content, /object-type-filter-row/);
  assert.match(content, /object-type-sort-row/);
  assert.match(content, /setToolbarCollapsed/);
  assert.match(content, /setCollectionsByType/);
  assert.match(content, /setQueriesByType/);
  assert.match(content, /function ObjectTypeOverviewSettings/);
  assert.match(content, /setVisibleSections/);
  assert.match(content, /setPinnedEntities/);
  assert.match(content, /workspace:open-new-palette/);
  assert.match(content, /function ObjectTypeAddViewMenu/);
  assert.match(content, /setView\("all"\)/);
  assert.match(content, /group\/object-type-views/);
  assert.match(content, /group-hover\/object-type-views:opacity-100/);
  assert.match(content, /group\/object-type-section/);
  assert.match(content, /group-hover\/object-type-section:opacity-100/);
  assert.match(content, /\[@media\(hover:hover\)\]:opacity-0/);
  for (const iconName of [
    "overview",
    "all",
    "add",
    "count",
    "filter",
    "sort",
    "list",
    "grid",
    "caret",
  ]) {
    assert.match(toolbarIcons, new RegExp(`\\| "${iconName}"`));
    assert.match(content, new RegExp(`name="${iconName}"`));
  }
  assert.match(toolbarIcons, /viewBox="0 0 256 256"/);
  assert.match(toolbarIcons, /data-slot="object-type-toolbar-icon"/);
  assert.match(content, /<AppSidebarSourceIcon\s+name="settings"/);
  assert.match(content, /\[&>svg\]:size-3/);
  assert.match(primaryActions, /workspace:open-new-palette/);
  for (const slot of [
    "document-object-editor",
    "table-object-editor",
    "task-object-editor",
    "url-object-editor",
    "tag-object-editor",
    "query-object-editor",
    "file-object-editor",
  ]) {
    assert.match(content, new RegExp(`(?:data-slot|dataSlot)="${slot}"`));
  }
  for (const catalog of [en, es, pt]) {
    const messages = JSON.parse(catalog);
    assert.equal(typeof messages.workspace.lifecycle.untitled, "string");
    assert.equal(
      typeof messages.workspace.lifecycle.errors["invalid-url"],
      "string",
    );
    assert.equal(typeof messages.workspace.lifecycle.file.reselect, "string");
    assert.equal(
      typeof messages.workspace.objectTypeOverview.importRejected,
      "string",
    );
    assert.equal(
      typeof messages.workspace.objectTypeOverview.searchPlaceholder,
      "string",
    );
    assert.equal(
      typeof messages.workspace.objectTypeOverview.visibleSections,
      "string",
    );
    assert.equal(
      typeof messages.workspace.objectTypeOverview.unpinFromSidebar,
      "string",
    );
  }
});

test("document property pickers preserve the shared Capacities popup contract", async () => {
  const [content, sharedStyles] = await Promise.all([
    readFile("src/components/workspace-content.tsx", "utf8"),
    readFile("src/components/ui/shared-styles.ts", "utf8"),
  ]);

  assert.match(sharedStyles, /rounded-\[12px\]/);
  assert.match(sharedStyles, /floatingSearchListItemClass/);
  assert.match(content, /initialFocus=\{false\}/);
  assert.match(content, /aria-label=\{t\("objects\.collections"\)\}/);
  assert.match(content, /aria-label=\{t\("fields\.tags"\)\}/);
  assert.doesNotMatch(
    content,
    /w-\[254px\][^\n]*rounded-xl|w-\[257px\][^\n]*rounded-xl/,
  );
});
