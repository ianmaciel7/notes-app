# Shadcn First

All new UI components, primitives, blocks, and reusable interface parts MUST be implemented as if they were first-party shadcn/ui components for this repository.

The source of truth is the project's `components.json` plus the current official shadcn/ui source that matches the configured style and primitive stack. Do not copy conventions from a different shadcn style or primitive family when they conflict with the project configuration.

## Component selection

Before creating custom UI:

1. Reuse an existing project component when it already satisfies the requirement.
2. Prefer the official shadcn/ui component when one exists.
3. Prefer configured registries, then reviewed trusted registry components.
4. Compose existing shadcn primitives before creating a new primitive.
5. Create custom UI only when the requirement cannot be satisfied through reasonable composition or customization.

Search by functionality and synonyms before custom-building, and inspect the relevant official component source before implementation.

## Native shadcn implementation contract

Every new custom UI component MUST follow the same structural and implementation conventions used by current shadcn/ui components:

- Use the project's configured shadcn primitives and existing `@/components/ui` components instead of recreating equivalent behavior with raw markup.
- Preserve semantic HTML and the accessibility behavior of the underlying primitive, including keyboard interaction, focus behavior, disabled state, ARIA attributes, and controlled/uncontrolled semantics.
- Type component props from the underlying DOM element or primitive whenever possible, such as `React.ComponentProps<"div">` or `React.ComponentProps<typeof Primitive.Root>`, rather than duplicating native prop definitions.
- Forward applicable native/primitive props to the correct root element and preserve consumer-provided event handlers and accessibility props.
- Merge `className` with the project `cn()` helper rather than replacing consumer classes.
- Use semantic theme tokens and existing shadcn/Tailwind conventions. Prefer tokens such as `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `ring-ring`, and existing project variables over hard-coded colors.
- Use the configured icon library from `components.json` for interface icons. Decorative icons must not create duplicate accessible names.
- Use CVA for components with meaningful visual variants when that matches the equivalent shadcn pattern. Keep variant names, size names, defaults, and composition consistent with existing project components.
- Prefer primitive/native state attributes such as `data-state`, `aria-*`, `disabled`, and `checked` over custom JavaScript state classes when the primitive already exposes the state.
- Avoid unnecessary wrappers, duplicated primitives, one-off abstractions, custom CSS, and arbitrary values when existing shadcn composition or Tailwind utilities can express the same behavior.
- Keep exported subcomponents composable and independently reusable when the component naturally has parts, following shadcn patterns such as `CardHeader`, `CardContent`, and `DialogTrigger`.
- Keep DOM structure, naming, prop order, class composition, variants, states, focus styles, transitions, responsive behavior, and accessibility conventions aligned with the closest official shadcn component for the configured project style.

## `data-slot` contract

`data-slot` is mandatory for every new reusable UI component.

- Add a stable `data-slot` attribute to the root rendered element of every exported component and meaningful exported subcomponent.
- Use lowercase kebab-case names that describe the component contract, for example `data-slot="app-header"`, `data-slot="app-header-actions"`, and `data-slot="sidebar-item"`.
- Match official shadcn naming when extending or wrapping an existing shadcn component.
- Do not generate dynamic slot names from display text, IDs, indexes, translated labels, or runtime data.
- Do not remove an existing official `data-slot` attribute when wrapping or customizing a shadcn component.
- When variants or sizes are part of the component API and the equivalent shadcn pattern exposes them as data attributes, also expose stable attributes such as `data-variant` and `data-size` so parents, descendants, and external styles can target the component consistently.
- Prefer Tailwind data selectors such as `data-[state=open]:...`, `data-[variant=...]`, `group-data-[...]`, `peer-data-[...]`, `has-data-[slot=...]`, and `group-has-data-[slot=...]` when they match current shadcn conventions.

## Completion check

A new UI component is not complete until it has been compared with the closest existing project component and the closest current official shadcn/ui component for the configured style.

Before finishing, verify:

- native or shadcn primitives were reused where available;
- the public API follows shadcn composition patterns;
- `data-slot` exists on every exported component root and meaningful subcomponent;
- variants and state attributes follow shadcn conventions;
- theme tokens, focus states, responsive behavior, and accessibility are preserved;
- custom code exists only where the official/project components cannot reasonably satisfy the requirement.

Do not install third-party registry components blindly. Review dependencies, imports, accessibility, compatibility, maintenance, and license before adding them.
