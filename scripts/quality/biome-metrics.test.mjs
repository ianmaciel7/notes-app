import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./biome-metrics.mjs", import.meta.url));
const cleanReport = { summary: { errors: 0, warnings: 0 }, diagnostics: [] };

function fixture(t, { payload = cleanReport, stderr = "", stdout, exitCode = 0 } = {}) {
  const cwd = mkdtempSync(join(tmpdir(), "biome metrics path "));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const bin = join(cwd, "node_modules", "@biomejs", "biome", "bin", "biome");
  const legacyBin = join(cwd, "node_modules", ".bin", "biome");
  const source = [
    "#!/usr/bin/env node",
    `process.stdout.write(${JSON.stringify(stdout ?? JSON.stringify(payload))});`,
    `process.stderr.write(${JSON.stringify(stderr)});`,
    `process.exitCode = ${exitCode};`,
  ].join("\n");
  for (const path of [bin, legacyBin]) {
    mkdirSync(join(path, ".."), { recursive: true });
    writeFileSync(path, source);
    chmodSync(path, 0o755);
  }
  writeFileSync(`${legacyBin}.cmd`, `@"${process.execPath}" "${bin}" %*\r\n`);
  return cwd;
}

function run(cwd, report = true) {
  return spawnSync(process.execPath, [script, ...(report ? ["--report"] : [])], {
    cwd,
    encoding: "utf8",
    timeout: 10_000,
  });
}

function reportPath(cwd) {
  return join(cwd, "reports", "code-quality-metrics", "latest.json");
}

test("report parsing does not combine stderr messages with stdout JSON", (t) => {
  const cwd = fixture(t, { stderr: "Reporter warning {not JSON}\n" });
  const result = run(cwd);
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(readFileSync(reportPath(cwd), "utf8"));
  assert.equal(report.maintainabilityConvention.diagnosticCount, 0);
});

for (const summary of ["invalid", {}, { errors: "0", warnings: 0 }, { errors: -1, warnings: 0 }]) {
  test(`invalid summary is rejected: ${JSON.stringify(summary)}`, (t) => {
    const cwd = fixture(t, { payload: { summary, diagnostics: [] } });
    assert.equal(run(cwd).status, 2);
    assert.equal(existsSync(reportPath(cwd)), false);
  });
}

test("a nonzero Biome exit code is preserved when a report is saved", (t) => {
  const cwd = fixture(t, {
    payload: { summary: { errors: 0, warnings: 1 }, diagnostics: [] },
    exitCode: 7,
  });
  assert.equal(run(cwd).status, 7);
  assert.equal(JSON.parse(readFileSync(reportPath(cwd), "utf8")).exitCode, 7);
});

test("non-report mode preserves diagnostics and exit code", (t) => {
  const cwd = fixture(t, { stdout: "lint output", stderr: "lint failure", exitCode: 3 });
  const result = run(cwd, false);
  assert.equal(result.status, 3);
  assert.equal(result.stdout, "lint output");
  assert.equal(result.stderr, "lint failure");
});

test("a valid large report is not truncated by the default spawn buffer", (t) => {
  const cwd = fixture(t, { payload: { ...cleanReport, metadata: "x".repeat(1_100_000) } });
  const result = run(cwd);
  assert.equal(result.status, 0, result.stderr);
});

test("only selected rule occurrences are counted and all diagnostics are retained", (t) => {
  const diagnostics = [
    { category: "lint/complexity/useMaxParams", severity: "warning" },
    { category: "lint/complexity/useMaxParams", severity: "warning" },
    { category: "parse", severity: "error" },
  ];
  const cwd = fixture(t, {
    payload: { summary: { errors: 1, warnings: 2 }, diagnostics },
    exitCode: 1,
  });
  assert.equal(run(cwd).status, 1);
  const report = JSON.parse(readFileSync(reportPath(cwd), "utf8"));
  assert.equal(report.maintainabilityConvention.diagnosticCount, 2);
  assert.equal(report.maintainabilityConvention.diagnosticsByRule["lint/complexity/useMaxParams"], 2);
  assert.deepEqual(report.diagnostics, diagnostics);
});

test("an error summary cannot be published with a successful exit status", (t) => {
  const cwd = fixture(t, { payload: { summary: { errors: 1, warnings: 0 }, diagnostics: [] } });
  assert.equal(run(cwd).status, 1);
});

test("missing local Biome reports an environment failure", (t) => {
  const cwd = fixture(t);
  rmSync(join(cwd, "node_modules"), { recursive: true, force: true });
  assert.equal(run(cwd).status, 2);
  assert.equal(existsSync(reportPath(cwd)), false);
});

test("diagnostic errors cannot be hidden by an inconsistent zero summary", (t) => {
  const cwd = fixture(t, {
    payload: {
      summary: { errors: 0, warnings: 0 },
      diagnostics: [{ category: "parse", severity: "error" }],
    },
  });
  assert.equal(run(cwd).status, 1);
});
