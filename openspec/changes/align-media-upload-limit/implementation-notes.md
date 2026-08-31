# Implementation Notes

## Baseline

- Repository: `ianmaciel7/notes-app`
- Target branch: `dev`
- Baseline commit: `3161872c0b4056f60021f900bbca42215dcc8cb1`
- Test-first commit: `71bfbc8c71a302605ee20e3781774c0a5418b1f2`
- Implementation commit: `eb042dc0fb2cff6ef65170a147425b60942966a3`
- Selected change: `align-media-upload-limit`
- Reference policy: accept files up to and including 100,000,000 bytes; reject 100,000,001 bytes before hashing or durable storage.

## Implemented Domain Behavior

- Added the canonical `MAX_MEDIA_FILE_BYTES = 100_000_000` product policy.
- Retained `DEFAULT_MAX_MEDIA_BYTES` as a compatibility alias to the canonical constant, without a second numeric limit.
- Added `resolveMediaFileSizeLimit()` so an operational limit can lower, but never raise, the product maximum.
- Added the distinct `file-size-limit-exceeded` error code with `actualBytes`, `limitBytes`, and `limitSource` metadata.
- Kept browser storage exhaustion under the existing `quota-exceeded` code.
- Enforced file-size rejection before hashing or durable writes.
- Kept media reads independent from the current ingestion limit, so existing assets above the former 50 MiB default remain readable.
- Confirmed the current draft commit, bulk import, and existing-entity update paths use `writeMediaAsset()` and therefore share the same policy.
- Monthly upload and total-storage plan quotas remain out of scope because Notes App has no corresponding subscription/quota capability.

## TDD Evidence

The boundary and error-semantics tests were executed against the original implementation first.

```text
node --experimental-strip-types --test tests/workspace-media-storage.test.mjs
tests: 9
passed: 6
failed: 3
```

The red failures demonstrated the missing behavior:

- the exported default was 52,428,800 bytes instead of 100,000,000 bytes;
- a 100,000,001-byte file returned `quota-exceeded` instead of a file-policy error;
- lower operational and product-policy limits were not represented separately.

After implementation, the focused suite was rerun:

```text
node --experimental-strip-types --test tests/workspace-media-storage.test.mjs
tests: 12
passed: 12
failed: 0
```

Focused strict TypeScript verification also passed:

```text
tsc --noEmit --strict --target ES2022 --module NodeNext --moduleResolution NodeNext --lib ES2022,DOM src/lib/workspace-media-storage.ts
exit: 0
```

## Published GitHub Actions Result

GitHub Actions workflow `CI`, run `33325730099`, executed for implementation commit `eb042dc0fb2cff6ef65170a147425b60942966a3`.

Completed stages before the blocker:

```text
format:check: passed
Biome check/lint: passed, 143 files checked, no fixes applied
```

The workflow then failed at the repository complexity gate because of two findings already present outside this change:

```text
src/components/workspace-object-page-view.tsx:2570
WorkspaceObjectPageView complexity 13; configured maximum 12

src/lib/workspace-object-links.ts:356
findUnlinkedMentionCandidates complexity 14; configured maximum 12
```

Because the complexity command exited nonzero, that CI run did not reach type generation, repository-wide typecheck, coverage tests, or production build. This change therefore does not claim repository-wide verification success.

## Environment Boundary

A full local checkout could not be created in this execution environment because outbound DNS resolution for `github.com` failed. The focused fixture used the exact `dev` versions of the changed media module, its test file, and the current workspace-controller ingestion call sites.

In the current repository environment, `openspec validate align-media-upload-limit --strict` passed.

## Acceptance Boundary

- Direct creation, bulk import, and existing-entity update paths converge on `writeMediaAsset()`. Repository-wide source inspection found no separate clipboard, drag/drop, retry, or resume media-ingestion path outside the shared writer.
- Workspace consumers map typed media errors to localized product-limit, operational-limit, quota, and fallback messages.
- GitHub Actions run `33325730099` records the repository verification attempt and the unrelated complexity gate blocker. The remaining repository CI stages were not reached, so this change does not claim repository-wide verification success.
- `openspec validate align-media-upload-limit --strict` passed before archiving readiness was claimed.
