# Component Deduplication & UI Strategy

Never duplicate existing UI components, primitives, or patterns. Always prioritize searching, reusing, and extending existing components before creating new ones.

## Core Directives

1. **Audit Before Authoring**:
   - Before building any UI piece, search `@/components/ui/`, `@/components/`, and related directories (`src/components/`, `src/editor/`, etc.) for existing components, subcomponents, and primitives.
   - Check if an existing component can fulfill the requirement directly or through composition.

2. **Reuse and Compose First**:
   - Always prefer composing existing components over writing new markup or standalone components.
   - Use standard `@/components/ui/*` primitives (e.g. `Button`, `Dialog`, `DropdownMenu`, `Card`, `Input`, `Tooltip`) and composite components rather than re-implementing equivalent HTML elements or UI blocks.

3. **Extend and Edit Existing Components**:
   - If an existing component almost fulfills the requirement (e.g., missing a size, color variant, icon placement, or slot):
     - **Extend the existing component** by adding new CVA variants, props, or composable subcomponents.
     - **Do NOT create parallel duplicates** (e.g., do not create `CustomButton.tsx`, `PrimaryHeader.tsx`, or `SidebarItemV2.tsx` when `Button.tsx`, `Header.tsx`, or `SidebarItem.tsx` already exist).
     - Maintain backward compatibility so existing consumers remain unaffected.

4. **Strict Criteria for Creating New Components**:
   - Create a new component **ONLY** when:
     - The requirement represents a distinct semantic domain concept or UI primitive not covered by any existing component.
     - The functionality cannot be cleanly achieved by extending or composing existing components without violating single-responsibility principles.
   - When creating a new component:
     - Follow `.agents/rules/shadcn-first.md` strictly (use `data-slot`, typed props via `React.ComponentProps`, `cn()`, CVA variants, and semantic theme tokens).
     - Place shared UI primitives in `src/components/ui/` and domain-specific composite components in clear feature folders under `src/components/`.

5. **Eliminate Redundant Inline Markup**:
   - Avoid copy-pasting raw styled elements across multiple files (e.g., identical toolbar buttons, badges, status pills, or modal layouts).
   - Extract recurring inline patterns into a single reusable component or extend an existing `@/components/ui` component.
