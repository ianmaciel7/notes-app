# Notes App Context

Canonical vocabulary for concepts used in code, documentation, commits, and review.

## Language

**Application Shell**  
The structural application frame that provides global layout, typography, viewport,
and theme context.  
_Avoid_: Master Page, App Wrapper

**Theme**  
The visual appearance mode applied across the interface: light, dark, or inherited
from the system preference. Runtime wiring belongs to `ARCHITECTURE.md`.  
_Avoid_: UI Skin, Theme Colorway

**UI Primitive**  
A reusable, domain-neutral interface building block from the shared UI layer. Its
visual semantics belong to `DESIGN.md` and coding rules to `CONVENTIONS.md`.  
_Avoid_: UI Widget, UI Gadget

**Component Story**  
An isolated state/example of a UI component rendered by the component workbench for
visual and interaction verification. Testing policy belongs to `TESTING.md`.  
_Avoid_: Story Mockup, Preview Fixture
