"use strict";
// Reusable check primitives shared across scripts/verify-*.js.
//
// Naming convention:
//   getX(...)     -> pure data accessor, returns a fact (no pass/fail judgment)
//   verifyX(...)  -> validator, returns Array<{id, status, message}> — matches
//                    the verify-<pillar>.js scripts that call these
//   ok/fail/skip  -> result constructors ({id, status, message})
//
// Kept in one place (not copy-pasted per script) per this skill's own
// single-source-of-truth principle, now applied to the scripts themselves.
//
// Contents:
//   1. Component/primitive counts      getRealComponentCount, verifyComponentCountMentions,
//                                       verifyNOfMClaim, getUseClientFileCount
//   2. Local markdown links            verifyLocalMdLinks
//   3. Cited package.json scripts      verifyCitedPackageScripts
//   4. README scaffold boilerplate     verifyReadmeBoilerplate
//   5. DESIGN.md canonical structure   verifyDesignMdStructure
//   6. AGENTS.md generated block       verifyAgentsGeneratedBlock
//   7. Secrets / .env handling         verifyEnvHandling
//   8. CI/test drift claims            verifyCiExistence, verifyCiClaims, verifyTestPresenceClaims
//   9. Repository-path citations       verifyCitedRepoPaths
//  10. Configured quality thresholds   verifyJscpdThreshold, verifyLighthouseAccessibilityThreshold
//  11. Dependency version claims       verifyVersionClaims
//  12. CONTEXT.md _Avoid_ leakage      verifyAvoidSynonymLeakage
//  13. Cited source files exist        verifyCitedFilesExist
//  14. Git history conventions         verifyConventionalCommits
//  15. Package manager pin             verifyPackageManagerPin

const fs = require("fs");
const path = require("path");

function ok(id, message) {
  return { id, status: "ok", message };
}
function fail(id, message) {
  return { id, status: "fail", message };
}
function skip(id, message) {
  return { id, status: "skip", message };
}

// ===========================================================================
// 1. Component/primitive counts (src/components/ui/*.tsx)
// ===========================================================================

function getRealComponentCount(repoRoot) {
  const uiDir = path.join(repoRoot, "src", "components", "ui");
  if (!fs.existsSync(uiDir)) return null;
  const allTsx = fs.readdirSync(uiDir).filter((f) => f.endsWith(".tsx"));
  return { count: allTsx.filter((f) => !f.endsWith(".stories.tsx")).length, totalTsxFiles: allTsx.length };
}

/** Find "N component(s)"/"N primitive(s)" mentions near a keyword, private to this module. */
function findComponentCountMentions(text) {
  const mentions = [];
  const keywordRe = /\b(components?|primitives?)\b/gi;
  let m;
  while ((m = keywordRe.exec(text)) !== null) {
    const windowStart = Math.max(0, m.index - 40);
    const window = text.slice(windowStart, m.index);
    const numMatch = window.match(/(?:~|of\s+)?(\d+)\s*(?:UI\s+)?$/i) || window.match(/(\d+)[^\d]*$/);
    if (!numMatch) continue;
    const number = parseInt(numMatch[1], 10);
    const lineStart = text.lastIndexOf("\n", m.index) + 1;
    const lineEnd = text.indexOf("\n", m.index);
    mentions.push({ number, line: text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd).trim() });
  }
  return mentions;
}

/**
 * Check every component/primitive count mention in `text` against reality.
 * A FAIL can be a legitimate different fact (e.g. "60 without a story" when
 * the real total is 61 — that's 61 minus the 1 that has a story, not
 * drift) — present these as candidates to review, not hard failures.
 */
function verifyComponentCountMentions(repoRoot, text, docLabel) {
  const real = getRealComponentCount(repoRoot);
  if (!real) return [skip("component-count", "src/components/ui/ not found — skipping count checks.")];
  const mentions = findComponentCountMentions(text).filter((m) => !(m.number < real.count - 5 && m.number < 10)); // drop unrelated small numbers, e.g. "6 variants"
  return mentions.map((m) =>
    m.number === real.count || m.number === real.totalTsxFiles
      ? ok("component-count", `${docLabel} cites "${m.number}" — matches real count (${real.count}).`)
      : fail("component-count", `${docLabel} cites "${m.number}" but real count is ${real.count}: "${m.line}"`)
  );
}

