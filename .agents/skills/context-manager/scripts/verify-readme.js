#!/usr/bin/env node
"use strict";

const { runVerify } = require("./lib/cli");
const checks = require("./lib/verify");

const HELP = `Usage: scripts/verify-readme.js [OPTIONS] [ROOT_DIR]

Verifies README.md against readme-template.md's governance rules:
  - No leftover scaffold-generated boilerplate text.
  - Every local markdown link resolves.
  - Every pnpm/npm/yarn command it cites exists in package.json.

Arguments:
  ROOT_DIR       Repo root containing README.md (default: walk up from cwd).

Options:
  --root DIR     Same as ROOT_DIR positionally; wins if both given.
  --json         Emit structured JSON instead of a report.
  -q, --quiet    Only print FAIL/SKIP lines, not every OK line.
  -h, --help     Show this help and exit.

Exit codes:
  0  all checks passed        1  at least one check failed        2  usage error
`;

runVerify(process.argv.slice(2), {
  docFile: "README.md",
  help: HELP,
  buildResults: ({ repoRoot, docPath, text }) => [
    ...checks.verifyReadmeBoilerplate(text),
    ...checks.verifyLocalMdLinks(repoRoot, docPath, text),
    ...checks.verifyCitedPackageScripts(repoRoot, text),
  ],
});
