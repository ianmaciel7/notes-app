import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [
  controllerSource,
  sidebarSource,
  commandRegistrySource,
  englishMessages,
  portugueseMessages,
  spanishMessages,
] = await Promise.all([
  readFile("src/components/workspace-controller.tsx", "utf8"),
  readFile("src/components/app-sidebar-primary-actions.tsx", "utf8"),
  readFile("src/lib/workspace-command-registry.ts", "utf8"),
  readFile("src/messages/en.json", "utf8").then(JSON.parse),
  readFile("src/messages/pt-BR.json", "utf8").then(JSON.parse),
  readFile("src/messages/es.json", "utf8").then(JSON.parse),
]);

test("workspace command palette is mounted once at the workspace boundary", () => {
  assert.match(controllerSource, /function WorkspaceCommandPalette\(\)/);
  assert.match(controllerSource, /<WorkspaceCommandPalette \/>/);
  assert.match(controllerSource, /<WorkspaceExtendedSearchDialog \/>/);
  assert.match(controllerSource, /<WorkspaceFindInPageDialog \/>/);
  assert.match(controllerSource, /<WorkspaceShortcutBrowser \/>/);
  assert.match(controllerSource, /CommandDialog/);
  assert.match(controllerSource, /data-slot="workspace-command-palette"/);
  assert.match(controllerSource, /data-slot="workspace-extended-search"/);
  assert.match(controllerSource, /data-slot="workspace-find-in-page"/);
  assert.match(controllerSource, /data-slot="workspace-shortcut-browser"/);
  assert.match(controllerSource, /React\.useDeferredValue\(query\)/);
});

test("global shortcuts route through the central workspace router and registry", () => {
  assert.match(controllerSource, /routeWorkspaceShortcut\(\{/);
  assert.match(controllerSource, /projectWorkspaceCommands\(runtime\)/);
  assert.match(controllerSource, /command\.shortcuts/);
  assert.doesNotMatch(controllerSource, /shortcuts: \["Mod\+K", "Mod\+P"\]/);
  assert.match(commandRegistrySource, /shortcuts: \["Mod\+K", "Mod\+P"\]/);
  assert.match(commandRegistrySource, /shortcuts: \["Mod\+Shift\+P"\]/);
  assert.match(commandRegistrySource, /shortcuts: \["Mod\+Shift\+B"\]/);
  assert.doesNotMatch(
    controllerSource,
    /event\.key\.toLocaleLowerCase\(\) === "k"/,
  );
});

test("sidebar search opens the same command palette state", () => {
  assert.match(sidebarSource, /function openCommandPaletteFromSidebar\(\)/);
  assert.match(sidebarSource, /if \(action === "search"\) \{/);
  assert.match(sidebarSource, /window\.setTimeout\(\(\) => setCommandPaletteOpen\(true\), 0\)/);
  assert.match(sidebarSource, /openCommandPaletteFromSidebar\(\);\r?\n\s*return;/);
  assert.doesNotMatch(
    sidebarSource,
    /setSideSearchOpen\(action === "search"\)/,
  );
});

test("command palette strings are localized in every workspace catalog", () => {
  for (const messages of [englishMessages, portugueseMessages, spanishMessages]) {
    assert.equal(typeof messages.workspace.commands.palette.title, "string");
    assert.equal(typeof messages.workspace.commands.palette.placeholder, "string");
    assert.equal(typeof messages.workspace.commands.openPalette.label, "string");
    assert.equal(typeof messages.workspace.commands.openExtendedSearch.label, "string");
    assert.equal(typeof messages.workspace.commands.openFindInPage.label, "string");
    assert.equal(typeof messages.workspace.commands.openShortcuts.label, "string");
    assert.equal(typeof messages.workspace.commands.createObject.label, "string");
    assert.equal(typeof messages.workspace.commands.shortcuts.title, "string");
    assert.equal(typeof messages.workspace.commands.findInPage.title, "string");
    assert.equal(typeof messages.workspace.commands.groups.results, "string");
  }
});
