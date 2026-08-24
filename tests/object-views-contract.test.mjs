import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [
  cardsSource,
  conversionSource,
  dataRendererSource,
  homeSource,
  listTableSource,
  objectRendererSource,
  supportSource,
  surfaceSource,
  switcherSource,
  viewsControllerSource,
  viewsSource,
] = await Promise.all([
  readFile(
    new URL("../src/components/data-view-cards.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../src/components/object-conversion-planner.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../src/components/data-view-renderer.tsx", import.meta.url),
    "utf8",
  ),
  readFile(new URL("../src/app/[locale]/page.tsx", import.meta.url), "utf8"),
  readFile(
    new URL("../src/components/data-view-list-table.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../src/components/object-view-renderer.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL("../src/components/object-view-support.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL(
      "../src/components/workspace-views-surface.tsx",
      import.meta.url,
    ),
    "utf8",
  ),
  readFile(
    new URL("../src/components/view-layout-switchers.tsx", import.meta.url),
    "utf8",
  ),
  readFile(
    new URL(
      "../src/components/workspace-views-controller.tsx",
      import.meta.url,
    ),
    "utf8",
  ),
  readFile(
    new URL("../src/lib/workspace-object-views.ts", import.meta.url),
    "utf8",
  ),
]);

const rendererSource = [
  cardsSource,
  dataRendererSource,
  listTableSource,
  objectRendererSource,
  supportSource,
  switcherSource,
].join("\n");

test("Object Views and Data Views remain distinct contracts", () => {
  assert.match(viewsSource, /export const OBJECT_VIEW_KINDS/);
  assert.match(viewsSource, /export const DATA_VIEW_KINDS/);
  assert.match(viewsSource, /"page"/);
  assert.match(viewsSource, /"table"/);
  assert.doesNotMatch(
    viewsSource.match(/export const DATA_VIEW_KINDS = \[[\s\S]*?\] as const;/)?.[0] ?? "",
    /"grid"/,
  );
});

test("shared renderers expose page and table without duplicating entities", () => {
  assert.match(rendererSource, /function PageObjectView/);
  assert.match(rendererSource, /function DataViewTable/);
  assert.match(rendererSource, /projectDataView\(props\.view, props\.entities\)/);
  assert.match(rendererSource, /readWorkspaceEntityProperty/);
  assert.match(rendererSource, /objectTypeDefinitionById/);
  assert.match(rendererSource, /objectIconToneTextClass/);
  assert.doesNotMatch(rendererSource, /useState<WorkspaceEntity/);
});

test("view configuration is hydrated at the workspace boundary", () => {
  assert.match(viewsControllerSource, /WORKSPACE_VIEW_STORAGE_KEY/);
  assert.match(viewsControllerSource, /parseWorkspaceViewState/);
  assert.match(viewsControllerSource, /serializeWorkspaceViewState/);
  assert.match(homeSource, /<WorkspaceViewsProvider>/);
  assert.match(homeSource, /<WorkspaceViewsSurface \/>/);
  assert.match(surfaceSource, /DataViewLayoutSwitcher/);
  assert.match(surfaceSource, /DataViewRenderer/);
  assert.match(surfaceSource, /isStructureDataView/);
  assert.match(surfaceSource, /useTranslations\("workspace"\)/);
  assert.match(surfaceSource, /structures\.find/);
  assert.match(surfaceSource, /name: activeStructure\.pluralName/);
  assert.doesNotMatch(surfaceSource, /"grid"/);
  assert.doesNotMatch(surfaceSource, /Tipo de objeto|Nenhum objeto|Sem título/);
});

test("conversion UI requires resolved mappings before commit", () => {
  assert.match(conversionSource, /resolveConversionField/);
  assert.match(conversionSource, /canCommitObjectConversion/);
  assert.match(conversionSource, /disabled=\{!canCommitObjectConversion\(plan\)\}/);
});
