# Worktree Prior-Art Synthesis: shadcn/ui Architecture & Contracts

Audited across .worktrees/old-4, .worktrees/old-5, and .worktrees/old-9.

## Core Architectural Findings

1. **Exclusively Base UI (@base-ui/react), Zero Radix**:
   - Every checked worktree (old-4, old-5, old-9) configures style: "base-nova" in components.json.
   - No @radix-ui dependencies exist. Primitives wrap @base-ui/react directly (e.g. DialogPrimitive.Popup with data-slot).
   - Triggers and dismissal slots use Base UI render prop conventions (render={<Button />}, nativeButton={false}) rather than Radix asChild.

2. **Component & Shell State Machine Contracts (old-4 OpenSpec)**:
   - Evaluated across explicit states: idle, hover, focus, activation, open/close, persistence.
   - Transient surfaces (command palette, hover previews, disclosures) are non-mutating view state.
   - Action labels use aria-label as the canonical accessible name.

3. **Styling, Typography & Geometry Standards (old-5 Style Guide)**:
   - Dense, calm productivity surfaces: 32px sidebar rows, 24px section headers, 8px/12px border radiuses.
   - Strict OKLCH semantic tokens (--sidebar, --bg-base, --border-base, --text-primary).
   - Explicit tooltip preview parity: native HTML `title` attributes are prohibited; use accessible Tooltip / HoverCard.

4. **Forms and Server Action Integration (old-9)**:
   - Composed with Field, FieldLabel, FieldError, Input, and Button.
   - Standard Schema / Zod validation contracts ensure type-safe boundaries between client forms and server actions.
   - UI transitions wrapped in React useTransition() to maintain responsive UI during mutations.