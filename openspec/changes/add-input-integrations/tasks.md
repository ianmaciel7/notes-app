## 0. Evidence and dependency gate

- [ ] 0.1 Complete Spaces/sync/API/media/Daily Note/task prerequisites and re-confirm integration sources.

## 1. Integration domain/security

- [ ] 1.1 Define connection/capability/secure-secret/capture/external-mapping/job/error/audit/provider interfaces and threat model.

## 2. Adapters/UI

- [ ] 2.1 Add deep-link/share/web-extension-style capture first, then phased messaging/email/reading adapters with idempotent mappings.
- [ ] 2.2 Add outbound task-action adapter contract and connection/status/retry/disconnect/mapping UI.

## 3. Acceptance

- [ ] 3.1 Test duplicate delivery, revoke, offline retry, malicious input, media capture, reading updates, and task-action failures.
- [ ] 3.2 Run security review, `pnpm verify`, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
