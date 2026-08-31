import type { BlockEditorMark, BlockEditorNode } from "./document.ts";

const TABLE_BLOCK_MODEL_VERSION = 1 as const;
const TABLE_BLOCK_TYPE = "tableBlock" as const;
const DEFAULT_TABLE_ROWS = 3;
const DEFAULT_TABLE_COLUMNS = 2;
const MIN_TABLE_ROWS = 1;
const MIN_TABLE_COLUMNS = 1;
const MAX_TABLE_ROWS = 200;
const MAX_TABLE_COLUMNS = 50;
const MAX_CELL_TEXT_LENGTH = 4000;

type TableBlockId = string & { readonly __tableBlockId: unique symbol };
type TableBlockRowId = string & { readonly __tableBlockRowId: unique symbol };
type TableBlockColumnId = string & {
  readonly __tableBlockColumnId: unique symbol;
};
type TableBlockCellId = string & { readonly __tableBlockCellId: unique symbol };

type TableBlockTextMark =
  | Extract<BlockEditorMark, { type: "bold" | "code" | "italic" | "link" }>
  | Extract<BlockEditorMark, { type: "objectLink" }>;

type TableBlockCellContent =
  | { readonly type: "lineBreak" }
  | {
      readonly marks?: readonly TableBlockTextMark[];
      readonly text: string;
      readonly type: "text";
    };

type TableBlockCellStyle = {
  readonly align?: "center" | "left" | "right";
  readonly background?: "default" | "muted" | "highlight";
  readonly bold?: boolean;
};

type TableBlockColumn = {
  readonly id: TableBlockColumnId;
  readonly width?: number;
};

type TableBlockRow = {
  readonly height?: number;
  readonly id: TableBlockRowId;
};

type TableBlockCell = {
  readonly columnId: TableBlockColumnId;
  readonly content: readonly TableBlockCellContent[];
  readonly id: TableBlockCellId;
  readonly rowId: TableBlockRowId;
  readonly style?: TableBlockCellStyle;
};

type TableBlockModel = {
  readonly cells: Readonly<Record<string, TableBlockCell>>;
  readonly columnHeader: boolean;
  readonly columns: readonly TableBlockColumn[];
  readonly id: TableBlockId;
  readonly rowHeader: boolean;
  readonly rows: readonly TableBlockRow[];
  readonly version: typeof TABLE_BLOCK_MODEL_VERSION;
};

type TableBlockNode = {
  readonly attrs: {
    readonly id: string;
    readonly table: TableBlockModel;
  };
  readonly type: typeof TABLE_BLOCK_TYPE;
};

type TableBlockResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly error: string; readonly ok: false };

type TableBlockCommand =
  | {
      readonly content: readonly TableBlockCellContent[];
      readonly type: "update-cell";
      readonly cellId: string;
    }
  | { readonly cellIds: readonly string[]; readonly type: "clear-cells" }
  | {
      readonly cellIds: readonly string[];
      readonly style: TableBlockCellStyle;
      readonly type: "style-cells";
    }
  | {
      readonly cellIds: readonly string[];
      readonly align: NonNullable<TableBlockCellStyle["align"]>;
      readonly type: "align-cells";
    }
  | {
      readonly afterColumnId?: string;
      readonly columnId?: string;
      readonly type: "insert-column";
    }
  | { readonly columnId: string; readonly type: "delete-column" }
  | {
      readonly columnId: string;
      readonly toIndex: number;
      readonly type: "move-column";
    }
  | {
      readonly columnId: string;
      readonly width: number;
      readonly type: "resize-column";
    }
  | {
      readonly afterRowId?: string;
      readonly rowId?: string;
      readonly type: "insert-row";
    }
  | { readonly rowId: string; readonly type: "delete-row" }
  | {
      readonly rowId: string;
      readonly toIndex: number;
      readonly type: "move-row";
    }
  | {
      readonly rowId: string;
      readonly height: number;
      readonly type: "resize-row";
    }
  | {
      readonly enabled: boolean;
      readonly target: "column" | "row";
      readonly type: "toggle-header";
    }
  | {
      readonly columnId: string;
      readonly direction: "ascending" | "descending";
      readonly type: "sort-rows";
    };

