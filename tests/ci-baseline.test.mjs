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
