import assert from "node:assert/strict";
import test from "node:test";

import {
  blockEditorDocumentFromPlainText,
} from "../src/editor/document.ts";
import {
  createCustomStructure,
  validatePropertyDefinition,
} from "../src/lib/workspace-object-types.ts";
import {
  createInitialWorkspaceObjectState,
  workspaceObjectReducer,
} from "../src/lib/workspace-objects.ts";
import {
  normalizeWorkspacePropertyValue,
  removeWorkspaceEntityPropertyValue,
  setWorkspaceEntityPropertyValue,
} from "../src/lib/workspace-property-values.ts";

function expectSuccess(result) {
  assert.equal(result.ok, true, result.ok ? undefined : result.error.message);
  return result.value;
}

function expectFailure(result, code) {
  assert.equal(result.ok, false);
  assert.equal(result.error.code, code);
}

const summaryDefinition = {
  id: "summary",
  name: "Summary",
  ownership: "normal",
  valueType: "text",
  writable: true,
  multiple: false,
  description: "Short object summary",
  iconName: "page",
};

test("property definitions round-trip ownership, metadata, labels, and target constraints", () => {
  const labelDefinition = {
    id: "status",
    multiple: true,
    name: "Status",
    options: [
      { id: "draft", name: "Draft", color: "gray" },
      { id: "done", name: "Done", color: "green" },
    ],
    ownership: "normal",
    valueType: "label",
    writable: true,
  };
  const relationDefinition = {
    fixedTargetObjectIds: ["page-1", "page-2"],
    id: "related",
    inversePropertyDefinitionId: "relatedBack",
    multiple: true,
    name: "Related",
    ownership: "normal",
    targetStructureIds: ["page"],
    valueType: "entity",
    writable: true,
  };

  assert.deepEqual(
    expectSuccess(validatePropertyDefinition(summaryDefinition)),
    summaryDefinition,
  );
  assert.deepEqual(
    expectSuccess(validatePropertyDefinition(labelDefinition)),
    labelDefinition,
  );
  assert.deepEqual(
    expectSuccess(validatePropertyDefinition(relationDefinition)),
    relationDefinition,
  );
  expectFailure(
    validatePropertyDefinition({ ...summaryDefinition, ownership: "private" }),
    "invalid-property-definition",
  );
});

test("typed values normalize supported families and reject arbitrary JSON", () => {
  const labelDefinition = {
    id: "status",
    multiple: true,
    name: "Status",
    options: [
      { id: "draft", name: "Draft", color: "gray" },
      { id: "done", name: "Done", color: "green" },
    ],
    ownership: "normal",
    valueType: "label",
    writable: true,
  };
  const richTextDefinition = {
    id: "notes",
    multiple: false,
    name: "Notes",
    ownership: "normal",
    valueType: "richText",
    writable: true,
  };
  const mediaDefinition = {
    id: "cover",
    multiple: false,
    name: "Cover",
    ownership: "normal",
    valueType: "media",
    writable: true,
  };
  const richText = blockEditorDocumentFromPlainText("Long note");

  assert.deepEqual(
    expectSuccess(
      normalizeWorkspacePropertyValue(summaryDefinition, "  Notes  "),
    ),
    { text: { value: "Notes" }, type: "text" },
  );
  assert.deepEqual(
    expectSuccess(
      normalizeWorkspacePropertyValue(
        {
          id: "rating",
          multiple: false,
          name: "Rating",
          ownership: "normal",
          valueType: "number",
          writable: true,
        },
        5,
      ),
    ),
    { number: { value: 5 }, type: "number" },
  );
  assert.deepEqual(
    expectSuccess(
      normalizeWorkspacePropertyValue(labelDefinition, ["draft", "done"]),
    ),
    { label: [{ id: "draft" }, { id: "done" }], type: "label" },
  );
  assert.deepEqual(
    expectSuccess(normalizeWorkspacePropertyValue(richTextDefinition, richText)),
    { richText, type: "richText" },
  );
  assert.deepEqual(
    expectSuccess(normalizeWorkspacePropertyValue(mediaDefinition, "asset-1")),
    { media: { id: "asset-1" }, type: "media" },
  );
  expectFailure(
    normalizeWorkspacePropertyValue(labelDefinition, ["draft", "unknown"]),
    "invalid-property-value",
  );
  expectFailure(
    normalizeWorkspacePropertyValue(summaryDefinition, { unsafe: true }),
    "invalid-property-value",
  );
});

