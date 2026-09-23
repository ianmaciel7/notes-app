#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { runVerify, findRootMarkdownFiles } = require("./lib/cli");
const checks = require("./lib/verify");

const HELP = `Usage: scripts/verify-context.js [OPTIONS] [ROOT_DIR]

Verifies CONTEXT.md against context-template.md's "_Avoid_ Lists Prevent
Drift" governance rule: for every rejected synonym listed under a "_Avoid_:"
line, checks that word doesn't actually appear in any other root-level *.md
doc — if it does, either the glossary term isn't being followed, or the
_Avoid_ list itself is stale.

This only covers the glossary ("_Avoid_" list) variant of CONTEXT.md. If
this repo deliberately uses the broader "codebase briefing" variant instead
(per context-template.md), there may be nothing for this script to check —
that's expected, not a failure.

Arguments:
  ROOT_DIR       Repo root containing CONTEXT.md (default: walk up from cwd).

Options:
  --root DIR     Same as ROOT_DIR positionally; wins if both given.
  --json         Emit structured JSON instead of a report.
  -q, --quiet    Only print FAIL/SKIP lines, not every OK line.
  -h, --help     Show this help and exit.

Exit codes:
  0  all checks passed        1  at least one check failed        2  usage error
`;

runVerify(process.argv.slice(2), {
  docFile: "CONTEXT.md",
  help: HELP,
  buildResults: ({ repoRoot, docPath, text }) => {
    const otherDocs = {};
    for (const file of findRootMarkdownFiles(repoRoot)) {
      if (path.resolve(file) === path.resolve(docPath)) continue;
      otherDocs[path.basename(file)] = fs.readFileSync(file, "utf8");
    }
    return checks.verifyAvoidSynonymLeakage(text, otherDocs);
  },
});
