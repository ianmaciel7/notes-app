#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
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
  "ForgotPasswordAuthFormProps",
  "ForgotPasswordAuthScreenProps",
  "MultiFactorAuthAssertionScreenProps",
  "MultiFactorAuthEnrollmentFormProps",
  "PhoneAuthFormProps",
  "SignInAuthFormProps",
  "SignInAuthScreenProps",
  "SignUpAuthFormProps",
  "SignUpAuthScreenProps",
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

export function checkPropsInFile(filePath, content) {
  const sf = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const violations = [];

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
