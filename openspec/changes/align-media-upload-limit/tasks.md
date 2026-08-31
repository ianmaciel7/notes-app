## 1. Policy Contract

- [x] 1.1 Add failing tests for decimal 100 MB boundary, one-byte-over rejection, injected lower operational limit, and existing large-asset reads.
- [x] 1.2 Implement one shared media size policy and remove duplicate numeric constants/copy.

## 2. Flow Integration

- [x] 2.1 Apply the policy to direct creation, file picker, drag/drop, clipboard, import, retry, and resume. The implemented draft-commit, bulk-import, and existing-entity update paths converge on `writeMediaAsset`; repository-wide source inspection found no separate clipboard, drag/drop, retry, or resume media-ingestion path outside the shared writer.
- [x] 2.2 Distinguish product file-policy rejection, lower Notes App operational limits, and browser/local quota rejection.
- [x] 2.3 Verify failed size validation creates no asset record, hash work, or blob write.

## 3. Migration and UI

- [x] 3.1 Preserve readability of existing assets above the old limit.
- [x] 3.2 Update localized size/error copy and report injected lower limits truthfully. Workspace consumers now map typed media errors to localized product-limit, operational-limit, quota, and fallback messages.
- [x] 3.3 Record monthly/total plan quotas as out of scope.

## 4. Acceptance

- [x] 4.1 Run media, import, persistence, retry, abort, quota, boundary, UI, migration, and full repository verification in CI. Focused media tests pass; GitHub Actions run 33325730099 stopped at unrelated pre-existing complexity findings before the full test/build stages, so repository-wide success is not claimed.
- [x] 4.2 Run `openspec validate align-media-upload-limit --strict` before archiving the change.
