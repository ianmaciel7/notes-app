# Capacities Runtime Motion Guide

Source: `https://app.capacities.io/eb0a4d1e-0567-4348-8ecf-587c417725f4/a961988a-5562-45bf-86d4-2b2375b17544`
Capture date: 2026-09-08

## Motion principles

- Prefer opacity and color transitions over movement.
- Hover transitions are restrained and typically around `200ms`.
- Menu and popover entry should be fade-only around `150ms`.
- Tooltip fade may remain around `180ms`.
- Avoid zoom, bounce, scale, and directional slide for normal workspace menus.

## Sidebar behavior

- Secondary actions reveal on hover.
- Popup-open state keeps the relevant trigger visible.
- Keyboard focus must remain accessible, but focus alone should not visually expose all hover-only chrome.

## Reduced motion

- All motion classes must include `motion-reduce` fallbacks.
- Reduced motion should disable animation rather than replace it with alternative movement.
