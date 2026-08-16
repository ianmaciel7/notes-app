---
type: "query"
date: "2026-08-15T21:48:04.809834+00:00"
question: "Quais estados do painel contextual precisam de teste de regressao?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src_components_workspace_shell", "tests_workspace_shell_test"]
---

# Q: Quais estados do painel contextual precisam de teste de regressao?

## Answer

Teste Explore neutro com fechar apenas no hover ou foco; aba unica com flex-none e largura intrinseca; Nova aba abrindo a busca focada; menu Chat de IA e Buscar; selecao substituindo Explore; fechar a ultima aba removendo o aside e exibindo o calendario mensal; reabrir restaurando a ultima aba; painel 368x856 sem overflow em 1128x912.

## Outcome

- Signal: useful

## Source Nodes

- src_components_workspace_shell
- tests_workspace_shell_test