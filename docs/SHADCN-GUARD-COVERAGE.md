# shadcn Concept Guard Coverage

This document maps the shadcn concepts used by this repository to the layer
that enforces them. "Covered" does not always mean GritQL: some concepts are
configuration, type-system, runtime-primitive, or repository-policy concerns.

## 1. GritQL-enforced concepts

| Concept | Enforcement |
| --- | --- |
| Base UI APIs | `base-ui-api.grit`, `base-ui-no-as-child.grit` |
| Composition / Compound Components / Component Anatomy | `compound-component-anatomy.grit`, specialized composition guards |
| Required accessible subparts | `required-accessible-parts.grit` |
| Group composition | `group-composition.grit` |
| Field / FieldGroup / FieldSet / FieldLegend | field guards |
| InputGroup | input-group guards |
| Card composition | `card-composition.grit` |
| Tabs composition | `tabs-composition.grit` |
| Sidebar / Provider ownership | `sidebar-composition.grit` |
| Trigger / Content / overlay ownership | `overlay-composition.grit` |
| Button loading composition | `button-state.grit` |
| Link semantics | `button-link-semantics.grit` |
| Button icon placement | `button-icon.grit` |
| Icon-only accessible names | `icon-button-accessibility.grit` |
| Component-owned icon sizing | `icon-sizing.grit` |
| Field invalid/disabled states | `field-validation.grit` |
| Controlled / uncontrolled state | `controlled-uncontrolled-state.grit` |
| Semantic design tokens / foreground pairing discipline | `semantic-color-tokens.grit` plus token configuration |
| Dark-mode token ownership | `no-manual-dark-colors.grit` |
| Tailwind composition | `tailwind-composition.grit` |
| Logical properties / RTL readiness | `logical-properties.grit` |
| Conditional class composition with cn() | `conditional-classname-cn.grit` |
| Prefer existing shadcn interactive primitives | `prefer-shadcn-primitives.grit` |
| Overlay z-index ownership | `overlay-stacking.grit` |

## 2. Biome, TypeScript, React, and Next.js coverage

These concepts are already better enforced by standard tooling than by a
repository-specific GritQL rule:

- TypeScript/TSX correctness.
- React and Next.js recommended lint domains.
- basic JSX accessibility and semantic interaction checks available in Biome.
- imports and unresolved types.
- React Server Component/client-boundary compile constraints.
- formatting, import organization, and the 80-column repository formatter.

## 3. `components.json`-enforced concepts

The shadcn project manifest is authoritative for:

- Style (`base-nova`).
- RSC.
- TSX.
- Tailwind CSS file/config integration.
- Base color (`neutral`).
- CSS variables.
- Tailwind prefix.
- aliases for components, UI, utils, lib, and hooks.
- icon library (`lucide`).
- RTL project setting.
- menu color and menu accent.
- configured registries.

These correspond to the shadcn concepts Style, Base configuration, Theming,
CSS Variables, Import Aliases, Icon Library, Base Color, Menu Color, Menu
Accent, RSC, TypeScript/TSX, and Registry configuration.

## 4. Base UI/runtime-enforced concepts

The underlying primitive should own these behaviors. Reimplementing them in
GritQL would be incorrect:

- Portal behavior.
- Overlay lifecycle.
- focus management and focus return.
- focus trapping.
- Escape/outside-interaction dismissal.
- keyboard interaction details.
- orientation behavior implemented by the primitive.
- low-level ARIA wiring produced by Base UI.
- controlled-state runtime behavior after the controlled/uncontrolled shape is
  validated statically.

## 5. Repository-policy concepts

These are real shadcn concepts but are not reliable AST invariants. They are
covered by `.agents/rules/shadcn.md`, code review, or the shadcn CLI workflow:

- Open Code and code ownership.
- Distribution.
- Registry, `registry.json`, `registry-item.json`, registry schemas, registry
  dependencies, package dependencies, namespaces, directory, authentication,
  GitHub registries, and programmatic registry API.
- Base and Style packages as distribution concepts.
- Presets.
- fonts, radius, theme color, chart color, and other design-system choices not
  inferable from a JSX node.
- CLI operations (`create`, `init`, `add`, `search`, `view`, `info`, `docs`,
  `build`, `migrate`, `preset`, `eject`).
- migrations.
- monorepo and local UI package organization.
- Blocks, Components, UI Components, Hooks, Lib, Pages, Files, and registry item
  type taxonomy.
- design-system distribution, override, extend, and mix-and-match.
- ownership and consistency as engineering principles.
- "use built-in variants before custom classes" when both are semantically
  valid.
- component naming based on its actual responsibility/root primitive.
- component responsibility boundaries and when a wrapper should exist.

## 6. Why there is no one-Grit-file-per-concept

shadcn spans source-code structure, configuration, distribution, runtime
behavior, accessibility, and design-system policy. Forcing Registry, Preset,
CLI, or Open Code into JSX AST checks would create fake coverage and noisy
false positives. The repository therefore treats a concept as covered when the
correct enforcement layer owns it.

Application-code GritQL guards intentionally exclude `src/components/ui/**`.
That directory is the project-owned shadcn implementation layer; consumption
rules apply to the rest of the application.
