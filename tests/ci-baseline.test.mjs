import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);

for (const script of [
  "build",
  "format:check",
  "lint",
  "typegen",
  "typecheck",
  "complexity",
  "test",
  "test:coverage",
  "verify",
]) {
  test(`package.json exposes ${script}`, () => {
    assert.equal(typeof packageJson.scripts?.[script], "string");
    assert.ok(packageJson.scripts[script].length > 0);
  });
}

test("project pins pnpm 11.20.0", () => {
  assert.equal(packageJson.packageManager, "pnpm@11.20.0");
});

test("project constrains Node.js to major 22", () => {
  assert.equal(packageJson.engines?.node, ">=22 <23");
});

test("supported locale catalogs are valid JSON objects", async () => {
  for (const locale of ["en", "es", "pt-BR"]) {
    const content = await readFile(
      new URL(`../src/messages/${locale}.json`, import.meta.url),
      "utf8",
    );
    const messages = JSON.parse(content);
    assert.equal(typeof messages, "object");
    assert.notEqual(messages, null);
    assert.ok(Object.keys(messages).length > 0);
  }
});

test("supported locale catalogs expose the same message keys", async () => {
  const flattenKeys = (value, prefix = "") =>
    Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return child && typeof child === "object" && !Array.isArray(child)
        ? flattenKeys(child, path)
        : [path];
    });
  const catalogs = await Promise.all(
    ["en", "es", "pt-BR"].map(async (locale) =>
      JSON.parse(
        await readFile(
          new URL(`../src/messages/${locale}.json`, import.meta.url),
          "utf8",
        ),
      ),
    ),
  );
  const baseline = flattenKeys(catalogs[0]).sort();
  for (const catalog of catalogs.slice(1)) {
    assert.deepEqual(flattenKeys(catalog).sort(), baseline);
  }
});

