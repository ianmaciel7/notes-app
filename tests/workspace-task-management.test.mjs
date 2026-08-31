import assert from "node:assert/strict";
import test from "node:test";

import {
  applyTaskOccurrenceAction,
  createDefaultTaskStatusRegistry,
  createTaskDashboardQuery,
  createTaskManagementMetadata,
  migrateLegacyTaskManagementMetadata,
  nextRecurringTaskDate,
  projectCalendarTodayTasks,
  projectTaskDashboardEntities,
  taskRecurrenceStatistics,
  validateTaskManagementMetadata,
} from "../src/lib/workspace-task-management.ts";

function recurringTask(overrides = {}) {
  return createTaskManagementMetadata({
    scheduledDate: "2026-01-31",
    recurrence: {
      frequency: "monthly",
      interval: 1,
      mode: "schedule-driven",
    },
    ...overrides,
  });
}

test("task metadata keeps scheduled date and deadline independent", () => {
  const metadata = createTaskManagementMetadata({
    deadline: "2026-09-10",
    scheduledDate: "2026-09-03",
    priority: "high",
    status: "open",
    contextObjectIds: ["project-1"],
    tagIds: ["tag:work"],
    notes: "Prepare materials",
  });

  assert.equal(metadata.scheduledDate, "2026-09-03");
  assert.equal(metadata.deadline, "2026-09-10");
  assert.deepEqual(validateTaskManagementMetadata(metadata), {
    ok: true,
    value: metadata,
  });
});

test("task statuses are space-scoped and completion semantics are derived", () => {
  const registry = createDefaultTaskStatusRegistry("labs");
  const done = registry.definitions.find(
    (status) => status.completion === "complete",
  );
  const nextUp = registry.definitions.find(
    (status) => status.id === "labs:task-status:next-up",
  );
  const metadata = createTaskManagementMetadata({
    statusId: done.id,
    statusRegistry: registry,
  });

  assert.equal(registry.spaceId, "labs");
  assert.equal(nextUp.order, 20);
  assert.equal(metadata.completed, true);
  assert.equal(metadata.statusId, done.id);
  assert.equal(validateTaskManagementMetadata(metadata, registry).ok, true);
  assert.equal(
    validateTaskManagementMetadata(
      { ...metadata, statusId: "other:done" },
      registry,
    ).ok,
    false,
  );
});

test("legacy task status and urgent priority migrate without changing identity fields", () => {
  const registry = createDefaultTaskStatusRegistry("labs");
  const migrated = migrateLegacyTaskManagementMetadata(
    {
      completed: false,
      contextObjectIds: ["project-1"],
      deadline: "2026-09-10",
      notes: "Keep notes",
      occurrences: [],
      priority: "urgent",
      recurrence: { frequency: "daily", interval: 2, mode: "schedule-driven" },
      scheduledDate: "2026-09-03",
      status: "in-progress",
      tagIds: ["tag:work"],
    },
    registry,
  );

  assert.equal(migrated.priority, "high");
  assert.equal(migrated.statusId, "labs:task-status:in-progress");
  assert.equal(migrated.contextObjectIds[0], "project-1");
  assert.equal(migrated.deadline, "2026-09-10");
  assert.equal(migrated.scheduledDate, "2026-09-03");
  assert.equal(migrated.recurrence.unit, "day");
});

test("schedule-driven recurrence advances from the schedule even when completed late", () => {
  const task = recurringTask({
    scheduledDate: "2026-08-10",
    recurrence: { frequency: "weekly", interval: 1, mode: "schedule-driven" },
  });
  const next = applyTaskOccurrenceAction(task, {
    action: "complete",
    actedAt: "2026-08-15T12:00:00.000Z",
    actedOnDate: "2026-08-15",
  });

  assert.equal(next.scheduledDate, "2026-08-17");
  assert.equal(next.completed, false);
  assert.equal(next.occurrences.length, 1);
  assert.equal(next.occurrences[0].scheduledDate, "2026-08-10");
  assert.equal(next.occurrences[0].action, "complete");
});

test("completion-driven recurrence advances relative to completion", () => {
  const task = recurringTask({
    scheduledDate: "2026-08-10",
    recurrence: { frequency: "weekly", interval: 2, mode: "completion-driven" },
  });
  const next = applyTaskOccurrenceAction(task, {
    action: "complete",
    actedAt: "2026-08-15T12:00:00.000Z",
    actedOnDate: "2026-08-15",
  });

  assert.equal(next.scheduledDate, "2026-08-29");
  assert.equal(next.occurrences.length, 1);
});

test("monthly recurrence clamps month-end without drifting the source day", () => {
  assert.equal(
    nextRecurringTaskDate("2026-01-31", {
      frequency: "monthly",
      interval: 1,
      mode: "schedule-driven",
    }),
    "2026-02-28",
  );
  assert.equal(
    nextRecurringTaskDate("2028-01-31", {
      frequency: "monthly",
      interval: 1,
      mode: "schedule-driven",
    }),
    "2028-02-29",
  );
});

