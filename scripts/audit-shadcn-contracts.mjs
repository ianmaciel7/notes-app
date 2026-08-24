import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const uiDir = path.join(root, "src", "components", "ui");
const componentsDir = path.join(root, "src", "components");

const failures = [];
const warnings = [];

const KEBAB_CASE_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DUPLICATE_PATTERN_REGEX = /(-v\d+|-copy|-alt|custom-)/i;
const HARDCODED_HEX_REGEX = /#[0-9a-fA-F]{3,8}\b/g;

function collectComponentFiles(dir) {
	if (!existsSync(dir)) return [];
	const files = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...collectComponentFiles(fullPath));
		} else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".jsx"))) {
			files.push(fullPath);
		}
	}
	return files;
}

function getTagName(jsxElement, sourceFile) {
	if (ts.isJsxElement(jsxElement)) {
		return jsxElement.openingElement.tagName.getText(sourceFile);
	}
	if (ts.isJsxSelfClosingElement(jsxElement)) {
		return jsxElement.tagName.getText(sourceFile);
	}
	return "";
}

function getDataSlotValue(jsxElement, sourceFile) {
	const attributes = ts.isJsxElement(jsxElement) ? jsxElement.openingElement.attributes : jsxElement.attributes;
	for (const prop of attributes.properties) {
		if (ts.isJsxAttribute(prop) && prop.name.getText(sourceFile) === "data-slot") {
			if (prop.initializer && ts.isStringLiteral(prop.initializer)) {
				return prop.initializer.text;
			}
			if (prop.initializer && ts.isJsxExpression(prop.initializer) && prop.initializer.expression && ts.isStringLiteral(prop.initializer.expression)) {
				return prop.initializer.expression.text;
			}
			return true;
		}
	}
	return null;
}

function isFunctionScope(node) {
	return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) || ts.isMethodDeclaration(node);
}

function findDirectReturnedJsx(functionBody) {
	const returned = [];
	function visit(n) {
		if (n !== functionBody && isFunctionScope(n)) {
			// Do not descend into inner closures/useMemo/callbacks
			return;
		}
		if (ts.isReturnStatement(n) && n.expression) {
			returned.push(n.expression);
		}
		ts.forEachChild(n, visit);
	}
	visit(functionBody);
	return returned;
}

