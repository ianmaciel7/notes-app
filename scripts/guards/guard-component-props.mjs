#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../../", import.meta.url));
const componentsDir = path.join(root, "src/components/notes-app");

/**
 * Valid standard patterns / base types for props extension:
 * - ComponentProps<...>
 * - PropsWithChildren<...>
 * - HTMLAttributes<...>
 * - Or canonical library props (e.g. from @firebase-oss/ui-react / @firebase-oss/ui-core, etc.)
 */
const ALLOWED_PROP_PATTERNS = [
  "ComponentProps",
  "PropsWithChildren",
  "HTMLAttributes",
  "FirebaseUIProviderProps",
  "CountrySelectorProps",
  "EmailLinkAuthFormProps",
  "EmailLinkAuthScreenProps",
  "EmailLinkCardProps",
  "ForgotPasswordAuthFormProps",
  "ForgotPasswordAuthScreenProps",
  "ForgotPasswordCardProps",
  "LoginCardProps",
  "MultiFactorAuthAssertionScreenProps",
  "MfaAssertionCardProps",
  "MultiFactorAuthEnrollmentFormProps",
  "MfaEnrollmentCardProps",
  "OAuthCardProps",
  "PhoneAuthCardProps",
  "PhoneAuthFormProps",
  "SignInAuthFormProps",
  "SignInAuthScreenProps",
  "SignUpAuthFormProps",
  "SignUpAuthScreenProps",
  "SignUpCardProps",
  "AuthPoliciesCardProps",
];

function isAllowedTypeReference(typeNode, sf) {
  if (!typeNode) return false;
  const text = typeNode.getText(sf);
  return ALLOWED_PROP_PATTERNS.some((pattern) => text.includes(pattern));
}

function checkInterfaceDeclaration(node, filePath, sf) {
  const propName = node.name.text;
  const heritageClauses = node.heritageClauses;

  if (!heritageClauses || heritageClauses.length === 0) {
    return {
      file: path.relative(root, filePath),
      propName,
      message: `${propName} is a closed interface with no 'extends'. Must extend ComponentProps, PropsWithChildren, HTMLAttributes, or canonical library props.`,
    };
  }

  const hasValidHeritage = heritageClauses.some((clause) =>
    clause.types.some((typeExpr) => isAllowedTypeReference(typeExpr, sf)),
  );

  if (!hasValidHeritage) {
    return {
      file: path.relative(root, filePath),
      propName,
      message: `${propName} extends [${heritageClauses.map((c) => c.getText(sf)).join(", ")}], which does not match standard React/DOM or canonical library props.`,
    };
  }

  return null;
}

function checkTypeAliasDeclaration(node, filePath, sf) {
  const propName = node.name.text;
  const typeNode = node.type;

  if (ts.isTypeLiteralNode(typeNode)) {
    return {
      file: path.relative(root, filePath),
      propName,
      message: `${propName} is a closed object type literal without standard React / DOM inheritance. Must extend ComponentProps, PropsWithChildren, HTMLAttributes, or canonical library props.`,
    };
  }

  if (!isAllowedTypeReference(typeNode, sf)) {
    return {
      file: path.relative(root, filePath),
      propName,
      message: `${propName} does not extend or intersect standard React/DOM inheritance (ComponentProps, PropsWithChildren, HTMLAttributes, or canonical library props).`,
    };
  }

  return null;
}

function toPascalCase(str) {
  return str.replace(/(?:^|-)([a-z0-9])/gi, (_, g) => g.toUpperCase());
}

function addExportedDeclarationNames(node, exportedNames) {
  const hasExportModifier = node.modifiers?.some(
    (m) => m.kind === ts.SyntaxKind.ExportKeyword,
  );
  if (!hasExportModifier) return;

  if (node.name?.text) {
    exportedNames.add(node.name.text);
    return;
  }

  if (ts.isVariableStatement(node)) {
    for (const decl of node.declarationList.declarations) {
      if (decl.name?.text) {
        exportedNames.add(decl.name.text);
      }
    }
  }
}

function addNamedExportClauseNames(node, exportedNames) {
  if (
    !ts.isExportDeclaration(node) ||
    !node.exportClause ||
    !ts.isNamedExports(node.exportClause)
  ) {
    return;
  }

  for (const element of node.exportClause.elements) {
    exportedNames.add(element.name.text);
  }
}

function collectExportedNames(sf) {
  const exportedNames = new Set();
  ts.forEachChild(sf, (node) => {
    addExportedDeclarationNames(node, exportedNames);
    addNamedExportClauseNames(node, exportedNames);
  });
  return exportedNames;
}

