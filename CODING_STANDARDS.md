# Engineering Coding Standards

> Authoritative reference for the **Standards** axis of the `/code-review` workflow.

---

## 1. Overview & Dual-Axis Code Review Model

Code review in this repository operates on a strict **Two-Axis Evaluation Model** as codified in `.agents/skills/code-review/SKILL.md`:

```
                    ┌──────────────────────────────────────────────┐
                    │               Code Review Diff               │
                    └──────────────────────┬───────────────────────┘
                                           │
                    ┌──────────────────────┴───────────────────────┐
                    ▼                                              ▼
       ┌────────────────────────┐                    ┌────────────────────────┐
       │     Standards Axis     │                    │       Spec Axis        │
       │  (Architectural & Code │                    │  (Functional & Domain  │
       │       Integrity)       │                    │      Requirements)     │
       └────────────────────────┘                    └────────────────────────┘
```

### The Two Axes

1. **Standards Axis**:
   - Evaluates whether the diff conforms to this repository's architectural principles, typing rigor, runtime invariants, styling paradigms, and code hygiene.
   - Grounded in this document (`CODING_STANDARDS.md`) and the **Fowler Code Smells Baseline**.
2. **Spec Axis**:
   - Evaluates whether the diff faithfully and completely implements the originating specification (issue, PR description, or spec document) without omissions or unintended scope creep.

### Independence & Separation of Concerns

- **Standards and Spec are evaluated independently.** A change can pass one axis while completely failing the other:
  - *Standards Pass, Spec Fail*: Clean, typed, beautifully formatted code that implements the wrong requirements or misses key acceptance criteria.
  - *Spec Pass, Standards Fail*: Feature-complete code that introduces technical debt, architectural smells, type safety holes, or compiler invariant violations.
- Review findings must never be combined into a single blurred score or allowed to mask one another.

### Precedence Rules

- **Documented Repo Standards Always Win**: Where an explicit standard defined in this document differs from or refines a generic baseline smell heuristic, this document governs.
- **Judgement Calls vs. Hard Violations**: Documented rules and compiler invariants are hard violations; smell heuristics serve as review guidance and require engineering judgement.
- **Automated Tooling Delegation**: Code formatting and syntax lints enforced automatically by Biome or the TypeScript compiler (`tsc`) must not waste manual review bandwidth. Reviewers focus on invariants, semantic correctness, design coherence, and architecture.

---

## 2. TypeScript & Static Typing Standards

This codebase runs on **TypeScript 5.x** configured with strict compiler flags (`strict: true`, `noImplicitAny: true`, `isolatedModules: true`).

### Strict Typing & Zero Implicit `any`

- **Forbid `any`**: Explicit or implicit `any` is strictly prohibited.
- **Use `unknown` for Dynamic or External Data**: When consuming untyped input (network payloads, third-party events, browser storage), type the value as `unknown` and narrow it via type guards, discriminated unions, or runtime validators.

```typescript
// ❌ BAD: Bypassing type safety with any
export function parsePayload(data: any): Note {
  return data.note;
}

// ✅ GOOD: Safe narrowing with unknown and runtime validation
export function parsePayload(data: unknown): Note {
  if (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof (data as Record<string, unknown>).id === "string"
  ) {
    return data as Note;
  }
  throw new TypeError("Invalid note payload structure");
}
```

### Minimizing Type Assertions (`as`)

- Type assertions (`as Type`) override the compiler and suppress type checker verification.
- **Never use `as` to silence compiler errors.** Instead, refine types using control-flow analysis (type predicates, `in` operator, `typeof`, `instanceof`).
- **Forbidden**: Double assertions such as `(value as unknown) as TargetType` are rejected during review unless interfacing with poorly typed third-party library boundaries.
- **Non-null Assertions (`!`)**: Prohibited unless accompanied by an immediately preceding defensive check or invariant assertion.

### Type vs. Interface & Naming Conventions

- **PascalCase** for all types, interfaces, enums, and components.
- **No Hungarian Notation**: Do not prefix interfaces with `I` (e.g., `INote`) or type aliases with `T` (e.g., `TNotebook`).
- **Use `interface` for extendable object contracts**: Especially public API boundaries and React component props.
- **Use `type` for compositions**: Unions, primitives, mapped types, utility types, and tuples.
- **Align with Domain Terminology (`GLOSSARY.md`)**:
  - Always use canonical domain terms: `Note`, `Notebook`, `Tag`, `Draft`, `Revision`, `Workspace`, `Excerpt`.
  - Avoid forbidden synonyms (`memo`, `document`, `folder`, `collection`, `label`, `snippet`).

