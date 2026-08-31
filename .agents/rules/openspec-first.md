# OpenSpec-first

For any requested repository change (feature, fix, refactor, behavior change, architecture, or business-logic update), apply OpenSpec work before marking the task complete.

## Core rule
- If the user request changes project behavior, structure, policies, contracts, APIs, tests, or docs, OpenSpec is mandatory.
- If it is only a non-functional housekeeping task (formatting, tooling config with no behavior impact, or pure text cleanup), OpenSpec can be skipped.
- Never finish work before the related OpenSpec workflow has been executed and validated.

## Mandatory sequencing
1. Start or identify the active change
   - If no active change exists, use `openspec-propose`.
2. Capture intent and scope
   - If requirements are unclear or risky, use `openspec-explore`.
3. Implement with spec awareness
   - Use `openspec-apply-change` while implementing.
4. Scope changes evolve
   - If requirements shift, use `openspec-update-change` before continuing implementation.
5. Sync and validate specs
   - Use `openspec-sync-specs`.
   - Run validation before finalizing.
6. Archive when complete
   - Use `openspec-archive-change` once implementation and validation are complete.

## Capacities parity source confirmation
- Before proposing or applying any Capacities parity change, re-check the dated baseline in `docs/references/capacities-reference-baseline-2026-08-31.md`.
- Confirm the relevant official documentation pages or machine-readable indexes for the affected product area before implementation.
- Reuse matching sanitized reference bundles under `docs/references/`, `artifacts/reference-evidence/`, or `artifacts/capacities-reference/` before recapturing external UI.
- Label every parity claim as `official-documentation`, `authenticated-observation`, `sanitized-archive-evidence`, `local-code-test-evidence`, `inference`, or `unknown`.
- Treat private Capacities algorithms, storage contracts, request bodies, exact private headers, and unsigned archive reconstruction as `unknown` unless independently documented.
- Do not copy cookies, authorization headers, signed URLs, raw authenticated HTML, private object content, account identifiers, or complete third-party bundles into repository artifacts.
- If current official indexes cannot be fetched in the working environment, record the blocked fetch as a limitation and do not present stale cached content as freshly confirmed.

## Artifact path resilience
- Tests and tooling may inspect OpenSpec artifacts, but they must not assume a completed change still lives under `openspec/changes/<change>`.
- When reading change artifacts by name, resolve the active path first, then fall back to the newest matching archive path under `openspec/changes/archive/*-<change>`.
- Do not keep duplicate active artifacts just to satisfy tests after archiving; fix the lookup instead.

## OpenSpec skill trigger matrix
- `openspec-propose`
  - Use when there is no active change for the request.
  - Use for new feature initiatives, behavior changes, and new user stories.
- `openspec-explore`
  - Use when requirements are unclear, ambiguous, conflicting, or high-risk.
  - Use when analysis or trade-off exploration is needed before implementation.
- `openspec-apply-change`
  - Use while implementing the selected change.
  - Use to keep code changes aligned with active spec intent.
- `openspec-update-change`
  - Use when scope, constraints, or acceptance criteria change after start.
  - Use after clarifications that alter implementation direction.
- `openspec-sync-specs`
  - Use to merge finalized delta specs into main specs after implementation progress.
  - Do not use as the first step; it follows propose/explore/apply/update.
- `openspec-archive-change`
  - Use only after implementation is complete and validated.
  - Use to finalize a change into canonical spec state.

## Completion checklist
- Active change created/reused and referenced.
- Delta spec created/updated for the full scope.
- Implementation completed with spec context.
- `openspec-sync-specs` executed and successful.
- `openspec validate --specs` executed and passing.
- Change archived with `openspec-archive-change` (when applicable).
- Final commit references the OpenSpec change name.

## Notes
- If work continues across sessions, resume with the same active change.
- Do not postpone OpenSpec steps to after task completion.
