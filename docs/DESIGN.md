# Design

This document is the canonical design reference for repository UI work. It combines the repository's implementation principles with the Notion-inspired visual system used for generated and implemented interfaces.

## Repository Principles

- Prefer the simplest correct solution that fits the current codebase.
- Use existing project patterns, platform APIs, and dependencies before adding new abstractions.
- Keep modules focused and avoid coupling unrelated concerns.
- Keep documentation, rules, and examples system-agnostic unless they describe this repository's actual implementation.
- Follow the A11Y.md Standard profile for WCAG 2.2 AA unless a task explicitly sets another profile.
- Prefer native semantic HTML.
- Do not use clickable `div` or `span` elements.
- Keep every interaction keyboard-operable with visible focus and correct focus management.
- Provide connected labels for form controls and meaningful `alt` text for informative images.
- Meet contrast requirements: 4.5:1 for text and 3:1 for UI components or meaningful graphics.
- Do not convey state by color alone; pair color with text, iconography, or another cue.
- Respect `prefers-reduced-motion` for animations and transitions.
- Record accepted accessibility violations in `EXCEPTIONS.md`.
- Record conformant accessibility pattern decisions in `A11Y-DECISIONS.md`.

## Visual Direction

Use a Notion-inspired all-in-one workspace language for UI generation and marketing-style surfaces. The system is confident, illustration-rich, and anchored by:

- A deep navy hero band with scattered sticky-note dots and mesh wire illustrations.
- A signature purple primary CTA.
- Real workspace UI mockups inside hero and feature sections.
- Pastel-tinted feature cards that echo database properties.
- Notion Sans or an Inter-based fallback across every UI surface.
- Rectangular 8px buttons and 12px cards.
- Dense but readable pricing and comparison surfaces when needed.

Use this direction for all UI generated in this repository unless a task explicitly provides a different design system.

## Tokens

### Colors

```yaml
colors:
  primary: "#5645d4"
  primary-pressed: "#4534b3"
  primary-deep: "#3a2a99"
  on-primary: "#ffffff"

  brand-navy: "#0a1530"
  brand-navy-deep: "#070f24"
  brand-navy-mid: "#1a2a52"

  link-blue: "#0075de"
  link-blue-pressed: "#005bab"

  brand-orange: "#dd5b00"
  brand-orange-deep: "#793400"
  brand-pink: "#ff64c8"
  brand-pink-deep: "#a02e6d"
  brand-purple: "#7b3ff2"
  brand-purple-300: "#d6b6f6"
  brand-purple-800: "#391c57"
  brand-teal: "#2a9d99"
  brand-green: "#1aae39"
  brand-yellow: "#f5d75e"
  brand-brown: "#523410"

  card-tint-peach: "#ffe8d4"
  card-tint-rose: "#fde0ec"
  card-tint-mint: "#d9f3e1"
  card-tint-lavender: "#e6e0f5"
  card-tint-sky: "#dcecfa"
  card-tint-yellow: "#fef7d6"
  card-tint-yellow-bold: "#f9e79f"
  card-tint-cream: "#f8f5e8"
  card-tint-gray: "#f0eeec"

  canvas: "#ffffff"
  surface: "#f6f5f4"
  surface-soft: "#fafaf9"
  hairline: "#e5e3df"
  hairline-soft: "#ede9e4"
  hairline-strong: "#c8c4be"

  ink-deep: "#000000"
  ink: "#1a1a1a"
  charcoal: "#37352f"
  slate: "#5d5b54"
  steel: "#787671"
  stone: "#a4a097"
  muted: "#bbb8b1"
  on-dark: "#ffffff"
  on-dark-muted: "#a4a097"

  semantic-success: "#1aae39"
  semantic-warning: "#dd5b00"
  semantic-error: "#e03131"
```

### Typography

Use Notion Sans as the primary family. If unavailable, use Inter, `-apple-system`, `system-ui`, `Segoe UI`, Helvetica, or sans-serif.