type TableBlockTransaction = {
  readonly before: TableBlockModel;
  readonly after: TableBlockModel;
  readonly inverse: TableBlockCommand;
};

type TableBlockCsvExport = {
  readonly content: string;
  readonly lossiness: readonly string[];
  readonly mimeType: "text/csv";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createTableId(): TableBlockId {
  return `table:${crypto.randomUUID()}` as TableBlockId;
}

function createRowId(): TableBlockRowId {
  return `row:${crypto.randomUUID()}` as TableBlockRowId;
}

function createColumnId(): TableBlockColumnId {
  return `column:${crypto.randomUUID()}` as TableBlockColumnId;
}

function createCellId(): TableBlockCellId {
  return `cell:${crypto.randomUUID()}` as TableBlockCellId;
}

function cellKey(rowId: string, columnId: string): string {
  return `${rowId}\u0000${columnId}`;
}

function cellDisplayText(cell: TableBlockCell): string {
  return cell.content
    .map((item) => (item.type === "lineBreak" ? "\n" : item.text))
    .join("");
}

function createTextCellContent(text: string): readonly TableBlockCellContent[] {
  return text ? [{ text, type: "text" }] : [];
}

function createTableBlockModel(
  options: { readonly columnCount?: number; readonly rowCount?: number } = {},
): TableBlockModel {
  const rowCount = options.rowCount ?? DEFAULT_TABLE_ROWS;
  const columnCount = options.columnCount ?? DEFAULT_TABLE_COLUMNS;
  if (
    rowCount < MIN_TABLE_ROWS ||
    rowCount > MAX_TABLE_ROWS ||
    columnCount < MIN_TABLE_COLUMNS ||
    columnCount > MAX_TABLE_COLUMNS
  ) {
    throw new RangeError("Table dimensions are outside supported bounds.");
  }

  const rows = Array.from({ length: rowCount }, () => ({ id: createRowId() }));
  const columns = Array.from({ length: columnCount }, () => ({
    id: createColumnId(),
  }));
  return withMissingCells({
    cells: {},
    columnHeader: false,
    columns,
    id: createTableId(),
    rowHeader: false,
    rows,
    version: TABLE_BLOCK_MODEL_VERSION,
  });
}

function createTableBlockNode(): TableBlockNode {
  const table = createTableBlockModel();
  return { attrs: { id: table.id, table }, type: TABLE_BLOCK_TYPE };
}

function hasStableTableId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_.:-]+$/.test(value);
}

