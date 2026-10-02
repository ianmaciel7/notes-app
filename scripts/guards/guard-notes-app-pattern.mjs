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

const SURFACE_RULES = [
  { suffix: "-card.tsx", pattern: /<(?:Card|AuthCard)\b/ },
  { suffix: "-form.tsx", pattern: /<form\b/ },
  { suffix: "-field-group.tsx", pattern: /<FieldGroup\b/ },
  { suffix: "-alert.tsx", pattern: /<Alert\b/ },
  { suffix: "-dialog.tsx", pattern: /<Dialog\b/ },
  { suffix: "-select.tsx", pattern: /<Select\b/ },
  { suffix: "-empty.tsx", pattern: /<Empty\b/ },
  { suffix: "-sidebar.tsx", pattern: /<Sidebar\b/ },
  { suffix: "-button.tsx", pattern: /<Button\b/ },
  { suffix: "-description.tsx", pattern: /<FieldDescription\b/ },
];

const COMPONENT_ROLE_SUFFIXES = new Set([
  "Accordion",
  "Action",
  "Alert",
  "Avatar",
  "Badge",
  "Breadcrumb",
  "Button",
  "Calendar",
  "Card",
  "Carousel",
  "Chart",
  "Checkbox",
  "Close",
  "Collapsible",
  "Combobox",
  "Command",
  "Content",
  "Description",
  "Dialog",
  "Drawer",
  "Dropdown",
  "Empty",
  "FieldGroup",
  "Footer",
  "Form",
  "Group",
  "Header",
  "Icon",
  "Input",
  "Item",
  "Label",
  "Link",
  "List",
  "Loading",
  "Media",
  "Menu",
  "Navigation",
  "Overlay",
  "Pagination",
  "Popover",
  "Portal",
  "Progress",
  "Provider",
  "Radio",
  "Resizable",
  "Scroll",
  "Select",
  "Separator",
  "Sheet",
  "Shell",
  "Sidebar",
  "Skeleton",
  "Slider",
  "Sonner",
  "Spinner",
  "Status",
  "Switcher",
  "Table",
  "Tabs",
  "Textarea",
  "Title",
  "Toast",
  "Toaster",
  "Toggle",
  "Tooltip",
  "Trigger",
]);

const COMPONENT_NAME_EXEMPTIONS = new Set(["RequireAuth", "RequireGuest"]);
const CANONICAL_COMPONENT_EXEMPT_FILES = new Set(["spaces-status.tsx"]);
const PASCAL_SEGMENTS = new Map([["oauth", "OAuth"]]);

function violation(file, rule, message) {
  return { file: path.relative(root, file), rule, message };
}

function toPascalCase(fileName) {
  return fileName
    .replace(/\.tsx$/, "")
    .split("-")
    .map(
      (part) =>
        PASCAL_SEGMENTS.get(part) ??
        `${part.charAt(0).toUpperCase()}${part.slice(1)}`,
    )
    .join("");
}

function getComponentFunctionEntries(content) {
  const matches = [...content.matchAll(/function\s+([A-Z][A-Za-z0-9_]*)\b/g)];

  return matches.map((match, index) => ({
    name: match[1],
    source: content.slice(
      match.index,
      matches[index + 1]?.index ?? content.length,
    ),
  }));
}

function hasComponentRoleSuffix(name) {
  return [...COMPONENT_ROLE_SUFFIXES].some((suffix) => name.endsWith(suffix));
}

function checkSurfaceRoot(filePath, fileName, content) {
  const rule = SURFACE_RULES.find(({ suffix }) => fileName.endsWith(suffix));
  if (!rule || rule.pattern.test(content)) return [];

  return [
    violation(
      filePath,
      "notes-app-surface-root",
      `${fileName} must compose the primitive that matches its public surface role.`,
    ),
  ];
}

function checkDedicatedHookOwnsState(filePath, fileName, content) {
  const componentName = toPascalCase(fileName);
  const hookName = `use${componentName}`;
  const hookCall = new RegExp(`\\b${hookName}\\s*\\(`);

  if (!hookCall.test(content)) return [];

  const statefulHooks = [
    "useState",
    "useReducer",
    "useEffect",
    "useLayoutEffect",
    "useInsertionEffect",
    "useTransition",
    "useDeferredValue",
    "useOptimistic",
    "useActionState",
    "useSyncExternalStore",
    "useRef",
    "useImperativeHandle",
  ];
  const directCalls = statefulHooks.filter((hook) =>
    new RegExp(`\\b${hook}\\s*\\(`).test(content),
  );

  if (directCalls.length === 0) return [];

  return [
    violation(
      filePath,
      "notes-app-dedicated-hook-owns-state",
      `${fileName} delegates behavior to ${hookName}; move component-owned ${directCalls.join(", ")} calls into that dedicated hook.`,
    ),
  ];
}

