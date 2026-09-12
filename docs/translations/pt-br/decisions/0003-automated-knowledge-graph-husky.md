# ADR-0003: Atualizações Automatizadas do Grafo de Conhecimento via Husky

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 2026-09-11

## Contexto e Declaração do Problema

O repositório depende do `graphify` (`graphify-out/graph.json`) para manter um grafo de conhecimento AST estrutural. Atualizações manuais por desenvolvedores levam a dados de grafo desatualizados com o tempo.

## Direcionadores de Decisão

* Manter o `graphify-out/graph.json` continuamente sincronizado após modificações no código.
* Custo zero de tokens (atualização apenas via AST).
* Fluxos de trabalho com git hooks não bloqueantes.

## Opções Consideradas

1. **Git hooks do Husky v9** (`post-commit`, `post-merge`, `pre-commit`, `pre-push`)
2. Execução manual de `graphify update .` pelo desenvolvedor
3. Reconstruções de grafo apenas no CI

## Resultado da Decisão

Opção escolhida: **Git hooks do Husky v9** porque `post-commit` e `post-merge` executam automaticamente o `graphify update .` para atualizar o grafo AST localmente, enquanto `pre-commit` executa checagens do Biome em arquivos staged e `pre-push` executa a verificação de tipos.

### Consequências Positivas

* O grafo de conhecimento está sempre atualizado após commits e pulls dos desenvolvedores.
* Erros de qualidade de código são capturados antes de enviar o código para branches remotas.

### Consequências Negativas

* Commits levam de 1 a 2 segundos adicionais para extração da AST.
