#!/usr/bin/env node
"use strict";

const { runVerify } = require("./lib/cli");
const checks = require("./lib/verify");

const HELP = `Usage: scripts/verify-security.js [OPTIONS] [ROOT_DIR]

Verifies SECURITY.md's grounded claims against real repo state:
  - .env* file handling: no .env* files present, OR if present, .gitignore
    actually excludes them (a real secret-leak check, not just a doc check).
  - Security package scripts it cites exist.
  - CI/workflow claims match .github/workflows/.
  - Concrete cited repository paths exist.

Arguments:
  ROOT_DIR       Repo root containing SECURITY.md (default: walk up from cwd).

Options:
  --root DIR     Same as ROOT_DIR positionally; wins if both given.
  --json         Emit structured JSON instead of a report.
  -q, --quiet    Only print FAIL/SKIP lines, not every OK line.
  -h, --help     Show this help and exit.

Exit codes:
  0  all checks passed        1  at least one check failed        2  usage error
`;

runVerify(process.argv.slice(2), {
  docFile: "SECURITY.md",
  help: HELP,
  buildResults: ({ repoRoot, text }) => [
    ...checks.verifyEnvHandling(repoRoot),
    ...checks.verifyCitedPackageScripts(repoRoot, text),
    ...checks.verifyCiClaims(repoRoot, text),
    ...checks.verifyCitedRepoPaths(repoRoot, text),
  ],
});
