# Next.js + TypeScript + shadcn + Biome Bootstrap Guide

## 1) Bootstrap in a dedicated folder (recommended)

From `C:\Users\BobBytes\Personal\notes-app` (or any workspace path):

```powershell
cd C:\Users\BobBytes\Personal\notes-app
pnpm create next-app@latest web --ts --app --eslint --tailwind --src-dir --use-pnpm --no-git --yes
cd web
pnpm dlx shadcn@latest init --template next --yes
pnpm dlx @biomejs/biome@latest init
```

## 2) Bootstrap in the project root (when no conflicting files)

```powershell
cd C:\Users\BobBytes\Personal\notes-app
pnpm create next-app@latest . --ts --app --eslint --tailwind --src-dir --use-pnpm --no-git --yes
pnpm dlx shadcn@latest init --template next --yes
pnpm dlx @biomejs/biome@latest init
```

## 3) If `create-next-app` fails due to conflicts

If the directory is not empty, move blocking files to backup first:

```powershell
cd C:\Users\BobBytes\Personal\notes-app
$backup = "C:\Users\BobBytes\Personal\notes-app-bootstrap-backup"
New-Item -ItemType Directory -Path $backup | Out-Null

Move-Item -LiteralPath @(
  ".agents",
  "AGENTS.md",
  "CLAUDE.md",
  "CONTRIBUTING.md",
  "GEMINI.md",
  "openspec",
  "README.md",
  "SECURITY.md",
  "skills-lock.json"
) -Destination $backup -Force

pnpm create next-app@latest . --ts --app --eslint --tailwind --src-dir --use-pnpm --no-git --yes

Get-ChildItem -Force -LiteralPath $backup | Move-Item -Destination "." -Force
Remove-Item -Recurse -Force $backup
```

If you prefer not to restore docs after bootstrap, restore only required files later.

## 4) Tooling setup and rationale

- `ESLint`: required baseline from `create-next-app` for project lint compatibility.
- `Biome`: optional but recommended for fast formatter/linter workflows.

Initialize and align scripts:

```powershell
pnpm install
pnpm dlx @biomejs/biome@latest init
```

If you need explicit typecheck and Biome scripts, add:

```powershell
pnpm pkg set scripts.typecheck="tsc --noEmit"
pnpm pkg set scripts.format="biome format . --write"
pnpm pkg set scripts.lint="next lint && biome lint ."
```

## 5) Post-creation validation

```powershell
pnpm run lint
pnpm run typecheck
pnpm run format
```

If any command fails, share the error output and fix by rerunning the setup steps above.