```typescript
// ✅ Component Props Interface
export interface NoteEditorProps {
  noteId: string;
  initialDraft: Draft;
  onSave: (revision: Revision) => Promise<void>;
}

// ✅ Union Type
export type NoteStatus = "draft" | "published" | "archived";

// ✅ Branded Primitive for Strong Domain Typing
export type NoteId = string & { readonly __brand: unique symbol };
```

### Explicit Function Signatures

- All exported functions, server actions, and public service utilities must declare explicit return types.
- Internal helper arrow functions may rely on inference only when the return type is trivially evident.

### Module Path Aliases

- Always use the configured path alias `@/*` (pointing to `src/*`).
- **Never use deeply nested relative imports** (e.g., `../../../../components/Button`).

```typescript
// ❌ BAD: Fragile relative navigation
import { NoteCard } from "../../../components/NoteCard";

// ✅ GOOD: Stable root alias
import { NoteCard } from "@/components/NoteCard";
```

---

## 3. React 19 & React Compiler Invariants

The project utilizes **React 19** with the **React Compiler** (`reactCompiler: true` in `next.config.ts`, `babel-plugin-react-compiler`).

### Strict Adherence to the Rules of React

The React Compiler relies on mathematical guarantees. Violating the Rules of React will either disable automatic optimizations for the component or produce runtime regressions.

1. **Pure Renders**:
   - Rendering must be a pure calculation with zero side effects.
   - Do not mutate global variables, DOM nodes, or arguments during rendering.
   - Do not invoke network requests or timers during render.
2. **State & Prop Immutability**:
   - Never mutate state objects or arrays in place.
   - Always return fresh object references when updating state.

```typescript
// ❌ BAD: In-place mutation breaks React Compiler memoization
function addTagToNote(note: Note, newTag: Tag) {
  note.tags.push(newTag); // Mutation of existing object
  return note;
}

// ✅ GOOD: Immutable update creates a fresh snapshot
function addTagToNote(note: Note, newTag: Tag): Note {
  return {
    ...note,
    tags: [...note.tags, newTag],
  };
}
```

### Eliminating Manual `useMemo` & `useCallback`

Because the React Compiler automatically memoizes component subtrees, JSX nodes, and function closures:

- **Do NOT manually wrap functions in `useCallback`** by default.
- **Do NOT manually wrap values in `useMemo`** by default.
- Write simple, idiomatic JavaScript/TypeScript. Trust the compiler pipeline.
- **Exceptions where manual memoization is permitted**:
  - Genuinely expensive computational algorithms (e.g., full-text diffing, cryptographic hashing, parsing massive datasets).
  - Integration with external non-React libraries requiring referentially stable callback handles.

### Opt-Out Conventions (`'use no memo'`)

In rare cases where dynamic behavior intentionally conflicts with compiler analysis:

- Use the `'use no memo'` directive at the top of the function or file.
- **Mandatory Requirement**: Every usage of `'use no memo'` must be accompanied by an explanatory code comment detailing the specific compiler diagnostic, performance profiling evidence, and reason why refactoring to standard compiler-compliant code is not possible.

```typescript
// 'use no memo' is permitted only with documented justification:
// Justification: Interfacing with dynamic mutable canvas context API that triggers false-positive compiler deopt.
'use no memo';

export function CanvasRenderer({ context }: CanvasRendererProps) {
  // ...
}
```

---

## 4. Next.js 16 App Router Conventions

This project targets **Next.js 16 App Router** with React Server Components (RSC) by default.

### Server Components as Default

- All components inside `src/app/` are Server Components unless explicitly marked with `'use client'`.
- Server Components should handle:
  - Database access and data fetching.
  - Integration with server-side SDKs and secret environment variables.
  - Static HTML rendering and heavy dependencies that should not be shipped to the client bundle.

### `'use client'` at Leaf Boundaries Only

- Push `'use client'` as far down the component tree as possible.
- Do not mark entire route pages as client components simply because one interactive control (e.g., a toggle switch or button) requires state.
- Pass Server Components as `children` or props to Client Components to keep the parent tree on the server.

