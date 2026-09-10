# Bugfix Spec: Dev Review Follow-up

## Baseline and Current Behavior

Repository: `ianmaciel7/notes-app`, branch `dev`, baseline
`8ba2a492b23b27a0240811651c58370750f6f379`.
The only commit since the previous review changes the structural metrics policy;
it does not modify the document, synchronization, or study-pacing implementations.
The new package scripts no longer expose the former multi-tool quality commands,
but some rules, documentation, and automation still refer to them.

## Why This Is a Defect

Text chunking can fail to advance. Firestore transport success can be mistaken
for write success. Repeated full snapshots can target one document in a batch.
An old acknowledgement can mark a newer local revision as synchronized.
Study pacing uses an inconsistent horizon and assigns new work after completion.
Duplicated HTML extraction and metrics declarations can diverge.

## Expected Behavior

- Chunking terminates, validates finite integer options, and preserves exact offsets.
- Firestore writes are unique per document in a request and acknowledgements are validated.
- New local work stays pending until its own successful acknowledgement.
- Study pacing uses the complete horizon and returns zero new cards when none remain.
- Shared HTML text extraction preserves the existing reader/parser behavior.
- Metrics retain the four existing Biome rules and thresholds, strict warning exits,
  and a local-only command. Invalid or truncated reports must fail, not appear clean.
- Active quality instructions and automation reference installed, supported commands.

## Preserved Behavior and Constraints

Keep Next.js, React, Dexie, the existing repository APIs, and the shadcn/Base UI
configuration. Do not change theme tokens, `globals.css`, schemas, credentials,
remote protections, or dependencies merely to make checks pass. Keep artifacts in
English and filenames in lowercase kebab-case. Do not add lint suppressions,
raise thresholds, expand exclusions, or invent metric results.

## Implementation Plan

1. Verify baseline file blobs, reproduce the defects, and add focused regression tests.
2. Fix chunk cursor progression and share the existing HTML extraction implementation.
3. Validate Firestore batch acknowledgements and deduplicate document writes without
   changing the `SyncBatchWriter.commit` API; guard local acknowledgement races.
4. Correct the pacing denominator and completed-work quota without pretending to
   replace the scheduler with a validated FSRS implementation.
5. Deduplicate metrics configuration and repair CLI execution/report validation;
   reconcile stale policy references with the latest Biome-only metrics decision.
6. Run available isolated tests, attempt the repository checks, inspect all diffs,
   and publish separate commits as a non-forced fast-forward of `dev` after a fresh
   remote-head check.

## Regression Tests

Cover a short word followed by a long word with overlap, non-finite options, exact
quote offsets, partial HTTP-200 Firestore failures, repeated document identities,
concurrent local edits, completed goals, report validation, and command exit codes.
HTTP services and local storage test doubles must use synthetic data only.

## Verification and Boundaries

- [x] Isolated runtime regressions failed on the baseline (22 failures).
- [x] Isolated runtime regressions passed after the fixes (33 assertions).
- [x] Native Node tooling tests passed (18 tests using synthetic CLI fixtures).
- [x] Established chunk boundaries were preserved. Shared HTML extraction matched
  the baseline in 11,664 before/after cases; whitespace normalization stays caller-owned.
- [x] TypeScript 5.8.3 syntax parsing reported no diagnostics in the 22 inspected
  TS/ESM files. This is not the application typecheck.
- [ ] Repository checks: BLOCKED BY ENVIRONMENT. `pnpm lint`, `pnpm metrics`,
  `pnpm test:unit`, `pnpm typecheck`, and `pnpm build` returned command-not-found.
  Corepack could not download the pinned pnpm because the registry was unreachable.
  The full application dependencies, Vitest, Biome binary, Firebase, and browser
  integrations were not available for execution.
- Final remote-head and file-hash verification is performed separately after publication.
  This spec does not assert a successful push before it has happened.

This is not a claim of whole-repository conformity or production readiness.
Authentication/quota rollout, transactional cross-device LWW, retry/lease design,
validated FSRS replacement, parser resource isolation, and browser-level overlay
verification require their own evidence; they must not be reported as fixed by
unrelated cleanup. Full integration results must be reported honestly when the
execution environment cannot install or run the pinned dependencies.
