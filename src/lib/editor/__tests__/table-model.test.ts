import { describe, expect, it } from "vitest";
import {
  createTableBlockModel,
  exportTableBlockToCsv,
  setTableCellText,
  tableBlockToMarkdown,
} from "../table-model";

describe("table-model", () => {
  it("creates table model with default dimensions", () => {
    const table = createTableBlockModel({ rowCount: 3, columnCount: 2 });
    expect(table.rows).toHaveLength(3);
    expect(table.columns).toHaveLength(2);
    expect(Object.keys(table.cells)).toHaveLength(6);
  });

  it("exports table model to CSV string", () => {
    const table = createTableBlockModel({ rowCount: 2, columnCount: 2 });
    const csv = exportTableBlockToCsv(table);
    expect(csv.mimeType).toBe("text/csv");
    expect(typeof csv.content).toBe("string");
  });

  it("formats table to markdown table format", () => {
    const table = createTableBlockModel({ rowCount: 2, columnCount: 2 });
    const md = tableBlockToMarkdown(table);
    expect(md).toContain("|");
    expect(md).toContain("---");
  });

  it("updates a cell immutably and keeps CSV export in sync", () => {
    const table = createTableBlockModel({ rowCount: 1, columnCount: 1 });
    const rowId = table.rows[0].id;
    const columnId = table.columns[0].id;
    const updated = setTableCellText(table, rowId, columnId, 'A, "quoted"');

    expect(updated).not.toBe(table);
    expect(table.cells[`${rowId}:${columnId}`].text).toBe("");
    expect(exportTableBlockToCsv(updated).content).toBe('"A, ""quoted"""');
  });
});
