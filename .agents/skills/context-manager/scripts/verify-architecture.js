#!/usr/bin/env node
"use strict";

const { runVerify } = require("./lib/cli");
const checks = require("./lib/verify");

const HELP = `Usage: scripts/verify-architecture.js [OPTIONS] [ROOT_DIR]

Verifies ARCHITECTURE.md against real repo state:
  - Every local markdown link (including ADR links like
    ./docs/adr/0001-foo.md) resolves to a real file.
  - Every component/primitive count it cites matches the real
    src/components/ui/*.tsx count.
  - Any exact dependency version it cites (e.g. "Next.js 16.3.5") matches
    the version range actually pinned in package.json.

Arguments:
  ROOT_DIR       Repo root containing ARCHITECTURE.md (default: walk up from cwd).

Options:
  --root DIR     Same as ROOT_DIR positionally; wins if both given.
  --json         Emit structured JSON instead of a report.
  -q, --quiet    Only print FAIL/SKIP lines, not every OK line.
  -h, --help     Show this help and exit.

Exit codes:
  0  all checks passed        1  at least one check failed        2  usage error
`;

runVerify(process.argv.slice(2), {
  docFile: "ARCHITECTURE.md",
  help: HELP,
  buildResults: ({ repoRoot, docPath, text }) => [
    ...checks.verifyLocalMdLinks(repoRoot, docPath, text),
    ...checks.verifyComponentCountMentions(repoRoot, text, "ARCHITECTURE.md"),
    ...checks.verifyVersionClaims(repoRoot, text),
  ],
});
