---
trigger: glob
globs:
  - "src/**/*"
  - "docs/**/*"
  - "*.md"
description: >-
  Use space terminology consistently across product copy, domain code,
  component names, and project rules.
---

# Space Vocabulary

Use **space** as the product and domain term throughout the application,
source tree, documentation, and agent rules.

Do not introduce `workspace`, `workspaces`, or `Workspace` in:

- User-facing copy, labels, routes, IDs, analytics events, and documentation.
- Domain types, variables, functions, hooks, contexts, components, CSS names,
  and constants that represent a product concept.
- Agent rules and examples that describe product behavior.

Use `SpaceShell`, `space-shell.tsx`, `useSpaceShell`, and related `space-*`
names for the application shell. Do not introduce `AppShell`, `app-shell`, or
other application-shell names for this product layer.

When modifying existing code that uses the legacy terminology, migrate the
affected names to `space` terminology. Preserve external API names,
third-party identifiers, and filesystem/tooling paths only when they are
required by the integration rather than representing a product concept.

Use phrases such as `space state`, `active space`, `space provider`, and
`space panel` instead of `workspace state`, `active workspace`, `workspace
provider`, and `workspace panel`.
