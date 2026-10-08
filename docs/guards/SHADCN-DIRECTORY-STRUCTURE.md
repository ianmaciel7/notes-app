# shadcn Directory Structure & Architectural Boundaries

This document defines the folder conventions, responsibilities, and import boundaries for the shadcn Base Nova component system in this repository.

## Overview

The component architecture is divided into distinct layers to separate owned design system primitives from application-specific feature composition.

```txt
src/
├── app/                  # Next.js App Router routes, layouts, and pages
├── components/
│   ├── firebase/         # Immutable upstream Firebase UI reference layer
│   └── ui/               # Owned shadcn Base Nova / Base UI primitive layer
├── hooks/                # Shared application and component hooks
└── lib/                  # Shared utility functions and library adapters
    └── utils.ts          # Canonical cn re-export
```

---

## Directory Responsibilities

### 1. `src/components/ui/` (Owned Primitives Layer)

* **Purpose**: Hosts low-level, headless, and accessible design system primitives (e.g., `button.tsx`, `dialog.tsx`, `input.tsx`, `sidebar.tsx`).
* **Source**: Generated and managed via shadcn CLI (`base-nova` style with Base UI primitives).
* **Ownership**: This directory is an **owned implementation/registry layer**.
  * It is intentionally excluded from ordinary application linters (`!src/components/ui` in `biome.json`) to preserve registry compatibility.
  * Primitives here must never import domain code or application routes. This
    is enforced mechanically by the Dependency Cruiser rule
    `ui-primitives-cannot-import-domain`, which cruises this directory.

### 2. `src/components/firebase/` (Upstream Reference Layer)

* **Purpose**: Holds the 30 upstream Firebase OSS UI components as an immutable
  behavioral/reference baseline defined by ADR 0004.
* **Ownership**: This is **not application code** and is not an owned shadcn
  implementation layer.
* **Guard Boundary**: Biome/GritQL and `tsconfig.check.json` exclude this
  directory. `tests/unit/firebase-reference.test.ts` protects its exact
  contents with a SHA-256 manifest.
* **Usage Rule**: Application-owned auth UI may use this layer for behavioral
  parity/reference, but must not modify these files.

### 3. `src/components/` (Application Components Layer)

* **Purpose**: Application-owned composite components, domain widgets, and
  feature-specific UI live here when introduced, excluding the reserved
  `ui/` and `firebase/` layers.
* **Composition Rule**: Application components compose primitives from
  `src/components/ui/`.
* **Guard Boundary**: Application-owned code is part of the
  **guard-consumption layer** and must follow project GritQL guards.
* **File Rule**: Outside the reserved `ui/` and `firebase/` directories, every
  file must be `.tsx`. Hooks belong in `src/hooks/use-*.ts`; utilities,
  constants, script builders, and pure logic belong in `src/lib/<domain>/`.
  This matches shadcn registry types (`hook` -> `hooks`, `lib` -> `lib`) and
  Next.js project-structure guidance for shared helpers. The Vitest structure
  guard in `tests/unit/components-layer-structure.test.ts` enforces this rule.

### 4. `src/lib/` & `src/lib/utils.ts` (Utilities Layer)

* **Purpose**: General helper functions, runtime utilities, and third-party wrappers.
* **`utils.ts`**: Re-exports the canonical `cn()` helper from the `cn`
  package.
* **Rule**: Dynamic and conditional class composition should use `cn()` from
  `@/lib/utils`.

### 5. `src/hooks/` (Custom Hooks Layer)

* **Purpose**: Reusable React hooks consumed across components and pages (e.g., `use-mobile.ts`, `use-media-query.ts`).
* **Rule**: Primitives such as `sidebar.tsx` or application components import shared state hooks from `@/hooks/*`.
* **Placement**: Two kinds of hooks. Context accessors (like `useSidebar`) stay in the component file that owns the context (shadcn pattern). Every other hook lives here, one `use-*.ts(x)` file per hook: shadcn defines the `@/hooks` alias for generic hooks, and this project additionally places single-consumer hooks here (project convention, stricter than shadcn). Enforced by `no-inline-hook-definition.grit` and `exported-hook-location.grit`.

### 6. `src/app/` (Routing & Views Layer)

* **Purpose**: Next.js App Router pages, route handlers, error boundaries, and root layouts.
* **Rule**: Views compose components from `src/components/` and `src/components/ui/` via canonical aliases.

---

## Configuration in `components.json`

The CLI configuration file [`components.json`](../../components.json) is authoritative for path aliases and registry behavior:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {
    "@firebase": "https://firebaseopensource.com/r/{name}.json"
  }
}
```

The CLI uses these aliases to install new components into the correct folders and rewrite internal imports automatically.

---

## Guard & Boundary Enforcement

Boundary integrity is verified mechanically across multiple layers:

1. **Canonical Import Aliases (`canonical-import-aliases.grit`)**:
   Enforces that application consumers import primitives and helpers using their canonical aliases (`@/components/ui`, `@/lib/utils`, `@/hooks`) rather than deep relative paths (`../../components/ui/*`).
2. **Dependency Cruiser (`.dependency-cruiser.cjs`)**:
   Cruises `src/components/ui/**` and enforces
   `ui-primitives-cannot-import-domain`, so UI primitives cannot import
   `src/components/notes-app`, `src/components/firebase` or `src/app`.
3. **Biome Guard Boundary**:
   Excludes both `src/components/ui/**` (owned implementation) and
   `src/components/firebase/**` (immutable upstream reference) from ordinary
   application guard consumption. Application-owned consumers remain subject
   to semantic-token, accessibility, composition, and import guards.
4. **Firebase Reference Integrity**:
   `tests/unit/firebase-reference.test.ts` verifies
   `src/components/firebase/**` against
   `tests/unit/firebase-reference.manifest.sha256`.
5. **Components-Layer Structure**: The Vitest guard scans
   `src/components/**`, excluding `ui/**` and `firebase/**`, and rejects
   non-`.tsx` files with placement guidance for `src/hooks/` and `src/lib/`.
