import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import {
  ArchitectureDocViewer,
  parseArchitectureMarkdown,
} from "@/components/architecture/architecture-doc-viewer";

const projectRoot = fileURLToPath(new URL("../../../", import.meta.url));

function readProjectSource(relativePath: string) {
  return readFileSync(new URL(relativePath, `file://${projectRoot}/`), "utf8");
}

it("parses Markdown headings, paragraphs, and Mermaid blocks", () => {
  const blocks = parseArchitectureMarkdown(`# WorkspaceMainContent

Reads workspace state and chooses a panel.

\`\`\`mermaid
graph TD
  A[WorkspaceProvider] --> B[WorkspaceMainContent]
\`\`\`
`);

  expect(blocks).toEqual([
    { depth: 1, kind: "heading", text: "WorkspaceMainContent" },
    { kind: "paragraph", text: "Reads workspace state and chooses a panel." },
    {
      code: "graph TD\n  A[WorkspaceProvider] --> B[WorkspaceMainContent]",
      kind: "mermaid",
    },
  ]);
});

it("renders architecture docs with a Mermaid diagram surface", () => {
  const markup = renderToStaticMarkup(
    <ArchitectureDocViewer
      markdown={`# WorkspaceMainContent

\`\`\`mermaid
graph TD
  A --> B
\`\`\`
`}
    />,
  );

  expect(markup).toContain("WorkspaceMainContent");
  expect(markup).toContain("data-architecture-mermaid");
  expect(markup).toContain("graph TD");
});

it("registers architecture Markdown stories in Ladle", () => {
  const configSource = readProjectSource(".ladle/config.mjs");
  const storySource = readProjectSource(
    "src/components/architecture/workspace-architecture.stories.tsx",
  );

  expect(configSource).toContain("mdx");
  expect(storySource).toContain("workspace-main-content.architecture.md?raw");
  expect(storySource).toContain("WorkspaceMainContentGraph");
  expect(storySource).toContain("WorkspaceSidePanelContentGraph");
});
