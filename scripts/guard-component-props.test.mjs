import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { checkPropsInFile } from "./guard-component-props.mjs";

test("guard-component-props passes on current clean codebase", () => {
  const output = execFileSync("node", ["scripts/guard-component-props.mjs"], {
    encoding: "utf8",
  });
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
