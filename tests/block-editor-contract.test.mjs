import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

async function readOpenSpecChangeArtifact(changeName, artifactPath) {
  const activePath = `openspec/changes/${changeName}/${artifactPath}`;
  const activeArtifact = await readFile(activePath, "utf8").catch(() => null);
  if (activeArtifact !== null) return activeArtifact;

  const archiveEntries = await readdir("openspec/changes/archive", {
    withFileTypes: true,
  }).catch(() => []);
  const archivedChange = archiveEntries
    .filter((entry) => entry.isDirectory() && entry.name.endsWith(changeName))
    .map((entry) => entry.name)
    .sort()
    .at(-1);
  if (!archivedChange) return "";
  return readFile(
    `openspec/changes/archive/${archivedChange}/${artifactPath}`,
    "utf8",
  );
}

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const [
  editorSource,
  toolbarSource,
  handleSource,
  bufferSource,
  slashCommandSource,
  requestSource,
  tasksSource,
  _globalsSource,
  handleReferenceImage,
  handleReferenceMetadata,
] = await Promise.all([
  readFile("src/components/block-editor.tsx", "utf8"),
  readFile("src/components/block-editor-selection-toolbar.tsx", "utf8"),
  readFile("src/components/block-editor-handle.tsx", "utf8"),
  readFile("src/editor/use-buffered-document-commit.ts", "utf8"),
  readFile("src/editor/slash-command.tsx", "utf8"),
  readFile("src/i18n/request.ts", "utf8").catch(() => ""),
  readOpenSpecChangeArtifact("add-block-editor", "tasks.md"),
  readFile("src/app/globals.css", "utf8").catch(() => ""),
  readFile("docs/references/assets/capacities-block-handle-2026-08-24.png"),
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

test("drag handle uses plugin metadata and a fixed block-relative anchor", () => {
  assert.match(handleSource, /@tiptap\/extension-drag-handle-react/);
  assert.match(handleSource, /nested=\{false\}/);
  assert.match(handleSource, /commands\.setMeta\("lockDragHandle", locked\)/);
  assert.match(handleSource, /strategy: "fixed"/);
  assert.match(handleSource, /placement: "left-start"/);
  assert.match(
    handleSource,
    /getReferencedVirtualElement=\{getReferencedVirtualElement\}/,
  );
  assert.match(handleSource, /nodeDOM\(target\.pos\)/);
  assert.match(handleSource, /dragSourceRef\.current \?\? targetRef\.current/);
  assert.doesNotMatch(handleSource, /commands\.lockDragHandle/);
  assert.doesNotMatch(handleSource, /commands\.unlockDragHandle/);
});

test("visible grip owns native drag while the menu uses a detached anchor", () => {
  assert.match(handleSource, /function DotsSixVerticalIcon/);
  assert.equal((handleSource.match(/<circle /g) ?? []).length, 6);
  assert.match(handleSource, /data-slot="block-editor-insert-control"/);
  assert.match(handleSource, /data-slot="block-editor-drag-control"/);
  assert.match(handleSource, /data-slot="block-editor-menu-anchor"/);
  assert.equal(
    (handleSource.match(/draggable=\{false\}/g) ?? []).length,
    1,
    "only the plus control must disable native dragging",
  );
  assert.match(handleSource, /draggable=\{targetAvailable\}/);
  assert.match(handleSource, /function isGripDragOrigin/);
  assert.match(handleSource, /onElementDragStart=\{handleElementDragStart\}/);
  assert.match(handleSource, /triggerId=\{menuTriggerId\}/);
  assert.match(handleSource, /pointer-events-none absolute right-0 top-0/);
  assert.match(handleSource, /setBlockOptionsOpen\(!optionsOpenRef\.current\)/);
  assert.match(handleSource, /event\.dataTransfer\.effectAllowed = "move"/);
  assert.doesNotMatch(handleSource, /setDragHandleLocked\(editor, true\)/);
  assert.match(handleSource, /setDragHandleLocked\(editor, false\)/);
  assert.match(handleSource, /event\.shiftKey \? "above" : "below"/);
  assert.match(handleSource, /setTextSelection\(position \+ 1\)/);
});

test("handle tooltips use local Tooltip primitives instead of browser titles", () => {
  assert.match(handleSource, /TooltipProvider delay=\{300\}/);
  assert.match(handleSource, /data-slot="block-editor-insert-tooltip"/);
  assert.match(handleSource, /data-slot="block-editor-drag-tooltip"/);
  assert.match(handleSource, /t\("clickAction"\)/);
  assert.match(handleSource, /t\("shiftClickAction"\)/);
  assert.match(handleSource, /t\("dragAction"\)/);
  assert.match(handleSource, /t\("moveBlockHint"\)/);
  assert.doesNotMatch(handleSource, /title=\{/);
});

test("drop cursor is a subtle one-pixel neutral indicator", () => {
  assert.match(editorSource, /dropcursor:/);
  assert.match(editorSource, /color: "#b8b3ad"/);
  assert.match(editorSource, /width: 1/);
  assert.match(editorSource, /class: "block-editor-dropcursor"/);
});

test("block controls keep measured geometry, input mode, and motion contracts", () => {
  assert.match(handleSource, /data-slot="block-editor-block-handle"/);
  assert.match(handleSource, /data-slot="block-editor-block-menu"/);
  assert.match(handleSource, /h-\[22px\] w-\[18px\]/);
  assert.match(handleSource, /w-\[36px\]/);
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
  assert.match(handleReferenceMetadata, /Click.*insert block below/is);
  assert.match(handleReferenceMetadata, /Shift-click.*insert block above/is);
  assert.match(handleReferenceMetadata, /Drag.*move the block around/is);
  assert.match(handleReferenceMetadata, /Click.*block options/is);
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
    "clickAction",
    "shiftClickAction",
    "dragAction",
    "insertBelowHint",
    "insertAboveHint",
    "moveBlockHint",
    "showBlockOptionsHint",
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
  assert.match(tasksSource, /small text/i);
  assert.match(tasksSource, /lateral\/column\/group drop semantics/i);
  assert.match(tasksSource, /explicit follow-ups/i);
  assert.match(tasksSource, /neutral schema/i);
});
