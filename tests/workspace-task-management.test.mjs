import assert from "node:assert/strict";
import test from "node:test";

import {
  applyTaskOccurrenceAction,
  createTaskDashboardQuery,
  createTaskManagementMetadata,
  nextRecurringTaskDate,
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
  assert.deepEqual(excused.occurrences.map((item) => item.action), ["skip", "excuse"]);
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
  assert.equal(completed.status, "completed");
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
  assert.ok(today.filters.filters.some((filter) => filter.kind === "property" && filter.propertyId === "scheduledDate"));
  assert.ok(completed.filters.filters.some((filter) => filter.kind === "property" && filter.propertyId === "completed"));
});

test("invalid dates, recurrence intervals, and duplicate ids are rejected", () => {
  assert.equal(validateTaskManagementMetadata({ scheduledDate: "not-a-date" }).ok, false);
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