function isTableBlockTextMark(value: unknown): value is TableBlockTextMark {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  if (["bold", "code", "italic"].includes(value.type)) {
    return Object.keys(value).length === 1;
  }
  if (value.type === "objectLink") {
    return (
      isRecord(value.attrs) &&
      Object.keys(value.attrs).length === 1 &&
      hasStableTableId(value.attrs.objectId)
    );
  }
  if (value.type === "link") {
    return (
      isRecord(value.attrs) &&
      Object.keys(value.attrs).length === 1 &&
      typeof value.attrs.href === "string" &&
      /^(https?:|mailto:|\/|#|\.{1,2}\/)/i.test(value.attrs.href)
    );
  }
  return false;
}

function isTableBlockCellContent(
  value: unknown,
): value is TableBlockCellContent {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  if (value.type === "lineBreak") return Object.keys(value).length === 1;
  if (value.type !== "text" || typeof value.text !== "string") return false;
  if (value.text.length > MAX_CELL_TEXT_LENGTH) return false;
  return (
    value.marks === undefined ||
    (Array.isArray(value.marks) && value.marks.every(isTableBlockTextMark))
  );
}

function normalizeDimension(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.round(value)
    : undefined;
}

function normalizeCellStyle(value: unknown): TableBlockCellStyle | undefined {
  if (!isRecord(value)) return undefined;
  const style: TableBlockCellStyle = {
    ...(value.align === "center" ||
    value.align === "left" ||
    value.align === "right"
      ? { align: value.align }
      : {}),
    ...(value.background === "default" ||
    value.background === "muted" ||
    value.background === "highlight"
      ? { background: value.background }
      : {}),
    ...(typeof value.bold === "boolean" ? { bold: value.bold } : {}),
  };
  return Object.keys(style).length > 0 ? style : undefined;
}

function normalizeTableBlock(value: unknown): TableBlockModel | null {
  if (!isRecord(value) || value.version !== TABLE_BLOCK_MODEL_VERSION) {
    return null;
  }
  if (!hasStableTableId(value.id)) return null;
  if (!Array.isArray(value.rows) || !Array.isArray(value.columns)) return null;
  if (
    value.rows.length < MIN_TABLE_ROWS ||
    value.rows.length > MAX_TABLE_ROWS ||
    value.columns.length < MIN_TABLE_COLUMNS ||
    value.columns.length > MAX_TABLE_COLUMNS
  ) {
    return null;
  }

  const rows: TableBlockRow[] = [];
  for (const row of value.rows) {
    if (!isRecord(row) || !hasStableTableId(row.id)) return null;
    const height = normalizeDimension(row.height);
    rows.push({
      id: row.id as TableBlockRowId,
      ...(height ? { height } : {}),
    });
  }
  const columns: TableBlockColumn[] = [];
  for (const column of value.columns) {
    if (!isRecord(column) || !hasStableTableId(column.id)) return null;
    const width = normalizeDimension(column.width);
    columns.push({
      id: column.id as TableBlockColumnId,
      ...(width ? { width } : {}),
    });
  }
  if (
    new Set(rows.map((row) => row.id)).size !== rows.length ||
    new Set(columns.map((column) => column.id)).size !== columns.length
  ) {
    return null;
  }

  const rowIds = new Set(rows.map((row) => row.id));
  const columnIds = new Set(columns.map((column) => column.id));
  const rawCells = isRecord(value.cells) ? value.cells : {};
  const cells: Record<string, TableBlockCell> = {};
  for (const rawCell of Object.values(rawCells)) {
    if (!isRecord(rawCell)) return null;
    if (
      !hasStableTableId(rawCell.id) ||
      !hasStableTableId(rawCell.rowId) ||
      !hasStableTableId(rawCell.columnId) ||
      !rowIds.has(rawCell.rowId as TableBlockRowId) ||
      !columnIds.has(rawCell.columnId as TableBlockColumnId) ||
      !Array.isArray(rawCell.content) ||
      !rawCell.content.every(isTableBlockCellContent)
    ) {
      return null;
    }
    const normalizedCell: TableBlockCell = {
      columnId: rawCell.columnId as TableBlockColumnId,
      content: structuredClone(rawCell.content),
      id: rawCell.id as TableBlockCellId,
      rowId: rawCell.rowId as TableBlockRowId,
      ...(normalizeCellStyle(rawCell.style)
        ? { style: normalizeCellStyle(rawCell.style) }
        : {}),
    };
    cells[cellKey(normalizedCell.rowId, normalizedCell.columnId)] =
      normalizedCell;
  }

  return withMissingCells({
    cells,
    columnHeader: value.columnHeader === true,
    columns,
    id: value.id as TableBlockId,
    rowHeader: value.rowHeader === true,
    rows,
    version: TABLE_BLOCK_MODEL_VERSION,
  });
}

function isTableBlock(value: unknown): value is TableBlockModel {
  return normalizeTableBlock(value) !== null;
}

function isTableBlockNode(value: unknown): value is TableBlockNode {
  return (
    isRecord(value) &&
    value.type === TABLE_BLOCK_TYPE &&
    isRecord(value.attrs) &&
    hasStableTableId(value.attrs.id) &&
    normalizeTableBlock(value.attrs.table) !== null &&
    value.attrs.id === (value.attrs.table as { id?: unknown }).id
  );
}

function withMissingCells(table: TableBlockModel): TableBlockModel {
  const cells: Record<string, TableBlockCell> = { ...table.cells };
  for (const row of table.rows) {
    for (const column of table.columns) {
      const key = cellKey(row.id, column.id);
      cells[key] ??= {
        columnId: column.id,
        content: [],
        id: createCellId(),
        rowId: row.id,
      };
    }
  }
  return { ...table, cells };
}

function getCellById(table: TableBlockModel, cellId: string) {
  return Object.values(table.cells).find((cell) => cell.id === cellId) ?? null;
}

function replaceCells(
  table: TableBlockModel,
  update: (cell: TableBlockCell) => TableBlockCell,
): TableBlockModel {
  return {
    ...table,
    cells: Object.fromEntries(
      Object.entries(table.cells).map(([key, cell]) => [key, update(cell)]),
    ),
  };
}

function applyTableBlockCommand(
  table: TableBlockModel,
  command: TableBlockCommand,
): TableBlockResult<TableBlockTransaction> {
  const before = structuredClone(table);
  const next = reduceTableBlockCommand(table, command);
  if (!next.ok) return next;
  return {
    ok: true,
    value: {
      after: next.value,
      before,
      inverse: {
        after: before,
        type: "replace-table",
      } as unknown as TableBlockCommand,
    },
  };
}

function reduceTableBlockCommand(
  table: TableBlockModel,
  command: TableBlockCommand,
): TableBlockResult<TableBlockModel> {
  if (command.type === "update-cell") {
    const cell = getCellById(table, command.cellId);
    if (!cell || !command.content.every(isTableBlockCellContent)) {
      return { error: "invalid-cell-update", ok: false };
    }
    return {
      ok: true,
      value: replaceCells(table, (item) =>
        item.id === cell.id ? { ...item, content: command.content } : item,
      ),
    };
  }
  if (command.type === "clear-cells") {
    const ids = new Set(command.cellIds);
    return {
      ok: true,
      value: replaceCells(table, (cell) =>
        ids.has(cell.id) ? { ...cell, content: [] } : cell,
      ),
    };
  }
  if (command.type === "style-cells" || command.type === "align-cells") {
    const ids = new Set(command.cellIds);
    const style =
      command.type === "align-cells" ? { align: command.align } : command.style;
    return {
      ok: true,
      value: replaceCells(table, (cell) =>
        ids.has(cell.id)
          ? { ...cell, style: { ...cell.style, ...style } }
          : cell,
      ),
    };
  }
  if (command.type === "insert-row") {
    if (table.rows.length >= MAX_TABLE_ROWS) {
      return { error: "row-limit-exceeded", ok: false };
    }
    const index = command.afterRowId
      ? table.rows.findIndex((row) => row.id === command.afterRowId) + 1
      : command.rowId
        ? table.rows.findIndex((row) => row.id === command.rowId)
        : table.rows.length;
    if (index < 0) return { error: "missing-row", ok: false };
    const rows = table.rows.toSpliced(index, 0, { id: createRowId() });
    return { ok: true, value: withMissingCells({ ...table, rows }) };
  }
  if (command.type === "delete-row") {
    if (table.rows.length <= MIN_TABLE_ROWS) {
      return { error: "minimum-row-count", ok: false };
    }
    if (!table.rows.some((row) => row.id === command.rowId)) {
      return { error: "missing-row", ok: false };
    }
    return {
      ok: true,
      value: withMissingCells({
        ...table,
        cells: Object.fromEntries(
          Object.entries(table.cells).filter(
            ([, cell]) => cell.rowId !== command.rowId,
          ),
        ),
        rows: table.rows.filter((row) => row.id !== command.rowId),
      }),
    };
  }
  if (command.type === "move-row") {
    const index = table.rows.findIndex((row) => row.id === command.rowId);
    if (
      index < 0 ||
      command.toIndex < 0 ||
      command.toIndex >= table.rows.length
    ) {
      return { error: "invalid-row-order", ok: false };
    }
    const rows = table.rows.toSpliced(index, 1);
    return {
      ok: true,
      value: {
        ...table,
        rows: rows.toSpliced(command.toIndex, 0, table.rows[index]),
      },
    };
  }
  if (command.type === "resize-row") {
    return {
      ok: true,
      value: {
        ...table,
        rows: table.rows.map((row) =>
          row.id === command.rowId
            ? { ...row, height: normalizeDimension(command.height) }
            : row,
        ),
      },
    };
  }
  if (command.type === "insert-column") {
    if (table.columns.length >= MAX_TABLE_COLUMNS) {
      return { error: "column-limit-exceeded", ok: false };
    }
    const index = command.afterColumnId
      ? table.columns.findIndex(
          (column) => column.id === command.afterColumnId,
        ) + 1
      : command.columnId
        ? table.columns.findIndex((column) => column.id === command.columnId)
        : table.columns.length;
    if (index < 0) return { error: "missing-column", ok: false };
    const columns = table.columns.toSpliced(index, 0, { id: createColumnId() });
    return { ok: true, value: withMissingCells({ ...table, columns }) };
  }
  if (command.type === "delete-column") {
    if (table.columns.length <= MIN_TABLE_COLUMNS) {
      return { error: "minimum-column-count", ok: false };
    }
    if (!table.columns.some((column) => column.id === command.columnId)) {
      return { error: "missing-column", ok: false };
    }
    return {
      ok: true,
      value: withMissingCells({
        ...table,
        cells: Object.fromEntries(
          Object.entries(table.cells).filter(
            ([, cell]) => cell.columnId !== command.columnId,
          ),
        ),
        columns: table.columns.filter(
          (column) => column.id !== command.columnId,
        ),
      }),
    };
  }
  if (command.type === "move-column") {
    const index = table.columns.findIndex(
      (column) => column.id === command.columnId,
    );
    if (
      index < 0 ||
      command.toIndex < 0 ||
      command.toIndex >= table.columns.length
    ) {
      return { error: "invalid-column-order", ok: false };
    }
    const columns = table.columns.toSpliced(index, 1);
    return {
      ok: true,
      value: {
        ...table,
        columns: columns.toSpliced(command.toIndex, 0, table.columns[index]),
      },
    };
  }
  if (command.type === "resize-column") {
    return {
      ok: true,
      value: {
        ...table,
        columns: table.columns.map((column) =>
          column.id === command.columnId
            ? { ...column, width: normalizeDimension(command.width) }
            : column,
        ),
      },
    };
  }
  if (command.type === "toggle-header") {
    return {
      ok: true,
      value: {
        ...table,
        ...(command.target === "column"
          ? { columnHeader: command.enabled }
          : { rowHeader: command.enabled }),
      },
    };
  }
  if (command.type === "sort-rows") {
    if (!table.columns.some((column) => column.id === command.columnId)) {
      return { error: "missing-column", ok: false };
    }
    const rows = [...table.rows].sort((left, right) => {
      const leftText =
        table.cells[cellKey(left.id, command.columnId)]?.content
          .map((item) => (item.type === "text" ? item.text : "\n"))
          .join("") ?? "";
      const rightText =
        table.cells[cellKey(right.id, command.columnId)]?.content
          .map((item) => (item.type === "text" ? item.text : "\n"))
          .join("") ?? "";
      const order = leftText.localeCompare(rightText, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return command.direction === "ascending" ? order : -order;
    });
    return { ok: true, value: { ...table, rows } };
  }
  return { error: "unknown-command", ok: false };
}

function parseMarkdownTable(text: string): TableBlockResult<TableBlockModel> {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2 || !/^\|?(?:\s*:?-{3,}:?\s*\|)+/.test(lines[1])) {
    return { error: "invalid-markdown-table", ok: false };
  }
  const rows = [lines[0], ...lines.slice(2)].map((line) =>
    line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim()),
  );
  const columnCount = rows[0]?.length ?? 0;
  if (
    columnCount < MIN_TABLE_COLUMNS ||
    rows.some((row) => row.length !== columnCount)
  ) {
    return { error: "ragged-markdown-table", ok: false };
  }
  const table = createTableBlockModel({
    columnCount,
    rowCount: rows.length,
  });
  let value = { ...table, columnHeader: true };
  for (const [rowIndex, row] of rows.entries()) {
    for (const [columnIndex, textValue] of row.entries()) {
      const cell =
        value.cells[
          cellKey(value.rows[rowIndex].id, value.columns[columnIndex].id)
        ];
      const result = reduceTableBlockCommand(value, {
        cellId: cell.id,
        content: createTextCellContent(textValue),
        type: "update-cell",
      });
      if (!result.ok) return result;
      value = result.value;
    }
  }
  return { ok: true, value };
}

