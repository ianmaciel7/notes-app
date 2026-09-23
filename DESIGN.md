---
version: 1.0.0
name: notes-app-shadcn-design-system
description: Design system and component specification for Notes App based on shadcn/ui base-nova style with Base UI primitives, Tailwind CSS v4, and OKLCH color variables.

tokens:
  base-style: base-nova
  base-color: neutral
  css-framework: tailwindcss-v4
  primitives-library: "@base-ui/react"
  icons: lucide-react
  component-stories: "@ladle/react"

colors:
  light:
    background: "oklch(1 0 0)"
    foreground: "oklch(0.145 0 0)"
    card: "oklch(1 0 0)"
    card-foreground: "oklch(0.145 0 0)"
    popover: "oklch(1 0 0)"
    popover-foreground: "oklch(0.145 0 0)"
    primary: "oklch(0.205 0 0)"
    primary-foreground: "oklch(0.985 0 0)"
    secondary: "oklch(0.97 0 0)"
    secondary-foreground: "oklch(0.205 0 0)"
    muted: "oklch(0.97 0 0)"
    muted-foreground: "oklch(0.556 0 0)"
    accent: "oklch(0.97 0 0)"
    accent-foreground: "oklch(0.205 0 0)"
    destructive: "oklch(0.577 0.245 27.325)"
    border: "oklch(0.922 0 0)"
    input: "oklch(0.922 0 0)"
    ring: "oklch(0.708 0 0)"
    sidebar: "oklch(0.985 0 0)"
    sidebar-foreground: "oklch(0.145 0 0)"
    sidebar-primary: "oklch(0.205 0 0)"
    sidebar-primary-foreground: "oklch(0.985 0 0)"
    sidebar-accent: "oklch(0.97 0 0)"
    sidebar-accent-foreground: "oklch(0.205 0 0)"
    sidebar-border: "oklch(0.922 0 0)"
    sidebar-ring: "oklch(0.708 0 0)"
    chart-1: "oklch(0.87 0 0)"
    chart-2: "oklch(0.556 0 0)"
    chart-3: "oklch(0.439 0 0)"
    chart-4: "oklch(0.371 0 0)"
    chart-5: "oklch(0.269 0 0)"

  dark:
    background: "oklch(0.145 0 0)"
    foreground: "oklch(0.985 0 0)"
    card: "oklch(0.205 0 0)"
    card-foreground: "oklch(0.985 0 0)"
    popover: "oklch(0.205 0 0)"
    popover-foreground: "oklch(0.985 0 0)"
    primary: "oklch(0.922 0 0)"
    primary-foreground: "oklch(0.205 0 0)"
    secondary: "oklch(0.269 0 0)"
    secondary-foreground: "oklch(0.985 0 0)"
    muted: "oklch(0.269 0 0)"
    muted-foreground: "oklch(0.708 0 0)"
    accent: "oklch(0.269 0 0)"
    accent-foreground: "oklch(0.985 0 0)"
    destructive: "oklch(0.704 0.191 22.216)"
    border: "oklch(1 0 0 / 10%)"
    input: "oklch(1 0 0 / 15%)"
    ring: "oklch(0.556 0 0)"
    sidebar: "oklch(0.205 0 0)"
    sidebar-foreground: "oklch(0.985 0 0)"
    sidebar-primary: "oklch(0.488 0.243 264.376)"
    sidebar-primary-foreground: "oklch(0.985 0 0)"
    sidebar-accent: "oklch(0.269 0 0)"
    sidebar-accent-foreground: "oklch(0.985 0 0)"
    sidebar-border: "oklch(1 0 0 / 10%)"
    sidebar-ring: "oklch(0.556 0 0)"
    chart-1: "oklch(0.87 0 0)"
    chart-2: "oklch(0.556 0 0)"
    chart-3: "oklch(0.439 0 0)"
    chart-4: "oklch(0.371 0 0)"
    chart-5: "oklch(0.269 0 0)"

