# shadcn Directory Structure & Architectural Boundaries

This document defines the folder conventions, responsibilities, and import boundaries for the shadcn Base Nova component system in this repository.

## Overview

The component architecture is divided into distinct layers to separate owned design system primitives from application-specific feature composition.

```txt
src/
├── app/                  # Next.js App Router routes, layouts, and pages
├── components/           # Application-level and domain components
│   └── ui/               # Owned shadcn Base Nova / Base UI primitive layer
├── hooks/                # Shared application and component hooks
└── lib/                  # Shared utility functions and library adapters
    └── utils.ts          # Core styling helper (cn)
```

---

## Directory Responsibilities

### 1. `src/components/ui/` (Owned Primitives Layer)

* **Purpose**: Hosts low-level, headless, and accessible design system primitives (e.g., `button.tsx`, `dialog.tsx`, `input.tsx`, `sidebar.tsx`).
* **Source**: Generated and managed via shadcn CLI (`base-nova` style with Base UI primitives).
* **Ownership**: This directory is an **owned implementation/registry layer**.
  * It is intentionally excluded from ordinary application linters (`!src/components/ui` in `biome.json`) to preserve registry compatibility.
  * Primitives here must never import domain code or application routes (`.dependency-cruiser.cjs`).

### 2. `src/components/` (Application Components Layer)

* **Purpose**: Hosts composite components, domain widgets, and feature-specific UI (e.g., note editors, user navigation cards).
* **Composition Rule**: Application components compose primitives from `src/components/ui/`.
* **Guard Boundary**: Code here is part of the **guard-consumption layer** and must strictly adhere to project GritQL guards (e.g., using `cn()`, semantic color tokens, and accessible compound parts).

### 3. `src/lib/` & `src/lib/utils.ts` (Utilities Layer)

* **Purpose**: General helper functions, runtime utilities, and third-party wrappers.
* **`utils.ts`**: Contains the canonical `cn()` helper (combining `clsx` and `tailwind-merge` / styling variance).
* **Rule**: All dynamic and conditional class composition must flow through `cn()` from `@/lib/utils`.

### 4. `src/hooks/` (Custom Hooks Layer)

* **Purpose**: Reusable React hooks consumed across components and pages (e.g., `use-mobile.ts`, `use-media-query.ts`).
* **Rule**: Primitives such as `sidebar.tsx` or application components import shared state hooks from `@/hooks/*`.

### 5. `src/app/` (Routing & Views Layer)

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
   Ensures generic UI primitives in `src/components/ui` do not form circular dependencies or import application domain modules.
3. **Biome Guard Boundary**:
   Excludes `src/components/ui/**` from opinionated application refactor rules while enforcing semantic tokens, accessible parts, and primitive composition in all consuming files.
