## Why

The workspace needs a small foundation change before feature implementation begins. This isolates component composition, styling ownership, action contracts, responsive behavior, and canonical design documentation from higher-level product capabilities.

## What Changes

- Define shadcn-first composition for common workspace primitives.
- Keep workspace-specific styling owned by feature modules instead of global CSS.
- Define action interaction contracts for workspace controls.
- Require theme and viewport support.
- Require `docs/DESIGN.md` to reflect accepted workspace design behavior.

## Impact

- Planning only; no runtime code changes in this change.
- Later feature changes can depend on this foundation instead of repeating shared UI rules.
