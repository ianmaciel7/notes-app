import ts from "typescript";

const decisionKinds = new Set([
  ts.SyntaxKind.IfStatement,
  ts.SyntaxKind.ConditionalExpression,
  ts.SyntaxKind.ForStatement,
  ts.SyntaxKind.ForInStatement,
  ts.SyntaxKind.ForOfStatement,
  ts.SyntaxKind.WhileStatement,
  ts.SyntaxKind.DoStatement,
  ts.SyntaxKind.CaseClause,
  ts.SyntaxKind.CatchClause,
]);
const shortCircuitKinds = new Set([
  ts.SyntaxKind.AmpersandAmpersandToken,
  ts.SyntaxKind.BarBarToken,
  ts.SyntaxKind.QuestionQuestionToken,
  ts.SyntaxKind.AmpersandAmpersandEqualsToken,
  ts.SyntaxKind.BarBarEqualsToken,
  ts.SyntaxKind.QuestionQuestionEqualsToken,
]);

function countDecisions(body) {
  let complexity = 1;
  function visit(node) {
    if (ts.isFunctionLike(node)) return;
    if (decisionKinds.has(node.kind)) complexity += 1;
    if (ts.isBinaryExpression(node) && shortCircuitKinds.has(node.operatorToken.kind)) {
      complexity += 1;
    }
    ts.forEachChild(node, visit);
  }
  visit(body);
  return complexity;
}

/** Analyze original TS/TSX locations without a second, undeclared JavaScript parser. */
export function analyzeFunctions(source, file) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  if (sourceFile.parseDiagnostics.length > 0) {
    throw new Error(
      sourceFile.parseDiagnostics
        .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))
        .join("\n"),
    );
  }
  const methods = [];
  function visit(node) {
    if (ts.isFunctionLike(node) && node.body) {
      const name =
        node.name ?? (ts.isVariableDeclaration(node.parent) ? node.parent.name : undefined);
      methods.push({
        name: name?.getText(sourceFile) ?? "<anonymous>",
        lineStart: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
        cyclomatic: countDecisions(node.body),
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return { methods };
}
