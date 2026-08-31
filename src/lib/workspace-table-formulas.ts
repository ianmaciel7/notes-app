type FormulaErrorCode =
  | "cycle"
  | "domain"
  | "limit"
  | "numeric"
  | "ref"
  | "syntax"
  | "unknown-name"
  | "value";

type FormulaError = {
  readonly code: FormulaErrorCode;
  readonly message: string;
};

type FormulaResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: FormulaError };

type FormulaTokenType =
  | "cell"
  | "colon"
  | "comma"
  | "eof"
  | "equals"
  | "identifier"
  | "leftParen"
  | "number"
  | "operator"
  | "rightParen";

type FormulaToken = {
  readonly end: number;
  readonly source: string;
  readonly start: number;
  readonly type: FormulaTokenType;
};

type FormulaAst =
  | {
      readonly type: "binary";
      readonly left: FormulaAst;
      readonly operator: "+" | "-" | "*" | "/" | "^";
      readonly right: FormulaAst;
    }
  | {
      readonly type: "cell";
      readonly columnLabel: string;
      readonly rowNumber: number;
    }
  | {
      readonly type: "cell-ref";
      readonly columnId: string | null;
      readonly columnLabel?: string;
      readonly deleted?: true;
      readonly rowId: string | null;
      readonly rowNumber?: number;
    }
  | { readonly type: "constant"; readonly name: FormulaConstantName }
  | {
      readonly type: "function";
      readonly args: readonly FormulaAst[];
      readonly name: FormulaFunctionName;
    }
  | { readonly type: "number"; readonly value: number }
  | {
      readonly type: "range";
      readonly from: FormulaAst;
      readonly to: FormulaAst;
    }
  | {
      readonly type: "unary";
      readonly operator: "+" | "-";
      readonly value: FormulaAst;
    };

type FormulaDocument = {
  readonly ast: FormulaAst;
  readonly source: string;
  readonly version: 1;
};

type FormulaCellAddress = {
  readonly columnId: string;
  readonly rowId: string;
};

type NumberPresentation =
  | { readonly fixedDecimals?: number; readonly type: "number" }
  | { readonly fixedDecimals?: number; readonly type: "percent" };

type FormulaValue = {
  readonly ast: FormulaDocument;
  readonly calculationRevision: string;
  readonly dependencies: readonly FormulaCellAddress[];
  readonly presentation?: NumberPresentation;
  readonly result: FormulaEvaluationResult;
  readonly source: string;
  readonly type: "formula";
};

type FormulaEvaluationResult =
  | { readonly type: "empty" }
  | {
      readonly type: "error";
      readonly code: FormulaErrorCode;
      readonly message: string;
    }
  | { readonly type: "number"; readonly value: number };

type FormulaTableCell = FormulaValue | number | string | null | undefined;

type FormulaTable = {
  readonly cells: Readonly<Record<string, FormulaTableCell>>;
  readonly columns: readonly string[];
  readonly rows: readonly string[];
};

type FormulaTableOperation =
  | { readonly type: "delete-column"; readonly columnId: string }
  | { readonly type: "delete-row"; readonly rowId: string }
  | {
      readonly type: "insert-column";
      readonly columnId: string;
      readonly index: number;
    }
  | {
      readonly type: "insert-row";
      readonly rowId: string;
      readonly index: number;
    }
  | {
      readonly type: "move-column";
      readonly fromIndex: number;
      readonly toIndex: number;
    }
  | {
      readonly type: "move-row";
      readonly fromIndex: number;
      readonly toIndex: number;
    }
  | {
      readonly type: "resize-column";
      readonly columnId: string;
      readonly width: number;
    }
  | {
      readonly type: "resize-row";
      readonly height: number;
      readonly rowId: string;
    }
  | { readonly type: "sort-rows"; readonly rowOrder: readonly string[] }
  | {
      readonly type: "convert-table";
      readonly targetTableId: string;
    };

type FormulaExportMode =
  | "csv-result"
  | "csv-source"
  | "markdown-result"
  | "markdown-source";

type FormulaExportPolicy = {
  readonly lossiness: readonly string[];
  readonly mode: FormulaExportMode;
};

type EvaluationContext = {
  readonly calculationRevision?: string;
  readonly maxDependencyFanOut?: number;
  readonly maxRangeCells?: number;
  readonly maxRecalculationCells?: number;
  readonly rand?: (context: {
    readonly calculationRevision: string;
    readonly cellId: string;
  }) => number;
};

const constants = {
  E: Math.E,
  PHI: (1 + Math.sqrt(5)) / 2,
  PI: Math.PI,
  TAU: Math.PI * 2,
} as const;

const functionNames = [
  "ABS",
  "AVG",
  "CEIL",
  "COUNT",
  "FLOOR",
  "LOG",
  "MAX",
  "MEDIAN",
  "MIN",
  "PRODUCT",
  "RAND",
  "ROUND",
  "SIGN",
  "SQRT",
  "SUM",
] as const;

type FormulaConstantName = keyof typeof constants;
type FormulaFunctionName = (typeof functionNames)[number];

const functionNameSet = new Set<string>(functionNames);
const constantNameSet = new Set<string>(Object.keys(constants));
const defaultLimits = {
  maxArguments: 64,
  maxDependencyFanOut: 512,
  maxNesting: 32,
  maxRangeCells: 1000,
  maxRecalculationCells: 1000,
  maxTokens: 256,
};

