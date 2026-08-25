import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [
  surfaceSource,
  contentSurfaceSource,
  legacyContentSource,
  objectPageSource,
  objectTypeSource,
  dataViewSource,
  listTableSource,
  objectViewSource,
] = await Promise.all([
  readFile("src/components/ui/workspace-surface.tsx", "utf8"),
  readFile("src/components/workspace-content-surface.tsx", "utf8"),
  readFile("src/components/workspace-content.tsx", "utf8"),
  readFile("src/components/workspace-object-page-view.tsx", "utf8"),
  readFile("src/components/workspace-object-type-view.tsx", "utf8"),
  readFile("src/components/data-view-renderer.tsx", "utf8"),
  readFile("src/components/data-view-list-table.tsx", "utf8"),
  readFile("src/components/object-view-renderer.tsx", "utf8"),
]);

test("workspace routes consume the shared surface contracts", () => {
  for (const contract of [
    "workspaceRouteClass",
    "workspaceLongformColumnClass",
    "workspaceEditorSurfaceClass",
    "workspaceOverviewContentClass",
    "workspaceListSurfaceClass",
    "workspaceListRowClass",
    "workspaceNamedCardClass",
    "WorkspaceEmptyState",
  ]) {
    assert.match(
      surfaceSource,
      new RegExp(`const ${contract}|function ${contract}`),
    );
  }

  assert.match(contentSurfaceSource, /workspaceContentScopeClass/);
  assert.match(contentSurfaceSource, /WorkspaceContentSurface/);
  assert.match(contentSurfaceSource, /AtomicNotesWorkspace/);
  assert.match(contentSurfaceSource, /ExploreWorkspace/);
  assert.match(objectPageSource, /workspaceLongformColumnClass/);
  assert.match(objectPageSource, /workspaceListSurfaceClass/);
  assert.match(objectTypeSource, /workspaceOverviewContentClass/);
  assert.match(dataViewSource, /WorkspaceEmptyState/);
  assert.match(listTableSource, /workspaceListRowClass/);
  assert.match(objectViewSource, /workspaceNamedCardClass/);
});

test("surface alignment does not mutate entity or storage contracts", () => {
  for (const source of [
    surfaceSource,
    contentSurfaceSource,
    legacyContentSource,
    objectPageSource,
    objectTypeSource,
    dataViewSource,
    listTableSource,
    objectViewSource,
  ]) {
    assert.doesNotMatch(source, /WORKSPACE_STORAGE_SCHEMA_VERSION\s*=/);
    assert.doesNotMatch(source, /notes-app:workspace-objects/);
  }
});
