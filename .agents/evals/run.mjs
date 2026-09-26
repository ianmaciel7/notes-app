#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gradeScenario, parseJsonl, snapshot, traceMetrics } from "./lib.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const provider = arg("--provider");
if (!["codex", "antigravity"].includes(provider)) {
  console.error(
    "Usage: run.mjs --provider <codex|antigravity> [--trials N] [--scenario ID]",
  );
  process.exit(2);
}
const config = JSON.parse(
  await readFile(path.join(here, "scenarios.json"), "utf8"),
);
const trials = Number(arg("--trials", String(config.defaultTrials ?? 3)));
const scenarioId = arg("--scenario");
const selected = scenarioId
  ? config.scenarios.filter((s) => s.id === scenarioId)
  : config.scenarios;
if (!selected.length) {
  console.error(`Unknown scenario: ${scenarioId}`);
  process.exit(2);
}
const winCmd = (name) =>
  process.platform === "win32" && ["codex"].includes(name)
    ? `${name}.cmd`
    : name;
const version = (command) => {
  const r = spawnSync(winCmd(command), ["--version"], { encoding: "utf8" });
  return (r.stdout || r.stderr || "").trim() || "unavailable";
};

function runProvider(workspace, prompt) {
  const started = Date.now();
  if (provider === "codex") {
    const r = spawnSync(
      winCmd("codex"),
      ["exec", "--json", "--full-auto", "--skip-git-repo-check", prompt],
      { cwd: workspace, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
    );
    const events = parseJsonl(r.stdout ?? "");
    const finalEvent = [...events]
      .reverse()
      .find((e) => /message|result|completed/i.test(String(e?.type ?? "")));
    return {
      status: r.status ?? 1,
      events,
      finalText: JSON.stringify(finalEvent ?? events.at(-1) ?? ""),
      stdout: r.stdout ?? "",
      stderr: r.stderr ?? "",
      durationMs: Date.now() - started,
    };
  }
  const r = spawnSync(
    "uv",
    [
      "run",
      "--with",
      "google-antigravity==0.1.18",
      "python",
      path.join(here, "antigravity_adapter.py"),
      "--workspace",
      workspace,
      "--prompt",
      prompt,
    ],
    { cwd: workspace, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
  );
  let payload = {};
  try {
    payload = JSON.parse((r.stdout ?? "").trim().split(/\r?\n/).at(-1) ?? "{}");
  } catch {}
  return {
    status: r.status ?? 1,
    events: payload.events ?? [],
    finalText: payload.finalText ?? "",
    stdout: r.stdout ?? "",
    stderr: r.stderr ?? "",
    durationMs: payload.durationMs ?? Date.now() - started,
  };
}

const artifactRoot = path.join(here, "artifacts");
await mkdir(artifactRoot, { recursive: true });
const report = {
  schemaVersion: 1,
  suite: config.suite,
  provider,
  providerVersion: provider === "codex" ? version("codex") : version("uv"),
  trials,
  generatedAt: new Date().toISOString(),
  scenarios: [],
};
for (const scenario of selected) {
  const results = [];
  for (let trial = 1; trial <= trials; trial++) {
    const workspace = await mkdtemp(
      path.join(os.tmpdir(), `notes-harness-${scenario.id}-`),
    );
    await cp(path.join(here, "fixtures", "base"), workspace, {
      recursive: true,
    });
    const before = await snapshot(workspace);
    const run = runProvider(workspace, scenario.prompt);
    const after = await snapshot(workspace);
    const trace = [
      run.stdout,
      run.stderr,
      ...run.events.map((e) => JSON.stringify(e)),
    ].join("\n");
    let outcome;
    if (scenario.outcomeCommand) {
      const r = spawnSync(scenario.outcomeCommand, {
        cwd: workspace,
        encoding: "utf8",
        shell: true,
      });
      outcome = {
        status: r.status ?? 1,
        stdout: r.stdout ?? "",
        stderr: r.stderr ?? "",
      };
    }
    const grade = await gradeScenario({
      scenario,
      workspace,
      before,
      after,
      trace,
      finalText: run.finalText,
      outcome,
    });
    results.push({
      trial,
      providerExit: run.status,
      pass: run.status === 0 && grade.pass,
      grade,
      metrics: traceMetrics(run.events, run.durationMs),
      outcome,
      finalText: run.finalText,
    });
  }
  const passed = results.filter((r) => r.pass).length;
  report.scenarios.push({
    id: scenario.id,
    passed,
    trials,
    passRate: passed / trials,
    passAtK: passed > 0,
    passAll: passed === trials,
    results,
  });
}
const stamp = new Date().toISOString().replaceAll(":", "-");
const output = path.join(artifactRoot, `${provider}-${stamp}.json`);
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      provider,
      artifact: path.relative(process.cwd(), output),
      scenarios: report.scenarios.map(
        ({ id, passed, trials, passRate, passAtK, passAll }) => ({
          id,
          passed,
          trials,
          passRate,
          passAtK,
          passAll,
        }),
      ),
    },
    null,
    2,
  ),
);
process.exit(report.scenarios.every((s) => s.passAll) ? 0 : 1);
