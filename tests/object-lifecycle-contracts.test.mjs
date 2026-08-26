import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [
  contracts,
  lifecycleDomain,
  tabs,
  palette,
  controller,
  content,
  overview,
  studio,
  cards,
  storage,
  objects,
  objectTypes,
] = await Promise.all([
  readFile("src/components/object-lifecycle-contracts.ts", "utf8"),
  readFile("src/lib/workspace-object-lifecycle.ts", "utf8"),
  readFile("src/components/app-header-tabs.tsx", "utf8"),
  readFile("src/components/app-sidebar-primary-actions.tsx", "utf8"),
  readFile("src/components/workspace-controller.tsx", "utf8"),
  readFile("src/components/workspace-content.tsx", "utf8"),
  readFile("src/components/app-sidebar-overview.tsx", "utf8"),
  readFile("src/components/app-sidebar-object-type-studio.tsx", "utf8"),
  readFile("src/components/data-view-cards.tsx", "utf8"),
  readFile("src/lib/workspace-object-storage.ts", "utf8"),
  readFile("src/lib/workspace-objects.ts", "utf8"),
  readFile("src/lib/workspace-object-types.ts", "utf8"),
]);

const sources = [tabs, palette, controller, content, overview, studio, cards];
const sourceByName = {
  "app-header-tabs.tsx": tabs,
  "app-sidebar-object-type-studio.tsx": studio,
  "app-sidebar-overview.tsx": overview,
  "app-sidebar-primary-actions.tsx": palette,
  "data-view-cards.tsx": cards,
  "workspace-content.tsx": content,
  "workspace-controller.tsx": controller,
};

test("repeated lifecycle surfaces consume the shared object lifecycle contracts", () => {
  for (const contract of [
    "ObjectCreationTrigger",
    "ObjectCreationMenu",
    "ObjectTypeOptionRow",
    "ObjectCaptureSurface",
    "ObjectEditorShell",
    "EditableObjectTitle",
    "EditableObjectBody",
    "ObjectField",
    "ObjectFieldGroup",
    "ObjectValidationMessage",
    "ObjectAttachmentControl",
    "ObjectTab",
    "ObjectProjectionRow",
    "ObjectProjectionCard",
    "ObjectCountBadge",
    "ObjectTypePresetCard",
    "ObjectTypeDetailsPanel",
    "CustomObjectTypeForm",
    "ObjectIconTonePreview",
  ]) {
    assert.match(contracts, new RegExp(`${contract}:`), contract);
    assert.ok(
      sources.some((source) =>
        new RegExp(`objectLifecycleContractSlots\\.${contract}`).test(source),
      ),
      `${contract} is consumed by a production surface`,
    );
  }
});

test("shared lifecycle contracts are tied to named production consumers", () => {
  const expectedConsumers = [
    [
      "ObjectCreationTrigger",
      "app-sidebar-primary-actions.tsx",
      /id="workspace-new-trigger"[\s\S]*?objectLifecycleContractSlots\.ObjectCreationTrigger/,
    ],
    [
      "ObjectCreationMenu",
      "app-sidebar-primary-actions.tsx",
      /PopoverContent[\s\S]*?objectLifecycleContractSlots\.ObjectCreationMenu/,
    ],
    [
      "ObjectTypeOptionRow",
      "app-sidebar-primary-actions.tsx",
      /objectLifecycleContractSlots\.ObjectTypeOptionRow[\s\S]*?id=\{`new-content-option-\$\{id\}`\}/,
    ],
    [
      "ObjectCaptureSurface",
      "workspace-controller.tsx",
      /data-slot="workspace-creation-dialog"[\s\S]*?objectLifecycleContractSlots\.ObjectCaptureSurface/,
    ],
    [
      "ObjectEditorShell",
      "workspace-content.tsx",
      /function ObjectEditorShell[\s\S]*?objectLifecycleContractSlots\.ObjectEditorShell/,
    ],
    [
      "EditableObjectTitle",
      "workspace-content.tsx",
      /function EditableObjectTitle[\s\S]*?objectLifecycleContractSlots\.EditableObjectTitle/,
    ],
    [
      "EditableObjectBody",
      "workspace-content.tsx",
      /objectLifecycleContractSlots\.EditableObjectBody/,
    ],
    [
      "ObjectField",
      "workspace-content.tsx",
      /objectLifecycleContractSlots\.ObjectField/,
    ],
    [
      "ObjectFieldGroup",
      "workspace-content.tsx",
      /objectLifecycleContractSlots\.ObjectFieldGroup/,
    ],
    [
      "ObjectValidationMessage",
      "workspace-controller.tsx",
      /role="alert"[\s\S]*?objectLifecycleContractSlots\.ObjectValidationMessage/,
    ],
    [
      "ObjectAttachmentControl",
      "workspace-content.tsx",
      /type="file"[\s\S]*?objectLifecycleContractSlots\.ObjectAttachmentControl/,
    ],
    [
      "ObjectTab",
      "app-header-tabs.tsx",
      /role="tab"[\s\S]*?objectLifecycleContractSlots\.ObjectTab/,
    ],
    [
      "ObjectProjectionRow",
      "workspace-content.tsx",
      /function ObjectProjectionRow[\s\S]*?objectLifecycleContractSlots\.ObjectProjectionRow/,
    ],
    [
      "ObjectProjectionCard",
      "data-view-cards.tsx",
      /function DataViewCards[\s\S]*?objectLifecycleContractSlots\.ObjectProjectionCard/,
    ],
    [
      "ObjectCountBadge",
      "app-sidebar-overview.tsx",
      /objectLifecycleContractSlots\.ObjectCountBadge/,
    ],
    [
      "ObjectTypePresetCard",
      "app-sidebar-object-type-studio.tsx",
      /data-slot="app-sidebar-object-type-card"[\s\S]*?objectLifecycleContractSlots\.ObjectTypePresetCard/,
    ],
    [
      "ObjectTypeDetailsPanel",
      "app-sidebar-object-type-studio.tsx",
      /data-slot="app-sidebar-object-type-details"[\s\S]*?objectLifecycleContractSlots\.ObjectTypeDetailsPanel/,
    ],
    [
      "CustomObjectTypeForm",
      "app-sidebar-object-type-studio.tsx",
      /function AppSidebarCustomObjectTypeCard[\s\S]*?objectLifecycleContractSlots\.CustomObjectTypeForm/,
    ],
    [
      "ObjectIconTonePreview",
      "app-sidebar-object-type-studio.tsx",
      /ObjectIconBadge[\s\S]*?objectLifecycleContractSlots\.ObjectIconTonePreview/,
    ],
  ];

  for (const [contract, fileName, consumerPattern] of expectedConsumers) {
    assert.match(
      sourceByName[fileName],
      consumerPattern,
      `${contract} has a named production consumer in ${fileName}`,
    );
  }

  for (const source of sources) {
    assert.doesNotMatch(
      source,
      /data-lifecycle-contract="object-/,
      "production consumers use the central slot registry instead of literal lifecycle contract strings",
    );
  }
});

