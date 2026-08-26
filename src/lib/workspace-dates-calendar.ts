import { blockEditorDocumentToPlainText } from "../editor/document.ts";
import type { WorkspaceStructure } from "./workspace-object-types.ts";
import type { WorkspaceEntity } from "./workspace-objects.ts";
import type { WorkspacePropertyValue } from "./workspace-property-values.ts";

export type DatePropertyValue = {
  readonly allDay: boolean;
  readonly end?: string;
  readonly start: string;
  readonly timeZone: string;
};

export type DateQueryOperator = "after" | "before" | "on" | "within";
export type CalendarSpan = "month" | "week" | "three-day" | "day";
export type DrivingDatePropertyConfig = Readonly<Record<string, string>>;

export type DateReference = {
  readonly date: string;
  readonly sourceId: string;
  readonly sourceTitle: string;
};

export type DateReferenceIndex = {
  readonly byDate: Map<string, readonly DateReference[]>;
};

export type CalendarProjectionEntryKind =
  | "daily-note"
  | "date-reference"
  | "dated-object"
  | "task";

export type CalendarProjectionEntry = {
  readonly date: string;
  readonly endDate?: string;
  readonly entity: WorkspaceEntity;
  readonly kind: CalendarProjectionEntryKind;
  readonly propertyId?: string;
  readonly title: string;
};

export type CalendarProjectionDay = {
  readonly date: string;
  readonly entries: readonly CalendarProjectionEntry[];
};

export type CalendarProjection = {
  readonly days: readonly CalendarProjectionDay[];
  readonly entries: readonly CalendarProjectionEntry[];
  readonly range: DateRange;
  readonly span: CalendarSpan;
};

export type DayContext = CalendarProjectionDay & {
  readonly dailyNote: WorkspaceEntity | null;
  readonly references: readonly DateReference[];
  readonly timeline: readonly CalendarProjectionEntry[];
};

