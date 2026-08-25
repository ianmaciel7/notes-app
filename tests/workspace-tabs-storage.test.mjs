import assert from "node:assert/strict";
import test from "node:test";
import {
  parseWorkspaceTabsState,
  serializeWorkspaceTabsState,
  WORKSPACE_TABS_STORAGE_KEY,
} from "../src/lib/workspace-tabs-storage.ts";

test("workspace tabs storage round-trips active panes and tab flags", () => {
  const raw = serializeWorkspaceTabsState({
    main: {
      value: "created-page-1",
      tabs: [
        { id: "atomic-note", draggable: false },
        { id: "created-page-1", pinned: true, draggable: true },
      ],
    },
    side: {
      value: "graphView",
      tabs: [
        { id: "explore", draggable: false },
        { id: "graphView", draggable: true },
      ],
    },
  });

  const parsed = parseWorkspaceTabsState(raw);
  assert.equal(WORKSPACE_TABS_STORAGE_KEY, "notes-app:workspace-tabs:v1");
  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.state, {
    main: {
      value: "created-page-1",
      tabs: [
        { id: "atomic-note", draggable: false, pinned: undefined },
        { id: "created-page-1", pinned: true, draggable: true },
      ],
    },
    side: {
      value: "graphView",
      tabs: [
        { id: "explore", draggable: false, pinned: undefined },
        { id: "graphView", draggable: true, pinned: undefined },
      ],
    },
  });
});

test("workspace tabs storage sanitizes malformed and duplicate entries", () => {
  const parsed = parseWorkspaceTabsState(
    JSON.stringify({
      version: 1,
      main: {
        value: "  quote  ",
        tabs: [
          { id: "" },
          { id: " quote ", pinned: true },
          { id: "quote", pinned: false },
          { id: 123 },
        ],
      },
      side: {
        value: "",
        tabs: [{ id: "explore" }, { id: "explore" }, null],
      },
    }),
  );

  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.state, {
    main: {
      value: "quote",
      tabs: [{ id: "quote", pinned: true, draggable: undefined }],
    },
    side: {
      value: null,
      tabs: [{ id: "explore", pinned: undefined, draggable: undefined }],
    },
  });
});
