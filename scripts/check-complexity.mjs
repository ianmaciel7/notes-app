import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const maxCyclomaticComplexity = 12;
const allowedExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
const ignoredDirectories = new Set(["components/ui"]);
const failures = [];

function isIgnored(filePath) {
	const relative = path.relative(sourceRoot, filePath).replaceAll("\\", "/");
	return [...ignoredDirectories].some((directory) => relative === directory || relative.startsWith(`${directory}/`));
}

function collectSourceFiles(directory) {
	if (!existsSync(directory)) return [];
	const files = [];
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			if (!isIgnored(entryPath)) files.push(...collectSourceFiles(entryPath));
			continue;
		}
		if (entry.isFile() && allowedExtensions.has(path.extname(entry.name)) && !isIgnored(entryPath)) {
			files.push(entryPath);
		}
	}
	return files;
}

function isFunctionLike(node) {
	return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) || ts.isMethodDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node) || ts.isConstructorDeclaration(node);
}

function branchWeight(node) {
	if (ts.isIfStatement(node) || ts.isConditionalExpression(node) || ts.isForStatement(node) || ts.isForInStatement(node) || ts.isForOfStatement(node) || ts.isWhileStatement(node) || ts.isDoStatement(node) || ts.isCatchClause(node) || ts.isCaseClause(node)) return 1;
	if (ts.isBinaryExpression(node) && ["&&", "||", "??"].includes(node.operatorToken.getText())) return 1;
	return 0;
}

function functionName(node, sourceFile) {
	if (node.name?.getText(sourceFile)) return node.name.getText(sourceFile);
	if (ts.isVariableDeclaration(node.parent) && node.parent.name) return node.parent.name.getText(sourceFile);
	if (ts.isPropertyAssignment(node.parent) && node.parent.name) return node.parent.name.getText(sourceFile);
	return "<anonymous>";
}

function cyclomaticComplexity(functionNode) {
	let complexity = 1;
	function visit(node) {
		if (node !== functionNode && isFunctionLike(node)) return;
		complexity += branchWeight(node);
		ts.forEachChild(node, visit);
	}
	visit(functionNode);
	return complexity;
}

for (const filePath of collectSourceFiles(sourceRoot)) {
	const sourceText = readFileSync(filePath, "utf8");
	const scriptKind = filePath.endsWith(".tsx") || filePath.endsWith(".jsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
	const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, scriptKind);
	function visit(node) {
		if (isFunctionLike(node)) {
			const complexity = cyclomaticComplexity(node);
			if (complexity > maxCyclomaticComplexity) {
				const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
				failures.push({ file: path.relative(root, filePath), line: position.line + 1, name: functionName(node, sourceFile), complexity });
			}
		}
		ts.forEachChild(node, visit);
	}
	visit(sourceFile);
}

if (failures.length) {
	for (const failure of failures) {
		console.error(`${failure.file}:${failure.line} ${failure.name} has cyclomatic complexity ${failure.complexity}; max is ${maxCyclomaticComplexity}.`);
	}
	process.exit(1);
}

console.log(`Cyclomatic complexity check passed. Max allowed per function: ${maxCyclomaticComplexity}.`);
