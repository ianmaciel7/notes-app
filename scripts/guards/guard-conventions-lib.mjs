import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// `src/components/ui/` is registry-installed and intentionally excluded from
// project-wide convention enforcement. All other project source is in scope.
const EXCLUDED_PREFIXES = ["src/components/ui/"];
const UI_PREFIX = "src/components/ui/";
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const STYLE_EXTENSIONS = new Set([...SOURCE_EXTENSIONS, ".css"]);
const TSX_ONLY = new Set([".tsx"]);

// Next.js route/config entrypoints that the framework requires to default-export.
const DEFAULT_EXPORT_ALLOWED = [
  /^src\/app\/(?:.+\/)?(?:page|layout|error|global-error|not-found|loading|template|default)\.tsx$/,
  /^src\/i18n\/request\.ts$/,
  /^src\/(?:proxy|middleware)\.ts$/,
  /\.stories\.tsx$/,
];
const STORIES = [/\.stories\.tsx$/];

const PALETTE =
  "white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const COLOR_UTILITY =
  "bg|text|border|ring|fill|stroke|from|via|to|outline|divide|shadow|accent|caret|decoration|placeholder";
const PALETTE_CLASS = new RegExp(
  `\\b(?:${COLOR_UTILITY})-(?:${PALETTE})(?:-\\d{2,3})?(?:/\\d+)?(?![\\w-])|\\b(?:${COLOR_UTILITY})-\\[#[0-9a-fA-F]{3,8}\\]`,
);
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ROUTE_SEGMENT = /^(?:\[{1,2}(?:\.{3})?\w+\]{1,2}|\((.+)\))$/;
const directive = (name) =>
  new RegExp(
    `^(?:\\s*(?:\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/))*\\s*["']${name}["']`,
  );
const USE_CLIENT = directive("use client");
const USE_SERVER = directive("use server");
const SERVER_ACTION_FILE = /(?:^|\/)(?:[\w-]+[.-])?actions?\.tsx?$/;

function lineHits(regex, code) {
  const hits = [];
  const lines = code.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) hits.push({ line: i + 1 });
  }
  return hits;
}

function patternRule(id, message, regex, options = {}) {
  return {
    id,
    message,
    extensions: options.extensions ?? SOURCE_EXTENSIONS,
    includeTests: options.includeTests ?? false,
    uiOnly: options.uiOnly ?? false,
    allowed: options.allowed ?? [],
    check: ({ code }) => lineHits(regex, code),
  };
}

function isKebabSegment(segment) {
  const route = segment.match(ROUTE_SEGMENT);
  if (!route) return KEBAB.test(segment);
  return route[1] === undefined || KEBAB.test(route[1]);
}

