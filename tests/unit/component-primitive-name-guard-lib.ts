import {
  type ComponentFile,
  checkedComponentNames,
} from "./component-file-name-guard-lib";

export type { ComponentFile } from "./component-file-name-guard-lib";

export type ComponentPrimitiveNameViolation = {
  path: string;
  exportedComponents: string[];
  primitive: string;
  expectedNameHint: string;
};

const primitiveModules = new Map([
  ["dropdown-menu", "DropdownMenu"],
  ["context-menu", "ContextMenu"],
  ["menubar", "Menubar"],
  ["select", "Select"],
  ["combobox", "Combobox"],
  ["dialog", "Dialog"],
  ["alert-dialog", "AlertDialog"],
  ["sheet", "Sheet"],
  ["drawer", "Drawer"],
  ["popover", "Popover"],
  ["hover-card", "HoverCard"],
  ["tooltip", "Tooltip"],
  ["tabs", "Tabs"],
  ["accordion", "Accordion"],
  ["collapsible", "Collapsible"],
  ["navigation-menu", "NavigationMenu"],
  ["command", "Command"],
]);

export const componentPrimitiveNameMessage =
  "Component names must include the shadcn primitive they return as their root element.";

function importedPrimitives(source: string): Map<string, string> {
  const imports = new Map<string, string>();
  const importPattern =
    /import\s+([\s\S]*?)\s+from\s+["']@\/components\/ui\/([^"']+)["']/g;
  for (const match of source.matchAll(importPattern)) {
    const primitive = primitiveModules.get(match[2]);
    if (!primitive) {
      continue;
    }
    const namedImports = match[1].match(/{([\s\S]*?)}/)?.[1] ?? "";
    for (const entry of namedImports.split(",")) {
      const parts = entry.trim().split(/\s+as\s+/);
      const localName = parts.at(-1);
      if (parts[0] === primitive && localName) {
        imports.set(localName, primitive);
      }
    }
  }
  return imports;
}

function rootPrimitives(
  source: string,
  imports: Map<string, string>,
): string[] {
  return [...imports.entries()]
    .filter(([localName]) => {
      const escapedName = localName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(
        `(?:return|=>)\\s*\\(?\\s*<${escapedName}(?=[\\s/>])`,
      ).test(source);
    })
    .map(([, primitive]) => primitive);
}

export function findComponentPrimitiveNameViolations(
  files: readonly ComponentFile[],
): ComponentPrimitiveNameViolation[] {
  return files.flatMap(({ path, source }) => {
    const exportedComponents = checkedComponentNames({ path, source });
    if (exportedComponents.length === 0) {
      return [];
    }
    return rootPrimitives(source, importedPrimitives(source))
      .filter(
        (primitive) =>
          !exportedComponents.some((name) => name.includes(primitive)),
      )
      .map((primitive) => ({
        path,
        exportedComponents,
        primitive,
        expectedNameHint: `include \`${primitive}\` in the component name (e.g. ${exportedComponents[0]} -> ${exportedComponents[0]}${primitive})`,
      }));
  });
}