test("prototype object families have explicit lifecycle evidence without creating a second registry", () => {
  for (const id of [
    "page",
    "atomic-note",
    "quote",
    "table",
    "task",
    "weblink",
    "tweet",
    "tag",
    "query",
    "image",
    "pdf",
    "audio",
    "file",
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
    "ai-chat",
  ]) {
    assert.match(
      lifecycleDomain,
      new RegExp(
        `(?:\\"${id}\\"|${id}): \\"(?:document|file|query|quote|table|tag|task|url)\\"`,
      ),
      `${id} has lifecycle evidence`,
    );
  }

  assert.match(lifecycleDomain, /getWorkspaceObjectLifecycleScenario/);
  assert.match(lifecycleDomain, /structure\.lifecycleKind/);
  assert.match(lifecycleDomain, /structure\.ownership === "reserved"/);
  assert.doesNotMatch(lifecycleDomain, /archive:\s*"/);
  assert.match(objectTypes, /RESERVED_STRUCTURES/);
  assert.match(objectTypes, /"archive"[\s\S]*?"reserved"/);
});

test("creation and write surfaces are explicit for every lifecycle kind", () => {
  const expected = [
    ["document", "instant", "block-document"],
    ["file", "file-capture", "file"],
    ["query", "instant", "query"],
    ["quote", "instant", "quote-document"],
    ["table", "instant", "table"],
    ["tag", "instant", "tag-title"],
    ["task", "task-capture", "task"],
    ["url", "url-capture", "url"],
  ];

  for (const [kind, creationSurface, writeSurface] of expected) {
    assert.match(
      lifecycleDomain,
      new RegExp(
        `${kind}: \\{[\\s\\S]*?creationSurface: \\"${creationSurface}\\"[\\s\\S]*?writeSurface: \\"${writeSurface}\\"`,
      ),
      `${kind} lifecycle scenario`,
    );
  }
});

test("workspace seed tab and side-panel copy is localized", () => {
  assert.match(controller, /createInitialMainTabs/);
  assert.match(controller, /createInitialSideTabs/);
  assert.match(controller, /createSpecialSideTabs/);
  assert.match(controller, /t\("tabs\.preview\.objectType"\)/);
  assert.match(controller, /t\("tabs\.preview\.object"\)/);
  assert.doesNotMatch(controller, /"Notas atômicas"|"Citações"|"Páginas"/);
  assert.doesNotMatch(
    controller,
    /"Visualização em grafo"|"Conteúdo relacionado"|"Sem título"/,
  );
});

test("object lifecycle parity does not take over block-editor storage contracts", () => {
  assert.match(storage, /WORKSPACE_OBJECT_STORAGE_KEY/);
  assert.match(objects, /WORKSPACE_OBJECT_SCHEMA_VERSION = \d+/);
  for (const source of sources) {
    assert.doesNotMatch(source, /WORKSPACE_OBJECT_SCHEMA_VERSION\s*=/);
    assert.doesNotMatch(source, /notes-app:workspace-objects:v1/);
  }
});

test("current change diff does not mutate block-editor-owned implementation areas", () => {
  const changedFiles = execFileSync("git", ["diff", "--name-only", "HEAD"], {
    encoding: "utf8",
  })
    .split(/\r?\n/)
    .filter(Boolean)
    .map((file) => file.replace(/\\/g, "/"));

  const reservedPatterns = [
    /^src\/components\/block-editor/,
    /^src\/editor\//,
    /^src\/lib\/workspace-object-storage\.ts$/,
    /^src\/lib\/workspace-objects\.ts$/,
    /^tests\/e2e\/block-editor\.spec\.ts$/,
    /^tests\/workspace-storage-migration\.test\.mjs$/,
  ];

  assert.deepEqual(
    changedFiles.filter((file) =>
      reservedPatterns.some((pattern) => pattern.test(file)),
    ),
    [],
    "align-workspace finishing diff stays out of add-block-editor document/body/storage ownership",
  );
});
