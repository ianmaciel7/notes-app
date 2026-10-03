# Shadcn UI and Application Hook Placement

## Canonical Ownership
- Canonical specification: `CONVENTIONS.md` (Hook Placement & Usage) and ADR 0016 (`docs/adr/0016-prefer-simple-domain-components-and-dedicated-hooks.md`).

## 1. Co-located UI Component Hooks (`src/components/ui/`)
- Mapped to shadcn registry type `registry:ui` (single-file primitives).
- A hook is placed directly in the component file IF AND ONLY IF it is strictly coupled to that component's private `React.createContext`.
- Verified examples in the project:
  - `useSidebar` in `src/components/ui/sidebar.tsx` (consumes `SidebarContext`)
  - `useCarousel` in `src/components/ui/carousel.tsx` (consumes `CarouselContext`)
  - `useChart` in `src/components/ui/chart.tsx` (consumes `ChartContext`)
  - `useDrawer` in `src/components/ui/drawer.tsx` (consumes `DrawerContext`)
  - `useToastManager` in `src/components/ui/toast.tsx` (consumes Base UI Toast context)
- Exported in the file's trailing export block alongside the component parts.

## 2. Shared Utilities and Browser Sensors (`src/hooks/`)
- Mapped to shadcn registry type `registry:hook` and `aliases.hooks` in `components.json`.
- When shadcn CLI installs a hook item (e.g. `use-mobile` via `shadcn add sidebar`), it is placed into `src/hooks/use-mobile.ts`.
- Primitives import from `@/hooks/use-mobile` (e.g., `src/components/ui/sidebar.tsx` imports `useIsMobile`).

## 3. Dedicated Application Hooks (`src/hooks/`)
- Governed by ADR 0016 and Next.js Fast Refresh module isolation rules.
- Application components under `src/components/` outside `ui/` follow `single-component-per-file` and do not use compound component contexts.
- When an application surface accumulates state, transitions, or router interactions (e.g., `SpaceShell`, `ConnectionAlert`), stateful logic is extracted into a dedicated hook in `src/hooks/` (`useSpaceShell`, `useConnectionAlert`).
- This preserves Fast Refresh boundary detection, prevents full-page reloads, and leaves the component purely declarative.

## 4. Domain & Data Hooks (`src/hooks/`)
- Global data subscriptions, Firebase Auth, and Firestore listeners (`useAuth`, `useSpaces`) belong in `src/hooks/`.
- Must never depend on application route segments (`src/app/`), enforced by dependency-cruiser (`hooks-do-not-depend-on-app`).
