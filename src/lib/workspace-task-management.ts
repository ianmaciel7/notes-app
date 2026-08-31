import type {
  QueryDefinition,
  QueryFilter,
  QueryFilterGroup,
} from "./workspace-query-engine.ts";

export type TaskCompletionSemantics = "incomplete" | "complete";
export type TaskPriority = "none" | "low" | "medium" | "high";
export type LegacyTaskPriority = TaskPriority | "urgent";
export type TaskRecurrenceMode = "scheduled-date" | "completion-date";
export type LegacyTaskRecurrenceMode =
  | TaskRecurrenceMode
  | "schedule-driven"
  | "completion-driven";
export type TaskRecurrenceUnit = "day" | "week" | "month" | "year";
export type LegacyTaskRecurrenceFrequency = "daily" | "weekly" | "monthly";
export type TaskOccurrenceAction =
  | "advance-one"
  | "complete"
  | "excuse"
  | "skip";
export type TaskCatchUpMode = "next" | "next-future";
export type TaskDashboardKind =
  | "all"
  | "completed"
  | "context"
  | "inbox"
  | "open"
  | "scheduled"
  | "tags"
  | "today";
export type RecurringTaskQueryKind = "all" | "completed" | "open";

export type TaskStatusDefinition = {
  readonly color: string;
  readonly completion: TaskCompletionSemantics;
  readonly icon: string;
  readonly id: string;
  readonly label: string;
  readonly order: number;
  readonly spaceId: string;
};

export type TaskStatusRegistry = {
  readonly definitions: readonly TaskStatusDefinition[];
  readonly spaceId: string;
};

type TaskRecurrenceEnd =
  | { readonly kind: "never" }
  | { readonly date: string; readonly kind: "on-date" };
type MonthlyRule =
  | { readonly day: number; readonly kind: "day-of-month" }
  | { readonly kind: "last-day" }
  | { readonly kind: "last-weekday"; readonly weekday: number }
  | {
      readonly kind: "ordinal-weekday";
      readonly ordinal: number;
      readonly weekday: number;
    };
type YearlyRule =
  | { readonly day: number; readonly month: number }
  | {
      readonly kind: "ordinal-weekday";
      readonly month: number;
      readonly ordinal: number;
      readonly weekday: number;
    };

export type TaskRecurrenceRule = {
  readonly end?: TaskRecurrenceEnd;
  readonly frequency?: LegacyTaskRecurrenceFrequency;
  readonly interval: number;
  readonly mode: LegacyTaskRecurrenceMode;
  readonly monthly?: MonthlyRule;
  readonly unit?: TaskRecurrenceUnit;
  readonly weekdays?: readonly number[];
  readonly yearly?: YearlyRule;
};

export type TaskOccurrence = {
  readonly action: TaskOccurrenceAction;
  readonly actedAt: string;
  readonly actedOnDate: string;
  readonly catchUp?: TaskCatchUpMode;
  readonly deadline: string | null;
  readonly id: string;
  readonly scheduledDate: string | null;
  readonly statusId: string | null;
};

export type TaskManagementMetadata = {
  readonly completed: boolean;
  readonly completedAt: string | null;
  readonly contextObjectIds: readonly string[];
  readonly deadline: string | null;
  readonly notes: string;
  readonly occurrences: readonly TaskOccurrence[];
  readonly priority: TaskPriority;
  readonly recurrence: TaskRecurrenceRule | null;
  readonly scheduledDate: string | null;
  readonly statusId: string | null;
  readonly tagIds: readonly string[];
};

export type LegacyTaskStatus = "completed" | "in-progress" | "inbox" | "open";
export type LegacyTaskManagementMetadata = Omit<
  Partial<TaskManagementMetadata>,
  "occurrences" | "priority" | "recurrence" | "statusId"
> & {
  readonly occurrences?: readonly Partial<TaskOccurrence>[];
  readonly priority?: LegacyTaskPriority;
  readonly recurrence?: TaskRecurrenceRule | null;
  readonly status?: LegacyTaskStatus;
  readonly statusId?: string | null;
};

export type CreateTaskManagementMetadataInput = LegacyTaskManagementMetadata & {
  readonly statusRegistry?: TaskStatusRegistry;
};

