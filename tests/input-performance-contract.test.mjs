import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("buffered text hook keeps commits off the immediate keystroke path", async () => {
  const source = await readFile(
    new URL("../src/hooks/use-buffered-text-commit.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /setTimeout\(\(\) =>/);
  assert.match(source, /onBlur:\s*\(\) => \{/);
  assert.match(source, /onCompositionStart/);
  assert.match(source, /onCompositionEnd/);
  assert.match(source, /commitRef\.current\(parseRef\.current\(draftRef\.current\)\)/);
});

test("workspace editors use buffered commits for text-heavy object fields", async () => {
  const [workspaceContent, blockEditor] = await Promise.all([
    readFile(
      new URL("../src/components/workspace-content.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/components/block-editor.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(workspaceContent, /function BufferedTextInput/);
  assert.match(workspaceContent, /function BufferedAutosizeTextarea/);
  assert.match(workspaceContent, /function EditableTitle[\s\S]*useBufferedTextCommit/);
  assert.doesNotMatch(
    workspaceContent,
    /onChange=\{\(event\) => update\(\{ (body|notes|description): event\.target\.value \}\)\}/,
  );
  assert.match(blockEditor, /useBufferedTextCommit<BlockEditorDocument>/);
  assert.match(blockEditor, /onUpdate:[\s\S]*setDraft\(/);
  assert.doesNotMatch(blockEditor, /onUpdate:[\s\S]{0,120}onChange\(/);
});

test("input performance rule is linked from the agent entrypoint", async () => {
  const [agents, rule] = await Promise.all([
    readFile(new URL("../AGENTS.md", import.meta.url), "utf8"),
    readFile(
      new URL("../.agents/rules/input-performance.md", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(agents, /\.agents\/rules\/input-performance\.md/);
  assert.match(rule, /Do not dispatch workspace-wide object\/context updates on every keystroke/);
  assert.match(rule, /Do not write to `localStorage` from the keystroke path/);
  assert.match(rule, /useDeferredValue/);
});
