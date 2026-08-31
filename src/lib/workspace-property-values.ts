import {
  type BlockEditorDocument,
  normalizeBlockEditorDocument,
} from "../editor/document.ts";
import {
  type DatePropertyValue,
  normalizeDatePropertyValue,
} from "./workspace-dates-calendar.ts";
import {
  validateNumberPresentation,
  type DomainResult,
  type NumberPresentation,
  type PropertyDefinition,
  type PropertyValueType,
  type StructureDomainError,
  type TableCellNumberPresentation,
  type WorkspaceStructure,
} from "./workspace-object-types.ts";
import type { WorkspaceEntity } from "./workspace-objects.ts";

type ScalarPropertyValue =
  | {
      readonly type: "boolean";
      readonly boolean: { readonly checked: boolean };
    }
  | {
      readonly type: "createdAt";
      readonly createdAt: { readonly value: string };
    }
  | {
      readonly type: "date";
      readonly date: { readonly value: DatePropertyValue };
    }
  | {
      readonly type: "entity";
      readonly entity: readonly { readonly id: string }[];
    }
  | {
      readonly type: "label";
      readonly label: readonly { readonly id: string }[];
    }
  | {
      readonly type: "lastUpdatedAt";
      readonly lastUpdatedAt: { readonly value: string };
    }
  | { readonly type: "media"; readonly media: { readonly id: string } }
  | { readonly type: "number"; readonly number: { readonly value: number } }
  | { readonly type: "richText"; readonly richText: BlockEditorDocument }
  | { readonly type: "text"; readonly text: { readonly value: string } }
  | { readonly type: "title"; readonly title: { readonly value: string } }
  | { readonly type: "url"; readonly url: { readonly value: string } };

export type WorkspacePropertyValue =
  | ScalarPropertyValue
  | {
      readonly type: "text";
      readonly text: { readonly value: readonly string[] };
    };

export type WorkspacePropertyValueMap = Readonly<
  Record<string, WorkspacePropertyValue>
>;

type PropertyValueContext = {
  readonly allowedTargetStructureIds?: readonly string[];
  readonly targetStructureIdByEntityId?: Readonly<Record<string, string>>;
};

type PropertyValueNormalizer = (
  definition: PropertyDefinition,
  rawValue: unknown,
  context: PropertyValueContext,
) => DomainResult<WorkspacePropertyValue>;

type PropertyValueProjector = (
  entity: WorkspaceEntity,
) => readonly [string, WorkspacePropertyValue] | undefined;

type DefaultPropertyAdapter = (
  entity: WorkspaceEntity,
  definition: PropertyDefinition,
  value: WorkspacePropertyValue,
) => WorkspaceEntity;

type NumberExportMode = "display" | "raw";

type FormattedNumberProgress = {
  readonly color: Extract<
    NumberPresentation,
    { readonly type: "progress" }
  >["color"];
  readonly max: number;
  readonly percent: number;
  readonly text: string;
  readonly value: number;
};

export type FormattedNumberValue = {
  readonly diagnostics: readonly string[];
  readonly presentation: NumberPresentation;
  readonly progress?: FormattedNumberProgress;
  readonly rawValue: number;
  readonly text: string;
};

function ok<T>(value: T): DomainResult<T> {
  return { ok: true, value };
}

function failure(
  code: StructureDomainError["code"],
  message: string,
  details?: Readonly<Record<string, unknown>>,
): DomainResult<never> {
  return { error: { code, details, message }, ok: false };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

function fixedFractionDigits(
  fixedDecimals: number | undefined,
): Intl.NumberFormatOptions {
  return fixedDecimals === undefined
    ? {}
    : {
        maximumFractionDigits: fixedDecimals,
        minimumFractionDigits: fixedDecimals,
      };
}

function normalizeNumberPresentationForDisplay(
  presentation: NumberPresentation | TableCellNumberPresentation | undefined,
): {
  readonly diagnostics: readonly string[];
  readonly presentation: NumberPresentation;
} {
  if (!presentation) return { diagnostics: [], presentation: { type: "number" } };
  const validation = validateNumberPresentation(presentation, {
    allowText: true,
  });
  if (!validation.ok) {
    return {
      diagnostics: [validation.error.code],
      presentation: { type: "number" },
    };
  }
  if (validation.value.type === "none" || validation.value.type === "text") {
    return { diagnostics: [], presentation: { type: "number" } };
  }
  return { diagnostics: [], presentation: validation.value };
}

function formatFiniteNumber(
  value: number,
  locale: string | undefined,
  options: Intl.NumberFormatOptions,
): string {
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return String(value);
  }
}