function ok<T>(value: T): FormulaResult<T> {
  return { ok: true, value };
}

function failure(
  code: FormulaErrorCode,
  message: string,
): FormulaResult<never> {
  return { error: { code, message }, ok: false };
}

function cellKey(rowId: string, columnId: string): string {
  return `${rowId}:${columnId}`;
}

function isFormulaCell(value: FormulaTableCell): value is FormulaValue {
  return Boolean(
    value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "formula",
  );
}

function columnLabelToIndex(label: string): number {
  let index = 0;
  for (const char of label.toUpperCase()) {
    index = index * 26 + (char.charCodeAt(0) - 64);
  }
  return index - 1;
}

function columnIndexToLabel(index: number): string {
  let current = index + 1;
  let label = "";
  while (current > 0) {
    const remainder = (current - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    current = Math.floor((current - 1) / 26);
  }
  return label;
}

function a1For(address: FormulaCellAddress, table?: FormulaTable): string {
  if (!table) return `${address.columnId}:${address.rowId}`;
  const columnIndex = table.columns.indexOf(address.columnId);
  const rowIndex = table.rows.indexOf(address.rowId);
  return columnIndex < 0 || rowIndex < 0
    ? "#REF!"
    : `${columnIndexToLabel(columnIndex)}${rowIndex + 1}`;
}

function parseCellSource(source: string): {
  columnLabel: string;
  rowNumber: number;
} {
  const match = /^([A-Za-z]+)([1-9][0-9]*)$/.exec(source);
  if (!match) throw new Error("Invalid cell source");
  return { columnLabel: match[1].toUpperCase(), rowNumber: Number(match[2]) };
}

function tokenizeFormulaSource(source: string): readonly FormulaToken[] {
  const tokens: FormulaToken[] = [];
  let index = 0;
  while (index < source.length) {
    const token = readFormulaToken(source, index);
    if (!token) {
      index += 1;
      continue;
    }
    if (tokens.length >= defaultLimits.maxTokens) {
      return [...tokens, { end: index, source: "", start: index, type: "eof" }];
    }
    tokens.push(token.value);
    index = token.nextIndex;
  }
  tokens.push({
    end: source.length,
    source: "",
    start: source.length,
    type: "eof",
  });
  return tokens;
}

function readFormulaToken(
  source: string,
  index: number,
): { readonly nextIndex: number; readonly value: FormulaToken } | null {
  const char = source[index];
  if (/\s/.test(char)) return null;
  const simpleType = simpleFormulaTokenType(char);
  if (simpleType) return formulaToken(simpleType, char, index, index + 1);
  if ("+-*/^".includes(char))
    return formulaToken("operator", char, index, index + 1);
  if (/\d|\./.test(char)) return readNumericFormulaToken(source, index);
  if (/[A-Za-z]/.test(char)) return readIdentifierFormulaToken(source, index);
  return formulaToken("identifier", char, index, index + 1);
}

function formulaToken(
  type: FormulaTokenType,
  source: string,
  start: number,
  nextIndex: number,
) {
  return { nextIndex, value: { end: nextIndex, source, start, type } };
}

function simpleFormulaTokenType(char: string): FormulaTokenType | null {
  return (
    (
      {
        "(": "leftParen",
        ")": "rightParen",
        ",": "comma",
        ":": "colon",
        "=": "equals",
      } as const
    )[char] ?? null
  );
}

function readNumericFormulaToken(
  source: string,
  index: number,
): { readonly nextIndex: number; readonly value: FormulaToken } {
  const match = /^\d+(?:\.\d+)?|^\.\d+/.exec(source.slice(index));
  if (!match)
    return formulaToken("identifier", source[index], index, index + 1);
  return formulaToken("number", match[0], index, index + match[0].length);
}

function readIdentifierFormulaToken(
  source: string,
  index: number,
): { readonly nextIndex: number; readonly value: FormulaToken } {
  const match = /^[A-Za-z]+[0-9]*/.exec(source.slice(index));
  const value = match?.[0] ?? source[index];
  return formulaToken(
    /^[A-Za-z]+[1-9][0-9]*$/.test(value) ? "cell" : "identifier",
    value,
    index,
    index + value.length,
  );
}

class Parser {
  private index = 0;
  private nesting = 0;
  private readonly tokens: readonly FormulaToken[];

  constructor(tokens: readonly FormulaToken[]) {
    this.tokens = tokens;
  }

  parse(): FormulaResult<FormulaAst> {
    if (this.tokens.length > defaultLimits.maxTokens) {
      return failure("limit", "Formula has too many tokens.");
    }
    if (this.match("equals")) this.advance();
    const expression = this.expression(0);
    if (!expression.ok) return expression;
    if (this.peek().type !== "eof") {
      return failure("syntax", "Formula contains unexpected trailing tokens.");
    }
    return ok(expression.value);
  }

  private expression(minPrecedence: number): FormulaResult<FormulaAst> {
    const first = this.prefix();
    if (!first.ok) return first;
    let left = first.value;
    while (this.peek().type === "operator") {
      const operator = this.peek().source as "+" | "-" | "*" | "/" | "^";
      const precedence = this.precedence(operator);
      if (precedence < minPrecedence) break;
      this.advance();
      const right = this.expression(
        operator === "^" ? precedence : precedence + 1,
      );
      if (!right.ok) return right;
      left = { left, operator, right: right.value, type: "binary" };
    }
    return ok(left);
  }

  private prefix(): FormulaResult<FormulaAst> {
    const token = this.peek();
    const unary = this.unaryPrefix(token);
    if (unary) return unary;
    const number = this.numberPrefix(token);
    if (number) return number;
    const cell = this.cellPrefix(token);
    if (cell) return cell;
    if (token.type === "identifier") return this.identifier();
    return this.groupedPrefix();
  }

  private unaryPrefix(token: FormulaToken): FormulaResult<FormulaAst> | null {
    if (token.type !== "operator") return null;
    if (token.source !== "+" && token.source !== "-") return null;
    this.advance();
    const value = this.expression(4);
    return value.ok
      ? ok({
          operator: token.source as "+" | "-",
          type: "unary",
          value: value.value,
        })
      : value;
  }

  private numberPrefix(token: FormulaToken): FormulaResult<FormulaAst> | null {
    if (token.type !== "number") return null;
    this.advance();
    const value = Number(token.source);
    return Number.isFinite(value)
      ? ok({ type: "number", value })
      : failure("numeric", "Number literal is invalid.");
  }

  private cellPrefix(token: FormulaToken): FormulaResult<FormulaAst> | null {
    if (token.type !== "cell") return null;
    this.advance();
    const ast: FormulaAst = { type: "cell", ...parseCellSource(token.source) };
    if (!this.match("colon")) return ok(ast);
    return this.rangePrefix(ast);
  }

  private rangePrefix(from: FormulaAst): FormulaResult<FormulaAst> {
    this.advance();
    const to = this.peek();
    if (to.type !== "cell")
      return failure("syntax", "Range must end with a cell reference.");
    this.advance();
    return ok({
      from,
      to: { type: "cell", ...parseCellSource(to.source) },
      type: "range",
    });
  }

  private groupedPrefix(): FormulaResult<FormulaAst> {
    if (!this.match("leftParen")) {
      return failure("syntax", "Formula contains an unexpected token.");
    }
    this.advance();
    this.nesting += 1;
    if (this.nesting > defaultLimits.maxNesting)
      return failure("limit", "Formula is nested too deeply.");
    const value = this.expression(0);
    this.nesting -= 1;
    if (!value.ok) return value;
    if (!this.match("rightParen"))
      return failure("syntax", "Formula is missing a closing parenthesis.");
    this.advance();
    return value;
  }

  private identifier(): FormulaResult<FormulaAst> {
    const name = this.advance().source.toUpperCase();
    if (this.match("leftParen")) {
      if (!functionNameSet.has(name))
        return failure("unknown-name", `Unsupported function: ${name}.`);
      this.advance();
      const args: FormulaAst[] = [];
      if (!this.match("rightParen")) {
        while (true) {
          if (args.length >= defaultLimits.maxArguments)
            return failure("limit", "Formula has too many arguments.");
          const arg = this.expression(0);
          if (!arg.ok) return arg;
          args.push(arg.value);
          if (!this.match("comma")) break;
          this.advance();
        }
      }
      if (!this.match("rightParen"))
        return failure(
          "syntax",
          "Function call is missing a closing parenthesis.",
        );
      this.advance();
      return ok({ args, name: name as FormulaFunctionName, type: "function" });
    }
    return constantNameSet.has(name)
      ? ok({ name: name as FormulaConstantName, type: "constant" })
      : failure("unknown-name", `Unsupported identifier: ${name}.`);
  }

  private precedence(operator: string): number {
    if (operator === "+" || operator === "-") return 1;
    if (operator === "*" || operator === "/") return 2;
    if (operator === "^") return 3;
    return 0;
  }

  private match(type: FormulaTokenType): boolean {
    return this.peek().type === type;
  }

  private peek(): FormulaToken {
    return (
      this.tokens[this.index] ?? {
        end: 0,
        source: "",
        start: 0,
        type: "eof",
      }
    );
  }

  private advance(): FormulaToken {
    const token = this.peek();
    this.index += 1;
    return token;
  }
}

function parseFormulaSource(source: string): FormulaResult<FormulaDocument> {
  const tokens = tokenizeFormulaSource(source);
  if (tokens.length > defaultLimits.maxTokens) {
    return failure("limit", "Formula has too many tokens.");
  }
  const parsed = new Parser(tokens).parse();
  return parsed.ok
    ? ok({ ast: parsed.value, source: source.trim(), version: 1 })
    : parsed;
}

function needsParens(
  parent: FormulaAst,
  child: FormulaAst,
  side: "left" | "right",
): boolean {
  if (parent.type !== "binary" || child.type !== "binary") return false;
  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };
  const parentPrecedence = precedence[parent.operator];
  const childPrecedence = precedence[child.operator];
  return (
    childPrecedence < parentPrecedence ||
    (side === "right" && childPrecedence === parentPrecedence)
  );
}

