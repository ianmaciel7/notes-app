## Context

The prior `replicate-capacities-workspace` change captured a useful competitive feature inventory, but its name and structure made the program look like direct cloning rather than a product requirements baseline. This change reframes those requirements as competitor-informed workspace capabilities owned by this repository.

The current app already has:

- Next.js App Router and TypeScript.
- shadcn source components in `src/components/ui`.
- OpenSpec as the canonical specification system.
- CI and verification docs that make `pnpm verify` the ordinary local completion command.

## Decisions

### Use capability-scoped specs

Each feature area gets its own OpenSpec capability. This keeps future PRs smaller and lets accepted capabilities move into `openspec/specs/` or archive independently when implementation evidence exists.

### Keep reference evidence separate from product requirements

`competitive-reference-audit` describes how reference behavior is observed and classified. Product specs may use that evidence, but they should not pretend that inferred or unknown behavior is confirmed.

### Use shadcn as the shared component baseline

Workspace features SHALL compose existing shadcn source components for common UI primitives. Custom markup is allowed only when the installed primitives do not cover the required semantic or interaction behavior, and the implementation must record why.

### Position the workspace as "Studio for the Mind"

The product design SHALL position the workspace as a studio for thought, not a productivity dashboard. The interface should make ideas feel like connected semantic objects rather than files buried in folders. Visual hierarchy stays light; object identity, relationships, backlinks, graph context, and semantic grouping carry the sense of structure.

This means the UI should avoid heavy dashboard chrome, KPI framing, deeply nested folder metaphors as the primary model, and decorative effects that compete with thinking. Motion, hover, depth, transparency, and visual effects are acceptable only when they clarify state, relationship, layering, or available action.

### Adopt an initial competitor-informed color baseline

The workspace starts from a neutral object-workspace palette rather than the current starter-page black/white baseline. The initial values are:

| Token | Light | Dark |
| --- | --- | --- |
| `workspace-bg` | `#f7f5f0` | `#1f1d1a` |
| `workspace-surface` | `#fffdf8` | `#292622` |
| `workspace-surface-muted` | `#f0eee8` | `#34302a` |
| `workspace-sidebar` | `#efede6` | `#25221f` |
| `workspace-panel` | `#fbfaf6` | `#2d2924` |
| `workspace-border` | `#ded9cf` | `#49433b` |
| `workspace-border-subtle` | `#ebe6dc` | `#3b362f` |
| `workspace-text` | `#2b2926` | `#f1eee7` |
| `workspace-text-muted` | `#6f6a61` | `#c4bdb1` |
| `workspace-text-subtle` | `#9a9388` | `#90877a` |
| `workspace-accent` | `#3f7fba` | `#7ab8ae` |
| `workspace-accent-muted` | `#dcecea` | `#244540` |
| `workspace-accent-foreground` | `#123f3a` | `#e7fffb` |
| `workspace-danger` | `#b42318` | `#ff8a80` |
| `workspace-warning` | `#a15c07` | `#f5b461` |
| `workspace-success` | `#2f7d52` | `#8fd4aa` |

These values are a starting baseline for implementation. A later `competitive-reference-audit` pass may replace them with measured evidence, but any replacement must preserve accessible contrast, non-color state cues, and the boundary between global shadcn/Tailwind baseline styles and feature-owned workspace styling.

### Separate domain contracts from presentation

Typed objects, properties, blocks, views, relationships, authorization, revisions, import/export, sync, and AI retrieval should live behind domain/service contracts. UI components should not call storage, AI, or cloud provider APIs directly.

### Keep external and consequential actions human-gated

Billing, OAuth provider authorization, API credentials, public publishing, destructive data operations, production AI credentials, and real-user sharing require explicit human authorization before implementation or execution.

## Risks / Trade-offs

- **Large scope**: Split implementation into dependency-ordered changes instead of one broad PR.
- **Reference behavior uncertainty**: Preserve `UNKNOWN`, `INFERRED`, and `BLOCKED` classifications until confirmed through a safe audit.
- **Offline conflict risk**: Require versioned mutations, explicit conflict states, and recovery before local-first editing is treated as complete.
- **AI privacy risk**: Keep provider credentials server-side and require permission-filtered retrieval and redacted observability.
- **Custom UI drift**: Prefer shadcn composition and require justification for custom common controls.
- **Aesthetic ambiguity**: Keep the "Studio for the Mind" direction testable through semantic object cues, relationship affordances, interaction states, and accessibility parity rather than subjective decoration alone.

## Migration Path

1. Keep this change active while product capabilities are refined.
2. Implement foundational UI and domain contracts first.
3. Add persistence, editor, collections, search/calendar, relations/graph, AI, and portability in separate implementation changes.
4. Sync accepted, stable requirements into `openspec/specs/` whenever possible.
5. Archive implemented changes after OpenSpec validation and software verification both pass.
