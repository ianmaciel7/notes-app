import assert from "node:assert/strict";
import test from "node:test";

import {
  BUILT_IN_STRUCTURES,
  createCustomStructure,
  createInitialStructureRegistry,
  createLegacyStructureDefinitions,
  deleteStructure,
  instantiateObjectTypePreset,
  OBJECT_TYPE_PRESETS,
  RESERVED_STRUCTURES,
  renameStructure,
  replaceStructureSchema,
  selectCreatableStructures,
  validatePropertyDefinition,
  validateStructureRegistry,
  validateWorkspaceStructure,
} from "../src/lib/workspace-object-types.ts";

const canonicalRegistry = [...BUILT_IN_STRUCTURES, ...RESERVED_STRUCTURES];

function customStructureInput(overrides = {}) {
  return {
    singularName: "Research note",
    pluralName: "Research notes",
    iconName: "page",
    tone: "blue",
    lifecycleKind: "document",
    ...overrides,
  };
}

function expectSuccess(result) {
  assert.equal(result.ok, true, result.ok ? undefined : result.error.message);
  return result.value;
}

function expectFailure(result, code) {
  assert.equal(result.ok, false);
  assert.equal(result.error.code, code);
  return result.error;
}

test("canonical registries keep built-in, reserved, and preset identities separate", () => {
  const builtInIds = BUILT_IN_STRUCTURES.map((structure) => structure.id);
  const reservedIds = RESERVED_STRUCTURES.map((structure) => structure.id);
  const presetIds = OBJECT_TYPE_PRESETS.map((preset) => preset.id);
  const allIds = [...builtInIds, ...reservedIds, ...presetIds];

  assert.deepEqual(builtInIds, [
    "page",
    "table",
    "task",
    "weblink",
    "image",
    "pdf",
    "audio",
    "file",
    "tweet",
    "ai-chat",
    "tag",
    "query",
  ]);
  assert.deepEqual(reservedIds, ["archive"]);
  assert.deepEqual(presetIds, [
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
    "quote",
    "atomic-note",
  ]);
  assert.equal(new Set(allIds).size, allIds.length);
  assert.ok(
    BUILT_IN_STRUCTURES.every(
      (structure) => structure.ownership === "built-in",
    ),
  );
  assert.ok(
    RESERVED_STRUCTURES.every(
      (structure) => structure.ownership === "reserved",
    ),
  );
});

test("fresh registries keep suggested presets as templates", () => {
  const registry = createInitialStructureRegistry();
  const registryIds = registry.map((structure) => structure.id);
  const creatableIds = selectCreatableStructures(registry).map(
    (structure) => structure.id,
  );
  const presetIds = OBJECT_TYPE_PRESETS.map((preset) => preset.id);

  assert.deepEqual(
    registryIds,
    [...BUILT_IN_STRUCTURES, ...RESERVED_STRUCTURES].map(
      (structure) => structure.id,
    ),
  );
  for (const presetId of presetIds) {
    assert.equal(registryIds.includes(presetId), false, presetId);
    assert.equal(creatableIds.includes(presetId), false, presetId);
  }
});

test("legacy preset Structures are migration compatibility records, not creatable ids", () => {
  const registry = expectSuccess(
    createLegacyStructureDefinitions(["book", "person"]),
  );
  const creatableIds = selectCreatableStructures([
    ...canonicalRegistry,
    ...registry,
  ]).map((structure) => structure.id);

  assert.deepEqual(
    registry.map((structure) => structure.ownership),
    ["legacy", "legacy"],
  );
  assert.equal(creatableIds.includes("book"), false);
  assert.equal(creatableIds.includes("person"), false);
});

