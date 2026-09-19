# shadcn/ui Rules

Use this rule when creating, modifying, or reviewing shared UI in
src/components/ui/ or feature components that consume it.

## Project source of truth

- This repository uses shadcn/ui with the base-nova style.
- The shadcn configuration is in components.json; keep it authoritative.
- Components are colocated in src/components/ui/.
- The configured aliases are:
  - @/components -> src/components
  - @/components/ui -> src/components/ui
  - @/lib -> src/lib
  - @/lib/utils -> src/lib/utils
  - @/hooks -> src/hooks
- The project uses @/* -> src/* from tsconfig.json.
- Tailwind CSS is v4. There is no Tailwind config file to edit for ordinary
  component work; global tokens and utilities live in src/app/globals.css.
- components.json uses CSS variables, neutral as the base color, no class
  prefix, Lucide as the icon library, RSC support, and rtl: false.
- The repository uses pnpm, Biome, Next.js 16, React 19, and TypeScript.

## Naming conventions

- Follow shadcn suffix conventions: root components are bare nouns (e.g., `Card`, `Button`, `Dialog`); sub-components are compound nouns (`CardHeader`, `DialogContent`, `AlertDescription`).
- `Screen`, `View`, `Page`, and `Panel` are **not** valid shadcn suffixes. Name feature components after what they visually **are**, not what they functionally do (e.g., `SignInCard` not `SignInScreen`).
- Feature components in a domain folder must not repeat the folder name (e.g., `SignInCard` in `auth/`, not `AuthSignInCard`).
- File name mirrors the export: `sign-in-card.tsx` exports `SignInCard`.

## Component architecture

- Prefer the existing component before adding a new primitive. Review the
  matching file in src/components/ui/ and follow its API and styling shape.
- Treat new component creation as the last option. Before writing a new
  component, follow this discovery order: (1) inspect and compose the local
  component and feature code, (2) search the shadcn/community registries with
  the `search-registry-items` skill using a short component keyword, and (3)
  review at least one relevant real-world reference when the interaction or
  layout is non-trivial. Use the reference library below according to the
  task; prefer real product flows for UX and component galleries for visual
  direction.
- Real product flows and app UI: https://mobbin.com/, https://pageflows.com/,
  https://refero.design/, https://nicelydone.club/, https://www.saasframe.io/,
  https://uisources.com/, and https://saasui.design/.
- SaaS and landing pages: https://saaswebsites.com/,
  https://saaslandingpage.com/, https://saaspo.com/, https://land-book.com/,
  https://www.lapa.ninja/, https://landingfolio.com/, and
  https://onepagelove.com/.
- Web and visual exploration: https://recent.design/, https://siteinspire.com/,
  https://www.awwwards.com/, https://minimal.gallery/, https://httpster.net/,
  https://collectui.com/, https://layers.to/, https://dribbble.com/,
  https://www.behance.net/, https://www.figma.com/community/, and
  https://www.designmd.co/.
- Design systems and focused patterns: https://designsystemsrepo.com/,
  https://designsystems.surf/, https://navbar.gallery/, https://footer.design/,
  https://bentogrids.com/, and https://muz.li/.
- Use references to understand interaction states, information hierarchy,
  accessibility, responsive behavior, and failure/recovery paths. Do not copy
  visual styling blindly, treat a screenshot as proof of usability, or add a
  dependency without checking its code, license, accessibility, and fit with
  the repository's Base UI/shadcn conventions.
- If no suitable equivalent exists, record the search terms and why local,
  registry, and reference options were insufficient in the implementation
  notes or pull request description. A new component must still compose from
  existing primitives wherever possible and explain its distinct boundary.
- Shared primitives should remain small, composable wrappers around the
  underlying primitive or semantic HTML element.
- Interactive primitives in this repository use Base UI packages such as
  @base-ui/react/button, @base-ui/react/dialog, @base-ui/react/menu,
  @base-ui/react/tabs, and related packages. Use Base UI when the local
  component already does so; do not introduce Radix-only APIs into a Base UI
  wrapper.
- Use "use client" only when the component or its primitive requires client
  behavior, state, effects, event handlers, or browser APIs. Keep static
  components server-compatible.
- Preserve the component's exported public API. If adding a subcomponent,
  export it from the same module with the other related parts.
- Feature components that wrap a shadcn primitive must derive their public
  props from that primitive. Use an `interface extends Omit<React.ComponentProps<typeof Primitive>, ...>` shape for controlled props, then forward the remaining props to the primitive.
- Prefer primitive prop types from the underlying library, or
  React.ComponentProps<"element"> for native wrappers. Avoid any and avoid
  duplicating DOM props by hand.
- Forward remaining props to the rendered primitive/element. Preserve refs and
  polymorphic composition according to the primitive's existing API.

## Styling and composition

- Use cn for class merging. In this repository it is available from cn and is
  re-exported by src/lib/utils.ts; follow the import style of the surrounding
  component.
- Use class-variance-authority (cva and VariantProps) for reusable variants
  and sizes. Keep variant names explicit and type-safe, and define sensible
  defaultVariants.
- Keep base styles in the component and allow a className override. Follow
  the established pattern of passing the merged class name to the primitive.
- Use semantic design tokens such as bg-background, text-foreground,
  bg-primary, text-muted-foreground, border-input, ring-ring, and
  text-destructive. Do not hard-code colors when a token exists.
- Use the existing radius scale (rounded-lg, rounded-xl, etc.) and spacing
  conventions. Do not introduce arbitrary design tokens without updating the
  global theme deliberately.
- Keep state styling accessible and consistent: include visible focus styles,
  disabled styles, invalid/error styles where relevant, and dark-mode variants
  when the component has a color-dependent state.
- Use data-slot="..." on the root and meaningful subparts. Existing CSS
  frequently targets these slots, including descendant and state selectors.
  Keep slot names stable and kebab-case.
- For Base UI polymorphic composition, follow the local render, mergeProps,
  and useRender patterns where the existing component uses them. Do not
  replace them with an unrelated asChild implementation.

## Icons and content

- Use icons from lucide-react; do not add a second icon library for ordinary
  UI.
- Follow the existing *Icon naming convention, for example XIcon or
  ChevronDownIcon.
- Let the component's icon sizing styles control ordinary icons. Use the
  component's icon size variants rather than ad-hoc icon dimensions.
- Icon-only controls must have an accessible name using aria-label, visible
  text, or an equivalent labelling relationship.
- Preserve meaningful text and semantic elements. Use sr-only text when a
  visual control needs a non-visible accessible label.

## Existing patterns to preserve

- button.tsx: Base UI Button plus CVA variants and sizes; exports both Button
  and buttonVariants.
- dialog.tsx, drawer.tsx, sheet.tsx, and menu components: client-side Base UI
  roots with portal, overlay, trigger, content, close, and labelled
  subcomponents as appropriate.
- input.tsx, textarea.tsx, label.tsx, and form-related components: native or
  Base UI controls with tokenized focus, disabled, and invalid states.
- card.tsx, table.tsx, skeleton.tsx, and similar structural components:
  server-compatible wrappers with stable data-slot markers.
- attachment.tsx, badge.tsx, bubble.tsx, empty.tsx, input-group.tsx,
  sidebar.tsx, tabs.tsx, toggle.tsx, and toggle-group.tsx: use the established
  CVA and slot patterns when adding related variants.
- Stories live beside components as *.stories.tsx and use Ladle. Add or update
  stories for meaningful variants, sizes, icon states, and edge cases.

## Configuration and dependencies

- Reuse installed dependencies before adding new ones. Relevant UI
  dependencies include @base-ui/react, @shadcn/react,
  class-variance-authority, cn, lucide-react, cmdk, date-fns,
  embla-carousel-react, input-otp, react-day-picker,
  react-resizable-panels, recharts, and tw-animate-css.
- Do not manually rewrite or remove shadcn-managed configuration without a
  clear reason. Keep components.json valid JSON and consistent with the
  generated component layout.
- Keep global token changes in src/app/globals.css; do not hide global theme
  changes inside one component.

## Next.js and repository constraints

- Before changing Next.js code, read the relevant current documentation under
  node_modules/next/dist/docs/; this project explicitly warns that its
  Next.js version has breaking changes.
- Preserve the Next.js-managed block in AGENTS.md.
- Keep application code under src/ and shared UI under src/components/ui/.
- Use the repository's pnpm scripts. Use Biome for formatting, linting, and
  import organization; do not introduce a competing formatter or linter.
- Keep imports organized in the style Biome produces. Prefer the configured
  aliases for cross-directory imports and relative imports for tightly
  colocated files such as stories.

## Validation checklist

After UI changes, run the smallest relevant checks and then the broader check
when practical:

1. pnpm lint
2. pnpm format when formatting changed or is uncertain
3. pnpm build for changes affecting routes, client/server boundaries, or
   shared primitives
4. pnpm ladle:build for component/story changes when practical

Before finishing, verify that:

- the component still exposes the expected exports and props;
- keyboard, focus, disabled, invalid, and modal/menu interactions remain usable;
- icon-only controls are labelled;
- data-slot names and token classes are consistent with neighboring files;
- no unnecessary dependency or global CSS change was introduced.

## Naming conventions for feature components

- **No namespace repetition.** A feature component that lives inside a domain
  folder must not repeat the folder name in the component or file name.
  - ✅ `src/components/auth/sign-in-screen.tsx` → exports `SignInScreen`
  - ❌ `src/components/auth/sign-in-auth-screen.tsx` → exports `SignInAuthScreen`
  - The `auth/` folder already provides the namespace; repeating `-auth-` in the
    filename and export name is redundant noise.
- **File suffix pattern:** `[kebab-feature]-[role].tsx` where `role` is a
  semantic role such as `screen`, `form`, `button`, `dialog`, `card`, etc.
  Examples: `sign-in-screen.tsx`, `note-editor-form.tsx`, `tag-picker-button.tsx`.
- **Export name pattern:** `[PascalFeature][Role]` without the domain prefix.
  Examples: `SignInScreen`, `NoteEditorForm`, `TagPickerButton`.
- **Type/interface pattern:** Suffix with `Props` → `SignInScreenProps`.
  When re-exporting or aliasing a third-party props type internally, use
  `Firebase<Original>` or similar to avoid collision with the local export.

