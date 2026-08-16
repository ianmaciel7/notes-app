---
type: "query"
date: "2026-08-15T22:00:48.487511+00:00"
question: "Como as abas do painel de contexto do Capacities se comportam?"
contributor: "graphify"
outcome: "corrected"
correction: "Corrige a hipótese anterior de largura intrínseca, Explorar neutro e substituição de todo o conjunto de abas."
source_nodes: ["src_components_workspace_shell", "tests_workspace_shell_test"]
---

# Q: Como as abas do painel de contexto do Capacities se comportam?

## Answer

Uma aba ocupa todo o trilho; múltiplas abas dividem o espaço igualmente. Explorar usa o mesmo estado selecionado das demais. Nova aba preserva as abas existentes e adiciona ou ativa um único Explorar; escolher uma ação substitui somente o placeholder Explorar. Abas inativas são transparentes e revelam fechar no hover ou foco.

## Outcome

- Signal: corrected
- Correction: Corrige a hipótese anterior de largura intrínseca, Explorar neutro e substituição de todo o conjunto de abas.

## Source Nodes

- src_components_workspace_shell
- tests_workspace_shell_test