| Token | Size | Weight | Line Height | Letter Spacing | Use |
| --- | ---: | ---: | ---: | ---: | --- |
| `hero-display` | 80px | 600 | 1.05 | -2px | Hero display headlines |
| `display-lg` | 56px | 600 | 1.10 | -1px | Section openers |
| `heading-1` | 48px | 600 | 1.15 | -0.5px | Page-level headlines |
| `heading-2` | 36px | 600 | 1.20 | -0.5px | Subsection headlines |
| `heading-3` | 28px | 600 | 1.25 | 0 | Card titles |
| `heading-4` | 22px | 600 | 1.30 | 0 | Feature tile titles |
| `heading-5` | 18px | 600 | 1.40 | 0 | FAQ questions |
| `subtitle` | 18px | 400 | 1.50 | 0 | Hero subtitle |
| `body-md` | 16px | 400 | 1.55 | 0 | Primary body text |
| `body-md-medium` | 16px | 500 | 1.55 | 0 | Body emphasis |
| `body-sm` | 14px | 400 | 1.50 | 0 | Secondary body |
| `body-sm-medium` | 14px | 500 | 1.50 | 0 | Active labels and compact actions |
| `caption` | 13px | 400 | 1.40 | 0 | Captions |
| `caption-bold` | 13px | 600 | 1.40 | 0 | Badge labels |
| `micro` | 12px | 500 | 1.40 | 0 | Microcopy |
| `micro-uppercase` | 11px | 600 | 1.40 | 1px | Compact uppercase labels |
| `button-md` | 14px | 500 | 1.30 | 0 | Button labels |

Typography principles:

- Use tight leading for display text and generous leading for body text.
- Use 600 weight for headlines, 500 for buttons, and 400 for body copy.
- Keep display text compact, but verify that mobile wrapping remains readable.

### Radius

```yaml
rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 20px
  xxxl: 24px
  full: 9999px
```

Use `rounded.md` for buttons, inputs, and search controls. Use `rounded.lg` for cards, pricing tiers, agent tiles, and workspace mockups. Reserve `rounded.full` for status badges and pill tabs only.

### Spacing

```yaml
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section-sm: 48px
  section: 64px
  section-lg: 96px
  hero: 120px
```

Use a 4px base unit with 8px as the primary increment. Marketing sections should usually use `section-lg`; denser pricing or comparison sections can use `section`.

## Components

### Buttons

- `button-primary`: Purple rectangular CTA using `primary`, `on-primary`, `button-md`, `rounded.md`, and `10px 18px` padding.
- `button-primary-pressed`: Uses `primary-pressed`.
- `button-primary-disabled`: Uses `hairline` background and `muted` text.
- `button-dark`: Black rectangular CTA for light surfaces.
- `button-secondary`: Transparent outlined secondary action with `hairline-strong` border.
- `button-on-dark`: White button for dark hero bands.
- `button-secondary-on-dark`: Transparent outlined button for dark backgrounds.
- `button-ghost`: Low-emphasis transparent action with `rounded.sm`.
- `button-link`: Inline blue link action using `link-blue`.

Primary purple is for the dominant CTA. Do not use it for body text or large background surfaces.

### Cards

- `card-base`: White surface, `rounded.lg`, `spacing.xl`, `hairline` border.
- `card-feature`: White surface, `rounded.lg`, `spacing.xxl`, `hairline` border.
- `card-feature-yellow-bold`: High-emphasis yellow feature banner.
- `card-feature-peach`, `card-feature-rose`, `card-feature-mint`, `card-feature-sky`, `card-feature-lavender`, `card-feature-yellow`, `card-feature-cream`: Pastel feature variants using the matching tint token and `charcoal` text.
- `card-agent-tile`: White assistant tile with `rounded.lg`, `spacing.xl`, and `hairline` border.
- `card-template`: White template thumbnail with `spacing.lg`.
- `card-startup-perk`: White perk card with `spacing.xl`.
- `pricing-card`: White pricing tier with `spacing.xxl`.
- `pricing-card-featured`: `surface` background and `2px solid primary` border.

Cards should use tint, layout, or content to communicate hierarchy. Avoid heavy shadows on flat documentation cards.

### Inputs And Forms

- `text-input`: White background, `ink` text, `hairline-strong` border, `rounded.md`, 44px height.
- `text-input-focused`: Purple 2px focus border.
- `search-pill`: `surface` background, `steel` text, `rounded.md`, 44px height, `hairline` border.

Labels must appear above inputs. Placeholder text must not replace labels.

### Tabs

- `pill-tab`: Rounded-full tab for high-level switching.
- `pill-tab-active`: Black background with white text.
- `segmented-tab`: Underline-style tab for denser navigation.
- `segmented-tab-active`: Ink text with a 2px bottom border.

### Badges

- `badge-purple`: Purple status badge.
- `badge-pink`: Pink accent badge.
- `badge-orange`: Orange accent badge.
- `badge-tag-purple`: Soft lavender tag with deep purple text.
- `badge-tag-orange`: Soft peach tag with deep orange text.
- `badge-tag-green`: Soft mint tag with green text.
- `badge-popular`: Purple pricing or plan badge.

Use badges for real status, tags, or plan metadata. Do not scatter decorative dots or labels without semantic value.

### Tables

- `comparison-table`: White background, `body-sm`, `rounded.md`, `hairline` border.
- `comparison-row`: White row with `spacing.md spacing.lg` and `hairline-soft` dividers.

