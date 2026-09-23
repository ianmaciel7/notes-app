#!/usr/bin/env node
"use strict";

const { runVerify } = require("./lib/cli");
const checks = require("./lib/verify");

const HELP = `Usage: scripts/verify-design.js [OPTIONS] [ROOT_DIR]

Verifies DESIGN.md against the real external design.md spec
(github.com/google-labs-code/design.md) and real code:
  - H2 section headings follow the spec's canonical order (Overview ->
    Colors -> Typography -> Layout -> Elevation & Depth -> Shapes ->
    Components -> Do's and Don'ts), aliases allowed, omissions allowed.
    Pure text parsing — does not shell out to \`npx @google/design.md lint\`.
  - Every component/primitive count it cites matches the real
    src/components/ui/*.tsx count.

Arguments:
  ROOT_DIR       Repo root containing DESIGN.md (default: walk up from cwd).

Options:
  --root DIR     Same as ROOT_DIR positionally; wins if both given.
  --json         Emit structured JSON instead of a report.
  -q, --quiet    Only print FAIL/SKIP lines, not every OK line.
  -h, --help     Show this help and exit.

Exit codes:
  0  all checks passed        1  at least one check failed        2  usage error
`;

runVerify(process.argv.slice(2), {
  docFile: "DESIGN.md",
  help: HELP,
  buildResults: ({ repoRoot, text }) => [...checks.verifyDesignMdStructure(text), ...checks.verifyComponentCountMentions(repoRoot, text, "DESIGN.md")],
});
