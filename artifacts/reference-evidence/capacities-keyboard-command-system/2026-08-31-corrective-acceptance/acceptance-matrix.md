# Keyboard Command System Corrective Acceptance Matrix

This matrix separates local implementation acceptance from matched Capacities reference parity. Local pass states do not prove reference parity.

| Surface | Action | local_status | reference_status | Outcome |
| --- | --- | --- | --- | --- |
| Repository test | `node --test tests/workspace-objects.test.mjs` | passed | not applicable | 23/23 passed; archived `importHandler` failure did not reproduce in the clean historical worktree. |
| Repository test | `node --test tests/workspace-surface-contract.test.mjs` | passed | not applicable | 4/4 passed; archived `objectTypeHelper` failure did not reproduce in the clean historical worktree. |
| Verification | `pnpm.cmd format:check` | failed | not applicable | Biome reported CRLF drift in `package.json` and `biome.json`. |
| Verification | `pnpm.cmd lint` | passed | not applicable | Lint passed. |
| Verification | `pnpm.cmd typecheck` | passed | not applicable | TypeScript passed. |
| Verification | `pnpm.cmd complexity` | failed | not applicable | `WorkspaceObjectPageView` and `findUnlinkedMentionCandidates` exceed the configured max complexity. |
| Verification | `pnpm.cmd typegen` | blocked | not applicable | EPERM writing `.next/types/routes.d.ts` in the historical visualization worktree. |
| Verification | `pnpm.cmd test` | passed | not applicable | 243/243 tests passed. |
| Verification | `pnpm.cmd build` | blocked | not applicable | The execution helper failed before build start because of side-conversation ACL setup. |
| Verification | `pnpm.cmd verify` | failed | not applicable | Stops at `format:check`. |
| Global palette | `Mod+K` open | passed | unknown | Local browser evidence exists in archived implementation notes; matched reference comparison remains absent. |
| Global palette | `Mod+P` delivery | passed | unknown | Unit/router contract covers the command; in-app browser did not reliably deliver `Ctrl+P`. |
| Global palette | Hover tone | passed | unknown | Local pointer/keyboard state is covered; exact Capacities hover tone remains unconfirmed. |
| Editor triggers | IME composition | passed | mutation-prohibited | Unit contracts cover no trigger commit during composition; authenticated reference mutation was not attempted. |
| Editor triggers | Reduced motion | passed | unknown | Local contracts cover reduced-motion-safe state transitions; matched reference comparison remains absent. |
| Editor triggers | Responsive containment | passed | unknown | Local contracts cover viewport clamp and no origin flash; matched reference comparison remains absent. |
| Editor triggers | `@`, `[[`, and `((` suggestions | passed | unknown | Local browser evidence exists in archived implementation notes; matched reference comparison remains absent. |

