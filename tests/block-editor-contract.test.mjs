import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const [editorSource, slashCommandSource] = await Promise.all([
  readFile("src/components/block-editor.tsx", "utf8"),
  readFile("src/editor/slash-command.tsx", "utf8"),
]);

test("block editor dependencies stay synchronized and exact", () => {
  const tiptapDependencies = Object.entries(packageJson.dependencies).filter(
    ([name]) => name.startsWith("@tiptap/"),
  );
  assert.ok(tiptapDependencies.some(([name]) => name === "@tiptap/markdown"));
  for (const [, version] of tiptapDependencies) {
    assert.equal(version, "3.30.2");
  }
  assert.equal(packageJson.dependencies["@floating-ui/dom"], "1.8.0");
});

test("block editor uses the safe controlled Markdown boundary", () => {
  assert.match(editorSource, /immediatelyRender: false/);
  assert.match(editorSource, /content: (?:draftDocument|value)\.doc/);
  assert.match(editorSource, /emitUpdate: false/);
  assert.match(editorSource, /currentEditor\.getJSON\(\)/);
  assert.doesNotMatch(editorSource, /dangerouslySetInnerHTML/);
});

test("slash commands use the shared suggestion menu contract", () => {
  assert.match(editorSource, /createSlashCommandExtension/);
  assert.match(slashCommandSource, /Suggestion</);
  assert.match(slashCommandSource, /data-slot="block-editor-slash-menu"/);
  assert.match(slashCommandSource, /CommandEmpty/);
  assert.match(slashCommandSource, /exitSuggestion/);
});