radii:
  base: "0.625rem" # 10px
  sm: "calc(var(--radius) * 0.6)" # 6px
  md: "calc(var(--radius) * 0.8)" # 8px
  lg: "var(--radius)" # 10px
  xl: "calc(var(--radius) * 1.4)" # 14px
  2xl: "calc(var(--radius) * 1.8)" # 18px
  3xl: "calc(var(--radius) * 2.2)" # 22px
  4xl: "calc(var(--radius) * 2.6)" # 26px

typography:
  font-sans: "Inter Variable, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  font-mono: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  font-heading: "Inter Variable, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
---

# Design System Specification

## 1. Overview & Architectural Foundation

This repository uses **shadcn/ui** with the **`base-nova`** design preset, implemented on top of **`@base-ui/react`** accessible unstyled primitives and **Tailwind CSS v4**.

The visual language emphasizes:
- High contrast, neutral palette defined via perceptually uniform **OKLCH** color tokens.
- Accessible keyboard focus and interaction states with `@base-ui/react` and `class-variance-authority` (CVA).
- Seamless light and dark mode switching via `next-themes` and CSS variables.
- Component development and state verification via **Ladle** (`npm run ladle`).

---

## 2. Color Palette & Theming (OKLCH)

Theme tokens are declared in `src/app/globals.css` and mapped via `@theme inline` into Tailwind CSS utility classes.

### 2.1 Core Palette Mapping

| Token Name | Light Theme | Dark Theme | Purpose / Usage |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Canvas background |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Primary body copy & text |
| `--card` / `--card-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | Elevated surfaces and containers |
| `--popover` / `--popover-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | Menus, tooltips, dialogs, popovers |
| `--primary` / `--primary-foreground` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | `oklch(0.922 0 0)` / `oklch(0.205 0 0)` | Main interactive buttons and CTAs |
| `--secondary` / `--secondary-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` | Secondary buttons, subtle badges |
| `--muted` / `--muted-foreground` | `oklch(0.97 0 0)` / `oklch(0.556 0 0)` | `oklch(0.269 0 0)` / `oklch(0.708 0 0)` | Inactive items, placeholders, footnotes |
| `--accent` / `--accent-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` | Hover highlights and menu selected items |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Errors, deletions, invalid input borders |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Card borders, dividers, subtle outlines |
| `--input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` | Form field borders and default boundaries |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | Focus visible rings |

### 2.2 Sidebar Tokens

| Token Name | Light Value | Dark Value | Usage |
|---|---|---|---|
| `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` | Sidebar background |
| `--sidebar-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Sidebar text |
| `--sidebar-primary` | `oklch(0.205 0 0)` | `oklch(0.488 0.243 264.376)` | Sidebar active indicator/CTA |
| `--sidebar-accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Sidebar hover item background |
| `--sidebar-border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Sidebar partition border |

---

## 3. Typography & Hierarchy

The application utilizes `@fontsource-variable/inter` for sans-serif narrative typography and Geist Mono for code/monospace elements.

| Role | Font Family | Tailwind Class | Target Element / Usage |
|---|---|---|---|
| **Headings** | Inter Variable (`var(--font-sans)`) | `font-heading`, `font-semibold` | Page titles, section headers, dialog titles |
| **Body** | Inter Variable (`var(--font-sans)`) | `font-sans`, `text-sm` or `text-base` | Paragraphs, notes content, descriptions |
| **Code / Mono** | Geist Mono (`var(--font-geist-mono)`) | `font-mono`, `text-xs` or `text-sm` | Code blocks, keyboard shortcuts (`kbd`), hashes |

---

## 4. Spacing, Shapes & Radii

The design token system standardizes border radiuses from `--radius` (`0.625rem` / `10px`):

- **Small (`rounded-sm` / 6px)**: Inputs, small buttons, tags.
- **Medium (`rounded-md` / 8px)**: Standard dropdown items, badges, inner elements.
- **Large (`rounded-lg` / 10px)**: Default button radius, cards, dialogs, popovers.
- **Extra Large (`rounded-xl` to `rounded-4xl`)**: Large panels, drawer sheets, modal cards.

---

## 5. UI Primitives Catalog (`src/components/ui/`)

All primitives are installed locally in `src/components/ui/` adhering to the `@base-ui/react` architecture:

1. **Actions & Triggers**:
   - `button.tsx`: Implements `ButtonPrimitive` from `@base-ui/react/button`, variants: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`. Sizes: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`.
   - `button-group.tsx`, `toggle.tsx`, `toggle-group.tsx`.
2. **Layout & Navigation**:
   - `sidebar.tsx`: Collapsible app navigation shell with responsive drawer fallback.
   - `tabs.tsx`, `breadcrumb.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `accordion.tsx`, `collapsible.tsx`, `separator.tsx`, `resizable.tsx`, `scroll-area.tsx`, `aspect-ratio.tsx`.
