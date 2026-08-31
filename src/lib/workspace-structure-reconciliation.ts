type PersistedStructureRecord = {
  readonly id: string;
  readonly ownership: string;
  readonly propertyDefinitions?: readonly { readonly id: string }[];
};

function isRequiredStructure(structure: PersistedStructureRecord): boolean {
  return (
    structure.ownership === "built-in" ||
    structure.ownership === "reserved"
  );
}

function reconcileRequiredStructures<T extends PersistedStructureRecord>(
  currentRegistry: readonly T[],
  storedRegistry: readonly T[],
): readonly T[] {
  const storedById = new Map(
    storedRegistry.map((structure) => [structure.id, structure]),
  );
  const requiredStructures = currentRegistry
    .filter(isRequiredStructure)
    .map((structure) => {
      const stored = storedById.get(structure.id);
      if (!structure.propertyDefinitions || !stored?.propertyDefinitions) {
        return structure;
      }
      const currentIds = new Set(
        structure.propertyDefinitions.map((definition) => definition.id),
      );
      const storedOnlyDefinitions = stored.propertyDefinitions.filter(
        (definition) => !currentIds.has(definition.id),
      );
      return storedOnlyDefinitions.length === 0
        ? structure
        : ({
            ...structure,
            propertyDefinitions: [
              ...structure.propertyDefinitions,
              ...storedOnlyDefinitions,
            ],
          } as T);
    });
  const requiredIds = new Set(
    requiredStructures.map((structure) => structure.id),
  );

  return [
    ...requiredStructures,
    ...storedRegistry.filter((structure) => !requiredIds.has(structure.id)),
  ];
}

export { reconcileRequiredStructures };
