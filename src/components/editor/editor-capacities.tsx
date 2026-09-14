"use client";

import { BaseBasicBlocksPlugin, BaseBasicMarksPlugin } from "@platejs/basic-nodes";
import {
  Plate,
  useEditorRef,
  useEditorSelection,
  useEditorValue,
  usePlateEditor,
} from "platejs/react";
import * as React from "react";
import { Editor, EditorContainer } from "@/components/ui/editor";
import {
  type BlockEditorDocument,
  capacitiesDocToSlate,
  createEmptyBlockDocument,
  slateToCapacitiesDoc,
} from "@/lib/editor/document-schema";
import { resolveSuggestionTrigger } from "@/lib/editor/trigger-controller";
import { CodeBlockMermaidPlugin } from "./plugins/code-mermaid-plugin";
import { ColumnLayoutPlugin, ColumnPlugin, GroupBlockPlugin } from "./plugins/group-column-plugin";
import { HighlightBlockPlugin } from "./plugins/highlight-block-plugin";
import { MathBlockPlugin } from "./plugins/math-block-plugin";
import { ObjectBlockPlugin } from "./plugins/object-block-plugin";
import { TableBlockPlugin } from "./plugins/table-block-plugin";
import { FloatingToolbar } from "./ui/floating-toolbar";
import { SuggestionCombobox } from "./ui/suggestion-combobox";

function EditorChrome({ readOnly }: { readOnly: boolean }) {
  const editor = useEditorRef();
  const selection = useEditorSelection();
  const value = useEditorValue();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [isToolbarVisible, setIsToolbarVisible] = React.useState(false);

  React.useEffect(() => {
    if (!selection || readOnly) {
      setIsMenuOpen(false);
      setIsToolbarVisible(false);
      return;
    }

    const anchor = selection.anchor;
    const leafText = editor.api.string(anchor.path);
    const trigger = resolveSuggestionTrigger({
      textBeforeCursor: leafText.slice(0, anchor.offset),
    });
    setIsMenuOpen(Boolean(trigger));
    setQuery(trigger?.query ?? "");
    setIsToolbarVisible(
      selection.focus.offset !== selection.anchor.offset ||
        selection.focus.path.join(".") !== selection.anchor.path.join("."),
    );
  }, [editor, readOnly, selection, value]);

  const toggleMark = (mark: "bold" | "italic" | "code" | "link" | "math" | "highlight") => {
    editor.tf.toggleMark(mark);
  };

  return (
    <>
      <SuggestionCombobox
        isOpen={isMenuOpen}
        query={query}
        onClose={() => setIsMenuOpen(false)}
        onSelect={() => setIsMenuOpen(false)}
      />
      <FloatingToolbar isVisible={isToolbarVisible} onToggleMark={toggleMark} />
    </>
  );
}

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

  const editor = usePlateEditor({
    value: initialValue as Array<{
      type: string;
      children: Array<{ text: string; [key: string]: unknown }>;
    }>,
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

        <EditorChrome readOnly={readOnly} />
      </div>
    </Plate>
  );
}
