# Internationalization (i18n) & Localized Strings

## Rule
Hardcoding user-facing strings (such as button labels like "Retry Connection", "Sign in", headings, error messages, or placeholders) directly in JSX or UI components is strictly forbidden. Always use i18n translation keys.

## Rationale
- The application supports multi-language locales (`en`, `es`, `pt-BR`) via `next-intl`.
- Hardcoded strings in components bypass locale resolution, resulting in inconsistent UI and untranslated text for international users.
- Centralizing text strings in `src/messages/{locale}.json` preserves localization hygiene and domain clarity.

## Enforcement
- Use `useTranslations()` from `next-intl` (or Firebase UI translation helpers where applicable).
- Store all user-facing strings in `src/messages/{locale}.json` (`en.json`, `es.json`, `pt-BR.json`).
- Documented in canonical owner `CONVENTIONS.md`.
