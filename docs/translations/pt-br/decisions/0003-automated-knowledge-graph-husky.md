# ADR-0003: Atualizações Automatizadas do Grafo de Conhecimento via Husky

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 2026-09-11

## Contexto e Declaração do Problema

O repositório depende do `graphify` (`graphify-out/graph.json`) para manter um grafo de conhecimento estrutural de AST. Atualizações manuais por desenvolvedores levariam a dados desatualizados no grafo com o passar do tempo.

## Direcionadores da Decisão

* Manter o `graphify-out/graph.json` continuamente sincronizado após modificações de código.
* Custo zero de tokens (atualização apenas de AST).
* Workflows de git hooks não bloqueantes.

## Opções Consideradas

1. **Husky v9 git hooks** (`post-commit`, `post-merge`, `pre-commit`, `pre-push`)
2. Execução manual do `graphify update .` pelos desenvolvedores
3. Reconstrução do grafo apenas em CI

## Resultado da Decisão

Opção escolhida: **Husky v9 git hooks** porque `post-commit` e `post-merge` executam automaticamente `graphify update .` para atualizar o grafo AST localmente, enquanto `pre-commit` executa checagens do Biome em arquivos staged e `pre-push` executa checagens de tipos (typechecking).

### Consequências Positivas

* O grafo de conhecimento permanece sempre atualizado após commits e pulls dos desenvolvedores.
* Erros de qualidade de código são capturados antes de enviar código para branches remotas.

### Consequências Negativas

* Commits levam de 1 a 2 segundos adicionais para a extração da AST.
