#!/usr/bin/env node
"use strict";

const { runVerify } = require("./lib/cli");
const checks = require("./lib/verify");

const HELP = `Usage: scripts/verify-testing.js [OPTIONS] [ROOT_DIR]

Verifies TESTING.md's grounded claims against real repo state:
  - Every pnpm/npm/yarn command it cites (e.g. \`pnpm ladle\`) exists in
    package.json — including correctly recognizing "there is no \`pnpm test\`
    script" as documenting an absence, not citing a real command.
  - Story-coverage and component-count mentions match the real
    src/components/ui/*.tsx count.
  - CI claims match .github/workflows/.
  - Claims about an existing/absent test suite match source test files.
  - Concrete cited repository paths exist.

Arguments:
  ROOT_DIR       Repo root containing TESTING.md (default: walk up from cwd).

Options:
  --root DIR     Same as ROOT_DIR positionally; wins if both given.
  --json         Emit structured JSON instead of a report.
  -q, --quiet    Only print FAIL/SKIP lines, not every OK line.
  -h, --help     Show this help and exit.

Exit codes:
  0  all checks passed        1  at least one check failed        2  usage error
`;

runVerify(process.argv.slice(2), {
  docFile: "TESTING.md",
  help: HELP,
  buildResults: ({ repoRoot, text }) => [
    ...checks.verifyCitedPackageScripts(repoRoot, text),
    ...checks.verifyComponentCountMentions(repoRoot, text, "TESTING.md"),
    ...checks.verifyCiClaims(repoRoot, text),
    ...checks.verifyTestPresenceClaims(repoRoot, text),
    ...checks.verifyCitedRepoPaths(repoRoot, text),
  ],
});
