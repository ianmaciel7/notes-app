import assert from "node:assert/strict";
import test from "node:test";

import {
  applyFormulaTableOperation,
  canonicalizeFormulaSource,
  createFormulaTable,
  createFormulaValue,
  describeFormulaExportMode,
  evaluateFormulaTable,
  exportFormulaCell,
  parseFormulaSource,
  resolveFormulaReferences,
  tokenizeFormulaSource,
} from "../src/lib/workspace-table-formulas.ts";

function expectOk(result) {
  assert.equal(result.ok, true, result.ok ? undefined : result.error.message);
  return result.value;
}

function expectFormulaError(result, code) {
  assert.equal(result.ok, false);
  assert.equal(result.error.code, code);
}

test("tokenizer and parser accept arithmetic functions constants references ranges and limits", () => {
  assert.deepEqual(
    tokenizeFormulaSource("=sum(A1:B2) + ROUND(PI, 2)").map(
      (token) => token.type,
    ),
    [
      "equals",
      "identifier",
      "leftParen",
      "cell",
      "colon",
      "cell",
      "rightParen",
      "operator",
      "identifier",
      "leftParen",
      "identifier",
      "comma",
      "number",
      "rightParen",
      "eof",
    ],
  );

  const parsed = expectOk(parseFormulaSource("=1 + 2 * -A1"));
  assert.equal(canonicalizeFormulaSource(parsed), "=1+2*-A1");
  assert.equal(
    canonicalizeFormulaSource(expectOk(parseFormulaSource("=avg(a1:b2, PI)"))),
    "=AVG(A1:B2,PI)",
  );
  assert.equal(
    canonicalizeFormulaSource(expectOk(parseFormulaSource("=((1+2)*3)^2"))),
    "=((1+2)*3)^2",
  );
  expectFormulaError(parseFormulaSource("=SUM(A1,"), "syntax");
  expectFormulaError(parseFormulaSource("=NOT_REGISTERED(1)"), "unknown-name");
  expectFormulaError(
    parseFormulaSource("=".concat("(".repeat(33), "1", ")".repeat(33))),
    "limit",
  );
});

test("A1 references resolve to stable row and column identities", () => {
  const table = createFormulaTable({
    columns: ["col-a", "col-b"],
    rows: ["row-1", "row-2"],
  });
  const ast = expectOk(parseFormulaSource("=A1 + SUM(A1:B2)"));
  const resolved = expectOk(resolveFormulaReferences(ast, table));

  assert.deepEqual(resolved.dependencies, [
    { columnId: "col-a", rowId: "row-1" },
    { columnId: "col-b", rowId: "row-1" },
    { columnId: "col-a", rowId: "row-2" },
    { columnId: "col-b", rowId: "row-2" },
  ]);
  assert.equal(
    canonicalizeFormulaSource(resolved.ast, table),
    "=A1+SUM(A1:B2)",
  );
});

test("evaluator supports functions constants typed errors dependency order cycles and deterministic rand", () => {
  const table = createFormulaTable({
    cells: {
      "row-1:col-a": 2,
      "row-1:col-b": createFormulaValue("=A1 * 5"),
      "row-2:col-a": createFormulaValue("=SUM(A1:B1, ROUND(PI, 2), RAND())"),
      "row-2:col-b": createFormulaValue("=B2"),
      "row-3:col-a": createFormulaValue("=SQRT(-1)"),
      "row-3:col-b": "plain",
    },
    columns: ["col-a", "col-b"],
    rows: ["row-1", "row-2", "row-3"],
  });

  const evaluated = evaluateFormulaTable(table, {
    calculationRevision: "stable",
    rand: ({ calculationRevision, cellId }) =>
      calculationRevision === "stable" && cellId === "row-2:col-a" ? 0.25 : 0,
  });

  assert.deepEqual(evaluated.cells["row-1:col-b"].result, {
    type: "number",
    value: 10,
  });
  assert.deepEqual(evaluated.cells["row-2:col-a"].result, {
    type: "number",
    value: 15.39,
  });
  assert.equal(evaluated.cells["row-2:col-b"].result.type, "error");
  assert.equal(evaluated.cells["row-2:col-b"].result.code, "cycle");
  assert.equal(evaluated.cells["row-3:col-a"].result.type, "error");
  assert.equal(evaluated.cells["row-3:col-a"].result.code, "domain");
});

