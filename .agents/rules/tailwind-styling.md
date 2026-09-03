---
trigger: glob
globs:
  - "src/**/*.tsx"
  - "src/**/*.css"
description: Rules for styling with Tailwind CSS v4, theme tokens, and typography.
---

# Tailwind CSS v4 Styling Rules

## 1. CSS-First Architecture
- This project uses **Tailwind CSS v4**.
- All theme tokens and configurations are declared inside `src/app/globals.css` using `@theme` directives:
  ```css
  @import "tailwindcss";

  @theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --font-sans: var(--font-geist-sans);
    --font-mono: var(--font-geist-mono);
  }
  ```
- **DO NOT create `tailwind.config.js` or `tailwind.config.ts`**.
- Do not use `@apply` directives in stylesheet files.

## 2. Component Design & Layout
- Layout follows the 3-pane architecture:
  - Left Sidebar: `w-60 border-r border-neutral-200 dark:border-neutral-800`
  - Main Center Workspace: `flex-1 overflow-y-auto`
  - Right Inspector Panel: `w-80 border-l border-neutral-200 dark:border-neutral-800`
- Support both Light and Dark mode using Tailwind's `dark:` variant.
- Use `@tailwindcss/typography` (`prose dark:prose-invert`) for rendered document prose.
