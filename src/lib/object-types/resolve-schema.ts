import type {
  ObjectTypeDocument,
  PropertyDefinition,
} from "@/lib/object-types/object-type";

export const MAX_SCHEMA_DEPTH = 20;

type SchemaResolutionErrorCode =
  | "unknown-type"
  | "self-parent"
  | "cycle"
  | "missing-parent"
  | "duplicate-key"
  | "duplicate-property-id"
  | "depth-exceeded";

type SchemaResolutionError = {
  code: SchemaResolutionErrorCode;
  typeId: string;
  relatedTypeId?: string;
};

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: SchemaResolutionError };

export type EffectivePropertyDefinition = {
  propertyId: string;
  originTypeId: string;
  key: string;
  definition: PropertyDefinition;
};

type TypesById = Readonly<Record<string, ObjectTypeDocument>>;

function failure(
  code: SchemaResolutionErrorCode,
  typeId: string,
  relatedTypeId?: string,
): Result<never> {
  return {
    ok: false,
    error: { code, typeId, ...(relatedTypeId && { relatedTypeId }) },
  };
}

function resolveTypeChain(
  typesById: TypesById,
  typeId: string,
): Result<ReadonlyArray<readonly [string, ObjectTypeDocument]>> {
  const chain: Array<readonly [string, ObjectTypeDocument]> = [];
  const visited = new Set<string>();
  let currentTypeId = typeId;

  while (true) {
    const type = typesById[currentTypeId];
    if (!type) {
      return chain.length === 0
        ? failure("unknown-type", currentTypeId)
        : failure("missing-parent", typeId, currentTypeId);
    }
    if (visited.has(currentTypeId)) {
      return failure("cycle", typeId, currentTypeId);
    }
    if (chain.length === MAX_SCHEMA_DEPTH) {
      return failure("depth-exceeded", typeId);
    }

    visited.add(currentTypeId);
    chain.push([currentTypeId, type]);

    if (type.parentTypeId === null) {
      return { ok: true, value: chain.reverse() };
    }
    if (type.parentTypeId === currentTypeId) {
      return failure("self-parent", currentTypeId);
    }
    currentTypeId = type.parentTypeId;
  }
}

export function resolveEffectiveSchema(
  typesById: TypesById,
  typeId: string,
): Result<ReadonlyArray<EffectivePropertyDefinition>> {
  const chain = resolveTypeChain(typesById, typeId);
  if (!chain.ok) {
    return chain;
  }

  const properties: EffectivePropertyDefinition[] = [];
  const propertyIds = new Set<string>();
  const keys = new Set<string>();
  for (const [originTypeId, type] of chain.value) {
    for (const [propertyId, definition] of Object.entries(
      type.propertyDefinitions,
    )) {
      if (propertyIds.has(propertyId)) {
        return failure("duplicate-property-id", originTypeId, propertyId);
      }
      if (keys.has(definition.key)) {
        return failure("duplicate-key", originTypeId, definition.key);
      }
      propertyIds.add(propertyId);
      keys.add(definition.key);
      properties.push({
        propertyId,
        originTypeId,
        key: definition.key,
        definition,
      });
    }
  }

  return { ok: true, value: properties };
}

/** Validates a proposed parent relationship without changing the input map. */
export function validateParentChange(
  typesById: TypesById,
  typeId: string,
  newParentId: string | null,
): Result<void> {
  if (!typesById[typeId]) {
    return failure("unknown-type", typeId);
  }
  if (newParentId === null) {
    return { ok: true, value: undefined };
  }
  if (newParentId === typeId) {
    return failure("self-parent", typeId);
  }

  const visited = new Set<string>();
  let currentTypeId: string | null = newParentId;
  for (let depth = 0; currentTypeId !== null; depth += 1) {
    if (depth === MAX_SCHEMA_DEPTH) {
      return failure("depth-exceeded", typeId);
    }
    if (currentTypeId === typeId || visited.has(currentTypeId)) {
      return failure("cycle", typeId, currentTypeId);
    }

    const currentType: ObjectTypeDocument | undefined =
      typesById[currentTypeId];
    if (!currentType) {
      return failure("missing-parent", typeId, currentTypeId);
    }
    visited.add(currentTypeId);
    currentTypeId = currentType.parentTypeId;
  }

  return { ok: true, value: undefined };
}
