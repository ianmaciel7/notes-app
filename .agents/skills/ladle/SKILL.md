---
name: ladle
description: Use when authoring, fixing, reviewing, or validating Ladle React component stories; when a story is blank, visually wrong, missing app context, has broken theme/styles, or must match the real Next.js workspace behavior.
---

# Ladle Component Sandbox Skill

Use Ladle as a faithful component workbench, not a parallel UI. A story should import the real component, provide the same required providers/data shape as the app, and expose behavior and appearance that would regress in production.

## Confirmed Local Setup
- Package manager: `pnpm`. Scripts in `package.json`: `pnpm ladle:dev`, `pnpm ladle:build`, `pnpm ladle:preview`, `pnpm check`, `pnpm test:unit`.
- Installed versions from `pnpm-lock.yaml`: `@ladle/react` 5.1.1, Vite 6.4.3, Tailwind CSS 4.3.3, `@tailwindcss/postcss` 4.3.3, Playwright 1.62.1.
- Config files: `.ladle/config.mjs` sets `stories: ["src/**/*.stories.@(js|jsx|ts|tsx)"]` and `defaultStory: "button--default"`. `.ladle/components.tsx` imports `../src/app/globals.css` and is the global browser-only provider. There is no project `vite.config.*`; Ladle uses its own Vite integration plus its defaults.
- Tailwind v4 is wired through `postcss.config.mjs` with `@tailwindcss/postcss`.

## Authoring Rules
- Keep stories beside components under `src/**/*.stories.tsx`; export functions typed with `Story<Props>`. Use `StoryDefault<Props>` with static `title`, `meta`, `args`, and `argTypes` only when they materially improve controls or navigation.
- Import the implementation and app helpers directly. Do not recreate component markup, copy styles, or make a fake version of behavior inside the story.
- Match real context: use the same i18n, theme, shell, router, store, repository, and data contracts the component depends on. Prefer global providers in `.ladle/components.tsx` for app-wide requirements such as `NextIntlClientProvider` and theme synchronization; use per-file decorators for component-specific shells or fixtures.
- Appearance fidelity matters: avoid global padding, borders, card wrappers, or colors that the production component does not have. If a component is normally inside `AppShellProvider`, `AppShellSurface`, a sidebar width, or a workspace route surface, reproduce that frame in the story.
- Cover the component contract, not every prop combination: default, empty/loading/error/disabled states when supported, long content, overflow, important widths, dark/light theme, menus, dialogs, keyboard/focus, and drag/drop or selection behavior.

## Next.js, Data, and Safety
- Ladle runs in Vite, not the Next.js server. Isolate server-only dependencies before importing components into stories. Add `next/image`, `next/link`, or `next/navigation` adapters only for components that actually need them, preserving the relevant contract instead of empty mocks.
- Use deterministic fixtures or controlled local stores. Do not use production credentials, private data, real AI/API calls, or broad `process.env` exposure. For HTTP scenarios, use Ladle/MSW only when MSW is enabled and handlers are scoped to the story.
- Reset persisted state that can contaminate other stories: localStorage, IndexedDB/Dexie fixtures, singleton stores, timers, dates, random IDs, and locale-sensitive values.

## Verification
- `pnpm ladle:build` proves the static Ladle bundle builds; it does not type-check the project because Vite transpiles TypeScript. Run the relevant TypeScript/unit checks too.
- For visual/behavior checks, open the exact `?story=...` URL. Verify the expected text or role is visible in the canvas, inspect console errors, and test real interactions with role/name/label locators. For overlays, open them before judging layout, focus, scroll, or accessibility.
- Use preview/snapshot flows only after stabilizing data, viewport, fonts, theme, dates, and browser. Ladle’s `meta.json` can discover stories, but wait for expected content, not only generic story-loaded markers.

## Sources Checked
Official docs checked 2026-09-10: Ladle config, stories, TypeScript, controls, providers, Next.js, MSW, addons, visual snapshots; Vite features; Tailwind class detection/PostCSS; Playwright best practices; Agent Skills specification. Community checks: tajo/ladle #603 for Tailwind v4 missing styles and #629 for early `data-storyloaded`; treat their workarounds as evidence to investigate, not project rules, until reproduced locally.
