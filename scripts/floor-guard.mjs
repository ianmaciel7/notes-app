#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const baseFlag = process.argv.indexOf("--base");
const base = baseFlag >= 0 ? process.argv[baseFlag + 1] : "origin/main";

function git(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" });
  } catch (error) {
    return error.stdout?.toString() ?? null;
  }
}

const mergeBase = git(["merge-base", base, "HEAD"])?.trim();
if (!mergeBase) {
  console.error(`floor-guard: no merge base against ${base}`);
  process.exit(2);
}

const tracked = git(["diff", "--unified=0", mergeBase, "--"]) ?? "";
const untracked = (git(["ls-files", "--others", "--exclude-standard"]) ?? "")
  .split("\n")
  .filter(Boolean)
  .map((file) => git(["diff", "--no-index", "--unified=0", "NUL", file]) ?? "")
  .join("\n");
const diff = `${tracked}\n${untracked}`;

const added = [];
const removed = [];
let file = "";
for (const line of diff.split("\n")) {
  if (line.startsWith("+++ ")) file = line.slice(6);
  else if (line.startsWith("+")) added.push({ file, text: line.slice(1) });
  else if (line.startsWith("-")) removed.push({ file, text: line.slice(1) });
}

const findings = [];
const flag = (rule, entry) => findings.push({ rule, ...entry });
const codeFile = /\.(cjs|cts|js|jsx|mjs|mts|ts|tsx)$/i;
const projectCodeFile = (file) =>
  codeFile.test(file) &&
  !file.startsWith(".agents/") &&
  file !== "scripts/floor-guard.mjs";
const suppressions =
  /@ts-ignore|@ts-nocheck|eslint-disable|biome-ignore|#\s*noqa|#\s*type:\s*ignore|istanbul ignore|nosemgrep|gitleaks:allow|Stryker disable/;
const stubs =
  /throw new (Error|NotImplemented).*not implemented|catch\s*(?:\([^)]*\))?\s*\{\s*\}|\bTODO\b/;
const skips =
  /\.(skip|todo)\b|\bxit\(|\bxdescribe\(|@pytest\.mark\.skip|t\.Skip\(/;

for (const entry of added) {
  if (projectCodeFile(entry.file) && suppressions.test(entry.text))
    flag("silenced-checker", entry);
  if (projectCodeFile(entry.file) && stubs.test(entry.text))
    flag("unfinished-work", entry);
  if (projectCodeFile(entry.file) && skips.test(entry.text))
    flag("test-made-easier", entry);
  if (
    /CONSTRAINTS\.md$/.test(entry.file) &&
    /^\|\s*(W|E)\d+\s*\|/.test(entry.text)
  )
    flag("new-exception", entry);
}

for (const entry of removed) {
  if (
    /\.(test|spec)\.|_test\.|test_/.test(entry.file) &&
    /\b(expect|assert|should)\b/.test(entry.text)
  ) {
    flag("assertion-removed", entry);
  }
}

if (findings.length === 0) {
  console.log("floor-guard: clean");
  process.exit(0);
}

console.error(`floor-guard: ${findings.length} violation(s):`);
for (const finding of findings) {
  console.error(
    `  [${finding.rule}] ${finding.file}: ${finding.text.trim().slice(0, 120)}`,
  );
}
process.exit(1);
