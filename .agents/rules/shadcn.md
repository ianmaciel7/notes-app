# shadcn/ui rules

Binding for `src/components/ui/` and any feature component that consumes it
(`src/components/recall/`, `src/app/**`). Condensed from
`.agents/skills/shadcn/SKILL.md` and its `rules/*.md` for this repo's actual
configuration — check that skill for the full rationale and more examples.

## This project's configuration

From `components.json`: `style: "base-nova"`, `baseColor: "neutral"`,
`iconLibrary: "lucide"`, `rsc: true`, `registries: {}` (no external
registries configured — do not add one without a dependency/security review,
per spec.md §9.4). Tailwind v4, no `tailwind.config.js`; global tokens live
in `src/app/globals.css` (OKLCH), which is the only file to edit for token
changes. **`base` is `base` (Base UI, `@base-ui/react`), not Radix** — always
follow the "base" column in the examples below, not the "radix" one.

## Principles

1. Use existing components first — check `src/components/ui/` and
   `npx shadcn@latest search` before writing custom UI.
2. Compose, don't reinvent — combine existing primitives instead of a new
   one-off component.
3. Use built-in variants before custom styles (`variant="outline"`,
   `size="sm"`), and semantic color tokens (`bg-primary`,
   `text-muted-foreground`) — never raw values like `bg-blue-500`.

## Rules enforced in this repo

- **Base UI composition, not Radix.** Use `render={<Button />}` on
  triggers/closes (`DialogTrigger`, `SheetTrigger`, `PopoverTrigger`,
  `DropdownMenuTrigger`, `CollapsibleTrigger`, `DialogClose`, …), never
  `asChild`. Add `nativeButton={false}` when `render` swaps in a non-button
  element (an `<a>`, an `InputGroupAddon`, …). `Select` requires an `items`
  prop on the root and a `{ value: null }` placeholder entry — no bare
  `SelectValue placeholder="…"`. `ToggleGroup` takes a `multiple` boolean and
  an always-array `defaultValue`/`value` — no `type="single"`. `Slider`
  accepts a plain number for a single thumb. `Accordion` has no `type` prop;
  use `multiple` and an array `defaultValue`. Full comparison:
  `.agents/skills/shadcn/rules/base-vs-radix.md`.
- **Forms use `FieldGroup` + `Field`**, never a raw `div` with `space-y-*`.
  `InputGroup` children are `InputGroupInput`/`InputGroupTextarea`, never a
  raw `Input`/`Textarea`; a button inside an input uses `InputGroupAddon`,
  never absolute positioning. 2–7 mutually exclusive choices use
  `ToggleGroup`, not a manually looped `Button` with active-state tracking.
  Related checkboxes/radios use `FieldSet` + `FieldLegend`. Validation:
  `data-invalid` on `Field` + `aria-invalid` on the control; disabled:
  `data-disabled` on `Field` + `disabled` on the control.
- **Items live inside their Group.** `SelectItem` → `SelectGroup`,
  `DropdownMenuItem` → `DropdownMenuGroup`, `CommandItem` → `CommandGroup`.
- **`Dialog`/`Sheet`/`Drawer` always render a `Title`** (`className="sr-only"`
  if visually hidden) — required for accessibility, not optional.
- **Full `Card` composition** — `CardHeader`/`CardTitle`/`CardDescription`/
  `CardContent`/`CardFooter`, not everything dumped in `CardContent`.
- **No `isPending`/`isLoading` prop on `Button`.** Compose
  `<Spinner data-icon="inline-start" />` + `disabled`.
- **`TabsTrigger` only inside `TabsList`.** **`Avatar` always ships an
  `AvatarFallback`.**
- **Prefer a component over custom markup:** `Alert` for callouts, `Empty`
  for empty states, `Separator` instead of `<hr>`/`border-t` divs, `Skeleton`
  instead of a hand-rolled `animate-pulse` div, `Badge` instead of a styled
  `span` (including status colors — `<Badge variant="secondary">+20.1%</Badge>`,
  not `<span className="text-emerald-600">`).
- **Toast: this is a Base UI project, so use `toast` from
  `@/components/ui/toast`.** Not `sonner` — that's for Radix/React Aria
  projects only. (`sonner` is not a dependency here.)
- **Icons:** always `lucide-react` (the configured `iconLibrary`). Inside a
  `Button`, use `data-icon="inline-start"`/`"inline-end"` on the icon, never
  `mr-2 size-4`-style manual positioning — components size their own icons,
  so no sizing classes on an icon inside a shadcn component. Pass icons as
  component references (`icon={CheckIcon}`), never a string looked up in a
  map.
- **Styling:** `className` is for layout (`max-w-md`, `mt-4`) — never for
  overriding a component's color or typography; use a variant or a semantic
  token instead. No `space-x-*`/`space-y-*` — use `flex ... gap-*`. Use
  `size-*` instead of matching `w-*`/`h-*` pairs. Use `truncate`, not
  `overflow-hidden text-ellipsis whitespace-nowrap`. No manual `dark:`
  overrides — semantic tokens already carry light/dark. Use `cn()` for
  conditional class names, not template-literal ternaries. Never add
  `z-index` to `Dialog`/`Sheet`/`Popover`/`Tooltip`/`DropdownMenu`/etc. — they
  manage their own stacking.
- **Chat primitives are scaffolded but unused.** `message.tsx`,
  `message-scroller.tsx`, `bubble.tsx`, `attachment.tsx`, `marker.tsx` exist
  in `src/components/ui/` from the base-nova scaffold but nothing in
  `src/app` or `src/components/recall` imports them — Recall has no chat
  surface today. If one is added, compose these primitives (see
  `.agents/skills/shadcn/rules/chat.md`) rather than a hand-rolled scroll
  container; do not treat their presence as evidence a chat feature exists.

## Workflow

Before adding a new UI primitive: check `src/components/ui/` and
`npx shadcn@latest search` first. When adding one, run
`npx shadcn@latest docs <component>` and fetch the URLs before writing usage
code, then read the added files and check them against the rules above
before moving on — check for a missing sub-Group, a missing `Title`, a
`className` color override, or `asChild` where `render` belongs. Registries
are explicit only (`components.json` has `registries: {}`); never add or
point at one without asking, per spec.md §9.4.

## Verification note (2026-09-21)

Spot-checked `src/components/recall/` and `src/app/` against this rule set:
no `space-x-*`/`space-y-*`, no raw Tailwind status colors
(`text-emerald-*`/`bg-blue-*`/etc.), no `w-N h-N` pairs, and no `asChild`
usage were found. `data-icon` is in use. The codebase already conforms; this
file exists to keep it that way as it grows.
