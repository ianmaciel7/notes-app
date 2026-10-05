# Rule: shadcn/ui Standards and Principles

## Description
Guidelines and constraints for adding, composing, styling, and maintaining shadcn/ui components in this Next.js project.

## Project Context
- **Framework**: Next.js App Router (RSC enabled: `src/` directory).
- **Tailwind**: Tailwind CSS v4 (`@theme inline`, styles in `src/app/globals.css`).
- **Client Directive**: Add `"use client"` at the top of any component file using React hooks (`useState`, `useEffect`), event handlers, or browser APIs.

## Mandatory Rules & Guidelines

1. **Use Existing Components First & Compose**:
   - Check existing components before writing custom UI (`npx shadcn@latest search` or inspect project UI directory).
   - Compose from primitives rather than reinventing (e.g., Cards, Tabs, Dialogs, Popovers).
   - Use built-in variants before custom classes (`variant="outline"`, `size="sm"`).
   - Always prefer semantic colors (`bg-primary`, `text-muted-foreground`) over raw color classes (`bg-blue-500`).

2. **Styling & Tailwind**:
   - Use `className` for layout and positioning, never override component internal colors or typography arbitrarily.
   - Do not use `space-x-*` or `space-y-*`; use `flex` with `gap-*` (for vertical stacks, `flex flex-col gap-*`).
   - Use `size-*` for equal width and height (`size-10` not `w-10 h-10`).
   - Use `truncate` shorthand instead of manual overflow truncation classes.
   - Do not use manual `dark:` color overrides; rely on semantic tokens (`bg-background`, `text-muted-foreground`).
   - Use `cn()` for conditional classes.
   - Do not set manual `z-index` on overlay components (Dialog, Sheet, Popover handle their own stacking).

3. **Forms & Inputs**:
   - Use `FieldGroup` + `Field` for form layouts, never raw `div` with `space-y-*` or `grid gap-*`.
   - `InputGroup` requires `InputGroupInput` or `InputGroupTextarea`, never raw inputs.
   - Buttons within inputs must use `InputGroup` + `InputGroupAddon`.
   - Use `ToggleGroup` for option sets (2–7 choices).
   - Use `FieldSet` + `FieldLegend` when grouping related checkboxes or radio items.
   - Handle validation state with `data-invalid` on `Field` and `aria-invalid` on the control.

4. **Component Structure & Accessibility**:
   - Items belong inside their groups (`SelectItem` in `SelectGroup`, `DropdownMenuItem` in `DropdownMenuGroup`, `CommandItem` in `CommandGroup`).
   - Dialog, Sheet, and Drawer must always contain a Title (`DialogTitle`, `SheetTitle`, `DrawerTitle`) for accessibility (use `className="sr-only"` if visually hidden).
   - Employ full Card composition (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
   - Buttons do not accept `isPending` or `isLoading`; compose with `Spinner` + `data-icon` + `disabled`.
   - `TabsTrigger` must always reside inside `TabsList`.
   - `Avatar` must include `AvatarFallback`.

5. **Icons**:
   - Place `data-icon="inline-start"` or `data-icon="inline-end"` on icons in `Button`.
   - Do not add explicit sizing classes (`size-4`, `w-4 h-4`) inside components that handle icon sizing automatically.
   - Pass icons as component objects, not string keys.

6. **CLI & Component Management**:
   - Use the project's package runner (`npx shadcn@latest`).
   - Never fetch raw component code manually from GitHub; install via `npx shadcn@latest add <component>`.
   - Review added components after installation to ensure proper relative/alias imports and icon library compatibility.
