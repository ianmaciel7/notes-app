---
name: ladle
description: Guide and instructions for running, building, and authoring component stories with Ladle in this React / Next.js project.
---

# Ladle Component Sandbox Skill

This skill provides rules and conventions for using **Ladle** (`@ladle/react`), the fast Vite-powered React component sandbox.

## 1. Environment & Config
- **Configuration**: Managed in `.ladle/config.mjs` and `.ladle/components.tsx`.
- **Auto Rebuild & Watching**: Enabled via Vite server HMR and file watching in `.ladle/config.mjs`.
- **Global CSS**: Tailwind CSS v4 and theme CSS imported in `.ladle/components.tsx` (`import "../src/app/globals.css"`).
- **Scripts**:
  - `pnpm ladle:dev` (starts the interactive Ladle dev server with auto-rebuild / HMR on file changes)
  - `pnpm ladle:build` (builds static Ladle preview bundle to `build/`)
  - `pnpm ladle:preview` (previews the static build locally)

## 2. Story Authoring Conventions
- File pattern: `src/**/*.stories.@(ts|tsx|js|jsx)`
- Story export syntax:
  ```tsx
  import type { Story } from "@ladle/react";
  import { MyComponent } from "./my-component";

  export const Default: Story = () => <MyComponent />;

  export const CustomState: Story = () => (
    <MyComponent title="Custom" active />
  );
  ```

## 3. Verification & Build
- Verify static build: `pnpm ladle:build`
- Format & lint stories: `pnpm check`