/**
 * Check a specific "<N> of <M> <keyword>" claim (e.g. CONVENTIONS.md's "38
 * of 61 component files use `"use client"`") against a real count from
 * `countRealFn(repoRoot)`, which must return { total, matching }.
 */
function verifyNOfMClaim(repoRoot, text, { label, keyword, countRealFn }) {
  const m = text.match(new RegExp(`(\\d+)\\s+of\\s+(\\d+)\\s+${keyword}`, "i"));
  if (!m) return [skip(label, `No "N of M ${keyword}" claim found — nothing to check.`)];
  const claimedN = parseInt(m[1], 10);
  const claimedM = parseInt(m[2], 10);
  const real = countRealFn(repoRoot);
  if (real == null) return [skip(label, "Could not compute the real count — skipping.")];
  return [
    real.total === claimedM
      ? ok(label, `Denominator "${claimedM}" matches real total (${real.total}).`)
      : fail(label, `Denominator claims ${claimedM} but real total is ${real.total}.`),
    real.matching === claimedN
      ? ok(label, `Numerator "${claimedN}" matches real count (${real.matching}).`)
      : fail(label, `Numerator claims ${claimedN} but real count is ${real.matching}.`),
  ];
}

function getUseClientFileCount(repoRoot) {
  const uiDir = path.join(repoRoot, "src", "components", "ui");
  if (!fs.existsSync(uiDir)) return null;
  const files = fs.readdirSync(uiDir).filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"));
  const matching = files.filter((f) => fs.readFileSync(path.join(uiDir, f), "utf8").includes('"use client"')).length;
  return { total: files.length, matching };
}

// ===========================================================================
// 2. Local markdown links
// ===========================================================================

function verifyLocalMdLinks(repoRoot, filePath, text) {
  const results = [];
  const linkRe = /\[([^\]]*)\]\(([^)]+)\)/g;
  let m;
  while ((m = linkRe.exec(text)) !== null) {
    const target = m[2].trim();
    if (/^https?:\/\//i.test(target) || target.startsWith("mailto:") || target.startsWith("#")) continue;
    if (!target.toLowerCase().endsWith(".md")) continue;
    const cleanTarget = target.split("#")[0];
    const resolved = path.resolve(path.dirname(filePath), cleanTarget);
    results.push(
      fs.existsSync(resolved)
        ? ok("doc-links", `Link to ${cleanTarget} resolves.`)
        : fail("doc-links", `Link to ${cleanTarget} ("${m[1]}") does not resolve — looked for ${resolved}`)
    );
  }
  if (results.length === 0) results.push(skip("doc-links", "No local .md links found."));
  return results;
}

// ===========================================================================
// 3. Cited package.json scripts (pnpm/npm/yarn commands)
// ===========================================================================

const PACKAGE_MANAGER_BUILTINS = new Set([
  "install", "i", "add", "remove", "rm", "uninstall", "un", "run", "run-script", "exec", "dlx", "create",
  "init", "update", "up", "outdated", "audit", "list", "ls", "why", "link", "unlink", "publish", "pack",
  "config", "get", "cache", "prune", "rebuild", "start", "restart", "stop", "root", "bin", "version",
  "pkg", "doctor", "licenses", "patch", "approve-builds", "deploy", "fetch",
]);
const NEGATION_RE = /\b(no|not|n't|doesn't|isn't|aren't|without)\b/i;

