# Worktree SECURITY.md scouting synthesis (2026-09-22)

Source: `.worktrees/{old,old-2,old-3,old-4,old-5,old-6}/SECURITY.md` (6 of 11 worktrees have one; old-1/7/8/9 do not). Scouted to draft the repo's first root `SECURITY.md` (none existed before).

## Maturity ranking
- **old-5** (229 lines) — most production-mature: Supported Versions → Reporting → Scope → Assets table → Threat Model/Trust Boundaries → Invariants → Reportable Findings → Out of Scope → Known Limitations → Security Architecture (Auth, Data Protection, Secrets, Supply Chain, Input Validation, File/Parser, AI/LLM, Logging) → Secure Coding → AI Agent Rules → Config Files table → Revision History. Used as the structural template.
- **old-6** (98 lines) — Plate/Dexie worktree; adds IndexedDB-specific trust-boundary language, AI prompt-injection/quote-grounding clauses, agent-governance section. Its Dexie and AI-generation content is **not applicable to current `notes-app`** (no local IndexedDB, no AI-generation feature in this repo — confirmed via `src/lib/` listing and no ai SDK in package.json).
- **old/old-2/old-3** (49/46/46 lines) — near-duplicates; reference `.github/workflows/security.yml` CodeQL + Dependabot, which **does not exist in the current repo** (`.github/workflows/` only has `ci.yml`, `prototype-validation.yml`; no `dependabot.yml`). Don't copy CodeQL/Dependabot claims into this repo's docs without actually adding those workflows first.
- **old-4** (14 lines) — skeletal, delegates to OpenSpec/CI; not useful as a template on its own.

## Critical gap all six shared
None of the six historical files document: versioning/support policy, Space/multi-tenant isolation boundaries, or MCP API-key (`rcl_live_...`) scoping. These are the current repo's actual novel security surface and had to be written fresh, sourced from `ARCHITECTURE.md` § Multi-tenancy & Isolation Invariants (composite `[spaceId,id]` keys, relational integrity on `object_links`, constant-time 404 for cross-Space lookups, default-deny `firestore.rules`) rather than any worktree.

## Resulting artifact
Root `SECURITY.md` created 2026-09-22, GitHub Security Advisories as the reporting channel (repo is `github.com/ianmaciel7/notes-app`), explicitly notes CodeQL/Dependabot are *not yet* configured (to avoid the doc lying about CI state — see `mem:worktree-architecture-and-contracts` for the general "don't let docs claim things the code doesn't do" pattern this repo cares about).
