# Code Language Rule

- Always write code in English.
- Use English for variable names, function names, types, components, filenames, and technical comments.
- For user-facing or system-generated messages, prefer an internationalization (i18n) system over hardcoded strings.

## Internationalization (Next.js App Router)

- Treat a locale as a language and regional formatting preference, using standard identifiers such as `en-US` or `pt-BR`.
- Prefer the browser's `Accept-Language` preferences when selecting the initial locale, with an explicit supported-locale fallback.
- For localized routing, use a locale sub-path or domain. When using sub-path routing, place App Router special files under `app/[lang]/` and redirect requests without a supported locale in `proxy.ts`.
- Keep translations in per-locale dictionaries keyed by stable message identifiers; do not duplicate translated copy in components.
- Validate route locale parameters with a type guard such as `hasLocale` and call `notFound()` for unsupported locales instead of allowing a runtime dictionary failure.
- Load dictionaries in Server Components or server utilities. Use `next/root-params` to read a locale shared by nested Server Components without prop drilling; do not use it in Client Components, Server Actions, or Route Handlers.
- Use `generateStaticParams` for statically rendered localized routes when the supported locale set is known.
- Set the document `<html lang>` attribute from the active locale.
- For Client Components, receive the resolved locale/dictionary through the established app i18n provider or props; keep server-only dictionary loading out of client bundles.

Reference: [Next.js Internationalization guide](https://nextjs.org/docs/app/guides/internationalization)
