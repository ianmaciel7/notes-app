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
