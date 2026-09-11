import { describe, expect, it } from "vitest";
import { parseDocMarkdown } from "./doc-viewer";

describe("parseDocMarkdown", () => {
  it("parses Markdown headings, paragraphs, and Mermaid blocks", () => {
    const markdown = `# Title

This is a paragraph description.

\`\`\`mermaid
graph TD
    A --> B
\`\`\`
`;

    const blocks = parseDocMarkdown(markdown);
    expect(blocks).toHaveLength(3);
    expect(blocks[0]).toEqual({ depth: 1, kind: "heading", text: "Title" });
    expect(blocks[1]).toEqual({
      kind: "paragraph",
      text: "This is a paragraph description.",
    });
    expect(blocks[2]).toEqual({
      code: "graph TD\n    A --> B",
      kind: "mermaid",
    });
  });
});
