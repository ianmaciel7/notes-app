import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import ts from "typescript";
import {
  checkLoginCardProps,
  checkPrimaryExportMatchesFilename,
  checkPropsInFile,
} from "./guard-component-props.mjs";

function parseTsx(code, filename = "dummy.tsx") {
  return ts.createSourceFile(
    filename,
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
}

test("guard-component-props passes on current clean codebase", () => {
  const output = execFileSync(
    "node",
    ["scripts/guards/guard-component-props.mjs"],
    {
      encoding: "utf8",
    },
  );
  assert.match(
    output,
    /all component props in src\/components\/notes-app\/\*\.tsx adhere to standard inheritance/,
  );
});

test("checkPropsInFile detects closed interface without extends", () => {
  const sample = `
    interface ClosedButtonProps {
      onClick: () => void;
    }
  `;
  const violations = checkPropsInFile("dummy.tsx", sample);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].propName, "ClosedButtonProps");
  assert.match(violations[0].message, /closed interface with no 'extends'/);
});

test("checkPropsInFile detects closed type alias with object literal", () => {
  const sample = `
    export type ClosedCardProps = {
      title: string;
    };
  `;
  const violations = checkPropsInFile("dummy.tsx", sample);
  assert.equal(violations.length, 1);
  assert.equal(violations[0].propName, "ClosedCardProps");
  assert.match(violations[0].message, /closed object type literal/);
});

test("checkPropsInFile allows ComponentProps, PropsWithChildren, and HTMLAttributes", () => {
  const sample = `
    export interface FormProps extends ComponentProps<"form"> {}
    export interface WrapperProps extends PropsWithChildren<{ title?: string }> {}
    export type DivProps = HTMLAttributes<HTMLDivElement> & { custom?: boolean };
    export type ChildProps = PropsWithChildren<{ id: string }>;
  `;
  const violations = checkPropsInFile("dummy.tsx", sample);
  assert.equal(violations.length, 0);
});

test("checkPropsInFile allows canonical library props", () => {
  const sample = `
    import type { PhoneAuthFormProps } from "@firebase-oss/ui-react";
    export interface CustomPhoneAuthProps extends PhoneAuthFormProps {}
    export type WrappedPhoneAuthProps = PhoneAuthFormProps & { extra?: string };
  `;
  const violations = checkPropsInFile("dummy.tsx", sample);
  assert.equal(violations.length, 0);
});

test("checkPropsInFile detects missing card component export in -card.tsx", () => {
  const sample = `
    export function RandomScreen() { return null; }
  `;
  const violations = checkPropsInFile("dummy-card.tsx", sample);
  // Two violations: card-export check + primary-export-matches-filename check
  assert.equal(violations.length, 2);
  const cardViolation = violations.find((v) =>
    v.message.includes("must export 'DummyCard'"),
  );
  const primaryViolation = violations.find((v) =>
    v.message.includes("Primary export"),
  );
  assert.ok(cardViolation, "expected card export violation");
  assert.equal(cardViolation.propName, "DummyCard");
  assert.ok(primaryViolation, "expected primary export violation");
});

test("checkPropsInFile permits card export via named alias in -card.tsx", () => {
  const sample = `
    function InternalScreen() { return null; }
    export { InternalScreen as DummyCard };
  `;
  const violations = checkPropsInFile("dummy-card.tsx", sample);
  assert.equal(violations.length, 0);
});

// ─── checkPrimaryExportMatchesFilename ─────────────────────────────────────

test("checkPrimaryExportMatchesFilename passes when fn name matches filename", () => {
  const sample = `export function LoginCard({ className }) { return null; }`;
  const sf = parseTsx(sample, "login-card.tsx");
  const result = checkPrimaryExportMatchesFilename(sf, "login-card.tsx");
  assert.equal(result, null);
});

