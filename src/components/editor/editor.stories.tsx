"use client";

import type { Story, StoryDefault } from "@ladle/react";
import { BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION, createBlockId } from "@/lib/editor/document-schema";
import { createTableBlockModel } from "@/lib/editor/table-model";
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

export const CapacitiesFullEditor: Story = () => {
  const initialDoc = {
    schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    doc: {
      type: "doc" as const,
      content: [
        {
          type: "heading",
          attrs: { id: createBlockId(), level: 1 },
          content: [{ type: "text", text: "Capacities Editor Parity in notes-app" }],
        },
        {
          type: "paragraph",
          attrs: { id: createBlockId() },
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

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <CapacitiesEditor initialDocument={initialDoc} className="min-h-[400px]" />
    </div>
  );
};

export const CustomBlockCatalogPreview: Story = () => {
  const sampleTable = createTableBlockModel({ rowCount: 3, columnCount: 3 });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-lg font-bold text-foreground">Custom Capacities Block Components</h2>

      <div className="space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Object Reference Card
          </span>
          <ObjectBlockElement
            element={{
              targetId: "obj_notes_2026",
              title: "Q3 Architectural Decision Record",
              viewKind: "small-card",
              state: "available",
            }}
          />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Highlight & Citation Callout
          </span>
          <HighlightBlockElement
            element={{
              color: "yellow",
              sourceLabel: "Capacities Parity Spec",
              sourceUrl: "https://capacities.io",
            }}
          >
            "Knowledge management should center around structured object types and block
            transclusion."
          </HighlightBlockElement>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            LaTeX Math Block
          </span>
          <MathBlockElement
            element={{
              source:
                "E = mc^2 \\quad \\text{and} \\quad \\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}",
              displayMode: "block",
            }}
          />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Card Group Container
          </span>
          <GroupBlockElement element={{ appearance: "card" }}>
            <p className="text-sm font-medium text-foreground">
              Grouped Block Content inside Card Container
            </p>
          </GroupBlockElement>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Matrix Spreadsheet Table
          </span>
          <TableBlockElement element={{ table: sampleTable }} />
        </div>
      </div>
    </div>
  );
};

export const SlashCommandMenu: Story = () => {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h3 className="text-sm font-semibold mb-3">Slash Command Catalog</h3>
      <SuggestionCombobox isOpen={true} query="" onSelect={() => {}} />
    </div>
  );
};
