# Runtime Object Type evidence baseline

Date: 2026-08-22

## Ownership gate

- Implementation branch/worktree: `codex/runtime-object-types` at baseline commit `04fae07`.
- The original `dev` checkout was left untouched with its pre-existing untracked `.playwright-mcp/`, browser-validation import sample, and `debug.log`.
- `add-block-editor` snapshot v2 entity/storage work is committed in `323a35f`; `src/lib/workspace-objects.ts` and `src/lib/workspace-object-storage.ts` have no later diff at this baseline.
- Later block-editor work in `workspace-content.tsx`, editor commands, and locale catalogs is isolated from this worktree. UI integration must re-audit those owners before editing them.
- Initial focused boundary: new domain module/tests/evidence, then `workspace-objects.ts` and `workspace-object-storage.ts`. UI and locale consumers remain deferred until the domain and migration tests pass.

## Current official sources

The local `C:\Users\ianma\Downloads\reference-urls.json` has SHA-256 `5583E8B23CD883354E476E2038E558A72050245F6060A581E19D4E2D3B27FB80`; its `products.capacities` entry identifies the two official roots below.

- Structures: https://developers.capacities.io/api/concepts/structures
- Properties: https://developers.capacities.io/api/concepts/properties
- Objects: https://developers.capacities.io/api/concepts/objects
- Object types: https://docs.capacities.io/reference/content-types
- Collections: https://docs.capacities.io/reference/collections
- Blocks: https://developers.capacities.io/api/concepts/blocks

Observed official contract used by this slice:

- every object references its type through a Structure id;
- Structures own stable ids, singular/plural names, property definitions, color, and collection references;
- built-in Structures have stable semantic ids and custom Structures have runtime ids;
- property definitions and object property values are separate records;
- entity properties relate objects by target id rather than copying titles or types.

The advertised `https://docs.capacities.io/llms.txt` and `https://docs.capacities.io/llms-full.txt` indexes returned HTTP 404 during the 2026-08-22 audit, so the specific current pages above are the authoritative inputs.

## Archival corpus availability

The required primary files were not present anywhere under `C:\Users\ianma` during the read-only audit:

- `capacities-wacz-complete-source(1).jsonl`: expected 1, found 0;
- `capacities-wacz-completeness-audit(1).json`: expected 1, found 0;
- WACZ inputs: expected 2, found 0.

The repository contains only derived evidence under `artifacts/capacities-reference/`, including `capacities-wacz-visual-contract.json`. That file declares `not_bit_for_bit_complete` and cannot independently prove Structure identity, property schema/value semantics, persistence, or exactly-once lifecycle behavior.

Therefore archival-corpus claims about the runtime domain remain `UNKNOWN`. Official current documentation and local source/tests are the evidence for this domain slice; derived WACZ artifacts remain limited to already-recorded visual geometry and interaction states.
