"use client";

import { Download, Table } from "lucide-react";
import { createPlatePlugin, useEditorRef, usePath, useReadOnly } from "platejs/react";
import * as React from "react";
import {
  cellKey,
  exportTableBlockToCsv,
  setTableCellText,
  type TableBlockModel,
} from "@/lib/editor/table-model";
import { cn } from "@/lib/utils";

export const KEY_TABLE_BLOCK = "tableBlock";

export interface TableBlockElementProps extends React.ComponentPropsWithoutRef<"div"> {
  attributes?: Record<string, unknown>;
  element: {
    id?: string;
    table: TableBlockModel;
  };
}

export function TableBlockElement({
  className,
  element,
  attributes,
  children,
  ...props
}: TableBlockElementProps) {
  const { table } = element;
  const editor = useEditorRef();
  const path = usePath();
  const readOnly = useReadOnly();
  const [exportStatus, setExportStatus] = React.useState<"idle" | "copied" | "failed">("idle");

  const updateCell = (rowId: string, columnId: string, text: string) => {
    const nextTable = setTableCellText(table, rowId, columnId, text);
    if (nextTable !== table) editor.tf.setNodes({ table: nextTable }, { at: path });
  };

  const copyCsv = async () => {
    if (!table) return;
    try {
      await navigator.clipboard.writeText(exportTableBlockToCsv(table).content);
      setExportStatus("copied");
    } catch {
      setExportStatus("failed");
    }
  };

  return (
    <div
      data-slot="editor-table-block"
      {...attributes}
      {...props}
      className={cn(
        "my-4 overflow-hidden rounded-xl border border-border bg-background shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Table className="size-4" />
          <span>
            Table Block ({table?.rows?.length ?? 0} × {table?.columns?.length ?? 0})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Copy table as CSV"
            onClick={copyCsv}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
          >
            <Download className="size-3" />
            <span>
              {exportStatus === "copied"
                ? "Copied"
                : exportStatus === "failed"
                  ? "Copy failed"
                  : "CSV"}
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto p-2">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {table?.columns?.map((col, idx) => (
                <th
                  key={col.id}
                  className="border border-border bg-muted/30 px-3 py-2 text-left font-medium text-muted-foreground"
                  style={{ width: col.width }}
                >
                  Col {idx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table?.rows?.map((row) => (
              <tr key={row.id}>
                {table.columns.map((col) => {
                  const cell = table.cells[cellKey(row.id, col.id)];
                  return (
                    <td
                      key={col.id}
                      className={cn(
                        "border border-border px-3 py-2 text-foreground focus-within:ring-2 focus-within:ring-ring",
                        cell?.style?.align === "center" && "text-center",
                        cell?.style?.align === "right" && "text-right",
                        cell?.style?.background === "muted" && "bg-muted/20",
                      )}
                    >
                      {cell ? (
                        <input
                          aria-label={`Row ${row.id}, column ${col.id}`}
                          className="w-full min-w-24 bg-transparent outline-none"
                          disabled={readOnly}
                          value={cell.text || cell.content?.[0]?.text || ""}
                          onChange={(event) => updateCell(row.id, col.id, event.target.value)}
                        />
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {children}
    </div>
  );
}

export const TableBlockPlugin = createPlatePlugin({
  key: KEY_TABLE_BLOCK,
  node: {
    component: TableBlockElement,
    isElement: true,
  },
});