function checkSpaceShellContract(filePath, fileName, content) {
  if (fileName !== "space-shell.tsx") return [];

  const requirements = [
    ["children", /children\??\s*:/],
    ["SidebarProvider root", /<SidebarProvider\b/],
    ["data-slot", /data-slot=["']space-shell["']/],
    ["cn layout merge", /className=\{cn\(/],
  ];
  const missing = requirements
    .filter(([, pattern]) => !pattern.test(content))
    .map(([name]) => name);

  if (missing.length === 0) return [];

  return [
    violation(
      filePath,
      "notes-app-space-shell-contract",
      `space-shell.tsx must preserve the SidebarProvider wrapper contract; missing ${missing.join(", ")}.`,
    ),
  ];
}

function checkRawLayoutWrappers(filePath, fileName, content) {
  if (fileName === "phone-auth-form.tsx" || fileName.startsWith("sms-mfa-")) {
    return [];
  }

  if (/<div\s+\{\.\.\.props\}\s+className=/.test(content)) {
    return [
      violation(
        filePath,
        "notes-app-no-raw-layout-wrapper",
        `${fileName} must compose a role-specific ui primitive instead of forwarding layout props through a raw div.`,
      ),
    ];
  }

  return [];
}

function checkComponentRoleNames(filePath, fileName, content) {
  const entries = getComponentFunctionEntries(content);
  const invalid = entries
    .map(({ name }) => name)
    .filter(
      (name) =>
        !COMPONENT_NAME_EXEMPTIONS.has(name) && !hasComponentRoleSuffix(name),
    );

  const violations = [];
  if (invalid.length > 0) {
    violations.push(
      violation(
        filePath,
        "notes-app-component-role-suffix",
        `${fileName} has component names without a recognized UI role suffix: ${invalid.join(", ")}.`,
      ),
    );
  }

  if (!CANONICAL_COMPONENT_EXEMPT_FILES.has(fileName)) {
    const canonicalName = toPascalCase(fileName);
    if (!entries.some(({ name }) => name === canonicalName)) {
      violations.push(
        violation(
          filePath,
          "notes-app-canonical-component-name",
          `${fileName} must declare its canonical component as ${canonicalName}.`,
        ),
      );
    }
  }

  return violations;
}

function checkComponentSlots(filePath, fileName, content) {
  if (NON_VISUAL_FILES.has(fileName)) return [];

  const missing = getComponentFunctionEntries(content)
    .filter(({ source }) => !/data-slot=["'][^"']+["']/.test(source))
    .map(({ name }) => name);

  if (missing.length === 0) return [];

  return [
    violation(
      filePath,
      "notes-app-component-data-slot",
      `${fileName} must give every visual component a data-slot; missing: ${missing.join(", ")}.`,
    ),
  ];
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
          `Use the matching shadcn/Base UI primitive instead of raw <${rawInteractiveElement[1]}> markup.`,
        ),
      );
    }
  }

  violations.push(...checkSurfaceRoot(filePath, fileName, content));
  violations.push(...checkDedicatedHookOwnsState(filePath, fileName, content));
  violations.push(...checkSpaceShellContract(filePath, fileName, content));
  violations.push(...checkRawLayoutWrappers(filePath, fileName, content));
  violations.push(...checkComponentRoleNames(filePath, fileName, content));
  violations.push(...checkComponentSlots(filePath, fileName, content));

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
  NON_VISUAL_FILES,
  SURFACE_RULES,
  COMPONENT_ROLE_SUFFIXES,
  COMPONENT_NAME_EXEMPTIONS,
  CANONICAL_COMPONENT_EXEMPT_FILES,
  checkDedicatedHookOwnsState,
  checkSpaceShellContract,
  checkComponentRoleNames,
  checkComponentSlots,
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
    "guard-notes-app-pattern: notes-app components use simple domain surfaces over shared UI primitives.",
  );
}
