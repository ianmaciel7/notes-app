---
name: new-component
description: Add a UI component to the notes-app the repo's way — shadcn first, then a Ladle story, a Vitest test when there is logic, and the boundary and lint checks. Use when the user asks to add, create, or scaffold a UI component.
disable-model-invocation: true
metadata:
  short-description: Scaffold a shadcn/Base UI component with story, test, and checks
---

# New Component

Add a component in the order the repository's owners expect. Read only the owner you need at each step.

## Inputs

The component name (kebab-case) and what it should do. If the user only names a component, infer the smallest useful behavior and state it before building.

## Steps

1. **Check for an existing component.** Run `rtk pnpm dlx shadcn@latest search <name>` and look in `src/components/ui/`. Reuse or compose existing components before writing a new one. Follow `.agents/skills/shadcn/SKILL.md` for the CLI and its styling rules.
2. **Add or write it.**
   - If shadcn has it: `rtk pnpm dlx shadcn@latest add <name>`. Do not hand-edit the vendored output beyond what the design system requires.
   - Otherwise write it in `src/components/` following `CONVENTIONS.md`: kebab-case file, PascalCase component, named export, props derived from the underlying primitive or native element when that improves the API, no `any` or `@ts-ignore`. Name the component by its durable product responsibility, not by whichever primitive happens to be its root.
   - Use semantic tokens from `DESIGN.md` (`bg-primary`, `text-muted-foreground`), never raw colors or manual `dark:` overrides. Use `gap-*` instead of `space-*`.
   - Before adding `className` to a primitive, open `src/components/ui/<primitive>.tsx` and use its `variant`/`size` axes (`Button` has `icon-xs`, `icon-sm`, `sm`). Never override a size with `size-*`/`h-*`, and use the Tailwind scale instead of `text-[13px]`-style values (`button-size-variant`, `prefer-standard-scale`).
   - Naming check: name it after what it renders and where it renders, using `CONTEXT.md` terms (collection of Spaces = `Spaces*`, one Space = `Space*`). When moving or extracting an existing component, do not keep its old name or the host file name as a prefix without checking both. A `sidebar`/`dialog`/`sheet`/`drawer`/`popover` word before the role suffix requires that primitive in the file (`name-matches-surface`).
   - Test ids: every `data-testid` starts with the file name (`<name>` or `<name>-<part>`). After moving, extracting, or renaming a component, grep the old name across `src/`, `e2e/`, and docs (component names, test ids, test descriptions) and leave zero matches (`testid-starts-with-component`).
   - Composition check: prefer one simple application component that composes installed shadcn/Base UI parts internally. Do not mirror the primitive's full compound API unless consumers genuinely need independently composable parts. Use Base UI `render={<Component />}` for behavior-bearing composition instead of custom `renderX` props or `asChild` compatibility layers.
   - Hook ownership check: when the component has a dedicated same-family hook (`Component` + `useComponent`), keep component-owned `useState`, effects, refs, transitions, navigation/subscriptions, and handlers derived from that state in the hook. The component should mainly map semantic state/actions to UI.
   - Surface check: overlays still live in their own files (`<name>-dialog.tsx`, `<name>-sheet.tsx`, etc.) when they own a standalone product surface. Application component files stay under 400 lines (`overlay-content-own-file`, `max-component-lines`).
3. **Add a Ladle story.** Colocate `<name>.stories.tsx` and cover each variant, size, and interactive or error state. Match `src/components/ui/button.stories.tsx`. Follow `.agents/skills/ladle/SKILL.md`.
4. **Add a Vitest test only if there is logic.** Pure presentation is covered by the story. Anything with branching, formatting, or state gets a colocated `<name>.test.ts(x)` that tests observable behavior. Follow `TESTING.md`.
5. **Verify.** Run the smallest set that covers the change:
   - `rtk pnpm check:conventions`, `rtk pnpm check:naming`, and `rtk pnpm check:ui-pattern` (rules above)
   - `rtk pnpm lint`
   - `rtk pnpm check:types`
   - `rtk pnpm deps:check`
   - `rtk pnpm test` when a test was added
   - Optionally `rtk pnpm ladle` to check the story and its a11y panel.
6. **Report.** List the files added, the checks run with their results, and anything skipped and why.

## Guardrails

- Do not add suppressions, lower thresholds, or skip hooks to get a check to pass.
- Do not add dependencies without saying so and getting a yes.
- Keep the change to the component. Unrelated cleanup goes in a separate change.
