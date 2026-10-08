# shadcn Guard Coverage

The project uses shadcn Base Nova with Base UI primitives.

## Boundary

- `src/components/ui/**`: owned shadcn implementation/registry layer.
- `src/components/firebase/**`: immutable upstream Firebase UI reference layer.
- application-owned code outside those reserved layers: guard-consumption
  layer.

Biome excludes both reserved component layers from ordinary application
lint/GritQL consumption: `ui/**` to avoid rewriting the owned registry
implementation and `firebase/**` because ADR 0004 treats it as an immutable
upstream reference. Firebase reference integrity is enforced separately by
`tests/unit/firebase-reference.test.ts` and its SHA-256 manifest.

## Active GritQL guards

| Guard | Enforces |
| --- | --- |
| `base-ui-no-as-child.grit` | no Radix-only `asChild` |
| `base-ui-api.grit` | Base UI API compatibility and toast ownership |
| `required-accessible-parts.grit` | required accessible compound parts |
| `group-composition.grit` | grouped primitive ownership |
| `input-group-composition.grit` | InputGroup anatomy |
| `field-group-composition.grit` | FieldGroup anatomy |
| `fieldset-composition.grit` | FieldSet/FieldLegend anatomy |
| `card-composition.grit` | Card composition |
| `input-group-addon.grit` | InputGroup addon ownership |
| `tabs-composition.grit` | Tabs anatomy |
| `compound-component-anatomy.grit` | broad compound and chat component ownership |
| `overlay-composition.grit` | trigger/content/overlay composition |
| `sidebar-composition.grit` | Sidebar/provider ownership |
| `button-state.grit` | Button loading/state shape |
| `button-link-semantics.grit` | action vs navigation semantics |
| `button-icon.grit` | Button icon placement metadata |
| `icon-button-accessibility.grit` | accessible name for icon-only controls |
| `icon-sizing.grit` | component-owned icon sizing |
| `field-validation.grit` | invalid/disabled field pairing |
| `controlled-uncontrolled-state.grit` | controlled vs uncontrolled exclusivity |
| `semantic-color-tokens.grit` | semantic token usage |
| `no-manual-dark-colors.grit` | theme token ownership |
| `tailwind-composition.grit` | preferred Tailwind composition and Skeleton placeholder |
| `logical-properties.grit` | logical direction utilities |
| `conditional-classname-cn.grit` | `cn()` conditional composition |
| `prefer-shadcn-primitives.grit` | owned primitives over raw controls and hr |
| `overlay-stacking.grit` | no manual overlay z-index ownership |
| `canonical-import-aliases.grit` | canonical import aliases (@/components/ui, @/lib/utils, @/hooks) |
| `no-inline-styles.grit` | no inline style={{ ... }} in application code |
| `no-radix-imports.grit` | no direct @radix-ui/* imports (enforces Base UI ecosystem) |
| `exported-hook-location.grit` | exported hooks must live in `src/hooks/`, unless they read a context (shadcn `useSidebar` pattern) |
| `no-inline-hook-definition.grit` | no hook definitions (exported or not) inside component files; extract to `src/hooks/` (context accessors exempt) |
| `extract-stateful-hooks.grit` | warns when `useState`/`useReducer`/`useEffect`/`useRef`/`useCallback`/`useMemo`/`useForm`, or the stateful `@firebase-oss/ui-react` hooks `useUI`/`useSignInWithProvider`/`useOnUserAuthenticated`/`useRedirectError`, are called directly in a component file; extract to a hook in `src/hooks/` (files that own a context via `createContext` are exempt) |
| `component-props-type.grit` | warns when a `*Props` type/interface in a `.tsx` file is a bare object literal, when a PascalCase exported function component uses an inline props type, or when it omits its props parameter; use a named React/DOM-based props type or `ComponentProps<...>`, and spread props onto the root when applicable |

## `components.json` ownership

The manifest is authoritative for:

- `base-nova` style;
- RSC and TSX;
- Tailwind CSS path;
- neutral base color;
- CSS variables;
- aliases;
- Lucide;
- RTL setting;
- menu color/accent;
- registries.

## Runtime ownership

Base UI owns:

- focus management;
- focus return/trapping;
- portals;
- outside/Escape dismissal;
- keyboard interaction details;
- low-level ARIA wiring.

## Review ownership

Static guards do not decide:

- whether a wrapper is a good abstraction;
- naming quality;
- when a new primitive should exist;
- whether a built-in variant is semantically preferable;
- registry distribution strategy.

Those remain architecture/review decisions.
