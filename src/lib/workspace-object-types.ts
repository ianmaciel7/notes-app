export type StructureId = string;

export type StructureOwnership = "built-in" | "custom" | "legacy" | "reserved";

export type StructureLifecycleKind =
  | "document"
  | "file"
  | "query"
  | "quote"
  | "table"
  | "tag"
  | "task"
  | "url";

export type ObjectIconName =
  | "ai-chat"
  | "archive"
  | "area"
  | "atomic-note"
  | "audio"
  | "book"
  | "definition"
  | "file"
  | "idea"
  | "image"
  | "media"
  | "meeting"
  | "organization"
  | "page"
  | "pdf"
  | "person"
  | "place"
  | "project"
  | "query"
  | "quote"
  | "table"
  | "tag"
  | "task"
  | "travel"
  | "tweet"
  | "weblink";

export type ObjectIconTone =
  | "amber"
  | "blue"
  | "cyan"
  | "emerald"
  | "gray"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "rose"
  | "sky";

export type PropertyValueType =
  | "title"
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "entity"
  | "label"
  | "richText"
  | "url"
  | "createdAt"
  | "lastUpdatedAt";

export type PropertyLabelOption = {
  readonly id: string;
  readonly name: string;
  readonly color?: string;
};

export type PropertyDefinition = {
  readonly id: string;
  readonly name: string;
  readonly valueType: PropertyValueType;
  readonly writable: boolean;
  readonly multiple: boolean;
  readonly options?: readonly PropertyLabelOption[];
  readonly targetStructureIds?: readonly StructureId[];
};

export type StructurePresentationView = "calendar" | "grid" | "list" | "table";

export type StructurePresentation = {
  readonly defaultView: StructurePresentationView;
  readonly availableViews: readonly StructurePresentationView[];
};

export type WorkspaceStructure = {
  readonly id: StructureId;
  readonly ownership: StructureOwnership;
  readonly singularName: string;
  readonly pluralName: string;
  readonly iconName: ObjectIconName;
  readonly tone: ObjectIconTone;
  readonly lifecycleKind: StructureLifecycleKind;
  readonly propertyDefinitions: readonly PropertyDefinition[];
  readonly collectionIds: readonly string[];
  readonly presentation: StructurePresentation;
};

export type ObjectTypePreset = {
  readonly id: string;
  readonly singularName: string;
  readonly pluralName: string;
  readonly iconName: ObjectIconName;
  readonly tone: ObjectIconTone;
  readonly lifecycleKind: StructureLifecycleKind;
  readonly propertyDefinitions: readonly PropertyDefinition[];
  readonly presentation: StructurePresentation;
};

export type StructureDomainErrorCode =
  | "dependent-collections"
  | "duplicate-id"
  | "duplicate-property-definition-id"
  | "id-collision"
  | "invalid-appearance"
  | "invalid-id"
  | "invalid-lifecycle-kind"
  | "invalid-name"
  | "invalid-presentation"
  | "invalid-property-definition"
  | "invalid-structure"
  | "protected-structure"
  | "structure-in-use"
  | "unknown-preset"
  | "unknown-structure"
  | "unsafe-schema-mutation";

export type StructureDomainError = {
  readonly code: StructureDomainErrorCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
};

export type DomainResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: StructureDomainError };

export type CreateStructureInput = {
  readonly singularName: string;
  readonly pluralName: string;
  readonly iconName: ObjectIconName;
  readonly tone: ObjectIconTone;
  readonly lifecycleKind: StructureLifecycleKind;
  readonly propertyDefinitions?: readonly PropertyDefinition[];
  readonly collectionIds?: readonly string[];
  readonly presentation?: StructurePresentation;
};

type StructureAppearanceUpdate = {
  readonly iconName?: ObjectIconName;
  readonly tone?: ObjectIconTone;
};

type DeleteStructureDependencies = {
  readonly instanceCount?: number;
  readonly dependentCollectionIds?: readonly string[];
};

type ReplaceStructureSchemaOptions = {
  readonly unsafePropertyDefinitionIds?: readonly string[];
};

