## 1. Rule And Documentation

- [x] Inspect current project structure and installed Next.js docs.
- [x] Create `.agents/rules/nextjs-server-architecture.md`.
- [x] Update architecture documentation with the server architecture policy and current no-empty-layer status.

## 2. Future Implementation Guardrails

- [ ] When protected data access is added, create server-only DAL modules with `import "server-only"`.
- [ ] Keep authentication, authorization, validation, data access, and minimal returned data close to the DAL operation.
- [ ] Use Server Components for direct server-side data consumption.
- [ ] Use Server Actions / Server Functions for UI mutations.
- [ ] Use Route Handlers only for real HTTP endpoints, webhooks, non-UI responses, or external/client API consumers.
- [ ] Add optional use cases, ports, repositories, dependency injection, or composition root only with explicit justification.

## 3. Verification

- [ ] Verify no Client Component imports server-only modules, database clients, Firebase Admin, private API clients, or secrets.
- [ ] Verify Server Actions re-authenticate/authorize directly or delegate to DAL functions that do.
- [ ] Verify sensitive reads/mutations return minimal safe data.
- [ ] Validate this OpenSpec change with `openspec.cmd validate define-nextjs-server-architecture --strict`.
- [ ] Run `pnpm verify` when runtime code is changed.
