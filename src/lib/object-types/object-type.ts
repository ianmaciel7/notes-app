const objectTypeValueTypes = [
  "text",
  "richText",
  "number",
  "boolean",
  "date",
  "dateTime",
  "select",
  "multiSelect",
  "reference",
  "relation",
  "url",
  "file",
  "computed",
] as const;

type ObjectTypeValueType = (typeof objectTypeValueTypes)[number];

export type PropertyDefinition = {
  key: string;
  name: string;
  valueType: ObjectTypeValueType;
  required: boolean;
};

/**
 * A persisted Object Type document. Timestamp values intentionally remain
 * generic so this domain module does not depend on a specific database SDK.
 */
export type ObjectTypeDocument<TTimestamp = unknown> = {
  id: string;
  name: string;
  pluralName: string;
  description?: string;
  parentTypeId: string | null;
  schemaVersion: number;
  stateVersion: number;
  propertyDefinitions: Record<string, PropertyDefinition>;
  createdAt: TTimestamp;
  updatedAt: TTimestamp;
};

export class ObjectTypeParseError extends Error {
  readonly code = "invalid-object-type" as const;

  constructor(message: string) {
    super(message);
    this.name = "ObjectTypeParseError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

function hasValidPropertyDefinition(
  value: unknown,
): value is PropertyDefinition {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.key === "string" &&
    typeof value.name === "string" &&
    typeof value.required === "boolean" &&
    objectTypeValueTypes.some((valueType) => valueType === value.valueType)
  );
}

function parsePropertyDefinitions(
  value: unknown,
): Record<string, PropertyDefinition> {
  if (!isRecord(value)) {
    throw new ObjectTypeParseError("propertyDefinitions must be a map.");
  }

  const definitions: Record<string, PropertyDefinition> = {};
  for (const [propertyId, definition] of Object.entries(value)) {
    if (!hasValidPropertyDefinition(definition)) {
      throw new ObjectTypeParseError(
        `propertyDefinitions.${propertyId} has an invalid shape.`,
      );
    }
    definitions[propertyId] = {
      key: definition.key,
      name: definition.name,
      valueType: definition.valueType,
      required: definition.required,
    };
  }

  return definitions;
}

/** Parses an untrusted persisted Object Type document without SDK dependencies. */
export function parseObjectType(id: string, data: unknown): ObjectTypeDocument {
  if (typeof id !== "string" || id.length === 0 || !isRecord(data)) {
    throw new ObjectTypeParseError(
      "Object Type document has an invalid shape.",
    );
  }

  const {
    name,
    pluralName,
    description,
    parentTypeId,
    schemaVersion,
    stateVersion,
    propertyDefinitions,
    createdAt,
    updatedAt,
  } = data;

  if (
    typeof name !== "string" ||
    typeof pluralName !== "string" ||
    (description !== undefined && typeof description !== "string") ||
    (parentTypeId !== null && typeof parentTypeId !== "string") ||
    !isInteger(schemaVersion) ||
    !isInteger(stateVersion) ||
    createdAt === undefined ||
    createdAt === null ||
    updatedAt === undefined ||
    updatedAt === null
  ) {
    throw new ObjectTypeParseError(
      "Object Type document has an invalid shape.",
    );
  }

  return {
    id,
    name,
    pluralName,
    ...(description !== undefined && { description }),
    parentTypeId,
    schemaVersion,
    stateVersion,
    propertyDefinitions: parsePropertyDefinitions(propertyDefinitions),
    createdAt,
    updatedAt,
  };
}
