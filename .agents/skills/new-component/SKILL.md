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
   - Otherwise write it in `src/components/` following `CONVENTIONS.md`: kebab-case file, PascalCase component, named export, props derived from the underlying primitive or native element, no `any` or `@ts-ignore`.
   - Use semantic tokens from `DESIGN.md` (`bg-primary`, `text-muted-foreground`), never raw colors or manual `dark:` overrides. Use `gap-*` instead of `space-*`.
3. **Add a Ladle story.** Colocate `<name>.stories.tsx` and cover each variant, size, and interactive or error state. Match `src/components/ui/button.stories.tsx`. Follow `.agents/skills/ladle/SKILL.md`.
4. **Add a Vitest test only if there is logic.** Pure presentation is covered by the story. Anything with branching, formatting, or state gets a colocated `<name>.test.ts(x)` that tests observable behavior. Follow `TESTING.md`.
5. **Verify.** Run the smallest set that covers the change:
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
