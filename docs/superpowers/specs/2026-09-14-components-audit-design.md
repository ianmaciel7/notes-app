# Components Audit and Fix Design

**Goal:** Bring every component family under a consistent, typed, accessible, and testable contract without rewriting stable behavior unnecessarily.

## Scope

The audit covers `src/components/ui`, `src/components/objects`, `src/components/editor`, and `src/components/ladle`. It addresses confirmed defects in public prop contracts, ref and event forwarding, semantic markup, keyboard and focus behavior, theme tokens, stable slots, stories, and regression tests.

## Design

- Shared UI primitives remain the source of reusable interaction behavior. Domain components compose them instead of duplicating primitive behavior.
- Domain object names and tones remain owned by `src/lib/space-object-types.ts`. Public object component props use the closed domain unions; unknown runtime strings are normalized only at the external lookup boundary.
- Dynamic registries expose a shared runtime contract. Key-specific inference is provided through a typed key-to-component map where consumers need it; a broad string registry is not presented as if it preserved per-key props.
- Interactive components preserve native props, refs, `data-slot` markers, visible focus, accessible names, and keyboard behavior. Client boundaries remain limited to components that need state, effects, browser APIs, or event handlers.
- Stories and tests cover public variants and interaction states for every affected family, using deterministic fixtures and production tokens.

## Verification

Run the focused tests after each family, then run `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm ladle:build`, and `graphify update .` before completion.