type DateRange = {
  readonly end: string;
  readonly start: string;
};

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DATE_REFERENCE_PATTERN = /(?:\[\[|#|date:)(\d{4}-\d{2}-\d{2})(?:\]\])?/g;

function isDateOnly(value: string): boolean {
  return DATE_ONLY_PATTERN.test(value);
}

function assertDateOnly(value: string): void {
  if (!isDateOnly(value)) throw new TypeError(`Invalid local date: ${value}`);
}

function dateAtUtcMidnight(value: string): Date {
  assertDateOnly(value);
  return new Date(`${value}T00:00:00.000Z`);
}

function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function addDays(date: string, days: number): string {
  const value = dateAtUtcMidnight(date);
  value.setUTCDate(value.getUTCDate() + days);
  return formatDateOnly(value);
}

function compareDateOnly(left: string, right: string): number {
  assertDateOnly(left);
  assertDateOnly(right);
  return left.localeCompare(right);
}

function localDateForInstant(instant: string, timeZone: string): string {
  const parsed = new Date(instant);
  if (!Number.isFinite(parsed.valueOf())) {
    throw new TypeError(`Invalid date instant: ${instant}`);
  }
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(parsed);
  const byType = new Map(parts.map((part) => [part.type, part.value]));
  return `${byType.get("year")}-${byType.get("month")}-${byType.get("day")}`;
}

function normalizeTimeZone(value?: string): string {
  const candidate = value?.trim() || "UTC";
  new Intl.DateTimeFormat("en-US", { timeZone: candidate }).format(new Date(0));
  return candidate;
}

export function normalizeDatePropertyValue(
  value: unknown,
  fallbackTimeZone = "UTC",
): DatePropertyValue {
  const fallback = normalizeTimeZone(fallbackTimeZone);
  if (typeof value === "string") {
    return normalizeDateStringPropertyValue(value, fallback);
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("Date property value must be a date string or object.");
  }
  return normalizeDateObjectPropertyValue(value, fallback);
}

function normalizeDateStringPropertyValue(
  value: string,
  timeZone: string,
): DatePropertyValue {
  if (isDateOnly(value)) return { allDay: true, start: value, timeZone };
  return {
    allDay: false,
    start: new Date(value).toISOString(),
    timeZone,
  };
}

function normalizeDateObjectPropertyValue(
  value: object,
  fallbackTimeZone: string,
): DatePropertyValue {
  const candidate = value as Partial<DatePropertyValue>;
  const timeZone = normalizeTimeZone(candidate.timeZone ?? fallbackTimeZone);
  const allDay = candidate.allDay === true;
  if (typeof candidate.start !== "string") {
    throw new TypeError("Date property value requires a start.");
  }
  const start = normalizeDateBoundary(candidate.start, allDay);
  const end = normalizeOptionalDateBoundary(candidate.end, allDay);
  const normalized = {
    ...(end !== undefined ? { end } : {}),
    allDay,
    start,
    timeZone,
  };
  const range = localDateRangeForDateValue(normalized);
  if (compareDateOnly(range.start, range.end) > 0) {
    throw new TypeError("Date property range end must not be before start.");
  }
  return normalized;
}

function normalizeDateBoundary(value: string, allDay: boolean): string {
  const normalized = allDay ? value : new Date(value).toISOString();
  if (allDay) assertDateOnly(normalized);
  return normalized;
}

function normalizeOptionalDateBoundary(
  value: string | undefined,
  allDay: boolean,
): string | undefined {
  return value === undefined ? undefined : normalizeDateBoundary(value, allDay);
}

export function localDateForDateValue(value: DatePropertyValue): string {
  return value.allDay
    ? value.start
    : localDateForInstant(value.start, value.timeZone);
}

export function localDateRangeForDateValue(
  value: DatePropertyValue,
): DateRange {
  const start = localDateForDateValue(value);
  const end = value.end
    ? localDateForDateValue({ ...value, end: undefined, start: value.end })
    : start;
  return { end, start };
}

export function matchesDateQuery(
  value: DatePropertyValue,
  operator: DateQueryOperator,
  operand: string | DateRange,
): boolean {
  const range = localDateRangeForDateValue(value);
  const operandRange =
    typeof operand === "string" ? { end: operand, start: operand } : operand;
  if (operator === "before")
    return compareDateOnly(range.start, operandRange.start) < 0;
  if (operator === "after")
    return compareDateOnly(range.end, operandRange.end) > 0;
  return (
    compareDateOnly(range.start, operandRange.end) <= 0 &&
    compareDateOnly(range.end, operandRange.start) >= 0
  );
}

export function createDailyNoteIdentity(spaceId: string, date: string): string {
  assertDateOnly(date);
  return `daily-note:${spaceId}:${date}`;
}

export function isDailyNote(
  entity: WorkspaceEntity,
  spaceId: string,
  date: string,
): boolean {
  const marker = "dailyNote" in entity ? entity.dailyNote : undefined;
  return (
    !!marker &&
    typeof marker === "object" &&
    marker !== null &&
    (marker as { date?: unknown }).date === date &&
    (marker as { spaceId?: unknown }).spaceId === spaceId
  );
}

export function findDailyNote(
  entities: readonly WorkspaceEntity[],
  spaceId: string,
  date: string,
): WorkspaceEntity | null {
  return entities.find((entity) => isDailyNote(entity, spaceId, date)) ?? null;
}

function readDateValue(
  value: WorkspacePropertyValue | undefined,
): DatePropertyValue | null {
  if (value?.type !== "date") return null;
  return normalizeDatePropertyValue(value.date.value);
}

function selectedDatePropertyId(
  structure: WorkspaceStructure | undefined,
  config: DrivingDatePropertyConfig,
): string | null {
  if (!structure) return null;
  const dateProperties = structure.propertyDefinitions.filter(
    (property) => property.valueType === "date",
  );
  if (dateProperties.length === 0) return null;
  const configured = config[structure.id];
  if (
    configured &&
    dateProperties.some((property) => property.id === configured)
  ) {
    return configured;
  }
  return dateProperties.length === 1 ? dateProperties[0].id : null;
}

export function validateDrivingDatePropertyConfig(
  structures: readonly WorkspaceStructure[],
  config: DrivingDatePropertyConfig,
): boolean {
  return structures.every((structure) => {
    const dateProperties = structure.propertyDefinitions.filter(
      (property) => property.valueType === "date",
    );
    return (
      dateProperties.length <= 1 ||
      dateProperties.some((property) => property.id === config[structure.id])
    );
  });
}

function plainTextForEntity(entity: WorkspaceEntity): string {
  if (entity.kind === "document" || entity.kind === "quote") {
    return blockEditorDocumentToPlainText(entity.body);
  }
  if ("body" in entity && typeof entity.body === "string") return entity.body;
  return "";
}

export function createDateReferenceIndex(
  entities: readonly WorkspaceEntity[],
): DateReferenceIndex {
  const byDate = new Map<string, DateReference[]>();
  for (const entity of entities) {
    for (const match of plainTextForEntity(entity).matchAll(
      DATE_REFERENCE_PATTERN,
    )) {
      const date = match[1];
      const references = byDate.get(date) ?? [];
      references.push({ date, sourceId: entity.id, sourceTitle: entity.title });
      byDate.set(date, references);
    }
  }
  return { byDate };
}

function projectionRange(span: CalendarSpan, date: string): DateRange {
  const anchor = dateAtUtcMidnight(date);
  if (span === "day") return { start: date, end: date };
  if (span === "three-day") return { start: date, end: addDays(date, 2) };
  if (span === "week") {
    const start = addDays(date, -anchor.getUTCDay());
    return { start, end: addDays(start, 6) };
  }
  const start = `${date.slice(0, 8)}01`;
  const endDate = dateAtUtcMidnight(start);
  endDate.setUTCMonth(endDate.getUTCMonth() + 1);
  endDate.setUTCDate(0);
  return { start, end: formatDateOnly(endDate) };
}

function enumerateDays(range: DateRange): readonly string[] {
  const days: string[] = [];
  for (
    let date = range.start;
    compareDateOnly(date, range.end) <= 0;
    date = addDays(date, 1)
  ) {
    days.push(date);
  }
  return days;
}

function entryIntersectsRange(
  entry: CalendarProjectionEntry,
  range: DateRange,
): boolean {
  return (
    compareDateOnly(entry.date, range.end) <= 0 &&
    compareDateOnly(entry.endDate ?? entry.date, range.start) >= 0
  );
}

export function projectCalendarEntries(
  entities: readonly WorkspaceEntity[],
  structures: readonly WorkspaceStructure[],
  options: {
    readonly date: string;
    readonly drivingDateProperties?: DrivingDatePropertyConfig;
    readonly span: CalendarSpan;
    readonly spaceId: string;
    readonly timeZone?: string;
  },
): CalendarProjection {
  const range = projectionRange(options.span, options.date);
  const references = createDateReferenceIndex(entities);
  const structuresById = new Map(
    structures.map((structure) => [structure.id, structure]),
  );
  const entries = [
    ...entities.flatMap((entity) =>
      projectionEntriesForEntity(entity, structuresById, {
        drivingDateProperties: options.drivingDateProperties ?? {},
        spaceId: options.spaceId,
      }),
    ),
    ...dateReferenceProjectionEntries(entities, references, range),
  ];
  const visibleEntries = entries.filter((entry) =>
    entryIntersectsRange(entry, range),
  );
  const days = enumerateDays(range).map((date) =>
    projectCalendarDay(date, visibleEntries),
  );
  return { days, entries: visibleEntries, range, span: options.span };
}

function projectionEntriesForEntity(
  entity: WorkspaceEntity,
  structuresById: ReadonlyMap<string, WorkspaceStructure>,
  options: {
    readonly drivingDateProperties: DrivingDatePropertyConfig;
    readonly spaceId: string;
  },
): readonly CalendarProjectionEntry[] {
  return [
    ...dailyNoteProjectionEntry(entity, options.spaceId),
    ...taskProjectionEntry(entity),
    ...datedObjectProjectionEntry(
      entity,
      structuresById,
      options.drivingDateProperties,
    ),
  ];
}

function dailyNoteProjectionEntry(
  entity: WorkspaceEntity,
  spaceId: string,
): readonly CalendarProjectionEntry[] {
  if (!("dailyNote" in entity) || entity.dailyNote?.spaceId !== spaceId) {
    return [];
  }
  return [
    {
      date: entity.dailyNote.date,
      entity,
      kind: "daily-note",
      title: entity.title || entity.dailyNote.date,
    },
  ];
}

function taskProjectionEntry(
  entity: WorkspaceEntity,
): readonly CalendarProjectionEntry[] {
  if (entity.kind !== "task" || !entity.dueDate) return [];
  return [
    {
      date: entity.dueDate,
      entity,
      kind: "task",
      propertyId: "dueDate",
      title: entity.title,
    },
  ];
}

function datedObjectProjectionEntry(
  entity: WorkspaceEntity,
  structuresById: ReadonlyMap<string, WorkspaceStructure>,
  config: DrivingDatePropertyConfig,
): readonly CalendarProjectionEntry[] {
  const propertyId = selectedDatePropertyId(
    structuresById.get(entity.objectTypeId),
    config,
  );
  const propertyValue = propertyId
    ? readDateValue(entity.propertyValues[propertyId])
    : null;
  if (!propertyId || !propertyValue) return [];
  const dateRange = localDateRangeForDateValue(propertyValue);
  return [
    {
      date: dateRange.start,
      endDate: dateRange.end,
      entity,
      kind: "dated-object",
      propertyId,
      title: entity.title,
    },
  ];
}

function dateReferenceProjectionEntries(
  entities: readonly WorkspaceEntity[],
  references: DateReferenceIndex,
  range: DateRange,
): readonly CalendarProjectionEntry[] {
  const entitiesById = new Map(entities.map((entity) => [entity.id, entity]));
  return enumerateDays(range).flatMap((date) =>
    (references.byDate.get(date) ?? []).flatMap((reference) => {
      const entity = entitiesById.get(reference.sourceId);
      return entity
        ? [
            {
              date,
              entity,
              kind: "date-reference",
              title: reference.sourceTitle,
            },
          ]
        : [];
    }),
  );
}

function projectCalendarDay(
  date: string,
  entries: readonly CalendarProjectionEntry[],
): CalendarProjectionDay {
  return {
    date,
    entries: entries.filter((entry) =>
      entryIntersectsRange(entry, { end: date, start: date }),
    ),
  };
}

export function createDayContext(
  entities: readonly WorkspaceEntity[],
  structures: readonly WorkspaceStructure[],
  options: {
    readonly date: string;
    readonly drivingDateProperties?: DrivingDatePropertyConfig;
    readonly spaceId: string;
    readonly timeZone?: string;
  },
): DayContext {
  const projection = projectCalendarEntries(entities, structures, {
    ...options,
    span: "day",
  });
  const day = projection.days[0];
  const references =
    createDateReferenceIndex(entities).byDate.get(options.date) ?? [];
  return {
    ...day,
    dailyNote: findDailyNote(entities, options.spaceId, options.date),
    references,
    timeline: [...day.entries].sort((left, right) =>
      left.title.localeCompare(right.title, undefined, {
        sensitivity: "base",
      }),
    ),
  };
}
