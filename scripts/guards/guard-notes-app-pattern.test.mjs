import assert from "node:assert/strict";
import test from "node:test";
import { checkFile } from "./guard-notes-app-pattern.mjs";

test("accepts a simple visual component composed from ui", () => {
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
    "function ExampleCard() { return <div data-slot=\"example-card\" />; }",
  );

  assert.ok(violations.some((item) => item.rule === "notes-app-requires-ui"));
});

test("rejects raw interactive controls", () => {
  const violations = checkFile(
    "example-form.tsx",
    `import { Field } from "@/components/ui/field";
     function ExampleForm() { return <form data-slot="example-form"><input /></form>; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-no-raw-controls"),
  );
});

test("keeps the file suffix aligned with the root surface", () => {
  const violations = checkFile(
    "settings-field-group.tsx",
    `import { Field } from "@/components/ui/field";
     function SettingsFieldGroup() { return <Field data-slot="settings-field-group" />; }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-surface-root"),
  );
});

test("accepts a simple dialog wrapper without custom compound parts", () => {
  const source = `
    import { Dialog, DialogContent } from "@/components/ui/dialog";
    function ExampleDialog({ children }) {
      return (
        <Dialog>
          <DialogContent data-slot="example-dialog">{children}</DialogContent>
        </Dialog>
      );
    }
  `;

  assert.deepEqual(checkFile("example-dialog.tsx", source), []);
});

test("rejects className before props spread", () => {
  const violations = checkFile(
    "example-card.tsx",
    `import { Card } from "@/components/ui/card";
     function ExampleCard({ className, ...props }) {
       return <Card data-slot="example-card" className={className} {...props} />;
     }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-props-before-layout"),
  );
});

test("allows explicitly non-visual infrastructure files", () => {
  assert.deepEqual(
    checkFile(
      "auth-provider.tsx",
      "function AuthProvider() { return null; }",
    ),
    [],
  );
});

test("rejects raw forwarded layout wrappers", () => {
  const violations = checkFile(
    "example-form.tsx",
    `import { FieldGroup } from "@/components/ui/field";
     function ExampleForm({ ...props }) {
       return <div {...props} className={cn(className)} />;
     }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-no-raw-layout-wrapper"),
  );
});

test("rejects subcomponents without a role suffix", () => {
  const violations = checkFile(
    "example-dialog.tsx",
    `import { Dialog, DialogContent } from "@/components/ui/dialog";
     function ExampleDialog({ children }) {
       return <Dialog><DialogContent data-slot="example-dialog">{children}</DialogContent></Dialog>;
     }
     function ExamplePart() {
       return <DialogContent data-slot="example-part" />;
     }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-component-role-suffix"),
  );
});

test("requires the canonical component name to match the file", () => {
  const violations = checkFile(
    "space-switcher.tsx",
    `import { Select } from "@/components/ui/select";
     function SpaceSwitcherMenu() { return <Select data-slot="space-switcher" />; }`,
  );

  assert.ok(
    violations.some(
      (item) => item.rule === "notes-app-canonical-component-name",
    ),
  );
});

test("preserves canonical acronyms in component names", () => {
  const source = `
    import { Card } from "@/components/ui/card";
    function OAuthCard() {
      return <Card data-slot="oauth-card" />;
    }
  `;

  assert.deepEqual(checkFile("oauth-card.tsx", source), []);
});

test("requires data-slot on visual components", () => {
  const violations = checkFile(
    "example-dialog.tsx",
    `import { Dialog, DialogContent } from "@/components/ui/dialog";
     function ExampleDialog({ children }) {
       return <Dialog><DialogContent>{children}</DialogContent></Dialog>;
     }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-component-data-slot"),
  );
});

test("dedicated component hooks own React state and effects", () => {
  const violations = checkFile(
    "space-shell.tsx",
    `import { useState } from "react";
     import { useSpaceShell } from "@/hooks/use-space-shell";
     import { SidebarProvider } from "@/components/ui/sidebar";
     function SpaceShell({ children }) {
       useSpaceShell({});
       const [open] = useState(false);
       return <SidebarProvider data-slot="space-shell" className={cn("x")}>{children}{open}</SidebarProvider>;
     }`,
  );

  assert.ok(
    violations.some(
      (item) => item.rule === "notes-app-dedicated-hook-owns-state",
    ),
  );
});

test("allows a component to render from its dedicated hook without local state", () => {
  const source = `
    import { useSpaceShell } from "@/hooks/use-space-shell";
    import { SidebarProvider } from "@/components/ui/sidebar";
    function SpaceShell({ children }) {
      useSpaceShell({});
      return <SidebarProvider data-slot="space-shell" className={cn("x")}>{children}</SidebarProvider>;
    }
  `;

  assert.ok(
    !checkFile("space-shell.tsx", source).some(
      (item) => item.rule === "notes-app-dedicated-hook-owns-state",
    ),
  );
});

test("enforces the SpaceShell wrapper contract", () => {
  const violations = checkFile(
    "space-shell.tsx",
    `import { SidebarProvider } from "@/components/ui/sidebar";
     type Props = { children?: ReactNode };
     function SpaceShell({ children }: Props) {
       return <SidebarProvider>{children}</SidebarProvider>;
     }`,
  );

  assert.ok(
    violations.some((item) => item.rule === "notes-app-space-shell-contract"),
  );
});
