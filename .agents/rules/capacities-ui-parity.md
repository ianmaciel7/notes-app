---
trigger: model_decision
description: Architectural and interaction guidelines for the Capacities-emulated 3-pane workspace, centralized object icons, and state machine parity.
---

# Workspace UI Parity & Capacities Architecture

When building the 3-Pane workspace mirroring Capacities, follow the architectural contracts defined in `SPEC.md` and `DECISIONS.md`.

## 1. 3-Pane Layout Contract

- **Left Sidebar (`w-60` / 240px)**: Collapsible rail containing Navigation switcher (`Cmd+K`), Daily Notes / Calendar, Object Types directory, and Tags.
- **Main Center Workspace (`flex-1`)**: Document / Notes view supporting split view (e.g. PDF/EPUB reader on left, Notes/Flashcards on right).
- **Right Inspector Panel (`w-80` / 320px)**: Collapsible panel displaying Object Properties sheet, outgoing relations, incoming backlinks, and interactive 2D local graph.

## 2. Centralized Object Identity & Icons

- All object type icons and tones must be managed through a central registry (`src/components/object-icons.tsx`).
- The same object type must render identical icons and color tones across sidebar, tabs, search palettes, and cards.
- Do not paste ad hoc SVGs or one-off icon replacements in feature components.

## 3. Interaction State Machine over Screenshot Matching

- Treat every control as an interaction state machine (default, hover, keyboard focus, active/pressed, open, error).
- Avoid screenshot-position hacks, `!important`, or duplicate literal CSS.
- Ensure `scrollWidth === clientWidth` to avoid unwanted horizontal clipping or layout jitter.
- Use shadcn/ui primitives and theme tokens from `globals.css`.
