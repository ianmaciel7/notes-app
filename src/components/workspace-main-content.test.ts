import { expect, it } from "vitest";

import {
  getContextMenuPendingDetails,
  getWorkspaceTabPendingName,
} from "@/components/workspace-main-content";

it("uses the active workspace tab label for pending implementation names", () => {
  expect(
    getWorkspaceTabPendingName(
      [
        { id: "page", label: "Pages" },
        { id: "explore", label: "Explore" },
      ],
      "explore",
      "Fallback",
    ),
  ).toBe("Explore");
});

it("falls back when the active workspace tab is missing", () => {
  expect(getWorkspaceTabPendingName([{ id: "page", label: "Pages" }], "missing", "Fallback")).toBe(
    "Fallback",
  );
});

it("gives every unavailable context action a named pending implementation", () => {
  expect(getContextMenuPendingDetails("change-type")).toEqual({
    description: "Change type should be implemented here.",
    name: "Change type",
  });
  expect(getContextMenuPendingDetails("present")).toEqual({
    description: "Present should be implemented here.",
    name: "Present",
  });
  expect(getContextMenuPendingDetails("import")).toEqual({
    description: "Import should be implemented here.",
    name: "Import",
  });
});