function serializeAst(
  ast: FormulaAst,
  table?: FormulaTable,
  parent?: FormulaAst,
  side: "left" | "right" = "left",
): string {
  const serialized = serializeAstNode(ast, table);
  return parent && needsParens(parent, ast, side)
    ? `(${serialized})`
    : serialized;
}

function serializeAstNode(ast: FormulaAst, table?: FormulaTable): string {
  switch (ast.type) {
    case "binary":
      return `${serializeAst(ast.left, table, ast, "left")}${ast.operator}${serializeAst(ast.right, table, ast, "right")}`;
    case "cell":
      return `${ast.columnLabel}${ast.rowNumber}`;
    case "cell-ref":
      return serializeCellRefAst(ast, table);
    case "constant":
      return ast.name;
    case "function":
      return `${ast.name}(${ast.args.map((arg) => serializeAst(arg, table)).join(",")})`;
    case "number":
      return String(ast.value);
    case "range":
      return `${serializeAst(ast.from, table)}:${serializeAst(ast.to, table)}`;
    case "unary":
      return `${ast.operator}${serializeAst(ast.value, table, ast)}`;
  }
}

function serializeCellRefAst(
  ast: Extract<FormulaAst, { type: "cell-ref" }>,
  table?: FormulaTable,
): string {
  return ast.deleted || !ast.rowId || !ast.columnId
    ? "#REF!"
    : a1For({ columnId: ast.columnId, rowId: ast.rowId }, table);
}