function verifyCitedPackageScripts(repoRoot, text) {
  const pkgPath = path.join(repoRoot, "package.json");
  if (!fs.existsSync(pkgPath)) return [skip("package-scripts", "No package.json at repo root.")];
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  } catch (e) {
    return [skip("package-scripts", `Could not parse package.json: ${e.message}`)];
  }
  const scripts = new Set(Object.keys(pkg.scripts || {}));
  const re = /`(?:pnpm|npm run|npm|yarn)\s+([a-zA-Z][\w:-]*)`|(?:^|\n)\s*(?:pnpm|npm run|npm|yarn)\s+([a-zA-Z][\w:-]*)/g;
  const results = [];
  const seen = new Set();
  let m;
  while ((m = re.exec(text)) !== null) {
    const word = m[1] || m[2];
    if (!word || PACKAGE_MANAGER_BUILTINS.has(word) || seen.has(word)) continue;
    seen.add(word);
    const lineStart = text.lastIndexOf("\n", m.index) + 1;
    const lineEnd = text.indexOf("\n", m.index);
    const line = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd).trim();
    if (scripts.has(word)) results.push(ok("package-scripts", `"${word}" is a real package.json script.`));
    else if (NEGATION_RE.test(line)) results.push(ok("package-scripts", `"${word}" correctly documented as absent: "${line}"`));
    else results.push(fail("package-scripts", `"${word}" cited but not in package.json scripts: "${line}"`));
  }
  if (results.length === 0) results.push(skip("package-scripts", "No pnpm/npm/yarn commands cited."));
  return results;
}

// ===========================================================================
// 4. README scaffold-boilerplate signatures
// ===========================================================================

const SCAFFOLD_SIGNATURES = [
  { scaffold: "create-next-app", phrase: "bootstrapped with [`create-next-app`]" },
  { scaffold: "create-next-app", phrase: "This project uses [`next/font`]" },
  { scaffold: "create-next-app", phrase: "Deploy on Vercel" },
  { scaffold: "create-react-app", phrase: "This project was bootstrapped with [Create React App]" },
  { scaffold: "vite", phrase: "npm create vite@latest" },
  { scaffold: "create-vue", phrase: "This template should help get you started developing with Vue" },
];

function verifyReadmeBoilerplate(text) {
  const found = SCAFFOLD_SIGNATURES.filter((s) => text.includes(s.phrase));
  if (found.length === 0) return [ok("scaffold-boilerplate", "No known scaffold boilerplate signatures found.")];
  return found.map((f) => fail("scaffold-boilerplate", `Still contains [${f.scaffold}] signature: "${f.phrase}"`));
}

// ===========================================================================
// 5. DESIGN.md canonical H2 section order (github.com/google-labs-code/design.md)
// ===========================================================================

const DESIGN_CANONICAL_ORDER = ["Overview", "Colors", "Typography", "Layout", "Elevation & Depth", "Shapes", "Components", "Do's and Don'ts"];
const DESIGN_ALIASES = { "brand & style": "Overview", "layout & spacing": "Layout", elevation: "Elevation & Depth" };

function verifyDesignMdStructure(text) {
  const headings = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) headings.push(m[1].replace(/\s*\(`[^`]*`\)\s*$/, "").trim());
  }
  const canonicalize = (h) => {
    const clean = h.trim();
    if (DESIGN_CANONICAL_ORDER.includes(clean)) return clean;
    return DESIGN_ALIASES[clean.toLowerCase()] || null;
  };

  const found = [];
  headings.forEach((h, i) => {
    const c = canonicalize(h);
    if (c) found.push({ heading: h, canonical: c, index: i });
  });

  const results = [];
  let lastPos = -1;
  for (const f of found) {
    const pos = DESIGN_CANONICAL_ORDER.indexOf(f.canonical);
    if (pos < lastPos) results.push(fail("design-section-order", `"${f.canonical}" appears out of the spec's canonical order (via heading "${f.heading}").`));
    else {
      lastPos = pos;
      results.push(ok("design-section-order", `"${f.canonical}" is in canonical position.`));
    }
  }
  const present = new Set(found.map((f) => f.canonical));
  const missing = DESIGN_CANONICAL_ORDER.filter((c) => !present.has(c));
  if (missing.length) results.push(skip("design-section-order", `Canonical sections omitted (allowed by spec, verify intentional): ${missing.join(", ")}`));
  if (found.length === 0) results.push(skip("design-section-order", "No canonical design.md H2 sections found."));
  return results;
}


