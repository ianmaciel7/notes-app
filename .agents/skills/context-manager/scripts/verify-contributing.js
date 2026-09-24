#!/usr/bin/env node
"use strict";

const { runVerify } = require("./lib/cli");
const checks = require("./lib/verify");

const HELP = `Usage: scripts/verify-contributing.js [OPTIONS] [ROOT_DIR]

Verifies CONTRIBUTING.md against real repo state:
  - Every pnpm/npm/yarn command it cites exists in package.json.
  - If package.json pins a "packageManager" version, that exact version is
    actually mentioned in the doc.
  - The most recent commits follow Conventional Commits.
  - Stale "no CI/no tests" claims are rejected when repository evidence disagrees.

Arguments:
  ROOT_DIR       Repo root containing CONTRIBUTING.md (default: walk up from cwd).

Options:
  --root DIR     Same as ROOT_DIR positionally; wins if both given.
  --json         Emit structured JSON instead of a report.
  -q, --quiet    Only print FAIL/SKIP lines, not every OK line.
  -h, --help     Show this help and exit.

Exit codes:
  0  all checks passed        1  at least one check failed        2  usage error
`;

runVerify(process.argv.slice(2), {
  docFile: "CONTRIBUTING.md",
  help: HELP,
  buildResults: ({ repoRoot, text }) => [
    ...checks.verifyCitedPackageScripts(repoRoot, text),
    ...checks.verifyPackageManagerPin(repoRoot, text),
    ...checks.verifyConventionalCommits(repoRoot, 10),
    ...checks.verifyCiClaims(repoRoot, text),
    ...checks.verifyTestPresenceClaims(repoRoot, text),
  ],
});