export const CONVENTION_RULES = [
  patternRule(
    "no-forward-ref",
    "React 19 passes `ref` as a normal prop; do not use `forwardRef`.",
    /\bforwardRef\b/,
  ),
  patternRule(
    "no-use-context",
    "Use `use(Context)` for new context access instead of `useContext`.",
    /\buseContext\s*\(/,
  ),
  patternRule(
    "no-preemptive-memo",
    "React Compiler is enabled; do not add `useMemo`/`useCallback`/`memo` without a measured need.",
    /\b(?:useMemo|useCallback|memo)\s*\(/,
  ),
  patternRule(
    "no-window-location",
    "Do not mutate `window.location`; use `useRouter()`, `redirect()` or `<Link>`.",
    /\bwindow\.location(?:\.href)?\s*=(?!=)|\bwindow\.location\.(?:assign|replace|reload)\s*\(/,
  ),
  patternRule(
    "no-hardcoded-color",
    "Use semantic design tokens (e.g. `bg-background`, `text-foreground`) instead of palette colors or hex values.",
    PALETTE_CLASS,
  ),
  patternRule(
    "no-important",
    "Avoid `!important`; fix specificity at the source.",
    /!important/,
    { extensions: STYLE_EXTENSIONS },
  ),
  patternRule(
    "use-cn-for-class-merge",
    "Merge classes with `cn()`, not template literals or string concatenation.",
    /className=\{\s*`[^`]*\$\{|className=\{\s*["'][^"']*["']\s*\+/,
    { extensions: TSX_ONLY },
  ),
  patternRule(
    "no-render-props-api",
    "Prefer `children`, variants and compound components over `renderX` props.",
    /\brender[A-Z]\w*\??\s*:/,
    { extensions: TSX_ONLY },
  ),
  patternRule(
    "no-classic-form-api",
    "Build new forms with `Field`/`FieldGroup`; the classic shadcn `Form*` API is compatibility-only.",
    /from\s+["']@\/components\/ui\/form["']/,
  ),
  patternRule(
    "named-default-export",
    "Components must have explicit identifiers; anonymous default exports break Fast Refresh.",
    /^\s*export\s+default\s+(?:async\s+)?(?:function\s*\*?\s*\(|class\s*\{|\()/,
    { allowed: STORIES },
  ),
  {
    id: "no-default-export",
    message:
      "Use named exports. Default exports are allowed only for Next.js route/config entrypoints.",
    extensions: SOURCE_EXTENSIONS,
    includeTests: false,
    uiOnly: false,
    allowed: DEFAULT_EXPORT_ALLOWED,
    check: ({ code }) =>
      lineHits(
        /^\s*export\s+default\b|^\s*export\s*\{[^}]*\bas\s+default\b/,
        code,
      ),
  },
  {
    id: "error-boundary-use-client",
    message:
      "Next.js `error.tsx` and `global-error.tsx` must declare 'use client'.",
    extensions: TSX_ONLY,
    includeTests: false,
    uiOnly: false,
    allowed: [],
    appliesTo: (relPath) => /(?:^|\/)(?:global-)?error\.tsx$/.test(relPath),
    check: ({ content }) => (USE_CLIENT.test(content) ? [] : [{ line: 1 }]),
  },
  {
    id: "server-action-use-server",
    message: "Server Action modules must declare 'use server'.",
    extensions: new Set([".ts", ".tsx"]),
    includeTests: false,
    uiOnly: false,
    allowed: [],
    appliesTo: (relPath) => SERVER_ACTION_FILE.test(relPath),
    check: ({ content }) => (USE_SERVER.test(content) ? [] : [{ line: 1 }]),
  },
  {
    id: "server-action-validates-input",
    message: "Server Actions must validate inbound data with a Zod schema.",
    extensions: new Set([".ts", ".tsx"]),
    includeTests: false,
    uiOnly: false,
    allowed: [],
    check: ({ content }) =>
      !USE_SERVER.test(content) || /from\s+["']zod["']/.test(content)
        ? []
        : [{ line: 1 }],
  },
  {
    id: "kebab-case-filename",
    message:
      "Files and folders use kebab-case (Next.js route segments `[param]` and `(group)` are exempt).",
    extensions: STYLE_EXTENSIONS,
    includeTests: true,
    uiOnly: false,
    allowed: [],
    check({ relPath }) {
      const parts = relPath.split("/").slice(1);
      const file = parts.pop() ?? "";
      const stem = file.split(".")[0];
      const bad = [...parts, stem].find((part) => !isKebabSegment(part));
      return bad === undefined ? [] : [{ line: 1, detail: `"${bad}"` }];
    },
  },
  patternRule(
    "ui-primitive-no-default-export",
    "Registry primitives use named exports in one trailing `export { ... }` block.",
    /^\s*export\s+default\b/,
    { uiOnly: true, allowed: STORIES },
  ),
  patternRule(
    "ui-primitive-trailing-export-block",
    "Registry primitives export values only through one trailing `export { ... }` block.",
    /^export\s+(?:async\s+)?(?:function|const|let|class)\b/,
    { uiOnly: true, allowed: STORIES },
  ),
  patternRule(
    "ui-primitive-no-interface",
    "Registry primitives derive prop types inline; declare no `interface`.",
    /^(?:export\s+)?interface\s/,
    { uiOnly: true, allowed: STORIES },
  ),
];

export function normalizeRelative(root, file) {
  const relative = path.relative(root, path.resolve(root, file));
  return relative.split(path.sep).join("/");
}

export function isTestFile(relPath) {
  return /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(relPath);
}

export function isUiPrimitive(relPath) {
  return relPath.startsWith(UI_PREFIX);
}

export function isInScope(relPath) {
  if (!relPath.startsWith("src/")) return false;
  if (EXCLUDED_PREFIXES.some((prefix) => relPath.startsWith(prefix)))
    return false;
  return STYLE_EXTENSIONS.has(path.posix.extname(relPath));
}

export function stripComments(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/gm, "$1");
}

function ruleApplies(rule, relPath) {
  if (rule.uiOnly !== isUiPrimitive(relPath)) return false;
  if (!rule.extensions.has(path.posix.extname(relPath))) return false;
  if (isTestFile(relPath) && !rule.includeTests) return false;
  if (rule.appliesTo && !rule.appliesTo(relPath)) return false;
  return !rule.allowed.some((allow) => allow.test(relPath));
}

export function checkFile(relPath, content) {
  if (!isInScope(relPath)) return [];
  const code = stripComments(content);
  const lines = content.split("\n");
  const violations = [];
  for (const rule of CONVENTION_RULES.filter((r) => ruleApplies(r, relPath))) {
    for (const hit of rule.check({ relPath, content, code })) {
      violations.push({
        rule: rule.id,
        file: relPath,
        line: hit.line,
        message: hit.detail ? `${rule.message} ${hit.detail}` : rule.message,
        snippet: (lines[hit.line - 1] ?? "").trim(),
      });
    }
  }
  return violations;
}

export function listSourceFiles(root, dir = "src") {
  const files = [];
  for (const entry of readdirSync(path.join(root, dir), {
    withFileTypes: true,
  })) {
    const relPath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) files.push(...listSourceFiles(root, relPath));
    else if (isInScope(relPath)) files.push(relPath);
  }
  return files;
}

export function runChecks(root, files = listSourceFiles(root)) {
  return files.flatMap((relPath) =>
    checkFile(relPath, readFileSync(path.join(root, relPath), "utf8")),
  );
}