function canonicalizeFormulaSource(
  document: FormulaDocument,
  table?: FormulaTable,
): string {
  return `=${serializeAst(document.ast, table)}`;
}

function createFormulaTable(options: {
  readonly cells?: Readonly<Record<string, FormulaTableCell>>;
  readonly columns: readonly string[];
  readonly rows: readonly string[];
}): FormulaTable {
  return {
    cells: options.cells ?? {},
    columns: options.columns,
    rows: options.rows,
  };
}

function resolveAddress(
  ast: FormulaAst,
  table: FormulaTable,
): FormulaResult<FormulaCellAddress> {
  if (ast.type === "cell-ref") {
    return ast.rowId && ast.columnId && !ast.deleted
      ? ok({ columnId: ast.columnId, rowId: ast.rowId })
      : failure("ref", "Formula references a deleted cell.");
  }
  if (ast.type !== "cell")
    return failure("syntax", "Expected a cell reference.");
  const columnId = table.columns[columnLabelToIndex(ast.columnLabel)];
  const rowId = table.rows[ast.rowNumber - 1];
  return columnId && rowId
    ? ok({ columnId, rowId })
    : failure("ref", "Formula references a missing cell.");
}

function expandRange(
  from: FormulaCellAddress,
  to: FormulaCellAddress,
  table: FormulaTable,
  maxRangeCells = defaultLimits.maxRangeCells,
): FormulaResult<readonly FormulaCellAddress[]> {
  const fromRow = table.rows.indexOf(from.rowId);
  const toRow = table.rows.indexOf(to.rowId);
  const fromColumn = table.columns.indexOf(from.columnId);
  const toColumn = table.columns.indexOf(to.columnId);
  if ([fromRow, toRow, fromColumn, toColumn].some((index) => index < 0)) {
    return failure("ref", "Formula range references a missing row or column.");
  }
  const rowStart = Math.min(fromRow, toRow);
  const rowEnd = Math.max(fromRow, toRow);
  const columnStart = Math.min(fromColumn, toColumn);
  const columnEnd = Math.max(fromColumn, toColumn);
  const cells: FormulaCellAddress[] = [];
  for (let row = rowStart; row <= rowEnd; row += 1) {
    for (let column = columnStart; column <= columnEnd; column += 1) {
      if (cells.length >= maxRangeCells)
        return failure("limit", "Formula range is too large.");
      cells.push({ columnId: table.columns[column], rowId: table.rows[row] });
    }
  }
  return ok(cells);
}

function resolveAstReferences(
  ast: FormulaAst,
  table: FormulaTable,
): FormulaResult<FormulaAst> {
  switch (ast.type) {
    case "binary":
      return resolveBinaryAst(ast, table);
    case "cell":
      return resolveCellAst(ast, table);
    case "function":
      return resolveFunctionAst(ast, table);
    case "range":
      return resolveRangeAst(ast, table);
    case "unary":
      return resolveUnaryAst(ast, table);
    default:
      return ok(ast);
  }
}

function resolveCellAst(
  ast: Extract<FormulaAst, { type: "cell" }>,
  table: FormulaTable,
): FormulaResult<FormulaAst> {
  const address = resolveAddress(ast, table);
  return address.ok
    ? ok({
        columnId: address.value.columnId,
        rowId: address.value.rowId,
        type: "cell-ref",
      })
    : address;
}

function resolveRangeAst(
  ast: Extract<FormulaAst, { type: "range" }>,
  table: FormulaTable,
): FormulaResult<FormulaAst> {
  const from = resolveAstReferences(ast.from, table);
  if (!from.ok) return from;
  const to = resolveAstReferences(ast.to, table);
  return to.ok ? ok({ from: from.value, to: to.value, type: "range" }) : to;
}

function resolveBinaryAst(
  ast: Extract<FormulaAst, { type: "binary" }>,
  table: FormulaTable,
): FormulaResult<FormulaAst> {
  const left = resolveAstReferences(ast.left, table);
  if (!left.ok) return left;
  const right = resolveAstReferences(ast.right, table);
  return right.ok
    ? ok({ ...ast, left: left.value, right: right.value })
    : right;
}

function resolveUnaryAst(
  ast: Extract<FormulaAst, { type: "unary" }>,
  table: FormulaTable,
): FormulaResult<FormulaAst> {
  const value = resolveAstReferences(ast.value, table);
  return value.ok ? ok({ ...ast, value: value.value }) : value;
}

function resolveFunctionAst(
  ast: Extract<FormulaAst, { type: "function" }>,
  table: FormulaTable,
): FormulaResult<FormulaAst> {
  const args: FormulaAst[] = [];
  for (const arg of ast.args) {
    const resolved = resolveAstReferences(arg, table);
    if (!resolved.ok) return resolved;
    args.push(resolved.value);
  }
  return ok({ ...ast, args });
}

