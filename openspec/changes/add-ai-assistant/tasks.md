## 0. Evidence and dependency gate

- [ ] 0.1 Complete query/link/media/sync prerequisites and re-confirm AI/privacy/media-analysis references.

## 1. Domain/security

- [ ] 1.1 Define chat/message/context/tool/provider records, scopes, confirmations, secure secret boundary, and threat model for prompt injection/data exfiltration/retry duplication.

## 2. Gateway and tools

- [ ] 2.1 Implement mock/provider-neutral streaming gateway, cancel/errors/usage/capability negotiation, then external adapters.
- [ ] 2.2 Add context retrieval/provenance, reviewed text commands, constrained create/update/append/search/read tools, and opt-in suggestions/auto-fill.

## 3. Acceptance

- [ ] 3.1 Browser-test streaming/cancel/provider errors/provenance/tool confirmation/idempotent writes/privacy-off state.
- [ ] 3.2 Run security tests, `pnpm verify`, build, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after evidence is complete.
