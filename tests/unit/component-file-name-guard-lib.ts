export type ComponentFile = {
  path: string;
  source: string;
};

export type ComponentFileNameViolation = {
  path: string;
  exportedComponents: string[];
  expectedFileName: string;
};

const reservedDirectories = ["src/components/ui/", "src/components/firebase/"];
const nextSpecialFiles = new Set([
  "page",
  "layout",
  "loading",
  "error",
  "global-error",
  "not-found",
  "template",
  "default",
  "icon",
  "apple-icon",
  "open" + "graph-image",
  "twitter-image",
]);

export const componentFileNameMessage =
  "Component file name must be the kebab-case of the exported component name (e.g. ThemeProvider -> theme-provider.tsx); rename the file or the component.";

function exportedNames(source: string): string[] {
  const names: string[] = [];
  const declarationPattern =
    /export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class)\s+([A-Za-z_$][\w$]*)/g;

  for (const match of source.matchAll(declarationPattern)) {
    names.push(match[1]);
  }

  const listPattern = /export\s+(?!type\b)\s*{([^}]+)}/g;
  for (const match of source.matchAll(listPattern)) {
    for (const entry of match[1].split(",")) {
      const trimmedEntry = entry.trim();
      if (trimmedEntry.startsWith("type ")) {
        continue;
      }
      const parts = trimmedEntry.split(/\s+as\s+/);
      const name = parts.at(-1);
      if (name) {
        names.push(name);
      }
    }
  }

  return names;
}

function kebabCase(name: string): string {
  return name
    .replaceAll("GitHub", "Github")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function comparable(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isCheckedPath(path: string): boolean {
  const normalizedPath = path.replaceAll("\\", "/");
  if (!normalizedPath.startsWith("src/") || !normalizedPath.endsWith(".tsx")) {
    return false;
  }

  if (
    reservedDirectories.some((directory) =>
      normalizedPath.startsWith(directory),
    )
  ) {
    return false;
  }

  const basename = normalizedPath.slice(
    normalizedPath.lastIndexOf("/") + 1,
    -4,
  );
  return !nextSpecialFiles.has(basename);
}

export function checkedComponentNames({
  path,
  source,
}: ComponentFile): string[] {
  if (!isCheckedPath(path)) {
    return [];
  }

  const exportedComponents = exportedNames(source).filter((name) =>
    /^[A-Z]/.test(name),
  );
  if (exportedComponents.length === 0) {
    return [];
  }

  return exportedComponents;
}

export function findComponentFileNameViolations(
  files: readonly ComponentFile[],
): ComponentFileNameViolation[] {
  return files.flatMap(({ path, source }) => {
    const exportedComponents = checkedComponentNames({ path, source });
    if (exportedComponents.length === 0) {
      return [];
    }

    const basename = path.replaceAll("\\", "/").split("/").at(-1)?.slice(0, -4);
    if (
      basename &&
      exportedComponents.some(
        (name) => comparable(basename) === comparable(name),
      )
    ) {
      return [];
    }

    return [
      {
        path,
        exportedComponents,
        expectedFileName: `${kebabCase(exportedComponents[0])}.tsx`,
      },
    ];
  });
}