export type TaskOccurrenceCommand = {
  readonly action: TaskOccurrenceAction;
  readonly actedAt: string;
  readonly actedOnDate: string;
  readonly catchUp?: TaskCatchUpMode;
};

type ValidationResult =
  | { readonly ok: true; readonly value: TaskManagementMetadata }
  | { readonly error: string; readonly ok: false };

type TaskLikeEntity = {
  readonly completed?: boolean;
  readonly dueDate?: string | null;
  readonly id: string;
  readonly kind: string;
  readonly task?: TaskManagementMetadata;
  readonly title: string;
};

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const priorities = new Set<TaskPriority>(["none", "low", "medium", "high"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_ONLY_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function isNullableDateOnly(value: unknown): value is string | null {
  return value === null || isDateOnly(value);
}

function assertDateOnly(value: string): void {
  if (!isDateOnly(value)) throw new TypeError(`Invalid local date: ${value}`);
}

function isInstant(value: unknown): value is string {
  return (
    typeof value === "string" && Number.isFinite(new Date(value).valueOf())
  );
}

function hasUniqueStrings(values: readonly string[]): boolean {
  return (
    values.every((value) => value.trim().length > 0) &&
    new Set(values).size === values.length
  );
}

function normalizePriority(
  value: LegacyTaskPriority | undefined,
): TaskPriority {
  return value === "urgent" ? "high" : (value ?? "none");
}

export function createDefaultTaskStatusRegistry(
  spaceId: string,
): TaskStatusRegistry {
  const prefix = `${spaceId}:task-status`;
  return {
    definitions: [
      {
        color: "gray",
        completion: "incomplete",
        icon: "circle",
        id: `${prefix}:not-started`,
        label: "Not started",
        order: 10,
        spaceId,
      },
      {
        color: "blue",
        completion: "incomplete",
        icon: "arrow-right",
        id: `${prefix}:next-up`,
        label: "Next Up",
        order: 20,
        spaceId,
      },
      {
        color: "amber",
        completion: "incomplete",
        icon: "loader",
        id: `${prefix}:in-progress`,
        label: "In progress",
        order: 30,
        spaceId,
      },
      {
        color: "green",
        completion: "complete",
        icon: "check",
        id: `${prefix}:done`,
        label: "Done",
        order: 40,
        spaceId,
      },
    ],
    spaceId,
  };
}

function statusById(
  registry: TaskStatusRegistry | undefined,
  statusId: string | null,
) {
  if (!registry || statusId === null) return null;
  return registry.definitions.find((status) => status.id === statusId) ?? null;
}

function defaultStatusId(
  input: CreateTaskManagementMetadataInput,
): string | null {
  if ("statusId" in input) return input.statusId ?? null;
  const registry =
    input.statusRegistry ?? createDefaultTaskStatusRegistry("default");
  if (input.status) {
    if (input.status === "inbox") return null;
    const suffix =
      input.status === "completed"
        ? "done"
        : input.status === "open"
          ? "not-started"
          : "in-progress";
    return (
      registry.definitions.find((status) => status.id.endsWith(`:${suffix}`))
        ?.id ?? null
    );
  }
  if (input.completed) {
    return (
      registry.definitions.find((status) => status.completion === "complete")
        ?.id ?? null
    );
  }
  return null;
}

function completionFor(
  statusId: string | null,
  explicitCompleted: boolean | undefined,
  registry: TaskStatusRegistry | undefined,
): boolean {
  const status = statusById(registry, statusId);
  if (status) return status.completion === "complete";
  return explicitCompleted ?? false;
}

function normalizeMode(mode: LegacyTaskRecurrenceMode): TaskRecurrenceMode {
  if (mode === "schedule-driven") return "scheduled-date";
  if (mode === "completion-driven") return "completion-date";
  return mode;
}

function normalizeUnit(rule: TaskRecurrenceRule): TaskRecurrenceUnit {
  if (rule.unit) return rule.unit;
  if (rule.frequency === "daily") return "day";
  if (rule.frequency === "weekly") return "week";
  return "month";
}

function normalizeRecurrence(rule: TaskRecurrenceRule): TaskRecurrenceRule {
  return {
    ...rule,
    end: rule.end ?? { kind: "never" },
    mode: normalizeMode(rule.mode),
    unit: normalizeUnit(rule),
  };
}

function normalizeOccurrence(value: Partial<TaskOccurrence>): TaskOccurrence {
  return {
    action: value.action ?? "complete",
    actedAt: value.actedAt ?? new Date(0).toISOString(),
    actedOnDate: value.actedOnDate ?? "1970-01-01",
    ...(value.catchUp ? { catchUp: value.catchUp } : {}),
    deadline: value.deadline ?? null,
    id: value.id ?? `occurrence:${value.actedOnDate ?? "1970-01-01"}:legacy`,
    scheduledDate: value.scheduledDate ?? null,
    statusId: value.statusId ?? null,
  };
}

export function migrateLegacyTaskManagementMetadata(
  input: LegacyTaskManagementMetadata,
  registry = createDefaultTaskStatusRegistry("default"),
): TaskManagementMetadata {
  const statusId = defaultStatusId({ ...input, statusRegistry: registry });
  const completed = completionFor(statusId, input.completed, registry);
  return {
    completed,
    completedAt: input.completedAt ?? null,
    contextObjectIds: [...(input.contextObjectIds ?? [])],
    deadline: input.deadline ?? null,
    notes: input.notes ?? "",
    occurrences: (input.occurrences ?? []).map(normalizeOccurrence),
    priority: normalizePriority(input.priority),
    recurrence: input.recurrence ? normalizeRecurrence(input.recurrence) : null,
    scheduledDate: input.scheduledDate ?? null,
    statusId,
    tagIds: [...(input.tagIds ?? [])],
  };
}

export function createTaskManagementMetadata(
  input: CreateTaskManagementMetadataInput = {},
): TaskManagementMetadata {
  const metadata = migrateLegacyTaskManagementMetadata(
    input,
    input.statusRegistry ?? createDefaultTaskStatusRegistry("default"),
  );
  const validation = validateTaskManagementMetadata(
    metadata,
    input.statusRegistry,
  );
  if (!validation.ok) throw new TypeError(validation.error);
  return metadata;
}

function validateStatus(
  value: Record<string, unknown>,
  registry: TaskStatusRegistry | undefined,
): string | null {
  if (!("statusId" in value) && "status" in value) {
    return ["inbox", "open", "in-progress", "completed"].includes(
      String(value.status),
    )
      ? null
      : "Task status is invalid.";
  }
  if (value.statusId !== null && typeof value.statusId !== "string") {
    return "Task status is invalid.";
  }
  if (
    registry &&
    value.statusId !== null &&
    !statusById(registry, String(value.statusId))
  ) {
    return "Task status is invalid.";
  }
  return null;
}

function validateTaskIdentityFields(
  value: Record<string, unknown>,
  registry: TaskStatusRegistry | undefined,
): string | null {
  const statusError = validateStatus(value, registry);
  if (statusError) return statusError;
  if (!priorities.has(value.priority as TaskPriority)) {
    return "Task priority is invalid.";
  }
  return null;
}

function validateTaskDates(value: Record<string, unknown>): string | null {
  if (
    !isNullableDateOnly(value.scheduledDate) ||
    !isNullableDateOnly(value.deadline) ||
    (value.completedAt !== null && !isInstant(value.completedAt))
  ) {
    return "Task dates must use YYYY-MM-DD.";
  }
  return null;
}

function validateTaskCollections(
  value: Record<string, unknown>,
): string | null {
  if (
    !Array.isArray(value.contextObjectIds) ||
    !hasUniqueStrings(value.contextObjectIds as string[])
  ) {
    return "Task context ids must be unique non-empty strings.";
  }
  if (
    !Array.isArray(value.tagIds) ||
    !hasUniqueStrings(value.tagIds as string[])
  ) {
    return "Task tag ids must be unique non-empty strings.";
  }
  return null;
}

function validWeekday(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 6;
}

function validOrdinal(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5;
}

function isRecurrenceEnd(value: unknown): boolean {
  if (value === undefined) return true;
  if (!isRecord(value)) return false;
  if (value.kind === "never") return true;
  return value.kind === "on-date" && isDateOnly(value.date);
}

function hasValidWeekdays(value: Record<string, unknown>): boolean {
  if (value.weekdays === undefined) return true;
  return Array.isArray(value.weekdays) && value.weekdays.every(validWeekday);
}

function isValidRecurrenceInterval(value: unknown): boolean {
  return Number.isInteger(value) && Number(value) > 0;
}

function isRecurrenceRule(value: unknown): value is TaskRecurrenceRule {
  if (!isRecord(value)) return false;
  const mode = normalizeMode(value.mode as LegacyTaskRecurrenceMode);
  const unit = normalizeUnit(value as TaskRecurrenceRule);
  if (!["scheduled-date", "completion-date"].includes(mode)) return false;
  if (!["day", "week", "month", "year"].includes(unit)) return false;
  if (!isValidRecurrenceInterval(value.interval)) return false;
  return hasValidWeekdays(value) && isRecurrenceEnd(value.end);
}

function isOccurrence(value: unknown): value is TaskOccurrence {
  return (
    isRecord(value) &&
    ["advance-one", "complete", "skip", "excuse"].includes(
      String(value.action),
    ) &&
    isInstant(value.actedAt) &&
    isDateOnly(value.actedOnDate) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    isNullableDateOnly(value.deadline) &&
    isNullableDateOnly(value.scheduledDate) &&
    (value.statusId === null || typeof value.statusId === "string")
  );
}

function validateTaskDetails(value: Record<string, unknown>): string | null {
  if (typeof value.notes !== "string" || typeof value.completed !== "boolean") {
    return "Task notes or completion state is invalid.";
  }
  if (value.recurrence !== null && !isRecurrenceRule(value.recurrence)) {
    return "Task recurrence rule is invalid.";
  }
  if (
    !Array.isArray(value.occurrences) ||
    !value.occurrences.every(isOccurrence)
  ) {
    return "Task occurrences are invalid.";
  }
  return null;
}

export function validateTaskManagementMetadata(
  value: unknown,
  registry?: TaskStatusRegistry,
): ValidationResult {
  if (!isRecord(value)) {
    return { error: "Task metadata must be an object.", ok: false };
  }
  const normalized =
    "statusId" in value
      ? value
      : migrateLegacyTaskManagementMetadata(
          value as LegacyTaskManagementMetadata,
          registry,
        );
  const error =
    validateTaskIdentityFields(normalized, registry) ??
    validateTaskDates(normalized) ??
    validateTaskCollections(normalized) ??
    validateTaskDetails(normalized);
  return error
    ? { error, ok: false }
    : { ok: true, value: normalized as TaskManagementMetadata };
}

function dateAtUtcMidnight(value: string): Date {
  assertDateOnly(value);
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

function compareDateOnly(left: string, right: string): number {
  assertDateOnly(left);
  assertDateOnly(right);
  return left.localeCompare(right);
}

function addMonthsClamped(
  value: string,
  months: number,
  desiredDay?: number,
): string {
  const source = dateAtUtcMidnight(value);
  const targetYear = source.getUTCFullYear();
  const targetMonth = source.getUTCMonth() + months;
  const day = desiredDay ?? source.getUTCDate();
  const first = new Date(Date.UTC(targetYear, targetMonth, 1));
  const last = new Date(
    Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0),
  );
  const clampedDay = Math.min(day, last.getUTCDate());
  return formatDateOnly(
    new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), clampedDay)),
  );
}

