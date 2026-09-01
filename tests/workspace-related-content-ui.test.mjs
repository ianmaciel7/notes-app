import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("object page Related Content uses the ranked provider and bounded inline results", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /selectRelatedContent\(\{/);
  assert.match(source, /RELATED_CONTENT_PANEL_LIMIT/);
  assert.match(source, /state\.results\.slice\(0, 5\)/);
  assert.match(source, /data-slot="workspace-object-related-content"/);
  assert.match(source, /data-slot="workspace-object-related-content-more"/);
  assert.match(source, /data-result-revision=/);
});

test("object page Related Content matches the compact reference reading composition", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /data-slot="workspace-object-related-content-heading"/);
  assert.match(source, /data-slot="workspace-object-related-content-count"/);
  assert.match(source, /data-slot="workspace-object-related-content-row"/);
  assert.match(source, /className="group\/related-content relative mt-16"/);
  assert.match(
    source,
    /className="group\/related-heading flex h-8 items-center"/,
  );
  assert.match(source, /group\/related-heading/);
  assert.match(source, /group\/related-content/);
  assert.match(source, /group-hover\/related-content:opacity-100/);
  assert.match(source, /aria-expanded=\{expandedRelatedIds\.has\(item\.id\)\}/);
  assert.match(source, /workspace-object-related-content-preview/);
  assert.doesNotMatch(source, /result\.score\.toFixed\(2\)/);
  assert.doesNotMatch(source, /relatedContentProvider/);
  assert.doesNotMatch(source, /className="mt-12 border-t pt-8"/);
});

test("related rows expose disclosure, editable title, side-panel, and options actions", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const relatedSource = source.slice(
    source.indexOf("function RelatedContent({"),
    source.indexOf("function getEntityTitle("),
  );

  assert.match(
    relatedSource,
    /data-slot="workspace-object-related-content-disclosure"/,
  );
  assert.match(relatedSource, /<RelatedContentTitle/);
  assert.doesNotMatch(
    relatedSource,
    /data-slot="workspace-object-related-content-navigation"/,
  );
  assert.match(
    relatedSource,
    /data-slot="workspace-object-related-content-side-panel"/,
  );
  assert.match(
    relatedSource,
    /data-slot="workspace-object-related-content-options"/,
  );
  assert.match(relatedSource, /group-hover\/related-row:pointer-events-auto/);
  assert.match(relatedSource, /group-hover\/related-row:opacity-100/);
  assert.match(relatedSource, /hover:bg-muted/);
  assert.doesNotMatch(relatedSource, /hover:border-border/);
});

test("related content uses the measured row, disclosure, and action geometry", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const relatedSource = source.slice(
    source.indexOf("function RelatedContent({"),
    source.indexOf("function getEntityTitle("),
  );

  assert.match(relatedSource, /className="group\/related-row w-full/);
  assert.match(relatedSource, /h-\[22px\] w-\[22px\]/);
  assert.match(relatedSource, /duration-300 linear/);
  assert.match(relatedSource, /w-\[109\.859px\]/);
  assert.doesNotMatch(relatedSource, /w-\[calc\(100%\+0\.5rem\)\]/);
});

test("related row titles buffer edits and persist through the workspace update callback", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const relatedSource = source.slice(
    source.indexOf("function RelatedContentTitle("),
    source.indexOf("function getEntityTitle("),
  );

  assert.match(
    relatedSource,
    /useBufferedTextCommit\(\{\s*value,\s*onCommit,\s*\}\)/,
  );
  assert.match(
    relatedSource,
    /data-slot="workspace-object-related-content-title-input"/,
  );
  assert.match(relatedSource, /<textarea/);
  assert.match(relatedSource, /rows=\{1\}/);
  assert.match(relatedSource, /onCommit=\{\(title\) =>/);
  assert.match(relatedSource, /updateWorkspaceEntity\(item\.id, \{ title \}\)/);
  assert.match(relatedSource, /if \(event\.key === "Enter"\)/);
  assert.match(relatedSource, /if \(event\.key === "Escape"\)/);
});

test("Show more follows section hover and uses the compact responsive action", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /workspace-object-related-content-more/);
  assert.match(source, /pointer-events-none/);
  assert.match(source, /group-hover\/related-content:pointer-events-auto/);
  assert.match(source, /group-hover\/related-content:opacity-100/);
  assert.match(source, /focus-visible:pointer-events-auto/);
  assert.match(source, /<Settings2Icon className="size-3\.5 lg:hidden"/);
  assert.match(source, /lg:w-\[109\.859px\]/);
  assert.doesNotMatch(
    source,
    /group-hover\/related-heading:pointer-events-auto/,
  );
});

test("relationship reading sections omit the permanent generic builder", async () => {
  const source = await readFile(
    new URL(
      "../src/components/workspace-object-page-view.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /hasRelationshipReadingContent/);
  assert.doesNotMatch(source, /className="mt-16 grid gap-6 border-t pt-8"/);
  assert.doesNotMatch(
    source,
    />\s*\{t\("linking\.addRelationship"\)\}\s*<\/PopoverTrigger>/,
  );
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