function collectDependencies(
  ast: FormulaAst,
  table: FormulaTable,
  maxRangeCells = defaultLimits.maxRangeCells,
): FormulaResult<readonly FormulaCellAddress[]> {
  const dependencies = new Map<string, FormulaCellAddress>();
  const visit = (node: FormulaAst): FormulaResult<void> => {
    switch (node.type) {
      case "binary":
        return visitBinaryDependencies(node, visit);
      case "cell-ref":
        return collectCellDependency(node, dependencies);
      case "function":
        return visitFunctionDependencies(node, visit);
      case "range":
        return collectRangeDependencies(
          node,
          table,
          maxRangeCells,
          dependencies,
        );
      case "unary":
        return visit(node.value);
      default:
        return ok(undefined);
    }
  };
  const result = visit(ast);
  if (!result.ok) return result;
  if (dependencies.size > defaultLimits.maxDependencyFanOut) {
    return failure("limit", "Formula has too many dependencies.");
  }
  return ok(Array.from(dependencies.values()));
}

function collectCellDependency(
  node: Extract<FormulaAst, { type: "cell-ref" }>,
  dependencies: Map<string, FormulaCellAddress>,
): FormulaResult<void> {
  if (!node.rowId || !node.columnId || node.deleted) {
    return failure("ref", "Formula references a deleted cell.");
  }
  dependencies.set(cellKey(node.rowId, node.columnId), {
    columnId: node.columnId,
    rowId: node.rowId,
  });
  return ok(undefined);
}

function collectRangeDependencies(
  node: Extract<FormulaAst, { type: "range" }>,
  table: FormulaTable,
  maxRangeCells: number,
  dependencies: Map<string, FormulaCellAddress>,
): FormulaResult<void> {
  const from = resolveAddress(node.from, table);
  if (!from.ok) return from;
  const to = resolveAddress(node.to, table);
  if (!to.ok) return to;
  const cells = expandRange(from.value, to.value, table, maxRangeCells);
  if (!cells.ok) return cells;
  for (const cell of cells.value) {
    dependencies.set(cellKey(cell.rowId, cell.columnId), cell);
  }
  return ok(undefined);
}

function visitBinaryDependencies(
  node: Extract<FormulaAst, { type: "binary" }>,
  visit: (node: FormulaAst) => FormulaResult<void>,
): FormulaResult<void> {
  const left = visit(node.left);
  return left.ok ? visit(node.right) : left;
}

function visitFunctionDependencies(
  node: Extract<FormulaAst, { type: "function" }>,
  visit: (node: FormulaAst) => FormulaResult<void>,
): FormulaResult<void> {
  for (const arg of node.args) {
    const result = visit(arg);
    if (!result.ok) return result;
  }
  return ok(undefined);
}

function resolveFormulaReferences(
  document: FormulaDocument,
  table: FormulaTable,
): FormulaResult<{
  readonly ast: FormulaDocument;
  readonly dependencies: readonly FormulaCellAddress[];
}> {
  const ast = resolveAstReferences(document.ast, table);
  if (!ast.ok) return ast;
  const dependencies = collectDependencies(ast.value, table);
  return dependencies.ok
    ? ok({
        ast: { ast: ast.value, source: document.source, version: 1 },
        dependencies: dependencies.value,
      })
    : dependencies;
}

function createFormulaValue(
  source: string,
  options: { readonly presentation?: NumberPresentation } = {},
): FormulaValue {
  const parsed = parseFormulaSource(source);
  const ast: FormulaDocument = parsed.ok
    ? parsed.value
    : { ast: { type: "number", value: 0 }, source, version: 1 };
  return {
    ast,
    calculationRevision: "unresolved",
    dependencies: [],
    presentation: options.presentation,
    result: parsed.ok
      ? { type: "empty" }
      : {
          code: parsed.error.code,
          message: parsed.error.message,
          type: "error",
        },
    source,
    type: "formula",
  };
}

function errorResult(
  code: FormulaErrorCode,
  message: string,
): FormulaEvaluationResult {
  return { code, message, type: "error" };
}

function numericResult(value: number): FormulaEvaluationResult {
  return Number.isFinite(value)
    ? { type: "number", value }
    : errorResult("numeric", "Formula produced a non-finite number.");
}

function evaluateFormulaTable(
  table: FormulaTable,
  context: EvaluationContext = {},
): FormulaTable {
  const calculationRevision = context.calculationRevision ?? "default";
  const maxRecalculationCells =
    context.maxRecalculationCells ?? defaultLimits.maxRecalculationCells;
  const nextCells: Record<string, FormulaTableCell> = { ...table.cells };
  const visiting = new Set<string>();
  const visited = new Set<string>();
  let recalculated = 0;
  const nextTable: FormulaTable = { ...table, cells: nextCells };

  const evaluateCell = (id: string): FormulaEvaluationResult => {
    if (visited.has(id)) {
      const existing = nextCells[id];
      return isFormulaCell(existing)
        ? existing.result
        : scalarCellResult(existing);
    }
    if (visiting.has(id)) {
      return errorResult("cycle", "Formula cycle detected.");
    }
    if (recalculated >= maxRecalculationCells) {
      return errorResult("limit", "Formula recalculation limit was reached.");
    }
    recalculated += 1;
    const cell = nextCells[id];
    if (!isFormulaCell(cell)) return scalarCellResult(cell);
    visiting.add(id);
    const resolved = resolveFormulaReferences(cell.ast, nextTable);
    const result = resolved.ok
      ? evaluateAst(resolved.value.ast.ast, nextTable, evaluateCell, {
          calculationRevision,
          cellId: id,
          rand: context.rand,
        })
      : errorResult(resolved.error.code, resolved.error.message);
    visiting.delete(id);
    visited.add(id);
    nextCells[id] = {
      ...cell,
      ast: resolved.ok ? resolved.value.ast : cell.ast,
      calculationRevision,
      dependencies: resolved.ok
        ? resolved.value.dependencies
        : cell.dependencies,
      result,
    };
    return result;
  };

  for (const [id, cell] of Object.entries(table.cells)) {
    if (isFormulaCell(cell)) evaluateCell(id);
  }
  return nextTable;
}

