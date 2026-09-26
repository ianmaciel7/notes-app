#!/usr/bin/env node
"use strict";

const { runVerify } = require("./lib/cli");
const checks = require("./lib/verify");

const HELP = `Usage: scripts/verify-conventions.js [OPTIONS] [ROOT_DIR]

Verifies CONVENTIONS.md's grounded claims against real code:
  - Any "N of M component files" claim (e.g. "38 of 61 component files use
    \\"use client\\"") is checked against a real grep of src/components/ui/ —
    both the numerator AND the denominator independently.
  - General component/primitive count mentions elsewhere in the doc.

Arguments:
  ROOT_DIR       Repo root containing CONVENTIONS.md (default: walk up from cwd).

Options:
  --root DIR     Same as ROOT_DIR positionally; wins if both given.
  --json         Emit structured JSON instead of a report.
  -q, --quiet    Only print FAIL/SKIP lines, not every OK line.
  -h, --help     Show this help and exit.

Exit codes:
  0  all checks passed        1  at least one check failed        2  usage error
`;

runVerify(process.argv.slice(2), {
  docFile: "CONVENTIONS.md",
  help: HELP,
  buildResults: ({ repoRoot, text }) => [
    ...checks.verifyNOfMClaim(repoRoot, text, {
      label: "use-client-count",
      keyword: "component files",
      countRealFn: checks.getUseClientFileCount,
    }),
    ...checks.verifyComponentCountMentions(repoRoot, text, "CONVENTIONS.md"),
  ],
});
