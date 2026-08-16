---
type: "query"
date: "2026-08-15T21:45:06.501096+00:00"
question: "Como estilizar o grid responsivo do workspace Capacities sem workspace-shell.module.css?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/components/workspace-shell.tsx", "src/app/globals.css", "docs/DESIGN.md", ".agents/rules/workspace-tailwind-layout.md"]
---

# Q: Como estilizar o grid responsivo do workspace Capacities sem workspace-shell.module.css?

## Answer

Use Tailwind e shadcn como padrão. Mantenha tokens globais em globals.css. Quando grid-template-columns precisar de uma cascata ordenada em 1100px e 1250px, use um único utilitário global semântico com media queries explícitas; não empilhe variantes arbitrárias concorrentes. Valide a rota real, overflow, geometria e erros de console. Não execute next build no mesmo .next enquanto next dev serve a auditoria.

## Outcome

- Signal: useful

## Source Nodes

- src/components/workspace-shell.tsx
- src/app/globals.css
- docs/DESIGN.md
- .agents/rules/workspace-tailwind-layout.md