#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const componentsDir = path.join(root, "src/components/notes-app");

const NON_VISUAL_FILES = new Set([
  "auth-provider.tsx",
  "spaces-list.tsx",
  "theme-provider.tsx",
]);

const COMPOSITION_RULES = [
  {
    suffix: "-card.tsx",
    required: ["CardHeader", "CardContent"],
    except: ["auth-card.tsx"],
  },
  { suffix: "-form.tsx", required: ["FieldGroup"] },
  { suffix: "-alert.tsx", required: ["Alert"] },
  { suffix: "-dialog.tsx", required: ["DialogContent", "DialogTitle"] },
  {
    suffix: "-select.tsx",
    required: ["Select", "SelectTrigger", "SelectContent"],
  },
  { suffix: "-empty.tsx", required: ["Empty", "EmptyHeader"] },
  { suffix: "-sidebar.tsx", required: ["Sidebar"] },
  { suffix: "-status.tsx", required: ["Empty"] },
  { suffix: "-button.tsx", required: ["Button"] },
  { suffix: "-header.tsx", required: ["Item"] },
  { suffix: "-description.tsx", required: ["FieldDescription"] },
];

const LEAF_WRAPPER_SUFFIXES = new Set(["-button.tsx", "-input.tsx"]);

function violation(file, rule, message) {
  return { file: path.relative(root, file), rule, message };
}

function checkFile(filePath, content) {
  const fileName = path.basename(filePath);
  if (!fileName.endsWith(".tsx") || fileName.endsWith(".test.tsx")) {
    return [];
  }

  const violations = [];
  const isNonVisual = NON_VISUAL_FILES.has(fileName);

  if (!isNonVisual && !content.includes('from "@/components/ui/')) {
    violations.push(
      violation(
        filePath,
        "notes-app-requires-ui",
        "Visual notes-app components must compose a primitive from src/components/ui.",
      ),
    );
  }

  if (!isNonVisual) {
    const rawInteractiveElement = content.match(
      /<(button|input|select|textarea|label)(?:\s|>)/,
    );
    if (rawInteractiveElement) {
      violations.push(
        violation(
          filePath,
          "notes-app-no-raw-controls",
          `Use the matching shadcn primitive instead of raw <${rawInteractiveElement[1]}> markup.`,
        ),
      );
    }
  }

  const compositionRule = COMPOSITION_RULES.find((rule) =>
    fileName.endsWith(rule.suffix),
  );
  if (compositionRule && !compositionRule.except?.includes(fileName)) {
    const missing = compositionRule.required.filter(
      (part) => !content.includes(`<${part}`),
    );
    if (missing.length > 0) {
      violations.push(
        violation(
          filePath,
          "notes-app-composition-anatomy",
          `${fileName} must compose ${missing.join(", ")} according to its component role.`,
        ),
      );
    }
  }

  const openingTagPattern = /<[A-Za-z][\w.]*(?:\s|\n)[\s\S]*?>/g;
  for (const match of content.matchAll(openingTagPattern)) {
    const tag = match[0];
    const spreadIndex = tag.indexOf("{...props}");
    const classNameIndex = tag.indexOf("className=");
    if (
      spreadIndex !== -1 &&
      classNameIndex !== -1 &&
      classNameIndex < spreadIndex
    ) {
      violations.push(
        violation(
          filePath,
          "notes-app-props-before-layout",
          "Spread component props before the wrapper className so the canonical layout cannot be overwritten.",
        ),
      );
      break;
    }
  }

  return violations;
}

export {
  COMPOSITION_RULES,
  LEAF_WRAPPER_SUFFIXES,
  NON_VISUAL_FILES,
  checkFile,
};

export function runGuard() {
  if (!existsSync(componentsDir)) return [];

  return readdirSync(componentsDir)
    .filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"))
    .flatMap((file) => {
      const fullPath = path.join(componentsDir, file);
      return checkFile(fullPath, readFileSync(fullPath, "utf8"));
    });
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  const violations = runGuard();
  if (violations.length > 0) {
    console.error(
      `guard-notes-app-pattern: ${violations.length} violation(s) found:`,
    );
    for (const item of violations) {
      console.error(`  ${item.file} [${item.rule}] ${item.message}`);
    }
    process.exit(1);
  }

  console.log(
    "guard-notes-app-pattern: all visual notes-app components follow the shared UI composition contract.",
  );
}
