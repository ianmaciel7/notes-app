# Keyboard Command System Corrective Acceptance Matrix

This matrix separates local implementation acceptance from matched Capacities reference parity. Local pass states do not prove reference parity.

| Surface | Action | local_status | reference_status | Outcome |
| --- | --- | --- | --- | --- |
| Repository test | `node --test tests/workspace-objects.test.mjs` | passed | not applicable | 24/24 passed on current `dev`; archived `importHandler` failure did not reproduce. |
| Repository test | `node --test tests/workspace-surface-contract.test.mjs` | passed | not applicable | 4/4 passed; archived `objectTypeHelper` failure did not reproduce in the clean historical worktree. |
| Verification | `pnpm.CMD format:check` | passed | not applicable | Biome checked `package.json` and `biome.json`; no CRLF drift reproduced. |
| Verification | `pnpm.CMD lint` | passed | not applicable | Lint passed over `src`, `scripts`, and `tests`. |
| Verification | `pnpm.CMD typecheck` | passed | not applicable | TypeScript passed. |
| Verification | `pnpm.CMD complexity` | passed | not applicable | Complexity check passed with max allowed per function 12. |
| Verification | `pnpm.CMD typegen` | passed | not applicable | Next route types generated successfully. |
| Verification | `pnpm.CMD test:coverage` | passed | not applicable | 323/323 tests passed with coverage above configured thresholds. |
| Verification | `pnpm.CMD build` | passed | not applicable | Next production build completed after a transient concurrent-build lock cleared. |
| Verification | `pnpm.CMD verify` | passed | not applicable | Full repository pipeline passed end-to-end. |
| Global palette | `Mod+K` open | passed | unknown | Local browser evidence exists in archived implementation notes; matched reference comparison remains absent. |
| Global palette | `Mod+P` delivery | passed | unknown | Unit/router contract covers the command; in-app browser did not reliably deliver `Ctrl+P`. |
| Global palette | Hover tone | passed | unknown | Local pointer/keyboard state is covered; exact Capacities hover tone remains unconfirmed. |
| Editor triggers | IME composition | passed | mutation-prohibited | Unit contracts cover no trigger commit during composition; authenticated reference mutation was not attempted. |
| Editor triggers | Reduced motion | passed | unknown | Local contracts cover reduced-motion-safe state transitions; matched reference comparison remains absent. |
| Editor triggers | Responsive containment | passed | unknown | Local contracts cover viewport clamp and no origin flash; matched reference comparison remains absent. |
| Editor triggers | `@`, `[[`, and `((` suggestions | passed | unknown | Local browser evidence exists in archived implementation notes; matched reference comparison remains absent. |

