import { describe, expect, it } from "vitest";
import { ObjectTypeParseError, parseObjectType } from "@/domain/object-type";

const timestamps = {
  createdAt: { seconds: 1 },
  updatedAt: { seconds: 2 },
};

const validDocument = {
  name: "Book",
  pluralName: "Books",
  parentTypeId: null,
  schemaVersion: 1,
  stateVersion: 1,
  propertyDefinitions: {
    title: {
      key: "title",
      name: "Title",
      valueType: "text",
      required: true,
    },
  },
  ...timestamps,
};

describe("parseObjectType", () => {
  it("parses a valid document without depending on a timestamp SDK", () => {
    expect(parseObjectType("book", validDocument)).toEqual({
      id: "book",
      ...validDocument,
    });
  });

  it("keeps an optional description when supplied", () => {
    expect(
      parseObjectType("book", { ...validDocument, description: "A volume." }),
    ).toMatchObject({ description: "A volume." });
  });

  it.each([
    ["an invalid id", "", validDocument],
    [
      "a missing plural name",
      "book",
      { ...validDocument, pluralName: undefined },
    ],
    ["a non-string parent", "book", { ...validDocument, parentTypeId: 1 }],
    [
      "a non-integer schema version",
      "book",
      { ...validDocument, schemaVersion: 1.5 },
    ],
    ["a missing timestamp", "book", { ...validDocument, createdAt: undefined }],
    ["a null timestamp", "book", { ...validDocument, updatedAt: null }],
    [
      "a definition map array",
      "book",
      { ...validDocument, propertyDefinitions: [] },
    ],
    [
      "an invalid property value type",
      "book",
      {
        ...validDocument,
        propertyDefinitions: {
          title: {
            ...validDocument.propertyDefinitions.title,
            valueType: "binary",
          },
        },
      },
    ],
    [
      "an invalid required flag",
      "book",
      {
        ...validDocument,
        propertyDefinitions: {
          title: {
            ...validDocument.propertyDefinitions.title,
            required: "yes",
          },
        },
      },
    ],
  ])("throws a typed error for %s", (_label, id, data) => {
    expect(() => parseObjectType(id as string, data)).toThrow(
      ObjectTypeParseError,
    );
    expect(() => parseObjectType(id as string, data)).toThrow(
      expect.objectContaining({ code: "invalid-object-type" }),
    );
  });
});
