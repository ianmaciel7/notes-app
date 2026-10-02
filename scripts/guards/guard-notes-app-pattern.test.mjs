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

test("enforces explicit status composition", () => {
  const violations = checkFile(
    "spaces-status.tsx",
    `import { Empty } from "@/components/ui/empty"; function SpacesStatus() { return <Empty />; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-status-composition"),
  );
});

test("enforces dialog composition through children", () => {
  const violations = checkFile(
    "example-dialog.tsx",
    `import { Dialog } from "@/components/ui/dialog"; function ExampleDialog() { return <Dialog />; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-dialog-composition"),
  );
});

test("rejects empty layout primitives", () => {
  const violations = checkFile(
    "example-sidebar.tsx",
    `import { Sidebar, SidebarHeader, SidebarFooter, SidebarContent } from "@/components/ui/sidebar"; function ExampleSidebar() { return <Sidebar><SidebarHeader /><SidebarContent /><SidebarFooter /></Sidebar>; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-empty-composition-part"),
  );

  const emptyWithProps = checkFile(
    "example-sidebar.tsx",
    `import { Sidebar, SidebarHeader, SidebarFooter, SidebarContent } from "@/components/ui/sidebar"; function ExampleSidebar() { return <Sidebar><SidebarHeader /><SidebarContent className="grow" /><SidebarFooter /></Sidebar>; }`,
  );

  assert.ok(
    emptyWithProps.some(
      (item) => item.rule === "notes-app-empty-composition-part",
    ),
  );
});

test("enforces internal sidebar anatomy", () => {
  const violations = checkFile(
    "space-switcher.tsx",
    `import { SidebarMenu } from "@/components/ui/sidebar"; function SpaceSwitcher() { return <SidebarMenu />; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-component-anatomy"),
  );
});

test("does not count imports as composed sidebar anatomy", () => {
  const violations = checkFile(
    "space-shell.tsx",
    `import { SidebarProvider, SidebarHeader, SidebarFooter, SidebarInset } from "@/components/ui/sidebar"; function SpaceShell() { return <SidebarProvider><Sidebar /></SidebarProvider>; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-component-anatomy"),
  );
});

test("enforces the SpaceShell wrapper contract", () => {
  const violations = checkFile(
    "space-shell.tsx",
    `import { SidebarProvider } from "@/components/ui/sidebar"; type Props = { children?: ReactNode }; function SpaceShell({ children }: Props) { return <SidebarProvider><Sidebar /></SidebarProvider>; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-space-shell-contract"),
  );
});

test("enforces the SpaceShell composition", () => {
  const violations = checkFile(
    "space-shell.tsx",
    `import { Sidebar } from "@/components/ui/sidebar"; function SpaceShell() { return <Sidebar />; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-component-anatomy"),
  );
});

test("rejects raw forwarded layout wrappers", () => {
  const violations = checkFile(
    "example-form.tsx",
    `import { FieldGroup } from "@/components/ui/field"; function ExampleForm({ ...props }) { return <div {...props} className={cn(className)} />; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-no-raw-layout-wrapper"),
  );
});
