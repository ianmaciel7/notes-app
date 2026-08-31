export type StructureId = string;
export type TagId = string;
export type CollectionId = string;

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
  | "media"
  | "createdAt"
  | "lastUpdatedAt";

export type PropertyLabelOption = {
  readonly id: string;
  readonly name: string;
  readonly color?: string;
};

export type PropertyDefinitionOwnership = "default" | "normal" | "system";

export type NumberPresentationColor =
  | "blue"
  | "gray"
  | "green"
  | "orange"
  | "purple"
  | "red";

export type NumberPresentation =
  | {
      readonly type: "number";
      readonly fixedDecimals?: number;
    }
  | {
      readonly type: "percent";
      readonly fixedDecimals?: number;
    }
  | {
      readonly type: "currency";
      readonly currency: string;
      readonly fixedDecimals?: number;
    }
  | {
      readonly type: "progress";
      readonly color: NumberPresentationColor;
      readonly fixedDecimals?: number;
      readonly steps: number;
    };

export type TableCellNumberPresentation =
  | NumberPresentation
  | { readonly type: "none" }
  | { readonly type: "text" };

export type PropertyDefinition = {
  readonly id: string;
  readonly name: string;
  readonly ownership: PropertyDefinitionOwnership;
  readonly valueType: PropertyValueType;
  readonly writable: boolean;
  readonly multiple: boolean;
  readonly description?: string;
  readonly iconName?: ObjectIconName;
  readonly fixedTargetObjectIds?: readonly string[];
  readonly inversePropertyDefinitionId?: string;
  readonly numberPresentation?: NumberPresentation;
  readonly options?: readonly PropertyLabelOption[];
  readonly targetStructureIds?: readonly StructureId[];
};

export type StructurePresentationView = "gallery" | "list" | "table" | "wall";

