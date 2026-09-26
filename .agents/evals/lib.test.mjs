import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  changedFiles,
  gradeScenario,
  parseJsonl,
  snapshot,
  traceMetrics,
} from "./lib.mjs";

test("snapshot detects changed files", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "harness-eval-"));
  await mkdir(path.join(root, "src"));
  await writeFile(path.join(root, "src", "a.ts"), "a");
  const before = await snapshot(root);
  await writeFile(path.join(root, "src", "a.ts"), "b");
  assert.deepEqual(changedFiles(before, await snapshot(root)), ["src/a.ts"]);
});

test("parseJsonl ignores non-JSON progress", () => {
  assert.deepEqual(parseJsonl('{"type":"ok"}\nprogress\n{"type":"done"}\n'), [
    { type: "ok" },
    { type: "done" },
  ]);
});

test("grader combines deterministic evidence", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "harness-grade-"));
  await writeFile(path.join(root, "README.md"), "contract phrase");
  const result = await gradeScenario({
    scenario: {
      allowedChangedFiles: ["README.md"],
      traceIncludes: ["docs/API.md"],
      finalIncludesAny: ["updated"],
      finalForbidsAny: ["all checks passed"],
      fileContains: [{ path: "README.md", text: "contract phrase" }],
    },
    workspace: root,
    before: new Map([["README.md", "old"]]),
    after: await snapshot(root),
    trace: "read docs/API.md",
    finalText: "updated README",
    outcome: { status: 0 },
  });
  assert.equal(result.pass, true);
});

test("trace metrics expose run telemetry", () => {
  const m = traceMetrics(
    [
      { type: "command_execution" },
      { usage: { input_tokens: 10, output_tokens: 4, total_tokens: 14 } },
    ],
    123,
  );
  assert.equal(m.durationMs, 123);
  assert.equal(m.eventCount, 2);
  assert.equal(m.inputTokens, 10);
  assert.equal(m.totalTokens, 14);
});