function addYearsClamped(
  value: string,
  years: number,
  month?: number,
  day?: number,
): string {
  const source = dateAtUtcMidnight(value);
  const targetYear = source.getUTCFullYear() + years;
  const targetMonth = (month ?? source.getUTCMonth() + 1) - 1;
  const desiredDay = day ?? source.getUTCDate();
  const last = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  return formatDateOnly(
    new Date(Date.UTC(targetYear, targetMonth, Math.min(desiredDay, last))),
  );
}

function lastWeekdayOfMonth(
  year: number,
  monthIndex: number,
  weekday: number,
): string {
  const date = new Date(Date.UTC(year, monthIndex + 1, 0));
  while (date.getUTCDay() !== weekday) date.setUTCDate(date.getUTCDate() - 1);
  return formatDateOnly(date);
}

function ordinalWeekdayOfMonth(
  year: number,
  monthIndex: number,
  ordinal: number,
  weekday: number,
): string {
  const date = new Date(Date.UTC(year, monthIndex, 1));
  while (date.getUTCDay() !== weekday) date.setUTCDate(date.getUTCDate() + 1);
  date.setUTCDate(date.getUTCDate() + (ordinal - 1) * 7);
  if (date.getUTCMonth() !== monthIndex) {
    return lastWeekdayOfMonth(year, monthIndex, weekday);
  }
  return formatDateOnly(date);
}

