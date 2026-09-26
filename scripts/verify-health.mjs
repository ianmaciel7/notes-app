#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");

console.log(
  "=== Verifying Full Project Health & Quality (Context & Harness) ===\n",
);

const results = [];

function runStep(
  name,
  cmd,
  args,
  { allowFail = false, parseGain = false } = {},
) {
  const start = Date.now();
  const proc = spawnSync(cmd, args, {
    cwd: root,
    encoding: "utf8",
    shell: true,
  });
  const duration = ((Date.now() - start) / 1000).toFixed(2);
  let metric = `${duration}s`;
  if (parseGain && proc.stdout) {
    const savedMatch = proc.stdout.match(/Tokens saved:\s+([^\n]+)/);
    if (savedMatch) {
      metric = `${savedMatch[1].trim()} (${duration}s)`;
    }
  }

  results.push({
    name,
    pass: proc.status === 0,
    metric,
    error:
      proc.status !== 0
        ? (proc.stderr || proc.stdout || "").trim().slice(0, 150)
        : null,
  });

  const icon = proc.status === 0 ? "✓" : allowFail ? "⚠" : "✗";
  console.log(`${icon} [${name.padEnd(26)}] ${metric}`);
}

// 1. Static Quality & Types
runStep("TypeScript Types", "pnpm", ["run", "check:types"]);
runStep("Biome Linter & Formatter", "pnpm", ["run", "check:lint"]);
runStep("Architectural Boundaries", "pnpm", ["run", "deps:check"]);
runStep("Code Duplication (jscpd)", "pnpm", ["run", "check:duplication"]);
runStep("Floor Guard Constraints", "pnpm", ["run", "check:floor"]);

// 2. Unit Tests & Coverage
runStep("Vitest Unit Tests", "pnpm", ["run", "test"]);
runStep("Test Coverage Floor", "pnpm", ["run", "test:coverage"]);
runStep("Guard & Hook Tests", "pnpm", ["run", "test:guards"]);

// 3. Context & Documentation Governance
runStep("Control Docs Verifier", "pnpm", ["run", "check:docs"]);
runStep("Agents Config Sync", "pnpm", ["run", "check:agents"]);

// 4. Harness & AI Tooling Verification
runStep("Harness Eval Framework", "pnpm", ["run", "test:harness"]);
runStep("AI Tooling & RTK Protocol", "pnpm", ["run", "test:ai-tooling"]);
runStep("RTK Token Savings (Gain)", "rtk", ["gain"], { parseGain: true });

console.log(
  "\n==================================================================",
);
console.log("Summary:");
const total = results.length;
const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log(`Passed: ${passed}/${total}`);

if (failed.length > 0) {
  console.error("\nFailures detected:");
  for (const f of failed) {
    console.error(`- ${f.name}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log("All Quality, Context & Harness checks PASSED successfully!");
  process.exit(0);
}