export type StructurePresentation = {
  readonly defaultView: StructurePresentationView;
  readonly availableViews: readonly StructurePresentationView[];
  readonly smallCardVisiblePropertyIds?: readonly string[];
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
  readonly collectionIds: readonly CollectionId[];
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
  | "invalid-property-value"
  | "invalid-structure"
  | "protected-structure"
  | "read-only-property"
  | "structure-in-use"
  | "unknown-property"
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

type StructurePresentationUpdate = {
  readonly presentation: StructurePresentation;
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
  "media",
  "createdAt",
  "lastUpdatedAt",
] as const satisfies readonly PropertyValueType[];

const propertyDefinitionOwnerships = [
  "default",
  "normal",
  "system",
] as const satisfies readonly PropertyDefinitionOwnership[];

const numberPresentationColors = [
  "blue",
  "gray",
  "green",
  "orange",
  "purple",
  "red",
] as const satisfies readonly NumberPresentationColor[];

const presentationViews = [
  "gallery",
  "list",
  "table",
  "wall",
] as const satisfies readonly StructurePresentationView[];

const defaultPresentation: StructurePresentation = {
  availableViews: ["list"],
  defaultView: "list",
};

export const DEFAULT_PROPERTY_DEFINITIONS = deepFreeze([
  {
    id: "title",
    multiple: false,
    name: "Title",
    ownership: "default",
    valueType: "title",
    writable: true,
  },
  {
    id: "aliases",
    multiple: true,
    name: "Aliases",
    ownership: "default",
    valueType: "text",
    writable: true,
  },
  {
    id: "description",
    multiple: false,
    name: "Description",
    ownership: "default",
    valueType: "text",
    writable: true,
  },
  {
    id: "icon",
    multiple: false,
    name: "Icon",
    ownership: "default",
    valueType: "media",
    writable: true,
  },
  {
    id: "cover",
    multiple: false,
    name: "Cover",
    ownership: "default",
    valueType: "media",
    writable: true,
  },
  {
    id: "createdAt",
    multiple: false,
    name: "Created at",
    ownership: "system",
    valueType: "createdAt",
    writable: false,
  },
  {
    id: "lastUpdatedAt",
    multiple: false,
    name: "Last updated at",
    ownership: "system",
    valueType: "lastUpdatedAt",
    writable: false,
  },
  {
    id: "tags",
    multiple: true,
    name: "Tags",
    ownership: "default",
    targetStructureIds: ["tag"],
    valueType: "entity",
    writable: true,
  },
] satisfies readonly PropertyDefinition[]);

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
    ...(definition.description !== undefined
      ? { description: definition.description }
      : {}),
    ...(definition.iconName !== undefined
      ? { iconName: definition.iconName }
      : {}),
    ...(definition.fixedTargetObjectIds
      ? { fixedTargetObjectIds: [...definition.fixedTargetObjectIds] }
      : {}),
    ...(definition.inversePropertyDefinitionId !== undefined
      ? {
          inversePropertyDefinitionId: definition.inversePropertyDefinitionId,
        }
      : {}),
    ...(definition.valueType === "number"
      ? {
          numberPresentation: cloneNumberPresentation(
            definition.numberPresentation,
          ),
        }
      : {}),
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
    ...(presentation.smallCardVisiblePropertyIds
      ? {
          smallCardVisiblePropertyIds: [
            ...presentation.smallCardVisiblePropertyIds,
          ],
        }
      : {}),
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

function mergeDefaultPropertyDefinitions(
  propertyDefinitions: readonly PropertyDefinition[] = [],
): readonly PropertyDefinition[] {
  const explicitIds = new Set(
    propertyDefinitions.map((definition) => definition.id),
  );
  return [
    ...DEFAULT_PROPERTY_DEFINITIONS.filter(
      (definition) => !explicitIds.has(definition.id),
    ).map(clonePropertyDefinition),
    ...propertyDefinitions.map(clonePropertyDefinition),
  ];
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
    propertyDefinitions: DEFAULT_PROPERTY_DEFINITIONS.map(
      clonePropertyDefinition,
    ),
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
    propertyDefinitions: DEFAULT_PROPERTY_DEFINITIONS.map(
      clonePropertyDefinition,
    ),
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
  const { availableViews, defaultView, smallCardVisiblePropertyIds } = value;
  const normalizedViews = Array.isArray(availableViews)
    ? availableViews.map(normalizePresentationView)
    : [];
  const normalizedDefaultView = normalizePresentationView(defaultView);
  const validSmallCardProperties =
    smallCardVisiblePropertyIds === undefined ||
    hasUniqueNonEmptyStrings(smallCardVisiblePropertyIds);
  if (
    !Array.isArray(availableViews) ||
    availableViews.length === 0 ||
    normalizedViews.some((view) => view === null) ||
    new Set(normalizedViews).size !== normalizedViews.length ||
    normalizedDefaultView === null ||
    !normalizedViews.includes(normalizedDefaultView) ||
    !validSmallCardProperties
  ) {
    return failure(
      "invalid-presentation",
      "Structure presentation must contain unique supported views and include its default view.",
    );
  }
  return ok({
    availableViews: normalizedViews as StructurePresentationView[],
    defaultView: normalizedDefaultView,
    ...(smallCardVisiblePropertyIds === undefined
      ? {}
      : {
          smallCardVisiblePropertyIds: [
            ...(smallCardVisiblePropertyIds as readonly string[]),
          ],
        }),
  });
}

function normalizePresentationView(
  value: unknown,
): StructurePresentationView | null {
  if (value === "grid") return "gallery";
  if (value === "calendar") return "list";
  return typeof value === "string" &&
    presentationViews.includes(value as StructurePresentationView)
    ? (value as StructurePresentationView)
    : null;
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

const DEFAULT_NUMBER_PRESENTATION: NumberPresentation = { type: "number" };

function isIntegerInRange(value: unknown, min: number, max: number): boolean {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  );
}

function hasValidFixedDecimals(value: unknown): boolean {
  return value === undefined || isIntegerInRange(value, 0, 6);
}

function isSupportedCurrencyCode(value: unknown): value is string {
  if (typeof value !== "string" || !/^[A-Z]{3}$/.test(value)) return false;
  try {
    new Intl.NumberFormat("en-US", {
      currency: value,
      style: "currency",
    }).format(1);
    return true;
  } catch {
    return false;
  }
}

function isNumberPresentationColor(
  value: unknown,
): value is NumberPresentationColor {
  return (
    typeof value === "string" &&
    numberPresentationColors.includes(value as NumberPresentationColor)
  );
}

export function cloneNumberPresentation(
  presentation: NumberPresentation | undefined,
): NumberPresentation {
  if (!presentation) return { ...DEFAULT_NUMBER_PRESENTATION };
  switch (presentation.type) {
    case "currency":
      return {
        currency: presentation.currency,
        ...(presentation.fixedDecimals === undefined
          ? {}
          : { fixedDecimals: presentation.fixedDecimals }),
        type: "currency",
      };
    case "percent":
      return {
        ...(presentation.fixedDecimals === undefined
          ? {}
          : { fixedDecimals: presentation.fixedDecimals }),
        type: "percent",
      };
    case "progress":
      return {
        color: presentation.color,
        ...(presentation.fixedDecimals === undefined
          ? {}
          : { fixedDecimals: presentation.fixedDecimals }),
        steps: presentation.steps,
        type: "progress",
      };
    default:
      return {
        ...(presentation.fixedDecimals === undefined
          ? {}
          : { fixedDecimals: presentation.fixedDecimals }),
        type: "number",
      };
  }
}

export function validateNumberPresentation(
  value: unknown,
  options: { readonly allowText?: boolean } = {},
): DomainResult<TableCellNumberPresentation> {
  if (!isRecord(value) || typeof value.type !== "string") {
    return invalidNumberPresentation(
      "Number presentation must be an object with a supported type.",
    );
  }
  if (options.allowText) {
    const textPresentation = validateTextNumberPresentation(value.type);
    if (textPresentation) return textPresentation;
  }
  switch (value.type) {
    case "currency":
      return validateCurrencyPresentation(value);
    case "number":
    case "percent":
      return validateDecimalPresentation(value, value.type);
    case "progress":
      return validateProgressPresentation(value);
    default:
      return invalidNumberPresentation(
        "Number presentation contains unsupported formatting settings.",
      );
  }
}

function invalidNumberPresentation(message: string) {
  return failure("invalid-property-definition", message);
}

function fixedDecimalsFrom(value: Record<string, unknown>) {
  return value.fixedDecimals as number | undefined;
}

function validateTextNumberPresentation(
  type: string,
): DomainResult<TableCellNumberPresentation> | null {
  if (type === "none") return ok({ type: "none" });
  if (type === "text") return ok({ type: "text" });
  return null;
}

function validateDecimalPresentation(
  value: Record<string, unknown>,
  type: "number" | "percent",
): DomainResult<TableCellNumberPresentation> {
  if (!hasValidFixedDecimals(value.fixedDecimals)) {
    return invalidNumberPresentation(
      "Number presentation contains unsupported formatting settings.",
    );
  }
  const fixedDecimals = fixedDecimalsFrom(value);
  return ok({
    ...(fixedDecimals === undefined ? {} : { fixedDecimals }),
    type,
  });
}

function validateCurrencyPresentation(
  value: Record<string, unknown>,
): DomainResult<TableCellNumberPresentation> {
  if (!isSupportedCurrencyCode(value.currency)) {
    return invalidNumberPresentation(
      "Number presentation contains unsupported formatting settings.",
    );
  }
  if (!hasValidFixedDecimals(value.fixedDecimals)) {
    return invalidNumberPresentation(
      "Number presentation contains unsupported formatting settings.",
    );
  }
  const fixedDecimals = fixedDecimalsFrom(value);
  return ok({
    currency: value.currency,
    ...(fixedDecimals === undefined ? {} : { fixedDecimals }),
    type: "currency",
  });
}

function validateProgressPresentation(
  value: Record<string, unknown>,
): DomainResult<TableCellNumberPresentation> {
  if (!isIntegerInRange(value.steps, 1, 1000)) {
    return invalidNumberPresentation(
      "Number presentation contains unsupported formatting settings.",
    );
  }
  if (!isNumberPresentationColor(value.color)) {
    return invalidNumberPresentation(
      "Number presentation contains unsupported formatting settings.",
    );
  }
  if (!hasValidFixedDecimals(value.fixedDecimals)) {
    return invalidNumberPresentation(
      "Number presentation contains unsupported formatting settings.",
    );
  }
  const fixedDecimals = fixedDecimalsFrom(value);
  return ok({
    color: value.color,
    ...(fixedDecimals === undefined ? {} : { fixedDecimals }),
    steps: value.steps as number,
    type: "progress",
  });
}

type PropertyDefinitionFields = {
  readonly description: unknown;
  readonly fixedTargetObjectIds: unknown;
  readonly iconName: unknown;
  readonly id: unknown;
  readonly inversePropertyDefinitionId: unknown;
  readonly multiple: unknown;
  readonly name: unknown;
  readonly normalizedOwnership: unknown;
  readonly numberPresentation: unknown;
  readonly options: unknown;
  readonly targetStructureIds: unknown;
  readonly valueType: unknown;
  readonly writable: unknown;
};

function readPropertyDefinitionFields(
  value: Record<string, unknown>,
): PropertyDefinitionFields {
  return {
    description: value.description,
    fixedTargetObjectIds: value.fixedTargetObjectIds,
    iconName: value.iconName,
    id: value.id,
    inversePropertyDefinitionId: value.inversePropertyDefinitionId,
    multiple: value.multiple,
    name: value.name,
    normalizedOwnership: value.ownership ?? "normal",
    numberPresentation: value.numberPresentation,
    options: value.options,
    targetStructureIds: value.targetStructureIds,
    valueType: value.valueType,
    writable: value.writable,
  };
}

function hasValidPropertyDefinitionCore(
  fields: PropertyDefinitionFields,
): boolean {
  return (
    isNonEmptyString(fields.id) &&
    isNonEmptyString(fields.name) &&
    (fields.description === undefined ||
      typeof fields.description === "string") &&
    typeof fields.normalizedOwnership === "string" &&
    propertyDefinitionOwnerships.includes(
      fields.normalizedOwnership as PropertyDefinitionOwnership,
    ) &&
    typeof fields.valueType === "string" &&
    propertyValueTypes.includes(fields.valueType as PropertyValueType) &&
    typeof fields.writable === "boolean" &&
    typeof fields.multiple === "boolean"
  );
}

function hasValidOptionalIcon(iconName: unknown): boolean {
  return (
    iconName === undefined ||
    (typeof iconName === "string" &&
      OBJECT_ICON_NAMES.includes(iconName as ObjectIconName))
  );
}

function validatePropertyCollectionFields(
  fields: PropertyDefinitionFields,
): DomainResult<void> {
  if (fields.options !== undefined && !validateLabelOptions(fields.options)) {
    return failure(
      "invalid-property-definition",
      "Label options must contain unique stable ids and non-empty names.",
    );
  }
  if (
    fields.targetStructureIds !== undefined &&
    !hasUniqueNonEmptyStrings(fields.targetStructureIds)
  ) {
    return failure(
      "invalid-property-definition",
      "Property target Structure ids must be unique non-empty strings.",
    );
  }
  if (
    fields.fixedTargetObjectIds !== undefined &&
    !hasUniqueNonEmptyStrings(fields.fixedTargetObjectIds)
  ) {
    return failure(
      "invalid-property-definition",
      "Property fixed target object ids must be unique non-empty strings.",
    );
  }
  return ok(undefined);
}

function validatePropertyReferenceFields(
  fields: PropertyDefinitionFields,
): DomainResult<void> {
  if (
    fields.inversePropertyDefinitionId !== undefined &&
    !isNonEmptyString(fields.inversePropertyDefinitionId)
  ) {
    return failure(
      "invalid-property-definition",
      "Inverse property definition id must be a non-empty string.",
    );
  }
  if (fields.options !== undefined && fields.valueType !== "label") {
    return failure(
      "invalid-property-definition",
      "Only label properties may define options.",
    );
  }
  if (
    fields.targetStructureIds !== undefined &&
    fields.valueType !== "entity"
  ) {
    return failure(
      "invalid-property-definition",
      "Only entity properties may constrain target Structures.",
    );
  }
  if (
    fields.fixedTargetObjectIds !== undefined &&
    fields.valueType !== "entity"
  ) {
    return failure(
      "invalid-property-definition",
      "Only entity properties may define fixed target objects.",
    );
  }
  if (
    fields.inversePropertyDefinitionId !== undefined &&
    fields.valueType !== "entity"
  ) {
    return failure(
      "invalid-property-definition",
      "Only entity properties may declare inverse properties.",
    );
  }
  return ok(undefined);
}

function validatePropertyNumberPresentation(
  fields: PropertyDefinitionFields,
): DomainResult<NumberPresentation> {
  if (
    fields.numberPresentation !== undefined &&
    fields.valueType !== "number"
  ) {
    return failure(
      "invalid-property-definition",
      "Only number properties may define number presentation settings.",
    );
  }
  if (fields.valueType !== "number") return ok(DEFAULT_NUMBER_PRESENTATION);
  if (fields.numberPresentation === undefined) {
    return ok(DEFAULT_NUMBER_PRESENTATION);
  }
  const validation = validateNumberPresentation(fields.numberPresentation);
  if (!validation.ok) return validation;
  if (validation.value.type === "none" || validation.value.type === "text") {
    return failure(
      "invalid-property-definition",
      "Text number presentation is only allowed for table cells.",
    );
  }
  return ok(validation.value);
}

function cloneValidatedPropertyDefinition(
  fields: PropertyDefinitionFields,
): PropertyDefinition {
  const options = fields.options as readonly PropertyLabelOption[] | undefined;
  const targetStructureIds = fields.targetStructureIds as
    | readonly string[]
    | undefined;
  const fixedTargetObjectIds = fields.fixedTargetObjectIds as
    | readonly string[]
    | undefined;
  const numberPresentation = validatePropertyNumberPresentation(fields);
  return {
    ...(fields.description !== undefined
      ? { description: fields.description as string }
      : {}),
    ...(fixedTargetObjectIds
      ? { fixedTargetObjectIds: [...fixedTargetObjectIds] }
      : {}),
    ...(fields.iconName !== undefined
      ? { iconName: fields.iconName as ObjectIconName }
      : {}),
    ...(fields.inversePropertyDefinitionId !== undefined
      ? {
          inversePropertyDefinitionId: (
            fields.inversePropertyDefinitionId as string
          ).trim(),
        }
      : {}),
    id: (fields.id as string).trim(),
    multiple: fields.multiple as boolean,
    name: (fields.name as string).trim(),
    ...(numberPresentation.ok && fields.valueType === "number"
      ? {
          numberPresentation: cloneNumberPresentation(numberPresentation.value),
        }
      : {}),
    ownership: fields.normalizedOwnership as PropertyDefinitionOwnership,
    ...(options ? { options: options.map((option) => ({ ...option })) } : {}),
    ...(targetStructureIds
      ? { targetStructureIds: [...targetStructureIds] }
      : {}),
    valueType: fields.valueType as PropertyValueType,
    writable: fields.writable as boolean,
  };
}

function validateStructureNames(
  id: unknown,
  singularName: unknown,
  pluralName: unknown,
): DomainResult<void> {
  if (!isNonEmptyString(id)) {
    return failure("invalid-id", "Structure id must not be empty.");
  }
  if (!isNonEmptyString(singularName) || !isNonEmptyString(pluralName)) {
    return failure(
      "invalid-name",
      "Structure singular and plural names must not be empty.",
    );
  }
  return ok(undefined);
}

function isSupportedOwnership(value: unknown): value is StructureOwnership {
  return (
    typeof value === "string" &&
    (["built-in", "custom", "legacy", "reserved"] as const).includes(
      value as StructureOwnership,
    )
  );
}

function validateStructureKindAndAppearance(
  ownership: unknown,
  iconName: unknown,
  tone: unknown,
  lifecycleKind: unknown,
): DomainResult<void> {
  if (!isSupportedOwnership(ownership)) {
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
  return ok(undefined);
}

function validateStructureCollectionIds(
  collectionIds: unknown,
): DomainResult<readonly string[]> {
  return hasUniqueNonEmptyStrings(collectionIds)
    ? ok(collectionIds)
    : failure(
        "invalid-structure",
        "Structure collection ids must be unique non-empty strings.",
      );
}

function validateStructurePropertyDefinitions(
  propertyDefinitions: unknown,
): DomainResult<readonly PropertyDefinition[]> {
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
  return new Set(definitionIds).size === definitionIds.length
    ? ok(validatedDefinitions)
    : failure(
        "duplicate-property-definition-id",
        "Property definition ids must be unique within a Structure.",
      );
}

function validateRegistryEntries(
  value: readonly unknown[],
): DomainResult<readonly WorkspaceStructure[]> {
  const structures: WorkspaceStructure[] = [];
  for (const entry of value) {
    const result = validateWorkspaceStructure(entry);
    if (!result.ok) return result;
    structures.push(result.value);
  }
  return ok(structures);
}

function validateUniqueStructureIds(
  structures: readonly WorkspaceStructure[],
): DomainResult<void> {
  const ids = structures.map((structure) => structure.id);
  return new Set(ids).size === ids.length
    ? ok(undefined)
    : failure(
        "duplicate-id",
        "Structure ids must be unique within the registry.",
      );
}

function findStructureDefinition(
  structures: readonly WorkspaceStructure[],
  structureId: string,
  propertyDefinitionId: string,
): PropertyDefinition | null {
  return (
    structures
      .find((structure) => structure.id === structureId)
      ?.propertyDefinitions.find(
        (definition) => definition.id === propertyDefinitionId,
      ) ?? null
  );
}

function isCompatibleInversePair(
  structures: readonly WorkspaceStructure[],
  structureId: string,
  targetStructureId: string,
  definition: PropertyDefinition,
): boolean {
  const inverse = findStructureDefinition(
    structures,
    targetStructureId,
    definition.inversePropertyDefinitionId ?? "",
  );
  if (
    definition.fixedTargetObjectIds?.length ||
    inverse?.fixedTargetObjectIds?.length
  ) {
    return false;
  }
  return (
    inverse?.valueType === "entity" &&
    inverse.targetStructureIds?.includes(structureId) === true &&
    inverse.inversePropertyDefinitionId === definition.id
  );
}

function validateInverseTargets(
  structures: readonly WorkspaceStructure[],
  structure: WorkspaceStructure,
  definition: PropertyDefinition,
): DomainResult<void> {
  for (const targetStructureId of definition.targetStructureIds ?? []) {
    if (
      !isCompatibleInversePair(
        structures,
        structure.id,
        targetStructureId,
        definition,
      )
    ) {
      return failure(
        "invalid-property-definition",
        "Inverse entity property pairing is incompatible.",
        {
          inversePropertyDefinitionId: definition.inversePropertyDefinitionId,
          propertyDefinitionId: definition.id,
          structureId: structure.id,
          targetStructureId,
        },
      );
    }
  }
  return ok(undefined);
}

function validateInverseDefinition(
  structures: readonly WorkspaceStructure[],
  structure: WorkspaceStructure,
  definition: PropertyDefinition,
): DomainResult<void> {
  if (!definition.inversePropertyDefinitionId) return ok(undefined);
  if (
    definition.valueType !== "entity" ||
    !definition.targetStructureIds?.length
  ) {
    return failure(
      "invalid-property-definition",
      "Inverse entity properties must declare target Structures.",
      {
        propertyDefinitionId: definition.id,
        structureId: structure.id,
      },
    );
  }
  return validateInverseTargets(structures, structure, definition);
}

function validateInversePropertyPairings(
  structures: readonly WorkspaceStructure[],
): DomainResult<void> {
  for (const structure of structures) {
    for (const definition of structure.propertyDefinitions) {
      const result = validateInverseDefinition(
        structures,
        structure,
        definition,
      );
      if (!result.ok) return result;
    }
  }
  return ok(undefined);
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
  const fields = readPropertyDefinitionFields(value);
  if (
    !hasValidPropertyDefinitionCore(fields) ||
    !hasValidOptionalIcon(fields.iconName)
  ) {
    return failure(
      "invalid-property-definition",
      "Property definitions require an id, name, supported value type, writability, and multiplicity.",
    );
  }
  const collectionValidation = validatePropertyCollectionFields(fields);
  if (!collectionValidation.ok) return collectionValidation;
  const referenceValidation = validatePropertyReferenceFields(fields);
  if (!referenceValidation.ok) return referenceValidation;
  const numberPresentation = validatePropertyNumberPresentation(fields);
  if (!numberPresentation.ok) return numberPresentation;
  return ok(cloneValidatedPropertyDefinition(fields));
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
  const names = validateStructureNames(id, singularName, pluralName);
  if (!names.ok) return names;
  const kindAndAppearance = validateStructureKindAndAppearance(
    ownership,
    iconName,
    tone,
    lifecycleKind,
  );
  if (!kindAndAppearance.ok) return kindAndAppearance;
  const collections = validateStructureCollectionIds(collectionIds);
  if (!collections.ok) return collections;
  const definitions = validateStructurePropertyDefinitions(propertyDefinitions);
  if (!definitions.ok) return definitions;
  const presentationResult = validatePresentation(presentation);
  if (!presentationResult.ok) return presentationResult;
  return ok({
    collectionIds: [...collections.value],
    iconName: iconName as ObjectIconName,
    id: (id as string).trim(),
    lifecycleKind: lifecycleKind as StructureLifecycleKind,
    ownership: ownership as StructureOwnership,
    pluralName: (pluralName as string).trim(),
    presentation: presentationResult.value,
    propertyDefinitions: definitions.value,
    singularName: (singularName as string).trim(),
    tone: tone as ObjectIconTone,
  });
}

export function validateStructureRegistry(
  value: unknown,
): DomainResult<readonly WorkspaceStructure[]> {
  if (!Array.isArray(value))
    return failure("invalid-structure", "Structure registry must be an array.");
  const registry = validateRegistryEntries(value);
  if (!registry.ok) return registry;
  const uniqueIds = validateUniqueStructureIds(registry.value);
  if (!uniqueIds.ok) return uniqueIds;
  const inversePairings = validateInversePropertyPairings(registry.value);
  if (!inversePairings.ok) return inversePairings;
  return ok(registry.value);
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
    propertyDefinitions: mergeDefaultPropertyDefinitions(
      input.propertyDefinitions,
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

export function updateStructurePresentation(
  registry: readonly WorkspaceStructure[],
  id: StructureId,
  update: StructurePresentationUpdate,
): DomainResult<readonly WorkspaceStructure[]> {
  const indexResult = findStructureIndex(registry, id);
  if (!indexResult.ok) return indexResult;
  const presentation = validatePresentation(update.presentation);
  if (!presentation.ok) return presentation;
  return ok(
    replaceAt(registry, indexResult.value, {
      ...registry[indexResult.value],
      presentation: presentation.value,
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
  return [
    ...BUILT_IN_STRUCTURES.map(cloneStructure),
    ...RESERVED_STRUCTURES.map(cloneStructure),
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
  return registry.filter(
    (structure) =>
      structure.ownership === "built-in" || structure.ownership === "custom",
  );
}

export function selectReservedStructures(
  registry: readonly WorkspaceStructure[],
): readonly WorkspaceStructure[] {
  return registry.filter((structure) => structure.ownership === "reserved");
}
