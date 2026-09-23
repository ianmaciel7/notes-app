#!/usr/bin/env node
"use strict";

const { runVerify } = require("./lib/cli");
const checks = require("./lib/verify");

const HELP = `Usage: scripts/verify-security.js [OPTIONS] [ROOT_DIR]

Verifies SECURITY.md's grounded claims against real repo state:
  - .env* file handling: no .env* files present, OR if present, .gitignore
    actually excludes them (a real secret-leak check, not just a doc check).
  - CI existence — informational: reports whether .github/workflows/ exists
    so you can eyeball it against what SECURITY.md claims.

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
  buildResults: ({ repoRoot }) => [...checks.verifyEnvHandling(repoRoot), ...checks.verifyCiExistence(repoRoot, null)],
});