Use dense tables only where comparison is the user's primary task, such as pricing.

### Signature Surfaces

- `hero-band-dark`: Deep navy band using `brand-navy`, white text, and generous hero padding.
- `workspace-mockup-card`: White product UI mockup card with `rounded.lg`, `hairline` border, and `rgba(15, 15, 15, 0.20) 0px 24px 48px -8px` shadow.
- `cta-banner-light`: Light `surface` CTA banner with `rounded.lg` and `spacing.section`.
- `testimonial-card`: White card with `spacing.xxl` and `hairline` border.
- `logo-wall-item`: Transparent logo cell with `steel` text and `body-md-medium`.
- `faq-accordion-item`: White FAQ row with `rounded.md`, `spacing.xl`, and bottom hairline.
- `stat-row`: `surface` statistics strip with `rounded.lg` and `spacing.section-sm`.
- `footer-region`: White footer with multi-column links and top border.
- `footer-link`: Steel text link with compact vertical padding.

## Layout

- Use a 1280px max-width container with 32px gutters for desktop.
- Use centered hero composition when following the Notion-inspired marketing pattern.
- Place real workspace mockups below hero copy and actions.
- Use alternating feature bands with colorful tinted cards.
- Pricing may use four tiers on desktop, two columns on tablet, and one column on mobile.

## Elevation

| Level | Treatment | Use |
| --- | --- | --- |
| 0 | No shadow, `hairline` border | Default cards and table rows |
| 1 | `rgba(15, 15, 15, 0.04) 0px 1px 2px 0px` | Subtle elevated tiles |
| 2 | `rgba(15, 15, 15, 0.08) 0px 4px 12px 0px` | Feature cards |
| 3 | `rgba(15, 15, 15, 0.20) 0px 24px 48px -8px` | Hero workspace mockup |
| 4 | `rgba(15, 15, 15, 0.16) 0px 16px 48px -8px` | Modals and dropdowns |

## Responsive Behavior

| Breakpoint | Width | Behavior |
| --- | --- | --- |
| Mobile small | < 480px | Single column, 36px hero, pricing 1-up |
| Mobile large | 480-767px | Feature cards may become 2-up, 48px hero |
| Tablet | 768-1023px | 2-column feature grids, 56px hero |
| Desktop | 1024-1279px | 4-tier pricing row, 72px hero |
| Wide desktop | >= 1280px | Full 80px hero presentation |

Touch targets:

- Buttons should render at 40-44px effective height.
- Form inputs should render at 44px height.
- Pill tabs should render around 32-44px depending on viewport.

Collapse rules:

- Promo banners remain full-width and may truncate below 480px.
- Top navigation collapses below 1024px.
- Hero workspace mockups move below text and actions on mobile.
- Feature cards collapse from 3-up, to 2-up, to 1-up.
- Footer collapses from 6 columns, to 3 columns, to accordion-style groups.

## Do

- Use `primary` as the dominant CTA color.
- Pair `brand-navy` hero bands with purple CTAs and Notion-style visual details.
- Use pastel feature card tints generously.
- Use `card-tint-yellow-bold` for high-emphasis assistant or automation banners.
- Apply `rounded.md` to buttons consistently.
- Apply `rounded.lg` to cards consistently.
- Maintain Notion Sans or an Inter-based fallback across UI surfaces.
- Use real or generated workspace mockups where a product preview is needed.
- Keep UI accessible, keyboard-operable, and contrast-compliant.

## Do Not

- Do not use primary purple for body text or broad background fills.
- Do not use pill-shaped regular buttons.
- Do not mix `link-blue` and `primary` as if they have the same role.
- Do not apply heavy shadows to flat documentation cards.
- Do not replace the Notion-inspired type stack with an unrelated serif or display face.
- Do not use div-based fake screenshots when a real screenshot, generated image, or real component preview is available.
- Do not duplicate detailed design rules across agent files. Link to this document instead.

## State And Data

The current app has no persistent application data model. When state or data flows are introduced, document accepted architecture in `docs/ARCHITECTURE.md` and design rationale in OpenSpec for significant changes.

## Error Handling

- Prefer explicit, user-appropriate error states over silent failures.
- Keep error handling close to the boundary that can recover or present the failure.
- Avoid leaking secrets or sensitive implementation details in user-facing errors.

## Maintainability

- Keep generated files out of manual edits.
- Avoid duplicating the same rule or workflow across multiple documents.
- Use links to canonical docs instead of copying detailed instructions.
- Before adding semantic indexes, memory systems, or context middleware, record security review and benchmark evidence in `docs/AGENT_CONTEXT_EFFICIENCY_AUDIT.md`.