```
┌───────────────────────────────────────────────┐
│ Server Component (src/app/notes/page.tsx)     │
│ - Fetches notes from database                 │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │ Client Leaf: NoteSearchInput            │  │
│  │ ('use client' - handles instant search) │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │ Server Component: NoteList (RSC)        │  │
│  │ - Renders static cards                  │  │
│  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

### Colocated Component & Route Architecture

- Keep route boundary files focused solely on routing lifecycle:
  - `page.tsx`: Route entry point and data loading.
  - `layout.tsx`: Persistent shell and context providers.
  - `loading.tsx`: Instant loading skeleton fallback.
  - `error.tsx`: Segment error boundary (`'use client'`).
  - `not-found.tsx`: Missing resource UI.
- Colocate route-specific components in a private `_components/` directory adjacent to the route file.
- Shared reusable components across routes belong in `src/components/`.

### Metadata Exports

- Every route `page.tsx` or `layout.tsx` must export either static `Metadata` or a dynamic `generateMetadata` function.
- Do not use client-side `<title>` or `<meta>` tags directly in React markup.

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notebooks | Notes Application",
  description: "Browse and organize your active notebooks and notes.",
};
```

---

## 5. Tailwind CSS v4 Styling Principles

The project uses **Tailwind CSS v4** configured with `@tailwindcss/postcss` and CSS-first `@theme` directives.

### Utility-First CSS

- Apply styling directly via Tailwind utility classes.
- Avoid creating custom CSS classes or separate `.module.css` files unless implementing complex keyframe animations or vendor integration overrides.

### CSS-First Configuration via `globals.css`

- Tailwind v4 deprecates `tailwind.config.js` in favor of declarative CSS theme configuration.
- Custom tokens, colors, and typography variables must be defined in `src/app/globals.css` using the `@theme` block:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

### Token Consistency & Design Integrity

- Use configured theme variables (`bg-background`, `text-foreground`) rather than hardcoded hex colors.
- Avoid arbitrary bracket values (e.g., `w-[317px]`, `top-[13px]`) unless strictly required for precision alignment against a high-fidelity visual specification. Use standard Tailwind scale intervals (`w-80`, `top-3`).
- Zero ad-hoc inline styles: Avoid `style={{ ... }}` for layout and styling. Inline styles are reserved solely for genuinely dynamic runtime coordinates (e.g., pointer gestures, custom virtualized window offsets).

---

## 5.1. Shadcn UI Primitives & Registry Governance

The project utilizes **shadcn UI** (configured with `@base-ui/react` primitives and Tailwind CSS v4) located in `src/components/ui/`.

### Native Registry Invariants

- **Vendorized / Registry Code (`src/components/ui/`)**:
  - Components generated by `pnpm dlx shadcn add <component>` are treated as native library primitives.
  - Do not manually re-architect or refactor registry internals unless specifically integrating custom project behavior.
  - To prevent friction with the upstream shadcn CLI generator, `src/components/ui` is excluded from Biome formatting and linting in `biome.json`.
- **Button Pointer Cursor Standard**:
  - All interactive buttons and `[role="button"]` elements enforce `cursor: pointer` by default when enabled.
  - This is declared globally in `src/app/globals.css`:
    ```css
    button:not(:disabled), [role="button"]:not(:disabled) {
      cursor: pointer;
    }
    ```
- **Application-Level Consumption**:
  - Feature components and route views (`src/app/`, `src/features/`, etc.) import primitives directly via `@/components/ui/*`.
  - While `src/components/ui/` primitives remain in their native registry format, all consuming application code must strictly obey Biome linting, React 19 Compiler rules, domain glossaries (`GLOSSARY.md`), and semantic accessibility standards.

---

## 6. Biome Linting & Formatting Standards

Code quality and style formatting are unified under **Biome 2.4.2** (`biome.json`).

### Toolchain Configuration

- **Indentation**: 2 spaces (`indentStyle: "space"`, `indentWidth: 2`).
- **Imports**: Automatic organization on save (`source.organizeImports: "on"`).
- **CSS Parser**: Tailwind directives enabled (`tailwindDirectives: true`).
- **Domain Rules**: Recommended rules enabled for core JavaScript/TypeScript, Next.js, and React.

### Zero Lint Warnings Policy

