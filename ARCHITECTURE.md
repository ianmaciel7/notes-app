# Architecture

This documents what is actually built on the `prototype` branch today. `spec.md` and `plan.md` describe a larger target system (command palette, workspace/context tabs, sidebar parity work) drawn partly from the `.worktrees/old*` reference checkouts — treat those as the design target, not the current state. This file describes what exists in `src/` right now.

## Overview

Recall is a Next.js (App Router) app backed by Firebase (Auth + Firestore). It is server-authoritative: the browser never writes to Firestore directly, and every mutation goes through a Next.js Server Action that re-derives the caller's identity from a session cookie.

## Layers

- **`src/app/`** — App Router pages (React Server Components): `page.tsx` (landing/dashboard), `login/`, `workspace/`, `question/` (+ `question/[id]/` object detail), `study/`, `review/`, `settings/`. Pages that need the current user's data call `requireSnapshot()` (`src/lib/workspace.ts`) rather than duplicating auth/redirect logic. Each workspace segment has a `loading.tsx` rendering `WorkspaceSkeleton`, whose box model mirrors `WorkspaceFrame` so streaming does not shift layout.
- **`src/app/api/mcp/route.ts`** — the one non-Server-Action entry point: a JSON-RPC 2.0 Route Handler for external MCP clients, authenticated by a Space-scoped API key rather than a session cookie. Answers plain JSON or SSE depending on `Accept`.
- **`src/proxy.ts`** — Next.js middleware. Redirects based only on whether the `recall-session` cookie is *present*; it is optimistic and not a security boundary. Every Server Action re-verifies the cookie itself via `user()`.
- **`src/lib/firebase/session.ts`** — server-only, *not* a `"use server"` module: holds `user()` (verifies the session cookie) and `authorized(spaceId)` (caller + Space membership). Shared by every action file; deliberately not exported from one, since a `"use server"` export would be callable from the browser.
- **`src/actions/recall.ts`**, **`src/actions/api-keys.ts`** (`"use server"`) — the only session-backed path that reads or writes Firestore. `login()`/`logout()` manage the session cookie; `snapshot()` returns the current user + Space + objects + study records in one call; `api-keys.ts` issues, lists, and revokes owner-only MCP keys.
- **`src/domain/recall.ts`** — pure, framework-agnostic logic: the `objectInput` zod schema (validation + inferred types), `grade()` (per-format answer checking), `schedule()` (the literal SM-2 `EF'` formula over a 0–5 quality grade), and the `richDoc` schema plus `plainText()` for TipTap documents. No Firebase or Next.js imports — this is the layer to unit test.
- **`src/domain/api-keys.ts`** — pure key logic: `rcl_live_` + 32 base62 characters drawn by rejection sampling, SHA-256 hashing, and `Bearer` header parsing. Only the hash is ever persisted.
- **`src/lib/mcp/tools.ts`** — the four read-only MCP tools (`list_objects`, `get_object`, `search_space_content`, `get_study_summary`) plus `RpcError`. Each tool's `spaceId` argument is checked against the key's binding, so a key can only ever read its own Space.
- **`src/lib/firebase/admin.ts`** — server-only (`import "server-only"`) Admin SDK init. Auto-wires the Auth/Firestore emulators in development and refuses to run against a `demo-*` project ID unless the emulator host env vars are set, so a dev build can't accidentally hit a real project.
- **`src/lib/firebase/client.ts`** — browser Auth SDK init only (no Firestore client). Connects to the local Auth emulator in development.
- **`src/components/ui/`** — generated shadcn/`base-nova` primitives (see `components.json`). Treat as generated output, not hand-authored app code — see `CONVENTIONS.md`.
- **`src/components/recall/`** — app-specific components (`object-editor.tsx`, `object-list.tsx`, `object-detail.tsx`, `study-panel.tsx`, `space-switcher.tsx`, `api-keys-card.tsx`, `rich-text.tsx`, `workspace-skeleton.tsx`) and `workspace-frame.tsx`, built on the `ui/` primitives.
- **`firestore.rules`** — default-deny (`allow read, write: if false`). All access is via the Admin SDK, which bypasses client-facing rules entirely; the rules file exists to guarantee no client path is ever accidentally open. This also satisfies `spec.md` §8's requirement that `/api_keys` be unreadable from a client.

## Rich text

Object content is a TipTap (ProseMirror) document stored verbatim as `body`.
`src/components/recall/rich-text.tsx` exports both the editor and the read-only
renderer, sharing one extension set and the `.rich-text` styles in `globals.css` so
authored and rendered content cannot drift apart.

Two constraints are load-bearing:

- **The editor owns its document.** It takes `defaultValue`, never a controlled
  `value`. Re-applying the parent's copy as `content` on each render silently discards
  structure the editor just created.
- **`text` is derived, never sent.** `saveObject()` computes it with `plainText(body)`;
  search, snippets, and the MCP tools read that projection. A client cannot desync the
  two by sending a mismatched pair, because it does not send `text` at all.

`richDoc` validates the document as untrusted input with a depth cap — TipTap having
produced it in a browser is not a reason to trust what arrives at the server.

## Request flow

1. Client calls a Server Action (e.g. from `object-editor.tsx`).
2. The action calls `user()` → reads the `recall-session` cookie → `auth.verifySessionCookie()`.
3. If the action is Space-scoped, `authorized(spaceId)` also loads the `spaces/{spaceId}` doc and checks `members.includes(caller.uid)`.
4. Only then does the action read/write Firestore via the Admin SDK.

An MCP request follows the same shape with a different first step: the bearer key is SHA-256 hashed and looked up in `/api_keys`, rejected if revoked, and then checked to confirm its creator is still a member of the key's Space. The resolved `spaceId` — not anything in the request body — scopes every query that follows.

## Multi-tenancy

Every object, link edge, and study record carries a `spaceId`. There is no cross-space query path in the current code: `authorized()` is the chokepoint for session traffic, and the key binding is the chokepoint for MCP traffic. Collections in use are `spaces` (with a per-user `study` subcollection of `records` and `attempts`), `objects` (with a `revisions` subcollection), `object_links`, `sessions`, `exam_owners`, and `api_keys`. `saveObject()` writes `object_links` edges only after confirming both endpoints live in the caller's Space.

Cross-Space lookups answer 404, never 403 — both `question/[id]/page.tsx` and the MCP `get_object` tool report a foreign object as missing, so neither can be used to probe which ids exist elsewhere.

## Worktrees

`.worktrees/old`, `old-1` … `old-9` are Git linked worktrees kept as implementation reference (see `spec.md` §3.1 for the evidence map). They are not part of the runtime — no code under `src/` may import from or reference `.worktrees/`.

## Related

- `spec.md` — target requirements, schema, and API surface.
- `plan.md` §1 — target layered architecture and phased rollout.
- `intent.md` — problem statement and success criteria.
- `CONVENTIONS.md`, `TESTING.md` — how to work in this codebase day to day.