function scalarCellResult(value: FormulaTableCell): FormulaEvaluationResult {
  if (typeof value === "number") return numericResult(value);
  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    Number.isFinite(Number(value))
  ) {
    return numericResult(Number(value));
  }
  return value == null || value === ""
    ? { type: "empty" }
    : errorResult("value", "Formula dependency is not numeric.");
}

function evaluateAst(
  ast: FormulaAst,
  table: FormulaTable,
  evaluateCell: (id: string) => FormulaEvaluationResult,
  context: {
    readonly calculationRevision: string;
    readonly cellId: string;
    readonly rand?: EvaluationContext["rand"];
  },
): FormulaEvaluationResult {
  switch (ast.type) {
    case "binary":
      return evaluateBinaryAst(ast, table, evaluateCell, context);
    case "cell":
      return evaluateCellAst(ast, table, evaluateCell);
    case "cell-ref":
      return evaluateCellRefAst(ast, evaluateCell);
    case "constant":
      return numericResult(constants[ast.name]);
    case "function":
      return evaluateFunction(ast, table, evaluateCell, context);
    case "number":
      return numericResult(ast.value);
    case "range":
      return errorResult("value", "A range must be used inside a function.");
    case "unary":
      return evaluateUnaryAst(ast, table, evaluateCell, context);
  }
}

function evaluateCellRefAst(
  ast: Extract<FormulaAst, { type: "cell-ref" }>,
  evaluateCell: (id: string) => FormulaEvaluationResult,
): FormulaEvaluationResult {
  if (!ast.rowId || !ast.columnId || ast.deleted) {
    return errorResult("ref", "Formula references a deleted cell.");
  }
  return evaluateCell(cellKey(ast.rowId, ast.columnId));
}

function evaluateCellAst(
  ast: Extract<FormulaAst, { type: "cell" }>,
  table: FormulaTable,
  evaluateCell: (id: string) => FormulaEvaluationResult,
): FormulaEvaluationResult {
  const address = resolveAddress(ast, table);
  return address.ok
    ? evaluateCell(cellKey(address.value.rowId, address.value.columnId))
    : errorResult(address.error.code, address.error.message);
}

function evaluateUnaryAst(
  ast: Extract<FormulaAst, { type: "unary" }>,
  table: FormulaTable,
  evaluateCell: (id: string) => FormulaEvaluationResult,
  context: {
    readonly calculationRevision: string;
    readonly cellId: string;
    readonly rand?: EvaluationContext["rand"];
  },
): FormulaEvaluationResult {
  const value = evaluateAst(ast.value, table, evaluateCell, context);
  return value.type === "number"
    ? numericResult(ast.operator === "-" ? -value.value : value.value)
    : value;
}

function evaluateBinaryAst(
  ast: Extract<FormulaAst, { type: "binary" }>,
  table: FormulaTable,
  evaluateCell: (id: string) => FormulaEvaluationResult,
  context: {
    readonly calculationRevision: string;
    readonly cellId: string;
    readonly rand?: EvaluationContext["rand"];
  },
): FormulaEvaluationResult {
  const left = evaluateAst(ast.left, table, evaluateCell, context);
  if (left.type === "error") return left;
  const right = evaluateAst(ast.right, table, evaluateCell, context);
  if (right.type === "error") return right;
  if (left.type !== "number" || right.type !== "number") {
    return errorResult("value", "Formula operands must be numeric.");
  }
  if (ast.operator === "/" && right.value === 0) {
    return errorResult("numeric", "Formula divides by zero.");
  }
  return numericResult(
    {
      "*": left.value * right.value,
      "+": left.value + right.value,
      "-": left.value - right.value,
      "/": left.value / right.value,
      "^": left.value ** right.value,
    }[ast.operator],
  );
}

function valuesForArg(
  ast: FormulaAst,
  table: FormulaTable,
  evaluateCell: (id: string) => FormulaEvaluationResult,
  context: {
    readonly calculationRevision: string;
    readonly cellId: string;
    readonly rand?: EvaluationContext["rand"];
  },
): FormulaEvaluationResult | readonly number[] {
  if (ast.type === "range") {
    const from = resolveAddress(ast.from, table);
    if (!from.ok) return errorResult(from.error.code, from.error.message);
    const to = resolveAddress(ast.to, table);
    if (!to.ok) return errorResult(to.error.code, to.error.message);
    const range = expandRange(from.value, to.value, table);
    if (!range.ok) return errorResult(range.error.code, range.error.message);
    const values: number[] = [];
    for (const address of range.value) {
      const value = evaluateCell(cellKey(address.rowId, address.columnId));
      if (value.type === "error") return value;
      if (value.type === "number") values.push(value.value);
    }
    return values;
  }
  const value = evaluateAst(ast, table, evaluateCell, context);
  return value.type === "number" ? [value.value] : value;
}

