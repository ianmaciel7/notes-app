## 1. Route Contract

- [x] 1.1 Define a typed route-to-object-type resolver for all 13 sidebar destinations.
- [x] 1.2 Keep the top tab, active sidebar link, central title, singular fixture label, and count on the same route identity.

## 2. Object List Surface

- [x] 2.1 Implement the shared type header, overview/list toolbar, count, and scrollable card grid with existing project primitives.
- [x] 2.2 Render populated cards and the shared zero-count empty state from the local audit fixture.
- [ ] 2.3 Implement create, filter, sort, and view-mode behavior in separately reviewable interactions.

## 3. Verification

- [x] 3.1 Add focused tests for `/tipos/tabelas` and `/tipos/arquivos`.
- [x] 3.2 Run focused Biome, TypeScript, and Vitest checks.
- [x] 3.3 Validate this OpenSpec change strictly.
- [x] 3.4 Compare `/tipos/tabelas` with the authenticated rendered reference at 1128x912 and verify no page-level horizontal overflow.
- [ ] 3.5 Review all 13 type routes plus mobile and additional desktop breakpoints before claiming complete parity.

## 4. Graph Knowledge

- [x] 4.1 Refresh the executable source graph after source and specification edits.
- [x] 4.2 Verify graph integrity, artifact freshness, and a real MCP `graph_stats` handshake.
- [ ] 4.3 Run semantic document extraction for OpenSpec after replacing the unsafe local Ollama endpoint with an approved backend.
