import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const [
  editorSource,
  toolbarSource,
  handleSource,
  bufferSource,
  slashCommandSource,
  requestSource,
  tasksSource,
  globalsSource,
  handleReferenceImage,
  handleReferenceMetadata,
] = await Promise.all([
  readFile("src/components/block-editor.tsx", "utf8"),
  readFile("src/components/block-editor-selection-toolbar.tsx", "utf8"),
  readFile("src/components/block-editor-handle.tsx", "utf8"),
  readFile("src/editor/use-buffered-document-commit.ts", "utf8"),
  readFile("src/editor/slash-command.tsx", "utf8"),
  readFile("src/i18n/request.ts", "utf8").catch(() => ""),
  readFile("openspec/changes/add-block-editor/tasks.md", "utf8"),
  readFile("src/app/globals.css", "utf8").catch(() => ""),
  readFile(
    "docs/references/assets/capacities-block-handle-2026-08-24.png",
  ),
  readFile("docs/references/capacities-block-handle.md", "utf8"),
]);

const editorLocales = ["en", "es", "pt-BR"];
const editorMessages = await Promise.all(
  editorLocales.map(async (locale) =>
    JSON.parse(await readFile(`src/messages/editor/${locale}.json`, "utf8")),
  ),
);

const interactionSource = `${editorSource}\n${toolbarSource}\n${handleSource}\n${bufferSource}`;

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
  assert.match(editorSource, /shouldRerenderOnTransaction: false/);
  assert.match(editorSource, /content: initialContentRef\.current/);
  assert.match(editorSource, /emitUpdate: false/);
  assert.match(editorSource, /errorOnInvalidContent: true/);
  assert.match(editorSource, /currentEditor\.getJSON\(\)/);
  assert.match(editorSource, /levels: \[1, 2, 3, 4\]/);
  assert.match(editorSource, /markdownLinks: true/);
  assert.doesNotMatch(editorSource, /dangerouslySetInnerHTML/);
});