function nextWeeklyDate(
  baseDate: string,
  interval: number,
  weekdays: readonly number[] | undefined,
): string {
  if (!weekdays || weekdays.length === 0)
    return addDays(baseDate, interval * 7);
  const sorted = [...new Set(weekdays)].sort((left, right) => left - right);
  const currentWeekday = dateAtUtcMidnight(baseDate).getUTCDay();
  const sameWeek = sorted.find((weekday) => weekday > currentWeekday);
  if (sameWeek !== undefined)
    return addDays(baseDate, sameWeek - currentWeekday);
  return addDays(baseDate, interval * 7 - currentWeekday + sorted[0]);
}

function nextMonthlyDate(baseDate: string, rule: TaskRecurrenceRule): string {
  const target = dateAtUtcMidnight(addMonthsClamped(baseDate, rule.interval));
  if (!rule.monthly) return formatDateOnly(target);
  if (rule.monthly.kind === "day-of-month") {
    return addMonthsClamped(baseDate, rule.interval, rule.monthly.day);
  }
  if (rule.monthly.kind === "last-day") {
    return formatDateOnly(
      new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)),
    );
  }
  if (rule.monthly.kind === "last-weekday") {
    return lastWeekdayOfMonth(
      target.getUTCFullYear(),
      target.getUTCMonth(),
      rule.monthly.weekday,
    );
  }
  if (
    !validOrdinal(rule.monthly.ordinal) ||
    !validWeekday(rule.monthly.weekday)
  ) {
    throw new TypeError("Invalid recurrence rule.");
  }
  return ordinalWeekdayOfMonth(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    rule.monthly.ordinal,
    rule.monthly.weekday,
  );
}