test("skip and excuse append auditable occurrences without duplicating task identity", () => {
  const task = recurringTask({ scheduledDate: "2026-01-31" });
  const skipped = applyTaskOccurrenceAction(task, {
    action: "skip",
    actedAt: "2026-01-31T09:00:00.000Z",
    actedOnDate: "2026-01-31",
  });
  const excused = applyTaskOccurrenceAction(skipped, {
    action: "excuse",
    actedAt: "2026-02-28T09:00:00.000Z",
    actedOnDate: "2026-02-28",
  });

  assert.equal(excused.occurrences.length, 2);
  assert.deepEqual(
    excused.occurrences.map((item) => item.action),
    ["skip", "excuse"],
  );
  assert.equal(excused.completed, false);
});

test("non-recurring completion closes the task once", () => {
  const task = createTaskManagementMetadata({ scheduledDate: "2026-08-25" });
  const completed = applyTaskOccurrenceAction(task, {
    action: "complete",
    actedAt: "2026-08-25T12:00:00.000Z",
    actedOnDate: "2026-08-25",
  });

  assert.equal(completed.completed, true);
  assert.equal(completed.completedAt, "2026-08-25T12:00:00.000Z");
  assert.equal(completed.occurrences.length, 1);
  assert.throws(() =>
    applyTaskOccurrenceAction(completed, {
      action: "complete",
      actedAt: "2026-08-25T13:00:00.000Z",
      actedOnDate: "2026-08-25",
    }),
  );
});

test("task dashboards are expressed as shared query definitions", () => {
  const today = createTaskDashboardQuery("today", "2026-08-25");
  const completed = createTaskDashboardQuery("completed", "2026-08-25");

  assert.equal(today.source, "object-type");
  assert.equal(today.sourceValue, "task");
  assert.ok(
    today.filters.filters.some(
      (filter) =>
        "filters" in filter &&
        filter.filters.some(
          (item) =>
            item.kind === "property" && item.propertyId === "scheduledDate",
        ),
    ),
  );
  assert.ok(
    completed.filters.filters.some(
      (filter) =>
        filter.kind === "property" && filter.propertyId === "completed",
    ),
  );
});

test("task dashboard membership derives inbox, today, scheduled, context, tags, open, completed, and all", () => {
  const registry = createDefaultTaskStatusRegistry("labs");
  const makeTask = (id, title, metadata) => ({
    id,
    title,
    objectTypeId: "task",
    kind: "task",
    createdAt: `2026-08-2${id}`,
    completed: metadata.completed,
    dueDate: metadata.deadline,
    propertyValues: { task: { type: "text", text: metadata } },
    task: metadata,
  });
  const entities = [
    makeTask(
      "1",
      "Inbox",
      createTaskManagementMetadata({
        statusId: null,
        statusRegistry: registry,
      }),
    ),
    makeTask(
      "2",
      "Scheduled",
      createTaskManagementMetadata({
        scheduledDate: "2026-08-26",
        statusId: null,
        statusRegistry: registry,
      }),
    ),
    makeTask(
      "3",
      "Due",
      createTaskManagementMetadata({
        deadline: "2026-08-25",
        priority: "high",
        statusId: null,
        statusRegistry: registry,
      }),
    ),
    makeTask(
      "4",
      "Context",
      createTaskManagementMetadata({
        contextObjectIds: ["ctx"],
        statusId: null,
        statusRegistry: registry,
      }),
    ),
    makeTask(
      "5",
      "Tagged",
      createTaskManagementMetadata({
        statusId: null,
        tagIds: ["tag"],
        statusRegistry: registry,
      }),
    ),
    makeTask(
      "6",
      "Done",
      createTaskManagementMetadata({
        statusId: "labs:task-status:done",
        statusRegistry: registry,
      }),
    ),
  ];

  assert.deepEqual(
    projectTaskDashboardEntities("inbox", entities, registry, "2026-08-25").map(
      (task) => task.id,
    ),
    ["1", "4", "5"],
  );
  assert.deepEqual(
    projectTaskDashboardEntities("today", entities, registry, "2026-08-25").map(
      (task) => task.id,
    ),
    ["3"],
  );
  assert.deepEqual(
    projectTaskDashboardEntities(
      "scheduled",
      entities,
      registry,
      "2026-08-25",
    ).map((task) => task.id),
    ["2"],
  );
  assert.deepEqual(
    projectTaskDashboardEntities(
      "context",
      entities,
      registry,
      "2026-08-25",
    ).map((task) => task.id),
    ["4"],
  );
  assert.deepEqual(
    projectTaskDashboardEntities("tags", entities, registry, "2026-08-25").map(
      (task) => task.id,
    ),
    ["5"],
  );
  assert.deepEqual(
    projectTaskDashboardEntities(
      "completed",
      entities,
      registry,
      "2026-08-25",
    ).map((task) => task.id),
    ["6"],
  );
  assert.deepEqual(
    projectTaskDashboardEntities("all", entities, registry, "2026-08-25").map(
      (task) => task.id,
    ),
    ["3", "2", "1", "4", "5", "6"],
  );
});

