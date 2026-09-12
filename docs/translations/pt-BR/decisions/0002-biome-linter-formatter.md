# ADR-0002: Biome como Linter & Formatador Unificado

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 11/09/2026

## Contexto e Declaração do Problema

O template inicial do projeto incluía configurações de ESLint e Prettier, o que gerava execução mais lenta de linting e overhead de configurações duplicadas no repositório.

## Direcionadores da Decisão

* Velocidade de execução para loops de feedback de desenvolvedores e hooks de pre-commit do git.
* Ferramenta única substituindo ESLint, Prettier e ordenação de imports.
* Suporte nativo para TypeScript e diretivas do Tailwind CSS v4.

## Opções Consideradas

1. **Biome** (`@biomejs/biome`) 2.5
2. ESLint 9 + Prettier
3. Oxlint

## Resultado da Decisão

Opção escolhida: **Biome** (`@biomejs/biome`) porque ele roda em ~50ms em todo o workspace, oferece presets recomendados de linting prontos para uso e trata formatação e regras de parser CSS de forma limpa via `biome.json`.

### Consequências Positivas

* Execução ultra-rápida do comando `pnpm run check` (abaixo de 100ms).
* Zero fricção de configuração entre regras de linting e formatação.
* Arquivo de configuração único `biome.json`.

### Consequências Negativas

* Requer a desativação dos plugins padrão de ESLint em extensões de IDE.
