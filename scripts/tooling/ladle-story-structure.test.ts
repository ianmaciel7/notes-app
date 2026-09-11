import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { expect, it } from "vitest";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
const storyRoots = [join(projectRoot, "src", "components"), join(projectRoot, "src", "app", "_components")];

function readProjectSource(relativePath: string) {
  return readFileSync(new URL(relativePath, `file://${projectRoot}/`), "utf8");
}

function listStoryFiles(directory: string): string[] {
  return readdirSync(directory)
    .flatMap((entry) => {
      const fullPath = join(directory, entry);
      if (statSync(fullPath).isDirectory()) return listStoryFiles(fullPath);
      return fullPath.endsWith(".stories.tsx") ? [fullPath] : [];
    })
    .sort();
}

it("groups stories under separate Components, UI, and Docs roots", () => {
  const configSource = readProjectSource(".ladle/config.mjs");
  const componentStoryFiles = storyRoots.flatMap((root) => listStoryFiles(root)).sort();

  expect(configSource).toContain("src/**/*.stories.@(js|jsx|ts|tsx|mdx)");
  expect(configSource).toContain("docs/**/*.stories.@(js|jsx|ts|tsx|mdx)");

  for (const storyFile of componentStoryFiles) {
    const relativePath = relative(projectRoot, storyFile).replaceAll("\\", "/");
    const storySource = readProjectSource(relativePath);

    const group = relativePath.startsWith("src/components/ui/") ? "UI" : "Components";
    expect(storySource, relativePath).toContain(`title: "${group} / `);
  }

  expect(readProjectSource("docs/workspace/workspace-architecture.stories.tsx")).toContain(
    'title: "Docs / Workspace"',
  );
});