test("evaluator supports every documented function and constant", () => {
  const table = createFormulaTable({
    cells: {
      "row-1:col-a": 1,
      "row-1:col-b": 2,
      "row-2:col-a": 3,
      "row-2:col-b": 4,
    },
    columns: ["col-a", "col-b"],
    rows: ["row-1", "row-2"],
  });
  const cases = [
    ["=ABS(-2)", 2],
    ["=AVG(A1:B2)", 2.5],
    ["=CEIL(1.2)", 2],
    ["=COUNT(A1:B2)", 4],
    ["=E", Math.E],
    ["=FLOOR(1.8)", 1],
    ["=LOG(E)", 1],
    ["=MAX(A1:B2)", 4],
    ["=MEDIAN(A1:B2)", 2.5],
    ["=MIN(A1:B2)", 1],
    ["=PHI", (1 + Math.sqrt(5)) / 2],
    ["=PI", Math.PI],
    ["=PRODUCT(A1:B2)", 24],
    ["=RAND()", 0.5],
    ["=ROUND(1.234, 2)", 1.23],
    ["=SIGN(-9)", -1],
    ["=SQRT(9)", 3],
    ["=SUM(A1:B2)", 10],
    ["=TAU", Math.PI * 2],
  ];

  for (const [source, expected] of cases) {
    const evaluated = evaluateFormulaTable(
      {
        ...table,
        cells: { ...table.cells, "row-3:col-a": createFormulaValue(source) },
        rows: [...table.rows, "row-3"],
      },
      { rand: () => 0.5 },
    );
    assert.equal(evaluated.cells["row-3:col-a"].result.type, "number", source);
    assert.equal(
      evaluated.cells["row-3:col-a"].result.value.toFixed(8),
      expected.toFixed(8),
      source,
    );
  }
});

test("table operations preserve stable targets and mark deleted references explicitly", () => {
  const table = createFormulaTable({
    cells: {
      "row-1:col-a": 1,
      "row-2:col-a": createFormulaValue("=A1"),
      "row-2:col-b": createFormulaValue("=SUM(A1:B2)"),
    },
    columns: ["col-a", "col-b"],
    rows: ["row-1", "row-2"],
  });
  const moved = applyFormulaTableOperation(table, {
    fromIndex: 0,
    toIndex: 1,
    type: "move-row",
  });

  assert.equal(
    canonicalizeFormulaSource(moved.cells["row-2:col-a"].ast, moved),
    "=A2",
  );

  const deleted = applyFormulaTableOperation(moved, {
    columnId: "col-b",
    type: "delete-column",
  });
  const evaluated = evaluateFormulaTable(deleted);

  assert.equal(evaluated.cells["row-2:col-a"].result.type, "number");
  assert.equal(evaluated.cells["row-2:col-b"].result.type, "error");
  assert.equal(evaluated.cells["row-2:col-b"].result.code, "ref");

  const inserted = applyFormulaTableOperation(table, {
    index: 0,
    rowId: "row-new",
    type: "insert-row",
  });
  assert.equal(
    canonicalizeFormulaSource(inserted.cells["row-2:col-a"].ast, inserted),
    "=A2",
  );

  const sorted = applyFormulaTableOperation(table, {
    rowOrder: ["row-2", "row-1"],
    type: "sort-rows",
  });
  assert.equal(
    canonicalizeFormulaSource(sorted.cells["row-2:col-a"].ast, sorted),
    "=A2",
  );

  const resized = applyFormulaTableOperation(table, {
    columnId: "col-a",
    type: "resize-column",
    width: 180,
  });
  assert.deepEqual(resized.columns, table.columns);

  const converted = applyFormulaTableOperation(table, {
    targetTableId: "table-object-1",
    type: "convert-table",
  });
  assert.equal(
    canonicalizeFormulaSource(converted.cells["row-2:col-a"].ast, converted),
    "=A1",
  );
});

test("formula cells persist source metadata and export explicit result or source modes", () => {
  const table = evaluateFormulaTable(
    createFormulaTable({
      cells: {
        "row-1:col-a": 0.25,
        "row-1:col-b": createFormulaValue("=A1", {
          presentation: { fixedDecimals: 0, type: "percent" },
        }),
      },
      columns: ["col-a", "col-b"],
      rows: ["row-1"],
    }),
  );
  const formula = table.cells["row-1:col-b"];

  assert.equal(formula.type, "formula");
  assert.equal(formula.source, "=A1");
  assert.equal(formula.ast.version, 1);
  assert.deepEqual(formula.dependencies, [
    { columnId: "col-a", rowId: "row-1" },
  ]);
  assert.equal(formula.calculationRevision, "default");
  assert.equal(exportFormulaCell(formula, "csv-result"), "25%");
  assert.equal(exportFormulaCell(formula, "csv-source"), "=A1");
  assert.equal(exportFormulaCell(formula, "markdown-result"), "25%");
  assert.equal(exportFormulaCell(formula, "markdown-source"), "`=A1`");
  assert.equal(
    exportFormulaCell(
      {
        ...formula,
        presentation: {
          currency: "USD",
          fixedDecimals: 2,
          type: "currency",
        },
      },
      "csv-result",
    ),
    "$0.25",
  );
  assert.equal(
    exportFormulaCell(
      {
        ...formula,
        presentation: { color: "green", steps: 1, type: "progress" },
      },
      "markdown-result",
    ),
    "0.25 / 1",
  );
  assert.deepEqual(describeFormulaExportMode("csv-result"), {
    lossiness: [
      "CSV result export preserves displayed formula results and error tokens, but omits editable formula source and dependency metadata.",
    ],
    mode: "csv-result",
  });
  assert.deepEqual(describeFormulaExportMode("markdown-source"), {
    lossiness: [
      "Markdown source export preserves editable formula source as code text, but does not claim interoperable spreadsheet semantics.",
    ],
    mode: "markdown-source",
  });
});
