import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [
  controllerSource,
  iconsSource,
  objectsSource,
  objectTypesSource,
  overviewSource,
  paletteSource,
  studioSource,
] = await Promise.all([
  readFile(
    new URL("../src/components/workspace-controller.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../src/components/object-icons.tsx", import.meta.url),
    "utf8",
  ),
  readFile(new URL("../src/lib/workspace-objects.ts", import.meta.url), "utf8"),
  readFile(
    new URL("../src/lib/workspace-object-types.ts", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../src/components/app-sidebar-overview.tsx", import.meta.url),
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

test("runtime Structure registry replaces the closed domain union", () => {
  assert.match(objectsSource, /type ObjectTypeId = StructureId/);
  assert.doesNotMatch(objectsSource, /type ObjectTypeId =\s*\|/);
  assert.match(objectTypesSource, /OBJECT_TYPE_PRESETS/);
  assert.match(objectTypesSource, /createInitialStructureRegistry/);
  assert.match(controllerSource, /selectCreatableStructures/);
  assert.match(paletteSource, /objectTypes/);
  assert.doesNotMatch(paletteSource, /const newContentItems/);
});

test("the central registry documents Archive as reserved", () => {
  assert.match(iconsSource, /id: "archive"/);
  assert.match(objectTypesSource, /RESERVED_STRUCTURES/);
  assert.doesNotMatch(paletteSource, /objectTypeId: "archive"/);
  assert.doesNotMatch(objectsSource, /\| "archive"/);
});

test("preset ids are templates rather than fixed domain discriminants", () => {
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
  }
  assert.doesNotMatch(objectsSource, /\| "book"|\| "person"|\| "meeting"/);
  assert.match(objectTypesSource, /definePreset\("book"/);
  assert.match(studioSource, /OBJECT_TYPE_PRESETS/);
  assert.doesNotMatch(studioSource, /objectTypeDefinitions\.filter/);
});

test("production consumers do not keep a parallel mutable object-type registry", () => {
  assert.doesNotMatch(controllerSource, /initialObjectTypes|baseObjectTypes/);
  assert.doesNotMatch(controllerSource, /setObjectTypes/);
  assert.doesNotMatch(
    overviewSource,
    /internalObjectTypes|setInternalObjectTypes/,
  );
  assert.match(overviewSource, /onCreateObjectTypeFromPreset/);
  assert.match(overviewSource, /onCreateObjectType/);
});
