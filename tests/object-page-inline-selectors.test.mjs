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

test("applied page tags navigate to their tag object instead of removing metadata", async () => {
  const source = await readFile(
    new URL("../src/components/workspace-object-page-view.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /selectEntity\(tagId\)/);
  assert.doesNotMatch(source, /update\(\{ tags: tags\.filter\(\(item\) => item !== tagId\) \}\)/);
});

test("applied page tags use the reference green chip palette", async () => {
  const source = await readFile(
    new URL("../src/components/workspace-object-page-view.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /bg-\[oklch\(0\.9669_0\.0659_122\.38\)\]/);
  assert.match(source, /text-\[oklch\(0\.3653_0\.0648_128\.67\)\]/);
});

test("metadata selectors avoid creating collections from inline search text", async () => {
  const source = await readFile(
    new URL("../src/components/workspace-object-page-view.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /documentMenu\.newTagEmpty/);
  assert.match(source, /documentMenu\.newTag", \{ tag: deferredQuery\.trim\(\) \}/);
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

test("page header uses the reference collection, customize, and overflow icons", async () => {
  const [pageSource, iconSource] = await Promise.all([
    readFile(
      new URL("../src/components/workspace-object-page-view.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../src/components/object-icons.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(pageSource, /ObjectCollectionIcon/);
  assert.match(pageSource, /AppHeaderSparkleIcon/);
  assert.match(pageSource, /AppHeaderDotsIcon className="size-3\.5"/);
  assert.match(iconSource, /const ObjectCollectionIcon = ObjectAtomicNoteIcon/);
});
