import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [
  slashSource,
  catalogSource,
  contractSource,
  extensionsSource,
  documentSource,
  referenceSource,
  sharedSuggestionSource,
] = await Promise.all([
  readFile("src/editor/slash-command.tsx", "utf8"),
  readFile("src/editor/block-command-catalog.tsx", "utf8"),
  readFile("src/editor/block-editor-contract.ts", "utf8"),
  readFile("src/editor/block-editor-extensions.ts", "utf8"),
  readFile("src/editor/document.ts", "utf8"),
  readFile("docs/references/capacities-slash-menu.md", "utf8"),
  readFile("src/editor/shared-suggestion-controller.ts", "utf8"),
]);

test("slash trigger works at block start and after whitespace", () => {
  assert.match(slashSource, /startOfLine: false/);
  assert.match(slashSource, /allowedPrefixes: \[" "\]/);
  assert.doesNotMatch(slashSource, /startOfLine: true/);
});

test("slash menu stays anchored to the caret instead of viewport origin", () => {
  assert.match(slashSource, /coordsAtPos\(position\)/);
  assert.match(slashSource, /resolveSlashMenuAnchor/);
  assert.match(slashSource, /resolveSuggestionAnchorRect/);
  assert.match(slashSource, /floatingUi: \{ strategy: "fixed" \}/);
  assert.match(slashSource, /onPosition: \(position\) =>/);
  assert.match(slashSource, /position: "fixed"/);
  assert.match(slashSource, /SLASH_MENU_VIEWPORT_GUTTER/);
  assert.match(sharedSuggestionSource, /SUGGESTION_MENU_CURSOR_GAP/);
});

test("slash menu keeps the reference-aligned leading command order", () => {
  const ids = ["text", "small-text", "heading-1", "heading-2", "heading-3", "heading-4", "bullet-list", "alphabetical-list", "ordered-list", "roman-list"];
  let cursor = -1;
  for (const id of ids) {
    const next = catalogSource.indexOf(`id: "${id}"`);
    assert.ok(next > cursor, `${id} is out of order`);
    cursor = next;
  }
  assert.match(contractSource, /smallText: string/);
  assert.match(contractSource, /alphabeticalList: string/);
  assert.match(contractSource, /romanList: string/);
});

test("slash menu uses the reference surface", () => {
  assert.match(slashSource, /w-\[27\.5rem\]/);
  assert.match(slashSource, /rounded-\[14px\]/);
  assert.match(slashSource, /h-10 w-full/);
  assert.match(slashSource, /text-\[16px\]/);
  assert.match(slashSource, /bg-\[#f3f1ee\]/);
});

test("small text and typed ordered lists persist in the neutral document", () => {
  assert.match(extensionsSource, /types: \["paragraph"\]/);
  assert.match(extensionsSource, /"data-text-size": "small"/);
  assert.match(documentSource, /paragraph: isParagraphNode/);
  assert.match(documentSource, /\["1", "a", "A", "i", "I"\]/);
  assert.match(catalogSource, /size: "small"/);
  assert.match(catalogSource, /setOrderedListType\(editor, range, "a"\)/);
  assert.match(catalogSource, /setOrderedListType\(editor, range, "i"\)/);
});

test("slash menu reference images are registered", () => {
  assert.match(referenceSource, /619 × 545 px/);
  assert.match(referenceSource, /c16d002a2c7caff2918edbec40ae915f52454ab3a557e2637591a31ddc3dc1de/);
  assert.match(referenceSource, /f2ac5edd1c7ed1b75e39bc9935c73cd1550fe73a2ee489bf0be9d86c84cd0676/);
  assert.match(referenceSource, /1906 × 945 px/);
  assert.match(referenceSource, /a7e3ab077b0133e55558c43c41a5eca5afd86a3e8b745a1fe1fc6364a2029870/);
});