export function checkCardExports(sf, filePath) {
  const baseName = path.basename(filePath);
  if (!baseName.endsWith("-card.tsx")) {
    return null;
  }

  const rawName = baseName.replace(/\.tsx$/, "");
  const expectedName = toPascalCase(rawName);
  const normalizedExpected = expectedName.toLowerCase();
  const exportedNames = collectExportedNames(sf);

  const hasMatchingExport = Array.from(exportedNames).some(
    (name) => name.toLowerCase() === normalizedExpected,
  );

  if (!hasMatchingExport) {
    return {
      file: path.relative(root, filePath),
      propName: expectedName,
      message: `Card file '${baseName}' must export '${expectedName}' (as component or export alias) to maintain contract symmetry and prevent broken imports.`,
    };
  }

  return null;
}

/**
 * Enforces that the PRIMARY export function/class/const declaration in a
 * notes-app component file matches the PascalCase derived from the filename.
 *
 * A re-export alias at the bottom (e.g. `export { Foo as Bar }`) is NOT
 * sufficient — the declaration name itself must be canonical.
 *
 * Files with no exported PascalCase function (e.g. pure-context files) are
 * skipped — the rule only fires when at least one exported function exists
 * whose name does NOT match the filename.
 *
 * Example violation:
 *   File: login-card.tsx
 *   Primary fn: export function SignInAuthScreen(...)  ← ❌ must be LoginCard
 *   Fix:        export function LoginCard(...)          ← ✅
 *               export { LoginCard as SignInAuthScreen }; ← backwards-compat alias
 */
