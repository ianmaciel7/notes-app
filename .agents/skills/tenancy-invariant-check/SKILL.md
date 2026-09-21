---
name: tenancy-invariant-check
description: Check code touching Firestore, spaceId scoping, object_links, or MCP tool handlers against the multi-tenancy isolation invariants documented in ARCHITECTURE.md. Use before committing changes to src/actions/, src/lib/firebase/, src/lib/mcp/, or any page/action that reads or writes tenant-scoped data.
---

Read `ARCHITECTURE.md`'s "Multi-tenancy & Isolation Invariants" section first — it is the specification, not this file.

1. Identify every Firestore read/write/query in the change (`Grep` for `spaceId`, `.collection(`, `object_links`, or the affected Server Action/MCP tool).
2. For each one, check:
   - **Composite key scoping** — is `spaceId` checked before returning or mutating any entity/sub-resource?
   - **Relational integrity** — does an `object_links` edge write confirm both endpoints belong to the caller's active Space?
   - **Constant-time information hiding** — does a cross-Space lookup return a uniform `notFound()`, never a 403 or a distinguishable error?
   - **Default-deny boundary** — does the change avoid direct client Firestore access, routing instead through server-authoritative Server Actions or authenticated MCP handlers?
   - **MCP tool parity** — if `src/lib/mcp/tools.ts` changed, does the tool enforce the same scoping as its session/page equivalent?
3. Report each violation with file:line, the invariant broken, and a concrete failure scenario. If nothing in the change touches tenancy-relevant code, say so and stop.

For a full dedicated pass on a diff (not inline as part of other work), dispatch the `tenancy-isolation-reviewer` subagent instead of doing this inline — it runs the same checklist in isolation and won't dilute the main review context.
