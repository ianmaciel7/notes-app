# shadcn GritQL guards

These Biome GritQL plugins enforce deterministic consumption rules for the
project's shadcn Base Nova / Base UI component system.

They target application code and intentionally exclude `src/components/ui/**`,
which is registry-managed implementation code owned by the project.

## Enforcement strategy

1. Prefer built-in Biome/TypeScript/Next.js checks when they already express
   the invariant.
2. Use GritQL for low-ambiguity shadcn composition, semantics, accessibility,
   state, token, and Tailwind invariants.
3. Use `components.json` for shadcn project configuration.
4. Leave runtime behavior such as focus trapping, portals, and dismissal to
   Base UI primitives.
5. Keep subjective design/architecture choices in `.agents/rules/shadcn.md`.

## Active GritQL coverage

- Base UI API compatibility and prohibition of Radix-only `asChild`.
- Required accessible parts for Dialog, Sheet, Drawer, AlertDialog, and Avatar.
- Group composition for Select, DropdownMenu, ContextMenu, Menubar, and Command.
- FieldGroup, FieldSet/FieldLegend, InputGroup, Card, Tabs, Sidebar, overlay,
  and broad compound-component anatomy.
- Button loading state, link semantics, icon metadata, icon sizing, and
  icon-button accessible names.
- Field invalid/disabled accessibility pairing.
- Controlled versus uncontrolled state exclusivity.
- Semantic color tokens and prohibition of manual dark-mode colors.
- Tailwind composition conventions (`gap-*`, `truncate`) and logical
  direction utilities for RTL readiness.
- `cn()` for conditional class composition.
- Existing shadcn interactive primitives instead of raw button/input/select/
  textarea elements in application code.
- Overlay stacking ownership (no manual z-index).

See `docs/SHADCN-GUARD-COVERAGE.md` for the complete concept-to-enforcement
matrix.

Do not add GritQL rules for subjective preferences that cannot be determined
reliably from syntax. A noisy guard is worse than a documented policy.