function localeSeparators(locale: string | undefined): {
  readonly decimal: string;
  readonly group: string;
} {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  return {
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
    group: parts.find((part) => part.type === "group")?.value ?? ",",
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function formatNumberValue(
  rawValue: number,
  presentation?: NumberPresentation | TableCellNumberPresentation,
  locale?: string,
): FormattedNumberValue {
  const normalized = normalizeNumberPresentationForDisplay(presentation);
  const diagnostics = [...normalized.diagnostics];
  if (!Number.isFinite(rawValue)) {
    return {
      diagnostics: [...diagnostics, "invalid-property-value"],
      presentation: normalized.presentation,
      rawValue,
      text: "",
    };
  }
  const fixedDigits = fixedFractionDigits(normalized.presentation.fixedDecimals);
  switch (normalized.presentation.type) {
    case "currency":
      return {
        diagnostics,
        presentation: normalized.presentation,
        rawValue,
        text: formatFiniteNumber(rawValue, locale, {
          ...fixedDigits,
          currency: normalized.presentation.currency,
          style: "currency",
        }),
      };
    case "percent":
      return {
        diagnostics,
        presentation: normalized.presentation,
        rawValue,
        text: formatFiniteNumber(rawValue, locale, {
          ...fixedDigits,
          style: "percent",
        }),
      };
    case "progress": {
      const max = normalized.presentation.steps;
      const value = Math.min(Math.max(rawValue, 0), max);
      const text = `${formatFiniteNumber(value, locale, fixedDigits)} / ${formatFiniteNumber(
        max,
        locale,
        fixedDigits,
      )}`;
      return {
        diagnostics,
        presentation: normalized.presentation,
        progress: {
          color: normalized.presentation.color,
          max,
          percent: (value / max) * 100,
          text,
          value,
        },
        rawValue,
        text,
      };
    }
    case "number":
    default:
      return {
        diagnostics,
        presentation: normalized.presentation,
        rawValue,
        text: formatFiniteNumber(rawValue, locale, fixedDigits),
      };
  }
}

export function formatNumberForExport(
  rawValue: number,
  presentation: NumberPresentation | TableCellNumberPresentation | undefined,
  mode: NumberExportMode,
  locale?: string,
): string {
  return mode === "raw"
    ? String(rawValue)
    : formatNumberValue(rawValue, presentation, locale).text;
}

export function parseNumberInput(
  value: string,
  locale?: string,
): DomainResult<number> {
  const trimmed = value.trim();
  if (!trimmed) {
    return failure("invalid-property-value", "Number input must not be empty.");
  }
  const { decimal, group } = localeSeparators(locale);
  const withoutSpaces = trimmed.replace(/\s+/g, "");
  const withoutDecorations = withoutSpaces.replace(/[^\d+\-.,]/g, "");
  const withoutGroups = group
    ? withoutDecorations.replace(new RegExp(escapeRegExp(group), "g"), "")
    : withoutDecorations;
  const normalized =
    decimal === "."
      ? withoutGroups
      : withoutGroups.replace(new RegExp(escapeRegExp(decimal), "g"), ".");
  if (!/^[+-]?(?:\d+|\d*\.\d+)$/.test(normalized)) {
    return failure("invalid-property-value", "Number input must be numeric.");
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed)
    ? ok(parsed)
    : failure("invalid-property-value", "Number input must be finite.");
}

function normalizeString(value: unknown): DomainResult<string> {
  return typeof value === "string"
    ? ok(value.trim())
    : failure("invalid-property-value", "Property value must be text.");
}

function normalizeStringArray(value: unknown): DomainResult<readonly string[]> {
  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === "string")
  ) {
    return failure("invalid-property-value", "Property value must be text.");
  }
  return ok(value.map((item) => item.trim()).filter(Boolean));
}

