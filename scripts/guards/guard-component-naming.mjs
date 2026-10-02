#!/usr/bin/env node
/**
 * guard-component-naming.mjs
 *
 * Enforces that every *.tsx file in src/components/notes-app/ (excluding
 * test files) either:
 *   1. Ends with a recognised shadcn-style UI suffix, OR
 *   2. Is a Next.js special-cased reserved filename, OR
 *   3. Is an explicitly allowed React/project-specific pattern.
 *
 * Add new suffixes or allow-listed names to the constants below when the
 * project adopts them.
 */

import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const componentsDir = path.join(root, "src/components/notes-app");

// ---------------------------------------------------------------------------
// Allowed shadcn-style suffixes.
// Compound primitive roles are checked before single-token suffixes so names
// such as settings-field-group.tsx preserve the root primitive role exactly.
// ---------------------------------------------------------------------------
const SHADCN_COMPOUND_SUFFIXES = new Set([
  "field-group",
  "button-group",
  "input-group",
]);

const SHADCN_SUFFIXES = new Set([
  "field-group",
  "button-group",
  "input-group",
  "toggle-group",
  "card",
  "form",
  "button",
  "select",
  "alert",
  "menu",
  "provider",
  "switcher",
  "input",
  "badge",
  "dialog",
  "sheet",
  "table",
  "list",
  "item",
  "header",
  "footer",
  "group",
  "sidebar",
  "shell",
  "drawer",
  "popover",
  "tooltip",
  "tabs",
  "skeleton",
  "spinner",
  "avatar",
  "chart",
  "calendar",
  "checkbox",
  "radio",
  "toggle",
  "slider",
  "textarea",
  "separator",
  "label",
  "breadcrumb",
  "pagination",
  "accordion",
  "collapsible",
  "command",
  "combobox",
  "dropdown",
  "navigation",
  "progress",
  "scroll",
  "resizable",
  "sonner",
  "toast",
  "toaster",
  "carousel",
  "status",
  "loading",
  "empty",
  "description",
]);

// ---------------------------------------------------------------------------
// Next.js reserved filenames (no suffix needed)
// ---------------------------------------------------------------------------
const NEXTJS_RESERVED = new Set([
  "page",
  "layout",
  "loading",
  "error",
  "not-found",
  "template",
  "default",
  "route",
  "middleware",
  "instrumentation",
]);

// ---------------------------------------------------------------------------
// React / project-specific allow-list (full basename without extension)
// These are special patterns that don't carry a shadcn suffix but are
// intentionally structured this way (guards, providers, context, etc.).
// ---------------------------------------------------------------------------
const ALLOWED_BASENAMES = new Set([
  "require-auth", // HOC / route guard pattern
  "require-guest", // HOC / route guard pattern
  "auth-provider", // React context provider
  "theme-provider", // React context provider
]);

// ---------------------------------------------------------------------------
// Core check
// ---------------------------------------------------------------------------

function getBasename(filename) {
  return path.basename(filename, ".tsx");
}

function hasRecognizedSuffix(basename) {
  return [...SHADCN_SUFFIXES].some(
    (suffix) => basename === suffix || basename.endsWith(`-${suffix}`),
  );
}

function isCompliant(filename) {
  // Only check .tsx files
  if (!filename.endsWith(".tsx")) return true;
  // Ignore test files
  if (filename.endsWith(".test.tsx") || filename.endsWith(".spec.tsx"))
    return true;
  // Ignore stories
  if (filename.endsWith(".stories.tsx")) return true;

  const basename = getBasename(filename);

  // Explicitly allowed basenames
  if (ALLOWED_BASENAMES.has(basename)) return true;

  // Next.js reserved
  if (NEXTJS_RESERVED.has(basename)) return true;

  // shadcn compound suffix (FieldGroup, ButtonGroup, InputGroup, ...)
  if (
    [...SHADCN_COMPOUND_SUFFIXES].some(
      (suffix) => basename === suffix || basename.endsWith(`-${suffix}`),
    )
  ) {
    return true;
  }

  // shadcn single-token suffix
  const suffix = getSuffix(basename);
  if (SHADCN_SUFFIXES.has(suffix)) return true;

  return false;
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

let files;
try {
  files = readdirSync(componentsDir);
} catch {
  console.error(
    `[guard-component-naming] Directory not found: ${componentsDir}`,
  );
  process.exit(1);
}

const violations = files.filter((f) => !isCompliant(f));

if (violations.length === 0) {
  console.log(
    `[guard-component-naming] ✓ All ${files.filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx") && !f.endsWith(".stories.tsx")).length} component files in src/components/notes-app/ have a valid shadcn-style suffix.`,
  );
  process.exit(0);
} else {
  console.error(
    `[guard-component-naming] ✗ ${violations.length} file(s) violate the shadcn naming convention:\n`,
  );
  for (const v of violations) {
    console.error(`  • ${v}`);
  }
  console.error(`
Each component file in src/components/notes-app/ must end with a recognised
shadcn-style suffix (e.g. -card, -form, -button, -select, -alert, -menu,
-provider, -switcher, -field-group, -header, etc.) or be listed in ALLOWED_BASENAMES in
scripts/guard-component-naming.mjs.

Next.js reserved filenames (page.tsx, layout.tsx, …) are exempt.
`);
  process.exit(1);
}
