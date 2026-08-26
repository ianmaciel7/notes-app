import assert from "node:assert/strict";
import test from "node:test";

import { blockEditorDocumentFromPlainText } from "../src/editor/document.ts";
import {
  createDailyNoteIdentity,
  createDateReferenceIndex,
  createDayContext,
  matchesDateQuery,
  normalizeDatePropertyValue,
  projectCalendarEntries,
  validateDrivingDatePropertyConfig,
} from "../src/lib/workspace-dates-calendar.ts";
import { createCustomStructure } from "../src/lib/workspace-object-types.ts";
import {
  createInitialWorkspaceObjectState,
  workspaceObjectReducer,
} from "../src/lib/workspace-objects.ts";

function reduce(state, ...actions) {
  return actions.reduce(workspaceObjectReducer, state);
}

function expectSuccess(result) {
  assert.equal(result.ok, true, result.ok ? undefined : result.error.message);
  return result.value;
}

test("date values preserve all-day, timed, range, timezone, and DST semantics", () => {
  const allDay = normalizeDatePropertyValue("2026-03-08", "America/New_York");
  const timed = normalizeDatePropertyValue({
    allDay: false,
    start: "2026-03-08T06:30:00.000Z",
    timeZone: "America/New_York",
  });
  const range = normalizeDatePropertyValue({
    allDay: true,
    end: "2026-03-10",
    start: "2026-03-08",
    timeZone: "America/New_York",
  });

  assert.deepEqual(allDay, {
    allDay: true,
    start: "2026-03-08",
    timeZone: "America/New_York",
  });
  assert.equal(matchesDateQuery(timed, "on", "2026-03-08"), true);
  assert.equal(
    matchesDateQuery(range, "within", {
      end: "2026-03-09",
      start: "2026-03-09",
    }),
    true,
  );
});

test("daily notes are unique per space and date and repeated captures append", () => {
  const state = reduce(
    createInitialWorkspaceObjectState(),
    {
      appendText: "Morning",
      date: "2026-08-25",
      spaceId: "labs",
      type: "createOrAppendDailyNote",
    },
    {
      appendText: "Evening",
      date: "2026-08-25",
      spaceId: "labs",
      type: "createOrAppendDailyNote",
    },
  );

  assert.equal(state.entities.length, 1);
  assert.deepEqual(state.entities[0].dailyNote, {
    date: "2026-08-25",
    spaceId: "labs",
  });
  assert.equal(
    createDailyNoteIdentity("labs", "2026-08-25"),
    "daily-note:labs:2026-08-25",
  );
  assert.match(JSON.stringify(state.entities[0].body), /Morning/);
  assert.match(JSON.stringify(state.entities[0].body), /Evening/);
});

test("date references, explicit driving properties, spans, and day context derive from canonical objects", () => {
  const startsAt = {
    id: "startsAt",
    multiple: false,
    name: "Starts at",
    ownership: "normal",
    valueType: "date",
    writable: true,
  };
  const endsAt = { ...startsAt, id: "endsAt", name: "Ends at" };
  const registry = expectSuccess(
    createCustomStructure(
      createInitialWorkspaceObjectState().structures,
      {
        iconName: "meeting",
        lifecycleKind: "document",
        pluralName: "Events",
        propertyDefinitions: [startsAt, endsAt],
        singularName: "Event",
        tone: "red",
      },
      () => "event",
    ),
  );
  assert.equal(
    validateDrivingDatePropertyConfig(registry, { event: "startsAt" }),
    true,
  );

  const state = reduce(
    { ...createInitialWorkspaceObjectState(), structures: registry },
    { date: "2026-08-25", spaceId: "labs", type: "createOrAppendDailyNote" },
    { type: "beginCreate", objectTypeId: "event" },
    {
      id: "created-event-2",
      patch: {
        body: blockEditorDocumentFromPlainText("See [[2026-08-25]]"),
        title: "Planning",
      },
      type: "updateEntity",
    },
    {
      id: "created-event-2",
      propertyId: "startsAt",
      type: "setPropertyValue",
      value: "2026-08-25",
    },
    { type: "beginCreate", objectTypeId: "task" },
    { title: "Ship local calendar", type: "commitTask" },
    {
      id: "created-task-3",
      patch: { dueDate: "2026-08-25", title: "Ship local calendar" },
      type: "updateEntity",
    },
  );

  const references = createDateReferenceIndex(state.entities);
  assert.equal(references.byDate.get("2026-08-25").length, 1);

  for (const span of ["month", "week", "three-day", "day"]) {
    const projection = projectCalendarEntries(state.entities, registry, {
      date: "2026-08-25",
      drivingDateProperties: { event: "startsAt" },
      spaceId: "labs",
      span,
    });
    assert.ok(projection.days.length >= 1);
    assert.ok(projection.entries.some((entry) => entry.kind === "daily-note"));
    assert.ok(
      projection.entries.some((entry) => entry.kind === "dated-object"),
    );
    assert.ok(projection.entries.some((entry) => entry.kind === "task"));
    assert.ok(
      projection.entries.some((entry) => entry.kind === "date-reference"),
    );
  }

  const day = createDayContext(state.entities, registry, {
    date: "2026-08-25",
    drivingDateProperties: { event: "startsAt" },
    spaceId: "labs",
  });
  assert.equal(day.dailyNote?.dailyNote?.date, "2026-08-25");
  assert.equal(day.references.length, 1);
  assert.ok(day.timeline.length >= 4);
});
