"use client";

import {
  Box,
  CheckSquare,
  Code,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  LayoutGrid,
  List,
  ListOrdered,
  Quote,
  Sigma,
  Table,
} from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

export interface SuggestionItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  token?: string;
}

const DEFAULT_COMMAND_ITEMS: SuggestionItem[] = [
  { id: "paragraph", label: "Text", description: "Just start writing plain text", icon: FileText },
  { id: "h1", label: "Heading 1", description: "Large section heading", icon: Heading1 },
  { id: "h2", label: "Heading 2", description: "Medium section heading", icon: Heading2 },
  { id: "h3", label: "Heading 3", description: "Small section heading", icon: Heading3 },
  {
    id: "bulletList",
    label: "Bullet List",
    description: "Create a simple bulleted list",
    icon: List,
  },
  {
    id: "orderedList",
    label: "Numbered List",
    description: "Create an ordered list",
    icon: ListOrdered,
  },
  {
    id: "taskList",
    label: "To-do List",
    description: "Track tasks with checkboxes",
    icon: CheckSquare,
  },
  { id: "blockquote", label: "Quote", description: "Capture a block quote", icon: Quote },
  {
    id: "codeBlock",
    label: "Code Block",
    description: "Capture snippet with syntax highlighting",
    icon: Code,
  },
  { id: "tableBlock", label: "Table", description: "Add a matrix spreadsheet table", icon: Table },
  { id: "mathBlock", label: "Math Equation", description: "LaTeX mathematical block", icon: Sigma },
  {
    id: "highlightBlock",
    label: "Highlight / Citation",
    description: "Callout block with source link",
    icon: Highlighter,
  },
  {
    id: "columnLayout",
    label: "2-4 Columns",
    description: "Flexible grid container",
    icon: LayoutGrid,
  },
  {
    id: "groupBlock",
    label: "Card Container",
    description: "Group blocks inside a card",
    icon: Box,
  },
];

export interface SuggestionComboboxProps {
  isOpen: boolean;
  query?: string;
  token?: string;
  onSelect: (item: SuggestionItem) => void;
  className?: string;
}

export function SuggestionCombobox({
  isOpen,
  query = "",
  onSelect,
  className,
}: SuggestionComboboxProps) {
  if (!isOpen) return null;

  const filtered = DEFAULT_COMMAND_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className={cn(
        "z-50 w-72 max-h-80 overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-lg text-popover-foreground animate-in fade-in-50 zoom-in-95",
        className,
      )}
    >
      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Block Catalog ({filtered.length})
      </div>
      {filtered.length === 0 ? (
        <div className="px-3 py-4 text-center text-xs text-muted-foreground">
          No matching blocks found
        </div>
      ) : (
        filtered.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <div className="flex size-7 items-center justify-center rounded-md border border-border bg-muted/50 text-foreground">
                <Icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-xs">{item.label}</div>
                <div className="truncate text-[11px] text-muted-foreground">{item.description}</div>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}