function csvEscape(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function exportTableBlockToCsv(table: TableBlockModel): TableBlockCsvExport {
  const lossiness = new Set<string>();
  const rows = table.rows.map((row) =>
    table.columns.map((column) => {
      const cell = table.cells[cellKey(row.id, column.id)];
      if (
        cell?.content.some((item) => item.type === "text" && item.marks?.length)
      ) {
        lossiness.add(
          "CSV export preserves display text and drops rich marks or object references.",
        );
      }
      return csvEscape(cell ? cellDisplayText(cell) : "");
    }),
  );
  return {
    content: rows.map((row) => row.join(",")).join("\n"),
    lossiness: Array.from(lossiness),
    mimeType: "text/csv",
  };
}

function tableBlockToPlainText(table: TableBlockModel): string {
  return table.rows
    .map((row) =>
      table.columns
        .map((column) =>
          cellDisplayText(table.cells[cellKey(row.id, column.id)]),
        )
        .join("\t"),
    )
    .join("\n");
}

function tableBlockToMarkdown(table: TableBlockModel): string {
  const rows = table.rows.map((row) =>
    table.columns.map((column) =>
      cellDisplayText(table.cells[cellKey(row.id, column.id)]).replace(
        /\|/g,
        "\\|",
      ),
    ),
  );
  const first = rows[0] ?? table.columns.map(() => "");
  const body = rows.slice(1);
  return [
    `| ${first.join(" | ")} |`,
    `| ${table.columns.map(() => "---").join(" | ")} |`,
    ...body.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function replaceTableBlockNode(
  document: { readonly doc: { readonly content: readonly BlockEditorNode[] } },
  blockId: string,
  replacement: BlockEditorNode,
) {
  const index = document.doc.content.findIndex(
    (node) => node.type === TABLE_BLOCK_TYPE && node.attrs?.id === blockId,
  );
  if (index < 0) return null;
  return {
    ...document,
    doc: {
      ...document.doc,
      content: document.doc.content.toSpliced(index, 1, replacement),
    },
  };
}

function createTableBlockConversion(
  document: { readonly doc: { readonly content: readonly BlockEditorNode[] } },
  blockId: string,
  createObject: (
    table: TableBlockModel,
  ) => TableBlockResult<{ readonly id: string }>,
) {
  const node = document.doc.content.find(
    (item) => item.type === TABLE_BLOCK_TYPE && item.attrs?.id === blockId,
  );
  const table = normalizeTableBlock(node?.attrs?.table);
  if (!table)
    return { document, error: "missing-table-block", ok: false as const };
  const created = createObject(table);
  if (!created.ok)
    return { document, error: created.error, ok: false as const };
  const nextDocument = replaceTableBlockNode(document, blockId, {
    attrs: { id: `${blockId}:object-reference` },
    content: [
      {
        attrs: { objectId: created.value.id },
        type: "objectEmbed",
      },
    ],
    type: "paragraph",
  });
  return nextDocument
    ? { document: nextDocument, objectId: created.value.id, ok: true as const }
    : { document, error: "missing-table-block", ok: false as const };
}

export type {
  TableBlockCell,
  TableBlockCellContent,
  TableBlockCellId,
  TableBlockCellStyle,
  TableBlockColumn,
  TableBlockColumnId,
  TableBlockCommand,
  TableBlockCsvExport,
  TableBlockId,
  TableBlockModel,
  TableBlockNode,
  TableBlockResult,
  TableBlockRow,
  TableBlockRowId,
  TableBlockTextMark,
  TableBlockTransaction,
};
export {
  applyTableBlockCommand,
  cellKey,
  createTableBlockConversion,
  createTableBlockModel,
  createTableBlockNode,
  DEFAULT_TABLE_COLUMNS,
  DEFAULT_TABLE_ROWS,
  exportTableBlockToCsv,
  isTableBlock,
  isTableBlockNode,
  MAX_TABLE_COLUMNS,
  MAX_TABLE_ROWS,
  normalizeTableBlock,
  parseMarkdownTable,
  TABLE_BLOCK_MODEL_VERSION,
  TABLE_BLOCK_TYPE,
  tableBlockToMarkdown,
  tableBlockToPlainText,
};
