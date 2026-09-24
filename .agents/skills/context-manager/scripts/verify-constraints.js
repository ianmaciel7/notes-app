#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { runVerify } = require("./lib/cli");
const checks = require("./lib/verify");

const HELP = `Usage: scripts/verify-constraints.js [OPTIONS] [ROOT_DIR]

Verifies CONSTRAINTS.md as a quality contract:
  - Required sections and floor rules are present.
  - Every cited package-manager command exists in package.json.
  - Enforced rows name a checker and lifecycle stage.
  - Exceptions have an owner and expiry date, or the table says None.

Arguments:
  ROOT_DIR       Repo root containing CONSTRAINTS.md (default: walk up from cwd).

Options:
  --root DIR     Same as ROOT_DIR positionally; wins if both are given.
  --json         Emit structured JSON instead of a report.
  -q, --quiet    Only print FAIL/SKIP lines, not every OK line.
  -h, --help     Show this help and exit.

Exit codes:
  0  all checks passed        1  at least one check failed        2  usage error
`;

function ok(id, message) {
  return { id, status: "ok", message };
}

function fail(id, message) {
  return { id, status: "fail", message };
}

function skip(id, message) {
  return { id, status: "skip", message };
}

const REQUIRED_SECTIONS = [
  "# Constraints",
  "## Floor (always enforced)",
  "## Enforced with numbers",
  "## Measured, not yet enforced",
  "## Exceptions",
];

const FLOOR_MARKERS = [
  /suppressions?/i,
  /unimplemented|stub|empty catch/i,
  /skipped or deleted tests?/i,
  /secrets? in source/i,
  /exceptions?\b.*owner.*expiry/i,
];

function verifyStructure(text) {
  const results = REQUIRED_SECTIONS.map((heading) =>
    text.includes(heading)
      ? ok("required-section", `${heading} is present.`)
      : fail("required-section", `${heading} is missing.`)
  );

  if (/\[[^\]]+\]|<[^>]+>/.test(text)) {
    results.push(fail("placeholders", "CONSTRAINTS.md contains unresolved placeholder markers."));
  } else {
    results.push(ok("placeholders", "No unresolved placeholder markers found."));
  }

  return results;
}

function verifyFloor(text) {
  return FLOOR_MARKERS.map((marker) =>
    marker.test(text)
      ? ok("floor-rule", `Floor rule matching ${marker} is present.`)
      : fail("floor-rule", `Required floor rule matching ${marker} is missing.`)
  );
}

function verifyEnforcedRows(text) {
  const section = text.split("## Enforced with numbers")[1]?.split(/^## /m)[0] || "";
  const rows = section.split("\n").filter((line) => /^\s*\|/.test(line) && !/^\s*\|[-| :]+\s*$/.test(line));
  if (rows.length < 2) return [fail("enforced-rows", "Enforced with numbers has no data rows.")];

  const malformed = rows.slice(1).filter((row) => {
    const cells = row.split("|").slice(1, -1).map((cell) => cell.trim());
    return cells.length < 4 || !cells[1] || !cells[2] || !cells[3];
  });
  return malformed.length === 0
    ? [ok("enforced-rows", `All ${rows.length - 1} enforced row(s) name a rule, checker, and run stage.`)]
    : [fail("enforced-rows", `${malformed.length} enforced row(s) lack a rule, checker, or run stage.`)];
}

function verifyExceptions(text) {
  const section = text.split("## Exceptions")[1]?.split(/^## /m)[0] || "";
  if (/\bNone\.?\s*$/im.test(section.trim())) return [ok("exceptions", "No active exceptions are declared.")];
  const rows = section.split("\n").filter((line) => /^\s*\|/.test(line) && !/^\s*\|[-| :]+\s*$/.test(line));
  if (rows.length < 2) return [fail("exceptions", "Exceptions section must say None or contain an exception table.")];
  const malformed = rows.slice(1).filter((row) => row.split("|").slice(1, -1).map((cell) => cell.trim()).length < 6 || !/\d{4}-\d{2}-\d{2}/.test(row));
  return malformed.length === 0
    ? [ok("exceptions", `All ${rows.length - 1} exception row(s) include an expiry date.`)]
    : [fail("exceptions", `${malformed.length} exception row(s) lack the required fields or an expiry date.`)];
}

function verifyConstraintCommands(repoRoot, text) {
  const packagePath = path.join(repoRoot, "package.json");
  if (!fs.existsSync(packagePath)) return [skip("constraint-commands", "No package.json; package commands cannot be cross-checked.")];
  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  const scripts = new Set(Object.keys(pkg.scripts || {}));
  const results = [];
  const commandRe = /`pnpm\s+(?:run\s+)?([a-zA-Z][\w:-]*)`/g;
  let match;
  while ((match = commandRe.exec(text)) !== null) {
    const script = match[1];
    if (["install", "i", "add", "remove", "exec", "dlx", "update", "up"].includes(script)) continue;
    results.push(
      scripts.has(script)
        ? ok("constraint-commands", `"${script}" exists in package.json scripts.`)
        : fail("constraint-commands", `"${script}" is cited by CONSTRAINTS.md but not in package.json scripts.`)
    );
  }
  return results.length ? results : [skip("constraint-commands", "No pnpm package scripts cited.")];
}

runVerify(process.argv.slice(2), {
  docFile: "CONSTRAINTS.md",
  help: HELP,
  buildResults: ({ repoRoot, text }) => [
    ...verifyStructure(text),
    ...verifyFloor(text),
    ...verifyEnforcedRows(text),
    ...verifyExceptions(text),
    ...checks.verifyCitedPackageScripts(repoRoot, text),
    ...verifyConstraintCommands(repoRoot, text),
    ...checks.verifyJscpdThreshold(repoRoot, text),
    ...checks.verifyLighthouseAccessibilityThreshold(repoRoot, text),
  ],
});
