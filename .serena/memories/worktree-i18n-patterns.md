# Worktree i18n Configurations & Architectural Patterns

Historical Git worktrees (.worktrees/old-*) reveal two primary architectural strategies for internationalization (i18n):

## 1. Worktrees using `next-intl` (Modern Route & Cookie Based)
- **old-4** (`next-intl: ^4.3.7`):
  - Path prefix routing: `defineRouting({ locales: ['en', 'es', 'pt-BR'], defaultLocale: 'en', localePrefix: 'always' })` in `src/i18n/routing.ts`.
  - Dynamic async request config with sub-namespace chunking (merges global `messages/${locale}.json` with dynamic `messages/editor/${locale}.json`).
- **old-5** (`next-intl: ^4.14.2`):
  - Cookie-driven resolution without URL route prefixes (`NEXT_LOCALE` cookie). Default locale is `pt-BR`.
  - Rich helpers in `src/lib/i18n-locale.ts`: `resolveServerLocale`, `resolveBrowserLocale`, `getLocalePersistenceAction` (synchronizes cookie + `localStorage`).
  - Architectural rule `i18n-object-type-labels.md`: built-in domain object types keep English keys in DB (Dexie), but display labels are resolved via i18n dictionaries.
- **old-6** (`next-intl: ^4.14.2`):
  - Shares the cookie & client persistence approach from `old-5` (`src/lib/i18n-locale.ts` and test suite `src/lib/i18n-locale.test.ts`).
- **old-7** (`next-intl: ^4.14.5`):
  - Cookie-based `getRequestConfig` loading localized JSON messages. Default locale `pt-BR`.

## 2. Worktree old-9: Custom In-House React Context i18n
- **No external i18n dependency** (pure TypeScript + React context).
- Locales: `['en', 'pt-BR']` (`defaultLocale: 'en'`).
- Fully typed message key resolution: `AppMessages` interface with dot-notation dot paths (`NestedMessageKey<AppMessages>`).
- Client context: `I18nProvider` and `useI18n()` hook (`src/components/i18n-provider.tsx`). Updates `document.documentElement.lang` and synchronizes `localStorage`.
- Comprehensive typed domain errors: `auth-errors.ts` translating Firebase/backend error codes into localized messages.

## 3. Worktrees without dedicated i18n
- **old**, **old-1**, **old-2**, **old-3**, **old-8**, **old-prototype**: No active i18n engine configured in package.json (mostly prototypes or English-only single-locale implementations; old-2 only had bundled third-party script assets).