function evaluateFunction(
  ast: Extract<FormulaAst, { type: "function" }>,
  table: FormulaTable,
  evaluateCell: (id: string) => FormulaEvaluationResult,
  context: {
    readonly calculationRevision: string;
    readonly cellId: string;
    readonly rand?: EvaluationContext["rand"];
  },
): FormulaEvaluationResult {
  if (ast.name === "RAND") {
    return evaluateRandFunction(context);
  }
  const values: number[] = [];
  for (const arg of ast.args) {
    const resolved = valuesForArg(arg, table, evaluateCell, context);
    if ("type" in resolved) return resolved;
    values.push(...resolved);
  }
  if (requiresNumericValues(ast.name) && values.length === 0) {
    return errorResult(
      "value",
      `${ast.name} requires at least one numeric value.`,
    );
  }
  return evaluateNumericFunction(ast.name, values);
}

function evaluateRandFunction(context: {
  readonly calculationRevision: string;
  readonly cellId: string;
  readonly rand?: EvaluationContext["rand"];
}): FormulaEvaluationResult {
  return numericResult(
    context.rand?.({
      calculationRevision: context.calculationRevision,
      cellId: context.cellId,
    }) ?? deterministicRand(`${context.calculationRevision}:${context.cellId}`),
  );
}

function requiresNumericValues(name: FormulaFunctionName): boolean {
  return (
    name === "AVG" || name === "MAX" || name === "MEDIAN" || name === "MIN"
  );
}

function evaluateNumericFunction(
  name: FormulaFunctionName,
  values: readonly number[],
): FormulaEvaluationResult {
  const evaluator = numericFunctionEvaluators[name];
  return evaluator
    ? evaluator(values)
    : errorResult("value", `${name} cannot evaluate this value.`);
}

const numericFunctionEvaluators: Partial<
  Record<
    FormulaFunctionName,
    (values: readonly number[]) => FormulaEvaluationResult
  >
> = {
  ABS: (values) => unaryFunction(values, Math.abs, "ABS"),
  AVG: (values) =>
    numericResult(
      values.reduce((total, value) => total + value, 0) / values.length,
    ),
  CEIL: (values) => unaryFunction(values, Math.ceil, "CEIL"),
  COUNT: (values) => numericResult(values.length),
  FLOOR: (values) => unaryFunction(values, Math.floor, "FLOOR"),
  LOG: (values) =>
    unaryFunction(
      values,
      (value) => (value > 0 ? Math.log(value) : Number.NaN),
      "LOG",
      "domain",
    ),
  MAX: (values) => numericResult(Math.max(...values)),
  MEDIAN: (values) => numericResult(median(values)),
  MIN: (values) => numericResult(Math.min(...values)),
  PRODUCT: (values) =>
    numericResult(values.reduce((total, value) => total * value, 1)),
  ROUND: (values) => roundFunction(values),
  SIGN: (values) => unaryFunction(values, Math.sign, "SIGN"),
  SQRT: (values) =>
    unaryFunction(
      values,
      (value) => (value >= 0 ? Math.sqrt(value) : Number.NaN),
      "SQRT",
      "domain",
    ),
  SUM: (values) =>
    numericResult(values.reduce((total, value) => total + value, 0)),
};

function median(values: readonly number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted.length % 2
    ? sorted[(sorted.length - 1) / 2]
    : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
}

function unaryFunction(
  values: readonly number[],
  fn: (value: number) => number,
  name: string,
  errorCode: FormulaErrorCode = "value",
): FormulaEvaluationResult {
  if (values.length !== 1)
    return errorResult("value", `${name} requires one argument.`);
  const value = fn(values[0]);
  return Number.isFinite(value)
    ? numericResult(value)
    : errorResult(errorCode, `${name} cannot evaluate this value.`);
}

function roundFunction(values: readonly number[]): FormulaEvaluationResult {
  if (values.length < 1 || values.length > 2) {
    return errorResult("value", "ROUND requires one or two arguments.");
  }
  const decimals = values[1] ?? 0;
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 12) {
    return errorResult("limit", "ROUND decimal places are out of range.");
  }
  const factor = 10 ** decimals;
  return numericResult(Math.round(values[0] * factor) / factor);
}

function deterministicRand(seed: string): number {
  let hash = 0x811c9dc5;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) / 0x100000000;
}

function mapAstReferences(
  ast: FormulaAst,
  deletedRows: ReadonlySet<string>,
  deletedColumns: ReadonlySet<string>,
): FormulaAst {
  if (ast.type === "cell-ref") {
    return !ast.rowId ||
      !ast.columnId ||
      deletedRows.has(ast.rowId) ||
      deletedColumns.has(ast.columnId)
      ? {
          ...ast,
          columnId: ast.columnId ?? null,
          deleted: true,
          rowId: ast.rowId ?? null,
        }
      : ast;
  }
  if (ast.type === "range") {
    return {
      from: mapAstReferences(ast.from, deletedRows, deletedColumns),
      to: mapAstReferences(ast.to, deletedRows, deletedColumns),
      type: "range",
    };
  }
  if (ast.type === "binary") {
    return {
      ...ast,
      left: mapAstReferences(ast.left, deletedRows, deletedColumns),
      right: mapAstReferences(ast.right, deletedRows, deletedColumns),
    };
  }
  if (ast.type === "unary")
    return {
      ...ast,
      value: mapAstReferences(ast.value, deletedRows, deletedColumns),
    };
  if (ast.type === "function") {
    return {
      ...ast,
      args: ast.args.map((arg) =>
        mapAstReferences(arg, deletedRows, deletedColumns),
      ),
    };
  }
  return ast;
}