- Pull requests must pass `pnpm run lint` (`biome check`) with **zero errors and zero warnings**.
- Treat all linter warnings as blocking errors in CI.
- **Suppression Discipline**:
  - `// biome-ignore <rule>: <reason>` is permitted only when an external API or fundamental framework constraint prevents standard adherence.
  - Every suppression must include a clear, documented rationale explaining why the rule cannot be satisfied.

---

## 7. Fowler Code Smells Baseline

The **Standards** axis incorporates Martin Fowler's 12 core code smells (*Refactoring*, Chapter 3). Reviewers must actively check diffs against these heuristics.

| Smell | Symptom in Diff | Corrective Refactoring |
| :--- | :--- | :--- |
| **1. Mysterious Name** | Variable, parameter, or function name that fails to reveal intent, role, or domain entity (e.g., `temp`, `data`, `handleInfo`, `doProcess`). Also includes violations of canonical domain terms from `GLOSSARY.md`. | Rename for clarity and intent. If an honest, revealing name cannot be found, the underlying design is unclear and requires decomposition. |
| **2. Duplicated Code** | Similar or identical algorithms, conditional branches, or JSX structures across multiple hunks or files. | Extract shared helper function, custom React hook, or modular UI component. |
| **3. Feature Envy** | A function or method in module A repeatedly reaches into the internals, fields, or helpers of module B instead of working on its own scope. | Move the logic or method into module B where the data naturally resides. |
| **4. Data Clumps** | The same cluster of 3+ primitive parameters (e.g., `id`, `workspaceId`, `updatedAt`) repeatedly passed together across functions or components. | Introduce a cohesive TypeScript `interface` or domain object to encapsulate the bundle. |
| **5. Primitive Obsession** | Raw primitives (`string`, `number`, `boolean`) representing domain entities that possess validation constraints or meaning (e.g., plain string for `NoteId` or unvalidated slug). | Introduce branded types, typed unions, or domain value objects to enforce invariants. |
| **6. Repeated Switches** | Identical `switch` or `if/else` ladders branching on the same discriminator (e.g., `status === 'draft'`, `type === 'text'`) repeated in multiple files. | Replace with a shared record/map lookup table or polymorphic object handlers. |
| **7. Shotgun Surgery** | A single conceptual feature change forces small, tedious modifications scattered across dozens of disconnected files. | Reorganize code around feature verticals (colocating schemas, hooks, components, and actions together). |
| **8. Divergent Change** | A single file or module is modified for completely unrelated reasons (e.g., modifying `NoteCard.tsx` for layout, analytics tracking, and database schemas). | Split the module into cohesive units following the Single Responsibility Principle. |
| **9. Speculative Generality** | Abstract wrapper functions, generic type parameters, or configuration toggles added for theoretical future use cases not demanded by current specifications. | Delete speculative code. Keep implementations minimal and concrete (YAGNI). |
| **10. Message Chains** | Long method or property navigations (e.g., `note.workspace.owner.profile.displayName`). | Apply the Law of Demeter. Delegate the query to the root object (e.g., `note.getAuthorName()`). |
| **11. Middle Man** | A function or component that does nothing other than immediately delegate to another function without adding behavior, transformation, or context. | Eliminate the middleman and call the underlying target component or function directly. |
| **12. Refused Bequest** | A component or class that implements an interface or inherits behavior but stubs out, ignores, or throws on most inherited properties or methods. | Replace inheritance/oversized contracts with lightweight composition and focused, specialized interfaces. |

---

## 8. Path Portability Standard

To guarantee seamless cross-platform development (Windows, Linux, macOS) and deterministic CI/CD execution:

- **Zero Absolute Local Machine Paths**:
  - Never commit hardcoded host paths (e.g., containing `C:\Users\...`, `/home/...`, `/Users/...`).
  - Never generate diagnostics, tests, or documentation containing local environment paths.
- **Repository-Relative Paths Only**:
  - Reference files using repo-relative paths (e.g., `src/app/page.tsx`, `public/next.svg`).
  - Use `@/*` TypeScript import paths for internal source dependencies.
- **Environment Agnosticism**:
  - Always normalize path separators (`/` vs `\`) when authoring scripts or file system utilities.
  - Rely on Node's `path` module (`path.join`, `path.resolve`) in tooling and build scripts.
