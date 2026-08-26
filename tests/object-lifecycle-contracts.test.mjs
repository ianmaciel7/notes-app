import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [
  contracts,
  tabs,
  palette,
  controller,
  content,
  overview,
  studio,
  cards,
  storage,
  objects,
] = await Promise.all([
  readFile("src/components/object-lifecycle-contracts.ts", "utf8"),
  readFile("src/components/app-header-tabs.tsx", "utf8"),
  readFile("src/components/app-sidebar-primary-actions.tsx", "utf8"),
  readFile("src/components/workspace-controller.tsx", "utf8"),
  readFile("src/components/workspace-content.tsx", "utf8"),
  readFile("src/components/app-sidebar-overview.tsx", "utf8"),
  readFile("src/components/app-sidebar-object-type-studio.tsx", "utf8"),
  readFile("src/components/data-view-cards.tsx", "utf8"),
  readFile("src/lib/workspace-object-storage.ts", "utf8"),
  readFile("src/lib/workspace-objects.ts", "utf8"),
]);

const sources = [tabs, palette, controller, content, overview, studio, cards];

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
