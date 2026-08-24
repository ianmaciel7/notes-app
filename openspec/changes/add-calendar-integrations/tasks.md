## 0. Evidence and dependency gate

- [ ] 0.1 Complete local calendar, Spaces, sync, and generic integration prerequisites and re-confirm calendar references.

## 1. Provider domain/security

- [ ] 1.1 Define connection/event/link/capability/sync/conflict records over shared date/secret infrastructure and fake-provider conformance tests.
- [ ] 1.2 Implement Google/Microsoft adapter/OAuth contracts with least privilege and secure refresh.

## 2. Projection/link/sync UI

- [ ] 2.1 Add external event projection without object creation, then explicit create/link-object and supported update/unlink flows.
- [ ] 2.2 Add recurrence/read-only/timezone/conflict states and connection/calendar selection settings.

## 3. Acceptance

- [ ] 3.1 Test reconnect/token refresh/timezones/all-day/duplicates/read-only/recurrence/object-link/conflicts.
- [ ] 3.2 Run provider/security conformance, `pnpm verify`, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
