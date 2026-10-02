import assert from "node:assert/strict";
import test from "node:test";
import { checkFile } from "./guard-notes-app-pattern.mjs";

test("accepts a visual component composed from ui with props first", () => {
  const source = `
    import { Alert } from "@/components/ui/alert";
    function ExampleAlert({ className, ...props }) {
      return <Alert {...props} data-slot="example-alert" className={className} />;
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

test("enforces field-group anatomy", () => {
  const valid = checkFile(
    "settings-field-group.tsx",
    `import { FieldGroup } from "@/components/ui/field"; function SettingsFieldGroup() { return <FieldGroup data-slot="settings-field-group"><span /></FieldGroup>; }`,
  );

  assert.deepEqual(valid, []);

  const violations = checkFile(
    "settings-field-group.tsx",
    `import { Field } from "@/components/ui/field"; function SettingsFieldGroup() { return <Field data-slot="settings-field-group" />; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-composition-anatomy"),
  );
});
test("enforces form anatomy", () => {
  const valid = checkFile(
    "example-form.tsx",
    `import { Button } from "@/components/ui/button"; function ExampleForm() { return <form data-slot="example-form"><Button /></form>; }`,
  );

  assert.deepEqual(valid, []);

  const violations = checkFile(
    "example-form.tsx",
    `import { FieldGroup } from "@/components/ui/field"; function ExampleForm() { return <FieldGroup data-slot="example-form"><span /></FieldGroup>; }`,
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

test("accepts a dialog that owns only root and content composition", () => {
  const source = `
    import { Dialog, DialogContent } from "@/components/ui/dialog";
    function ExampleDialog({ children }) {
      return <Dialog data-slot="example-dialog">{children}</Dialog>;
    }
    function ExampleDialogContent({ children }) {
      return <DialogContent data-slot="example-dialog-content">{children}</DialogContent>;
    }
  `;

  assert.deepEqual(checkFile("example-dialog.tsx", source), []);
});

test("rejects domain behavior inside dialog wrappers", () => {
  const violations = checkFile(
    "example-dialog.tsx",
    `import { useTranslations } from "next-intl";
     import { ExampleForm } from "@/components/notes-app/example-form";
     import { Dialog, DialogContent } from "@/components/ui/dialog";
     function ExampleDialog({ children }) {
       return <Dialog data-slot="example-dialog">{children}</Dialog>;
     }
     function ExampleDialogContent({ children }) {
       return <DialogContent data-slot="example-dialog-content">{children}<ExampleForm /></DialogContent>;
     }`,
  );

  assert.ok(
    violations.some(
      (item) => item.rule === "notes-app-dialog-single-responsibility",
    ),
  );
});

test("rejects multiple contexts in one component family", () => {
  const violations = checkFile(
    "example-provider.tsx",
    `import { createContext } from "react";
     const FirstContext = createContext(null);
     const SecondContext = createContext(null);
     function ExampleProvider() { return null; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-single-family-context"),
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

test("rejects subcomponents without a role suffix", () => {
  const violations = checkFile(
    "example-dialog.tsx",
    `import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
     function ExampleDialog() { return <Dialog data-slot="example-dialog"><ExampleDialogPart /></Dialog>; }
     function ExampleDialogPart() { return <DialogContent data-slot="example-dialog-part"><DialogTitle>Title</DialogTitle></DialogContent>; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-component-role-suffix"),
  );
});

test("requires the canonical component name to match the file", () => {
  const violations = checkFile(
    "space-switcher.tsx",
    `import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
     import { InputGroup } from "@/components/ui/input-group";
     import { Empty } from "@/components/ui/empty";
     function SpaceSwitcherMenu() { return <SidebarGroup data-slot="space-switcher"><SidebarGroupContent><InputGroup /><Empty /></SidebarGroupContent></SidebarGroup>; }`,
  );

  assert.ok(
    violations.some(
      (item) => item.rule === "notes-app-canonical-component-name",
    ),
  );
});

test("preserves canonical acronyms in component names", () => {
  const source = `
    import { Card, CardContent, CardHeader } from "@/components/ui/card";
    function OAuthCard() {
      return <Card data-slot="oauth-card"><CardHeader /><CardContent /></Card>;
    }
  `;

  assert.deepEqual(checkFile("oauth-card.tsx", source), []);
});

test("requires data-slot on every visual subcomponent", () => {
  const violations = checkFile(
    "example-dialog.tsx",
    `import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
     function ExampleDialog() { return <Dialog data-slot="example-dialog"><ExampleDialogContent /></Dialog>; }
     function ExampleDialogContent() { return <DialogContent><DialogTitle>Title</DialogTitle></DialogContent>; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-component-data-slot"),
  );
});
