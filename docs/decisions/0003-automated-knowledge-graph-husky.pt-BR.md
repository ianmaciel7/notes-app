# ADR-0003: Atualizações Automatizadas do Grafo de Conhecimento via Husky

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 11/09/2026

## Contexto e Declaração do Problema

O repositório depende do `graphify` (`graphify-out/graph.json`) para manter um grafo de conhecimento estrutural de AST. Atualizações manuais por desenvolvedores levam a dados desatualizados no grafo com o passar do tempo.

## Direcionadores da Decisão

* Manter `graphify-out/graph.json` continuamente sincronizado após modificações de código.
* Custo zero de tokens (atualização estritamente via AST).
* Workflows de git hooks não bloqueantes.

## Opções Consideradas

1. **Git hooks via Husky v9** (`post-commit`, `post-merge`, `pre-commit`, `pre-push`)
2. Execução manual de `graphify update .` pelos desenvolvedores
3. Reconstrução do grafo exclusivamente via CI

## Resultado da Decisão

Opção escolhida: **Git hooks via Husky v9** porque `post-commit` e `post-merge` executam automaticamente `graphify update .` para atualizar o grafo AST localmente, enquanto `pre-commit` executa checagens do Biome nos arquivos organizados (*staged*) e `pre-push` executa a verificação de tipos TypeScript.

### Consequências Positivas

* O grafo de conhecimento está sempre atualizado após commits e pulls dos desenvolvedores.
* Erros de qualidade de código são capturados antes do envio de código para branches remotas.

### Consequências Negativas

* Commits levam de 1 a 2 segundos adicionais para a extração de AST.
