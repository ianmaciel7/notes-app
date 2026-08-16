---
type: "query"
date: "2026-08-15T21:46:08.431637+00:00"
question: "Qual e o contrato visual medido do painel contextual do Capacities em 1128x912?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/components/workspace-shell.tsx", "src/app/globals.css", ".agents/rules/capacities-context-panel-parity.md"]
---

# Q: Qual e o contrato visual medido do painel contextual do Capacities em 1128x912?

## Answer

Com a barra lateral de 288px e trilho superior de 46px, use track contextual de 378px: o card visivel fica em x=750, y=46, 368x856 e o card principal em x=298, y=46, 442x856. Preserve a margem externa de 10px, o estado vazio centralizado e scrollWidth igual a clientWidth.

## Outcome

- Signal: useful

## Source Nodes

- src/components/workspace-shell.tsx
- src/app/globals.css
- .agents/rules/capacities-context-panel-parity.md