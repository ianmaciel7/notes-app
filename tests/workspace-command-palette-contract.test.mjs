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
  assert.match(controllerSource, /CommandDialog/);
  assert.match(controllerSource, /data-slot="workspace-command-palette"/);
  assert.match(controllerSource, /React\.useDeferredValue\(query\)/);
});

test("global palette shortcuts route through the central workspace router", () => {
  assert.match(controllerSource, /routeWorkspaceShortcut\(\{/);
  assert.match(controllerSource, /shortcuts: \["Mod\+K", "Mod\+P"\]/);
  assert.match(commandRegistrySource, /shortcuts: \["Mod\+K", "Mod\+P"\]/);
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
    assert.equal(typeof messages.workspace.commands.createObject.label, "string");
    assert.equal(typeof messages.workspace.commands.groups.results, "string");
  }
});