test("sidebar context menus share the canonical appearance contract", async () => {
  const [overview, compactMenu, sharedStyles] = await Promise.all([
    readFile(
      new URL("../src/components/app-sidebar-overview.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/components/ui/compact-menu.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/components/ui/shared-styles.ts", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(
    compactMenu,
    /sidebarContextMenuContentClass = "w-\[269px\]"/,
  );
  assert.match(
    compactMenu,
    /sidebarContextSubmenuContentClass = cn\(\s*"w-\[269px\]",\s*workspaceSubmenuStateClass,/,
  );
  assert.match(sharedStyles, /floatingListItemClass =[\s\S]*?h-8 min-h-8/);
  assert.match(sharedStyles, /rounded-\[8px\]/);
  assert.match(sharedStyles, /\[&_svg\]:text-\[#8f8983\]/);
  assert.match(
    sharedStyles,
    /floatingSeparatorClass = "my-1 h-px bg-\[#dedbd7\]/,
  );
  assert.equal(
    overview.match(/className=\{sidebarContextMenuContentClass\}/g)?.length,
    2,
  );
  assert.match(overview, /className=\{sidebarContextSubmenuContentClass\}/);
  assert.equal(overview.match(/<DropdownMenuShortcut>/g)?.length, 1);
});

test("the localized workspace boots into the workspace fixture", async () => {
  const [
    route,
    fixture,
    header,
    headerTabs,
    sidebar,
    objectIcons,
    compactMenu,
    workspaceObjects,
    layout,
    styles,
  ] = await Promise.all([
    readFile(new URL("../src/app/[locale]/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../src/components/workspace-content.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/components/workspace-controller.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/components/app-header-tabs.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../src/components/app-sidebar-primary-actions.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL("../src/components/object-icons.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/components/ui/compact-menu.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../src/lib/workspace-objects.ts", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(route, /AtomicNotesWorkspace/);
  assert.match(route, /ExploreWorkspace/);
  assert.match(fixture, /citation-workspace/);
  assert.match(fixture, /useTranslations\("workspace"\)/);
  assert.match(fixture, /empty\.title/);
  assert.match(fixture, /explore\.graphView/);
  assert.match(fixture, /explore\.relevantContent/);
  assert.match(header, /id: "atomic-note"/);
  assert.match(header, /id: "untitled"/);
  assert.match(header, /useState\("untitled"\)/);
  assert.match(header, /const initialSideTabs[\s\S]*?id: "explore"/);
  assert.match(header, /MAIN_DRAFT_TAB_ID = "new-tab-draft"/);
  assert.match(
    header,
    /current\.some\(\(tab\) => tab\.id === MAIN_DRAFT_TAB_ID\)/,
  );
  assert.match(header, /createLabel=\{t\("tabs\.create"\)\}/);
  assert.match(headerTabs, /MAIN_TAB_MIN_WIDTH = 82/);
  assert.match(headerTabs, /role="tablist"/);
  assert.match(headerTabs, /event\.key === "Enter" \|\| event\.key === " "/);
  assert.match(headerTabs, /"ArrowLeft", "ArrowRight", "Home", "End"/);
  assert.match(headerTabs, /getNextTabFocusIndex/);
  assert.match(headerTabs, /\?\.focus\(\)/);
  assert.match(header, /useState<string \| null>\([\s\S]*?"quote"/);
  assert.match(sidebar, /function WorkspaceSidebar/);
  assert.match(sidebar, /objectTypes=\{objectTypes\}/);
  assert.match(sidebar, /open=\{open\} onOpenChange=\{handleOpenChange\}/);
  assert.match(sidebar, /role="combobox"/);
  assert.match(sidebar, /aria-activedescendant/);
  assert.match(sidebar, /role="listbox"/);
  assert.match(sidebar, /role="option"/);
  assert.match(
    sidebar,
    /event\.key === "ArrowDown" \|\| event\.key === "ArrowUp"/,
  );
  assert.match(sidebar, /event\.key === "Enter"/);
  assert.match(sidebar, /event\.key === "Escape"/);
  assert.match(sidebar, /variant="menu"/);
  assert.match(sidebar, /compactMenuSurfaceClass/);
  assert.match(sidebar, /h-\[361px\] w-\[22rem\]/);
  assert.match(compactMenu, /compactMenuSurfaceClass/);
  assert.match(compactMenu, /box-content flex w-auto min-w-\[18rem\]/);
  assert.match(sidebar, /h-72 min-h-0 shrink-0 overflow-y-auto/);
  assert.match(sidebar, /onSelectObjectType=\{createWorkspaceEntity\}/);
  assert.match(
    header,
    /dispatchWorkspaceObjects\(\{ type: "beginCreate", objectTypeId \}\)/,
  );
  assert.match(
    workspaceObjects,
    /created-\$\{objectTypeId\}-\$\{state\.nextId\}/,
  );
  assert.match(header, /countEntitiesByType\(workspaceObjects\.entities\)/);
  assert.match(
    header,
    /objectTypeStudio\.objectTypes\.\$\{entity\.objectTypeId\}/,
  );
  assert.match(
    sidebar,
    /onSelectObjectType\?\.\(objectTypeId, selectedItem\?\.label\)/,
  );
  assert.match(header, /setMainValue\(id\)/);
  assert.match(fixture, /if \(activeCreatedEntity\)/);
  assert.match(fixture, /data-slot="created-object-workspace"/);
  assert.match(fixture, /data-slot="object-type-overview"/);
  assert.match(fixture, /data-slot="object-type-all"/);
  assert.match(fixture, /role="tablist"/);
  assert.match(fixture, /role="tabpanel"/);
  assert.match(fixture, /entity\.objectTypeId === objectType\.id/);
  assert.match(fixture, /useTranslations\("workspace\.objectTypeOverview"\)/);
  assert.match(fixture, /t\("recentlyOpened"\)/);
  assert.match(fixture, /t\("collections"\)/);
  assert.match(fixture, /t\("queries"\)/);
  assert.match(fixture, /selectEntity\(entityId\)/);
  assert.match(fixture, /importWorkspaceFiles\(objectType\.id, files\)/);
  assert.match(fixture, /onClick=\{createObject\}/);
  assert.match(fixture, /onClick=\{onImport\}/);
  assert.match(fixture, /input\.value = ""/);
  assert.match(fixture, /function ObjectTypeOptionsMenu/);
  assert.match(fixture, /function ObjectTypeNewMenu/);
  assert.match(fixture, /objectTypeOverview\.searchPlaceholder/);
  assert.match(fixture, /data-slot="object-type-filter-row"/);
  assert.match(fixture, /data-slot="object-type-sort-row"/);
  assert.match(fixture, /aria-pressed=\{layout === "grid"\}/);
  assert.match(fixture, /setToolbarCollapsed/);
  assert.match(fixture, /setCollectionsByType/);
  assert.match(fixture, /setQueriesByType/);
  assert.match(fixture, /function ObjectTypeOverviewSettingsRow/);
  assert.match(fixture, /role="menuitemcheckbox"/);
  assert.match(fixture, /aria-checked=\{checked\}/);
  assert.match(fixture, /alignOffset=\{-2\}/);
  assert.match(fixture, /w-\[290px\][\s\S]*?rounded-\[12px\]/);
  assert.match(fixture, /"noCollection"[\s\S]*?"untagged"[\s\S]*?"noBacklinks"/);
  assert.match(fixture, /section === "recent"\) setView\("all"\)/);
  assert.match(header, /type: "importFile"/);
  assert.match(workspaceObjects, /action\.type === "importFile"/);
  assert.match(objectIcons, /objectIconToneTextClass/);
  assert.match(objectIcons, /objectIconToneBadgeClass/);
  assert.match(objectIcons, /objectTypeDefinitions/);
  assert.match(objectIcons, /variant\?: "default" \| "menu" \| "sidebar"/);
  assert.match(
    objectIcons,
    /rounded-\[0\.475em\] border p-1 \[border-width:0\.5px\]/,
  );
  assert.match(objectIcons, /id: "quote"[\s\S]*?tone: "rose"/);
  assert.match(objectIcons, /id: "query"[\s\S]*?tone: "green"/);
  assert.doesNotMatch(layout, /next\/font\/google/);
  assert.match(styles, /font-family: "Inter"/);
  assert.match(styles, /--sidebar: oklch\(0\.9856 0\.0016 67\)/);
  assert.match(styles, /--background: oklch\(0\.9856 0\.0016 67\)/);
  assert.match(styles, /--border: oklch\(0\.9163 0\.0017 67\.07\)/);
});
