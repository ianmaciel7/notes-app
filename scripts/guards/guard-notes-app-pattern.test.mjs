import assert from "node:assert/strict";
import test from "node:test";
import { checkFile } from "./guard-notes-app-pattern.mjs";

test("accepts a visual component composed from ui with props first", () => {
  const source = `
    import { Alert } from "@/components/ui/alert";
    function Example({ className, ...props }) {
      return <Alert {...props} className={className} />;
    }
  `;

  assert.deepEqual(checkFile("example-alert.tsx", source), []);
});

test("rejects visual components without a ui primitive", () => {
  const violations = checkFile(
    "example-card.tsx",
    "export function ExampleCard() { return <div />; }",
  );

  assert.ok(violations.some((item) => item.rule === "notes-app-requires-ui"));
});

test("rejects raw interactive controls", () => {
  const violations = checkFile(
    "example-form.tsx",
    `import { Field } from "@/components/ui/field"; export function ExampleForm() { return <input />; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-no-raw-controls"),
  );
});

test("rejects className before props spread", () => {
  const violations = checkFile(
    "example-card.tsx",
    `import { Card } from "@/components/ui/card"; export function ExampleCard({ className, ...props }) { return <Card className={className} {...props} />; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-props-before-layout"),
  );
});

test("allows explicitly non-visual infrastructure files", () => {
  assert.deepEqual(
    checkFile(
      "auth-provider.tsx",
      "export function AuthProvider() { return null; }",
    ),
    [],
  );
});

test("enforces card anatomy", () => {
  const violations = checkFile(
    "example-card.tsx",
    `import { Card } from "@/components/ui/card"; export function ExampleCard() { return <Card />; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-composition-anatomy"),
  );
});

test("enforces form anatomy", () => {
  const violations = checkFile(
    "example-form.tsx",
    `import { Button } from "@/components/ui/button"; export function ExampleForm() { return <form><Button /></form>; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-composition-anatomy"),
  );
});
