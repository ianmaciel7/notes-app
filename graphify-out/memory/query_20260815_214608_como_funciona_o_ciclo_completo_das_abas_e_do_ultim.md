---
type: "query"
date: "2026-08-15T21:46:08.634392+00:00"
question: "Como funciona o ciclo completo das abas e do ultimo painel contextual?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/components/workspace-shell.tsx", "__tests__/workspace-shell.test.tsx", ".agents/rules/capacities-context-panel-parity.md"]
---

# Q: Como funciona o ciclo completo das abas e do ultimo painel contextual?

## Answer

Nova aba substitui o conjunto atual por Explorar e abre a busca global focada. Explorar e neutro e revela fechar somente em hover ou foco. Uma aba usa largura intrinseca; varias compartilham a faixa. Fechar a ultima aba remove o painel, expande o workspace e mostra o calendario mensal; reabrir restaura exatamente a ultima aba fechada. O menu adjacente oferece Chat de IA e Buscar.

## Outcome

- Signal: useful

## Source Nodes

- src/components/workspace-shell.tsx
- __tests__/workspace-shell.test.tsx
- .agents/rules/capacities-context-panel-parity.md