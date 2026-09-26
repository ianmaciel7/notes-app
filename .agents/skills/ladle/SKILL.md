---
name: ladle
description: Develop, preview, and test isolated UI components with Ladle. Use when creating new UI components, writing stories, testing accessibility, or debugging layout and theme variants.
metadata:
  short-description: UI component isolation and testing with Ladle
---

# Ladle Component Development & Testing

Ladle is the primary tool in this repository for developing, previewing, and verifying React UI components in isolation without launching the full Next.js application runtime.

## Key Workflows

### 1. Authoring Stories
- Place stories alongside components or inside `src/` matching pattern `*.stories.{tsx,jsx}`.
- Every export from a `.stories.tsx` file becomes an isolated story in the Ladle catalog.

```tsx
import type { StoryDefault, Story } from "@ladle/react";
import { Button } from "./button";

export default {
  title: "Components/Button",
} satisfies StoryDefault;

export const Primary: Story = () => <Button variant="default">Click me</Button>;
export const Secondary: Story = () => <Button variant="secondary">Cancel</Button>;
```

### 2. Available Scripts
- `pnpm ladle`: Start the local development server (fast hot-reloading).
- `pnpm ladle:build`: Build static Ladle production assets into `build/`.
- `pnpm ladle:preview`: Serve the built static assets locally.

### 3. Built-in Addons Configured
- **Accessibility (`a11y`)**: Enabled by default; reports axe accessibility violations directly in the story preview.
- **Theme (`theme`)**: Default state is `light`, toggleable to `dark`.
- **Responsive Width (`width`)**: Resize viewport dynamically across mobile and desktop breakpoints.
- **Source View (`source`)**: Inspect component implementation and invocation snippets.
