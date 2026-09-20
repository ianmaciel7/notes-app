# Testing

## Current state

Two test files today, both over the pure `src/domain/` layer:

- `tests/recall.test.ts` — `grade()` for all four question formats, `schedule()`'s literal SM-2 behaviour (per-grade `EF'` vectors, the 1/6/`I(n-1)×EF'` interval ladder, the reset below grade 3, the 1.3 ease floor, out-of-range rejection), and one `objectInput` schema case.
- `tests/api-keys.test.ts` — key format and uniqueness, base62 alphabet coverage under rejection sampling, SHA-256 hashing, and `Bearer` header parsing.

Unit runner: Node's built-in `node:test` + `node:assert/strict`, executed via `tsx` (no Vitest or Jest — check `package.json` before assuming otherwise).

```bash
pnpm test                                   # runs tests/*.test.ts
tsx --test tests/recall.test.ts             # run a single file directly
```

Above the domain layer, `tests/e2e/` is a Playwright suite (`@playwright/test`, Chromium only) covering authoring and backlinks, practice grading with the 0–5 self-grade, the simulated exam, archiving, route protection, cross-Space 404s, and the whole MCP key lifecycle over HTTP. It doubles as the integration suite — `/api/mcp` authenticates with a bearer key rather than a session cookie, so `request` can drive it directly.

```bash
pnpm test:e2e                               # starts emulators + next dev, then runs
pnpm exec playwright test tenancy.spec.ts   # one file
pnpm exec playwright test -g "backlink"     # one test
```

`playwright.config.ts` starts both the Firebase emulators and `next dev` itself and reuses them if they are already running, so no manual setup is needed.

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

## Two traps in the E2E setup

**Use `localhost`, never `127.0.0.1`.** Next 16 blocks cross-origin access to `/_next/*` dev resources, and it does not consider `127.0.0.1` the same origin as `localhost`. Point a browser at `http://127.0.0.1:3000` and the page still renders — server components run, chunks return 200, no error appears in the console — but the client bundle never finishes wiring up, so **nothing hydrates**: every button is inert and every test times out waiting for a click that silently did nothing. The only visible clue is a `Blocked cross-origin request to Next.js dev resource` warning in the dev server's own stdout, which is why `playwright.config.ts` does not set `stdout: "ignore"` on that server lightly. `baseURL` is `http://localhost:3000` for this reason. (The alternative is `allowedDevOrigins: ['127.0.0.1']` in `next.config.ts`; using `localhost` keeps the app config clean.)

**Saving an object navigates from one `/question/<id>` to another.** A `waitForURL(/\/question\/[^/]+$/)` resolves instantly against the page you are already on and hands back the previous object's id. `createObject()` in `tests/e2e/helpers.ts` waits for the URL to actually *change*; keep that if you touch it.

## Planned, not current

`plan.md` §4 specifies the matrix in terms of Vitest for the unit and integration rows. This repo deliberately does not install Vitest: `node:test` covers the pure-domain unit row, and Playwright covers both the E2E row and the integration row (see plan.md §8 for the recorded deviation). Adding a third runner would buy nothing.

Genuinely not covered yet:

- **Firestore security rules.** `firestore.rules` is a blanket deny and every path goes through the Admin SDK, so there are no granular rules to assert. If per-collection rules are ever added, they need an emulator rules suite.
- **Server Action failure paths** — optimistic-concurrency conflicts (`version` mismatch on save), the one-Exam-per-user rule, and cross-Space link rejection are enforced in `src/actions/recall.ts` but only exercised through happy-path E2E.
- **Accessibility and visual regression.** No axe pass, no screenshot comparison.
- **CI.** There is no workflow file; `pnpm lint && pnpm test && pnpm test:e2e && pnpm run build` is the gate to run by hand.
