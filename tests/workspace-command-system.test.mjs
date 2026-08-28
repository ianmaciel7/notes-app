import assert from "node:assert/strict";
import test from "node:test";
import {
  formatShortcutChord,
  isShortcutChord,
  parseShortcutChord,
  resolveShortcutChord,
} from "../src/lib/workspace-shortcuts.ts";
import {
  createWorkspaceCommandRuntime,
  projectWorkspaceCommands,
  routeWorkspaceShortcut,
  runWorkspaceCommand,
} from "../src/lib/workspace-command-registry.ts";

test("shortcut chords normalize modifier order and reject malformed input", () => {
  assert.deepEqual(parseShortcutChord("Shift+Mod+P"), {
    key: "P",
    modifiers: ["Mod", "Shift"],
  });
  assert.deepEqual(parseShortcutChord("ctrl+alt+delete"), {
    key: "Delete",
    modifiers: ["Ctrl", "Alt"],
  });

  assert.equal(isShortcutChord("Mod+K"), true);
  assert.equal(isShortcutChord("Mod+P"), true);
  assert.equal(isShortcutChord("Mod++"), false);
  assert.equal(isShortcutChord("Mod+Mod+K"), false);
  assert.equal(isShortcutChord(""), false);
});

test("shortcut labels render platform-neutral Mod chords for macOS and Windows", () => {
  assert.equal(formatShortcutChord("Mod+K", "mac"), "⌘K");
  assert.equal(formatShortcutChord("Mod+P", "windows"), "Ctrl+P");
  assert.equal(formatShortcutChord("Mod+Shift+P", "mac"), "⌘⇧P");
  assert.equal(formatShortcutChord("Shift+Mod+P", "windows"), "Ctrl+Shift+P");
  assert.equal(formatShortcutChord("Alt+Shift+ArrowDown", "linux"), "Alt+Shift+↓");
});

test("keyboard events resolve Mod chords without changing command identity", () => {
  assert.equal(
    resolveShortcutChord({ key: "k", metaKey: true }, "mac"),
    "Mod+K",
  );
  assert.equal(
    resolveShortcutChord({ key: "p", ctrlKey: true }, "windows"),
    "Mod+P",
  );
  assert.equal(
    resolveShortcutChord({ key: "p", ctrlKey: true, shiftKey: true }, "linux"),
    "Mod+Shift+P",
  );
});

test("workspace commands project localized metadata, availability, and stable order", () => {
  const calls = [];
  const runtime = createWorkspaceCommandRuntime({
    locale: "pt-BR",
    t: (key, values) =>
      values?.label ? `${key}:${values.label}` : `translated:${key}`,
    actions: {
      openPalette: () => calls.push("palette"),
      focusSidebarSearch: () => calls.push("search"),
      navigateHome: () => calls.push("home"),
      navigateToday: () => calls.push("today"),
      openExplore: () => calls.push("explore"),
      toggleSidebar: () => calls.push("sidebar"),
      createObject: (structureId) => calls.push(`create:${structureId}`),
    },
    state: {
      canNavigateToday: false,
      structures: [
        { id: "page", label: "Page", enabled: true },
        { id: "table", label: "Table", enabled: true },
        { id: "disabled", label: "Disabled", enabled: false },
      ],
    },
  });

  const commands = projectWorkspaceCommands(runtime);
  assert.deepEqual(
    commands.map((command) => command.id),
    [
      "workspace.openPalette",
      "workspace.search",
      "workspace.navigateHome",
      "workspace.openExplore",
      "workspace.toggleSidebar",
      "workspace.createObject.page",
      "workspace.createObject.table",
    ],
  );
  assert.equal(commands[0].shortcuts[0], "Mod+K");
  assert.equal(commands[0].label, "translated:commands.openPalette.label");
  assert.equal(
    commands.find((command) => command.id === "workspace.createObject.page")
      ?.label,
    "commands.createObject.label:Page",
  );

  assert.equal(runWorkspaceCommand(runtime, "workspace.openPalette"), true);
  assert.equal(runWorkspaceCommand(runtime, "workspace.createObject.table"), true);
  assert.equal(runWorkspaceCommand(runtime, "workspace.navigateToday"), false);
  assert.deepEqual(calls, ["palette", "create:table"]);
});

test("shortcut router prioritizes contexts and prevents default only after acceptance", () => {
  const accepted = [];
  let prevented = 0;
  const runtime = createWorkspaceCommandRuntime({
    locale: "en",
    t: (key) => key,
    actions: {
      openPalette: () => accepted.push("palette"),
    },
    state: {},
  });

  const modalResult = routeWorkspaceShortcut({
    runtime,
    platform: "windows",
    event: {
      key: "k",
      ctrlKey: true,
      preventDefault: () => {
        prevented += 1;
      },
    },
    claims: [
      {
        id: "global-palette",
        priority: "global",
        shortcuts: ["Mod+K"],
        commandId: "workspace.openPalette",
      },
      {
        id: "modal-command",
        priority: "modal",
        shortcuts: ["Mod+K"],
        run: () => accepted.push("modal"),
      },
    ],
  });

  assert.deepEqual(modalResult, {
    accepted: true,
    chord: "Mod+K",
    claimId: "modal-command",
  });
  assert.deepEqual(accepted, ["modal"]);
  assert.equal(prevented, 1);

  const editableResult = routeWorkspaceShortcut({
    runtime,
    platform: "windows",
    event: {
      key: "k",
      ctrlKey: true,
      target: { editable: true },
      preventDefault: () => {
        prevented += 1;
      },
    },
    claims: [
      {
        id: "global-palette",
        priority: "global",
        shortcuts: ["Mod+K"],
        commandId: "workspace.openPalette",
      },
    ],
  });

  assert.deepEqual(editableResult, {
    accepted: false,
    chord: "Mod+K",
    reason: "editable-target",
  });
  assert.deepEqual(accepted, ["modal"]);
  assert.equal(prevented, 1);

  const editorResult = routeWorkspaceShortcut({
    runtime,
    platform: "mac",
    event: {
      key: "k",
      metaKey: true,
      preventDefault: () => {
        prevented += 1;
      },
    },
    claims: [
      {
        id: "editor-link-selection",
        priority: "editor",
        shortcuts: ["Mod+K"],
        isAvailable: () => true,
        run: () => accepted.push("editor-link"),
      },
      {
        id: "global-palette",
        priority: "global",
        shortcuts: ["Mod+K"],
        commandId: "workspace.openPalette",
      },
    ],
  });

  assert.deepEqual(editorResult, {
    accepted: true,
    chord: "Mod+K",
    claimId: "editor-link-selection",
  });
  assert.deepEqual(accepted, ["modal", "editor-link"]);
  assert.equal(prevented, 2);

  const composingResult = routeWorkspaceShortcut({
    runtime,
    platform: "windows",
    event: {
      key: "p",
      ctrlKey: true,
      isComposing: true,
      preventDefault: () => {
        prevented += 1;
      },
    },
    claims: [
      {
        id: "global-palette",
        priority: "global",
        shortcuts: ["Mod+P"],
        commandId: "workspace.openPalette",
      },
    ],
  });

  assert.deepEqual(composingResult, {
    accepted: false,
    chord: "Mod+P",
    reason: "composition",
  });
  assert.deepEqual(accepted, ["modal", "editor-link"]);
  assert.equal(prevented, 2);
});
