# notes-app

Next.js application using React, TypeScript, Tailwind CSS, and shadcn/ui primitives.

## Getting started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
pnpm dev       # development server
pnpm build     # production build
pnpm start     # production server
pnpm lint      # Biome checks
pnpm format    # format files with Biome
```

## Project layout

- `src/app/`: routes, layout, global CSS, and favicon.
- `src/components/ui/`: shared UI primitives.
- `src/hooks/`: reusable hooks.
- `src/lib/`: shared utilities.
- `public/`: static assets.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the repository structure and configuration references.
