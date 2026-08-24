## 0. Evidence and dependency gate

- [ ] 0.1 Complete workspace database and account/Spaces before apply; re-confirm offline/sync evidence and mark private protocol details `UNKNOWN`.

## 1. Protocol/local state

- [ ] 1.1 Define WorkspaceOperation/outbox, cursors, remote changes/tombstones, conflicts, media states, and transactional repository hooks.
- [ ] 1.2 Define a tested offline capability matrix covering local content/editing/indexes, remote media, AI, integrations, and other online-required services.
- [ ] 1.3 Build a protocol document, fake sync server, and conformance tests for idempotency/order/retry/cursor safety.

## 2. Sync engine and UI

- [ ] 2.1 Implement push/pull/reconnect/backoff/ack/tombstones and conflict preservation/resolution.
- [ ] 2.2 Integrate media availability/upload/download state and sync indicator/diagnostics.
- [ ] 2.3 Gate online-required features with explicit offline/degraded UX; never fake successful remote actions.

## 3. Acceptance

- [ ] 3.1 Simulate two clients, offline edits/reload/reconnect, duplicate retries, remote delete, conflict, and media download; prove no whole-workspace overwrite path remains.
- [ ] 3.2 Test the offline capability matrix, including local content availability and online-only failure states.
- [ ] 3.3 Run network fault/security tests, `pnpm verify`, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
