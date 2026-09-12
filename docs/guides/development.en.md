# Local Development & Workflow Guide

This guide covers recurring tasks for developers working on `notes-app`.

---

## 1. Prerequisites & Installation

* **Node.js**: v20 or higher
* **Package Manager**: `pnpm` (version 9+)

Install dependencies:

```bash
pnpm install
```

---

## 2. Running the Development Server

Start Next.js in development mode with Turbopack:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Code Quality & Verification

We use **Biome** for fast, unified linting and formatting, along with TypeScript typechecking.

Run code quality check:

```bash
pnpm check
```

Automatically apply formatting and safe lint fixes:

```bash
pnpm check:fix
```

Build verification (runs production build):

```bash
pnpm build
```

---

## 4. Knowledge Graph (`graphify`)

The project uses `graphify` to maintain AST structure and cross-file relationships:

* Query the graph: `graphify query "<question>"`
* View shortest path: `graphify path "<A>" "<B>"`
* Update graph after edits: `graphify update .`

---

## 5. Working with AI Agents

When interacting with AI coding assistants in this codebase:

* Refer to [`AGENTS.md`](../../AGENTS.md) for primary instructions.
* Ensure all system path rules follow [.agents/rules/portable-paths.md](../../.agents/rules/portable-paths.md).