function normalizeEntityIds(
  definition: PropertyDefinition,
  value: unknown,
  context: PropertyValueContext,
): DomainResult<readonly { readonly id: string }[]> {
  const rawIds = Array.isArray(value) ? value : [value];
  const ids = rawIds.map((item) => {
    if (typeof item === "string") return item.trim();
    if (isRecord(item) && typeof item.id === "string") return item.id.trim();
    return "";
  });
  if (
    ids.some((id) => id.length === 0) ||
    (!definition.multiple && ids.length > 1)
  ) {
    return failure(
      "invalid-property-value",
      "Entity property values must reference valid object ids.",
    );
  }
  const uniqueIds = Array.from(new Set(ids));
  if (definition.fixedTargetObjectIds) {
    const fixedIds = new Set(definition.fixedTargetObjectIds);
    const invalid = uniqueIds.find((id) => !fixedIds.has(id));
    if (invalid) {
      return failure(
        "invalid-property-value",
        "Entity property value is not in the fixed candidate set.",
        { objectId: invalid },
      );
    }
  }
  const allowedTargets =
    context.allowedTargetStructureIds ?? definition.targetStructureIds;
  if (allowedTargets && context.targetStructureIdByEntityId) {
    const invalid = uniqueIds.find((id) => {
      const targetStructureId = context.targetStructureIdByEntityId?.[id];
      return !targetStructureId || !allowedTargets.includes(targetStructureId);
    });
    if (invalid) {
      return failure(
        "invalid-property-value",
        "Entity property target is not allowed by this definition.",
        { objectId: invalid },
      );
    }
  }
  return ok(uniqueIds.map((id) => ({ id })));
}

function normalizeLabelIds(
  definition: PropertyDefinition,
  value: unknown,
): DomainResult<readonly { readonly id: string }[]> {
  const rawIds = Array.isArray(value) ? value : [value];
  const ids = rawIds.map((item) => {
    if (typeof item === "string") return item.trim();
    if (isRecord(item) && typeof item.id === "string") return item.id.trim();
    return "";
  });
  if (
    ids.some((id) => id.length === 0) ||
    (!definition.multiple && ids.length > 1)
  ) {
    return failure(
      "invalid-property-value",
      "Label property values must reference valid option ids.",
    );
  }
  const optionIds = new Set(
    (definition.options ?? []).map((option) => option.id),
  );
  if (optionIds.size > 0 && ids.some((id) => !optionIds.has(id))) {
    return failure(
      "invalid-property-value",
      "Label property value is not in the definition options.",
    );
  }
  return ok(ids.map((id) => ({ id })));
}

function normalizeIsoTemporalPropertyValue(
  valueType: "createdAt" | "lastUpdatedAt",
  rawValue: unknown,
): DomainResult<WorkspacePropertyValue> {
  if (typeof rawValue !== "string" || !isIsoDate(rawValue)) {
    return failure(
      "invalid-property-value",
      "Date property value must be an ISO date.",
    );
  }
  return valueType === "createdAt"
    ? ok({ createdAt: { value: rawValue }, type: "createdAt" })
    : ok({ lastUpdatedAt: { value: rawValue }, type: "lastUpdatedAt" });
}

const propertyValueNormalizers: Readonly<
  Partial<Record<PropertyValueType, PropertyValueNormalizer>>
> = {
  boolean: (_definition, rawValue) =>
    typeof rawValue === "boolean"
      ? ok({ boolean: { checked: rawValue }, type: "boolean" })
      : failure(
          "invalid-property-value",
          "Boolean property value must be true or false.",
        ),
  createdAt: (_definition, rawValue) =>
    normalizeIsoTemporalPropertyValue("createdAt", rawValue),
  date: (_definition, rawValue) => {
    try {
      return ok({
        date: { value: normalizeDatePropertyValue(rawValue) },
        type: "date",
      });
    } catch {
      return failure(
        "invalid-property-value",
        "Date property value must be a valid all-day, timed, or range value.",
      );
    }
  },
  entity: (definition, rawValue, context) => {
    const entity = normalizeEntityIds(definition, rawValue, context);
    return entity.ok ? ok({ entity: entity.value, type: "entity" }) : entity;
  },
  label: (definition, rawValue) => {
    const label = normalizeLabelIds(definition, rawValue);
    return label.ok ? ok({ label: label.value, type: "label" }) : label;
  },
  lastUpdatedAt: (_definition, rawValue) =>
    normalizeIsoTemporalPropertyValue("lastUpdatedAt", rawValue),
  media: (_definition, rawValue) => {
    const media = normalizeString(rawValue);
    return media.ok ? ok({ media: { id: media.value }, type: "media" }) : media;
  },
  number: (_definition, rawValue) =>
    typeof rawValue === "number" && Number.isFinite(rawValue)
      ? ok({ number: { value: rawValue }, type: "number" })
      : failure(
          "invalid-property-value",
          "Number property value must be finite.",
        ),
  richText: (_definition, rawValue) => {
    const richText = normalizeBlockEditorDocument(rawValue, "property");
    return richText
      ? ok({ richText, type: "richText" })
      : failure(
          "invalid-property-value",
          "Rich text property value must be a block editor document.",
        );
  },
  text: (definition, rawValue) => {
    if (definition.multiple) {
      const values = normalizeStringArray(rawValue);
      return values.ok
        ? ok({ text: { value: values.value }, type: "text" })
        : values;
    }
    const text = normalizeString(rawValue);
    return text.ok ? ok({ text: { value: text.value }, type: "text" }) : text;
  },
  title: (_definition, rawValue) => {
    const title = normalizeString(rawValue);
    return title.ok
      ? ok({ title: { value: title.value }, type: "title" })
      : title;
  },
  url: (_definition, rawValue) => {
    const url = normalizeString(rawValue);
    if (!url.ok) return url;
    try {
      return ok({ type: "url", url: { value: new URL(url.value).toString() } });
    } catch {
      return failure(
        "invalid-property-value",
        "URL property value must be a valid URL.",
      );
    }
  },
};

