#!/usr/bin/env node
/**
 * guard-i18n-strings.mjs
 *
 * Enforces internationalization (i18n) hygiene in UI components:
 * - Forbids hardcoded button text, headings, and alert text in JSX
 *   (e.g., "Retry Connection", "Sign in", "Submit") without using i18n translation functions
 *   such as t(...) or getTranslation(ui, ...).
 * - Forbids hardcoded known action phrases in JSX string children and props.
 *
 * Grounded in CONVENTIONS.md: "Internationalization (i18n) & Localized Strings".
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../../", import.meta.url));
const componentsDir = path.join(root, "src/components/notes-app");

// Known user-facing action/status phrases that must never be hardcoded
export const FORBIDDEN_PHRASES = [
  /retry\s+connection/i,
  /retry\s+request/i,
  /try\s+again/i,
  /sign\s+in\s+to\s+access/i,
  /failed\s+to\s+connect/i,
  /connection\s+lost/i,
  /reload\s+page/i,
];

// Elements where raw user-facing text is strictly required to come from translations
const TRANSLATED_CONTAINER_ELEMENTS = new Set([
  "Button",
  "button",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "FieldLabel",
  "FieldError",
  "AlertDescription",
  "AlertTitle",
]);

/**
 * Checks if a JSX text node contains suspicious hardcoded natural language text.
 * Ignores empty whitespace, symbols, punctuation, or single character delimiters.
 */
function isSignificantNaturalText(rawText) {
  const text = rawText.trim();
  if (!text) return false;
  // Ignore single punctuation, numbers, or technical delimiters like "/", "•", "-", "&", etc.
  if (/^[0-9\s•\-—/\\|:;,.*+!?()[\]{}<>]+$/.test(text)) return false;
  // If it contains letters and is 2+ chars, treat as user-facing text
  return /[a-zA-Z]{2,}/.test(text);
}

/**
 * Analyze a TypeScript AST SourceFile for hardcoded strings and forbidden phrases.
 */
export function findI18nViolationsInSource(sourceText, filePath) {
  const sf = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const violations = [];

  function checkStringForForbiddenPhrases(text, node) {
    for (const regex of FORBIDDEN_PHRASES) {
      if (regex.test(text)) {
        const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
        violations.push({
          file: filePath,
          line: line + 1,
          snippet: text,
          reason: `Contains forbidden hardcoded phrase matching ${regex}. Use i18n translation key instead.`,
        });
      }
    }
  }

  function inspectJsxText(element) {
    const tagName = element.openingElement.tagName.getText(sf);
    if (!TRANSLATED_CONTAINER_ELEMENTS.has(tagName)) return;

    for (const child of element.children) {
      if (!ts.isJsxText(child)) continue;
      const raw = child.getText(sf);
      if (!isSignificantNaturalText(raw)) continue;

      const trimmed = raw.trim();
      const { line } = sf.getLineAndCharacterOfPosition(child.getStart(sf));
      violations.push({
        file: filePath,
        line: line + 1,
        snippet: trimmed,
        reason: `Hardcoded text "${trimmed}" inside <${tagName}>. Must use i18n translations (e.g. t(...) or getTranslation(ui, ...)).`,
      });
    }
  }

  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      checkStringForForbiddenPhrases(node.text, node);
    } else if (ts.isJsxElement(node)) {
      inspectJsxText(node);
    }

    ts.forEachChild(node, visit);
  }

  visit(sf);
  return violations;
}

export function scanDirectoryForI18nViolations(dir, baseDir = dir) {
  let violations = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      violations = violations.concat(
        scanDirectoryForI18nViolations(fullPath, baseDir),
      );
    } else if (/\.(tsx)$/.test(entry) && !entry.endsWith(".test.tsx")) {
      const relPath = path.relative(baseDir, fullPath).replaceAll("\\", "/");
      const content = readFileSync(fullPath, "utf8");
      violations = violations.concat(
        findI18nViolationsInSource(content, relPath),
      );
    }
  }
  return violations;
}

export function runGuard() {
  const violations = scanDirectoryForI18nViolations(componentsDir, root);
  if (violations.length === 0) {
    console.log(
      "[guard-i18n-strings] ✓ Zero hardcoded i18n violations found in UI components.",
    );
    return true;
  }

  console.error(
    `[guard-i18n-strings] ✗ ${violations.length} i18n violation(s) found:\n`,
  );
  for (const v of violations) {
    console.error(`  • ${v.file}:${v.line} - "${v.snippet}": ${v.reason}`);
  }
  console.error(`
Policy Violation:
  CONVENTIONS.md strictly forbids hardcoding user-facing strings (such as
  "Retry Connection", headings, error messages, or button text) in UI components.
  All user-facing copy must be localized via i18n dictionaries and translation keys.
`);
  return false;
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
) {
  const ok = runGuard();
  if (!ok) {
    process.exit(1);
  }
}
