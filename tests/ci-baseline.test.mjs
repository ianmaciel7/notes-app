import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

for (const script of ["build", "format:check", "lint", "typegen", "typecheck", "complexity", "test", "test:coverage", "verify"]) {
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
		const content = await readFile(new URL(`../src/messages/${locale}.json`, import.meta.url), "utf8");
		const messages = JSON.parse(content);
		assert.equal(typeof messages, "object");
		assert.notEqual(messages, null);
		assert.ok(Object.keys(messages).length > 0);
	}
});

test("the localized workspace boots into the workspace fixture", async () => {
	const [route, fixture, header, headerTabs, sidebar, objectIcons, layout, styles] = await Promise.all([
		readFile(new URL("../src/app/[locale]/page.tsx", import.meta.url), "utf8"),
		readFile(new URL("../src/components/workspace-content.tsx", import.meta.url), "utf8"),
		readFile(new URL("../src/components/workspace-controller.tsx", import.meta.url), "utf8"),
		readFile(new URL("../src/components/app-header-tabs.tsx", import.meta.url), "utf8"),
		readFile(new URL("../src/components/app-sidebar-primary-actions.tsx", import.meta.url), "utf8"),
		readFile(new URL("../src/components/object-icons.tsx", import.meta.url), "utf8"),
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
	assert.match(header, /current\.some\(\(tab\) => tab\.id === MAIN_DRAFT_TAB_ID\)/);
	assert.match(header, /createLabel="Criar nova aba"/);
	assert.match(headerTabs, /MAIN_TAB_MIN_WIDTH = 64/);
	assert.match(header, /useState<string \| null>\([\s\S]*?"quote"/);
	assert.match(sidebar, /function WorkspaceSidebar/);
	assert.match(sidebar, /objectTypeDefinitionById/);
	assert.match(sidebar, /open=\{open\} onOpenChange=\{handleOpenChange\}/);
	assert.match(sidebar, /role="combobox"/);
	assert.match(sidebar, /aria-activedescendant/);
	assert.match(sidebar, /role="listbox"/);
	assert.match(sidebar, /role="option"/);
	assert.match(sidebar, /event\.key === "ArrowDown" \|\| event\.key === "ArrowUp"/);
	assert.match(sidebar, /event\.key === "Enter"/);
	assert.match(sidebar, /event\.key === "Escape"/);
	assert.match(sidebar, /variant="menu"/);
	assert.match(sidebar, /box-content h-\[361px\] w-\[22rem\]/);
	assert.match(sidebar, /h-72 min-h-0 shrink-0 overflow-y-auto/);
	assert.match(sidebar, /onSelectObjectType=\{createWorkspaceEntity\}/);
	assert.match(header, /createdEntitySequenceRef\.current \+= 1/);
	assert.match(header, /created-\$\{objectTypeId\}-\$\{createdEntitySequenceRef\.current\}/);
	assert.match(header, /objectType\.count \+ 1/);
	assert.match(header, /setMainValue\(id\)/);
	assert.match(fixture, /activeCreatedEntity\?\.objectTypeId === "quote"/);
	assert.match(fixture, /data-slot="created-object-workspace"/);
	assert.match(objectIcons, /objectIconToneTextClass/);
	assert.match(objectIcons, /objectIconToneBadgeClass/);
	assert.match(objectIcons, /objectTypeDefinitions/);
	assert.match(objectIcons, /variant\?: "default" \| "menu" \| "sidebar"/);
	assert.match(objectIcons, /size-\[22px\] rounded-\[6\.65px\] \[border-width:0\.5px\]/);
	assert.match(objectIcons, /id: "quote"[\s\S]*?tone: "rose"/);
	assert.match(objectIcons, /id: "query"[\s\S]*?tone: "green"/);
	assert.doesNotMatch(layout, /next\/font\/google/);
	assert.match(styles, /font-family: "Inter"/);
	assert.match(styles, /--sidebar: oklch\(0\.9856 0\.0016 67\)/);
	assert.match(styles, /--background: oklch\(0\.9856 0\.0016 67\)/);
	assert.match(styles, /--border: oklch\(0\.9163 0\.0017 67\.07\)/);
});