export function normalizeWorkspacePropertyValue(
  definition: PropertyDefinition,
  rawValue: unknown,
  context: PropertyValueContext = {},
): DomainResult<WorkspacePropertyValue> {
  if (!definition.writable || definition.ownership === "system") {
    return failure(
      "read-only-property",
      `Property ${definition.id} cannot be edited generically.`,
      { propertyDefinitionId: definition.id },
    );
  }
  const normalize = propertyValueNormalizers[definition.valueType];
  return normalize
    ? normalize(definition, rawValue, context)
    : failure(
        "invalid-property-value",
        "Property value type is not supported.",
      );
}

function propertyDefinitionFor(
  structure: WorkspaceStructure,
  propertyId: string,
): DomainResult<PropertyDefinition> {
  const definition = structure.propertyDefinitions.find(
    (candidate) => candidate.id === propertyId,
  );
  return definition
    ? ok(definition)
    : failure("unknown-property", `Unknown property: ${propertyId}`, {
        propertyDefinitionId: propertyId,
        structureId: structure.id,
      });
}

function applyDefaultPropertyAdapter(
  entity: WorkspaceEntity,
  definition: PropertyDefinition,
  value: WorkspacePropertyValue,
): WorkspaceEntity {
  return defaultPropertyAdapters.reduce(
    (next, adapter) => adapter(next, definition, value),
    entity,
  );
}

const defaultPropertyAdapters: readonly DefaultPropertyAdapter[] = [
  (entity, definition, value) =>
    definition.id === "title" && value.type === "title"
      ? { ...entity, title: value.title.value }
      : entity,
  (entity, definition, value) => {
    if (
      definition.id === "aliases" &&
      value.type === "text" &&
      "aliases" in entity
    ) {
      const aliases = Array.isArray(value.text.value)
        ? value.text.value
        : [value.text.value];
      return { ...entity, aliases };
    }
    return entity;
  },
  (entity, definition, value) =>
    definition.id === "description" &&
    value.type === "text" &&
    "description" in entity &&
    typeof value.text.value === "string"
      ? { ...entity, description: value.text.value }
      : entity,
  (entity, definition, value) =>
    definition.id === "tags" && value.type === "entity" && "tags" in entity
      ? { ...entity, tags: value.entity.map((item) => item.id) }
      : entity,
];

export function setWorkspaceEntityPropertyValue(
  entity: WorkspaceEntity,
  structure: WorkspaceStructure,
  propertyId: string,
  rawValue: unknown,
  context: PropertyValueContext = {},
): DomainResult<WorkspaceEntity> {
  const definition = propertyDefinitionFor(structure, propertyId);
  if (!definition.ok) return definition;
  const value = normalizeWorkspacePropertyValue(
    definition.value,
    rawValue,
    context,
  );
  if (!value.ok) return value;
  const next = applyDefaultPropertyAdapter(
    entity,
    definition.value,
    value.value,
  );
  return ok({
    ...next,
    propertyValues: {
      ...next.propertyValues,
      [propertyId]: value.value,
    },
  });
}

export function removeWorkspaceEntityPropertyValue(
  entity: WorkspaceEntity,
  structure: WorkspaceStructure,
  propertyId: string,
): DomainResult<WorkspaceEntity> {
  const definition = propertyDefinitionFor(structure, propertyId);
  if (!definition.ok) return definition;
  if (!definition.value.writable || definition.value.ownership === "system") {
    return failure(
      "read-only-property",
      `Property ${propertyId} cannot be edited generically.`,
      { propertyDefinitionId: propertyId },
    );
  }
  const { [propertyId]: _removed, ...propertyValues } = entity.propertyValues;
  return ok({ ...entity, propertyValues });
}

