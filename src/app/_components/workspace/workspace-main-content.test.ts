import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { expect, it } from "vitest";

import {
  getContextMenuPendingDetails,
  getWorkspaceTabPendingName,
} from "@/app/_components/workspace/workspace-main-content";

const projectRoot = process.cwd();

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

it("exposes Ladle stories for workspace main content and action states", () => {
  const componentSource = readProjectSource(
    "src/app/_components/workspace/workspace-main-content.tsx",
  );
  const storySource = readProjectSource(
    "src/app/_components/workspace/workspace-main-content.stories.tsx",
  );

  expect(componentSource).toContain("export function WorkspaceDefaultPanel");
  expect(storySource).toContain("WorkspaceMainContent");
  expect(storySource).toContain("export const Default");
  expect(storySource).toContain("export const PrimaryActions");
  expect(storySource).toContain("export const PendingStates");
  expect(storySource).toContain('"search"');
  expect(storySource).toContain('"calendar"');
  expect(storySource).toContain('"tasks"');
  expect(storySource).toContain('"pending:change-type"');
  expect(storySource).toContain('"pending:export"');
  expect(storySource).toContain('"pending:import"');
  expect(storySource).toContain('"pending:new-collection"');
  expect(storySource).toContain('"pending:new-from-template"');
  expect(storySource).toContain('"pending:new-query"');
  expect(storySource).toContain('"pending:pin-sidebar"');
  expect(storySource).toContain('"pending:present"');
  expect(storySource).toContain('"pending:settings"');
  expect(storySource).toContain('"pending:share"');
});

it("keeps Explore out of the main content panel like Capacities", () => {
  const componentSource = readProjectSource(
    "src/app/_components/workspace/workspace-main-content.tsx",
  );

  expect(componentSource).not.toContain("function ExploreActionPanel");
  expect(componentSource).not.toContain('activeAction === "explore"');
  expect(componentSource).not.toContain("primary-action:explore");
});

it("documents every WorkspaceMainContent component surface", () => {
  const architectureDoc = readProjectSource(
    "docs/workspace/workspace-main-content.architecture.md",
  );

  for (const componentName of [
    "WorkspaceMainContent",
    "WorkspaceDefaultPanel",
    "WorkspaceActionPanelHeader",
    "SearchActionPanel",
    "CalendarActionPanel",
    "TasksActionPanel",
    "ContextMenuPendingActionPanel",
    "WorkspaceObjectRenderer",
    "WorkspaceObjectTypeListView",
    "PendingImplementation",
  ]) {
    expect(architectureDoc).toContain(`\`${componentName}\``);
  }

  expect(architectureDoc).toContain("## Component Responsibilities");
});

it("keeps workspace action panels on Capacities app tokens", () => {
  const componentSource = readProjectSource(
    "src/app/_components/workspace/workspace-main-content.tsx",
  );

  expect(componentSource).toContain("workspaceActionPanelClass");
  expect(componentSource).toContain("bg-[var(--app-bg-front)]");
  expect(componentSource).toContain("border-[var(--app-border-front)]");
  expect(componentSource).toContain("text-[var(--app-text-secondary)]");
  expect(componentSource).not.toContain("flex h-full min-h-0 flex-col gap-4 bg-card px-6 py-4");
  expect(componentSource).not.toContain("border border-border bg-background p-4");
});