function nextYearlyDate(baseDate: string, rule: TaskRecurrenceRule): string {
  if (!rule.yearly) return addYearsClamped(baseDate, rule.interval);
  if ("day" in rule.yearly) {
    return addYearsClamped(
      baseDate,
      rule.interval,
      rule.yearly.month,
      rule.yearly.day,
    );
  }
  const source = dateAtUtcMidnight(baseDate);
  return ordinalWeekdayOfMonth(
    source.getUTCFullYear() + rule.interval,
    rule.yearly.month - 1,
    rule.yearly.ordinal,
    rule.yearly.weekday,
  );
}

export function nextRecurringTaskDate(
  baseDate: string,
  recurrence: TaskRecurrenceRule,
): string | null {
  if (!isRecurrenceRule(recurrence)) {
    throw new TypeError("Invalid recurrence rule.");
  }
  const normalized = normalizeRecurrence(recurrence);
  const unit = normalized.unit ?? "month";
  const next =
    unit === "day"
      ? addDays(baseDate, normalized.interval)
      : unit === "week"
        ? nextWeeklyDate(baseDate, normalized.interval, normalized.weekdays)
        : unit === "month"
          ? nextMonthlyDate(baseDate, normalized)
          : nextYearlyDate(baseDate, normalized);
  return normalized.end?.kind === "on-date" &&
    compareDateOnly(next, normalized.end.date) > 0
    ? null
    : next;
}

function occurrenceId(
  metadata: TaskManagementMetadata,
  command: TaskOccurrenceCommand,
): string {
  const sequence = metadata.occurrences.length + 1;
  return `occurrence:${command.actedOnDate}:${sequence}`;
}

function recurrenceBaseDate(
  metadata: TaskManagementMetadata,
  command: TaskOccurrenceCommand,
): string {
  if (
    metadata.recurrence &&
    normalizeMode(metadata.recurrence.mode) === "completion-date"
  ) {
    return command.actedOnDate;
  }
  return metadata.scheduledDate ?? command.actedOnDate;
}

