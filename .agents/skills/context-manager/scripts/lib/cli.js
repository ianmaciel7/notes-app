"use strict";
// Shared CLI plumbing for context-manager's scripts/*.js — argument parsing,
// repo-root discovery, and error/help output. Kept dependency-free (no npm
// install step) so every script here stays a single `node scripts/x.js` away
// from running. Per this skill's own Operating Principle #5 (single source
// of truth within a document/package), this logic lives in exactly one
// place instead of being copy-pasted into every script.

const fs = require("fs");
const path = require("path");

/**
 * Parse argv against a flag spec.
 * @param {string[]} argv
 * @param {{valueFlags?: Record<string,string>, boolFlags?: Record<string,string>}} spec
 *   valueFlags: { "--root": "root" }        -> consumes the next argv as a value
 *   boolFlags:  { "--json": "json", "-q": "quiet", "--quiet": "quiet" }
 * @returns {Record<string, any> & { positionals: string[] }}
 */
function parseArgs(argv, { valueFlags = {}, boolFlags = {} } = {}) {
  const result = { positionals: [] };
  for (const key of Object.values(valueFlags)) result[key] = null;
  for (const key of Object.values(boolFlags)) result[key] = false;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a in boolFlags) {
      result[boolFlags[a]] = true;
      continue;
    }
    if (a in valueFlags) {
      if (i + 1 >= argv.length) {
        errorExit(`Error: ${a} requires a value.\n       Received nothing after ${a}.\nRun with --help for usage.`);
      }
      result[valueFlags[a]] = argv[++i];
      continue;
    }
    if (!a.startsWith("-")) {
      result.positionals.push(a);
      continue;
    }
    errorExit(`Error: unrecognized option "${a}".\nRun with --help for usage.`);
  }
  return result;
}

/** Print a usage error to stderr and exit(2) — the shared "bad invocation" exit code. */
function errorExit(message, code = 2) {
  process.stderr.write(message.endsWith("\n") ? message : message + "\n");
  process.exit(code);
}

/** Print --help text verbatim to stdout and exit(0). */
function printHelpAndExit(helpText) {
  process.stdout.write(helpText);
  process.exit(0);
}

/**
 * Walk upward from startDir looking for a directory containing every path
 * in `markers` (e.g. ["package.json"] or ["package.json", "src/components/ui"]).
 * Returns the matching absolute directory, or null after maxDepth hops.
 */
function findRepoRoot(startDir, markers, maxDepth = 8) {
  let dir = path.resolve(startDir);
  for (let i = 0; i < maxDepth; i++) {
    if (markers.every((m) => fs.existsSync(path.join(dir, m)))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/** List root-level *.md files (non-recursive) in a directory, absolute paths. */
function findRootMarkdownFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .map((f) => path.join(dir, f));
}

/**
 * Render an array of check results ({id, status: "ok"|"fail"|"skip", message})
 * consistently across every verify-*.js script, then exit with the shared
 * convention: 0 if nothing failed, 1 if anything failed.
 * @param {{json?: boolean, quiet?: boolean}} args
 * @param {string} docLabel  e.g. "README.md"
 * @param {Array<{id:string, status:string, message:string}>} results
 */
function report(args, docLabel, results) {
  const failed = results.filter((r) => r.status === "fail");
  const skipped = results.filter((r) => r.status === "skip");

  if (args.json) {
    process.stdout.write(JSON.stringify({ doc: docLabel, results, failed: failed.length, skipped: skipped.length, total: results.length }, null, 2) + "\n");
  } else {
    process.stdout.write(`Verifying ${docLabel}\n\n`);
    const toShow = args.quiet ? results.filter((r) => r.status !== "ok") : results;
    if (toShow.length === 0) {
      process.stdout.write(results.length === 0 ? "No checks applicable.\n" : `All ${results.length} check(s) passed. (--quiet: OK lines suppressed)\n`);
    } else {
      for (const r of toShow) {
        const flag = r.status === "ok" ? "OK  " : r.status === "skip" ? "SKIP" : "FAIL";
        process.stdout.write(`${flag}  [${r.id}] ${r.message}\n`);
      }
    }
    if (failed.length > 0) process.stderr.write(`\n${failed.length} of ${results.length} check(s) failed.\n`);
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

/**
 * Shared entrypoint for every verify-<pillar>.js script: parses the common
 * --root/--json/--quiet/--help flags plus a positional ROOT_DIR, resolves
 * the repo root, reads (or notes the absence of) the target doc file, calls
 * `buildResults` to run the actual checks, and reports+exits consistently.
 *
 * @param {string[]} argv
 * @param {{
 *   docFile: string,          // e.g. "README.md", relative to repo root
 *   help: string,             // full --help text
 *   requireDoc?: boolean,     // default true — fail(doc-exists) if missing
 *   buildResults: (ctx: {repoRoot:string, docPath:string, text:string|null, args:object}) => Array<{id,status,message}>,
 * }} opts
 */
function runVerify(argv, { docFile, help, requireDoc = true, buildResults }) {
  const args = parseArgs(argv, {
    valueFlags: { "--root": "root" },
    boolFlags: { "--json": "json", "--quiet": "quiet", "-q": "quiet", "--help": "help", "-h": "help" },
  });
  if (args.help) printHelpAndExit(help);

  const rootArg = args.root || args.positionals[0] || null;
  const repoRoot = rootArg ? path.resolve(rootArg) : findRepoRoot(process.cwd(), ["package.json"]);
  if (!repoRoot) {
    errorExit(
      `Error: could not find a repo root containing package.json.\n       Searched from: ${rootArg ? path.resolve(rootArg) : process.cwd()}\nPass ROOT_DIR explicitly.`
    );
  }

  const docPath = path.join(repoRoot, docFile);
  const exists = fs.existsSync(docPath);
  const text = exists ? fs.readFileSync(docPath, "utf8") : null;

  if (!exists && requireDoc) {
    report(args, docFile, [{ id: "doc-exists", status: "fail", message: `${docFile} not found at repo root (${repoRoot}).` }]);
    return;
  }

  const results = buildResults({ repoRoot, docPath, text, args });
  report(args, docFile, results);
}

module.exports = { parseArgs, errorExit, printHelpAndExit, findRepoRoot, findRootMarkdownFiles, report, runVerify };
