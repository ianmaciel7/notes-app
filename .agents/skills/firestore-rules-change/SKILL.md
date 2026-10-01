---
name: firestore-rules-change
description: Change Firestore security rules safely. Use when editing firestore.rules, adding or changing a Firestore collection or field, or when the DER.md schema and the rules must stay in sync. Updates the rules, DER.md, validators, and emulator tests together.
disable-model-invocation: true
---

# Firestore rules change

Rules, schema docs, validators, and emulator tests must change together. Work through these steps in order.

## 1. Read the owners

- `SECURITY.md` for the posture the rules must enforce.
- `DER.md` for the current Firestore schema.
- `firestore.rules` for the current rules.
- Firebase ADRs `0008`-`0013` under `docs/` when the change touches auth or data ownership.

## 2. Edit the rules

- Keep rules deny-by-default; grant the narrowest access that the feature needs.
- Authenticated access must tie the document owner to `request.auth.uid`.
- Validate shape on write (required fields, types, no unexpected keys) where the existing rules already do.

## 3. Keep the schema in sync

- Update `DER.md` for any new or changed collection, field, or relationship.
- Update the matching validator under `src/lib/validators/` and any hook (for example `src/hooks/use-spaces.ts`) that reads or writes the changed data.

## 4. Cover it with emulator tests

- Add allow and deny cases to `src/lib/firebase/firestore-emulator.test.ts`.
- Every new rule needs at least one test that is expected to be denied.

## 5. Verify

Run the smallest set that proves the change:

```bash
rtk pnpm test:firebase-emulator
rtk pnpm check:types
rtk pnpm check:docs
```

Report any failing command with its output. Do not weaken or remove a test to get a pass.

## 6. Hand off

Deploying rules is an external side effect. Do not run `firebase deploy` unless the user explicitly asks.
