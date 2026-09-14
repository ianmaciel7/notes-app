/**
 * Capacities Block Editor Domain - Table Block Model
 * Matrix operations: row/column insertion, deletion, sorting, cell styling, CSV export, and Markdown table parsing.
 */

export interface TableBlockCellStyle {
  align?: "left" | "center" | "right";
  background?: "default" | "muted" | "highlight";
  bold?: boolean;
}

export interface TableBlockTextMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TableBlockCellContent {
  type: "text" | "lineBreak";
  text?: string;
  marks?: TableBlockTextMark[];
}

export interface TableBlockCell {
  id: string;
  rowId: string;
  columnId: string;
  content: TableBlockCellContent[];
  style?: TableBlockCellStyle;
  text?: string;
}

export interface TableBlockRow {
  id: string;
  height?: number;
}

export interface TableBlockColumn {
  id: string;
  width?: number;
}

export interface TableBlockModel {
  id: string;
  version: 1;
  columnHeader: boolean;
  rowHeader: boolean;
  rows: TableBlockRow[];
  columns: TableBlockColumn[];
  cells: Record<string, TableCell>;
}

export type TableCell = TableBlockCell;

export function cellKey(rowId: string, columnId: string): string {
  return `${rowId}:${columnId}`;
}

export function createTableBlockModel(options?: {
  rowCount?: number;
  columnCount?: number;
}): TableBlockModel {
  const rowCount = options?.rowCount ?? 3;
  const columnCount = options?.columnCount ?? 2;

  const rows: TableBlockRow[] = Array.from({ length: rowCount }, () => ({
    id: `row:${crypto.randomUUID()}`,
  }));

  const columns: TableBlockColumn[] = Array.from({ length: columnCount }, () => ({
    id: `col:${crypto.randomUUID()}`,
  }));

  const cells: Record<string, TableCell> = {};
  for (const r of rows) {
    for (const c of columns) {
      const key = cellKey(r.id, c.id);
      cells[key] = {
        id: `cell:${crypto.randomUUID()}`,
        rowId: r.id,
        columnId: c.id,
        content: [{ type: "text", text: "" }],
        text: "",
      };
    }
  }

  return {
    id: `table:${crypto.randomUUID()}`,
    version: 1,
    columnHeader: false,
    rowHeader: false,
    rows,
    columns,
    cells,
  };
}

export function exportTableBlockToCsv(table: TableBlockModel): {
  content: string;
  mimeType: "text/csv";
} {
  const rows = table.rows.map((r) =>
    table.columns.map((c) => {
      const cell = table.cells[cellKey(r.id, c.id)];
      const text = cell?.text || cell?.content?.[0]?.text || "";
      return `"${text.replace(/"/g, '""')}"`;
    }),
  );

  return {
    content: rows.map((row) => row.join(",")).join("\n"),
    mimeType: "text/csv",
  };
}

export function tableBlockToMarkdown(table: TableBlockModel): string {
  const header = table.columns.map((_, i) => `Col ${i + 1}`);
  const separator = table.columns.map(() => "---");
  const dataRows = table.rows.map((r) =>
    table.columns.map((c) => {
      const cell = table.cells[cellKey(r.id, c.id)];
      return cell?.text || cell?.content?.[0]?.text || "";
    }),
  );

  return [
    `| ${header.join(" | ")} |`,
    `| ${separator.join(" | ")} |`,
    ...dataRows.map((r) => `| ${r.join(" | ")} |`),
  ].join("\n");
}
