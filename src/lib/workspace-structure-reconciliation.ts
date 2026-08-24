type PersistedStructureRecord = {
  readonly id: string;
  readonly ownership: string;
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
  const requiredStructures = currentRegistry.filter(isRequiredStructure);
  const requiredIds = new Set(
    requiredStructures.map((structure) => structure.id),
  );

  return [
    ...requiredStructures,
    ...storedRegistry.filter((structure) => !requiredIds.has(structure.id)),
  ];
}

export { reconcileRequiredStructures };