test("custom Structure ids are open, persistent runtime identities", () => {
  const firstId = "11111111-1111-4111-8111-111111111111";
  const secondId = "22222222-2222-4222-8222-222222222222";
  const originalSnapshot = structuredClone(canonicalRegistry);

  const afterFirst = expectSuccess(
    createCustomStructure(
      canonicalRegistry,
      customStructureInput(),
      () => firstId,
    ),
  );
  const afterSecond = expectSuccess(
    createCustomStructure(
      afterFirst,
      customStructureInput({ singularName: "Source", pluralName: "Sources" }),
      () => secondId,
    ),
  );

  assert.deepEqual(canonicalRegistry, originalSnapshot);
  assert.notEqual(afterFirst, canonicalRegistry);
  assert.deepEqual(
    afterSecond.slice(-2).map((structure) => structure.id),
    [firstId, secondId],
  );
  assert.ok(
    afterSecond
      .slice(-2)
      .every((structure) => structure.ownership === "custom"),
  );
  assert.equal(validateStructureRegistry(afterSecond).ok, true);
  expectFailure(
    createCustomStructure(afterSecond, customStructureInput(), () => firstId),
    "id-collision",
  );
});

test("using the same preset twice clones independent custom Structures", () => {
  const preset = OBJECT_TYPE_PRESETS.find(
    (candidate) => candidate.id === "book",
  );
  assert.ok(preset);
  const presetSnapshot = structuredClone(preset);

  const firstRegistry = expectSuccess(
    instantiateObjectTypePreset(
      canonicalRegistry,
      "book",
      () => "33333333-3333-4333-8333-333333333333",
    ),
  );
  const secondRegistry = expectSuccess(
    instantiateObjectTypePreset(
      firstRegistry,
      "book",
      () => "44444444-4444-4444-8444-444444444444",
    ),
  );
  const first = secondRegistry.at(-2);
  const second = secondRegistry.at(-1);

  assert.notEqual(first.id, second.id);
  assert.equal(first.ownership, "custom");
  assert.equal(second.ownership, "custom");
  assert.deepEqual(first.propertyDefinitions, second.propertyDefinitions);
  assert.notEqual(first.propertyDefinitions, second.propertyDefinitions);

  const renamed = expectSuccess(
    renameStructure(secondRegistry, first.id, "Reading", "Readings"),
  );
  assert.equal(
    renamed.find((structure) => structure.id === first.id).singularName,
    "Reading",
  );
  assert.equal(
    renamed.find((structure) => structure.id === second.id).singularName,
    second.singularName,
  );
  assert.deepEqual(preset, presetSnapshot);
});

test("guarded deletion is atomic and protects referenced or system Structures", () => {
  const customId = "55555555-5555-4555-8555-555555555555";
  const registry = expectSuccess(
    createCustomStructure(
      canonicalRegistry,
      customStructureInput(),
      () => customId,
    ),
  );
  const snapshot = structuredClone(registry);

  const referenced = deleteStructure(registry, customId, { instanceCount: 2 });
  expectFailure(referenced, "structure-in-use");
  assert.deepEqual(registry, snapshot);

  const dependedOn = deleteStructure(registry, customId, {
    dependentCollectionIds: ["collection-1"],
  });
  expectFailure(dependedOn, "dependent-collections");
  assert.deepEqual(registry, snapshot);

  expectFailure(deleteStructure(registry, "page"), "protected-structure");
  const deleted = expectSuccess(deleteStructure(registry, customId));
  assert.equal(
    deleted.some((structure) => structure.id === customId),
    false,
  );
  assert.equal(
    registry.some((structure) => structure.id === customId),
    true,
  );
});

