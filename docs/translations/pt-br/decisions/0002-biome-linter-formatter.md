# ADR-0002: Biome como Linter & Formatador Unificado

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 2026-09-11

## Contexto e Declaração do Problema

O modelo inicial do projeto incluía configurações de ESLint e Prettier, o que introduzia uma execução de linting mais lenta e overhead de configurações duplicadas no repositório.

## Direcionadores da Decisão

* Velocidade de execução para loops de feedback dos desenvolvedores e hooks de pre-commit do git.
* Ferramenta única substituindo ESLint, Prettier e ordenação de imports.
* Suporte nativo para TypeScript e diretivas do Tailwind CSS v4.

## Opções Consideradas

1. **Biome** (`@biomejs/biome`) 2.5
2. ESLint 9 + Prettier
3. Oxlint

## Resultado da Decisão

Opção escolhida: **Biome** (`@biomejs/biome`) porque ele é executado em ~50ms em todo o workspace, fornece predefinições recomendadas de linting prontas para uso e trata a formatação e regras do parser CSS de forma limpa via `biome.json`.

### Consequências Positivas

* Execução ultra-rápida do `pnpm run check` (sub-100ms).
* Zero atrito de configuração entre regras de linting e formatação.
* Arquivo de configuração único `biome.json`.

### Consequências Negativas

* Requer a desativação de plugins padrão do ESLint em extensões de IDE.