3. **Overlays & Dialogs**:
   - `dialog.tsx`, `alert-dialog.tsx`, `sheet.tsx`, `drawer.tsx`, `popover.tsx`, `tooltip.tsx`, `hover-card.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `menubar.tsx`, `command.tsx` (command palette).
4. **Data Input & Forms**:
   - `input.tsx`, `textarea.tsx`, `field.tsx`, `input-group.tsx`, `checkbox.tsx`, `radio-group.tsx`, `select.tsx`, `native-select.tsx`, `combobox.tsx`, `input-otp.tsx`, `slider.tsx`, `switch.tsx`, `calendar.tsx`, `label.tsx`, `direction.tsx` (RTL/LTR direction provider).
5. **Data Display & Feedback**:
   - `card.tsx`, `table.tsx`, `badge.tsx`, `avatar.tsx`, `alert.tsx`, `progress.tsx`, `skeleton.tsx`, `sonner.tsx` (toasts), `chart.tsx` (Recharts integration), `carousel.tsx`, `empty.tsx`, `kbd.tsx`, `spinner.tsx`, `item.tsx`.
6. **Conversational / Chat UI** (`@shadcn/react` extensions, not vanilla `@base-ui/react`):
   - `bubble.tsx`, `message.tsx`, `message-scroller.tsx`, `attachment.tsx`, `questionnaire.tsx` (wraps `@shadcn/react/questionnaire`), `marker.tsx`.

---

## 6. Storybook / Visual Verification (`ladle`)

Component variants and visual regression boundaries are captured as Ladle stories:
- Stories file pattern: `src/components/ui/*.stories.tsx` or `src/components/**/*.stories.tsx`
- Current coverage: only `button.tsx` has a story (`button.stories.tsx`); the other ~59 primitives in the catalog above do not yet have one. Treat new/changed components as needing a story, not as already covered.
- Run local viewer: `pnpm ladle` (or `npm run ladle`)
- Build static catalog: `pnpm ladle:build`

---

## 7. Implementation Rules & Best Practices

1. **Use CVA & `cn` for Class Composition**:
   - Always merge tailwind classes using `@/lib/utils` `cn(...)`.
   - Use `class-variance-authority` (cva) for multi-variant components.
2. **Leverage Base UI Slots**:
   - When styling sub-elements, use Base UI data attributes like `data-slot="button"`, `in-data-[slot=...]`, and `has-data-[icon=...]`.
3. **Respect OKLCH CSS Variable Semantics**:
   - Never hardcode arbitrary hex codes for standard UI elements (e.g. avoid `#ffffff` or `#171717`). Use `bg-background`, `text-foreground`, `bg-primary`, `border-border`, etc.
4. **Maintain Dark Mode Consistency**:
   - Ensure all interactive and background states degrade gracefully in `.dark` via CSS variables rather than scattered one-off `dark:` utility overrides.
