## Context

The Next.js app currently has only default App Router files and no locale-aware routing. The project already has a standard shadcn/ui and Biome baseline, so next-intl should be added as an additive bootstrap requirement without changing the visual architecture.

## Goals / Non-Goals

**Goals:**
- Add a minimal, reproducible next-intl baseline using App Router conventions.
- Add locale-aware routing and middleware so localized paths are consistently handled.
- Add typed message loading and a small bilingual sample surface to verify localization.
- Document the new bootstrap workflow for contributors.

**Non-Goals:**
- No advanced translation management integrations (no CMS/PMS).
- No additional language switcher UI in this change.
- No runtime locale persistence beyond URL segment resolution.

## Decisions

- Use `next-intl` official App Router pattern (`routing.ts`, `request.ts`, middleware) rather than manually managing locale parsing in each route.  
  - **Why:** This keeps locale negotiation, validation, and message loading consistent and future-friendly.
  - **Alternative:** Manual middleware would bypass next-intl plugin support and add repeated logic across app segments.
- Keep locale files under `src/messages/*.json` and reference them through `next-intl` request-time loading.
  - **Why:** Centralized, explicit locales are simple for bootstrap and scale cleanly as locales grow.
  - **Alternative:** Embedding translations in code for speed would be brittle and harder to audit.
- Introduce `/[locale]` route segment with a root redirect (`/` → `/en`) instead of rewriting all pages.
  - **Why:** This matches shadcn/Next templates and keeps locale boundaries explicit.
  - **Alternative:** Global layout URL parameterization without a dedicated segment increases coupling with middleware behavior.
- Preserve existing `src/app/layout.tsx` as root shell and place `NextIntlClientProvider` in `src/app/[locale]/layout.tsx`.
  - **Why:** Keeps current HTML shell/metadata behavior stable while localizing content where it is consumed.

## Risks / Trade-offs

- [Risk] Locale paths may confuse tooling expecting non-prefixed routes. → Mitigation: document required paths in bootstrap docs and default redirect from `/` to `/en`.
- [Risk] Missing message keys in non-default locales can cause silent text gaps. → Mitigation: keep shared keys minimal and add future key-audit checks in CI after this baseline.
- [Risk] `next-intl` upgrade version changes plugin API. → Mitigation: pin package and keep setup in one small module (`src/i18n/*`) for easier migration.

## Migration Plan

- Merge this change as a baseline update.
- Run migration commands: `pnpm install`, `pnpm lint`, and `pnpm dev` and validate `/en` and fallback behavior.
- No rollback scripts needed for this additive setup; removing locale segment and middleware is reversible by restoring baseline files from git.