function getDesignFrontmatter(text) {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---\n", 4);
  return end < 0 ? null : text.slice(4, end);
}

function verifyDesignTopLevelKeys(text) {
  const fm = getDesignFrontmatter(text);
  if (fm === null) return [fail("design-frontmatter", "DESIGN.md is missing valid YAML frontmatter fences.")];
  const allowed = new Set(["version", "name", "description", "omitted", "colors", "typography", "rounded", "spacing", "components"]);
  const keys = [];
  for (const line of fm.split("\n")) {
    const m = line.match(/^([A-Za-z][\w-]*):(?:\s|$)/);
    if (m) keys.push(m[1]);
  }
  const unknown = keys.filter((key) => !allowed.has(key));
  return unknown.length === 0
    ? [ok("design-frontmatter", "DESIGN.md uses only documented top-level frontmatter groups.")]
    : [fail("design-frontmatter", `Unknown top-level DESIGN.md key(s): ${unknown.join(", ")}.`)];
}

function verifyDesignDimensionValues(text) {
  const fm = getDesignFrontmatter(text);
  if (fm === null) return [skip("design-dimensions", "No frontmatter to inspect.")];
  const invalid = [];
  let section = null;
  for (const line of fm.split("\n")) {
    const top = line.match(/^([A-Za-z][\w-]*):(?:\s|$)/);
    if (top) {
      section = top[1];
      continue;
    }
    if (!["rounded", "spacing"].includes(section)) continue;
    const m = line.match(/^\s{2}([\w-]+):\s*(.+?)\s*(?:#.*)?$/);
    if (!m) continue;
    const raw = m[2].replace(/^["']|["']$/g, "").trim();
    if (section === "spacing" && /^-?\d+(?:\.\d+)?$/.test(raw)) continue;
    if (!/^-?\d+(?:\.\d+)?(?:px|em|rem)$/.test(raw)) invalid.push(`${section}.${m[1]}=${raw}`);
  }
  return invalid.length === 0
    ? [ok("design-dimensions", "Rounded/spacing frontmatter values use schema-compatible dimensions/numbers.")]
    : [fail("design-dimensions", `Invalid DESIGN.md dimension token(s): ${invalid.join(", ")}.`)];
}

// ===========================================================================
// 6. AGENTS.md tool-generated block (Next.js-specific; delegates to the real
//    generator module rather than re-implementing its logic)
// ===========================================================================

function verifyAgentsGeneratedBlock(repoRoot) {
  const agentsMdPath = path.join(repoRoot, "AGENTS.md");
  if (!fs.existsSync(agentsMdPath)) return [skip("generated-block", "No AGENTS.md at repo root.")];

  const generatorPath = path.join(repoRoot, "node_modules", "next", "dist", "server", "lib", "generate-agent-files.js");
  let generator;
  try {
    generator = require(generatorPath);
  } catch {
    return [skip("generated-block", `Next.js generator module not found at ${generatorPath} — not a Next.js repo, or 'next' isn't hoisted here.`)];
  }
  if (typeof generator.hasCurrentAgentRules !== "function") {
    return [skip("generated-block", "Generator module found but hasCurrentAgentRules() is missing — installed Next.js version may have changed its shape.")];
  }
  const current = generator.hasCurrentAgentRules(repoRoot);
  return [
    current
      ? ok("generated-block", "AGENTS.md's tool-generated block matches what next dev would currently write.")
      : fail("generated-block", "AGENTS.md's tool-generated block does NOT match current generator output — hand-edited, or Next.js version changed (next dev will re-sync)."),
  ];
}

// ===========================================================================
// 7. AGENTS.md instruction budget and cited local paths
// ===========================================================================

function verifyAgentsInstructionBudget(text, targetChars = 12000, maxBytes = 16000) {
  const chars = Array.from(text).length;
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes > maxBytes) {
    return [fail("agents-budget", `AGENTS.md is ${bytes} UTF-8 bytes (hard maximum: ${maxBytes}; target: <= ${targetChars} characters).`)];
  }
  if (chars > targetChars) {
    return [skip("agents-budget", `AGENTS.md is ${chars} characters / ${bytes} bytes: within the hard maximum but above the ${targetChars}-character target; split task-specific guidance.`)];
  }
  return [ok("agents-budget", `AGENTS.md is ${chars} characters / ${bytes} bytes, within the ${targetChars}-character target and ${maxBytes}-byte hard maximum.`)];
}

function verifyAgentsCitedPaths(repoRoot, text) {
  const results = [];
  const seen = new Set();
  const re = /`([a-zA-Z0-9_./-]+\.(?:md|json))`/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const cited = m[1];
    if (seen.has(cited) || cited.includes("*")) continue;
    seen.add(cited);
    const resolved = path.join(repoRoot, cited);
    results.push(
      fs.existsSync(resolved)
        ? ok("agents-paths", `${cited} exists.`)
        : fail("agents-paths", `${cited} is cited by AGENTS.md but does not exist at repository root-relative path ${resolved}.`)
    );
  }
  if (results.length === 0) results.push(skip("agents-paths", "No local Markdown/JSON paths cited."));
  return results;
}

// ===========================================================================
// 7. Secrets / .env handling (SECURITY.md)
// ===========================================================================

/**
 * Delegates to `git check-ignore` per file rather than reimplementing
 * .gitignore pattern matching — a naive regex like /^\s*\.env\*?/ would
 * treat a narrow entry like ".env.local" as covering ALL .env* files,
 * silently missing an uncovered ".env.production" sitting right next to
 * it. gitignore syntax (negation, anchoring, globs) is genuinely gnarly;
 * git already implements it correctly, so ask git instead of guessing.
 */
function verifyEnvHandling(repoRoot) {
  const envFiles = fs.existsSync(repoRoot) ? fs.readdirSync(repoRoot).filter((f) => /^\.env/.test(f)) : [];
  if (envFiles.length === 0) return [ok("env-files", "No .env* files present at repo root.")];

  const { execFileSync } = require("child_process");
  const uncovered = [];
  let gitAvailable = true;
  for (const f of envFiles) {
    try {
      execFileSync("git", ["check-ignore", "-q", f], { cwd: repoRoot, stdio: "ignore" });
      // exit 0 -> ignored, nothing to do
    } catch (e) {
      if (e.status === 1) uncovered.push(f); // git ran fine, file just isn't ignored
      else gitAvailable = false; // git missing, not a repo, or another real error — can't verify
    }
  }

  if (!gitAvailable) return [skip("env-files", `${envFiles.length} .env* file(s) present but \`git check-ignore\` failed to run — not a git repo, or git unavailable. Cannot verify coverage.`)];
  if (uncovered.length === 0) return [ok("env-files", `${envFiles.length} .env* file(s) present, all confirmed ignored by git: ${envFiles.join(", ")}`)];
  return [fail("env-files", `.env* file(s) present and NOT covered by .gitignore (per \`git check-ignore\`) — real secret-leak risk: ${uncovered.join(", ")}`)];
}

// ===========================================================================
// 8. CI existence (TESTING.md / SECURITY.md)
// ===========================================================================

function verifyCiExistence(repoRoot, expectNoCi) {
  const workflowsDir = path.join(repoRoot, ".github", "workflows");
  const exists = fs.existsSync(workflowsDir) && fs.readdirSync(workflowsDir).length > 0;
  if (expectNoCi === null) return [exists ? ok("ci", ".github/workflows/ exists with workflow file(s).") : ok("ci", "No .github/workflows/ — no CI configured.")];
  if (expectNoCi && exists) return [fail("ci", "Doc claims no CI, but .github/workflows/ now has workflow file(s) — doc is stale.")];
  if (!expectNoCi && !exists) return [fail("ci", "Doc assumes CI exists, but no .github/workflows/ found.")];
  return [ok("ci", `CI existence (${exists}) matches what the doc says.`)];
}

function verifyCiClaims(repoRoot, text) {
  const workflowsDir = path.join(repoRoot, ".github", "workflows");
  const workflows = fs.existsSync(workflowsDir)
    ? fs.readdirSync(workflowsDir).filter((f) => /\.ya?ml$/i.test(f))
    : [];
  const exists = workflows.length > 0;
  const claimsNoCi = /\b(?:there (?:is|are)|there's|repository has)\s+no\s+(?:general\s+|test\s+)?(?:ci|github actions|workflows?)\b/i.test(text);
  const claimsCi = /\bGitHub Actions exists\b/i.test(text) || /\.github\/workflows\/[\w.-]+\.ya?ml/i.test(text);

  if (claimsNoCi && exists) {
    return [fail("ci-claim", `Document claims CI/workflows are absent, but found: ${workflows.join(", ")}.`)];
  }
  if (claimsCi && !exists) {
    return [fail("ci-claim", "Document claims CI/workflow automation exists, but .github/workflows/ is empty or absent.")];
  }
  return [ok("ci-claim", `CI claim is compatible with repository state (${workflows.length} workflow file(s)).`)];
}

function listSourceTests(repoRoot) {
  const root = path.join(repoRoot, "src");
  if (!fs.existsSync(root)) return [];
  const found = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (/\.(?:test|spec)\.(?:[cm]?[jt]sx?)$/i.test(entry.name)) found.push(path.relative(repoRoot, full));
    }
  };
  visit(root);
  return found;
}

function verifyTestPresenceClaims(repoRoot, text) {
  const tests = listSourceTests(repoRoot);
  const claimsNoTests = /\b(?:there (?:is|are)|there's|repository has)\s+no\s+(?:automated\s+)?(?:test suite|tests?)\b/i.test(text);
  const claimsTests = /\b(?:unit-test foundation|unit tests?|test suite)\b/i.test(text);

  if (claimsNoTests && tests.length > 0) {
    return [fail("test-presence", `Document claims tests are absent, but found: ${tests.join(", ")}.`)];
  }
  if (claimsTests && tests.length === 0) {
    return [fail("test-presence", "Document describes an existing test suite/foundation, but no src/**/*.test|spec files were found.")];
  }
  return [ok("test-presence", `Test-presence claim is compatible with repository state (${tests.length} source test file(s)).`)];
}

function verifyCitedRepoPaths(repoRoot, text) {
  const results = [];
  const seen = new Set();
  const re = /`([.a-zA-Z0-9_/-]+\.(?:md|json|ya?ml|toml|cjs|mjs|js|ts|tsx))`/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const cited = m[1];
    if (seen.has(cited) || cited.includes("*")) continue;
    seen.add(cited);
    const resolved = path.join(repoRoot, cited);
    results.push(
      fs.existsSync(resolved)
        ? ok("repo-paths", `${cited} exists.`)
        : fail("repo-paths", `${cited} is cited but does not exist at ${resolved}.`)
    );
  }
  if (results.length === 0) results.push(skip("repo-paths", "No concrete repository file paths cited."));
  return results;
}

function verifyJscpdThreshold(repoRoot, text) {
  const configPath = path.join(repoRoot, ".jscpd.json");
  if (!fs.existsSync(configPath)) return [skip("jscpd-threshold", "No .jscpd.json found.")];
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const actual = Number(config.threshold);
  const claim = text.match(/Duplication\s*\|\s*At most\s+(\d+(?:\.\d+)?)%/i);
  if (!claim) return [skip("jscpd-threshold", "No duplication percentage claim found in CONSTRAINTS.md.")];
  const documented = Number(claim[1]);
  return [documented === actual
    ? ok("jscpd-threshold", `Documented duplication threshold (${documented}%) matches .jscpd.json.`)
    : fail("jscpd-threshold", `Documented duplication threshold is ${documented}% but .jscpd.json is ${actual}%.`)];
}

function verifyLighthouseAccessibilityThreshold(repoRoot, text) {
  const configPath = path.join(repoRoot, "lighthouserc.cjs");
  if (!fs.existsSync(configPath)) return [skip("lighthouse-accessibility", "No lighthouserc.cjs found.")];
  const config = fs.readFileSync(configPath, "utf8");
  const actualMatch = config.match(/["']categories:accessibility["']\s*:\s*\[\s*["']error["']\s*,\s*\{\s*minScore:\s*([0-9.]+)/);
  const docMatch = text.match(/Accessibility\s*\|\s*Lighthouse accessibility score at least\s*([0-9.]+)/i);
  if (!actualMatch || !docMatch) return [skip("lighthouse-accessibility", "Could not compare an enforced accessibility minScore claim.")];
  const actual = Number(actualMatch[1]);
  const documented = Number(docMatch[1]);
  return [documented === actual
    ? ok("lighthouse-accessibility", `Documented accessibility floor (${documented}) matches lighthouserc.cjs.`)
    : fail("lighthouse-accessibility", `Documented accessibility floor is ${documented} but lighthouserc.cjs is ${actual}.`)];
}

// ===========================================================================
// 9. Dependency version claims (ARCHITECTURE.md vs package.json)
// ===========================================================================

function verifyVersionClaims(repoRoot, text) {
  const pkgPath = path.join(repoRoot, "package.json");
  if (!fs.existsSync(pkgPath)) return [skip("version-claims", "No package.json at repo root.")];
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const results = [];
  for (const [depName, range] of Object.entries(deps)) {
    const versionInRange = range.replace(/^[\^~]/, "");
    const escapedName = depName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Exclude matches where depName is a substring of a larger identifier
    // on either side — a suffix collision (don't let "react" match inside
    // "@base-ui/react") or a prefix collision (don't let "next" match
    // inside "next-themes"). \b alone only guards \w/\w boundaries; it
    // still treats "/" and "-" as boundaries, which is exactly how both
    // collisions sneak through.
    const nameRe = new RegExp(`(?<![\\w/@-])${escapedName}(?![\\w/-])[^\\n]{0,20}?(\\d+\\.\\d+\\.\\d+)`, "i");
    const m = text.match(nameRe);
    if (!m) continue; // doc doesn't cite an exact version for this dep — nothing to check
    results.push(
      m[1] === versionInRange
        ? ok("version-claims", `${depName} cited as ${m[1]} — matches package.json range (${range}).`)
        : fail("version-claims", `${depName} cited as ${m[1]} but package.json says ${range}.`)
    );
  }
  if (results.length === 0) results.push(skip("version-claims", "No exact dependency versions cited in text to check."));
  return results;
}

// ===========================================================================
// 10. CONTEXT.md _Avoid_ synonym leakage
// ===========================================================================

function verifyAvoidSynonymLeakage(contextText, otherDocsByPath) {
  const results = [];
  const avoidRe = /_Avoid_:\s*(.+)/g;
  let m;
  while ((m = avoidRe.exec(contextText)) !== null) {
    const synonyms = m[1].split(",").map((s) => s.trim()).filter(Boolean);
    for (const syn of synonyms) {
      if (syn.length < 4) continue; // skip too-short words prone to false positives
      const synRe = new RegExp(`\\b${syn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      const leaks = Object.entries(otherDocsByPath)
        .filter(([, docText]) => synRe.test(docText))
        .map(([docPath]) => docPath);
      results.push(
        leaks.length === 0
          ? ok("avoid-leakage", `"${syn}" (rejected synonym) does not appear in other root docs.`)
          : fail("avoid-leakage", `"${syn}" is listed as a rejected synonym but appears in: ${leaks.join(", ")} (verify it's actually being used in the rejected sense, not a different meaning — this is a whole-word match, not semantic)`)
      );
    }
  }
  if (results.length === 0) results.push(skip("avoid-leakage", "No _Avoid_ lists found in CONTEXT.md."));
  return results;
}

// ===========================================================================
// 11. Cited source files exist (INTENT.md)
// ===========================================================================

function verifyCitedFilesExist(repoRoot, text) {
  const results = [];
  // Matches both bare filenames (`page.tsx`) and path-qualified citations
  // (`src/app/page.tsx`) — the latter are often the more load-bearing claims
  // (a specific file's specific state), so skipping them would miss exactly
  // the citations most worth verifying.
  const fileRe = /`([a-zA-Z0-9_./-]+\.tsx?)`/g;
  const seen = new Set();
  let m;
  while ((m = fileRe.exec(text)) !== null) {
    const cited = m[1];
    if (seen.has(cited)) continue;
    seen.add(cited);
    const found = cited.includes("/")
      ? fs.existsSync(path.join(repoRoot, cited))
      : fs.existsSync(path.join(repoRoot, "src", "components", "ui", cited)) || fs.existsSync(path.join(repoRoot, "src", "app", cited));
    results.push(found ? ok("cited-files", `${cited} exists.`) : fail("cited-files", `${cited} is cited but not found.`));
  }
  if (results.length === 0) results.push(skip("cited-files", "No .tsx/.ts paths cited in backticks to check."));
  return results;
}

// ===========================================================================
// 12. Git history conventions (CONTRIBUTING.md)
// ===========================================================================

// Commit messages exempted from the Conventional Commits check — genesis
// commits universally predate any convention the repo later adopts.
const COMMIT_MESSAGE_EXEMPTIONS = new Set(["initial commit"]);

function verifyConventionalCommits(repoRoot, n = 10) {
  const { execFileSync } = require("child_process");
  let log;
  try {
    log = execFileSync("git", ["log", `-${n}`, "--pretty=%s"], { cwd: repoRoot, encoding: "utf8" });
  } catch {
    return [skip("conventional-commits", "Could not read git log (not a git repo, or git unavailable).")];
  }
  const subjects = log.split("\n").filter(Boolean);
  if (subjects.length === 0) return [skip("conventional-commits", "No commits found.")];

  const ccRe = /^(feat|fix|docs|style|refactor|perf|test|chore|build|ci|revert)(\([\w.-]+\))?!?:\s.+/;
  const nonConforming = subjects.filter((s) => !ccRe.test(s) && !COMMIT_MESSAGE_EXEMPTIONS.has(s.trim().toLowerCase()));
  if (nonConforming.length === 0) return [ok("conventional-commits", `All ${subjects.length} recent commit(s) follow Conventional Commits (or are exempt genesis commits).`)];
  return [
    fail(
      "conventional-commits",
      `${nonConforming.length} of ${subjects.length} recent commit(s) don't follow Conventional Commits: ${nonConforming.map((s) => `"${s}"`).join(", ")}`
    ),
  ];
}

// ===========================================================================
// 13. Package manager pin claim (CONTRIBUTING.md)
// ===========================================================================

function verifyPackageManagerPin(repoRoot, text) {
  const pkgPath = path.join(repoRoot, "package.json");
  if (!fs.existsSync(pkgPath)) return [skip("package-manager-pin", "No package.json at repo root.")];
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const pin = pkg.packageManager; // e.g. "pnpm@11.20.0"
  if (!pin) return [ok("package-manager-pin", "No packageManager field pinned in package.json — nothing to cross-check.")];
  const [, version] = pin.split("@");
  return [
    text.includes(version)
      ? ok("package-manager-pin", `Cited pin "${pin}" matches package.json.`)
      : fail("package-manager-pin", `package.json pins "${pin}" but that exact version isn't mentioned in the doc.`),
  ];
}

module.exports = {
  ok,
  fail,
  skip,
  getRealComponentCount,
  verifyComponentCountMentions,
  verifyNOfMClaim,
  getUseClientFileCount,
  verifyLocalMdLinks,
  verifyCitedPackageScripts,
  verifyReadmeBoilerplate,
  verifyDesignMdStructure,
  verifyDesignTopLevelKeys,
  verifyDesignDimensionValues,
  verifyAgentsGeneratedBlock,
  verifyAgentsInstructionBudget,
  verifyAgentsCitedPaths,
  verifyEnvHandling,
  verifyCiExistence,
  verifyCiClaims,
  verifyTestPresenceClaims,
  verifyCitedRepoPaths,
  verifyJscpdThreshold,
  verifyLighthouseAccessibilityThreshold,
  verifyVersionClaims,
  verifyAvoidSynonymLeakage,
  verifyCitedFilesExist,
  verifyConventionalCommits,
  verifyPackageManagerPin,
};
