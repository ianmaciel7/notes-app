import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { expect, it } from "vitest";

import {
  getContextMenuPendingDetails,
  getWorkspaceTabPendingName,
} from "@/components/workspace-main-content";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));

function readProjectSource(relativePath: string) {
  return readFileSync(new URL(relativePath, `file://${projectRoot}/`), "utf8");
}

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

it("exposes Ladle stories for workspace main content and its default panel", () => {
  const componentSource = readProjectSource("src/components/workspace-main-content.tsx");
  const storySource = readProjectSource("src/components/workspace-main-content.stories.tsx");

  expect(componentSource).toContain("export function WorkspaceDefaultPanel");
  expect(storySource).toContain("WorkspaceMainContent");
  expect(storySource).toContain("WorkspaceDefaultPanel");
  expect(storySource).toContain("MainContentDefaultRoute");
  expect(storySource).toContain("DefaultPanelPagesPending");
  expect(storySource).toContain("SearchAction");
  expect(storySource).toContain("CalendarAction");
  expect(storySource).toContain("ExploreAction");
  expect(storySource).toContain("TasksAction");
  expect(storySource).toContain("PendingChangeTypeAction");
  expect(storySource).toContain("PendingExportAction");
  expect(storySource).toContain("PendingImportAction");
  expect(storySource).toContain("PendingNewCollectionAction");
  expect(storySource).toContain("PendingNewFromTemplateAction");
  expect(storySource).toContain("PendingNewQueryAction");
  expect(storySource).toContain("PendingPinSidebarAction");
  expect(storySource).toContain("PendingPresentAction");
  expect(storySource).toContain("PendingSettingsAction");
  expect(storySource).toContain("PendingShareAction");
});
