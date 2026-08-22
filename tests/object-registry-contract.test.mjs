import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [iconsSource, objectsSource, paletteSource, studioSource] =
  await Promise.all([
    readFile(
      new URL("../src/components/object-icons.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/lib/workspace-objects.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../src/components/app-sidebar-primary-actions.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../src/components/app-sidebar-object-type-studio.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);

const creatableIds = [
  "book",
  "person",
  "area",
  "meeting",
  "definition",
  "idea",
  "place",
  "project",
  "organization",
  "atomic-note",
  "media",
  "travel",
  "quote",
  "page",
  "ai-chat",
  "table",
  "task",
  "image",
  "weblink",
  "tweet",
  "pdf",
  "audio",
  "file",
  "tag",
  "query",
];

test("every persistent lifecycle id is exposed by the New palette", () => {
  for (const id of creatableIds) {
    assert.match(objectsSource, new RegExp(`\\"${id}\\"`), id);
    assert.match(
      paletteSource,
      new RegExp(`objectTypeId: \\"${id}\\"`),
      id,
    );
  }
});

test("the central registry documents Archive as reserved", () => {
  assert.match(iconsSource, /id: "archive"/);
  assert.match(studioSource, /definition\.id !== "archive"/);
  assert.doesNotMatch(paletteSource, /objectTypeId: "archive"/);
  assert.doesNotMatch(objectsSource, /\| "archive"/);
});

test("preset object types are persistent document-like lifecycle types", () => {
  for (const id of [
    "book",
    "person",
    "area",
    "meeting",
    "definition",
    "idea",
    "place",
    "project",
    "organization",
    "media",
    "travel",
    "ai-chat",
  ]) {
    assert.match(iconsSource, new RegExp(`id: \\"${id}\\"`), id);
    assert.match(objectsSource, new RegExp(`\\| \\"${id}\\"`), id);
    assert.match(paletteSource, new RegExp(`objectTypeId: \\"${id}\\"`), id);
  }
});