test("entity values enforce cardinality targets fixed sets and de-duplicate ids", () => {
  const relationDefinition = {
    fixedTargetObjectIds: ["page-1", "page-2"],
    id: "related",
    multiple: false,
    name: "Related",
    ownership: "normal",
    targetStructureIds: ["page"],
    valueType: "entity",
    writable: true,
  };

  assert.deepEqual(
    expectSuccess(
      normalizeWorkspacePropertyValue(relationDefinition, "page-1", {
        targetStructureIdByEntityId: { "page-1": "page" },
      }),
    ),
    { entity: [{ id: "page-1" }], type: "entity" },
  );
  expectFailure(
    normalizeWorkspacePropertyValue(relationDefinition, ["page-1", "page-2"]),
    "invalid-property-value",
  );
  expectFailure(
    normalizeWorkspacePropertyValue(relationDefinition, "page-3"),
    "invalid-property-value",
  );
  assert.deepEqual(
    expectSuccess(
      normalizeWorkspacePropertyValue(
        { ...relationDefinition, multiple: true },
        ["page-1", "page-1"],
      ),
    ),
    { entity: [{ id: "page-1" }], type: "entity" },
  );
});

test("pure property commands set, remove, and protect system values atomically", () => {
  const registry = expectSuccess(
    createCustomStructure(
      createInitialWorkspaceObjectState().structures,
      {
        iconName: "page",
        lifecycleKind: "document",
        pluralName: "Research notes",
        propertyDefinitions: [summaryDefinition],
        singularName: "Research note",
        tone: "blue",
      },
      () => "research",
    ),
  );
  const structure = registry.find((candidate) => candidate.id === "research");
  assert.ok(structure);
  let state = workspaceObjectReducer(
    { ...createInitialWorkspaceObjectState(), structures: registry },
    { type: "beginCreate", objectTypeId: "research" },
  );
  const entity = state.entities[0];
  assert.deepEqual(entity.propertyValues.lastUpdatedAt, {
    lastUpdatedAt: { value: entity.createdAt },
    type: "lastUpdatedAt",
  });
  const edited = expectSuccess(
    setWorkspaceEntityPropertyValue(entity, structure, "summary", "Evidence"),
  );
  assert.deepEqual(edited.propertyValues.summary, {
    text: { value: "Evidence" },
    type: "text",
  });
  expectFailure(
    setWorkspaceEntityPropertyValue(
      edited,
      structure,
      "createdAt",
      "2026-08-25T00:00:00.000Z",
    ),
    "read-only-property",
  );
  expectFailure(
    removeWorkspaceEntityPropertyValue(entity, structure, "createdAt"),
    "read-only-property",
  );

  state = workspaceObjectReducer(state, {
    id: entity.id,
    propertyId: "summary",
    type: "setPropertyValue",
    value: "Stored",
  });
  assert.deepEqual(state.entities[0].propertyValues.summary, {
    text: { value: "Stored" },
    type: "text",
  });
  assert.notEqual(
    state.entities[0].propertyValues.lastUpdatedAt.lastUpdatedAt.value,
    entity.createdAt,
  );
  state = workspaceObjectReducer(state, {
    id: entity.id,
    propertyId: "summary",
    type: "removePropertyValue",
  });
  assert.equal("summary" in state.entities[0].propertyValues, false);
});
