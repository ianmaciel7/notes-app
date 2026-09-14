"use client";

import type { Story, StoryDefault } from "@ladle/react";
import type { ReactNode } from "react";
import { BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION } from "@/lib/editor/document-schema";
import type { TableBlockModel } from "@/lib/editor/table-model";
import { CapacitiesEditor } from "./editor-capacities";
import { GroupBlockElement } from "./plugins/group-column-plugin";
import { HighlightBlockElement } from "./plugins/highlight-block-plugin";
import { MathBlockElement } from "./plugins/math-block-plugin";
import { ObjectBlockElement } from "./plugins/object-block-plugin";
import { TableBlockElement } from "./plugins/table-block-plugin";
import { SuggestionCombobox } from "./ui/suggestion-combobox";

export default {
  title: "Editor / Structured Parity",
} satisfies StoryDefault;

const initialDoc = {
  schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  doc: {
    type: "doc" as const,
    content: [
      {
        type: "heading",
        attrs: { id: "block:editor-heading", level: 1 },
        content: [{ type: "text", text: "Structured Editor Parity in notes-app" }],
      },
      {
        type: "paragraph",
        attrs: { id: "block:editor-paragraph" },
        content: [
          {
            type: "text",
            text: "This editor supports 15+ block types, persistent block IDs, object transclusion cards, and matrix tables.",
          },
        ],
      },
    ],
  },
};

function StoryCanvas({ children }: { children: ReactNode }) {
  return <div className="min-h-full w-full bg-background p-6 md:p-8">{children}</div>;
}

function StoryContent({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-4xl">{children}</div>;
}

const sampleTable = {
  id: "table:editor-story",
  version: 1,
  columnHeader: false,
  rowHeader: false,
  rows: ["one", "two", "three"].map((id) => ({ id: `row:${id}` })),
  columns: ["one", "two", "three"].map((id) => ({ id: `col:${id}` })),
  cells: Object.fromEntries(
    ["one", "two", "three"].flatMap((row) =>
      ["one", "two", "three"].map((column) => {
        const rowId = `row:${row}`;
        const columnId = `col:${column}`;
        return [
          `${rowId}:${columnId}`,
          {
            id: `cell:${row}:${column}`,
            rowId,
            columnId,
            content: [{ type: "text" as const, text: "" }],
            text: "",
          },
        ];
      }),
    ),
  ),
} satisfies TableBlockModel;

export const Default: Story = () => {
  return (
    <StoryCanvas>
      <StoryContent>
        <CapacitiesEditor initialDocument={initialDoc} className="min-h-[400px]" />
      </StoryContent>
    </StoryCanvas>
  );
};

export const ReadOnly: Story = () => (
  <StoryCanvas>
    <StoryContent>
      <CapacitiesEditor initialDocument={initialDoc} readOnly className="min-h-[300px]" />
    </StoryContent>
  </StoryCanvas>
);

export const ObjectBlock: Story = () => (
  <StoryCanvas>
    <StoryContent>
      <ObjectBlockElement
        element={{
          targetId: "obj_notes_2026",
          title: "Q3 Architectural Decision Record",
          viewKind: "small-card",
          state: "available",
        }}
      />
    </StoryContent>
  </StoryCanvas>
);

export const HighlightBlock: Story = () => (
  <StoryCanvas>
    <StoryContent>
      <HighlightBlockElement
        element={{
          color: "yellow",
          sourceLabel: "Structured Editor Specification",
          sourceUrl: "https://example.com/editor-specification",
        }}
      >
        Knowledge management should center around structured object types and block transclusion.
      </HighlightBlockElement>
    </StoryContent>
  </StoryCanvas>
);

export const MathBlock: Story = () => (
  <StoryCanvas>
    <StoryContent>
      <MathBlockElement
        element={{
          source:
            "E = mc^2 \\quad \\text{and} \\quad \\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}",
          displayMode: "block",
        }}
      />
    </StoryContent>
  </StoryCanvas>
);

export const Group: Story = () => (
  <StoryCanvas>
    <StoryContent>
      <GroupBlockElement element={{ appearance: "card" }}>
        <p className="text-sm font-medium text-foreground">
          Grouped Block Content inside Card Container
        </p>
      </GroupBlockElement>
    </StoryContent>
  </StoryCanvas>
);

export const Table: Story = () => (
  <StoryCanvas>
    <StoryContent>
      <TableBlockElement element={{ table: sampleTable }} />
    </StoryContent>
  </StoryCanvas>
);

export const SlashCommands: Story = () => {
  return (
    <StoryCanvas>
      <div className="mx-auto w-full max-w-md">
        <h3 className="mb-3 text-sm font-semibold">Slash Command Catalog</h3>
        <SuggestionCombobox isOpen={true} query="" onSelect={() => {}} />
      </div>
    </StoryCanvas>
  );
};
