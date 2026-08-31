import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("object page Related Content uses the ranked provider and bounded inline results", async () => {
  const source = await readFile(
    new URL("../src/components/workspace-object-page-view.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /selectRelatedContent\(\{/);
  assert.match(source, /RELATED_CONTENT_PANEL_LIMIT/);
  assert.match(source, /state\.results\.slice\(0, 5\)/);
  assert.match(source, /data-slot="workspace-object-related-content"/);
  assert.match(source, /data-slot="workspace-object-related-content-more"/);
  assert.match(source, /data-result-revision=/);
});

test("contextual related content keeps structural sections separately named", async () => {
  const source = await readFile(
    new URL("../src/components/workspace-content.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /entry === "backlinks"/);
  assert.match(source, /entry === "objectsInside"/);
  assert.match(source, /relatedState\?\.kind === "ready"/);
  assert.match(source, /relatedState\.results\.map/);
  assert.match(source, /data-result-revision=/);
});
