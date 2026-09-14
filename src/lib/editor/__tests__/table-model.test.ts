import { describe, expect, it } from "vitest";
import { createTableBlockModel, exportTableBlockToCsv, tableBlockToMarkdown } from "../table-model";

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
});
