---
trigger: glob
globs:
  - "src/components/**/*.tsx"
description: Standards for implementing UI components aligned with shadcn/ui conventions, composable primitives, data-slot, and theme tokens.
---

# Shadcn UI Component Standards

All new UI components, primitives, blocks, and reusable interface elements must follow first-party shadcn/ui conventions.

The source of truth is the project's `components.json` (configured with style `base-nova`, `@base-ui/react` and Lucide icons).

## 1. Component Selection & Composition

Before writing custom UI:
1. Reuse existing project components under `@/components/ui`.
2. Add official shadcn components using `pnpm dlx shadcn@latest add <component>`.
3. Compose existing primitives (e.g. Card, Dialog, Popover, Tabs) rather than creating ad hoc wrappers with raw HTML.

## 2. Component Implementation Contract

- **Semantic Theme Tokens**: Use tokens like `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `ring-ring`. Never hardcode raw hex values or arbitrary color classes (`bg-blue-500`).
- **`cn()` Utility**: Merge class names using `@/lib/utils` `cn()`.
- **`data-slot` Attribute**: Add a stable `data-slot="<name>"` attribute to the root element and meaningful subcomponents for consistent targeting.
- **Accessibility**: Preserve full keyboard interaction, focus rings (`outline-ring/50`), ARIA attributes, and disabled states.
- **Icons**: Import icons from `lucide-react` matching the configured library in `components.json`.
