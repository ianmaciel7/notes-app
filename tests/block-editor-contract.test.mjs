import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const [editorSource, slashCommandSource, requestSource, tasksSource, globalsSource] =
  await Promise.all([
    readFile("src/components/block-editor.tsx", "utf8"),
    readFile("src/editor/slash-command.tsx", "utf8"),
    readFile("src/i18n/request.ts", "utf8"),
    readFile("openspec/changes/add-block-editor/tasks.md", "utf8"),
    readFile("src/app/globals.css", "utf8"),
  ]);

const editorLocales = ["en", "es", "pt-BR"];
const editorMessages = await Promise.all(
  editorLocales.map(async (locale) =>
    JSON.parse(await readFile(`src/messages/editor/${locale}.json`, "utf8")),
  ),
);

test("block editor dependencies stay synchronized and exact", () => {
  const tiptapDependencies = Object.entries(packageJson.dependencies).filter(
    ([name]) => name.startsWith("@tiptap/"),
  );
  assert.ok(tiptapDependencies.some(([name]) => name === "@tiptap/markdown"));
  assert.ok(
    tiptapDependencies.some(
      ([name]) => name === "@tiptap/extension-drag-handle-react",
    ),
  );
  for (const [, version] of tiptapDependencies) {
    assert.equal(version, "3.30.2");
  }
  assert.equal(packageJson.dependencies["@floating-ui/dom"], "1.8.0");
});

test("block editor uses the safe controlled Markdown boundary", () => {
  assert.match(editorSource, /immediatelyRender: false/);
  assert.match(editorSource, /content: draftDocument\.doc/);
  assert.match(editorSource, /emitUpdate: false/);
  assert.match(editorSource, /currentEditor\.getJSON\(\)/);
  assert.match(editorSource, /levels: \[1, 2, 3, 4\]/);
  assert.match(editorSource, /horizontal-rule/);
  assert.doesNotMatch(editorSource, /dangerouslySetInnerHTML/);
});

test("slash commands use the shared suggestion menu contract", () => {
  assert.match(editorSource, /createSlashCommandExtension/);
  assert.match(slashCommandSource, /Suggestion</);
  assert.match(slashCommandSource, /data-slot="block-editor-slash-menu"/);
  assert.match(slashCommandSource, /CompactMenuIconFrame/);
  assert.match(slashCommandSource, /role="listbox"/);
  assert.match(slashCommandSource, /exitSuggestion/);
});

test("read-only rendering is semantic and has no editor mutation surface", () => {
  assert.match(editorSource, /editable,/);
  assert.match(editorSource, /role: "document"/);
  assert.match(editorSource, /notes-block-editor-readonly/);
  assert.match(editorSource, /if \(!editable\) return/);
  assert.match(editorSource, /editor && editable/);
  assert.match(editorSource, /setEditable\(editable, false\)/);
});

test("selection and block interactions reuse local primitives and top-level drag", () => {
  assert.match(editorSource, /@\/components\/ui\/button/);
  assert.match(editorSource, /@\/components\/ui\/toggle-group/);
  assert.match(editorSource, /@\/components\/ui\/dropdown-menu/);
  assert.match(editorSource, /@\/components\/ui\/popover/);
  assert.match(editorSource, /@tiptap\/extension-drag-handle-react/);
  assert.match(editorSource, /nested=\{false\}/);
  assert.match(editorSource, /data-slot="block-editor-selection-menu"/);
  assert.match(editorSource, /data-slot="block-editor-link-popover"/);
  assert.match(editorSource, /data-slot="block-editor-block-handle"/);
  assert.match(editorSource, /selectionRef/);
  assert.match(editorSource, /lockDragHandle/);
  assert.match(editorSource, /unlockDragHandle/);
});

test("editor styling keeps the measured typography, handle, focus, and motion contracts", () => {
  assert.match(globalsSource, /font-size: 16px/);
  assert.match(globalsSource, /line-height: 24px/);
  assert.match(globalsSource, /color-mix\(in oklch, var\(--primary\) 25%, transparent\)/);
  assert.match(editorSource, /h-\[22px\] w-\[18px\]/);
  assert.match(editorSource, /duration-100/);
  assert.match(editorSource, /motion-reduce:transition-none/);
  assert.match(editorSource, /\(hover: hover\) and \(pointer: fine\)/);
  assert.match(editorSource, /min-width: 768px/);
  assert.match(editorSource, /focus-visible:outline-2/);
});

test("editor interaction copy is complete for every supported locale", () => {
  const requiredKeys = [
    "selectionToolbar",
    "blockType",
    "link",
    "linkUrl",
    "invalidLink",
    "applyLink",
    "removeLink",
    "undo",
    "redo",
    "insertBlock",
    "dragBlock",
    "taskChecked",
    "taskUnchecked",
  ];
  const baselineKeys = Object.keys(editorMessages[0]).sort();
  for (const messages of editorMessages) {
    assert.deepEqual(Object.keys(messages).sort(), baselineKeys);
    for (const key of requiredKeys) {
      assert.equal(typeof messages[key], "string");
      assert.ok(messages[key].trim().length > 0);
    }
  }
  assert.match(requestSource, /messages\/editor\/en\.json/);
  assert.match(requestSource, /messages\/editor\/es\.json/);
  assert.match(requestSource, /messages\/editor\/pt-BR\.json/);
});

test("advanced Capacities blocks remain an explicit follow-up", () => {
  assert.match(tasksSource, /small text/);
  assert.match(tasksSource, /Mermaid\/math/);
  assert.match(tasksSource, /multi-column\/group/);
  assert.match(tasksSource, /media\/object embeds/);
});
