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

## Migration Path

1. Keep this change active while product capabilities are refined.
2. Implement foundational UI and domain contracts first.
3. Add persistence, editor, collections, search/calendar, relations/graph, AI, and portability in separate implementation changes.
4. Sync accepted, stable requirements into `openspec/specs/` whenever possible.
5. Archive implemented changes after OpenSpec validation and software verification both pass.
