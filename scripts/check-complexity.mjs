import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const maxCyclomaticComplexity = 10;
const allowedExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
const failures = [];

function collectSourceFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(entryPath));
      continue;
    }

    if (entry.isFile() && allowedExtensions.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

function functionName(node, sourceFile) {
  if (node.name?.getText(sourceFile)) {
    return node.name.getText(sourceFile);
  }

  if (ts.isVariableDeclaration(node.parent) && node.parent.name) {
    return node.parent.name.getText(sourceFile);
  }

  if (ts.isPropertyAssignment(node.parent) && node.parent.name) {
    return node.parent.name.getText(sourceFile);
  }

  if (ts.isExportAssignment(node.parent)) {
    return "default export";
  }

  return "<anonymous>";
}

function isFunctionLike(node) {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node) ||
    ts.isConstructorDeclaration(node)
  );
}

function branchWeight(node) {
  if (
    ts.isIfStatement(node) ||
    ts.isConditionalExpression(node) ||
    ts.isForStatement(node) ||
    ts.isForInStatement(node) ||
    ts.isForOfStatement(node) ||
    ts.isWhileStatement(node) ||
    ts.isDoStatement(node) ||
    ts.isCatchClause(node)
  ) {
    return 1;
  }

  if (ts.isCaseClause(node)) {
    return 1;
  }

  if (
    ts.isBinaryExpression(node) &&
    ["&&", "||", "??"].includes(node.operatorToken.getText())
  ) {
    return 1;
  }

  return 0;
}

function cyclomaticComplexity(functionNode) {
  let complexity = 1;

  function visit(node) {
    if (node !== functionNode && isFunctionLike(node)) {
      return;
    }

    complexity += branchWeight(node);
    ts.forEachChild(node, visit);
  }

  visit(functionNode);
  return complexity;
}

for (const filePath of collectSourceFiles(sourceRoot)) {
  const sourceText = readFileSync(filePath, "utf8");
  if (sourceText.length === 0) {
    continue;
  }

  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") || filePath.endsWith(".jsx")
      ? ts.ScriptKind.TSX
      : ts.ScriptKind.TS,
  );

  function visit(node) {
    if (isFunctionLike(node)) {
      const complexity = cyclomaticComplexity(node);
      if (complexity > maxCyclomaticComplexity) {
        const position = sourceFile.getLineAndCharacterOfPosition(
          node.getStart(sourceFile),
        );
        failures.push({
          file: path.relative(root, filePath),
          line: position.line + 1,
          name: functionName(node, sourceFile),
          complexity,
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(
      `Cyclomatic complexity check failed: ${failure.file}:${failure.line} ${failure.name} has complexity ${failure.complexity}; max is ${maxCyclomaticComplexity}.`,
    );
  }
  process.exit(1);
}

console.log(
  `Cyclomatic complexity check passed. Max allowed per function: ${maxCyclomaticComplexity}.`,
);
