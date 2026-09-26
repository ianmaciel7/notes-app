#!/usr/bin/env node
"use strict";

const { runVerify } = require("./lib/cli");
const checks = require("./lib/verify");

const HELP = `Usage: scripts/verify-intent.js [OPTIONS] [ROOT_DIR]

Verifies INTENT.md's concrete, checkable claims — the human-in-the-loop
sign-off and immutability-of-scope rules in intent-template.md are process,
not automatable, so this script only checks what's actually verifiable:
  - Every .ts/.tsx filename INTENT.md cites in backticks (e.g. \`bubble.tsx\`)
    actually exists under src/components/ui/ or src/app/.

Arguments:
  ROOT_DIR       Repo root containing INTENT.md (default: walk up from cwd).

Options:
  --root DIR     Same as ROOT_DIR positionally; wins if both given.
  --json         Emit structured JSON instead of a report.
  -q, --quiet    Only print FAIL/SKIP lines, not every OK line.
  -h, --help     Show this help and exit.

Exit codes:
  0  all checks passed        1  at least one check failed        2  usage error
`;

runVerify(process.argv.slice(2), {
  docFile: "INTENT.md",
  help: HELP,
  buildResults: ({ repoRoot, text }) =>
    checks.verifyCitedFilesExist(repoRoot, text),
});
