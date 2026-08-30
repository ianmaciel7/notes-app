## Context

`add-keyboard-command-system` introduced the central command registry, `Mod+K`/`Mod+P`, runtime creation commands, ranked object/block search, and editor suggestions for `/`, `@`, `[[`, and `((`. Its archived task list is fully checked, but `implementation-notes.md` records `241/243` tests, a blocked formatting verification, and pre-existing complexity findings. The evidence matrix contains post-implementation local observations, while its manifest, limitations, and reference index still say those states were not tested.

## Goals / Non-Goals

**Goals**

- Make every acceptance artifact agree about what passed, what failed, and what remains reference-unknown.
- Preserve a visible boundary between local browser acceptance and matched Capacities parity.
- Resolve verification blockers or document a formally approved baseline with owner, reason, and follow-up.
- Correct stale OpenSpec dependency names.

**Non-Goals**

- Add `+`, `#`, in-page search, extended-search UI, shortcut preferences, or new command families.
- Rewrite the archived change to hide its original state.
- Treat local behavior as proof of Capacities behavior.

## Decisions

### Append corrective evidence instead of rewriting history

The archived change remains unchanged. Corrective evidence is stored under this active change and linked from the current reference index. Canonical specs are updated only when this change is archived.

### Use two independent verdicts

Every compared state records:

- `local_status`: implemented, passed, failed, blocked, or not tested.
- `reference_status`: confirmed, contradicted, unknown, mutation-prohibited, or not applicable.

A combined `pass` is allowed only when the requirement states which axis it evaluates.

### Verification gate

Acceptance requires:

1. focused command/editor/query tests;
2. full repository tests;
3. formatting, typecheck, lint, build, locale checks, and repository verify;
4. strict validation of this change and canonical specs;
5. refreshed evidence with no stale pre-implementation claims;
6. a final diff review proving no unrelated behavior was added.

If a repository-wide baseline failure is intentionally accepted, the record must include the exact test, reproduction command, owner, linked follow-up, and evidence that this change did not introduce it. A blanket “pre-existing” statement is insufficient.

## Evidence Sources

- `openspec/changes/archive/2026-08-28-add-keyboard-command-system/`
- `artifacts/reference-evidence/capacities-keyboard-command-system/2026-08-28-initial-matrix/`
- `docs/references/capacities-keyboard-command-system.md`
- `docs.capacities.io/reference/search`
- `docs.capacities.io/reference/shortcuts`

## Testing

The corrective change is documentation-heavy but still requires executable checks for the two recorded failures, command-system focused tests, evidence-schema/source guards, OpenSpec strict validation, and a repository verification run.
