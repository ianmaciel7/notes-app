## 1. Project dependencies and i18n config

- [x] 1.1 Add `next-intl` to project dependencies.
- [x] 1.2 Add `routing`, `request`, and middleware configuration under `src/i18n` + `src/middleware.ts`.
- [x] 1.3 Update `next.config.ts` to use the next-intl plugin path.

## 2. Locale routes and translation provider

- [x] 2.1 Add locale-prefixed app layout under `src/app/[locale]/layout.tsx` with `NextIntlClientProvider`.
- [x] 2.2 Redirect root path `/` to `/en` in `src/app/page.tsx`.
- [x] 2.3 Move homepage content to `src/app/[locale]/page.tsx` and replace strings with `next-intl` translations.

## 3. Locale messages and guidance

- [x] 3.1 Add locale baseline catalogs in `src/messages/{en,es,pt-BR}.json`.
- [x] 3.2 Add a bootstrap doc section describing next-intl setup and verification steps.
