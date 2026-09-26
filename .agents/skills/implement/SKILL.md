---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
metadata:
  disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use /code-review to review the work.

Commit your work to the current branch.

## Execution plan lifecycle

When an execution plan is active under `docs/exec-plans/`:

- Update its progress log and decision log as material facts change during the work.
- Move the plan file to `docs/exec-plans/completed/` only after verification passes
  and the task meets the Definition of Done in `AGENTS.md`.