type LegacyStructureOverrides = Partial<
  Pick<
    WorkspaceStructure,
    "iconName" | "lifecycleKind" | "pluralName" | "singularName" | "tone"
  >
>;

const lifecycleKinds = [
  "document",
  "file",
  "query",
  "quote",
  "table",
  "tag",
  "task",
  "url",
] as const satisfies readonly StructureLifecycleKind[];

export const OBJECT_ICON_NAMES = [
  "ai-chat",
  "archive",
  "area",
  "atomic-note",
  "audio",
  "book",
  "definition",
  "file",
  "idea",
  "image",
  "media",
  "meeting",
  "organization",
  "page",
  "pdf",
  "person",
  "place",
  "project",
  "query",
  "quote",
  "table",
  "tag",
  "task",
  "travel",
  "tweet",
  "weblink",
] as const satisfies readonly ObjectIconName[];

const iconTones = [
  "amber",
  "blue",
  "cyan",
  "emerald",
  "gray",
  "green",
  "orange",
  "purple",
  "red",
  "rose",
  "sky",
] as const satisfies readonly ObjectIconTone[];

const propertyValueTypes = [
  "title",
  "text",
  "number",
  "boolean",
  "date",
  "entity",
  "label",
  "richText",
  "url",
  "createdAt",
  "lastUpdatedAt",
] as const satisfies readonly PropertyValueType[];

const presentationViews = [
  "calendar",
  "grid",
  "list",
  "table",
] as const satisfies readonly StructurePresentationView[];

const defaultPresentation: StructurePresentation = {
  availableViews: ["list"],
  defaultView: "list",
};

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

function ok<T>(value: T): DomainResult<T> {
  return { ok: true, value };
}