export function checkPrimaryExportMatchesFilename(sf, filePath) {
  const baseName = path.basename(filePath);
  if (!baseName.endsWith(".tsx") || baseName.endsWith(".test.tsx")) {
    return null;
  }

  const rawName = baseName.replace(/\.tsx$/, "");
  const expectedName = toPascalCase(rawName);
  const normalizedExpected = expectedName.toLowerCase();

  // Collect names of top-level `export function Foo` / `export class Foo` declarations.
  const primaryExportedFnNames = [];
  ts.forEachChild(sf, (node) => {
    const hasExportModifier = node.modifiers?.some(
      (m) => m.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (!hasExportModifier) return;

    if (
      (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) &&
      node.name?.text
    ) {
      const name = node.name.text;
      // Only care about PascalCase names (React components), not lowercase helpers
      if (/^[A-Z]/.test(name)) {
        primaryExportedFnNames.push(name);
      }
    }
  });

  if (primaryExportedFnNames.length === 0) return null;

  // If any primary declaration already carries the canonical name, we're fine.
  const hasCanonical = primaryExportedFnNames.some(
    (name) => name.toLowerCase() === normalizedExpected,
  );
  if (hasCanonical) return null;

  // Find the "main" component — the one most likely to be the primary export.
  // Heuristic: first exported PascalCase function.
  const actual = primaryExportedFnNames[0];

  return {
    file: path.relative(root, filePath),
    propName: expectedName,
    message: `Primary export in '${baseName}' is '${actual}' but must be '${expectedName}' (derived from filename). Rename the declaration and keep the old name as a backwards-compat alias: export { ${expectedName} as ${actual} };`,
  };
}

/**
 * Specifically validates that login-card.tsx declares `LoginCardProps` directly as its
 * canonical props interface/type rather than `SignInAuthScreenProps`.
 * (SignInAuthScreenProps may only be re-exported as a backwards-compatible alias).
 */
export function checkLoginCardProps(sf, filePath) {
  const baseName = path.basename(filePath);
  if (baseName !== "login-card.tsx") {
    return null;
  }

  const declaredPropNames = [];
  ts.forEachChild(sf, (node) => {
    if (
      (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
      node.name?.text.endsWith("Props")
    ) {
      declaredPropNames.push(node.name.text);
    }
  });

  if (declaredPropNames.includes("SignInAuthScreenProps")) {
    return {
      file: path.relative(root, filePath),
      propName: "SignInAuthScreenProps",
      message:
        "login-card.tsx must declare 'LoginCardProps' as its canonical props type, not 'SignInAuthScreenProps'. Re-export SignInAuthScreenProps as an alias if needed.",
    };
  }

  if (!declaredPropNames.includes("LoginCardProps")) {
    return {
      file: path.relative(root, filePath),
      propName: "LoginCardProps",
      message:
        "login-card.tsx must declare 'LoginCardProps' as its canonical props type.",
    };
  }

  return null;
}

/**
 * Every application alert wrapper must expose the canonical props type
 * derived from its filename, even when it currently adds no custom props.
 * The type is declared with `type` (the `interface` keyword is banned in
 * application components by `component-no-interface`) and published through
 * the file's trailing export block.
 */
export function checkAlertProps(sf, filePath) {
  const baseName = path.basename(filePath);
  if (!baseName.endsWith("-alert.tsx")) {
    return null;
  }

  const expectedName = `${toPascalCase(baseName.replace(/\.tsx$/, ""))}Props`;
  const exportedNames = collectExportedNames(sf);
  let hasCanonicalProps = false;

  ts.forEachChild(sf, (node) => {
    if (
      (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
      node.name.text === expectedName &&
      exportedNames.has(expectedName)
    ) {
      hasCanonicalProps = true;
    }
  });

  if (hasCanonicalProps) {
    return null;
  }

  return {
    file: path.relative(root, filePath),
    propName: expectedName,
    message: `${baseName} must export '${expectedName}' as its canonical props type.`,
  };
}

/**
 * Enforces the compound-Alert contract for ConnectionAlert. The component is
 * intentionally explicit: callers provide the children, while the wrapper
 * forwards native props and owns only connection state.
 */
export function checkConnectionAlertContract(sf, filePath, content) {
  if (path.basename(filePath) !== "connection-alert.tsx") {
    return null;
  }

  const exportedNames = collectExportedNames(sf);
  const requiredExports = [
    "ConnectionAlert",
    "ConnectionAlertAction",
    "ConnectionAlertDescription",
    "ConnectionAlertIcon",
    "ConnectionAlertTitle",
    "ConnectionAlertProps",
  ];
  const missingExports = requiredExports.filter(
    (name) => !exportedNames.has(name),
  );

  if (missingExports.length > 0) {
    return {
      file: path.relative(root, filePath),
      propName: "ConnectionAlert",
      message: `connection-alert.tsx must export the compound Alert parts: ${missingExports.join(", ")}.`,
    };
  }

  const requiresChildren = (members) =>
    members.some(
      (member) =>
        ts.isPropertySignature(member) &&
        member.name.getText(sf) === "children" &&
        !member.questionToken,
    );
  const typeLiterals = (typeNode) =>
    ts.isIntersectionTypeNode(typeNode)
      ? typeNode.types.filter(ts.isTypeLiteralNode)
      : ts.isTypeLiteralNode(typeNode)
        ? [typeNode]
        : [];

  let childrenIsRequired = false;
  ts.forEachChild(sf, (node) => {
    if (
      ts.isInterfaceDeclaration(node) &&
      node.name.text === "ConnectionAlertProps"
    ) {
      childrenIsRequired = requiresChildren(node.members);
    } else if (
      ts.isTypeAliasDeclaration(node) &&
      node.name.text === "ConnectionAlertProps"
    ) {
      childrenIsRequired = typeLiterals(node.type).some((literal) =>
        requiresChildren(literal.members),
      );
    }
  });

  if (!childrenIsRequired) {
    return {
      file: path.relative(root, filePath),
      propName: "ConnectionAlertProps",
      message:
        "ConnectionAlertProps must require children; compound alerts must not provide a default child tree.",
    };
  }

  if (/\bchildren\s*(\?\?|\|\|)/.test(content)) {
    return {
      file: path.relative(root, filePath),
      propName: "ConnectionAlert",
      message:
        "ConnectionAlert must render caller-provided children directly and must not substitute default children.",
    };
  }

  if (
    !content.includes("className") ||
    !content.includes("...props") ||
    !content.includes("cn(")
  ) {
    return {
      file: path.relative(root, filePath),
      propName: "ConnectionAlert",
      message:
        "ConnectionAlert must forward className and remaining props through cn() following the shared Alert pattern.",
    };
  }

  return null;
}

function getComponentFunction(node) {
  if (ts.isFunctionDeclaration(node) && node.name) {
    return { name: node.name.text, fn: node };
  }

  if (!ts.isVariableStatement(node)) return null;

  for (const decl of node.declarationList.declarations) {
    const init = decl.initializer;
    if (
      ts.isIdentifier(decl.name) &&
      init &&
      (ts.isArrowFunction(init) || ts.isFunctionExpression(init))
    ) {
      return { name: decl.name.text, fn: init };
    }
  }

  return null;
}

/**
 * Component props must be named (`${ComponentName}Props`) so the other checks
 * in this guard can see them. An anonymous object type literal on the first
 * parameter of a component (`function Foo({ a }: { a?: string })`) bypasses
 * every `*Props` check and loses native element inheritance.
 */
export function checkInlinePropsTypes(sf, filePath) {
  const violations = [];

  ts.forEachChild(sf, (node) => {
    const component = getComponentFunction(node);
    if (!component || !/^[A-Z]/.test(component.name)) return;

    const typeNode = component.fn.parameters[0]?.type;
    if (typeNode && ts.isTypeLiteralNode(typeNode)) {
      violations.push({
        file: path.relative(root, filePath),
        propName: component.name,
        message: `${component.name} declares its props as an inline object type literal. Declare 'type ${component.name}Props = ComponentProps<...> & { ... }' and use it instead.`,
      });
    }
  });

  return violations;
}

/**
 * Overlay components (dialog, sheet, drawer) own their own open state and a
 * distinct concern, so they must live in a file named after them. Declaring one
 * inside another component's file couples unrelated concerns, hides it from the
 * file naming guard and makes it impossible to test or preview in isolation.
 *
 * Cards and forms are deliberately excluded: multi-step flows (phone auth, MFA)
 * legitimately keep their step forms next to the flow that owns them.
 *
 * A declaration is allowed when its name starts with the PascalCase of the
 * filename (case-insensitive), so compound parts stay put.
 *
 * Example violation:
 *   File: space-sidebar.tsx
 *   Declares: function CreateSpaceDialog(...)  <- move to create-space-dialog.tsx
 */
const STANDALONE_SURFACE_SUFFIXES = ["Dialog", "Sheet", "Drawer"];

export function checkStandaloneSurfaceComponents(sf, filePath) {
  const baseName = path.basename(filePath);
  if (!baseName.endsWith(".tsx") || baseName.endsWith(".test.tsx")) {
    return [];
  }

  const ownerName = toPascalCase(baseName.replace(/\.tsx$/, ""));
  const violations = [];

  ts.forEachChild(sf, (node) => {
    const component = getComponentFunction(node);
    if (!component || !/^[A-Z]/.test(component.name)) return;

    const suffix = STANDALONE_SURFACE_SUFFIXES.find((s) =>
      component.name.endsWith(s),
    );
    if (
      !suffix ||
      component.name.toLowerCase().startsWith(ownerName.toLowerCase())
    ) {
      return;
    }

    const targetFile = `${component.name
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase()}.tsx`;
    violations.push({
      file: path.relative(root, filePath),
      propName: component.name,
      message: `${component.name} is a standalone ${suffix.toLowerCase()} declared inside '${baseName}'. Move it to its own file '${targetFile}'.`,
    });
  });

  return violations;
}

export function checkPropsInFile(filePath, content) {
  const sf = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const violations = [];

  const cardViolation = checkCardExports(sf, filePath);
  if (cardViolation) violations.push(cardViolation);

  const primaryExportViolation = checkPrimaryExportMatchesFilename(
    sf,
    filePath,
  );
  if (primaryExportViolation) violations.push(primaryExportViolation);

  const loginCardPropsViolation = checkLoginCardProps(sf, filePath);
  if (loginCardPropsViolation) violations.push(loginCardPropsViolation);

  const alertPropsViolation = checkAlertProps(sf, filePath);
  if (alertPropsViolation) violations.push(alertPropsViolation);

  const connectionAlertViolation = checkConnectionAlertContract(
    sf,
    filePath,
    content,
  );
  if (connectionAlertViolation) violations.push(connectionAlertViolation);

  violations.push(...checkInlinePropsTypes(sf, filePath));
  violations.push(...checkStandaloneSurfaceComponents(sf, filePath));

  ts.forEachChild(sf, (node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith("Props")) {
      const violation = checkInterfaceDeclaration(node, filePath, sf);
      if (violation) violations.push(violation);
    } else if (
      ts.isTypeAliasDeclaration(node) &&
      node.name.text.endsWith("Props")
    ) {
      const violation = checkTypeAliasDeclaration(node, filePath, sf);
      if (violation) violations.push(violation);
    }
  });

  return violations;
}

export function runGuard() {
  if (!existsSync(componentsDir)) {
    console.log(
      "guard-component-props: components directory does not exist, skipping.",
    );
    return [];
  }

  const files = readdirSync(componentsDir).filter(
    (f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"),
  );

  const allViolations = [];

  for (const file of files) {
    const fullPath = path.join(componentsDir, file);
    const content = readFileSync(fullPath, "utf8");
    const violations = checkPropsInFile(fullPath, content);
    allViolations.push(...violations);
  }

  return allViolations;
}

// If executed directly as CLI script
const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  const violations = runGuard();
  if (violations.length > 0) {
    console.error(
      `\x1b[31mguard-component-props: ${violations.length} violation(s) found:\x1b[0m`,
    );
    for (const v of violations) {
      console.error(`  \x1b[33m${v.file}\x1b[0m [${v.propName}]: ${v.message}`);
    }
    process.exit(1);
  }

  console.log(
    "guard-component-props: all component props in src/components/notes-app/*.tsx adhere to standard inheritance.",
  );
  process.exit(0);
}