function dayDelta(left: string, right: string): number {
  return Math.round(
    (dateAtUtcMidnight(left).getTime() - dateAtUtcMidnight(right).getTime()) /
      86_400_000,
  );
}

function advanceToFuture(
  baseDate: string,
  actedOnDate: string,
  recurrence: TaskRecurrenceRule,
): string | null {
  let next = nextRecurringTaskDate(baseDate, recurrence);
  while (next && compareDateOnly(next, actedOnDate) <= 0) {
    next = nextRecurringTaskDate(next, recurrence);
  }
  return next;
}

function applyNonRecurringOccurrence(
  metadata: TaskManagementMetadata,
  command: TaskOccurrenceCommand,
  occurrences: TaskOccurrence[],
): TaskManagementMetadata {
  return {
    ...metadata,
    completed: command.action === "complete",
    completedAt:
      command.action === "complete"
        ? new Date(command.actedAt).toISOString()
        : metadata.completedAt,
    occurrences,
  };
}

function nextOccurrenceDate(
  metadata: TaskManagementMetadata & { recurrence: TaskRecurrenceRule },
  command: TaskOccurrenceCommand,
): string | null {
  const baseDate = recurrenceBaseDate(metadata, command);
  return command.catchUp === "next-future"
    ? advanceToFuture(baseDate, command.actedOnDate, metadata.recurrence)
    : nextRecurringTaskDate(baseDate, metadata.recurrence);
}

function recurringDeadlineOffset(
  metadata: TaskManagementMetadata,
): number | null {
  if (!metadata.deadline || !metadata.scheduledDate) return null;
  return Math.max(0, dayDelta(metadata.deadline, metadata.scheduledDate));
}

function assertValidOccurrenceCommand(command: TaskOccurrenceCommand) {
  if (!["advance-one", "complete", "skip", "excuse"].includes(command.action)) {
    throw new TypeError("Occurrence action date is invalid.");
  }
  if (!isDateOnly(command.actedOnDate) || !isInstant(command.actedAt)) {
    throw new TypeError("Occurrence action date is invalid.");
  }
}

function applyRecurringOccurrence(
  metadata: TaskManagementMetadata & { recurrence: TaskRecurrenceRule },
  command: TaskOccurrenceCommand,
  occurrences: TaskOccurrence[],
): TaskManagementMetadata {
  const nextDate = nextOccurrenceDate(metadata, command);
  const deadlineOffset = recurringDeadlineOffset(metadata);
  return {
    ...metadata,
    completed: nextDate === null,
    completedAt:
      nextDate === null ? new Date(command.actedAt).toISOString() : null,
    deadline:
      nextDate && deadlineOffset !== null
        ? addDays(nextDate, deadlineOffset)
        : metadata.deadline,
    occurrences,
    scheduledDate: nextDate,
  };
}

export function applyTaskOccurrenceAction(
  metadata: TaskManagementMetadata,
  command: TaskOccurrenceCommand,
): TaskManagementMetadata {
  const validation = validateTaskManagementMetadata(metadata);
  if (!validation.ok) throw new TypeError(validation.error);
  if (metadata.completed) {
    throw new TypeError(
      "Completed task cannot receive another occurrence action.",
    );
  }
  assertValidOccurrenceCommand(command);

  const occurrence: TaskOccurrence = {
    action: command.action,
    actedAt: new Date(command.actedAt).toISOString(),
    actedOnDate: command.actedOnDate,
    ...(command.catchUp ? { catchUp: command.catchUp } : {}),
    deadline: metadata.deadline,
    id: occurrenceId(metadata, command),
    scheduledDate: metadata.scheduledDate,
    statusId: metadata.statusId,
  };
  const occurrences = [...metadata.occurrences, occurrence];

  if (!metadata.recurrence) {
    return applyNonRecurringOccurrence(metadata, command, occurrences);
  }

  return applyRecurringOccurrence(
    metadata as TaskManagementMetadata & { recurrence: TaskRecurrenceRule },
    command,
    occurrences,
  );
}