function failure(
  code: StructureDomainErrorCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): DomainResult<never> {
  return { error: { code, details, message }, ok: false };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasUniqueNonEmptyStrings(
  values: unknown,
): values is readonly string[] {
  return (
    Array.isArray(values) &&
    values.every(isNonEmptyString) &&
    new Set(values).size === values.length
  );
}

function clonePropertyDefinition(
  definition: PropertyDefinition,
): PropertyDefinition {
  return {
    ...definition,
    ...(definition.options
      ? { options: definition.options.map((option) => ({ ...option })) }
      : {}),
    ...(definition.targetStructureIds
      ? { targetStructureIds: [...definition.targetStructureIds] }
      : {}),
  };
}

function clonePresentation(
  presentation: StructurePresentation,
): StructurePresentation {
  return {
    availableViews: [...presentation.availableViews],
    defaultView: presentation.defaultView,
  };
}

function cloneStructure(structure: WorkspaceStructure): WorkspaceStructure {
  return {
    ...structure,
    collectionIds: [...structure.collectionIds],
    presentation: clonePresentation(structure.presentation),
    propertyDefinitions: structure.propertyDefinitions.map(
      clonePropertyDefinition,
    ),
  };
}

function defineStructure(
  id: string,
  singularName: string,
  pluralName: string,
  iconName: ObjectIconName,
  tone: ObjectIconTone,
  lifecycleKind: StructureLifecycleKind,
  ownership: StructureOwnership,
): WorkspaceStructure {
  return deepFreeze({
    collectionIds: [],
    iconName,
    id,
    lifecycleKind,
    ownership,
    pluralName,
    presentation: clonePresentation(defaultPresentation),
    propertyDefinitions: [],
    singularName,
    tone,
  });
}

export const BUILT_IN_STRUCTURES = deepFreeze([
  defineStructure(
    "page",
    "Page",
    "Pages",
    "page",
    "blue",
    "document",
    "built-in",
  ),
  defineStructure(
    "table",
    "Table",
    "Tables",
    "table",
    "blue",
    "table",
    "built-in",
  ),
  defineStructure(
    "task",
    "Task",
    "Tasks",
    "task",
    "orange",
    "task",
    "built-in",
  ),
  defineStructure(
    "weblink",
    "Weblink",
    "Weblinks",
    "weblink",
    "blue",
    "url",
    "built-in",
  ),
  defineStructure(
    "image",
    "Image",
    "Images",
    "image",
    "red",
    "file",
    "built-in",
  ),
  defineStructure("pdf", "PDF", "PDFs", "pdf", "red", "file", "built-in"),
  defineStructure(
    "audio",
    "Audio",
    "Audio",
    "audio",
    "red",
    "file",
    "built-in",
  ),
  defineStructure("file", "File", "Files", "file", "red", "file", "built-in"),
  defineStructure(
    "tweet",
    "Tweet",
    "Tweets",
    "tweet",
    "blue",
    "url",
    "built-in",
  ),
  defineStructure(
    "ai-chat",
    "AI chat",
    "AI chats",
    "ai-chat",
    "purple",
    "document",
    "built-in",
  ),
  defineStructure("tag", "Tag", "Tags", "tag", "orange", "tag", "built-in"),
  defineStructure(
    "query",
    "Query",
    "Queries",
    "query",
    "green",
    "query",
    "built-in",
  ),
] satisfies readonly WorkspaceStructure[]);

export const RESERVED_STRUCTURES = deepFreeze([
  defineStructure(
    "archive",
    "Archive",
    "Archive",
    "archive",
    "gray",
    "document",
    "reserved",
  ),
] satisfies readonly WorkspaceStructure[]);

function definePreset(
  id: string,
  singularName: string,
  pluralName: string,
  iconName: ObjectIconName,
  tone: ObjectIconTone,
  lifecycleKind: StructureLifecycleKind = "document",
): ObjectTypePreset {
  return deepFreeze({
    iconName,
    id,
    lifecycleKind,
    pluralName,
    presentation: clonePresentation(defaultPresentation),
    propertyDefinitions: [],
    singularName,
    tone,
  });
}

export const OBJECT_TYPE_PRESETS = deepFreeze([
  definePreset("book", "Book", "Books", "book", "purple"),
  definePreset("person", "Person", "People", "person", "orange"),
  definePreset("area", "Area", "Areas", "area", "blue"),
  definePreset("meeting", "Meeting", "Meetings", "meeting", "red"),
  definePreset(
    "definition",
    "Definition",
    "Definitions",
    "definition",
    "purple",
  ),
  definePreset("idea", "Idea", "Ideas", "idea", "amber"),
  definePreset("place", "Place", "Places", "place", "emerald"),
  definePreset("project", "Project", "Projects", "project", "emerald"),
  definePreset(
    "organization",
    "Organization",
    "Organizations",
    "organization",
    "red",
  ),
  definePreset("media", "Media", "Media", "media", "cyan"),
  definePreset("travel", "Travel", "Travel", "travel", "purple"),
  definePreset("quote", "Quote", "Quotes", "quote", "rose", "quote"),
  definePreset(
    "atomic-note",
    "Atomic note",
    "Atomic notes",
    "atomic-note",
    "amber",
  ),
] satisfies readonly ObjectTypePreset[]);

function validatePresentation(
  value: unknown,
): DomainResult<StructurePresentation> {
  if (!isRecord(value)) {
    return failure(
      "invalid-presentation",
      "Structure presentation must be an object.",
    );
  }
  const { availableViews, defaultView } = value;
  if (
    !Array.isArray(availableViews) ||
    availableViews.length === 0 ||
    !availableViews.every(
      (view): view is StructurePresentationView =>
        typeof view === "string" &&
        presentationViews.includes(view as StructurePresentationView),
    ) ||
    new Set(availableViews).size !== availableViews.length ||
    typeof defaultView !== "string" ||
    !presentationViews.includes(defaultView as StructurePresentationView) ||
    !availableViews.includes(defaultView as StructurePresentationView)
  ) {
    return failure(
      "invalid-presentation",
      "Structure presentation must contain unique supported views and include its default view.",
    );
  }
  return ok({
    availableViews: [...availableViews],
    defaultView: defaultView as StructurePresentationView,
  });
}

function validateLabelOptions(
  value: unknown,
): value is readonly PropertyLabelOption[] {
  if (!Array.isArray(value)) return false;
  const ids = new Set<string>();
  for (const option of value) {
    if (
      !isRecord(option) ||
      !isNonEmptyString(option.id) ||
      !isNonEmptyString(option.name) ||
      (option.color !== undefined && typeof option.color !== "string") ||
      ids.has(option.id)
    ) {
      return false;
    }
    ids.add(option.id);
  }
  return true;
}

export function validatePropertyDefinition(
  value: unknown,
): DomainResult<PropertyDefinition> {
  if (!isRecord(value)) {
    return failure(
      "invalid-property-definition",
      "Property definition must be an object.",
    );
  }
  const {
    id,
    multiple,
    name,
    options,
    targetStructureIds,
    valueType,
    writable,
  } = value;
  if (
    !isNonEmptyString(id) ||
    !isNonEmptyString(name) ||
    typeof valueType !== "string" ||
    !propertyValueTypes.includes(valueType as PropertyValueType) ||
    typeof writable !== "boolean" ||
    typeof multiple !== "boolean"
  ) {
    return failure(
      "invalid-property-definition",
      "Property definitions require an id, name, supported value type, writability, and multiplicity.",
    );
  }
  if (options !== undefined && !validateLabelOptions(options)) {
    return failure(
      "invalid-property-definition",
      "Label options must contain unique stable ids and non-empty names.",
    );
  }
  if (
    targetStructureIds !== undefined &&
    !hasUniqueNonEmptyStrings(targetStructureIds)
  ) {
    return failure(
      "invalid-property-definition",
      "Property target Structure ids must be unique non-empty strings.",
    );
  }
  if (options !== undefined && valueType !== "label") {
    return failure(
      "invalid-property-definition",
      "Only label properties may define options.",
    );
  }
  if (targetStructureIds !== undefined && valueType !== "entity") {
    return failure(
      "invalid-property-definition",
      "Only entity properties may constrain target Structures.",
    );
  }
  return ok({
    id: id.trim(),
    multiple,
    name: name.trim(),
    ...(options ? { options: options.map((option) => ({ ...option })) } : {}),
    ...(targetStructureIds
      ? { targetStructureIds: [...targetStructureIds] }
      : {}),
    valueType: valueType as PropertyValueType,
    writable,
  });
}

export function validateWorkspaceStructure(
  value: unknown,
): DomainResult<WorkspaceStructure> {
  if (!isRecord(value))
    return failure("invalid-structure", "Structure must be an object.");
  const {
    collectionIds,
    iconName,
    id,
    lifecycleKind,
    ownership,
    pluralName,
    presentation,
    propertyDefinitions,
    singularName,
    tone,
  } = value;
  if (!isNonEmptyString(id))
    return failure("invalid-id", "Structure id must not be empty.");
  if (!isNonEmptyString(singularName) || !isNonEmptyString(pluralName)) {
    return failure(
      "invalid-name",
      "Structure singular and plural names must not be empty.",
    );
  }
  if (
    typeof ownership !== "string" ||
    !(["built-in", "custom", "legacy", "reserved"] as const).includes(
      ownership as StructureOwnership,
    )
  ) {
    return failure(
      "invalid-structure",
      "Structure ownership is not supported.",
    );
  }
  if (
    typeof iconName !== "string" ||
    !OBJECT_ICON_NAMES.includes(iconName as ObjectIconName)
  ) {
    return failure(
      "invalid-appearance",
      "Structure icon name is not supported.",
    );
  }
  if (typeof tone !== "string" || !iconTones.includes(tone as ObjectIconTone)) {
    return failure("invalid-appearance", "Structure tone is not supported.");
  }
  if (
    typeof lifecycleKind !== "string" ||
    !lifecycleKinds.includes(lifecycleKind as StructureLifecycleKind)
  ) {
    return failure(
      "invalid-lifecycle-kind",
      "Structure lifecycle kind is not supported.",
    );
  }
  if (!hasUniqueNonEmptyStrings(collectionIds)) {
    return failure(
      "invalid-structure",
      "Structure collection ids must be unique non-empty strings.",
    );
  }
  if (!Array.isArray(propertyDefinitions)) {
    return failure(
      "invalid-property-definition",
      "Structure property definitions must be an array.",
    );
  }
  const validatedDefinitions: PropertyDefinition[] = [];
  for (const definition of propertyDefinitions) {
    const result = validatePropertyDefinition(definition);
    if (!result.ok) return result;
    validatedDefinitions.push(result.value);
  }
  const definitionIds = validatedDefinitions.map((definition) => definition.id);
  if (new Set(definitionIds).size !== definitionIds.length) {
    return failure(
      "duplicate-property-definition-id",
      "Property definition ids must be unique within a Structure.",
    );
  }
  const presentationResult = validatePresentation(presentation);
  if (!presentationResult.ok) return presentationResult;
  return ok({
    collectionIds: [...collectionIds],
    iconName: iconName as ObjectIconName,
    id: id.trim(),
    lifecycleKind: lifecycleKind as StructureLifecycleKind,
    ownership: ownership as StructureOwnership,
    pluralName: pluralName.trim(),
    presentation: presentationResult.value,
    propertyDefinitions: validatedDefinitions,
    singularName: singularName.trim(),
    tone: tone as ObjectIconTone,
  });
}

export function validateStructureRegistry(
  value: unknown,
): DomainResult<readonly WorkspaceStructure[]> {
  if (!Array.isArray(value))
    return failure("invalid-structure", "Structure registry must be an array.");
  const structures: WorkspaceStructure[] = [];
  for (const entry of value) {
    const result = validateWorkspaceStructure(entry);
    if (!result.ok) return result;
    structures.push(result.value);
  }
  const ids = structures.map((structure) => structure.id);
  if (new Set(ids).size !== ids.length) {
    return failure(
      "duplicate-id",
      "Structure ids must be unique within the registry.",
    );
  }
  return ok(structures);
}

function findStructureIndex(
  registry: readonly WorkspaceStructure[],
  id: StructureId,
): DomainResult<number> {
  const index = registry.findIndex((structure) => structure.id === id);
  return index === -1
    ? failure("unknown-structure", `Unknown Structure: ${id}`, { id })
    : ok(index);
}

function replaceAt(
  registry: readonly WorkspaceStructure[],
  index: number,
  structure: WorkspaceStructure,
): readonly WorkspaceStructure[] {
  return registry.map((current, currentIndex) =>
    currentIndex === index ? structure : current,
  );
}

function ensureEditable(
  structure: WorkspaceStructure,
): DomainResult<WorkspaceStructure> {
  return structure.ownership === "custom" || structure.ownership === "legacy"
    ? ok(structure)
    : failure(
        "protected-structure",
        `The ${structure.ownership} Structure ${structure.id} cannot be edited.`,
        { id: structure.id, ownership: structure.ownership },
      );
}

export function createCustomStructure(
  registry: readonly WorkspaceStructure[],
  input: CreateStructureInput,
  idFactory: () => string = () => globalThis.crypto.randomUUID(),
): DomainResult<readonly WorkspaceStructure[]> {
  const id = idFactory();
  if (!isNonEmptyString(id))
    return failure("invalid-id", "Generated Structure id must not be empty.");
  if (registry.some((structure) => structure.id === id)) {
    return failure(
      "id-collision",
      `Generated Structure id already exists: ${id}`,
      { id },
    );
  }
  const candidate: WorkspaceStructure = {
    collectionIds: [...(input.collectionIds ?? [])],
    iconName: input.iconName,
    id,
    lifecycleKind: input.lifecycleKind,
    ownership: "custom",
    pluralName: input.pluralName,
    presentation: clonePresentation(input.presentation ?? defaultPresentation),
    propertyDefinitions: (input.propertyDefinitions ?? []).map(
      clonePropertyDefinition,
    ),
    singularName: input.singularName,
    tone: input.tone,
  };
  const validation = validateWorkspaceStructure(candidate);
  if (!validation.ok) return validation;
  return ok([...registry, validation.value]);
}

export function renameStructure(
  registry: readonly WorkspaceStructure[],
  id: StructureId,
  singularName: string,
  pluralName: string,
): DomainResult<readonly WorkspaceStructure[]> {
  const indexResult = findStructureIndex(registry, id);
  if (!indexResult.ok) return indexResult;
  const editable = ensureEditable(registry[indexResult.value]);
  if (!editable.ok) return editable;
  if (!isNonEmptyString(singularName) || !isNonEmptyString(pluralName)) {
    return failure(
      "invalid-name",
      "Structure singular and plural names must not be empty.",
    );
  }
  return ok(
    replaceAt(registry, indexResult.value, {
      ...editable.value,
      pluralName: pluralName.trim(),
      singularName: singularName.trim(),
    }),
  );
}

export function updateStructureAppearance(
  registry: readonly WorkspaceStructure[],
  id: StructureId,
  update: StructureAppearanceUpdate,
): DomainResult<readonly WorkspaceStructure[]> {
  const indexResult = findStructureIndex(registry, id);
  if (!indexResult.ok) return indexResult;
  const editable = ensureEditable(registry[indexResult.value]);
  if (!editable.ok) return editable;
  const iconName = update.iconName ?? editable.value.iconName;
  const tone = update.tone ?? editable.value.tone;
  if (!OBJECT_ICON_NAMES.includes(iconName) || !iconTones.includes(tone)) {
    return failure(
      "invalid-appearance",
      "Structure appearance is not supported.",
    );
  }
  return ok(
    replaceAt(registry, indexResult.value, {
      ...editable.value,
      iconName,
      tone,
    }),
  );
}

function propertyDefinitionChanged(
  before: PropertyDefinition,
  after: PropertyDefinition,
): boolean {
  return JSON.stringify(before) !== JSON.stringify(after);
}

export function replaceStructureSchema(
  registry: readonly WorkspaceStructure[],
  id: StructureId,
  propertyDefinitions: readonly PropertyDefinition[],
  options: ReplaceStructureSchemaOptions = {},
): DomainResult<readonly WorkspaceStructure[]> {
  const indexResult = findStructureIndex(registry, id);
  if (!indexResult.ok) return indexResult;
  const editable = ensureEditable(registry[indexResult.value]);
  if (!editable.ok) return editable;
  const validation = validateWorkspaceStructure({
    ...editable.value,
    propertyDefinitions,
  });
  if (!validation.ok) return validation;
  const unsafeIds = new Set(options.unsafePropertyDefinitionIds ?? []);
  const nextById = new Map(
    validation.value.propertyDefinitions.map((definition) => [
      definition.id,
      definition,
    ]),
  );
  const unsafeMutation = editable.value.propertyDefinitions.find(
    (definition) => {
      if (!unsafeIds.has(definition.id)) return false;
      const replacement = nextById.get(definition.id);
      return !replacement || propertyDefinitionChanged(definition, replacement);
    },
  );
  if (unsafeMutation) {
    return failure(
      "unsafe-schema-mutation",
      `Property ${unsafeMutation.id} cannot be changed while stored values depend on it.`,
      { propertyDefinitionId: unsafeMutation.id },
    );
  }
  return ok(replaceAt(registry, indexResult.value, validation.value));
}

export function deleteStructure(
  registry: readonly WorkspaceStructure[],
  id: StructureId,
  dependencies: DeleteStructureDependencies = {},
): DomainResult<readonly WorkspaceStructure[]> {
  const indexResult = findStructureIndex(registry, id);
  if (!indexResult.ok) return indexResult;
  const editable = ensureEditable(registry[indexResult.value]);
  if (!editable.ok) return editable;
  const instanceCount = dependencies.instanceCount ?? 0;
  if (!Number.isSafeInteger(instanceCount) || instanceCount < 0) {
    return failure(
      "structure-in-use",
      "Structure instance count must be a non-negative integer.",
    );
  }
  if (instanceCount > 0) {
    return failure(
      "structure-in-use",
      `Structure ${id} still has object instances.`,
      {
        id,
        instanceCount,
      },
    );
  }
  const dependentCollectionIds = dependencies.dependentCollectionIds ?? [];
  if (dependentCollectionIds.length > 0) {
    return failure(
      "dependent-collections",
      `Structure ${id} still has dependent collections.`,
      {
        dependentCollectionIds: [...dependentCollectionIds],
        id,
      },
    );
  }
  return ok(registry.filter((_, index) => index !== indexResult.value));
}

export function instantiateObjectTypePreset(
  registry: readonly WorkspaceStructure[],
  presetId: string,
  idFactory?: () => string,
): DomainResult<readonly WorkspaceStructure[]> {
  const preset = OBJECT_TYPE_PRESETS.find(
    (candidate) => candidate.id === presetId,
  );
  if (!preset)
    return failure(
      "unknown-preset",
      `Unknown object type preset: ${presetId}`,
      { presetId },
    );
  return createCustomStructure(
    registry,
    {
      iconName: preset.iconName,
      lifecycleKind: preset.lifecycleKind,
      pluralName: preset.pluralName,
      presentation: clonePresentation(preset.presentation),
      propertyDefinitions: preset.propertyDefinitions.map(
        clonePropertyDefinition,
      ),
      singularName: preset.singularName,
      tone: preset.tone,
    },
    idFactory,
  );
}

export function createLegacyStructureDefinition(
  id: StructureId,
  overrides: LegacyStructureOverrides = {},
): DomainResult<WorkspaceStructure> {
  const canonical = [...BUILT_IN_STRUCTURES, ...RESERVED_STRUCTURES].find(
    (structure) => structure.id === id,
  );
  if (canonical) return ok(cloneStructure(canonical));
  const preset = OBJECT_TYPE_PRESETS.find((candidate) => candidate.id === id);
  if (!preset) {
    return failure(
      "unknown-structure",
      `No legacy Structure definition exists for ${id}.`,
      { id },
    );
  }
  const candidate: WorkspaceStructure = {
    collectionIds: [],
    iconName: overrides.iconName ?? preset.iconName,
    id,
    lifecycleKind: overrides.lifecycleKind ?? preset.lifecycleKind,
    ownership: "legacy",
    pluralName: overrides.pluralName ?? preset.pluralName,
    presentation: clonePresentation(preset.presentation),
    propertyDefinitions: preset.propertyDefinitions.map(
      clonePropertyDefinition,
    ),
    singularName: overrides.singularName ?? preset.singularName,
    tone: overrides.tone ?? preset.tone,
  };
  return validateWorkspaceStructure(candidate);
}

export function createLegacyStructureDefinitions(
  ids: readonly StructureId[],
): DomainResult<readonly WorkspaceStructure[]> {
  const definitions: WorkspaceStructure[] = [];
  for (const id of ids) {
    if (definitions.some((definition) => definition.id === id)) continue;
    const result = createLegacyStructureDefinition(id);
    if (!result.ok) return result;
    definitions.push(result.value);
  }
  return ok(definitions);
}

export function createInitialStructureRegistry(): readonly WorkspaceStructure[] {
  const legacy = createLegacyStructureDefinitions(
    OBJECT_TYPE_PRESETS.map((preset) => preset.id),
  );
  if (!legacy.ok) {
    throw new Error(legacy.error.message);
  }
  return [
    ...BUILT_IN_STRUCTURES.map(cloneStructure),
    ...RESERVED_STRUCTURES.map(cloneStructure),
    ...legacy.value.map(cloneStructure),
  ];
}

export function selectStructureById(
  registry: readonly WorkspaceStructure[],
  id: StructureId,
): WorkspaceStructure | null {
  return registry.find((structure) => structure.id === id) ?? null;
}

export function selectBuiltInStructures(
  registry: readonly WorkspaceStructure[],
): readonly WorkspaceStructure[] {
  return registry.filter((structure) => structure.ownership === "built-in");
}

export function selectCustomStructures(
  registry: readonly WorkspaceStructure[],
): readonly WorkspaceStructure[] {
  return registry.filter(
    (structure) =>
      structure.ownership === "custom" || structure.ownership === "legacy",
  );
}

export function selectCreatableStructures(
  registry: readonly WorkspaceStructure[],
): readonly WorkspaceStructure[] {
  return registry.filter((structure) => structure.ownership !== "reserved");
}

export function selectReservedStructures(
  registry: readonly WorkspaceStructure[],
): readonly WorkspaceStructure[] {
  return registry.filter((structure) => structure.ownership === "reserved");
}
