# Testing

## Current state

Two test files today, both over the pure `src/domain/` layer:

- `tests/recall.test.ts` — `grade()` for all four question formats, `schedule()`'s literal SM-2 behaviour (per-grade `EF'` vectors, the 1/6/`I(n-1)×EF'` interval ladder, the reset below grade 3, the 1.3 ease floor, out-of-range rejection), and one `objectInput` schema case.
- `tests/api-keys.test.ts` — key format and uniqueness, base62 alphabet coverage under rejection sampling, SHA-256 hashing, and `Bearer` header parsing.

Nothing above the domain layer has automated coverage yet: no integration or E2E tests exist, despite the Firebase emulator setup being wired up (see below).

Runner: Node's built-in `node:test` + `node:assert/strict`, executed via `tsx` (no Vitest, Jest, or Playwright installed — check `package.json` before assuming otherwise).

```bash
pnpm test                                   # runs tests/*.test.ts
tsx --test tests/recall.test.ts             # run a single file directly
```

## Writing a new test

Follow the existing file's shape:

- One `test("<module>: <behavior>", () => { ... })` block per behavior, not per function.
- `assert.equal` / `assert.ok` from `node:assert/strict`.
- A trailing inline comment only where the assertion encodes a non-obvious rule (e.g. `// order independence`, `// duplicates rejected`) — this is the same "comment only the non-obvious why" rule as the rest of the codebase (`CONVENTIONS.md`).
- New pure-logic modules get a matching `tests/<module>.test.ts`, imported with a relative path (`../src/domain/...`) since `tsx --test` doesn't resolve the `@/` alias.

Prefer testing at the `src/domain/` layer: it has no Firebase/Next.js imports, so tests need no emulator and run fast.

## Firebase emulators

```bash
pnpm emulators   # starts Auth + Firestore emulators for project demo-recall, with local persistence
```

`src/lib/firebase/admin.ts` auto-points at `127.0.0.1:9099` / `127.0.0.1:8080` when `NODE_ENV=development`, and hard-refuses to initialize against a `demo-*` project ID unless an emulator host env var is set — so `pnpm dev` cannot accidentally write to a real Firebase project. Use the emulators for manual testing of auth/Firestore flows; there is no automated integration suite exercising them yet.

`/api/mcp` is the one surface that can be driven end-to-end without a browser, since it authenticates with a bearer key rather than a session cookie. With the emulators and `pnpm dev` running, seed a Space, an object, and an `/api_keys` document (hashing the raw key with `hashApiKey()` from `src/domain/api-keys.ts`), then `curl -X POST http://127.0.0.1:3000/api/mcp` with `Authorization: Bearer rcl_live_…`. That covers the whole key lifecycle and every JSON-RPC error path in `spec.md` §7.2.4. Anything driven by a Server Action still needs a real browser.

## Lint as a gate

```bash
pnpm lint     # biome check src tests
```

Run this before treating a change as done — it's the cheapest available check and the closest thing this repo has to CI today (there is no CI workflow file yet).

## Planned, not current

`plan.md` §4 specifies a larger target matrix — Vitest unit/integration suites (`tests/unit`, `tests/integration`, including Firestore security-rule isolation and cross-Space rejection tests) and Playwright E2E (`pnpm exec playwright test`) covering auth, authoring, review/grading, exam timers, and the MCP server. Neither `vitest` nor `@playwright/test` is currently a devDependency. Treat that matrix as the target to build toward, not as commands that work today — verify against `package.json`'s `devDependencies` before running or citing them.
