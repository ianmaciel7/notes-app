## 1. Implementation

- [ ] Implement settings categories and persisted preferences.
- [ ] Implement import validation and total export generation for objects, metadata, collections, relationships, and files.
- [ ] Implement sharing and access revocation behavior.
- [ ] Implement guarded integrations, developer API documentation/resources, and connection status.
- [ ] Implement offline read cache, mutation outbox, sync status, and conflict recovery.
- [ ] Implement accessibility/resilience gates and tenant-safe observability.

## 2. Verification

- [ ] Test import failure leaves records uncommitted.
- [ ] Test full export authorization, relationship inclusion, and format options.
- [ ] Test access revocation across read/search/sync/graph/export/AI.
- [ ] Test offline queue and conflict recovery.
- [ ] Verify WCAG, keyboard, reduced motion, responsive screenshots, and `pnpm verify` or document a narrower justified path.
