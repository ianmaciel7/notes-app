#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { compareReports } from "./lib.mjs";

const args = process.argv.slice(2);

function argValue(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

const baselinePath = argValue("--baseline");
const candidatePath = argValue("--candidate");

if (!baselinePath || !candidatePath) {
  console.error(
    "Usage: compare.mjs --baseline <report.json> --candidate <report.json>",
  );
  process.exit(2);
}

async function readReport(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

try {
  const [baseline, candidate] = await Promise.all([
    readReport(baselinePath),
    readReport(candidatePath),
  ]);
  const comparison = compareReports(baseline, candidate);
  console.log(JSON.stringify(comparison, null, 2));
  process.exit(comparison.pass ? 0 : 1);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(2);
}
