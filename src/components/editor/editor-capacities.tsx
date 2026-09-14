"use client";

import { BaseBasicBlocksPlugin, BaseBasicMarksPlugin } from "@platejs/basic-nodes";
import { Plate, usePlateEditor } from "platejs/react";
import * as React from "react";
import { Editor, EditorContainer } from "@/components/ui/editor";
import {
  type BlockEditorDocument,
  capacitiesDocToSlate,
  createEmptyBlockDocument,
  slateToCapacitiesDoc,
} from "@/lib/editor/document-schema";
import { CodeBlockMermaidPlugin } from "./plugins/code-mermaid-plugin";
import { ColumnLayoutPlugin, ColumnPlugin, GroupBlockPlugin } from "./plugins/group-column-plugin";
import { HighlightBlockPlugin } from "./plugins/highlight-block-plugin";
import { MathBlockPlugin } from "./plugins/math-block-plugin";
import { ObjectBlockPlugin } from "./plugins/object-block-plugin";
import { TableBlockPlugin } from "./plugins/table-block-plugin";
import { SuggestionCombobox } from "./ui/suggestion-combobox";

export interface CapacitiesEditorProps {
  initialDocument?: BlockEditorDocument;
  onChange?: (document: BlockEditorDocument) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
}

export function CapacitiesEditor({
  initialDocument,
  onChange,
  readOnly = false,
  placeholder = "Type / for commands or @ to mention objects...",
  className,
}: CapacitiesEditorProps) {
  const doc = initialDocument || createEmptyBlockDocument();
  const initialValue = React.useMemo(() => capacitiesDocToSlate(doc), [doc]);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [query] = React.useState("");

  const editor = usePlateEditor({
    value: initialValue as any[],
    plugins: [
      BaseBasicBlocksPlugin,
      BaseBasicMarksPlugin,
      ObjectBlockPlugin,
      TableBlockPlugin,
      MathBlockPlugin,
      HighlightBlockPlugin,
      GroupBlockPlugin,
      ColumnLayoutPlugin,
      ColumnPlugin,
      CodeBlockMermaidPlugin,
    ],
  });

  return (
    <Plate
      editor={editor}
      onChange={({ value }) => {
        if (onChange) {
          const capacitiesDoc = slateToCapacitiesDoc(value);
          onChange(capacitiesDoc);
        }
      }}
    >
      <div className="relative w-full">
        <EditorContainer className={className}>
          <Editor readOnly={readOnly} placeholder={placeholder} />
        </EditorContainer>

        <SuggestionCombobox
          isOpen={isMenuOpen}
          query={query}
          onSelect={(_item) => {
            setIsMenuOpen(false);
          }}
        />
      </div>
    </Plate>
  );
}
