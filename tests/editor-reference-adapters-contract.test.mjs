import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [editorSource, contractSource, pageSource, referenceSource, slashSource] =
  await Promise.all([
    readFile("src/components/block-editor.tsx", "utf8"),
    readFile("src/editor/block-editor-contract.ts", "utf8"),
    readFile("src/components/workspace-object-page-view.tsx", "utf8"),
    readFile("src/editor/reference-suggestions.ts", "utf8"),
    readFile("src/editor/slash-command.tsx", "utf8"),
  ]);

test("BlockEditor exposes optional workspace reference data without requiring it", () => {
  assert.match(contractSource, /referenceEntities\?: readonly WorkspaceEntity\[\]/);
  assert.match(contractSource, /referenceStructures\?: readonly WorkspaceStructure\[\]/);
  assert.match(contractSource, /onCreateObjectReference\?:/);
  assert.match(contractSource, /onCreateOrReuseTag\?:/);
  assert.match(contractSource, /onTagReference\?:/);
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

test("object reference rows render the canonical runtime Structure icon", () => {
  assert.match(referenceSource, /objectTypeDefinitionById/);
  assert.match(referenceSource, /dataset\.iconName = item\.iconName/);
  assert.match(referenceSource, /dataset\.iconTone = item\.tone/);
});

test("object reference adapters keep multi-word title and alias queries open", () => {
  assert.equal(referenceSource.match(/allowSpaces: true/g)?.length, 2);
});

test("workspace page passes committed entities and structures into editable editors", () => {
  assert.match(pageSource, /createdEntities,\s*[\s\S]*structures,/);
  assert.match(pageSource, /referenceEntities=\{createdEntities\}/);
  assert.match(pageSource, /referenceStructures=\{structures\}/);
  assert.match(editorSource, /createReferenceSuggestionExtensions\(\{/);
  assert.match(editorSource, /createQuickActionSuggestionExtensions\(\{/);
  assert.match(editorSource, /\.\.\.referenceSuggestionExtensions/);
  assert.match(editorSource, /\.\.\.quickActionSuggestionExtensions/);
  assert.match(pageSource, /onCreateObjectReference=\{createWorkspaceObjectReference\}/);
  assert.match(pageSource, /onCreateOrReuseTag=\{createOrReuseWorkspaceTag\}/);
  assert.match(pageSource, /onTagReference=\{\(tagId\) => \{/);
});

test("slash and object-reference adapters share the same anchor fallback", () => {
  assert.match(referenceSource, /resolveSuggestionAnchorRect\(/);
  assert.match(slashSource, /resolveSuggestionAnchorRect\(/);
});