function metadataForEntity(
  entity: TaskLikeEntity,
  registry: TaskStatusRegistry,
): TaskManagementMetadata {
  if (entity.task) return entity.task;
  return createTaskManagementMetadata({
    completed: entity.completed ?? false,
    deadline: entity.dueDate ?? null,
    scheduledDate: entity.dueDate ?? null,
    statusRegistry: registry,
  });
}

function isCompleted(
  metadata: TaskManagementMetadata,
  registry: TaskStatusRegistry,
): boolean {
  return completionFor(metadata.statusId, metadata.completed, registry);
}

function isInProgress(
  metadata: TaskManagementMetadata,
  registry: TaskStatusRegistry,
): boolean {
  const status = statusById(registry, metadata.statusId);
  return status?.id.endsWith(":in-progress") ?? false;
}

function relevantDate(
  metadata: TaskManagementMetadata,
  today: string,
): string | null {
  if (metadata.deadline && compareDateOnly(metadata.deadline, today) <= 0) {
    return metadata.deadline;
  }
  return metadata.scheduledDate ?? metadata.deadline;
}

function priorityRank(priority: TaskPriority): number {
  return { high: 0, low: 2, medium: 1, none: 3 }[priority];
}

function compareTaskEntities(
  left: TaskLikeEntity,
  right: TaskLikeEntity,
  registry: TaskStatusRegistry,
  today: string,
): number {
  const leftTask = metadataForEntity(left, registry);
  const rightTask = metadataForEntity(right, registry);
  const leftDate = relevantDate(leftTask, today);
  const rightDate = relevantDate(rightTask, today);
  return (
    Number(isCompleted(leftTask, registry)) -
      Number(isCompleted(rightTask, registry)) ||
    priorityRank(leftTask.priority) - priorityRank(rightTask.priority) ||
    (leftDate ?? "9999-12-31").localeCompare(rightDate ?? "9999-12-31") ||
    left.id.localeCompare(right.id)
  );
}

function matchesDashboard(
  kind: TaskDashboardKind,
  entity: TaskLikeEntity,
  registry: TaskStatusRegistry,
  today: string,
): boolean {
  if (entity.kind !== "task") return false;
  const task = metadataForEntity(entity, registry);
  const completed = isCompleted(task, registry);
  switch (kind) {
    case "all":
      return true;
    case "completed":
      return completed;
    case "open":
      return !completed;
    case "context":
      return task.contextObjectIds.length > 0;
    case "tags":
      return task.tagIds.length > 0;
    case "scheduled":
      return isDashboardScheduledTask(task, completed);
    case "today":
      return isDashboardTodayTask(task, completed, today);
    case "inbox":
      return isDashboardInboxTask(task, completed);
  }
}

function isDashboardScheduledTask(
  task: TaskManagementMetadata,
  completed: boolean,
): boolean {
  return Boolean(task.scheduledDate) && !completed;
}

function isDashboardTodayTask(
  task: TaskManagementMetadata,
  completed: boolean,
  today: string,
): boolean {
  if (completed) return false;
  if (task.scheduledDate === today) return true;
  return (
    Boolean(task.deadline) &&
    compareDateOnly(task.deadline as string, today) <= 0
  );
}

function isDashboardInboxTask(
  task: TaskManagementMetadata,
  completed: boolean,
): boolean {
  return (
    !completed &&
    !task.scheduledDate &&
    !task.deadline &&
    task.statusId === null
  );
}

export function projectTaskDashboardEntities<T extends TaskLikeEntity>(
  kind: TaskDashboardKind,
  entities: readonly T[],
  registry: TaskStatusRegistry,
  today: string,
): readonly T[] {
  assertDateOnly(today);
  return entities
    .filter((entity) => matchesDashboard(kind, entity, registry, today))
    .sort((left, right) => compareTaskEntities(left, right, registry, today));
}

