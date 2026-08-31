import assert from "node:assert/strict";
import test from "node:test";

import {
  blockEditorDocumentToMarkdown,
  blockEditorDocumentToPlainText,
  isBlockEditorDocument,
} from "../src/editor/document.ts";
import {
  applyTableBlockCommand,
  cellKey,
  createTableBlockConversion,
  createTableBlockModel,
  createTableBlockNode,
  exportTableBlockToCsv,
  isTableBlock,
  parseMarkdownTable,
  tableBlockToPlainText,
} from "../src/editor/table-block.ts";
import {
  createNativeWorkspaceExport,
  parseNativeWorkspaceExport,
} from "../src/lib/workspace-import-export.ts";
import {
  createInitialWorkspaceObjectState,
  workspaceObjectReducer,
} from "../src/lib/workspace-objects.ts";

function firstCell(table) {
  return table.cells[cellKey(table.rows[0].id, table.columns[0].id)];
}

test("table blocks default to stable 2 by 3 internal identity", () => {
  const node = createTableBlockNode();
  const table = node.attrs.table;

  assert.equal(node.type, "tableBlock");
  assert.equal(node.attrs.id, table.id);
  assert.equal(table.rows.length, 3);
  assert.equal(table.columns.length, 2);
  assert.equal(Object.values(table.cells).length, 6);
  assert.equal(isTableBlock(table), true);
  assert.equal(
    new Set([
      table.id,
      ...table.rows.map((row) => row.id),
      ...table.columns.map((column) => column.id),
      ...Object.values(table.cells).map((cell) => cell.id),
    ]).size,
    12,
  );
});

test("table block document validation and exports use display text", () => {
  const node = createTableBlockNode();
  let table = node.attrs.table;
  const edited = applyTableBlockCommand(table, {
    cellId: firstCell(table).id,
    content: [
      {
        marks: [{ attrs: { objectId: "page-1" }, type: "objectLink" }],
        text: "Project",
        type: "text",
      },
    ],
    type: "update-cell",
  });
  assert.equal(edited.ok, true);
  table = edited.value.after;

  const document = {
    doc: {
      content: [{ attrs: { id: table.id, table }, type: "tableBlock" }],
      type: "doc",
    },
    schemaVersion: 3,
  };

  assert.equal(isBlockEditorDocument(document), true);
  assert.equal(blockEditorDocumentToPlainText(document), "Project\t\n\t\n\t");
  assert.match(blockEditorDocumentToMarkdown(document), /^\| Project \| {2}\|/);

  const csv = exportTableBlockToCsv(table);
  assert.match(csv.content, /^Project,/);
  assert.equal(csv.mimeType, "text/csv");
  assert.ok(csv.lossiness[0].includes("rich marks"));
});

test("row and column operations preserve unaffected stable identities", () => {
  const table = createTableBlockModel();
  const rowId = table.rows[1].id;
  const rowCellIds = table.columns.map(
    (column) => table.cells[cellKey(rowId, column.id)].id,
  );
  const moved = applyTableBlockCommand(table, {
    rowId,
    toIndex: 0,
    type: "move-row",
  });

  assert.equal(moved.ok, true);
  assert.equal(moved.value.after.rows[0].id, rowId);
  assert.deepEqual(
    moved.value.after.columns.map((column) => column.id),
    table.columns.map((column) => column.id),
  );
  assert.deepEqual(
    moved.value.after.columns.map(
      (column) => moved.value.after.cells[cellKey(rowId, column.id)].id,
    ),
    rowCellIds,
  );

  const rejected = applyTableBlockCommand(
    createTableBlockModel({ columnCount: 1, rowCount: 1 }),
    { rowId: "missing", type: "delete-row" },
  );
  assert.equal(rejected.ok, false);
});

test("Markdown table paste parses into a bounded table block", () => {
  const parsed = parseMarkdownTable(`
| Name | Score |
| --- | --- |
| Ada | 10 |
| Ian | 9 |
`);

  assert.equal(parsed.ok, true);
  assert.equal(parsed.value.columnHeader, true);
  assert.equal(parsed.value.rows.length, 3);
  assert.equal(parsed.value.columns.length, 2);
  assert.equal(
    tableBlockToPlainText(parsed.value),
    "Name\tScore\nAda\t10\nIan\t9",
  );
});

test("table block conversion rolls back when object creation fails", () => {
  const node = createTableBlockNode();
  const document = {
    doc: { content: [node], type: "doc" },
    schemaVersion: 3,
  };
  const failed = createTableBlockConversion(document, node.attrs.id, () => ({
    error: "storage-failed",
    ok: false,
  }));
  const converted = createTableBlockConversion(document, node.attrs.id, () => ({
    ok: true,
    value: { id: "table-object-1" },
  }));

  assert.equal(failed.ok, false);
  assert.strictEqual(failed.document, document);
  assert.equal(converted.ok, true);
  assert.equal(converted.document.doc.content[0].type, "paragraph");
  assert.equal(
    converted.document.doc.content[0].content[0].attrs.objectId,
    "table-object-1",
  );
});

test("native workspace export preserves the full table block model", () => {
  const node = createTableBlockNode();
  const initial = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    objectTypeId: "page",
    title: "Native table block",
    type: "createDocument",
  });
  const state = workspaceObjectReducer(initial, {
    id: initial.entities[0].id,
    patch: {
      body: {
        doc: { content: [node], type: "doc" },
        schemaVersion: 3,
      },
    },
    type: "updateEntity",
  });
  const exported = createNativeWorkspaceExport(
    state,
    [],
    () => new Date("2026-08-31T00:00:00.000Z"),
  );
  const parsed = parseNativeWorkspaceExport(
    JSON.parse(JSON.stringify(exported)),
  );

  assert.equal(parsed.ok, true);
  assert.deepEqual(
    parsed.state.entities[0].body.doc.content[0].attrs.table,
    node.attrs.table,
  );
});
