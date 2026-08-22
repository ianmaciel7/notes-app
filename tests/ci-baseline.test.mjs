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

test("the localized workspace boots into the Capacities atomic-notes fixture", async () => {
	const [route, fixture, header, headerTabs, sidebar, layout, styles] = await Promise.all([
		readFile(new URL("../src/app/[locale]/page.tsx", import.meta.url), "utf8"),
		readFile(new URL("../src/components/capacities-en-workspace.tsx", import.meta.url), "utf8"),
		readFile(new URL("../src/components/app-header-demo.tsx", import.meta.url), "utf8"),
		readFile(new URL("../src/components/app-header-tabs.tsx", import.meta.url), "utf8"),
		readFile(new URL("../src/components/app-sidebar-primary-actions.tsx", import.meta.url), "utf8"),
		readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8"),
		readFile(new URL("../src/app/globals.css", import.meta.url), "utf8"),
	]);

	assert.match(route, /AtomicNotesWorkspace/);
	assert.match(route, /ExploreWorkspace/);
	assert.match(fixture, /Não há nada aqui \(por enquanto\)\./);
	assert.match(fixture, /Conteúdo relevante/);
	assert.match(header, /id: "atomic-notes"/);
	assert.match(header, /const initialSideTabs[\s\S]*?id: "explore"/);
	assert.match(header, /MAIN_DRAFT_TAB_ID = "new-tab-draft"/);
	assert.match(header, /current\.some\(\(tab\) => tab\.id === MAIN_DRAFT_TAB_ID\)/);
	assert.match(header, /createLabel="Criar nova aba"/);
	assert.match(headerTabs, /MAIN_TAB_MIN_WIDTH = 96/);
	assert.match(sidebar, /useState<string \| null>\([\s\S]*?"atomic-note"/);
	assert.doesNotMatch(layout, /next\/font\/google/);
	assert.match(styles, /font-family: "Inter"/);
	assert.match(styles, /--sidebar: oklch\(0\.9856 0\.0016 67\)/);
});
