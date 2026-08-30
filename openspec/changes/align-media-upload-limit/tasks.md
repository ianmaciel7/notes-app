## 1. Policy Contract

- [x] 1.1 Add failing tests for decimal 100 MB boundary, one-byte-over rejection, injected lower operational limit, and existing large-asset reads.
- [x] 1.2 Implement one shared media size policy and remove duplicate numeric constants/copy.

## 2. Flow Integration

- [x] 2.1 Apply the policy to every currently implemented media ingestion path and guard future paths through the shared `writeMediaAsset` owner.
- [x] 2.2 Distinguish file-policy rejection, lower Notes App operational limits, and browser/local quota rejection.
- [x] 2.3 Verify failed size validation creates no asset record, hash work, or blob write.

## 3. Migration and UI

- [x] 3.1 Preserve readability of existing assets above the old limit.
- [x] 3.2 Expose typed error metadata and truthful messages for product-policy, operational-limit, and browser-quota failures.
- [x] 3.3 Record monthly/total plan quotas as out of scope.

## 4. Acceptance

- [ ] 4.1 Run media, import, persistence, retry, abort, quota, boundary, UI, migration, and full repository verification in CI.
- [ ] 4.2 Run `openspec validate align-media-upload-limit --strict` before archiving the change.
