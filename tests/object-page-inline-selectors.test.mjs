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

test("tag selector closes before its navigation and creation actions", async () => {
  const source = await readFile(
    new URL("../src/components/workspace-object-page-view.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    source,
    /onClick=\{\(\) => \{\s*setQuery\(""\);\s*setOpen\(false\);\s*createWorkspaceEntity\("tag"\);\s*\}\}/,
  );
  assert.match(
    source,
    /onClick=\{\(\) => \{\s*setQuery\(""\);\s*setOpen\(false\);\s*selectEntity\("tag"\);\s*\}\}/,
  );
});

test("collection selector only filters existing collections", async () => {
  const source = await readFile(
    new URL("../src/components/workspace-object-page-view.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /createAndSelectCollection/);
  assert.doesNotMatch(source, /newCollectionNamed/);
});
