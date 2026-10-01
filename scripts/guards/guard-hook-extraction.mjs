#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));

function git(args) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" });
  } catch {
    return "";
  }
}

const files = [
  ...new Set([
    ...git([
      "diff",
      "--name-only",
      "HEAD",
      "--",
      "src/components/notes-app",
    ]).split(/\r?\n/),
    ...git([
      "ls-files",
      "--others",
      "--exclude-standard",
      "--",
      "src/components/notes-app",
    ]).split(/\r?\n/),
  ]),
].filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"));

function isComplex(content) {
  const state = (content.match(/\buse(?:State|Reducer|Transition)\s*\(/g) ?? [])
    .length;
  const effects = (
    content.match(/\buse(?:Effect|LayoutEffect|ImperativeHandle)\s*\(/g) ?? []
  ).length;
  const asyncWork = (
    content.match(
      /async function (?:handle|on|submit|retry)|async \([^)]*\)\s*=>/g,
    ) ?? []
  ).length;
  return state + effects >= 2 || (state >= 1 && asyncWork >= 1);
}

function hasHook(content) {
  return (
    /\bfunction use[A-Z]\w*\s*\(/.test(content) ||
    /\bconst use[A-Z]\w*\s*=/.test(content)
  );
}

const violations = files.filter((relative) => {
  const file = path.join(root, relative);
  return (
    existsSync(file) &&
    isComplex(readFileSync(file, "utf8")) &&
    !hasHook(readFileSync(file, "utf8"))
  );
});

if (violations.length) {
  console.error(
    "[guard-hook-extraction] Complex changed components need a top-level useX hook:",
  );
  for (const file of violations) console.error(`  - ${file}`);
  console.error(
    "Extract stateful behavior into a co-located hook, or src/hooks when shared.",
  );
  process.exit(1);
}

console.log("[guard-hook-extraction] clean");
