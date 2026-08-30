## 1. Policy Contract

- [x] 1.1 Add failing tests for decimal 100 MB boundary, one-byte-over rejection, injected lower operational limit, and existing large-asset reads.
- [x] 1.2 Implement one shared media size policy and remove duplicate numeric constants/copy.

## 2. Flow Integration

- [ ] 2.1 Apply the policy to direct creation, file picker, drag/drop, clipboard, import, retry, and resume. The currently implemented draft-commit, bulk-import, and existing-entity update paths already converge on `writeMediaAsset`; remaining ingestion surfaces require repository-wide implementation or explicit not-applicable evidence.
- [x] 2.2 Distinguish product file-policy rejection, lower Notes App operational limits, and browser/local quota rejection.
- [x] 2.3 Verify failed size validation creates no asset record, hash work, or blob write.

## 3. Migration and UI

- [x] 3.1 Preserve readability of existing assets above the old limit.
- [ ] 3.2 Update localized size/error copy and report injected lower limits truthfully. Typed error metadata exists, but current workspace consumers still show the generic media-storage failure message.
- [x] 3.3 Record monthly/total plan quotas as out of scope.

## 4. Acceptance

- [ ] 4.1 Run media, import, persistence, retry, abort, quota, boundary, UI, migration, and full repository verification in CI. Focused media tests pass; GitHub Actions run 33325730099 stopped at unrelated pre-existing complexity findings before the full test/build stages.
- [ ] 4.2 Run `openspec validate align-media-upload-limit --strict` before archiving the change.
