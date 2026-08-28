import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [editorSource, contractSource, pageSource, referenceSource] =
  await Promise.all([
    readFile("src/components/block-editor.tsx", "utf8"),
    readFile("src/editor/block-editor-contract.ts", "utf8"),
    readFile("src/components/workspace-object-page-view.tsx", "utf8"),
    readFile("src/editor/reference-suggestions.ts", "utf8"),
  ]);

test("BlockEditor exposes optional workspace reference data without requiring it", () => {
  assert.match(contractSource, /referenceEntities\?: readonly WorkspaceEntity\[\]/);
  assert.match(contractSource, /referenceStructures\?: readonly WorkspaceStructure\[\]/);
  assert.match(editorSource, /referenceEntities = \[\]/);
  assert.match(editorSource, /referenceStructures = \[\]/);
});

test("reference adapters are TipTap Suggestion consumers for @, [[, and ((", () => {
  assert.match(referenceSource, /createReferenceSuggestionExtensions/);
  assert.match(referenceSource, /Suggestion<ReferenceSuggestionItem/);
  assert.match(referenceSource, /char: "@"/);
  assert.match(referenceSource, /char: "\[\["/);
  assert.match(referenceSource, /char: "\(\("/);
  assert.match(referenceSource, /canOpenSuggestionTrigger/);
  assert.match(referenceSource, /setMark\("objectLink"/);
  assert.match(referenceSource, /setMark\("blockLink"/);
  assert.match(referenceSource, /exitSuggestion/);
});

test("workspace page passes committed entities and structures into editable editors", () => {
  assert.match(pageSource, /createdEntities,\s*[\s\S]*structures,/);
  assert.match(pageSource, /referenceEntities=\{createdEntities\}/);
  assert.match(pageSource, /referenceStructures=\{structures\}/);
  assert.match(editorSource, /createReferenceSuggestionExtensions\(\{/);
  assert.match(editorSource, /\.\.\.referenceSuggestionExtensions/);
});
