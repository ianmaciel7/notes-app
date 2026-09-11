import assert from "node:assert/strict";
import { test } from "node:test";
import getMeta from "@ladle/react/meta";
import config from "../../.ladle/config.mjs";

// Use Ladle's public parser so these checks exercise the actual story IDs,
// including MDX discovery and static title/storyName validation.
const { stories } = await getMeta();
const entries = Object.entries(stories);

function expectedGroup(filePath) {
  const path = filePath.replaceAll("\\", "/");
  if (path.startsWith("docs/")) return "docs";
  if (path.startsWith("src/components/ui/")) return "ui";
  return "components";
}

test("the catalog contains exactly Components, UI, and Docs", () => {
  const groups = [...new Set(entries.map(([id]) => id.split("--")[0]))].sort();
  assert.deepEqual(groups, ["components", "docs", "ui"]);
});

test("every story belongs to the group for its source", () => {
  for (const [id, story] of entries) {
    assert.equal(id.split("--")[0], expectedGroup(story.filePath), story.filePath);
  }
});

test("the default story resolves to UI / Button / Default", () => {
  assert.equal(config.defaultStory, "ui--button--default");
  assert.equal(stories[config.defaultStory]?.filePath, "src/components/ui/button.stories.tsx");
});

test("root ordering preserves all stories instead of silently hiding unmatched IDs", () => {
  assert.deepEqual(config.storyOrder, ["components--*", "ui--*", "docs--*", "*"]);
});

test("both object primitive examples remain discoverable under Components", () => {
  const primitives = entries.filter(([, story]) =>
    story.filePath.endsWith("/objects/object-parts.stories.tsx"),
  );
  assert.equal(primitives.length, 2);
  for (const [id] of primitives) assert.ok(id.startsWith("components--objects--primitives--"));
});

test("the authoring guide and workspace architecture remain visible in Docs", () => {
  const docs = entries.filter(([id]) => id.startsWith("docs--"));
  assert.ok(docs.some(([, story]) => story.filePath === "docs/ladle.stories.mdx"));
  assert.equal(
    docs.filter(([, story]) => story.filePath.endsWith("workspace-architecture.stories.tsx"))
      .length,
    2,
  );
});

test("story paths never create blank navigation groups", () => {
  for (const [id, story] of entries) {
    assert.ok(
      story.levels.every((level) => level.trim().length > 0),
      id,
    );
  }
});