export function createWorkspaceEntityPropertyValues(
  entity: WorkspaceEntity,
): WorkspacePropertyValueMap {
  const existingLastUpdatedAt = entity.propertyValues?.lastUpdatedAt;
  const lastUpdatedAt =
    existingLastUpdatedAt?.type === "lastUpdatedAt"
      ? existingLastUpdatedAt.lastUpdatedAt.value
      : entity.createdAt;
  return Object.fromEntries([
    [
      "createdAt",
      { createdAt: { value: entity.createdAt }, type: "createdAt" },
    ],
    [
      "lastUpdatedAt",
      { lastUpdatedAt: { value: lastUpdatedAt }, type: "lastUpdatedAt" },
    ],
    ["title", { title: { value: entity.title }, type: "title" }],
    ...entityPropertyValueProjectors.flatMap((projector) => {
      const entry = projector(entity);
      return entry ? [entry] : [];
    }),
  ]);
}

const entityPropertyValueProjectors: readonly PropertyValueProjector[] = [
  (entity) =>
    "aliases" in entity &&
    Array.isArray(entity.aliases) &&
    entity.aliases.length > 0
      ? ["aliases", { text: { value: entity.aliases }, type: "text" }]
      : undefined,
  (entity) =>
    "description" in entity &&
    typeof entity.description === "string" &&
    entity.description.trim()
      ? ["description", { text: { value: entity.description }, type: "text" }]
      : undefined,
  (entity) =>
    "customIcon" in entity && typeof entity.customIcon === "string"
      ? ["icon", { media: { id: entity.customIcon }, type: "media" }]
      : undefined,
  (entity) =>
    "coverImage" in entity && typeof entity.coverImage === "string"
      ? ["cover", { media: { id: entity.coverImage }, type: "media" }]
      : undefined,
  (entity) =>
    "tags" in entity && Array.isArray(entity.tags) && entity.tags.length > 0
      ? [
          "tags",
          {
            entity: entity.tags.map((id) => ({ id })),
            type: "entity",
          },
        ]
      : undefined,
];

function typedValuePayload(value: WorkspacePropertyValue): unknown {
  if (value.type === "boolean") return value.boolean.checked;
  if (value.type === "createdAt") return value.createdAt.value;
  if (value.type === "date") return value.date.value;
  if (value.type === "entity") return value.entity;
  if (value.type === "label") return value.label;
  if (value.type === "lastUpdatedAt") return value.lastUpdatedAt.value;
  if (value.type === "media") return value.media.id;
  if (value.type === "number") return value.number.value;
  if (value.type === "richText") return value.richText;
  if (value.type === "title") return value.title.value;
  if (value.type === "url") return value.url.value;
  return value.text.value;
}

export function normalizeWorkspacePropertyValueMap(
  structure: WorkspaceStructure,
  rawValues: unknown,
): DomainResult<WorkspacePropertyValueMap> {
  if (!isRecord(rawValues)) {
    return failure(
      "invalid-property-value",
      "Object propertyValues must be a record.",
    );
  }
  const values: Record<string, WorkspacePropertyValue> = {};
  for (const [propertyId, value] of Object.entries(rawValues)) {
    const definition = structure.propertyDefinitions.find(
      (candidate) => candidate.id === propertyId,
    );
    if (!definition) {
      return failure("unknown-property", `Unknown property: ${propertyId}`, {
        propertyDefinitionId: propertyId,
      });
    }
    if (!isRecord(value) || value.type !== definition.valueType) {
      return failure(
        "invalid-property-value",
        `Property ${propertyId} has an incompatible typed value.`,
        { propertyDefinitionId: propertyId },
      );
    }
    if (!definition.writable || definition.ownership === "system") {
      values[propertyId] = value as WorkspacePropertyValue;
      continue;
    }
    const normalized = normalizeWorkspacePropertyValue(
      definition,
      typedValuePayload(value as WorkspacePropertyValue),
    );
    if (!normalized.ok) return normalized;
    values[propertyId] = normalized.value;
  }
  return ok(values);
}

export function readWorkspacePropertyValue(
  value: WorkspacePropertyValue | undefined,
): unknown {
  return value ? typedValuePayload(value) : undefined;
}
