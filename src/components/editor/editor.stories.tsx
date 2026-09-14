"use client";

import type { Story, StoryDefault } from "@ladle/react";
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
  title: "Editor / Capacities Parity",
} satisfies StoryDefault;

const initialDoc = {
  schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  doc: {
    type: "doc" as const,
    content: [
      {
        type: "heading",
        attrs: { id: "block:editor-heading", level: 1 },
        content: [{ type: "text", text: "Capacities Editor Parity in notes-app" }],
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <CapacitiesEditor initialDocument={initialDoc} className="min-h-[400px]" />
    </div>
  );
};

export const ReadOnly: Story = () => (
  <div className="p-6 max-w-4xl mx-auto">
    <CapacitiesEditor initialDocument={initialDoc} readOnly className="min-h-[300px]" />
  </div>
);

export const ObjectBlock: Story = () => (
  <div className="w-full max-w-3xl p-6 mx-auto">
    <ObjectBlockElement
      element={{
        targetId: "obj_notes_2026",
        title: "Q3 Architectural Decision Record",
        viewKind: "small-card",
        state: "available",
      }}
    />
  </div>
);

export const HighlightBlock: Story = () => (
  <div className="w-full max-w-3xl p-6 mx-auto">
    <HighlightBlockElement
      element={{
        color: "yellow",
        sourceLabel: "Capacities Parity Spec",
        sourceUrl: "https://capacities.io",
      }}
    >
      Knowledge management should center around structured object types and block transclusion.
    </HighlightBlockElement>
  </div>
);

export const MathBlock: Story = () => (
  <div className="w-full max-w-3xl p-6 mx-auto">
    <MathBlockElement
      element={{
        source:
          "E = mc^2 \\quad \\text{and} \\quad \\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}",
        displayMode: "block",
      }}
    />
  </div>
);

export const Group: Story = () => (
  <div className="w-full max-w-3xl p-6 mx-auto">
    <GroupBlockElement element={{ appearance: "card" }}>
      <p className="text-sm font-medium text-foreground">
        Grouped Block Content inside Card Container
      </p>
    </GroupBlockElement>
  </div>
);

export const Table: Story = () => (
  <div className="w-full max-w-3xl p-6 mx-auto">
    <TableBlockElement element={{ table: sampleTable }} />
  </div>
);

export const SlashCommands: Story = () => {
  return (
    <div className="p-6 w-full max-w-md mx-auto">
      <h3 className="text-sm font-semibold mb-3">Slash Command Catalog</h3>
      <SuggestionCombobox isOpen={true} query="" onSelect={() => {}} />
    </div>
  );
};
