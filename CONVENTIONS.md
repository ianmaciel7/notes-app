# Conventions

Day-to-day patterns for working in `src/`. See `ARCHITECTURE.md` for how the pieces fit together, and `AGENTS.md` for AI-tooling rules (Serena, Graphify, Context7, RTK) — not repeated here.

## Formatting & linting

- Biome is the only formatter/linter (`biome.json`), 2-space indent.
- `pnpm lint` — `biome check src tests`.
- `pnpm format` — `biome format --write src tests`.
- `biome.json` excludes `src/components/ui/**` from checks — see "Generated UI" below.
- Import order is enforced via Biome's `organizeImports` assist action; don't hand-order imports.

## Server-only boundary

- Any module that touches `firebase-admin` starts with `import "server-only"` (see `src/lib/firebase/admin.ts`). This makes an accidental client-bundle import a build error, not a runtime leak.
- Every Server Action file/function is `"use server"` (`src/actions/recall.ts`). **Never** call the Admin SDK, or read `firebase-admin`-backed data, from a Client Component.
- The browser only ever talks to Firebase Auth (`src/lib/firebase/client.ts`), never Firestore directly. `firestore.rules` denies all client reads/writes as a backstop, not the primary control.

## Auth & authorization

- `user()` in `src/lib/firebase/session.ts` is the only place that reads the `recall-session` cookie and verifies it. Reuse it; don't re-parse the cookie elsewhere.
- Any action touching a `spaceId` calls `authorized(spaceId)`, which re-verifies the caller **and** checks `members.includes(caller.uid)` on the `spaces/{spaceId}` doc. Never trust a `spaceId` passed from the client as already-authorized.
- `session.ts` is intentionally **not** a `"use server"` module: everything exported from one becomes a browser-callable Server Action, so shared internal helpers live outside the action files rather than being exported from one of them.
- `/api/mcp` is the one request path with no session cookie. It authenticates a Space-scoped API key instead, and the `spaceId` bound to that key — never a `spaceId` from the request body — scopes every query.
- `src/proxy.ts` (middleware) only checks cookie *presence* for a fast redirect — it is explicitly not a security boundary (see the comment in that file). Don't add real authorization logic there; put it in the Server Action.

## Validation

- Input shapes are zod schemas colocated in `src/domain/recall.ts` (e.g. `objectInput`), used both to `safeParse` untrusted input and, via `z.infer`, as the source of TypeScript types. Don't hand-write a parallel `interface` for something a zod schema already defines.
- IDs (`spaceId`, doc IDs) are validated against `idSchema` (`/^[a-zA-Z0-9_-]{1,128}$/`) before use in a Firestore path — validate untrusted IDs before they reach a `.doc(id)` call, not after.

## Domain logic

- `src/domain/recall.ts` has no Next.js or Firebase imports by design — it's the pure-function layer (`grade()`, `schedule()`, schema/types). Keep new business rules here rather than inline in a Server Action or component, so they stay unit-testable without an emulator.

## Generated UI (`src/components/ui/`)

- These files come from the shadcn `base-nova` registry (`components.json`, `iconLibrary: lucide`, `baseColor: neutral`). Regenerate/add components through the shadcn CLI rather than adding new primitives by hand; see `.agents/skills/shadcn/`.
- App-specific composition lives in `src/components/recall/` and `src/components/workspace-frame.tsx`, built on top of `ui/` primitives — put feature logic there, not in `ui/`.

## Naming & imports

- Files: kebab-case (`object-editor.tsx`, `space-switcher.tsx`).
- Components/types: PascalCase. Functions/variables: camelCase.
- Import app code via the `@/` alias (`@/domain/recall`, `@/lib/firebase/admin`) rather than relative paths that cross `src/` subtrees.

## Paths in docs

- Per `plan.md` §1.2: documentation and config use repo-relative paths only (`./src/domain/recall.ts`). No absolute machine paths.

## Comments

- Default to none. Add one only for a non-obvious *why* (see `src/proxy.ts` and `src/lib/workspace.ts` for the existing style — a sentence explaining a constraint or a subtlety, not what the next line does).
