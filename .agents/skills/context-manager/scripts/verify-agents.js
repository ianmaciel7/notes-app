#!/usr/bin/env node
"use strict";

const { runVerify } = require("./lib/cli");
const checks = require("./lib/verify");

const HELP = `Usage: scripts/verify-agents.js [OPTIONS] [ROOT_DIR]

Verifies AGENTS.md against agents-template.md's governance rules:
  - The tool-generated block (if any) matches what \`next dev\` would
    currently write, by calling Next.js's own generator module directly
    (skipped gracefully, not failed, if this isn't a Next.js repo).
  - Every pnpm/npm/yarn command it cites exists in package.json.
  - Instruction size stays within the project budget (12k target / 16k hard max).
  - Cited repository-local Markdown/JSON paths exist.

Arguments:
  ROOT_DIR       Repo root containing AGENTS.md (default: walk up from cwd).

Options:
  --root DIR     Same as ROOT_DIR positionally; wins if both given.
  --json         Emit structured JSON instead of a report.
  -q, --quiet    Only print FAIL/SKIP lines, not every OK line.
  -h, --help     Show this help and exit.

Exit codes:
  0  all checks passed        1  at least one check failed        2  usage error
`;

runVerify(process.argv.slice(2), {
  docFile: "AGENTS.md",
  help: HELP,
  requireDoc: false, // AGENTS.md is optional in the 10-pillar sense — absence is its own signal, not a hard failure here
  buildResults: ({ repoRoot, text }) => {
    if (text === null)
      return [checks.skip("doc-exists", "No AGENTS.md at repo root.")];
    return [
      ...checks.verifyAgentsGeneratedBlock(repoRoot),
      ...checks.verifyAgentsInstructionBudget(text),
      ...checks.verifyAgentsCitedPaths(repoRoot, text),
      ...checks.verifyCitedPackageScripts(repoRoot, text),
    ];
  },
});
