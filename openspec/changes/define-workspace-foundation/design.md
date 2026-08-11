## Context

This change is the implementation baseline for workspace UI features. It intentionally excludes product aesthetics, navigation behavior, domain models, editor behavior, search, graph, AI, and sync.

## Decisions

### Compose existing shadcn primitives first

Workspace surfaces should reuse installed source components from `src/components/ui` for common primitives. Custom markup is allowed only when the component set cannot express the required semantic or interaction behavior.

### Keep global CSS narrow

Global styles remain the Tailwind/shadcn baseline. Workspace-specific selectors, tokens, layout behavior, and variants should live with the owning workspace feature.

### Treat every action as a contract

Every actionable control needs defined preconditions, triggers, immediate feedback, resulting state, persistence behavior, cancellation/undo, and safe failure behavior.

## Risks / Trade-offs

- Too much custom markup can drift from accessible primitives.
- Too much global styling can make later features hard to reason about.
- Foundation work can become a dumping ground; this change keeps only shared UI rules.
