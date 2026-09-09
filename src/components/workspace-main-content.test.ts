import { expect, it } from "vitest";

import { getWorkspaceTabPendingName } from "@/components/workspace-main-content";

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
