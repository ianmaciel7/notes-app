import type { QueryDefinition, QueryFilter } from "./workspace-query-engine.ts";

export type TaskStatus = "inbox" | "open" | "in-progress" | "completed";
export type TaskPriority = "none" | "low" | "medium" | "high" | "urgent";
export type TaskRecurrenceMode = "schedule-driven" | "completion-driven";
export type TaskRecurrenceFrequency = "daily" | "weekly" | "monthly";
export type TaskOccurrenceAction = "complete" | "skip" | "excuse";
export type TaskDashboardKind =
  | "inbox"
  | "today"
  | "scheduled"
  | "context"
  | "tags"
  | "open"
  | "completed";

export type TaskRecurrenceRule = {
  readonly frequency: TaskRecurrenceFrequency;
  readonly interval: number;
  readonly mode: TaskRecurrenceMode;
};

export type TaskOccurrence = {
  readonly action: TaskOccurrenceAction;
  readonly actedAt: string;
  readonly actedOnDate: string;
  readonly id: string;
  readonly scheduledDate: string | null;
};

export type TaskManagementMetadata = {
  readonly completed: boolean;
  readonly contextObjectIds: readonly string[];
  readonly deadline: string | null;
  readonly notes: string;
  readonly occurrences: readonly TaskOccurrence[];
  readonly priority: TaskPriority;
  readonly recurrence: TaskRecurrenceRule | null;
  readonly scheduledDate: string | null;
  readonly status: TaskStatus;
  readonly tagIds: readonly string[];
};

export type CreateTaskManagementMetadataInput = Partial<
  Omit<TaskManagementMetadata, "occurrences">
> & {
  readonly occurrences?: readonly TaskOccurrence[];
};

export type TaskOccurrenceCommand = {
  readonly action: TaskOccurrenceAction;
  readonly actedAt: string;
  readonly actedOnDate: string;
};

type ValidationResult =
  | { readonly ok: true; readonly value: TaskManagementMetadata }
  | { readonly error: string; readonly ok: false };

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const statuses = new Set<TaskStatus>([
  "inbox",
  "open",
  "in-progress",
  "completed",
]);
const priorities = new Set<TaskPriority>([
  "none",
  "low",
  "medium",
  "high",
  "urgent",
]);
const frequencies = new Set<TaskRecurrenceFrequency>([
  "daily",
  "weekly",
  "monthly",
]);
const recurrenceModes = new Set<TaskRecurrenceMode>([
  "schedule-driven",
  "completion-driven",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_ONLY_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function isNullableDateOnly(value: unknown): value is string | null {
  return value === null || isDateOnly(value);
}

function hasUniqueStrings(values: readonly string[]): boolean {
  return values.every((value) => value.trim().length > 0) && new Set(values).size === values.length;
}

function isRecurrenceRule(value: unknown): value is TaskRecurrenceRule {
  return (
    isRecord(value) &&
    frequencies.has(value.frequency as TaskRecurrenceFrequency) &&
    recurrenceModes.has(value.mode as TaskRecurrenceMode) &&
    Number.isInteger(value.interval) &&
    Number(value.interval) > 0
  );
}

function isOccurrence(value: unknown): value is TaskOccurrence {
  return (
    isRecord(value) &&
    ["complete", "skip", "excuse"].includes(String(value.action)) &&
    typeof value.actedAt === "string" &&
    Number.isFinite(new Date(value.actedAt).valueOf()) &&
    isDateOnly(value.actedOnDate) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    isNullableDateOnly(value.scheduledDate)
  );
}

export function createTaskManagementMetadata(
  input: CreateTaskManagementMetadataInput = {},
): TaskManagementMetadata {
  const metadata: TaskManagementMetadata = {
    completed: input.completed ?? false,
    contextObjectIds: [...(input.contextObjectIds ?? [])],
    deadline: input.deadline ?? null,
    notes: input.notes ?? "",
    occurrences: [...(input.occurrences ?? [])],
    priority: input.priority ?? "none",
    recurrence: input.recurrence ?? null,
    scheduledDate: input.scheduledDate ?? null,
    status: input.status ?? (input.completed ? "completed" : "inbox"),
    tagIds: [...(input.tagIds ?? [])],
  };
  const validation = validateTaskManagementMetadata(metadata);
  if (!validation.ok) throw new TypeError(validation.error);
  return metadata;
}

export function validateTaskManagementMetadata(value: unknown): ValidationResult {
  if (!isRecord(value)) return { error: "Task metadata must be an object.", ok: false };
  if (!statuses.has(value.status as TaskStatus)) return { error: "Task status is invalid.", ok: false };
  if (!priorities.has(value.priority as TaskPriority)) return { error: "Task priority is invalid.", ok: false };
  if (!isNullableDateOnly(value.scheduledDate) || !isNullableDateOnly(value.deadline)) {
    return { error: "Task dates must use YYYY-MM-DD.", ok: false };
  }
  if (!Array.isArray(value.contextObjectIds) || !hasUniqueStrings(value.contextObjectIds as string[])) {
    return { error: "Task context ids must be unique non-empty strings.", ok: false };
  }
  if (!Array.isArray(value.tagIds) || !hasUniqueStrings(value.tagIds as string[])) {
    return { error: "Task tag ids must be unique non-empty strings.", ok: false };
  }
  if (typeof value.notes !== "string" || typeof value.completed !== "boolean") {
    return { error: "Task notes or completion state is invalid.", ok: false };
  }
  if (value.recurrence !== null && !isRecurrenceRule(value.recurrence)) {
    return { error: "Task recurrence rule is invalid.", ok: false };
  }
  if (!Array.isArray(value.occurrences) || !value.occurrences.every(isOccurrence)) {
    return { error: "Task occurrences are invalid.", ok: false };
  }
  if (value.completed !== (value.status === "completed")) {
    return { error: "Task completion and status must agree.", ok: false };
  }
  return { ok: true, value: value as TaskManagementMetadata };
}

function dateAtUtcMidnight(value: string): Date {
  if (!isDateOnly(value)) throw new TypeError(`Invalid local date: ${value}`);
  return new Date(`${value}T00:00:00.000Z`);
}

function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function addDays(value: string, days: number): string {
  const date = dateAtUtcMidnight(value);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDateOnly(date);
}

function addMonthsClamped(value: string, months: number): string {
  const source = dateAtUtcMidnight(value);
  const targetYear = source.getUTCFullYear();
  const targetMonth = source.getUTCMonth() + months;
  const desiredDay = source.getUTCDate();
  const first = new Date(Date.UTC(targetYear, targetMonth, 1));
  const last = new Date(
    Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0),
  );
  const clampedDay = Math.min(desiredDay, last.getUTCDate());
  return formatDateOnly(
    new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), clampedDay)),
  );
}