test("property schema validation accepts public definitions and rejects malformed schemas", () => {
  const summary = {
    id: "summary",
    name: "Summary",
    ownership: "normal",
    valueType: "text",
    writable: true,
    multiple: false,
  };
  const related = {
    id: "related",
    name: "Related",
    ownership: "normal",
    valueType: "entity",
    writable: true,
    multiple: true,
    targetStructureIds: ["page"],
  };

  assert.equal(validatePropertyDefinition(summary).ok, true);
  assert.equal(validatePropertyDefinition(related).ok, true);
  assert.equal(
    validatePropertyDefinition({ ...summary, valueType: "unsupported" }).ok,
    false,
  );

  const customId = "66666666-6666-4666-8666-666666666666";
  const registry = expectSuccess(
    createCustomStructure(
      canonicalRegistry,
      customStructureInput({ propertyDefinitions: [summary] }),
      () => customId,
    ),
  );
  const replaced = expectSuccess(
    replaceStructureSchema(registry, customId, [summary, related]),
  );
  const updated = replaced.find((structure) => structure.id === customId);

  assert.deepEqual(updated.propertyDefinitions.slice(-2), [summary, related]);
  assert.equal(validateWorkspaceStructure(updated).ok, true);
  expectFailure(
    replaceStructureSchema(registry, customId, [summary, summary]),
    "duplicate-property-definition-id",
  );
  expectFailure(
    replaceStructureSchema(registry, customId, [], {
      unsafePropertyDefinitionIds: ["summary"],
    }),
    "unsafe-schema-mutation",
  );
  assert.deepEqual(
    registry
      .find((structure) => structure.id === customId)
      .propertyDefinitions.slice(-1),
    [summary],
  );
});

test("entity inverse properties must point at compatible reciprocal definitions", () => {
  const author = {
    id: "author",
    inversePropertyDefinitionId: "books",
    multiple: false,
    name: "Author",
    ownership: "normal",
    targetStructureIds: ["person-rel"],
    valueType: "entity",
    writable: true,
  };
  const books = {
    id: "books",
    inversePropertyDefinitionId: "author",
    multiple: true,
    name: "Books",
    ownership: "normal",
    targetStructureIds: ["book-rel"],
    valueType: "entity",
    writable: true,
  };
  const bookRegistry = expectSuccess(
    createCustomStructure(
      canonicalRegistry,
      customStructureInput({
        propertyDefinitions: [author],
        singularName: "Book",
        pluralName: "Books",
      }),
      () => "book-rel",
    ),
  );
  const registry = expectSuccess(
    createCustomStructure(
      bookRegistry,
      customStructureInput({
        propertyDefinitions: [books],
        singularName: "Person",
        pluralName: "People",
      }),
      () => "person-rel",
    ),
  );

  assert.equal(validateStructureRegistry(registry).ok, true);
  assert.equal(
    validateStructureRegistry([
      registry.find((structure) => structure.id === "book-rel"),
      {
        ...registry.find((structure) => structure.id === "person-rel"),
        propertyDefinitions: [{ ...books, targetStructureIds: ["project"] }],
      },
    ]).ok,
    false,
  );
});

test("Structure presentation normalizes legacy view aliases", () => {
  const normalized = expectSuccess(
    validateWorkspaceStructure({
      ...BUILT_IN_STRUCTURES[0],
      presentation: {
        availableViews: ["grid", "table"],
        defaultView: "grid",
      },
    }),
  );

  assert.deepEqual(normalized.presentation, {
    availableViews: ["gallery", "table"],
    defaultView: "gallery",
  });

  const calendarAlias = expectSuccess(
    createCustomStructure(
      canonicalRegistry,
      customStructureInput({
        presentation: {
          availableViews: ["calendar"],
          defaultView: "calendar",
        },
      }),
      () => "77777777-7777-4777-8777-777777777777",
    ),
  );

  assert.deepEqual(calendarAlias.at(-1).presentation, {
    availableViews: ["list"],
    defaultView: "list",
  });
});

test("registry validation rejects duplicate canonical identities atomically", () => {
  assert.equal(validateStructureRegistry(canonicalRegistry).ok, true);
  assert.equal(
    validateStructureRegistry([
      ...canonicalRegistry,
      structuredClone(BUILT_IN_STRUCTURES[0]),
    ]).ok,
    false,
  );
});
