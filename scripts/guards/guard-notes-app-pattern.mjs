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
  { suffix: "-dialog.tsx", required: ["DialogContent"] },
  {
    suffix: "-select.tsx",
    required: ["Select", "SelectTrigger", "SelectContent"],
  },
  { suffix: "-empty.tsx", required: ["Empty", "EmptyHeader"] },
  {
    suffix: "-sidebar.tsx",
    required: ["Sidebar", "SidebarHeader", "SidebarFooter"],
  },
  { suffix: "-status.tsx", required: ["Empty"] },
  { suffix: "-button.tsx", required: ["Button"] },
  { suffix: "-header.tsx", required: ["Item"] },
  { suffix: "-description.tsx", required: ["FieldDescription"] },
];

const LEAF_WRAPPER_SUFFIXES = new Set(["-button.tsx", "-input.tsx"]);

const STATUS_COMPOSITION_PARTS = [
  "SpacesErrorStatus",
  "SpacesLoadingStatus",
  "SpacesNotFoundStatus",
];

const DIALOG_COMPOSITION_PARTS = ["children", "content"];

const DIALOG_FORBIDDEN_IMPORTS = [
  {
    pattern: /from\s+["']@\/components\/notes-app\//,
    label: "notes-app domain components",
  },
  { pattern: /from\s+["']@\/hooks\//, label: "application hooks" },
  { pattern: /from\s+["']next-intl["']/, label: "translations" },
  { pattern: /from\s+["']next-themes["']/, label: "theme state" },
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

const COMPONENT_ANATOMY_RULES = new Map([
  [
    "space-switcher.tsx",
    ["SidebarGroup", "SidebarGroupContent", "InputGroup", "Empty"],
  ],
  [
    "sidebar-user-menu.tsx",
    ["SidebarMenu", "SidebarMenuItem", "DropdownMenuGroup", "ButtonGroup"],
  ],
  [
    "space-shell.tsx",
    [
      "SidebarProvider",
      "Sidebar",
      "SidebarHeader",
      "SidebarFooter",
      "SidebarInset",
      "CreateSpaceDialog",
      "SettingsDialog",
    ],
  ],
]);

function violation(file, rule, message) {
  return { file: path.relative(root, file), rule, message };
}

function checkStatusComposition(filePath, fileName, content) {
  if (fileName !== "spaces-status.tsx") return [];

  const missing = STATUS_COMPOSITION_PARTS.filter(
    (part) => !new RegExp(`function\\s+${part}\\b`).test(content),
  );
  if (missing.length === 0) return [];

  return [
    violation(
      filePath,
      "notes-app-status-composition",
      `spaces-status.tsx must expose explicit status parts: ${missing.join(", ")}.`,
    ),
  ];
}

function checkDialogComposition(filePath, fileName, content) {
  if (!fileName.endsWith("-dialog.tsx")) return [];

  const violations = [];
  const missing = DIALOG_COMPOSITION_PARTS.filter((part) =>
    part === "children"
      ? !/\bchildren\b/.test(content)
      : !new RegExp(`function\\s+${toPascalCase(fileName)}Content\\b`).test(
          content,
        ),
  );

  if (missing.length > 0) {
    violations.push(
      violation(
        filePath,
        "notes-app-dialog-composition",
        `${fileName} must expose caller-provided composition through ${missing.join(", ")}.`,
      ),
    );
  }

  const forbidden = DIALOG_FORBIDDEN_IMPORTS.filter(({ pattern }) =>
    pattern.test(content),
  ).map(({ label }) => label);

  if (forbidden.length > 0) {
    violations.push(
      violation(
        filePath,
        "notes-app-dialog-single-responsibility",
        `${fileName} owns only Dialog root/content behavior. Move ${forbidden.join(", ")} to the composition root and pass the rendered body through children.`,
      ),
    );
  }

  return violations;
}

function checkFamilyContext(filePath, fileName, content) {
  const contextCount = [
    ...content.matchAll(/\bcreateContext\s*(?:<[^;]+?>)?\s*\(/g),
  ].length;

  if (contextCount <= 1) return [];

  return [
    violation(
      filePath,
      "notes-app-single-family-context",
      `${fileName} declares ${contextCount} contexts. A compound component family may own at most one local context.`,
    ),
  ];
}

function checkEmptyLayoutParts(filePath, fileName, content) {
  const emptyParts = [
    "SidebarContent",
    "SidebarGroup",
    "SidebarGroupContent",
    "SidebarMenu",
    "CardHeader",
    "CardContent",
    "CardFooter",
    "FieldGroup",
    "EmptyHeader",
    "EmptyContent",
  ];
  const violations = [];

  for (const part of emptyParts) {
    const selfClosing = new RegExp(`<${part}(?:\\s[^>]*)?\\s*/>`).test(content);
    const emptyPair = new RegExp(`<${part}(?:\\s[^>]*)?>\\s*</${part}>`).test(
      content,
    );
    if (selfClosing || emptyPair) {
      violations.push(
        violation(
          filePath,
          "notes-app-empty-composition-part",
          `${fileName} must not render empty ${part}; remove it or compose its required children.`,
        ),
      );
    }
  }

  return violations;
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

function checkComponentAnatomy(filePath, fileName, content) {
  const required = COMPONENT_ANATOMY_RULES.get(fileName);
  if (!required) return [];

  const missing = required.filter(
    (part) => !new RegExp(`<${part}(?:\\s|>)`).test(content),
  );
  if (missing.length === 0) return [];

  return [
    violation(
      filePath,
      "notes-app-component-anatomy",
      `${fileName} must compose ${missing.join(", ")} so its internal surface anatomy stays explicit.`,
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

const PASCAL_SEGMENTS = new Map([["oauth", "OAuth"]]);

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
        `${fileName} has component names without a recognized shadcn-style role suffix: ${invalid.join(", ")}.`,
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
      `${fileName} must give every visual component and subcomponent a data-slot; missing: ${missing.join(", ")}.`,
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

  violations.push(...checkStatusComposition(filePath, fileName, content));
  violations.push(...checkDialogComposition(filePath, fileName, content));
  violations.push(...checkFamilyContext(filePath, fileName, content));
  violations.push(...checkComponentAnatomy(filePath, fileName, content));
  violations.push(...checkSpaceShellContract(filePath, fileName, content));
  violations.push(...checkEmptyLayoutParts(filePath, fileName, content));
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
  COMPOSITION_RULES,
  LEAF_WRAPPER_SUFFIXES,
  NON_VISUAL_FILES,
  STATUS_COMPOSITION_PARTS,
  DIALOG_COMPOSITION_PARTS,
  DIALOG_FORBIDDEN_IMPORTS,
  COMPONENT_ANATOMY_RULES,
  COMPONENT_ROLE_SUFFIXES,
  COMPONENT_NAME_EXEMPTIONS,
  CANONICAL_COMPONENT_EXEMPT_FILES,
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
    "guard-notes-app-pattern: all visual notes-app components follow the shared UI composition contract.",
  );
}
