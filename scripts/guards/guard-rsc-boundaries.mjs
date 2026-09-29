#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));

// 1. Root Layout and Root Page must be React Server Components (RSC)
// CONVENTIONS.md: "Add 'use client' only at the smallest boundary that requires client behavior."
const rscFiles = ["src/app/layout.tsx", "src/app/page.tsx"];

const violations = [];

for (const relPath of rscFiles) {
  const fullPath = path.join(root, relPath);
  if (!existsSync(fullPath)) continue;
  const content = readFileSync(fullPath, "utf8");
  if (/^(\s*['"]use client['"];?)/m.test(content)) {
    violations.push({
      file: relPath,
      message: `Must NOT have 'use client' directive. Top-level routes/layouts must remain React Server Components (RSC). Extract client logic to a leaf component in src/components/notes-app/ instead.`,
    });
  }
}

// 2. Layout font hygiene: ensure layout doesn't import competing sans fonts (e.g. Geist and Inter simultaneously)
const layoutPath = path.join(root, "src/app/layout.tsx");
if (existsSync(layoutPath)) {
  const layoutContent = readFileSync(layoutPath, "utf8");
  const importsGeistSans =
    /import\s*\{[^}]*\bGeist\b[^}]*\}\s*from\s*["']next\/font\/google["']/.test(
      layoutContent,
    );
  const importsInter =
    /import\s*\{[^}]*\bInter\b[^}]*\}\s*from\s*["']next\/font\/google["']/.test(
      layoutContent,
    );
  if (importsGeistSans && importsInter) {
    violations.push({
      file: "src/app/layout.tsx",
      message: `Imports both Geist and Inter sans fonts. Consolidate to single sans font specified in DESIGN.md (Inter).`,
    });
  }
}

// 3. Anonymous login navigation hygiene in src/app/(auth)/login/page.tsx
const loginPagePath = path.join(root, "src/app/(auth)/login/page.tsx");
if (existsSync(loginPagePath)) {
  const loginContent = readFileSync(loginPagePath, "utf8");
  if (
    loginContent.includes("signInAnonymously") &&
    !loginContent.includes("router.replace(nextUrl)")
  ) {
    violations.push({
      file: "src/app/(auth)/login/page.tsx",
      message: `signInAnonymously must navigate using router.replace(nextUrl) on success.`,
    });
  }
}

if (violations.length > 0) {
  console.error(
    `\x1b[31mrsc-boundaries-guard: ${violations.length} violation(s) found:\x1b[0m`,
  );
  for (const v of violations) {
    console.error(`  \x1b[33m${v.file}\x1b[0m: ${v.message}`);
  }
  process.exit(1);
}

console.log(
  "rsc-boundaries-guard: all App Router boundaries and hygiene checks passed.",
);
process.exit(0);