export function projectCalendarTodayTasks<T extends TaskLikeEntity>(
  entities: readonly T[],
  registry: TaskStatusRegistry,
  today: string,
): readonly T[] {
  assertDateOnly(today);
  return entities
    .filter((entity) => {
      if (entity.kind !== "task") return false;
      const task = metadataForEntity(entity, registry);
      return (
        task.scheduledDate === today ||
        (!!task.scheduledDate &&
          compareDateOnly(task.scheduledDate, today) < 0 &&
          !isCompleted(task, registry)) ||
        isInProgress(task, registry) ||
        (!!task.completedAt && task.completedAt.slice(0, 10) === today)
      );
    })
    .sort((left, right) => compareTaskEntities(left, right, registry, today));
}

export function taskRecurrenceStatistics(
  metadata: TaskManagementMetadata,
  _today: string,
): {
  readonly bestStreak: number;
  readonly completionRate: number;
  readonly currentStreak: number;
  readonly heatmap: Readonly<Record<string, TaskOccurrenceAction>>;
  readonly totalCompletions: number;
} {
  let currentStreak = 0;
  let bestStreak = 0;
  let completed = 0;
  const heatmap: Record<string, TaskOccurrenceAction> = {};
  for (const occurrence of metadata.occurrences) {
    heatmap[occurrence.actedOnDate] = occurrence.action;
    if (occurrence.action === "complete") {
      completed += 1;
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else if (occurrence.action === "skip") {
      currentStreak = 0;
    }
  }
  return {
    bestStreak,
    completionRate:
      metadata.occurrences.length === 0
        ? 0
        : completed / metadata.occurrences.length,
    currentStreak,
    heatmap,
    totalCompletions: completed,
  };
}

function propertyFilter(
  propertyId: string,
  operator: "before" | "equals" | "exists" | "not-equals",
  value?: string | boolean | null,
): QueryFilter {
  return {
    kind: "property",
    operator,
    propertyId,
    ...(value === undefined ? {} : { value }),
  };
}

function dashboardFilters(
  kind: TaskDashboardKind,
  today: string,
): (QueryFilter | QueryFilterGroup)[] {
  if (kind === "all") return [];
  if (kind === "today") {
    return [
      {
        filters: [
          propertyFilter("scheduledDate", "equals", today),
          propertyFilter("deadline", "equals", today),
          propertyFilter("deadline", "before", today),
        ],
        operator: "any",
      },
    ];
  }
  if (kind === "scheduled") {
    return [propertyFilter("scheduledDate", "exists")];
  }
  if (kind === "completed") {
    return [propertyFilter("completed", "equals", true)];
  }
  if (kind === "open") {
    return [propertyFilter("completed", "equals", false)];
  }
  if (kind === "context") {
    return [propertyFilter("contextObjectIds", "exists")];
  }
  if (kind === "tags") return [propertyFilter("tagIds", "exists")];
  return [
    propertyFilter("completed", "equals", false),
    propertyFilter("scheduledDate", "not-equals", null),
  ];
}

export function createTaskDashboardQuery(
  kind: TaskDashboardKind,
  today: string,
): QueryDefinition {
  if (!isDateOnly(today)) {
    throw new TypeError("Task dashboard date must use YYYY-MM-DD.");
  }
  return {
    filters: { filters: dashboardFilters(kind, today), operator: "all" },
    resultKind: "object",
    selection: { mode: "all" },
    sorts: [
      { direction: "ascending", propertyId: "completed" },
      { direction: "descending", propertyId: "priority" },
      { direction: "ascending", propertyId: "deadline" },
      { direction: "ascending", propertyId: "scheduledDate" },
    ],
    source: "object-type",
    sourceValue: "task",
    variables: {},
    version: 1,
  };
}

export function createRecurringTaskQuery(
  kind: RecurringTaskQueryKind,
): QueryDefinition {
  const filters: QueryFilter[] = [propertyFilter("recurrence", "exists")];
  if (kind === "open") {
    filters.push(propertyFilter("completed", "equals", false));
  } else if (kind === "completed") {
    filters.push(propertyFilter("completed", "equals", true));
  }
  return {
    filters: { filters, operator: "all" },
    resultKind: "object",
    selection: { mode: "all" },
    sorts: [
      { direction: "ascending", propertyId: "completed" },
      { direction: "ascending", propertyId: "scheduledDate" },
      { direction: "ascending", propertyId: "deadline" },
    ],
    source: "object-type",
    sourceValue: "task",
    variables: {},
    version: 1,
  };
}
