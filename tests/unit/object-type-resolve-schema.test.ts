import { describe, expect, it } from "vitest";
import type { ObjectTypeDocument } from "@/lib/object-types/object-type";
import {
  MAX_SCHEMA_DEPTH,
  resolveEffectiveSchema,
  validateParentChange,
} from "@/lib/object-types/resolve-schema";

function objectType(
  id: string,
  parentTypeId: string | null,
  properties: Record<string, { key: string }> = {},
): ObjectTypeDocument {
  return {
    id,
    name: id,
    pluralName: `${id}s`,
    parentTypeId,
    schemaVersion: 1,
    stateVersion: 1,
    propertyDefinitions: Object.fromEntries(
      Object.entries(properties).map(([propertyId, property]) => [
        propertyId,
        { ...property, name: property.key, valueType: "text", required: false },
      ]),
    ),
    createdAt: { seconds: 1 },
    updatedAt: { seconds: 2 },
  };
}

describe("resolveEffectiveSchema", () => {
  it("resolves a three-level schema with ancestors first", () => {
    const types = {
      a: objectType("a", null, { title: { key: "title" } }),
      b: objectType("b", "a", { author: { key: "author" } }),
      c: objectType("c", "b", { isbn: { key: "isbn" } }),
    };

    expect(resolveEffectiveSchema(types, "c")).toEqual({
      ok: true,
      value: [
        expect.objectContaining({ propertyId: "title", originTypeId: "a" }),
        expect.objectContaining({ propertyId: "author", originTypeId: "b" }),
        expect.objectContaining({ propertyId: "isbn", originTypeId: "c" }),
      ],
    });
  });

  it("resolves a type without a parent", () => {
    const types = {
      book: objectType("book", null, { title: { key: "title" } }),
    };

    expect(resolveEffectiveSchema(types, "book")).toMatchObject({
      ok: true,
      value: [{ propertyId: "title", originTypeId: "book" }],
    });
  });

  it.each([
    ["unknown-type", {}, "missing"],
    ["self-parent", { a: objectType("a", "a") }, "a"],
    ["cycle", { a: objectType("a", "b"), b: objectType("b", "a") }, "a"],
    ["missing-parent", { a: objectType("a", "missing") }, "a"],
    [
      "duplicate-key",
      {
        a: objectType("a", null, { one: { key: "same" } }),
        b: objectType("b", "a", { two: { key: "same" } }),
      },
      "b",
    ],
    [
      "duplicate-property-id",
      {
        a: objectType("a", null, { property: { key: "one" } }),
        b: objectType("b", "a", { property: { key: "two" } }),
      },
      "b",
    ],
  ])("returns %s without mutating inputs", (code, types, typeId) => {
    const before = structuredClone(types);
    expect(resolveEffectiveSchema(types, typeId)).toMatchObject({
      ok: false,
      error: { code },
    });
    expect(types).toEqual(before);
  });

  it("limits the inheritance chain depth", () => {
    const types = Object.fromEntries(
      Array.from({ length: MAX_SCHEMA_DEPTH + 1 }, (_, index) => {
        const id = `type-${index}`;
        return [id, objectType(id, index === 0 ? null : `type-${index - 1}`)];
      }),
    );

    expect(
      resolveEffectiveSchema(types, `type-${MAX_SCHEMA_DEPTH}`),
    ).toMatchObject({
      ok: false,
      error: { code: "depth-exceeded" },
    });
  });
});

describe("validateParentChange", () => {
  const types = {
    a: objectType("a", null),
    b: objectType("b", "a"),
    c: objectType("c", "b"),
  };

  it("allows removing a parent", () => {
    expect(validateParentChange(types, "c", null)).toEqual({
      ok: true,
      value: undefined,
    });
  });

  it("rejects a proposed self parent", () => {
    expect(validateParentChange(types, "a", "a")).toMatchObject({
      ok: false,
      error: { code: "self-parent" },
    });
  });

  it("rejects a proposed ancestor cycle", () => {
    expect(validateParentChange(types, "a", "c")).toMatchObject({
      ok: false,
      error: { code: "cycle" },
    });
  });
});
