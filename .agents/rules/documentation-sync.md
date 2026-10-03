# Documentation Synchronization

This repository treats documentation as a living part of the implementation.

- Whenever code, behavior, architecture, domain terminology, UI/UX, tooling, or
  verification changes, update every affected canonical document in the same
  task. If the changed rule is encoded in project-owned agent rules, skills,
  templates, guards, or scripts, synchronize those artifacts in the same task too.
- Before finishing, check the ownership map in
  `.agents/skills/context-manager/SKILL.md` and put each fact in exactly one
  canonical owner.
- Do not leave documentation updates as follow-up work when the implementation
  has already changed the documented behavior.
- If no canonical document is affected, state that explicitly in the handoff.
- Run the repository documentation checks after changing control documents.
- Do not rewrite vendored/upstream skills merely to mirror project policy. Put project-specific behavior in project-owned rules/skills and let upstream skills remain upstream-compatible.

## Automated Verification and Enforcement

Documentation synchronization is automatically verified and enforced by:
- `pnpm run check:doc-sync` (`scripts/guards/guard-doc-sync.mjs`), which runs as part of `check:fast`, `check:push`, and `verify:code`.
- Git pre-commit hook via `.husky/pre-commit` (using `--staged`).
- Agent session stop hook (`scripts/hooks/hook-doc-sync-on-stop.mjs`).

### Bypass Mechanism

For pure internal refactors that genuinely touch no documented behavior, verification may be bypassed via:
- CLI flag: `--allow-no-doc`
- Commit message: `[skip-doc-sync]`
- Environment variable: `ALLOW_NO_DOC=1`

This rule prevents implementation and project documentation from drifting apart.