function applyFormulaTableOperation(
  table: FormulaTable,
  operation: FormulaTableOperation,
): FormulaTable {
  const rows = [...table.rows];
  const columns = [...table.columns];
  const deletedRows = new Set<string>();
  const deletedColumns = new Set<string>();
  if (operation.type === "move-row") {
    const [row] = rows.splice(operation.fromIndex, 1);
    rows.splice(operation.toIndex, 0, row);
  } else if (operation.type === "move-column") {
    const [column] = columns.splice(operation.fromIndex, 1);
    columns.splice(operation.toIndex, 0, column);
  } else if (operation.type === "insert-row")
    rows.splice(operation.index, 0, operation.rowId);
  else if (operation.type === "insert-column")
    columns.splice(operation.index, 0, operation.columnId);
  else if (operation.type === "sort-rows") {
    const rowSet = new Set(rows);
    const nextRows = operation.rowOrder.filter((rowId) => rowSet.has(rowId));
    nextRows.push(...rows.filter((rowId) => !nextRows.includes(rowId)));
    rows.splice(0, rows.length, ...nextRows);
  } else if (
    operation.type === "resize-column" ||
    operation.type === "resize-row" ||
    operation.type === "convert-table"
  ) {
    // Presentation-only resize and conversion preserve formula reference IDs.
  } else if (operation.type === "delete-row") {
    deletedRows.add(operation.rowId);
    const index = rows.indexOf(operation.rowId);
    if (index >= 0) rows.splice(index, 1);
  } else {
    deletedColumns.add(operation.columnId);
    const index = columns.indexOf(operation.columnId);
    if (index >= 0) columns.splice(index, 1);
  }
  const nextBase: FormulaTable = { cells: table.cells, columns, rows };
  const cells = Object.fromEntries(
    Object.entries(table.cells).map(([id, cell]) => {
      if (!isFormulaCell(cell)) return [id, cell];
      const resolved = resolveAstReferences(cell.ast.ast, table);
      const ast = mapAstReferences(
        resolved.ok ? resolved.value : cell.ast.ast,
        deletedRows,
        deletedColumns,
      );
      const doc = {
        ast,
        source: canonicalizeFormulaSource({ ...cell.ast, ast }, nextBase),
        version: 1 as const,
      };
      const dependencies = collectDependencies(ast, nextBase);
      return [
        id,
        {
          ...cell,
          ast: doc,
          dependencies: dependencies.ok
            ? dependencies.value
            : cell.dependencies,
          source: doc.source,
        },
      ];
    }),
  );
  return { cells, columns, rows };
}

function formatNumber(
  value: number,
  presentation?: NumberPresentation,
): string {
  if (presentation?.type === "percent") {
    const decimals = presentation.fixedDecimals ?? 0;
    return `${(value * 100).toFixed(decimals)}%`;
  }
  if (presentation?.fixedDecimals !== undefined)
    return value.toFixed(presentation.fixedDecimals);
  return String(value);
}

function exportFormulaCell(
  cell: FormulaTableCell,
  mode: FormulaExportMode,
): string {
  if (!isFormulaCell(cell)) return cell == null ? "" : String(cell);
  if (mode === "csv-source") return cell.source;
  if (mode === "markdown-source")
    return `\`${cell.source.replace(/`/g, "\\`")}\``;
  if (cell.result.type === "number")
    return formatNumber(cell.result.value, cell.presentation);
  if (cell.result.type === "error") return errorDisplay(cell.result.code);
  return "";
}

function describeFormulaExportMode(
  mode: FormulaExportMode,
): FormulaExportPolicy {
  const lossiness: Readonly<Record<FormulaExportMode, readonly string[]>> = {
    "csv-result": [
      "CSV result export preserves displayed formula results and error tokens, but omits editable formula source and dependency metadata.",
    ],
    "csv-source": [
      "CSV source export preserves editable formula source, but omits computed result, dependency metadata, and calculation revision.",
    ],
    "markdown-result": [
      "Markdown result export preserves displayed formula results and error tokens, but omits editable formula source and dependency metadata.",
    ],
    "markdown-source": [
      "Markdown source export preserves editable formula source as code text, but does not claim interoperable spreadsheet semantics.",
    ],
  };
  return { lossiness: lossiness[mode], mode };
}

function errorDisplay(code: FormulaErrorCode): string {
  if (code === "cycle") return "#CYCLE!";
  if (code === "ref") return "#REF!";
  if (code === "syntax") return "#ERROR!";
  return "#VALUE!";
}

export type {
  EvaluationContext,
  FormulaAst,
  FormulaCellAddress,
  FormulaDocument,
  FormulaError,
  FormulaErrorCode,
  FormulaEvaluationResult,
  FormulaExportMode,
  FormulaExportPolicy,
  FormulaTable,
  FormulaTableCell,
  FormulaTableOperation,
  FormulaToken,
  FormulaTokenType,
  FormulaValue,
  NumberPresentation,
};
export {
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
};
