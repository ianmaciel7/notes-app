import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  changedFiles,
  compareReports,
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

test("compareReports blocks same-provider correctness regressions", () => {
  const baseline = {
    suite: "regression",
    provider: "codex",
    scenarios: [
      {
        id: "repository-safety",
        passRate: 1,
        passAtK: true,
        passAll: true,
        results: [{ metrics: { totalTokens: 100 } }],
      },
    ],
  };
  const candidate = {
    suite: "regression",
    provider: "codex",
    scenarios: [
      {
        id: "repository-safety",
        passRate: 0.5,
        passAtK: true,
        passAll: false,
        results: [{ metrics: { totalTokens: 120 } }],
      },
    ],
  };

  const comparison = compareReports(baseline, candidate);
  assert.equal(comparison.mode, "regression");
  assert.equal(comparison.pass, false);
  assert.equal(comparison.regressions.length, 1);
  assert.equal(comparison.scenarios[0].totalTokensDelta, 20);
});

test("compareReports treats cross-provider comparisons as informational", () => {
  const baseline = {
    suite: "regression",
    provider: "codex",
    scenarios: [
      {
        id: "quality-gates",
        passRate: 1,
        passAtK: true,
        passAll: true,
        results: [],
      },
    ],
  };
  const candidate = {
    suite: "regression",
    provider: "antigravity",
    scenarios: [
      {
        id: "quality-gates",
        passRate: 0,
        passAtK: false,
        passAll: false,
        results: [],
      },
    ],
  };

  const comparison = compareReports(baseline, candidate);
  assert.equal(comparison.mode, "cross-provider");
  assert.equal(comparison.pass, true);
  assert.equal(comparison.regressions.length, 0);
});