test("calendar today includes overdue scheduled, in-progress, and completed-today tasks separately", () => {
  const registry = createDefaultTaskStatusRegistry("labs");
  const tasks = [
    {
      id: "overdue",
      kind: "task",
      title: "Overdue",
      task: createTaskManagementMetadata({
        scheduledDate: "2026-08-24",
        statusId: null,
        statusRegistry: registry,
      }),
    },
    {
      id: "in-progress",
      kind: "task",
      title: "Doing",
      task: createTaskManagementMetadata({
        statusId: "labs:task-status:in-progress",
        statusRegistry: registry,
      }),
    },
    {
      id: "completed-today",
      kind: "task",
      title: "Done",
      task: createTaskManagementMetadata({
        completedAt: "2026-08-25T12:00:00.000Z",
        statusId: "labs:task-status:done",
        statusRegistry: registry,
      }),
    },
  ];

  assert.deepEqual(
    projectCalendarTodayTasks(tasks, registry, "2026-08-25").map(
      (task) => task.id,
    ),
    ["overdue", "in-progress", "completed-today"],
  );
});

test("recurrence rules cover weekdays, ordinal monthly, yearly, leap years, and end dates", () => {
  assert.equal(
    nextRecurringTaskDate("2026-08-24", {
      interval: 1,
      mode: "scheduled-date",
      unit: "week",
      weekdays: [1, 3],
    }),
    "2026-08-26",
  );
  assert.equal(
    nextRecurringTaskDate("2026-08-31", {
      interval: 1,
      mode: "scheduled-date",
      monthly: { kind: "ordinal-weekday", ordinal: 2, weekday: 2 },
      unit: "month",
    }),
    "2026-09-08",
  );
  assert.equal(
    nextRecurringTaskDate("2026-08-31", {
      interval: 1,
      mode: "scheduled-date",
      monthly: { kind: "last-weekday", weekday: 1 },
      unit: "month",
    }),
    "2026-09-28",
  );
  assert.equal(
    nextRecurringTaskDate("2028-02-29", {
      interval: 1,
      mode: "scheduled-date",
      unit: "year",
      yearly: { day: 29, month: 2 },
    }),
    "2029-02-28",
  );
  assert.equal(
    nextRecurringTaskDate("2026-08-31", {
      interval: 1,
      mode: "scheduled-date",
      unit: "year",
      yearly: { kind: "ordinal-weekday", month: 9, ordinal: 1, weekday: 1 },
    }),
    "2027-09-06",
  );
  assert.equal(
    nextRecurringTaskDate("2026-08-31", {
      end: { kind: "on-date", date: "2026-09-01" },
      interval: 1,
      mode: "scheduled-date",
      unit: "month",
    }),
    null,
  );
});

test("recurrence actions advance deadlines, support catch-up, and derive statistics", () => {
  const registry = createDefaultTaskStatusRegistry("labs");
  const task = createTaskManagementMetadata({
    deadline: "2026-08-12",
    recurrence: { interval: 1, mode: "scheduled-date", unit: "week" },
    scheduledDate: "2026-08-10",
    statusId: null,
    statusRegistry: registry,
  });
  const advanced = applyTaskOccurrenceAction(task, {
    action: "complete",
    actedAt: "2026-08-25T12:00:00.000Z",
    actedOnDate: "2026-08-25",
    catchUp: "next-future",
  });
  const excused = applyTaskOccurrenceAction(advanced, {
    action: "excuse",
    actedAt: "2026-08-31T12:00:00.000Z",
    actedOnDate: "2026-08-31",
  });
  const advancedOne = applyTaskOccurrenceAction(task, {
    action: "advance-one",
    actedAt: "2026-08-11T12:00:00.000Z",
    actedOnDate: "2026-08-11",
  });
  const stats = taskRecurrenceStatistics(excused, "2026-09-01");

  assert.equal(advanced.scheduledDate, "2026-08-31");
  assert.equal(advanced.deadline, "2026-09-02");
  assert.equal(advanced.occurrences[0].catchUp, "next-future");
  assert.equal(advancedOne.scheduledDate, "2026-08-17");
  assert.equal(advancedOne.occurrences[0].action, "advance-one");
  assert.equal(stats.totalCompletions, 1);
  assert.equal(stats.currentStreak, 1);
  assert.equal(stats.bestStreak, 1);
  assert.equal(stats.heatmap["2026-08-25"], "complete");
  assert.equal(stats.heatmap["2026-08-31"], "excuse");
});

test("invalid dates, recurrence intervals, and duplicate ids are rejected", () => {
  assert.equal(
    validateTaskManagementMetadata({ scheduledDate: "not-a-date" }).ok,
    false,
  );
  assert.equal(
    validateTaskManagementMetadata({
      scheduledDate: "2026-08-25",
      recurrence: { frequency: "daily", interval: 0, mode: "schedule-driven" },
    }).ok,
    false,
  );
  assert.equal(
    validateTaskManagementMetadata({
      contextObjectIds: ["project-1", "project-1"],
    }).ok,
    false,
  );
});
