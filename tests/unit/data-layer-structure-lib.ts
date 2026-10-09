import ts from "typescript";

export type DataLayerFile = {
  path: string;
  source: string;
};

export type DataLayerViolationKind =
  | "invalid-file-name"
  | "missing-server-only-import"
  | "exported-variable"
  | "exported-type"
  | "exported-class"
  | "exported-enum"
  | "exported-non-async-function"
  | "re-export"
  | "default-export"
  | "exported-function-identity-parameter";

export type DataLayerViolation = {
  file: string;
  kind: DataLayerViolationKind;
  message: string;
};

const fixMessage =
  "Move pure rules to src/domain, server adapters to src/lib/firebase, and keep only async DAL operations here.";

function violation(
  file: string,
  kind: DataLayerViolationKind,
): DataLayerViolation {
  return { file, kind, message: fixMessage };
}

function hasModifier(node: ts.Node, kind: ts.SyntaxKind): boolean {
  return (
    (ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined)?.some(
      (modifier) => modifier.kind === kind,
    ) ?? false
  );
}

function bindingNames(name: ts.BindingName): string[] {
  if (ts.isIdentifier(name)) {
    return [name.text];
  }

  return name.elements.flatMap((element) =>
    ts.isOmittedExpression(element) ? [] : bindingNames(element.name),
  );
}

function isServerOnlyImport(statement: ts.Statement): boolean {
  return (
    ts.isImportDeclaration(statement) &&
    ts.isStringLiteral(statement.moduleSpecifier) &&
    statement.moduleSpecifier.text === "server-only"
  );
}

function exportViolations(
  file: string,
  statement: ts.Statement,
): DataLayerViolation[] {
  if (ts.isExportDeclaration(statement)) {
    return [violation(file, "re-export")];
  }

  if (ts.isExportAssignment(statement)) {
    return [violation(file, "default-export")];
  }

  if (!hasModifier(statement, ts.SyntaxKind.ExportKeyword)) {
    return [];
  }

  if (hasModifier(statement, ts.SyntaxKind.DefaultKeyword)) {
    return [violation(file, "default-export")];
  }

  if (ts.isVariableStatement(statement)) {
    return [violation(file, "exported-variable")];
  }

  if (
    ts.isTypeAliasDeclaration(statement) ||
    ts.isInterfaceDeclaration(statement)
  ) {
    return [violation(file, "exported-type")];
  }

  if (ts.isClassDeclaration(statement)) {
    return [violation(file, "exported-class")];
  }

  if (ts.isEnumDeclaration(statement)) {
    return [violation(file, "exported-enum")];
  }

  if (
    !ts.isFunctionDeclaration(statement) ||
    !hasModifier(statement, ts.SyntaxKind.AsyncKeyword)
  ) {
    return [violation(file, "exported-non-async-function")];
  }

  if (
    statement.parameters.some((parameter) =>
      bindingNames(parameter.name).some((name) =>
        ["uid", "userId", "ownerId"].includes(name),
      ),
    )
  ) {
    return [violation(file, "exported-function-identity-parameter")];
  }

  return [];
}

export function findDataLayerViolations(
  files: readonly DataLayerFile[],
): DataLayerViolation[] {
  return files.flatMap(({ path, source }) => {
    const normalizedPath = path.replaceAll("\\", "/");
    const sourceFile = ts.createSourceFile(
      normalizedPath,
      source,
      ts.ScriptTarget.Latest,
      true,
    );
    const violations: DataLayerViolation[] = [];

    if (!normalizedPath.endsWith("-dal.ts")) {
      violations.push(violation(normalizedPath, "invalid-file-name"));
    }

    if (!isServerOnlyImport(sourceFile.statements[0])) {
      violations.push(violation(normalizedPath, "missing-server-only-import"));
    }

    for (const statement of sourceFile.statements) {
      violations.push(...exportViolations(normalizedPath, statement));
    }

    return violations;
  });
}
