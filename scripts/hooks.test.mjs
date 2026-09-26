import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import {
  classifyPath,
  isBiomeChecked,
  parseHookFilePath,
  repoRelativePath,
} from "./hooks-lib.mjs";

const root = path.resolve("repo-root");

test("hook payload yields the edited file path", () => {
  assert.equal(
    parseHookFilePath('{"tool_input":{"file_path":"src/a.ts"}}'),
    "src/a.ts",
  );
  assert.equal(
    parseHookFilePath(
      '{"toolCall":{"name":"write_to_file","args":{"TargetFile":"src/b.ts"}}}',
    ),
    "src/b.ts",
  );
  assert.equal(
    parseHookFilePath(
      '{"toolCall":{"name":"write_file","args":{"path":"src/c.ts"}}}',
    ),
    "src/c.ts",
  );
});

test("malformed or path-less payloads yield null", () => {
  assert.equal(parseHookFilePath("not json"), null);
  assert.equal(parseHookFilePath('{"tool_input":{}}'), null);
  assert.equal(parseHookFilePath('{"tool_input":{"file_path":3}}'), null);
});

test("paths resolve to repo-relative POSIX form", () => {
  assert.equal(repoRelativePath(root, "src/a.ts"), "src/a.ts");
  assert.equal(
    repoRelativePath(root, path.join(root, "src", "a.ts")),
    "src/a.ts",
  );
});

test("paths outside the repo resolve to null", () => {
  assert.equal(repoRelativePath(root, path.join(root, "..", "other.ts")), null);
  assert.equal(repoRelativePath(root, "."), null);
});

test("only Biome-supported extensions are checked", () => {
  assert.equal(isBiomeChecked("src/a.tsx"), true);
  assert.equal(isBiomeChecked("scripts/a.mjs"), true);
  assert.equal(isBiomeChecked("README.md"), false);
  assert.equal(isBiomeChecked("pnpm-lock.yaml"), false);
});

test("generated outputs are denied", () => {
  for (const file of [
    ".agents/generated/sync.state.json",
    "graphify-out/graph.json",
    ".next/build.json",
    "CLAUDE.md",
    ".mcp.json",
  ]) {
    assert.equal(classifyPath(file)?.action, "deny", file);
  }
});

test("controlled files ask for confirmation", () => {
  for (const file of [
    "skills-lock.json",
    "pnpm-lock.yaml",
    ".env",
    ".env.local",
    "apps/web/.env.production",
  ]) {
    assert.equal(classifyPath(file)?.action, "ask", file);
  }
});

test("ordinary files and lookalikes are allowed", () => {
  for (const file of [
    "src/lib/utils.ts",
    "AGENTS.md",
    ".agents/agents.json",
    "docs/CLAUDE.md",
    "src/environment.ts",
  ]) {
    assert.equal(classifyPath(file), null, file);
  }
});
