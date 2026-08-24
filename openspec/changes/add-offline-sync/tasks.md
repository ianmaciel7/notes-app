## 0. Evidence and dependency gate

- [ ] 0.1 Complete workspace database and account/Spaces before apply; re-confirm offline/sync evidence and mark private protocol details `UNKNOWN`.

## 1. Protocol/local state

- [ ] 1.1 Define WorkspaceOperation/outbox, cursors, remote changes/tombstones, conflicts, media states, and transactional repository hooks.
- [ ] 1.2 Build a protocol document, fake sync server, and conformance tests for idempotency/order/retry/cursor safety.

## 2. Sync engine and UI

- [ ] 2.1 Implement push/pull/reconnect/backoff/ack/tombstones and conflict preservation/resolution.
- [ ] 2.2 Integrate media availability/upload/download state and add sync indicator/diagnostics panel.

## 3. Acceptance

- [ ] 3.1 Simulate two clients, offline edits/reload/reconnect, duplicate retries, remote delete, conflict, and media download; prove no whole-workspace overwrite path remains.
- [ ] 3.2 Run network fault/security tests, `pnpm verify`, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
