# Squads & Team Dispatch

Canonical owner for squad composition, sizing, and team coordination. The lifecycle, graph pass, and delegation contract stay in `.agents/rules/orchestration.md`; this file extends them.

---

## 1. Squads

A squad is a small team dispatched together for one work unit: a gate or planner, one or more writers on disjoint scopes, and at least one non-author checker. The orchestrator stays the lead of every squad.

| Squad | Members | Use for |
| :--- | :--- | :--- |
| **Feature** | `architect` (gate, strong tier) -> implementer per community (standard tier, writes source) + `test-engineer` (writes only that community's test files, reads its source) -> `code-reviewer` | New behavior spanning model, hooks, and UI |
| **Firebase / Security** | `firebase-specialist` + `security-reviewer` in parallel -> `test-engineer` (emulator and rules tests) | Auth, Firestore rules, indexes, tenancy |
| **UI** | implementer (writes components) + `test-engineer` (writes tests and stories only) + `a11y-reviewer` (read-only) | Components, pages, i18n messages |
| **Audit** | N x `research` (small tier), one per community or directory -> `code-reviewer` synthesis | Broad reads, convention sweeps, prior-art scouting |
| **Docs** | `doc-maintainer` + `research` (small tier) | Control-doc sync, `verify-docs` findings |
| **Review** | two `code-reviewer` (Standards, Spec) + `security-reviewer` when auth is touched | Independent review of a finished diff |

## 2. Squad rules

- Members share a read slice but never a write scope. Writers get disjoint globs, split by file type within a community (implementer: source; `test-engineer`: `*.test.*` and story files only). Checkers are read-only. One file, one owner.
- A `test-engineer` needing a source change escalates to the orchestrator. If tests depend on the implementer's new interfaces, run them in the next wave.
- A checker never reviews its own squad's authorship.
- "Implementer" is the host's general worker at the standard tier; its delegation contract carries the conventions.
- A squad returns one result: changes, graph delta (symbols added, removed, re-wired), open escalations.

## 3. Effort scaling

Multi-agent runs cost roughly 15x the tokens of a single chat, and most coding work has few parallelizable parts. Parallelize only when units are independent and the work is breadth-heavy or exceeds one context; otherwise stay single-agent (Section 1.1 of the orchestration rule).

| Work | Topology |
| :--- | :--- |
| One file or one community, no design judgment | Orchestrator alone |
| One community with tests or review | 1 writer + 1 checker |
| 2-3 independent communities | 2-3 squads of 2 members |
| Broad audit or sweep | Up to 5 read-only workers; queue the rest |

- Hard cap: about 5 concurrent workers per orchestrator. For more, add a feature lead per squad (hierarchical delegation) rather than widening the lead's fan-out.
- Read-heavy work (exploration, triage, tests, summaries) parallelizes best; concurrent writes need the disjoint scopes above.

## 4. Task ledger

Track every unit in the ledger (`docs/exec-plans/active/` or `.superpowers/sdd/`) with a status: `pending`, `in_progress`, `completed`, or `blocked`, plus `depends-on`. Unblock dependents automatically when their upstream units complete.

- Each unit has atomic scope and a pass/fail definition of done, so a fresh worker can finish it with no prior context.
- Workers write bulky output (findings, diffs, reports) to a file under the ledger and return the path plus a short summary. This avoids retelling results through the orchestrator.

## 5. Gates and limits

- **Plan gate**: for Feature squads, the `architect` returns a written plan (scopes, contracts, tests) and the orchestrator approves it before any writer starts.
- **Verification gate**: a unit is `completed` only after its worker's verification passes and the checker has reviewed it. Verification, not generation, is the bottleneck, so budget for it.
- **Stuck rule**: a worker repeating the same failure three times is stopped and reassigned or escalated (orchestration rule, Section 5), not retried again.
- **Budget**: set a per-worker token or time budget in the delegation contract; at about 85% of it the worker returns partial findings instead of continuing.
- **Small errors compound**: a vague contract multiplies mistakes across every parallel worker. Fix the contract before re-dispatching the wave.

## 6. Measuring

Treat orchestration changes like prompt changes: replay roughly 20 representative tasks through `eval-harness` and compare reports before and after. Human review of results stays required.
