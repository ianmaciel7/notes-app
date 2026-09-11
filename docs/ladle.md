# Ladle Component Guide

Ladle is a workbench for the production components, not a second application.
Start it with `pnpm ladle:dev`. The initial story is **UI / Button / Default**.

## Navigation

Keep exactly three top-level groups, in this order:

| Group | Content | Example title |
| --- | --- | --- |
| Components | Application components and compositions | `Components / App Header / Tabs` |
| UI | Reusable design-system primitives | `UI / Button` |
| Docs | Authoring guides and architecture documentation | `Docs / Workspace` |

Group related parts under their area instead of repeating a flat list of file
names. Prefer two or three title levels. Use Title Case and short scenario names
such as `Default`, `Interactive`, `States`, `Empty`, or `Gallery`. Keep distinct
states; do not create two stories that render the same scenario.

Ladle derives lowercase URL IDs from titles and exports. Its default label
formatting uses sentence case, so `.ladle/config.mjs` applies a navigation-only
capitalization rule and preserves the **UI** acronym. Application text, theme
tokens, and machine-readable metadata are not rewritten.

## Authoring

Keep component stories beside their implementations as `*.stories.tsx` and
Markdown documentation under `docs/`. Set a static title explicitly; filenames
alone must not create additional root groups. In MDX, use `<Meta title="Docs/Ladle" />`
without spaces around `/`: this Ladle version splits the final title into a
story name before trimming, and spaced separators can create a blank group.

```tsx
import type { Story, StoryDefault } from "@ladle/react";
import { Button } from "./button";

export default {
  title: "UI / Button",
} satisfies StoryDefault;

export const Default: Story = () => <Button>Save</Button>;
```

Use `Story<Props>` for controls. Put `args` and `argTypes` on the individual story
unless every story in that file supports the same controls. Use a literal
`storyName` only when an existing export needs a shorter display name. Titles
and story names must remain statically analyzable by Ladle.

## Context and Isolation

Use production components, styles, and tokens. `.ladle/components.tsx` owns the
shared application translations and visual theme; do not copy message objects
or nest identical internationalization providers in ordinary stories.

Keep simple components isolated. Give integrated stories only their required
real providers and production layout frame. Do not add an app-wide provider,
mock a primitive, or create a generic wrapper simply to make every story alike.

Use deterministic, disposable fixtures. Reset story-owned state, storage,
timers, listeners, and subscriptions; do not clear unrelated application data.
Keep external services mocked or disconnected. Do not use production credentials
or private data in the sandbox. A catalog check is not an audit of every
integrated story's persistence or external connections.

## Documentation

This guide is imported by `docs/ladle.stories.mdx`, so it has a single source of
truth. Workspace architecture remains under **Docs / Workspace**. The main
content document exposes its English/Portuguese control only on that story;
the side-panel document does not display an unsupported language selector.

## Verification

```sh
node --test scripts/quality/ladle-catalog.test.mjs
pnpm ladle:build
pnpm typecheck
pnpm test:unit
pnpm lint
pnpm metrics
```

The catalog regression test uses Ladle's public `@ladle/react/meta` API to check
actual discovery, root groups, the default story, and documentation coverage.
The final `*` in `storyOrder` keeps accidental new groups visible for diagnosis
instead of silently hiding their stories; the test rejects those groups.

A successful build does not prove TypeScript correctness, behavior, or visual
parity. Open the exact story, wait for its expected content, and exercise its
controls and overlays. Verify keyboard navigation, focus, relevant widths,
light/dark themes, and state reset for the scenarios being changed.

## Official References

- [Stories and static naming](https://ladle.dev/docs/stories/)
- [Configuration and navigation order](https://ladle.dev/docs/config/)
- [Providers](https://ladle.dev/docs/providers/)
- [Decorators](https://ladle.dev/docs/decorators/)
- [Markdown and MDX](https://ladle.dev/docs/mdx/)
- [Metadata](https://ladle.dev/docs/meta/)
