# Object Page Editor Trigger Evidence Attempt - 2026-08-31

Change: `align-object-page-complete-parity`

Task attempted: `1.3 Capture the missing +, grip, slash-label/alias, and @ title/alias states at matched viewports.`

## Checkout

- Branch: `dev`
- HEAD before this run: `9698c84`
- Worktree note: unrelated changes were already present in Graphify outputs, object/page components, editor/table modules, and other OpenSpec changes. This evidence attempt did not edit those files.

## Commands

Initial attempt using the project package manager shim failed before tests could run because `npx.cmd -y pnpm@11.20.0` tried to reach the npm registry and hit `EACCES`. The run was retried with local binaries only.

```text
node --test tests\editor-reference-suggestions.test.mjs tests\editor-reference-adapters-contract.test.mjs
```

Result: passed.

```text
1..6
# tests 6
# pass 6
# fail 0
```

Coverage confirmed by this local source/unit run:

- `@` and `[[` share eligible object lookup with alias dedupe and Structure context.
- Reference replacement preserves the exact trigger range and stores a canonical object mark.
- `((` block lookup preserves duplicate text, owner context, and stable identity.
- BlockEditor exposes reference entities/structures and TipTap Suggestion adapters for `@`, `[[`, and `((`.

```text
.\node_modules\.bin\playwright.cmd test block-editor-interactions.spec.ts slash-menu-reference.spec.ts
```

Result: failed.

```text
10 tests run
3 passed
7 failed
```

Passing browser rows:

- `external paste allocates fresh ids even when pasted ids do not collide`
- `read-only backlink previews preserve source block identity without edit controls`
- `rendered editor preserves focus, reduced motion, mobile overflow, and a clean console`

Failing browser rows blocking task `1.3`:

- `selection toolbar preserves text while applying and removing a link`: timed out clicking `Remover link` after the button detached during navigation.
- `existing block ids survive edits, transforms, reorder, reload, and mobile layout`: `GammaSplit` block was not found after merge/edit flow.
- `plus and six-dot grip keep their independent Capacities behaviors`: workspace object page was not found for the fixture route.
- `slash menu opens after existing text, stays by the caret, and keeps Capacities leading order`: local behavior reached assertions, but console contained React state update and hydration mismatch errors.
- `slash does not open in the middle of a word`: console contained `Internal Next.js error: Router action dispatched before initialization`.
- `slash menu follows the caret after the workspace scrolls`: editor textbox was not found.
- `slash menu flips above a caret near the viewport bottom`: editor textbox was not found.

## Verdict

Task `1.3` is blocked, not complete.

The local source/unit evidence is good enough to say the current code has executable coverage for object-reference lookup, alias dedupe, exact trigger-range replacement, and canonical marks. It is not enough to claim matched object-page parity because the browser evidence for plus/grip/slash is failing and the authenticated Capacities `@` title/alias menu state is still not safely captured.

Do not mark task `1.3` complete until a follow-up run records passing browser evidence for plus, grip, slash labels/aliases, and local `@` title/alias states at matched viewports, plus either authenticated reference evidence or an explicit `not tested` reference mutation boundary accepted by the change owner.
