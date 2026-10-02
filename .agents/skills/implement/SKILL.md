---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
metadata:
  disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end. For application UI work, also run `check:ui-pattern`; at handoff use the repository's `check:fast`/`check:ci` flow as required by `CONTRIBUTING.md` and `CONSTRAINTS.md`.

Once done, use /code-review to review the work.

Commit your work to the current branch.

## Execution plan lifecycle

When an execution plan is active under `docs/exec-plans/`:

- Update its progress log and decision log as material facts change during the work.
- When the implementation changes a durable repository policy, synchronize the canonical docs plus any project-owned rules/skills/templates/guards that encode that policy.
- Move the plan file to `docs/exec-plans/completed/` only after verification passes
  and the task meets the Definition of Done in `AGENTS.md`.
