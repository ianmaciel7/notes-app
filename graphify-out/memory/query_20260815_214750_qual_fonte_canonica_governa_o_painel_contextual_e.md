---
type: "explain"
date: "2026-08-15T21:47:50.201475+00:00"
question: "Qual fonte canonica governa o painel contextual e como preservar sua paridade?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src_components_workspace_shell", "tests_workspace_shell_test"]
---

# Q: Qual fonte canonica governa o painel contextual e como preservar sua paridade?

## Answer

Comece em WorkspaceShell e nos testes do workspace. Preserve a grade medida de 378px em 1128x912, a largura intrinseca da aba unica, o hover e foco de Explorar, a paleta de Nova aba, o fechamento do ultimo painel com calendario auxiliar e a restauracao da ultima aba. A regra portatil esta em .agents/rules/capacities-context-panel-parity.md.

## Outcome

- Signal: useful

## Source Nodes

- src_components_workspace_shell
- tests_workspace_shell_test