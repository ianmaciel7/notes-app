# ADR-0002: Biome como Linter e Formatador Unificado

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 2026-09-11

## Contexto e Declaração do Problema

O template inicial do projeto incluia configurações de ESLint e Prettier, o que introduzia uma execução de linting mais lenta e overhead de configurações duplicadas no repositório.

## Direcionadores de Decisão

* Velocidade de execução para loops de feedback de desenvolvedores e hooks de pre-commit do git.
* Ferramenta única substituindo ESLint, Prettier e ordenação de imports.
* Suporte nativo a diretivas do TypeScript e Tailwind CSS v4.

## Opções Consideradas

1. **Biome** (`@biomejs/biome`) 2.5
2. ESLint 9 + Prettier
3. Oxlint

## Resultado da Decisão

Opção escolhida: **Biome** (`@biomejs/biome`) porque ele executa em ~50ms em todo o workspace, oferece presets recomendados de linting prontos para uso e gerencia regras de formatação e parsers de CSS de forma limpa via `biome.json`.

### Consequências Positivas

* Execução ultra-rápida do comando `pnpm run check` (abaixo de 100ms).
* Zero fricção de configuração entre regras de linting e formatação.
* Arquivo de configuração único `biome.json`.

### Consequências Negativas

* Exige desabilitar extensões padrão do ESLint no IDE.
