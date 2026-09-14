"use client";

import { Download, Table } from "lucide-react";
import { createPlatePlugin } from "platejs/react";
import type * as React from "react";
import { cellKey, exportTableBlockToCsv, type TableBlockModel } from "@/lib/editor/table-model";
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

  return (
    <div
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
            onClick={() => {
              if (table) {
                const csv = exportTableBlockToCsv(table);
                navigator.clipboard.writeText(csv.content);
              }
            }}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
          >
            <Download className="size-3" />
            <span>CSV</span>
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
                      {cell ? cell.text || cell.content?.[0]?.text : ""}
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
