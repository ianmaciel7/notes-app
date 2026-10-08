# Motion System

Animation language for the app UI. It adopts the **token layer** of the Apple
HIG motion system (DesignMD `motion/apple`), CSS only, no animation library.
Visual rules live in [DESIGN.md](./DESIGN.md); decision record:
[ADR 0009](./docs/adr/0009-adopt-apple-style-design-tokens.md).

Source of truth for values is `src/app/globals.css`. This file explains intent
and rules; if they disagree, fix the one that is wrong in the same change.

## Durations

| Token | Value | Use |
| --- | --- | --- |
| `--duration-instant` | 0ms | direct manipulation |
| `--duration-fast` | 150ms | hover, color changes, tooltips, badges |
| `--duration-default` | 300ms | modals, sheets, navigation |
| `--duration-slow` | 400ms | full-screen transitions |
| `--duration-slower` | 500ms | hero transitions |

## Easing

Copy the curves verbatim; `cubic-bezier(0.33, 1, 0.68, 1)` is not the CSS
keyword `ease-out`.

| Token | Value | Use |
| --- | --- | --- |
| `ease-out` (Tailwind default) | `cubic-bezier(0.33, 1, 0.68, 1)` | entering, hover |
| `ease-in` | `cubic-bezier(0.32, 0, 0.67, 0)` | exiting |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | repositioning, cross-fade |
| `ease-deceleration` | `cubic-bezier(0, 0, 0.2, 1)` | entering from off-screen |

## Springs

`ease-spring-default|snappy|gentle|tight` are `linear()` samples of the
documented stiffness/damping.

| Token | Stiffness / damping |
| --- | --- |
| `ease-spring-default` | 300 / 30 |
| `ease-spring-snappy` | 500 / 40 |
| `ease-spring-gentle` | 170 / 26 |
| `ease-spring-tight` | 700 / 60 |

Interactive responses (anything the user touches) use a spring; ambient state
changes use an easing curve.

## Interaction

- Press: `scale(0.95)` with no delay, only under `motion-safe`. Buttons use
  `transition-press`: color at `fast` with `ease-out`, scale on the tight spring.
- Hover: one subtle background shift per component; no movement.
- Focus ring: appears instantly, no animation.
- Spinner: 0.9s linear.

## Enter and exit

- Enter with `ease-out` (alerts: opacity + scale 0.94 to 1). Exit faster with
  `ease-in`. Never exit in the entry direction.
- Base UI primitives keep their `tw-animate-css` enter and exit.
- New custom animations must use these tokens. Do not animate more than one
  full-screen transition at a time.

## Reduced motion

Under `prefers-reduced-motion: reduce`, slides and scales become fades and
transitions run at 250ms `ease-out`. Implemented in `globals.css`, outside any
cascade layer so it beats `tw-animate-css` utilities.

## Not adopted

Recorded so they are not rebuilt by accident: stagger (the app has no custom
list or grid reveals), push, sheet and hero/magic-move transitions, tvOS focus
lift, haptics, gesture-velocity matching, shimmer skeletons (the existing pulse
stays).
