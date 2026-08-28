import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import test from "node:test";
import { blockEditorDocumentFromPlainText } from "../src/editor/document.ts";
import {
  buildWorkspaceSearchIndex,
  searchWorkspaceIndex,
} from "../src/lib/workspace-query-engine.ts";

function page(id, title, body) {
  return {
    aliases: [`alias-${id}`],
    body: blockEditorDocumentFromPlainText(body),
    collections: [],
    createdAt: "2026-08-20T00:00:00.000Z",
    id,
    kind: "document",
    objectTypeId: id.endsWith("0") ? "project" : "page",
    propertyValues: {},
    tags: [],
    title,
  };
}

test("palette and reference search scale over representative local fixtures", () => {
  const entities = Array.from({ length: 1_200 }, (_value, index) =>
    page(
      `entity-${index}`,
      index === 777 ? "Project Atlas Command Target" : `Object ${index}`,
      index === 802
        ? "Reusable block about Atlas command palette references"
        : `Body text ${index}`,
    ),
  );

  const buildStartedAt = performance.now();
  const index = buildWorkspaceSearchIndex(entities);
  const buildDuration = performance.now() - buildStartedAt;
  const searchStartedAt = performance.now();
  const objectResults = searchWorkspaceIndex(index, "atlas command", "object");
  const blockResults = searchWorkspaceIndex(index, "atlas references", "block");
  const searchDuration = performance.now() - searchStartedAt;

  assert.ok(buildDuration < 750, `search index build took ${buildDuration}ms`);
  assert.ok(searchDuration < 250, `derived search took ${searchDuration}ms`);
  assert.equal(objectResults[0].entityId, "entity-777");
  assert.equal(blockResults[0].entityId, "entity-802");
});

test("palette and editor suggestion query paths avoid per-keystroke storage writes", async () => {
  const [workspaceSource, editorSource, referenceSource] = await Promise.all([
    readFile("src/components/workspace-controller.tsx", "utf8"),
    readFile("src/components/block-editor.tsx", "utf8"),
    readFile("src/editor/reference-suggestions.ts", "utf8"),
  ]);
  const paletteSource = workspaceSource.slice(
    workspaceSource.indexOf("function WorkspaceCommandPalette"),
  );
  const querySources = [paletteSource, editorSource, referenceSource].join("\n");

  assert.doesNotMatch(querySources, /localStorage\.setItem/);
  assert.doesNotMatch(querySources, /sessionStorage\.setItem/);
  assert.match(workspaceSource, /useDeferredValue/);
});
