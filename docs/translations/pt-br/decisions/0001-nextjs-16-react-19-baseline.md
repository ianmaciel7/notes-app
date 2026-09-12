# ADR-0001: Baseline do App Router com Next.js 16 + React 19

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 2026-09-11

## Contexto e Declaração do Problema

O `notes-app` necessita de um framework web full-stack moderno, de alto desempenho e local-first, capaz de lidar com edição rica de notas, visualização de grafos, leitura de documentos e proxying de API no lado do servidor (gateways de IA, parsing).

## Direcionadores da Decisão

* Suporte a React 19 Server Components e navegação via App Router.
* Integração TypeScript de primeira classe e suporte a estilização com Tailwind CSS v4.
* Tempos de build rápidos e suporte ao Turbopack.

## Opções Consideradas

1. **Next.js 16 (App Router)** + React 19 + Tailwind CSS v4
2. Vite + React 19 SPA com backend Node.js separado
3. Next.js Pages Router (legado)

## Resultado da Decisão

Opção escolhida: **Next.js 16 (App Router)** porque fornece Route Handlers full-stack para gateways de IA/parsing, Server Components para renderização de alto desempenho e compatibilidade perfeita com Tailwind CSS v4.

### Consequências Positivas

* Separação clara entre componentes de cliente (banco de dados offline Dexie) e manipuladores de servidor.
* Geração de rotas de primeira classe e velocidade de build com Turbopack.

### Consequências Negativas

* Mudanças incompatíveis (breaking changes) no React 19 exigem validação cuidadosa de tipos em props de layout.