test("editor persistence avoids a React state update on every keystroke", () => {
  assert.match(editorSource, /useBufferedDocumentCommit/);
  assert.match(bufferSource, /pendingRef/);
  assert.match(bufferSource, /setTimeout\(flushCommit, delay\)/);
  assert.doesNotMatch(interactionSource, /useBufferedTextCommit/);
  assert.doesNotMatch(bufferSource, /setDraftState/);
  assert.doesNotMatch(bufferSource, /useState\(/);
});

test("slash commands use the shared suggestion menu contract", () => {
  assert.match(editorSource, /createSlashCommandExtension/);
  assert.match(slashCommandSource, /Suggestion</);
  assert.match(slashCommandSource, /data-slot="block-editor-slash-menu"/);
  assert.match(slashCommandSource, /CompactMenuIconFrame/);
  assert.match(slashCommandSource, /role="listbox"/);
  assert.match(slashCommandSource, /exitSuggestion/);
});

test("read-only rendering is semantic and has no mutation surface", () => {
  assert.match(editorSource, /editable = true/);
  assert.match(editorSource, /role: "document"/);
  assert.match(editorSource, /notes-block-editor-readonly/);
  assert.match(editorSource, /editor && editable/);
  assert.match(editorSource, /setEditable\(editable, false\)/);
  assert.match(editorSource, /showOnlyWhenEditable: true/);
});

test("selection toolbar reacts without the default BubbleMenu delay", () => {
  assert.match(toolbarSource, /useEditorState/);
  assert.match(toolbarSource, /updateDelay=\{0\}/);
  assert.match(toolbarSource, /resizeDelay=\{0\}/);
  assert.match(toolbarSource, /data-slot="block-editor-selection-menu"/);
  assert.match(toolbarSource, /data-slot="block-editor-link-popover"/);
  assert.match(toolbarSource, /clampSelection/);
  assert.match(toolbarSource, /extendMarkRange\("link"\)/);
});

test("drag handle uses the plugin metadata contract instead of missing commands", () => {
  assert.match(handleSource, /@tiptap\/extension-drag-handle-react/);
  assert.match(handleSource, /nested=\{false\}/);
  assert.match(handleSource, /commands\.setMeta\("lockDragHandle", locked\)/);
  assert.doesNotMatch(handleSource, /commands\.lockDragHandle/);
  assert.doesNotMatch(handleSource, /commands\.unlockDragHandle/);
  assert.doesNotMatch(handleSource, /locked=\{/);
});

test("plus and six-dot grip have independent reference behaviors", () => {
  assert.match(handleSource, /function DotsSixVerticalIcon/);
  assert.equal(
    (handleSource.match(/<circle /g) ?? []).length,
    6,
    "the grip icon must contain exactly six dots",
  );
  assert.match(handleSource, /data-slot="block-editor-insert-control"/);
  assert.match(handleSource, /data-slot="block-editor-drag-control"/);
  assert.match(handleSource, /data-slot="block-editor-six-dot-icon"/);
  assert.match(handleSource, /draggable=\{false\}/);
  assert.match(handleSource, /draggable=\{true\}/);
  assert.match(handleSource, /function isGripDragOrigin/);
  assert.match(handleSource, /onElementDragStart=\{handleElementDragStart\}/);
  assert.match(handleSource, /insertPointerActiveRef/);
  assert.match(handleSource, /event\.preventDefault\(\)/);
  assert.match(handleSource, /event\.shiftKey \? "above" : "below"/);
  assert.match(handleSource, /setTextSelection\(position \+ 1\)/);
  assert.match(handleSource, /POST_DRAG_MENU_SUPPRESSION_MS/);
  assert.match(handleSource, /suppressMenuUntilRef/);
});

test("block controls keep measured geometry, input mode, and motion contracts", () => {
  assert.match(handleSource, /data-slot="block-editor-block-handle"/);
  assert.match(handleSource, /data-slot="block-editor-block-menu"/);
  assert.match(handleSource, /h-\[22px\] w-\[18px\]/);
  assert.match(handleSource, /duration-100/);
  assert.match(handleSource, /motion-reduce:transition-none/);
  assert.match(handleSource, /\(hover: hover\) and \(pointer: fine\)/);
  assert.match(handleSource, /min-width: 768px/);
});

test("the user-provided handle screenshot remains a hashed project reference", () => {
  assert.equal(
    createHash("sha256").update(handleReferenceImage).digest("hex"),
    "f1d0cde8444e16504a600cd3c640941274789a1aa81bb1e7fcd14a07f20a721c",
  );
  assert.match(handleReferenceMetadata, /90 × 57 px/);
  assert.match(handleReferenceMetadata, /f1d0cde8444e16504a600cd3c6409412/);
  assert.match(handleReferenceMetadata, /Click.*insert block below/is);
  assert.match(handleReferenceMetadata, /Shift-click.*insert block above/is);
  assert.match(handleReferenceMetadata, /Drag.*move block/is);
  assert.match(handleReferenceMetadata, /Click.*block options/is);
});

test("editor styling keeps the measured typography and focus contracts", () => {
  if (globalsSource) {
    assert.match(globalsSource, /font-size: 16px/);
    assert.match(globalsSource, /line-height: 24px/);
    assert.match(
      globalsSource,
      /color-mix\(in oklch, var\(--primary\) 25%, transparent\)/,
    );
  }
  assert.match(editorSource, /focus-visible:outline-2/);
  assert.match(editorSource, /checkboxLabel/);
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
    "insertBlockAbove",
    "insertBlockBelow",
    "dragBlock",
    "blockOptions",
    "duplicateBlock",
    "deleteBlock",
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
  if (requestSource) {
    assert.match(requestSource, /messages\/editor\/en\.json/);
    assert.match(requestSource, /messages\/editor\/es\.json/);
    assert.match(requestSource, /messages\/editor\/pt-BR\.json/);
  }
});

test("advanced Capacities blocks remain an explicit follow-up", () => {
  assert.match(tasksSource, /small text/);
  assert.match(tasksSource, /Mermaid\/math/);
  assert.match(tasksSource, /multi-column\/group/);
  assert.match(tasksSource, /media\/object embeds/);
});
