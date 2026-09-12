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

  it("parses code blocks, horizontal rules, lists, and tables", () => {
    const markdown = `---

## Section

- Item 1
- Item 2

\`\`\`text
folder/
  file.txt
\`\`\`

| Header 1 | Header 2 |
| --- | --- |
| Cell 1 | Cell 2 |
`;

    const blocks = parseDocMarkdown(markdown);
    expect(blocks).toHaveLength(5);
    expect(blocks[0]).toEqual({ kind: "hr" });
    expect(blocks[1]).toEqual({ depth: 2, kind: "heading", text: "Section" });
    expect(blocks[2]).toEqual({
      items: ["Item 1", "Item 2"],
      kind: "list",
      ordered: false,
    });
    expect(blocks[3]).toEqual({
      code: "folder/\n  file.txt",
      kind: "code",
      language: "text",
    });
    expect(blocks[4]).toEqual({
      headers: ["Header 1", "Header 2"],
      kind: "table",
      rows: [["Cell 1", "Cell 2"]],
    });
  });
});