test("checkPrimaryExportMatchesFilename fails when fn name does not match filename", () => {
  const sample = `
    export function SignInAuthScreen({ className }) { return null; }
    export { SignInAuthScreen as LoginCard };
  `;
  const sf = parseTsx(sample, "login-card.tsx");
  const result = checkPrimaryExportMatchesFilename(sf, "login-card.tsx");
  assert.ok(result !== null, "expected a violation");
  assert.equal(result.propName, "LoginCard");
  assert.match(
    result.message,
    /Primary export in 'login-card.tsx' is 'SignInAuthScreen'/,
  );
});

test("checkPrimaryExportMatchesFilename passes when one of multiple fns matches filename", () => {
  // files with multiple exported helpers are OK as long as one matches
  const sample = `
    export function HelperForm() { return null; }
    export function LoginCard() { return null; }
  `;
  const sf = parseTsx(sample, "login-card.tsx");
  const result = checkPrimaryExportMatchesFilename(sf, "login-card.tsx");
  assert.equal(result, null);
});

test("checkPrimaryExportMatchesFilename is skipped for test files", () => {
  const sample = `export function SignInAuthScreen() { return null; }`;
  const sf = parseTsx(sample, "login-card.test.tsx");
  const result = checkPrimaryExportMatchesFilename(sf, "login-card.test.tsx");
  assert.equal(result, null);
});

test("checkPrimaryExportMatchesFilename is skipped when no PascalCase fn is exported", () => {
  // e.g. a pure-context file
  const sample = `export const authContext = createContext(null);`;
  const sf = parseTsx(sample, "auth-context.tsx");
  const result = checkPrimaryExportMatchesFilename(sf, "auth-context.tsx");
  assert.equal(result, null);
});

test("checkPropsInFile catches primary export mismatch via integration", () => {
  const sample = `
    export function SignInAuthScreen({ className }) { return null; }
    export { SignInAuthScreen as LoginCard };
  `;
  const violations = checkPropsInFile("login-card.tsx", sample);
  const exportViolation = violations.find((v) =>
    v.message.includes("Primary export"),
  );
  assert.ok(exportViolation, "expected a primary-export violation");
  assert.match(exportViolation.message, /SignInAuthScreen/);
});

// ─── checkLoginCardProps ───────────────────────────────────────────────────

test("checkLoginCardProps passes when LoginCardProps is declared canonically", () => {
  const sample = `
    export interface LoginCardProps extends ComponentProps<"div"> {}
    export function LoginCard(props: LoginCardProps) { return null; }
    export { LoginCard as SignInAuthScreen, type LoginCardProps as SignInAuthScreenProps };
  `;
  const sf = parseTsx(sample, "login-card.tsx");
  const result = checkLoginCardProps(sf, "login-card.tsx");
  assert.equal(result, null);
});

test("checkLoginCardProps fails when SignInAuthScreenProps is declared instead of LoginCardProps", () => {
  const sample = `
    export interface SignInAuthScreenProps extends ComponentProps<"div"> {}
    export function LoginCard(props: SignInAuthScreenProps) { return null; }
    export { LoginCard as SignInAuthScreen, type SignInAuthScreenProps as LoginCardProps };
  `;
  const sf = parseTsx(sample, "login-card.tsx");
  const result = checkLoginCardProps(sf, "login-card.tsx");
  assert.ok(result !== null);
  assert.equal(result.propName, "SignInAuthScreenProps");
  assert.match(
    result.message,
    /must declare 'LoginCardProps' as its canonical props interface/,
  );
});

test("checkLoginCardProps fails when LoginCardProps is missing", () => {
  const sample = `
    export function LoginCard() { return null; }
  `;
  const sf = parseTsx(sample, "login-card.tsx");
  const result = checkLoginCardProps(sf, "login-card.tsx");
  assert.ok(result !== null);
  assert.equal(result.propName, "LoginCardProps");
  assert.match(result.message, /must declare 'LoginCardProps'/);
});

test("checkLoginCardProps ignores other files", () => {
  const sample = `
    export interface SignInAuthScreenProps extends ComponentProps<"div"> {}
  `;
  const sf = parseTsx(sample, "other-component.tsx");
  const result = checkLoginCardProps(sf, "other-component.tsx");
  assert.equal(result, null);
});
