# Notes App

The application shell and component foundation for the notes application workspace.

## Language

**Application Shell**:
The root layout and structural framing that provides global typography, viewport setup, and theme context for the application.
_Avoid_: Frame, wrapper, master page, template

**Theme**:
The visual appearance mode (light, dark, or system-inherited) managed across the interface by the theme provider. See `ARCHITECTURE.md` §4 for how it's wired.
_Avoid_: Skin, palette, colorway, mode

**UI Primitive**:
A foundational, accessible user interface element built on Base UI and styled with the base-nova design tokens.
_Avoid_: Widget, control, gadget, element

**Component Story**:
An isolated visual representation and state preview of a UI component rendered within the Ladle development environment.
_Avoid_: Mockup, preview fixture, component test
