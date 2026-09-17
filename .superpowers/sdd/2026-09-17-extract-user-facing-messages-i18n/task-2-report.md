# Task 2 Report — Locale Routing and Server Dictionaries

## Scope completed

- Added `src/proxy.ts` for URL-first locale routing.
  - Supports only `en` and `pt-BR`.
  - Negotiates an initial locale from `Accept-Language`, including quality weights
    and language-only matches such as `pt` → `pt-BR`.
  - Falls back to `en`.
  - Redirects paths without a supported locale prefix to `/${locale}${pathname}`.
  - Excludes API, `_next`, and static-file paths from the matcher.
- Moved the root page and layout behavior under `src/app/[lang]/`.
  - The locale layout preserves the existing Geist fonts, global styles,
    `ThemeProvider`, `FirebaseProvider`, body classes, and metadata behavior.
  - It validates `lang`, sets `<html lang>` from it, and provides static params
    for `en` and `pt-BR`.
  - The sign-in page now has localized routes (`/en/sign-in` and
    `/pt-BR/sign-in`), preserving the existing auth UI and redirects.
- Added server-side dynamic dictionary loading in
  `src/app/[lang]/dictionaries.ts` and JSON dictionaries for both locales.
  - Route parameters are validated before lookup.
  - The loader is only imported from the server locale layout.
  - Task 1's typed `src/lib/i18n/` contract and catalog were consumed unchanged.
- Added focused proxy and dictionary loader tests.

## Validation

| Command | Outcome |
| --- | --- |
| `pnpm exec vitest run --config vitest.task-2.config.ts` | Passed: 2 files, 4 tests. The temporary config was removed after the run because the current user-owned Vitest config intentionally targets the question component only. |
| `pnpm exec biome check` on Task 2 source and test files | Passed: 7 files checked, no diagnostics. |
| `pnpm exec tsc --noEmit` | Passed after `pnpm exec next typegen` refreshed stale generated route types. |
| `pnpm build` | Passed. Next.js 16.3.5 compiled, type-checked, generated static locale routes, and recognized the Proxy. |
| `pnpm lint` | Failed with the pre-existing repository baseline: 147 errors and 36 warnings, with 163 additional diagnostics suppressed. Scoped Biome verification found no diagnostics in Task 2 files. |

## Files changed for Task 2

- `src/proxy.ts`
- `src/proxy.test.ts`
- `src/app/[lang]/layout.tsx`
- `src/app/[lang]/page.tsx`
- `src/app/[lang]/sign-in/page.tsx`
- `src/app/[lang]/dictionaries.ts`
- `src/app/[lang]/dictionaries/en.json`
- `src/app/[lang]/dictionaries/pt-BR.json`
- `src/app/dictionaries.test.ts`
- `src/app/layout.tsx` (moved into the locale layout)
- `src/app/page.tsx` (moved into the locale route)
- `src/app/sign-in/page.tsx` (moved into the locale route)

## Notes

- No Client Component dictionary provider was added; that remains Task 3.
- Existing untracked Firebase and auth support files were retained. Only the
  sign-in route itself was relocated under the locale segment so proxy redirects
  continue to reach the current auth UI.

## Fix Round 1 — Review Findings

- Locale-aware auth navigation now preserves the active route locale.
  - `getCurrentUser` redirects unauthenticated or invalid sessions to the
    matching `/${lang}/sign-in` route.
  - `AuthGate` receives the validated locale from the server page and redirects
    client-side session failures to that locale's sign-in route.
  - The localized sign-in page uses its route params for every successful-auth
    callback, returning to `/${lang}` instead of `/`.
- Proxy redirects now clone the incoming URL and update only `pathname`, so
  query strings are retained.
- Added regression coverage for query-string preservation, the `pt` → `pt-BR`
  preference match, API/`_next`/static matcher exclusions, unsupported locale
  dictionary validation, and locale-auth path construction.

### Fix validation

| Command | Outcome |
| --- | --- |
| `pnpm exec vitest run --config vitest.task-2-fix.config.ts` | Passed: 3 files, 9 tests. The temporary focused-test config was removed after the run. |
| `pnpm exec biome check` on changed Task 2/fix-round source and tests | Passed: 9 files checked, no diagnostics. |
| `pnpm exec tsc --noEmit` | Passed. |
| `pnpm build` | Passed. Next.js 16.3.5 compiled, type-checked, generated both locale and sign-in routes, and recognized the Proxy. |
