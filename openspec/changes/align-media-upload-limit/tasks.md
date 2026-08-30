## 1. Policy Contract

- [ ] 1.1 Add failing tests for decimal 100 MB boundary, one-byte-over rejection, injected lower operational limit, and existing large-asset reads.
- [ ] 1.2 Implement one shared media size policy and remove duplicate constants/copy.

## 2. Flow Integration

- [ ] 2.1 Apply the policy to direct creation, file picker, drag/drop, clipboard, import, retry, and resume.
- [ ] 2.2 Distinguish file-policy rejection from browser/local quota rejection.
- [ ] 2.3 Verify failed validation creates no asset record, hash work, or blob.

## 3. Migration and UI

- [ ] 3.1 Preserve readability of existing assets above the old limit.
- [ ] 3.2 Update localized size/error copy and report injected lower limits truthfully.
- [ ] 3.3 Record monthly/total plan quotas as out of scope.

## 4. Acceptance

- [ ] 4.1 Run media, import, persistence, retry, abort, quota, boundary, UI, and migration tests.
- [ ] 4.2 Run repository verification and `openspec validate align-media-upload-limit --strict`.
