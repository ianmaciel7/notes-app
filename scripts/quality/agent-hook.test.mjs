import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./agent-hook.ts", import.meta.url));

function fixture(t, failOn = "") {
  const cwd = mkdtempSync(join(tmpdir(), "agent hook path "));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const init = spawnSync("git", ["init", "-q"], { cwd, encoding: "utf8" });
  assert.equal(init.status, 0, init.stderr);
  writeFileSync(join(cwd, ".gitignore"), "node_modules/\ncommands.txt\n");
  writeFileSync(join(cwd, "change.ts"), "export const value = 1;\n");
  const launchers = [
    ["@biomejs/biome/bin/biome", "biome"],
    ["next/dist/bin/next", "next"],
    ["typescript/bin/tsc", "tsc"],
  ];
  for (const [path, name] of launchers) {
    const bin = join(cwd, "node_modules", path);
    mkdirSync(dirname(bin), { recursive: true });
    writeFileSync(
      bin,
      [
        "const fs = require('node:fs');",
        `const name = ${JSON.stringify(name)};`,
        "const args = process.argv.slice(2).join(' ');",
        "fs.appendFileSync('commands.txt', name + ' ' + args + '\\n');",
        `if (name + ' ' + args === ${JSON.stringify(failOn)}) {`,
        "  console.error('fixture diagnostic'); process.exitCode = 7;",
        "}",
      ].join("\n"),
    );
  }
  return cwd;
}

function run(cwd, mode, input = {}) {
  return spawnSync(process.execPath, ["--experimental-strip-types", script, mode], {
    cwd,
    input: JSON.stringify(input),
    encoding: "utf8",
    timeout: 15_000,
  });
}

test("stop runs installed checks without pnpm shims or removed dependencies", (t) => {
  const cwd = fixture(t);
  const result = run(cwd, "cursor-stop");
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {});
  assert.equal(
    readFileSync(join(cwd, "commands.txt"), "utf8"),
    "biome format .\nbiome lint .\nnext typegen\ntsc --noEmit\n",
  );
});

test("stop preserves a tool failure and stops subsequent checks", (t) => {
  const cwd = fixture(t, "biome lint .");
  const result = run(cwd, "cursor-stop");
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.match(output.followup_message, /exit code 7/);
  assert.match(output.followup_message, /fixture diagnostic/);
  assert.equal(readFileSync(join(cwd, "commands.txt"), "utf8"), "biome format .\nbiome lint .\n");
});

test("Antigravity cancellation does not ask for another continuation", (t) => {
  const cwd = fixture(t, "biome format .");
  const result = run(cwd, "antigravity-stop", {
    terminationReason: "user_cancelled",
    fullyIdle: true,
    executionNum: 1,
  });
  assert.deepEqual(JSON.parse(result.stdout), { decision: "" });
});

test("missing Git repository is not reported as a clean worktree", (t) => {
  const cwd = fixture(t);
  rmSync(join(cwd, ".git"), { recursive: true, force: true });
  const result = run(cwd, "cursor-stop");
  assert.notEqual(result.status, 0);
  assert.match(JSON.parse(result.stdout).error, /Git|git/);
});

test("invalid hook input fails explicitly", (t) => {
  const cwd = fixture(t);
  const result = run(cwd, "cursor-after-file-edit", null);
  assert.notEqual(result.status, 0);
  assert.match(JSON.parse(result.stdout).error, /object/);
});

test("after-edit advice refers to current supported quality instructions", (t) => {
  const cwd = fixture(t);
  const result = run(cwd, "cursor-after-file-edit", { file_path: "src/page.tsx" });
  const output = JSON.parse(result.stdout);
  assert.match(output.additional_context, /docs\/code-quality.md/);
  assert.doesNotMatch(output.additional_context, /pnpm verify|quality:fast/);
});
