import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("object page uses inline inputs for tag and collection selection", async () => {
  const source = await readFile(
    new URL("../src/components/workspace-object-page-view.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /data-slot="object-page-tags-input"/);
  assert.match(source, /data-slot="object-page-collections-input"/);
  assert.doesNotMatch(source, /data-slot="object-page-tags-trigger"/);
  assert.doesNotMatch(source, /data-slot="object-page-collections-trigger"/);
});

test("tag selector escalates search-all to the modal picker instead of navigating", async () => {
  const source = await readFile(
    new URL("../src/components/workspace-object-page-view.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    source,
    /data-slot="object-page-tag-picker"/,
  );
  assert.match(
    source,
    /setTagPickerOpen\(true\)/,
  );
  assert.doesNotMatch(source, /selectEntity\("tag"\)/);
});

test("metadata selectors avoid creating collections from inline search text", async () => {
  const source = await readFile(
    new URL("../src/components/workspace-object-page-view.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /documentMenu\.newTagEmpty/);
  assert.doesNotMatch(source, /documentMenu\.newCollectionNamed/);
  assert.doesNotMatch(source, /createCollectionId/);
});

test("page header keeps the measured desktop action sizes visible", async () => {
  const source = await readFile(
    new URL("../src/components/workspace-object-page-view.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /"h-\[26px\] w-\[26px\] rounded-lg border border-border"/);
  assert.doesNotMatch(source, /pointer-events-none hidden h-7/);
});