function auditFile(filePath, isUiPrimitive) {
	const relativePath = path.relative(root, filePath).replaceAll("\\", "/");
	const baseName = path.basename(filePath);

	// 1. Deduplication & Anti-Pattern Check
	if (DUPLICATE_PATTERN_REGEX.test(baseName)) {
		failures.push({
			file: relativePath,
			message: `Component filename "${baseName}" suggests a duplicate/variant component. Follow .agents/rules/component-deduplication.md and extend the original component instead.`,
		});
	}

	const isIconFile = baseName.includes("icon") || baseName.includes("-icons.tsx");
	const fileContent = readFileSync(filePath, "utf8");

	// 2. Hardcoded Color Tokens Check
	const hexMatches = fileContent.match(HARDCODED_HEX_REGEX);
	if (hexMatches && isUiPrimitive) {
		for (const hex of hexMatches) {
			if (!relativePath.includes("shared-styles") && !relativePath.includes("chart.tsx")) {
				warnings.push({
					file: relativePath,
					message: `Found hardcoded color "${hex}". Use semantic theme tokens (e.g. bg-background, text-foreground, border-border) per .agents/rules/shadcn-first.md.`,
				});
			}
		}
	}

	const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

	// Collect exported component names
	const exportedComponentNames = new Set();
	ts.forEachChild(sourceFile, (node) => {
		if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
			for (const spec of node.exportClause.elements) {
				const name = spec.name.getText(sourceFile);
				if (/^[A-Z]/.test(name)) {
					exportedComponentNames.add(name);
				}
			}
		}
	});

	function inspectComponent(body, name) {
		// Exempt non-visual or style-only tags and providers
		if (name.endsWith("Provider") || isIconFile || name.endsWith("Icon") || name.startsWith("use") || name === "ChartStyle") {
			return;
		}

		let returnedJsxList = [];
		if (ts.isBlock(body)) {
			returnedJsxList = findDirectReturnedJsx(body);
		} else {
			returnedJsxList = [body];
		}

		for (const expr of returnedJsxList) {
			let current = expr;
			if (ts.isParenthesizedExpression(current)) {
				current = current.expression;
			}

			if (ts.isJsxElement(current) || ts.isJsxSelfClosingElement(current)) {
				const tagName = getTagName(current, sourceFile);
				const slotValue = getDataSlotValue(current, sourceFile);

				const isNativeDom = /^[a-z]/.test(tagName) && tagName !== "svg" && tagName !== "path" && tagName !== "style";
				const isPrimitiveRoot = tagName.endsWith("Primitive") || tagName.endsWith(".Root") || tagName.endsWith(".Content") || tagName.endsWith(".Item") || tagName.endsWith(".Trigger") || tagName.endsWith(".Popup") || tagName.endsWith(".Panel");

				if ((isNativeDom || (isUiPrimitive && isPrimitiveRoot)) && !slotValue) {
					let innerSlot = null;
					function checkInner(n) {
						if ((ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) && getDataSlotValue(n, sourceFile)) {
							innerSlot = getDataSlotValue(n, sourceFile);
						}
						ts.forEachChild(n, checkInner);
					}
					checkInner(current);

					if (!innerSlot && isUiPrimitive) {
						failures.push({
							file: relativePath,
							message: `UI Primitive "${name}" renders root <${tagName}> without required "data-slot" attribute. Follow .agents/rules/shadcn-first.md.`,
						});
					}
				}

				if (slotValue && typeof slotValue === "string" && !KEBAB_CASE_REGEX.test(slotValue)) {
					failures.push({
						file: relativePath,
						message: `${name} has invalid data-slot="${slotValue}". Must be lowercase kebab-case.`,
					});
				}
			}
		}
	}

	ts.forEachChild(sourceFile, (node) => {
		if (ts.isFunctionDeclaration(node) && node.name && node.body) {
			const name = node.name.getText(sourceFile);
			const isExported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) || exportedComponentNames.has(name);
			if (isExported && /^[A-Z]/.test(name)) {
				inspectComponent(node.body, name);
			}
		}

		if (ts.isVariableStatement(node)) {
			const isExported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
			for (const decl of node.declarationList.declarations) {
				if (decl.name && ts.isIdentifier(decl.name) && decl.initializer) {
					const name = decl.name.getText(sourceFile);
					if ((isExported || exportedComponentNames.has(name)) && /^[A-Z]/.test(name)) {
						if (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer)) {
							inspectComponent(decl.initializer.body, name);
						}
					}
				}
			}
		}
	});
}

// 1. Audit UI primitives
const uiFiles = collectComponentFiles(uiDir);
for (const file of uiFiles) {
	auditFile(file, true);
}

// 2. Audit composite components
const allComponentFiles = collectComponentFiles(componentsDir);
for (const file of allComponentFiles) {
	if (!file.startsWith(uiDir)) {
		auditFile(file, false);
	}
}

if (warnings.length > 0) {
	console.log(`\n=== Shadcn & UI Contract Warnings (${warnings.length}) ===`);
	for (const warn of warnings) {
		console.warn(`[WARN] ${warn.file}: ${warn.message}`);
	}
}

if (failures.length > 0) {
	console.error(`\n=== Shadcn & UI Contract Violations (${failures.length}) ===`);
	for (const fail of failures) {
		console.error(`[FAIL] ${fail.file}: ${fail.message}`);
	}
	process.exit(1);
}

console.log(`\n[PASS] Shadcn Contract Audit Passed: Verified ${uiFiles.length} UI primitives and ${allComponentFiles.length - uiFiles.length} composite components for data-slot contracts, theme tokens, and deduplication rules.`);
