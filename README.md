# notes-app

Next.js application using React, TypeScript, Tailwind CSS, and shadcn/ui primitives.

## Getting started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
pnpm dev       # development server
pnpm build     # production build
pnpm start     # production server
pnpm lint      # Biome checks
pnpm format    # format files with Biome
pnpm ladle         # develop shared components
pnpm ladle:build   # build the static component catalogue
pnpm ladle:preview # preview the static catalogue
pnpm dev:all       # run Next.js, Ladle, and Firebase emulators together
```

Stories live beside the component they document and use the `*.stories.tsx`
naming pattern.

## Project layout

- `src/app/`: routes, layout, global CSS, and favicon.
- `src/components/ui/`: shared UI primitives.
- `src/hooks/`: reusable hooks.
- `src/lib/`: shared utilities.
- `public/`: static assets.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the repository structure and configuration references.

Firebase authentication and emulator setup is documented in
[docs/FIREBASE_AUTHENTICATION.md](docs/FIREBASE_AUTHENTICATION.md).

## Internationalization (i18n)

The project supports `en` (default) and `pt-BR` locales. Route URLs are prefixed with the locale (e.g. `/[lang]/`).

When adding or updating user-facing copy:

1. **Add the message key** to the `AppMessages` interface in `src/lib/i18n/types.ts`.
2. **Add translations to all catalogs**: update `src/app/[lang]/dictionaries/en.json` and `src/app/[lang]/dictionaries/pt-BR.json`.
3. **In Server Components**: load the dictionary asynchronously using `const dictionary = await getDictionary(lang)` and access keys directly (e.g. `dictionary.home.title`).
4. **In Client Components**: use the `useI18n()` hook and call `t("section.key")` for app-owned UI copy (e.g. `t("common.loading")`).
5. **In Firebase Auth UI**: use `@firebase-oss/ui-core`'s `getTranslation(ui, ...)` for Firebase-owned labels/prompts, and `getAuthErrorMessage(error, t)` from `src/lib/i18n` for normalized authentication error handling.

See [docs/i18n-message-inventory.md](docs/i18n-message-inventory.md) for the complete message catalog and mapping inventory.
