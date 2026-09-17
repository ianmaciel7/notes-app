# Task 3 Report — Client Component Dictionary Bridge

## Status

Completed Task 3 only. No individual UI messages were migrated.

## Changes

- Added `src/lib/i18n/provider.tsx` as a Client Component context bridge.
  - `I18nProvider` receives the already-loaded `AppMessages` dictionary and validated `Locale` as props.
  - `useI18n()` returns `{ locale, t }`.
  - `t` is typed as `<K extends MessageKey>(key: K) => string` and resolves the Task 1 dotted keys from the supplied dictionary.
  - The provider reads neither `navigator` nor `localStorage`, and does not call `next/root-params`.
- Added `src/lib/i18n/index.ts` public exports for `I18nProvider`, `useI18n`, and the Task 1 i18n contract types.
- Updated `src/app/[lang]/layout.tsx` to load the server dictionary for the validated route locale and pass both to `I18nProvider` while preserving the existing `ThemeProvider` and `FirebaseProvider` nesting and configuration.

## Scope confirmation

No components, page copy, shared UI primitives, locale catalogs, routing behavior, or Firebase configuration were migrated or changed.

## Validation

| Command | Exact outcome |
| --- | --- |
| `pnpm exec tsc --noEmit` | Passed with exit code 0. |
| `pnpm exec biome check src/lib/i18n/provider.tsx src/lib/i18n/index.ts "src/app/[lang]/layout.tsx"` | Passed with exit code 0. `Checked 3 files in 9ms. No fixes applied.` |
| `git diff --check -- src/lib/i18n/provider.tsx src/lib/i18n/index.ts 'src/app/[lang]/layout.tsx'` | Passed with no whitespace diagnostics; Git emitted its existing LF-to-CRLF warning for `src/app/[lang]/layout.tsx`. |

## Concerns

- The repository has pre-existing user changes outside this task. They were not staged or modified.
- The migration bridge is intentionally unused by UI components until Tasks 4–6.
