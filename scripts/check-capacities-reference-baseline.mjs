import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "docs/references/capacities-reference-baseline-2026-08-31.md",
  "docs/references/capacities-functional-gap-audit-2026-08-31.md",
  "openspec/CAPACITIES_PARITY_ROADMAP.md",
  ".agents/rules/openspec-first.md",
];

const requiredDirs = [
  "artifacts/reference-evidence",
  "artifacts/capacities-reference",
  "openspec/changes",
  "openspec/changes/archive",
  "openspec/specs",
];

const forbiddenPatterns = [
  /\bAuthorization:\s*Bearer\s+\S+/i,
  /\baccess_token=+[A-Za-z0-9._-]+/i,
  /\brefresh_token=+[A-Za-z0-9._-]+/i,
  /\bapi[_-]?key=+[A-Za-z0-9._-]+/i,
  /\bX-Amz-Signature=+[A-Za-z0-9._-]+/i,
  /\bSignature=+[A-Za-z0-9._-]+/i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
];

const docsHostPattern = /https:\/\/docs\.capacities\.io\/[^\s`)>,]+/g;
const relativePathPattern = /`((?:docs|artifacts|openspec|\.agents)\/[^`]+)`/g;
const changePattern = /`([a-z0-9]+(?:-[a-z0-9]+)+)`/g;

function readRequired(file) {
  const absolute = path.join(root, file);
  if (!existsSync(absolute)) {
    throw new Error(`Missing required file: ${file}`);
  }
  return readFileSync(absolute, "utf8");
}

for (const dir of requiredDirs) {
  if (!existsSync(path.join(root, dir))) {
    throw new Error(`Missing required directory: ${dir}`);
  }
}

const contents = new Map(requiredFiles.map((file) => [file, readRequired(file)]));

for (const [file, content] of contents) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      throw new Error(`Potential secret or signed query in ${file}: ${pattern}`);
    }
  }
}

const baseline = contents.get("docs/references/capacities-reference-baseline-2026-08-31.md");
if (!baseline.includes("official_documentation_count: 196")) {
  throw new Error("Canonical baseline must record the 196-page official documentation inventory count.");
}
if (!baseline.includes("legacy_documentation_count: 154")) {
  throw new Error("Canonical baseline must record the 154-URL legacy inventory count.");
}

for (const [file, content] of contents) {
  const normalizedUrls = new Map();
  for (const [url] of content.matchAll(docsHostPattern)) {
    const normalized = normalizeUrl(url);
    const seen = normalizedUrls.get(normalized) ?? [];
    seen.push(file);
    normalizedUrls.set(normalized, seen);
  }

  const duplicates = [...normalizedUrls.entries()].filter(([, files]) => files.length > 1);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate normalized documentation URLs in ${file}: ${duplicates.map(([url]) => url).join(", ")}`);
  }
}

for (const [file, content] of contents) {
  for (const [, relativePath] of content.matchAll(relativePathPattern)) {
    if (isExternalReference(relativePath)) {
      continue;
    }
    if (!existsSync(path.join(root, relativePath))) {
      throw new Error(`Broken repository reference in ${file}: ${relativePath}`);
    }
  }
}

const activeChanges = new Set(listDirectories("openspec/changes").filter((name) => name !== "archive"));
const archivedChanges = new Set(listDirectories("openspec/changes/archive").map((name) => name.replace(/^\d{4}-\d{2}-\d{2}-/, "")));
const knownChanges = new Set([...activeChanges, ...archivedChanges]);
const roadmap = contents.get("openspec/CAPACITIES_PARITY_ROADMAP.md");

for (const [, maybeChange] of roadmap.matchAll(changePattern)) {
  if (maybeChange.startsWith("http") || maybeChange.includes("/")) {
    continue;
  }
  if (isCommonCodeToken(maybeChange)) {
    continue;
  }
  if (!knownChanges.has(maybeChange)) {
    throw new Error(`Roadmap references unknown change id: ${maybeChange}`);
  }
}

const baselineUrls = new Set([...baseline.matchAll(docsHostPattern)].map(([url]) => normalizeUrl(url)));
console.log(`Capacities reference baseline checks passed: ${baselineUrls.size} unique baseline documentation URLs, ${knownChanges.size} known changes.`);

function normalizeUrl(rawUrl) {
  const url = new URL(rawUrl);
  url.hash = "";
  url.search = "";
  const pathname = url.pathname !== "/" ? url.pathname.replace(/\/+$/, "") : "/";
  return `${url.protocol}//${url.hostname.toLowerCase()}${pathname}`;
}

function listDirectories(relativeDir) {
  const absolute = path.join(root, relativeDir);
  return existsSync(absolute) ? readdirSync(absolute).filter((entry) => statSync(path.join(absolute, entry)).isDirectory()) : [];
}

function isExternalReference(relativePath) {
  return relativePath.includes("<")
    || relativePath.includes("*")
    || relativePath.includes("capacities-urls.txt.txt")
    || relativePath.includes("reference-urls.json")
    || relativePath.includes(".wacz")
    || relativePath.includes(".jsonl")
    || relativePath.includes("capacities-wacz-completeness-audit");
}

function isCommonCodeToken(token) {
  return [
    "official-documentation",
    "authenticated-observation",
    "sanitized-archive-evidence",
    "local-code-test-evidence",
  ].includes(token);
}