export function nextRecurringTaskDate(
  baseDate: string,
  recurrence: TaskRecurrenceRule,
): string {
  if (!isRecurrenceRule(recurrence)) throw new TypeError("Invalid recurrence rule.");
  if (recurrence.frequency === "daily") return addDays(baseDate, recurrence.interval);
  if (recurrence.frequency === "weekly") return addDays(baseDate, recurrence.interval * 7);
  return addMonthsClamped(baseDate, recurrence.interval);
}

function occurrenceId(metadata: TaskManagementMetadata, command: TaskOccurrenceCommand): string {
  const sequence = metadata.occurrences.length + 1;
  return `occurrence:${command.actedOnDate}:${sequence}`;
}

function recurrenceBaseDate(
  metadata: TaskManagementMetadata,
  command: TaskOccurrenceCommand,
): string {
  if (metadata.recurrence?.mode === "completion-driven") return command.actedOnDate;
  return metadata.scheduledDate ?? command.actedOnDate;
}

export function applyTaskOccurrenceAction(
  metadata: TaskManagementMetadata,
  command: TaskOccurrenceCommand,
): TaskManagementMetadata {
  const validation = validateTaskManagementMetadata(metadata);
  if (!validation.ok) throw new TypeError(validation.error);
  if (metadata.completed) throw new TypeError("Completed task cannot receive another occurrence action.");
  if (!isDateOnly(command.actedOnDate) || !Number.isFinite(new Date(command.actedAt).valueOf())) {
    throw new TypeError("Occurrence action date is invalid.");
  }

  const occurrence: TaskOccurrence = {
    action: command.action,
    actedAt: new Date(command.actedAt).toISOString(),
    actedOnDate: command.actedOnDate,
    id: occurrenceId(metadata, command),
    scheduledDate: metadata.scheduledDate,
  };
  const occurrences = [...metadata.occurrences, occurrence];

  if (!metadata.recurrence) {
    return {
      ...metadata,
      completed: command.action === "complete",
      occurrences,
      status: command.action === "complete" ? "completed" : metadata.status,
    };
  }

  return {
    ...metadata,
    completed: false,
    occurrences,
    scheduledDate: nextRecurringTaskDate(
      recurrenceBaseDate(metadata, command),
      metadata.recurrence,
    ),
    status: metadata.status === "inbox" ? "open" : metadata.status,
  };
}

function propertyFilter(
  propertyId: string,
  operator: "equals" | "exists" | "before",
  value?: string | boolean,
): QueryFilter {
  return {
    kind: "property",
    operator,
    propertyId,
    ...(value === undefined ? {} : { value }),
  };
}

function dashboardFilters(kind: TaskDashboardKind, today: string): QueryFilter[] {
  if (kind === "today") return [propertyFilter("scheduledDate", "equals", today)];
  if (kind === "scheduled") return [propertyFilter("scheduledDate", "exists")];
  if (kind === "completed") return [propertyFilter("completed", "equals", true)];
  if (kind === "open") return [propertyFilter("completed", "equals", false)];
  if (kind === "context") return [propertyFilter("contextObjectIds", "exists")];
  if (kind === "tags") return [propertyFilter("tagIds", "exists")];
  return [
    propertyFilter("completed", "equals", false),
    propertyFilter("scheduledDate", "exists"),
    propertyFilter("scheduledDate", "before", today),
  ];
}

export function createTaskDashboardQuery(
  kind: TaskDashboardKind,
  today: string,
): QueryDefinition {
  if (!isDateOnly(today)) throw new TypeError("Task dashboard date must use YYYY-MM-DD.");
  return {
    filters: { filters: dashboardFilters(kind, today), operator: "all" },
    resultKind: "object",
    selection: { mode: "all" },
    sorts: [{ direction: "ascending", propertyId: "scheduledDate" }],
    source: "object-type",
    sourceValue: "task",
    variables: {},
    version: 1,
  };
}
